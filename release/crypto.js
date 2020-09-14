'use strict';
const {crypto, fs} = require('./deps');
const cwd = process.cwd();
module.exports = {
	crypto: async function(vals, handle, tempKey) {
		const { reuseToken, tokenPassword, token, storeToken, newTokenPass} = vals;
		const io = {i:'utf8', o:'hex'};
		if (handle) {
			if (reuseToken && tempKey) {
				let localToken = tempKey;
				if (localToken.slice(0,2) !== 'iv:') throw 'encrypted credentials corrupt, please create new';
				const iv = localToken.slice(3,16);
				localToken = localToken.slice(17);
				const algm = 'ChaCha20-Poly1305';
				const key = crypto.scrypt(tokenPassword,cwd.slice(-12,cwd.length),32);
				const decipher = crypto.createDecipheriv(algm,key,iv);
				vals.token=decipher.update(localToken,io.o,io.i) + decipher.final(io.i);
			} else if (storeToken) {
				let localToken = token;
				let pass = newTokenPass;
				if (token.length < 8) throw 'invalid token';
				const iv = crypto.randomBytes(12);
				const algm = 'ChaCha20-Poly1305';
				const key = crypto.scrypt(pass,cwd.slice(-12,cwd.length),32);
				const cipher = crypto.createCipheriv(algm,key,iv);
				const encToken = 'iv:' + iv.toString('hex') + cipher.update(localToken,io.i,io.o) + cipher.final(io.o);
				fs.ftruncateSync(handle);
				fs.writeSync(handle,encToken);
			}
		}
	},
};
