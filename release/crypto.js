'use strict';
const {crypto, fs} = require('./deps');
const cwd = process.cwd();
module.exports = {
	crypto: async function(vals, handle, tempKey) {
		const { reuseToken, tokenPassword, token, storeToken, newTokenPass} = vals;
		const io = 'hex';
		const algm = 'ChaCha20';
		if (handle) {
			if (reuseToken && tempKey) {
				let localToken = tempKey;
				if (localToken.slice(0,3) !== 'iv:') throw 'encrypted credentials corrupt, please create new';
				const iv = localToken.slice(3,19);
				localToken = localToken.slice(19);
				const key = crypto.scryptSync(tokenPassword,cwd.slice(-12,cwd.length),32);
				const decipher = crypto.createDecipheriv(algm,key,iv);
				vals.token=decipher.update(localToken,io,io);
				vals.token += decipher.final(io);
			} else if (storeToken) {
				let localToken = token;
				let pass = newTokenPass;
				if (token.length < 8) throw 'invalid token';
				const iv = crypto.randomBytes(16);
				const key = crypto.scryptSync(pass,cwd.slice(-12,cwd.length),32);
				const cipher = crypto.createCipheriv(algm,key,iv);
				let encToken = cipher.update(localToken,io,io) + cipher.final(io);
				encToken = 'iv:' + iv.toString('hex') + encToken;
				fs.ftruncateSync(handle);
				fs.writeSync(handle,encToken,0);
			}
		}
	},
};
