var http = require("http");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');

// pass the url as a cmd line arg
site = process.argv[2];
if(typeof site === 'undefined'){
	console.log("Please pass the url as the first parameter to the script.");
	process.exit();
}
if(site.indexOf("http") != -1){
	console.log("Please omit http:// from your URL");
	process.exit();
}

pivot = "/"; // without "http://" first instance of "/" should be just past the TLD
cut = site.indexOf(pivot);
host = site.substring(0, cut);
path = site.substring(cut, site.length);

console.log("\nhost: " + host);
console.log("path: " + path + "\n");

var options = {
	host: host,
	port: 80,
	path: path,
};

var req = http.get(options, function(res) {
	console.log('STATUS: ' + res.statusCode);
	//console.log('HEADERS: ' + JSON.stringify(res.headers));

	body = "";
	res.on('data', function (chunk) { //collect response
		body += chunk;
	})  
	.on('end', function(something){ //once we have the response, parse
		parser.parseString(body, function (err, result) { //once we've parsed, write to file
			fs.writeFile('output.json', JSON.stringify(result), function (err) {
				if (err) throw err;
				console.log('\n\nFile saved to output.json');
			});
		});
	});
}) 
.on('error', function(e) {
	console.log("Got error: " + e.message);
});

