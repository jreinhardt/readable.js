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


function update(evt) {
	var text = document.form.word.value;
	var words = split_into_words(text);
	var sentences = split_into_sentences(text);
	var ns = sentences.length;
	var nw = words.length;
	var nl = count_letters(text);
	var nsyl = 0;
	var i;
	for (i = 0; i < words.length; i++) {
		nsyl += count_syllables(words[i]);
	}
	var f = flesh_index(ns, nw, nsyl);
	var cl = coleman_liau_index(ns, nw, nl);
	var ari = automated_readability_index(ns, nw, nl);
	document.getElementById("num_syllables").innerHTML = nsyl;
	document.getElementById("num_words").innerHTML = nw;
	document.getElementById("num_sentences").innerHTML = ns;
	document.getElementById("num_letters").innerHTML = nl;
	document.getElementById("flesh").innerHTML = f;
	document.getElementById("coleman_liau").innerHTML = cl;
	document.getElementById("ari").innerHTML = ari;
}


