var crypto = require('crypto');

let getDigestHash = (str) => crypto.createHash('sha256').update(str).digest('hex');

exports.cryptPassword = (password) => getDigestHash(password);

exports.generateToken = (email, password) => {
    let tokenKey = email + password /*+ new Date().getTime()*/;
    return getDigestHash(tokenKey);
}
