const http = require('http');

const req = http.request({
  hostname: "localhost",
  port: 8000,
  method: "POST",
}, function(res){
  res.on("data", function(chunk){
    process.stdout.write(chunk.toString());
  });
});
req.end("This is the data.");
