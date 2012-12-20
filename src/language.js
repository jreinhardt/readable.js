//language related utilities

var readable = (function(module) {
	/*
	Count syllables in a word.

	This function returns the approximate number of syllables in the given word.
	It uses the heuristic approach described in the article

		Talburt: "The Flesch Index: An Easily Programmable Readability Analysis
		Algorithm"
	*/
	module.countSyllables = function (word) {
		var n = word.length;
		if (n == 0) {
			return 0;
		} else if (n <= 3) {
			return 1;
		} else {
			word = word.toLowerCase();
			if (word[n - 1] === 'e' && word[n - 2] !== 'l') {
				word = word.substring(0, n - 1);
				n -= 1;
			} else if (word[n - 2] === 'e' && (word[n - 1] === 's' || word[n - 1] === 'd')) {
				word = word.substring(0, n - 2);
				n -= 2;
			}
			var s = 0;
			var v = false;
			var i;
			for (i = 0; i < n; i += 1) {
				if (word[i] == 'a' || word[i] == 'e' || word[i] == 'i' || word[i] == 'o' || word[i] == 'u' || word[i] == 'y') {
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
	}


	/*
	check word for suffix
	*/
	module.hasSuffix = function (word,suffix){
		return word.slice(word.length - suffix.length) == suffix;
	}


	/*
	check word for polysyllable

	Polysyllables are the words with more than 3 syllables, not counting
	common suffixes like -es, -ed, -ing, -ity.
	*/
	module.isPolysyllable = function (word) {
		var n_syl = module.countSyllables(word);
		//handle clear cases
		if(n_syl < 3){
			return false;
		} else if(n_syl > 3){
			return true;
		}
		//if word has 3 syllables, it might be simple of complex depending on the
		//suffix
		suffixes = new Array("es","ed","ing","ity");
		for (var i=0; i < suffixes.length;i++){
			if (module.hasSuffix(word,suffixes[i])){
				return false;
			}
		}
		return true;
	}
	return module;
}(readable || {}));
