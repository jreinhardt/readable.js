//Several Simple Readability Metrics, that do not justify a own file

readable = (function(module) {
	/*
	The constructor for the metric objects is not exposed in module, as the
	metric objects have no state, no need to construct more of them
	*/

	function FleschKincaidReadingEase(){
		this.getId = function(){
			return "FleschKincaidEase";
		};
		this.getName = function(){
			return "Flesch-Kincaid Reading Ease";
		};
		this.getDescription = function(){
			return "Returns the Flesch-Kincaid reading ease, a number " +
			"(usually) between 0 and 100, where larger numbers indicate " +
			"easier text. Not to be confused with the Flesch-Kincaid " +
			"Grade Level.";
		};
		this.getReference = function(){
			return "https://en.wikipedia.org/wiki/Flesch-Kincaid_Readability_Test";
		};
		this.getValue = function(text){
			var wps = text.getNumWords() / text.getNumSentences();
			var spw = text.getNumSyllables() / text.getNumWords();
			return 206.835 - 1.015 * wps - 84.6 * spw;
		};
	}
	FleschKincaidReadingEase.prototype = module.MetricPrototype;

	module.FleschKincaidReadingEase = new FleschKincaidReadingEase();


	function ColemanLiauIndex(){
		this.getId = function(){
			return "ColemanLiau";
		};
		this.getName = function(){
			return "Coleman-Liau Index";
		};
		this.getDescription = function(){
			return "Returns the Coleman-Liau readability index " +
			"indicating the number of years of education necessary to " +
			"understand the text.";
		};
		this.getReference = function(){
			return "https://en.wikipedia.org/wiki/Coleman-Liau_Index";
		};
		this.getValue = function(text){
			var lpw = 100*text.getNumLetters()/text.getNumWords();
			var spw = 100*text.getNumSentences()/text.getNumWords();
			return 0.0588 * lpw - 0.296 * spw - 15.8;
		};
	}
	ColemanLiauIndex.prototype = module.GradeMetricPrototype;

	module.ColemanLiauIndex = new ColemanLiauIndex();


	function AutomatedReadabilityIndex(){
		this.getId = function(){
			return "ARI";
		};
		this.getName = function(){
			return "Automated Readability Index";
		}
		this.getDescription = function(){
			return "Returns the Automated Readability Index " +
			"indicating the number of years of education necessary to " +
			"understand the text.";
		};
		this.getReference = function(){
			return "https://en.wikipedia.org/wiki/Automated_Readability_Index";
		};
		this.getValue = function(text){
			var lpw = text.getNumLetters()/text.getNumWords();
			var wps = text.getNumWords() / text.getNumSentences();
			return 4.71 * lpw + 0.5 * wps - 21.43;
		};
	}
	AutomatedReadabilityIndex.prototype = module.GradeMetricPrototype;

	module.AutomatedReadabilityIndex = new AutomatedReadabilityIndex();


	function GunningFogIndex(){
		this.getId = function(){
			return "GunningFog";
		};
		this.getName = function(){
			return "Gunning-Fog Index";
		};
		this.getDescription = function(){
			return "Returns the Gunning-Fog index " +
			"indicating the number of years of education necessary to " +
			"understand the text.";
		};
		this.getReference = function(){
			return "https://en.wikipedia.org/wiki/Gunning_fog_index";
		};
		this.getValue = function(text){
			var wps = text.getNumWords() / text.getNumSentences();
			var ppw = text.getNumPolysyllables() / text.getNumWords();
			return 0.4*(wps + 100.*ppw);
		};
	}
	GunningFogIndex.prototype = module.GradeMetricPrototype;

	module.GunningFogIndex = new GunningFogIndex();


	function SMOG(){
		this.getId = function(){
			return "SMOG";
		};
		this.getName = function(){
			return "SMOG Grade";
		};
		this.getDescription = function(){
			return "Returns the SMOG Grade " +
			"indicating the number of years of education necessary to " +
			"understand the text. Slightly different from the SMOG index";
		};
		this.getReference = function(){
			return "https://en.wikipedia.org/wiki/SMOG";
		};
		this.getValue = function(text){
			var pps = text.getNumPolysyllables() / text.getNumSentences();
			return 1.043*Math.sqrt(30*pps) + 3.1291;
		};
	}
	SMOG.prototype = module.GradeMetricPrototype;

	module.SMOG = new SMOG();
		
	return module;
}(readable));
