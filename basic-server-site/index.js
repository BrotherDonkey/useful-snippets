const http = require("http");
const Router = require("./basic-router");
const ecstatic = require("ecstatic");

const fileServer = ecstatic({root: "./public"});
const router = new Router();

http.createServer(function(request, response) {
  if (!router.resolve(request, response))
    fileServer(request, response);
}).listen(8000);

// used to send off responses with a single function call.
function respond(response, status, data, type) {
  response.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  response.end(data);
}

// used to send off JSON responses with a single function call.
function respondJSON(response, status, data) {
  respond(response, status, JSON.stringify(data), "application/json");
}
