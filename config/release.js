const path = require('path');
const os = require('os');
const fs = require('fs');
const config = {
	shell: fs.statSync('C:\\Program Files\\Git\\bin\\bash.exe').isFile() ? 
		'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash',
	githubApiUrl: 'https://api.github.com',
	SSH_HostNames: ['github','github.com'],
	sshConfig: '~/.ssh/config',
};
const inquirer = require('inquirer');
const util = require('util');
const rawExec = require('child_process').exec;
const exec = util.promisify(rawExec);
const conventionalGithubReleaser = util.promisify(require('conventional-github-releaser'));
const tmp = require('tmp');
const SSHConfig = require('ssh-config');

function toPosix(str, base = false) {
	return path.posix.join(
		...(base ? [] : os.homedir().split(/\/|\\+/g)),
		...str.replace(/(%d\/)|(~\/)|(^\/)/i,'').split(/\/|\\+/g));
}
config.sshConfig = toPosix(config.sshConfig);

const state = {
	auth: {
		token: '',
		url: config.githubApiUrl,
	},
};
const fail = (msg) => {
	console.log(msg);
	process.exit(1);
};
const handleExec = (x, rt = false) => {
	const { stdout, stderr, error } = x;
	if (error) {
		console.log(stderr);
		fail(error);
	} else if (rt) {
		return {stdout, stderr};
	} else {
		console.log(stderr);
		console.log(stdout);
	}
};
const execChain = async function(arr) {
	async function* execs() {
		let i = 0;
		while (i < arr.length) {
			yield exec(arr[i],{shell:config.shell});
			i++;
		}
	}
	for await (let cmd of execs()) {
		handleExec(cmd);
	}
};
inquirer
	.prompt([
		{
			type:'password',
			name: 'token',
			message: 'Please enter an access token:',
			mask: '*',
			validate: (val) => /^[a-f0-9]{10,256}$/i.test(val) || 'Tokens must be hexadecimal',
		},
		{
			type:'input',
			name: 'sshConfigFile',
			message: 'Override SSH Config Location?',
			default: config.sshConfig,
		},
	])
	.then(async(answers) => {
		const sshHosts = config.SSH_HostNames;
		const shell = config.shell;
		const auth = state.auth;
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
						}
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
				'npm run build',
				'git checkout latest',
				`GIT_SSH_COMMAND='ssh -i ${toPosix(tmpobj.name,true)} -o IdentitiesOnly=yes' git pull origin latest`,
				'npm i',
				'npm run validate',
				'git add .',
				'standard-version -a',
				`GIT_SSH_COMMAND='ssh -i ${toPosix(tmpobj.name,true)} -o IdentitiesOnly=yes'git push --follow-tags origin latest`,
			]);
			fs.writeFileSync(tmpobj.name,'');
			tmpobj.removeCallback();
			await conventionalGithubReleaser(auth, {
				preset: 'angular',
			});
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
