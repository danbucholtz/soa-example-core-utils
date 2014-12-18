var config = require("soa-example-service-config").config();

var crypto = require('crypto');

var createBaseUrl = function(host, port){
	return config.protocol + "://" + host + ":" + port;
};

var hashPassword = function(password, salt){
	return crypto.createHash("sha256").update(password).update(salt).digest("hex");
};

module.exports = {
	createBaseUrl : createBaseUrl
}