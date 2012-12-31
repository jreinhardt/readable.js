'use strict';
// Base64 encoding and decoding of byte arrays

var readable = (function(module){
	var base64 =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	module.base64encode = function(bytes){
		var numBytes = bytes.length;

		function encodeTriplet(triplet){
			var quad = new Array(4);
			for( var j = 3; j >= 0; j--){
				quad[j] = base64[triplet & 63];
				triplet = triplet >> 6;
			}
			return quad[0] + quad[1] + quad[2] + quad[3];
		}

		var res = '';
		for(var i = 0; i < Math.floor(numBytes / 3); i++){
			res += encodeTriplet(
				(bytes[3*i + 0] << 16) +
				(bytes[3*i + 1] << 8) +
				(bytes[3*i + 2])
			);
		}
		if(numBytes % 3 === 2){
			res += encodeTriplet(
				(bytes[3*i + 0] << 16) +
				(bytes[3*i + 1] << 8)
			).slice(0,3);
			res += '=';
		} else if(numBytes % 3 === 1){
			res += encodeTriplet(
				(bytes[3*i + 0] << 16)
			).slice(0,2);
			res += '==';
		}
		return res;
	};

	module.base64decode = function(string){
		if (string.length % 4 !== 0){
			throw new Error('Invalid input string');
		}
		function decodeQuad(quad){
			var triplet = 0;
			for ( var j = 0; j < 4; j++){
				triplet = triplet << 6;
				if(quad[j] !== '='){
					triplet = triplet | base64.indexOf(quad[j]);
				}
			}
			return triplet;
		}
		var pad = 0;
		if(string.slice(-2) === '=='){
			pad = 2;
		} else if (string.slice(-1) === '='){
			pad = 1;
		}
		var numBytes = string.length/ 4 * 3 - pad;

		var res = new Array(numBytes);
		var i,triplet;
		for(i = 0; i < Math.floor(numBytes / 3); i++){
			triplet = decodeQuad(string.slice(4*i,4*i+4));
			res[3*i + 0] = (triplet >> 16) & 255;
			res[3*i + 1] = (triplet >>  8) & 255;
			res[3*i + 2] = (triplet >>  0) & 255;
		}
		if(pad === 2){
			triplet = decodeQuad(string.slice(4*i,4*i+4));
			res[3*i + 0] = (triplet >> 16) & 255;
		} else if (pad === 1){
			triplet = decodeQuad(string.slice(4*i,4*i+4));
			res[3*i + 0] = (triplet >> 16) & 255;
			res[3*i + 1] = (triplet >>  8) & 255;
		}

		return res;
	};

	return module;
}(readable || {}));
