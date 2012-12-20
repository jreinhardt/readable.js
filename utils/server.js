var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (request, response) {
	var path = url.parse(request.url);
	fs.stat('.' + path.pathname,function (error,stat) {
		if (error !== null) {
			response.writeHead(404, {'Content-Type': 'text/html'});
			response.write('File not found');
			response.end();
		} else if (stat.isFile()) {
			fs.readFile('.' + path.pathname,'utf8',function(error, data){
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(data);
				response.end();
			});
		} else {
			response.writeHead(404, {'Content-Type': 'text/html'});
			response.write('Sorry');
			response.end();
		}
	});
}).listen(8888);
