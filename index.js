var createBaseUrl = function(protocol, host, port){
	return protocol + "://" + host + ":" + port;
};

module.exports = {
	createBaseUrl : createBaseUrl
}