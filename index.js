var config = require("soa-example-service-config").config();
var crypto = require('crypto');
var Q = require("q");
var request = require("request");

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
};

var get = function(url){
	return getInternal(false, null, null, null, url);
};

var getWithAccessToken = function(accessToken, url){
	return getInternal(true, null, null, accessToken, url);
};

var getWithEmailAddressAndPassword = function(emailAddress, password, url){
	return getInternal(true, emailAddress, password, null, url);
};

var getInternal = function(authEnabled, emailAddress, password, accessToken, url){
	var deferred = Q.defer();

	if ( authEnabled ){
		request.get(url, function(err, response, body){
			if ( err ){
				deferred.reject(err);
			}
			else{
				deferred.resolve(body);
			}
		}).auth(emailAddress, password, accessToken);
	}
	else{
		request.get(url, function(err, response, body){
			if ( err ){
				deferred.reject(err);
			}
			else{
				deferred.resolve(body);
			}
		});
	}

	return deferred.promise;
};

var postJson = function(objectToPost, url){
	return postJsonInternal(false, null, null, null, objectToPost, url);
};

var postJsonWithAccessToken = function(accessToken, objectToPost, url){
	return postJsonInternal(true, null, null, accessToken, objectToPost, url);
};

var postJsonWithEmailAddressAndPassword = function(emailAddress, password, objectToPost, url){
	return postJsonInternal(true, emailAddress, password, null, objectToPost, url);
};

var postJsonInternal = function(authEnabled, emailAddress, password, accessToken, objectToPost, url){
	var deferred = Q.defer();

	var jsonToPost = objectToJson(objectToPost);

	console.log(jsonToPost);

	var options = {
		uri: url,
		method: "POST",
		body: objectToPost,
		json: true
	};

	if ( authEnabled ){
		request(options, function(error, response, body){

			if ( error ){
				deferred.reject(error.toString());
				return;
			}

			deferred.resolve(body);

		}).auth(emailAddress, password, accessToken);
	}
	else{
		request(options, function(error, response, body){

			if ( error ){
				deferred.reject(error.toString());
				return;
			}

			deferred.resolve(body);

		});
	}
	

	return deferred.promise;
};

var objectToJson = function(object){
	return JSON.stringify(object);
};

module.exports = {
	createBaseUrl : createBaseUrl,
	hashPassword: hashPassword,
	encryptString: encryptString,
	decryptString: decryptString,
	postJson: postJson,
	postJsonWithAccessToken: postJsonWithAccessToken,
	postJsonWithEmailAddressAndPassword: postJsonWithEmailAddressAndPassword,
	get: get,
	getWithAccessToken: getWithAccessToken,
	getWithEmailAddressAndPassword: getWithEmailAddressAndPassword
}