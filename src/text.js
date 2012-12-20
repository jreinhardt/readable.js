'use strict';
//The text object

var readable = (function(module) {
	/*
	Factory for Text objects
	*/
	module.Text = function (text){
		var members = {};

		function memoize(key,calculator) {
			if(members[key] === undefined){
				members[key] = calculator();
			}
			return members[key];
		}

		var obj = {
			getText: function(){
				return text;
			},
			getSentences: function(){
				return memoize('sentences',splitIntoSentences);
			},
			getWords: function(){
				return memoize('words',splitIntoWords);
			},
			getNumLetters: function(){
				return memoize('numLetters',countLetters);
			},
			getNumSyllables: function(){
				return memoize('numSyllables',countTextSyllables);
			},
			getNumWords: function(){
				return memoize('numWords',countWords);
			},
			getNumPolysyllables: function(){
				return memoize('numPolysyllables',countPolysyllables);
			},
			getNumSentences: function(){
				return memoize('numSentences',countSentences);
			}
		};


		/*
		Split a text into words.

		Returns an array containing all the words of the text.
		*/
		function splitIntoWords() {
			var res = [];
			var words = text.split(/[\s?!:;,\.]+/);
			for(var i=0;i<words.length;i++){
				var word = words[i].trim();
				if(word === ''){
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
			var res = [];
			var sentences = text.split(/[?!:;\.]+/);
			for(var i=0;i<sentences.length;i++){
				var sentence = sentences[i].trim();
				if(sentence === ''){
					continue;
				}
				res.push(sentence);
			}
			return res;
		}


		/*
		Count the letters in a text.

		This function returns the number of letters ([a-zA-Z]) in the given
		text.
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
				ns += module.countSyllables(obj.getWords()[i]);
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
			var numPoly = 0;
			var words = obj.getWords();
			for(var i=0; i < words.length;i++){
				if(module.isPolysyllable(words[i])){
					numPoly += 1;
				}
			}
			return numPoly;
		}


		/*
		Count sentences

		Return the number of sentences in the text.
		*/
		function countSentences(){
			return obj.getSentences().length;
		}


		return obj;
	};

	return module;

}(readable || {}));
