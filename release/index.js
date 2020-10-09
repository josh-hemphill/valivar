'use strict';
const {fs,path,standardVersion, sv:{ coerce, gt }, utils:{execChain}} = require('./deps');
const coerceVersion = () => {return coerce(JSON.parse(fs.readFileSync(path.resolve('package.json')).toString()).version)};
const dry_run_args = ['--dry-run','-d'];
const isDryRun = process.argv.some((x) => dry_run_args.includes(x));
let version = '';

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
	console.log(version);
}).then(
	standardVersion({
		noVerify: true,
		dryRun: isDryRun,
		infile: 'CHANGELOG.md',
	}),
).then(
	execChain([`git push --follow-tags origin latest`]),
).then(() => {
	const newVersion = coerceVersion();
	console.log(newVersion);
	if (gt(newVersion, version) && !isDryRun) {
		version = 'v' + newVersion;
		return execChain([`gh release create ${version} -F CHANGELOG.md -t ${version}`]);
	}
}).then(
	isDryRun ? execChain([`git push --follow-tags origin latest`]) : true,
).catch((err) => {
	console.error(`standard-version or other build step failed with message: ${err.message}`);
});
			
