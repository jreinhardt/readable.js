/*
Count syllables in a word.

This function returns the approximate number of syllables in the given word.
It uses the heuristic approach described in the article

	Talburt: "The Flesch Index: An Easily Programmable Readability Analysis
	Algorithm"
*/
function countSyllables(word) {
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
function hasSuffix(word,suffix){
	return word.slice(word.length - suffix.length) == suffix;
}


/*
check word for polysyllable

Polysyllables are the words with more than 3 syllables, not counting
common suffixes like -es, -ed, -ing, -ity.
*/
function isPolysyllable(word) {
	var n_syl = countSyllables(word);
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
		if (hasSuffix(word,suffixes[i])){
			return false;
		}
	}
	return true;
}


/*
Factory for Text objects
*/
function Text(text){
	var members = {};

	function memoize(key,calculator) {
		if(members[key] == undefined){
			members[key] = calculator();
		}
		return members[key];
	};

	var obj = {
		getText: function(){return text;},
		getSentences: function(){return memoize("sentences",splitIntoSentences);},
		getWords: function(){return memoize("words",splitIntoWords);},
		getNumLetters: function(){return memoize("numLetters",countLetters);},
		getNumSyllables: function(){return memoize("numSyllables",countTextSyllables);},
		getNumWords: function(){return memoize("numWords",countWords);},
		getNumPolysyllables: function(){return memoize("numPolysyllables",countPolysyllables);},
		getNumSentences: function(){return memoize("numSentences",countSentences);},

		/*
		Compute the Flesch readability index.

		Returns the Flesch readability index, a number (usually) between 0
		and 100, where larger numbers indicate easier text

		https://en.wikipedia.org/wiki/Flesch-Kincaid_Readability_Test
		*/
		getFleschKincaidIndex: function() {
			var wps = this.getNumWords() / this.getNumSentences();
			var spw = this.getNumSyllables() / this.getNumWords();
			return 206.835 - 1.015 * wps - 84.6 * spw;
		},

		/*
		Compute the Coleman-Liau readability index.

		This functions returns the Coleman-Liau readability index indicating
		the number of years of education necessary to understand the text.

		https://en.wikipedia.org/wiki/Coleman-Liau_Index
		 */
		getColemanLiauIndex: function() {
			var lpw = 100*this.getNumLetters()/this.getNumWords();
			var spw = 100*this.getNumSentences()/this.getNumWords();
			return 0.0588 * lpw - 0.296 * spw - 15.8;
		},


		/*
		Compute the Automated Readability Index.

		This function returns the Automated Readability Index indicating
		the number of years of education necessary to understand the text.

		https://en.wikipedia.org/wiki/Automated_Readability_Index
		 */
		getAutomatedReadabilityIndex: function() {
			var lpw = this.getNumLetters()/this.getNumWords();
			var wps = this.getNumWords() / this.getNumSentences();
			return 4.71 * lpw + 0.5 * wps - 21.43;
		},


		/*
		Compute the Gunning-Fog Index

		This function returns the Gunning-Fog index indicating
		the number of years of education necessary to understand the text.

		https://en.wikipedia.org/wiki/Gunning_fog_index
		*/
		getGunningFogIndex: function(){
			var wps = this.getNumWords() / this.getNumSentences();
			var ppw = this.getNumPolysyllables() / this.getNumWords();
			return 0.4*(wps + 100.*ppw);
		},

		/*
		Compute the SMOG grade

		This function returns the SMOG indicating the number of years of
		education necessary to understand the text. It is slightly different
		from the SMOG Index.

		https://en.wikipedia.org/wiki/SMOG
		*/
		getSmogGrade: function(ns,nc){
			var pps = this.getNumPolysyllables() / this.getNumSentences();
			return 1.043*Math.sqrt(30*pps) + 3.1291;
		}
	}


	/*
	Split a text into words.

	Returns an array containing all the words of the text.
	*/
	function splitIntoWords() {
		var res = new Array();
		var words = text.split(/[\s?!:;,\.]+/);
		for(var i=0;i<words.length;i++){
			var word = words[i].trim();
			if(word == ""){
				continue;
			}
			res.push(word);
		}
		return res;
	}


	/*
	Split a text into sentences.

	Returns an array containing all the sentences of the text.
	*/
	function splitIntoSentences() {
		var res = new Array();
		var sentences = text.split(/[?!:;\.]+/)
		for(var i=0;i<sentences.length;i++){
			var sentence = sentences[i].trim();
			if(sentence == ""){
				continue;
			}
			res.push(sentence);
		}
		return res;
	}


	/*
	Count the letters in a text.

	This function returns the number of letters ([a-zA-Z]) in the given text.
	*/
	function countLetters() {
		var nl = 0;
		for (var i = 0; i < text.length; i++) {
			var c = text.charCodeAt(i);
			if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
				nl++;
			}
		}
		return nl;
	}


	/*
	Count the syllables

	Returns the number of syllables in the text.
	*/
	function countTextSyllables(){
		var ns = 0;
		for(var i = 0; i < obj.getWords().length; i++){
			ns += countSyllables(obj.getWords()[i]);
		}
		return ns;
	}


	/*
	Count words

	Returns the number of words in the text.
	*/
	function countWords(){
		return obj.getWords().length;
	}


	/*
	Count polysyllables

	Returns the number of polysyllables in the text. Polysyllables are words
	with three or more syllables, not counting some very common suffixes.
	*/
	function countPolysyllables(){
		var n_p = 0;
		for(var i=0; i < obj.getWords().length;i++){
			if(this.isPolysyllable(obj.getWords()[i])){
				n_p += 1;
			}
		}
		return n_p;
	}


	/*
	Count sentences

	Return the number of sentences in the text.
	*/
	function countSentences(){
		return obj.getSentences().length;
	}


	return obj;
}

