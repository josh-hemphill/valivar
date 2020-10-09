'use strict';
const rawExec = require('child_process').exec;
const util = require('util');
const exec = util.promisify(rawExec);
const path = require('path');
const os = require('os');
const fail = (msg) => {
	console.log(msg);
	process.exit(1);
};
const handleExec = async(x, rt = false) => {
	const { stdout, stderr, error } = await x;
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
const execChain = async function(arr,shell) {
	async function* execs() {
		let i = 0;
		while (i < arr.length) {
			yield exec(arr[i],{shell});
			i++;
		}
	}
	for await (let cmd of execs()) {
		await handleExec(cmd);
	}
};
function toPosix(str, base = false) {
	return path.posix.join(
		...(base ? [] : os.homedir().split(/\/|\\+/g)),
		...str.replace(/(%d\/)|(~\/)|(^\/)/i,'').split(/\/|\\+/g));
}

module.exports = {
	fail,
	handleExec,
	execChain,
	toPosix,
};
