.PHONY: clean lint

SRC= src/language.js src/text.js src/prototypes.js src/simple-metrics.js

readable.js: $(SRC)
	cat $(SRC) > readable.js

readable.min.js: readable.js
	uglifyjs -nc -o readable.min.js readable.js

lint:
	node utils/check.js

clean:
	rm -rf readable.js
