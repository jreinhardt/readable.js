.PHONY: clean

SRC= src/language.js src/text.js src/prototypes.js src/simple-metrics.js

readable.js: $(SRC)
	cat $(SRC) > readable.js

clean:
	rm -rf readable.js
