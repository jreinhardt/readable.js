//Prototypes, utilities and the Text Object

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

	/*
	Prototype for metrics

	Here common methods and properties can be collected
	*/

	module.MetricPrototype = {
		getId: function(){throw "Method getId not implemented";},
		getName: function(){throw "Method getName not implemented";},
		getDescription: function(){throw "Method getDescription not implemented in " + this.getName();},
		getReference: function(){throw "Method getReference not implemented in " + this.getName();},
		getValue: function(){throw "Method getValue not implemented in " + this.getName();}
	};

	/*
	Prototype for grade metrics

	Grade metrics are a special case of metrics, as they return their estimate
	in the form of a number indicating a grade in the US system.
	*/

	function GradeMetricPrototype(){
		//source: http://en.wikipedia.org/wiki/Education_in_the_United_States#School_grades
		this.getGrade = function(text){
			var grade = this.getValue(text);
			if(grade < -1){
				return "Preschool";
			} else if(grade <= 0){
				return "Pre-Kindergarten";
			} else if(grade <= 1){
				return "Kindergarten";
			} else if(grade <= 2){
				return "1st Grade";
			} else if(grade <= 3){
				return "2nd Grade";
			} else if(grade <= 4){
				return "3rd Grade";
			} else if(grade <= 5){
				return "4th Grade";
			} else if(grade <= 6){
				return "5th Grade";
			} else if(grade <= 7){
				return "6th Grade";
			} else if(grade <= 8){
				return "7th Grade";
			} else if(grade <= 9){
				return "8th Grade";
			} else if(grade <= 10){
				return "9th Grade (Freshman)";
			} else if(grade <= 11){
				return "10th Grade (Sophomore)";
			} else if(grade <= 12){
				return "11th Grade (Junior)";
			} else if(grade <= 13){
				return "12th Grade (Senior)";
			} else {
				return "Tertiary education";
			}
		};

		this.getRoughGrade = function(text){
			var grade = this.getValue(text);
			if(grade < 1){
				return "Preschool";
			} else if(grade <= 5){
				return "Elementary school";
			} else if(grade <= 8){
				return "Middle school";
			} else if(grade <= 12){
				return "High school";
			} else {
				return "Tertiary education";
			}
		};
	}
	GradeMetricPrototype.prototype = module.MetricPrototype;

	module.GradeMetricPrototype = new GradeMetricPrototype();


	function isDecendant(object, prototype){
		//Go up the prototype chain until a match is found or it ends
		var proto = Object.getPrototypeOf(object);
		while(proto !== prototype && proto instanceof Object){
			proto = Object.getPrototypeOf(proto);
		}
		return proto === prototype;
	}

	/*
	Obtain an array with selections of Metrics
	*/

	module.getAllMetrics = function(){
		var metrics = [];
		for(var attr in this){
			//Slightly hacky, but I think it is reasonable to assume that Prototypes have Prototype in their name.
			if(isDecendant(this[attr],module.MetricPrototype) && attr.search("Prototype") < 0){
				metrics.push(this[attr]);
			}
		}
		return metrics;
	};

	module.getAllGradeMetrics = function(){
		var metrics = [];
		for(var attr in this){
			//Slightly hacky, but I think it is reasonable to assume that Prototypes have Prototype in their name.
			if(isDecendant(this[attr],module.GradeMetricPrototype) && attr.search("Prototype") < 0){
				metrics.push(this[attr]);
			}
		}
		return metrics;
	};


	/*
	Factory for Text objects
	*/
	module.Text = function (text){
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
			var n_p = 0;
			for(var i=0; i < obj.getWords().length;i++){
				if(module.isPolysyllable(obj.getWords()[i])){
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

	return module;
}(readable || {}));
