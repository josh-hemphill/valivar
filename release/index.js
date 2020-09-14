'use strict';
const {os,fs,inquirer,exec,conventionalGithubReleaser,tmp,SSHConfig} = require('./deps');
const {fail,execChain,toPosix} = require('./utils');
const config = require('./config');
const crypto = require('./crypto').crypto;

config.shell = fs.statSync(config.defaultShell).isFile() ? config.defaultShell : '/bin/bash';
const dry_run_args = ['--dry-run','-d'];
const isDryRun = process.argv.some((x) => dry_run_args.includes(x));
config.sshConfig = toPosix(config.sshConfig);
config.deployStorage = os.tmpdir()+config.deployStorage;
const state = {
	auth: {
		token: '',
		url: config.githubApiUrl,
	},
};
const deployStorageStats = fs.statSync(config.deployStorage);
if(!deployStorageStats.isFile()) {
	fs.writeFileSync(config.deployStorage,'',{mode:0o600});
}
const tempTokenFileDesc = fs.openSync(config.deployStorage,'r+',0o600);
let tempkey = Buffer.alloc(deployStorageStats.size);
fs.readSync(tempTokenFileDesc, tempkey);
tempkey = tempkey.toString();

inquirer
	.prompt([{
		type:'confirm',
		name: 'reuseToken',
		message: 'Token Detected. Would you like to decrypt the stored token and use that?\n',
		when: () => !!tempkey.length,
		default: true,
	},{
		type:'password',
		name: 'tokenPassword',
		message: 'Please enter the password to decrypt your token\n',
		mask: '*',
		when: (vals) => vals.reuseToken,
		validate: (val) => /[\t\n \r]+/.test(val) || 'No whitespace in passwords',
	},{
		type:'password',
		name: 'token',
		message: 'Please enter an access token:\n',
		mask: '*',
		when: (vals)=>!vals.reuseToken,
		validate: (val) => /^[a-f0-9]{10,256}$/i.test(val) || 'Tokens must be hexadecimal',
	},{
		type:'confirm',
		name: 'storeToken',
		message: 'Would you like to encrypt your token for reuse?\n',
		when: (vals)=>!vals.reuseToken,
		default: true,
	},{
		type:'password',
		name: 'newTokenPass',
		message: 'Please enter a password for encrypting your token:\n',
		mask: '*',
		when: (vals)=>!vals.reuseToken && vals.storeToken,
		validate: (val) => /[\t\n \r]+/.test(val) || 'No whitespace in passwords',
	},{
		type:'input',
		name: 'sshConfigFile',
		message: 'Override SSH Config Location?\n',
		default: config.sshConfig,
	},
	])
	.then(async(answers) => {
		const sshHosts = config.SSH_HostNames;
		const shell = config.shell;
		const auth = state.auth;
		await crypto(answers,tempTokenFileDesc, tempkey).catch((x) => {throw x});
		fs.close(tempTokenFileDesc);
		const {token,sshConfigFile} = answers;
		if (token) {
			auth.token = token;
			const sshConfig = SSHConfig.parse(fs.readFileSync(sshConfigFile,{encoding:'utf-8'}));
			let keyConfig = sshConfig.find(({param, host, config}) => ['host','Host'].includes(param) && 
				(sshHosts.includes(host) || config.some(
					({param, value}) => param === 'HostName' && sshHosts.includes(value))))?.config?.reduce(
				(r, {param, value}) => {
					if (param === 'IdentityFile') r = value;
					return r;
				},
			);
			if (!keyConfig) {
				throw Error('No SSH Key detected');
			}
			keyConfig = toPosix(keyConfig);
			const {password} = await inquirer.prompt([{
				type:'password',
				name: 'password',
				message: `Please enter the password for your ssh key@${keyConfig}:`,
				mask: '*',
			}]);

			const { stdout: key } = await exec(`openssl rsa -in ${keyConfig} -passin env:TMP_PW`,{shell,env:{TMP_PW:password}});
			
			const tmpobj = tmp.fileSync({ mode: 0o600, postfix: '.pem' });
			fs.writeFileSync(tmpobj.name,key);

			await execChain([
				'rm -rf dist',
				'npm run build',
				'git checkout latest',
				`GIT_SSH_COMMAND='ssh -i ${toPosix(tmpobj.name,true)} -o IdentitiesOnly=yes' git pull origin latest`,
				'npm i',
				'npm run validate',
				'git add .',
				isDryRun ? 'echo "Skipping Version Bump: DRY RUN"' : 'standard-version -a',
				`GIT_SSH_COMMAND='ssh -i ${toPosix(tmpobj.name,true)} -o IdentitiesOnly=yes' git push --follow-tags origin latest`,
			]);
			fs.writeFileSync(tmpobj.name,'');
			tmpobj.removeCallback();
			if (isDryRun) {
				await conventionalGithubReleaser(auth, {
					preset: 'angular',
				});
			}
		} else {
			fail('No token provided');
		}
	})
	.catch((error) => {
		if(error.isTtyError) {
			process.exit(1);
		} else {
			fail(error);
		}
	});
