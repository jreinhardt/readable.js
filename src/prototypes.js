//Prototypes

readable = (function(module) {

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


	return module;
}(readable));
