'use strict';
//The Dale Chall readability metric

var readable = (function(module) {

	var DaleChallFilter = module.fromBytestream(readable.base64decode(
'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' +
''));


	function DaleChallReadabilityScore(){
		this.getId = function(){
			return 'DaleChallScore';
		};
		this.getName = function(){
			return 'Dale-Chall Readability Score';
		};
		this.getDescription = function(){
			return 'The Dale-Chall formula uses a list of 3000 simple words ' +
			'to estimate the readability of a text. Returns a positive number' +
			', usually between 4 and 10, lower values indicate easier texts.';
		};
		this.getReference = function(){
			return 'https://en.wikipedia.org/wiki/' +
			'Dale%E2%80%93Chall_readability_formula';
		};
		this.getValue = function(text){
			var simpleWords = 0;
			var words = text.getWords();
			for(var i=0; i < words.length; i++){
				if(DaleChallFilter.test(words[i].toLowerCase())){
					simpleWords += 1;
				}
			}

			var dwpw = (words.length - simpleWords)/words.length;
			var wps = words.length/text.getNumSentences();

			var score = (dwpw > 0.05) ? 3.6365 : 0;
			score += 0.1579*dwpw*100;
			score += 0.0496*wps;

			return score;
		};
	}
	DaleChallReadabilityScore.prototype = module.MetricPrototype;

	module.DaleChallReadabilityScore = new DaleChallReadabilityScore();

	return module;
}(readable));
