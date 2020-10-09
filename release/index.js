'use strict';
const {fs,path,standardVersion, sv:{ coerce, gt }, utils:{execChain}} = require('./deps');
const coerceVersion = () => {return coerce(JSON.parse(fs.readFileSync(path.resolve('package.json')).toString()).version)};
const dry_run_args = ['--dry-run','-d'];
const isDryRun = process.argv.some((x) => dry_run_args.includes(x));
let version = '';
const CHANGELOG = path.resolve('CHANGELOG.md');
execChain([
	'rm -rf dist',
	'npm run build',
	'git checkout latest',
	`git pull origin latest`,
	'npm i',
	'npm run validate',
	'git add .',
]).then(async()=>{
	version = coerceVersion();
}).then(async()=>{
	await standardVersion({
		noVerify: true,
		dryRun: isDryRun,
		infile: CHANGELOG,
	});
},
).then(async()=>{
	await execChain([`git push --follow-tags origin latest`]);
}).then(() => {
	const newVersion = coerceVersion();
	if (gt(newVersion, version) && !isDryRun) {
		version = 'v' + newVersion;
		return execChain([`gh release create ${version} -F ${CHANGELOG} -t ${version}`]);
	}
}).then(
	isDryRun ? execChain([`git push --follow-tags origin latest`]) : true,
).catch((err) => {
	console.error(`standard-version or other build step failed with message: ${err.message}`);
});
			
