const http = require('http');

http.createServer(function(req, res){
  res.writeHead(200, {"Content-Type" : "text/plain"});
  req.on('data', function(chunk){
    res.write(chunk.toString().toUpperCase());
    console.log(chunk.toString().toUpperCase());
  });
  req.on('end', function(){
    res.end();
  });
}).listen(8000);
