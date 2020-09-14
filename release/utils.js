'use strict';
const { exec, os, path } = require('./deps');
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
const execChain = async function(arr,shell) {
	async function* execs() {
		let i = 0;
		while (i < arr.length) {
			yield exec(arr[i],{shell});
			i++;
		}
	}
	for await (let cmd of execs()) {
		handleExec(cmd);
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
