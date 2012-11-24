/*
Count syllables in a word.

This function returns the approximate number of syllables in the given word.
It uses the heuristic approach described in the article

    Talburt: "The Flesch Index: An Easily Programmable Readability Analysis
    Algorithm"
*/
function count_syllables(word) {
	n = word.length;
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
function has_suffix(word,suffix){
	return word.slice(word.length - suffix.length) == suffix;
}

/*
check word for complexity

Complex words are assumed to be those with more than 3 syllables, not counting
common suffixes like -es, -ed, -ing, -ity.
*/
function is_complex_word(word) {
	var n_syl = count_syllables(word);
	//handle clear cases
	if(n_syl < 3){
		return false;
	} else if(n_syl > 3){
		return true;
	}
	//if word has 3 syllables, it might be simple of complex depending on the
	//suffix
	simple_suffixes = new Array("es","ed","ing","ity");
	for (var suffix in simple_suffixes){
		if (has_suffix(word,suffix)){
			return false;
		}
	}
	return true;
}


/*
count complex words

Given an array of words this function returns the number of complex words in
this array.
*/
function count_complex_words(words){
	var n_complex = 0;
	for(var i=0; i < words.length;i++){
		if(is_complex_word(words[i])){
			n_complex += 1;
		}
	}
	return n_complex;
}


/*
Split a text into words.

This function returns an array containing all the words in the given text.
*/
function split_into_words(text) {
	return text.split(/[\s?!:;,\.]+/)
}


/*
Split a text into sentences.

This function returns an array containing all the sentences in the given text.
*/
function split_into_sentences(text) {
	return text.split(/[?!:;\.]+/)
}


/*
Count the letters in a text.

This function returns the number of letters ([a-zA-Z]) in the given text.
*/
function count_letters(text) {
	var nl = 0;
	var i;
	for (i = 0; i < text.length; i++) {
		var c = text.charCodeAt(i);
		if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
			nl++;
		}
	}
	return nl;
}


/*
Compute the Flesh readability index.

This function returns the Flesh readability index given the number of
sentences (ns), words (nw), and syllables (nsyl) in a text.
*/
function flesh_index(ns, nw, nsyl) {
	return 206.835 - 1.015 * (nw / ns) - 84.6 * (nsyl / nw);
}


/*
Compute the Coleman-Liau readability index.

This functions returns the Coleman-Liau readability index given the number of
sentences (ns), words (nw), and letters (nl).
 */
function coleman_liau_index(ns, nw, nl) {
	nw /= 100;
	nl /= nw;
	ns /= nw;
	return 0.0588 * nl - 0.296 * ns - 15.8;
}


/*
Compute the Automated Readability Index.

This function returns the Automated Readability Index given the number of
sentences (ns), words (nw), and letters (nl).
 */
function automated_readability_index(ns, nw, nl) {
	return 4.71 * (nl / nw) + 0.5 * (nw / ns) - 21.43;
}


/*
Compute the Gunning-Fog Index

This function returns the Gunning-Fog index given the number of sentences (ns),
words (nw) and complex words (nc).
*/
function gunning_fog_index(ns,nw,nc){
	return 0.4*(nw/ns + 100.*nc/nw);
}
