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
				if (localToken.slice(0,3) !== 'iv:') throw 'encrypted credentials corrupt, please create new';
				const iv = localToken.slice(3,15);
				const authTag = localToken.slice(15,31);
				localToken = localToken.slice(31);
				const algm = 'ChaCha20-Poly1305';
				const key = crypto.scryptSync(tokenPassword,cwd.slice(-12,cwd.length),32);
				const decipher = crypto.createDecipheriv(algm,key,iv,{
					authTagLength: 16,
				});
				decipher.setAuthTag(authTag);
				vals.token=decipher.update(localToken,io.o,io.i) + decipher.final(io.i);
			} else if (storeToken) {
				let localToken = token;
				let pass = newTokenPass;
				if (token.length < 8) throw 'invalid token';
				const iv = crypto.randomBytes(12);
				const algm = 'ChaCha20-Poly1305';
				const key = crypto.scryptSync(pass,cwd.slice(-12,cwd.length),32);
				const cipher = crypto.createCipheriv(algm,key,iv,{
					authTagLength: 16,
				});
				let encToken = cipher.update(localToken,io.i,io.o) + cipher.final(io.o);
				encToken = 'iv:' + iv.toString('hex') + cipher.getAuthTag().toString('hex');
				fs.ftruncateSync(handle);
				fs.writeSync(handle,encToken);
			}
		}
	},
};
