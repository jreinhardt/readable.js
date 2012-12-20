'use strict';
//language related utilities

var readable = (function(module) {
	/*
	check word for suffix
	*/
	module.hasSuffix = function (word,suffix){
		return word.slice(word.length - suffix.length) === suffix;
	};


	/*
	Count syllables in a word.

	This function returns the approximate number of syllables in the given word.
	It uses the heuristic approach described in the article

		Talburt: "The Flesch Index: An Easily Programmable Readability Analysis
		Algorithm"
	*/
	module.countSyllables = function (word) {
		var n = word.length;
		if (n === 0) {
			return 0;
		} else if (n <= 3) {
			return 1;
		} else {
			word = word.toLowerCase();
			if (word[n - 1] === 'e' && word[n - 2] !== 'l') {
				word = word.substring(0, n - 1);
				n -= 1;
			} else if(module.hasSuffix(word,'el') || module.hasSuffix(word,'ed')){
				word = word.substring(0, n - 2);
				n -= 2;
			}
			var s = 0;
			var v = false;
			var i;
			var vowels = 'aeiouy';
			for (i = 0; i < n; i += 1) {
				if (vowels.indexOf(word[i]) >= 0) {
					if (!v) {
						s += 1;
					}
					v = true;
				} else {
					v = false;
				}
			}
			return s;
		}
	};


	/*
	check word for polysyllable

	Polysyllables are the words with more than 3 syllables, not counting
	common suffixes like -es, -ed, -ing, -ity.
	*/
	module.isPolysyllable = function (word) {
		var numSyl = module.countSyllables(word);
		//handle clear cases
		if(numSyl < 3){
			return false;
		} else if(numSyl > 3){
			return true;
		}
		//if word has 3 syllables, it might be simple of complex depending on
		//the suffix
		var suffixes = new Array('es','ed','ing','ity');
		for (var i=0; i < suffixes.length;i++){
			if (module.hasSuffix(word,suffixes[i])){
				return false;
			}
		}
		return true;
	};

	return module;

}(readable || {}));
