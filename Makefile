.PHONY: clean lint test

SRC= src/language.js src/text.js src/prototypes.js src/simple-metrics.js src/bloom.js src/base64.js

readable.js: $(SRC)
	cat $(SRC) > readable.js

readable.min.js: readable.js
	uglifyjs -nc -o readable.min.js readable.js

lint:
	node utils/check.js

test:
	node utils/server.js &
	x-www-browser localhost:8888/test/qunit/language.html &
	x-www-browser localhost:8888/test/qunit/metrics.html &
	x-www-browser localhost:8888/test/qunit/text.html &
	x-www-browser localhost:8888/test/qunit/bloom.html &
	x-www-browser localhost:8888/test/qunit/base64.html &

clean:
	rm -rf readable.js
