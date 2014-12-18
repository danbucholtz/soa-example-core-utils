var config = require("soa-example-service-config").config();
var crypto = require('crypto');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 't0k3|\|$br0';

var createBaseUrl = function(host, port){
	return config.protocol + "://" + host + ":" + port;
};

var hashPassword = function(password, salt){
	return crypto.createHash("sha256").update(password).update(salt).digest("hex");
};

var encryptString = function(input){
	var cipher = crypto.createCipher(algorithm, key);
	var output = cipher.update(input, 'utf8', 'hex') + cipher.final('hex');
	return output;
};

var decryptString = function(input){
	var decipher = crypto.createDecipher(algorithm, key);
	var output = decipher.update(input, 'hex', 'utf8') + decipher.final('utf8');
	return output;
}

module.exports = {
	createBaseUrl : createBaseUrl,
	hashPassword: hashPassword,
	encryptString: encryptString,
	decryptString: decryptString
}