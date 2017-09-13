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


// related to data being shown on site -- for example, using "talks", as in speeches.
var talks = Object.create(null);

// creating routes, by using the router.add method
router.add("GET", /^\/talks\/([^\/]+)$/, function(request, response, title) {
  if (title in talks)
    respondJSON(response, 200, talks[title]);
  else
    respond(response, 404, `No talk ${title} found.`);
});

router.add("DELETE", /^\/talks\/([^\/]+)$/, function(request, response, title) {
    if (title in talks) {
      delete talks[title];
      registerChange[title];
    }
    respond(response, 204, null);
});

// parse incoming requests as JSON
function readStreamAsJSON(stream, callback) {
  let data = "";
  stream.on("data", function(chunk) {
    data += chunk;
  });
  stream.on("end", function() {
    let result, error;
    try { result = JSON.parse(data);}
    callback(error, result);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}

router.add("PUT", /^\/talks\/([^\/]+)$/, function(request, response, title) {
  readStreamAsJSON(request, function(error, talk) {
    if (error) {
      respond(response, 400, error.toString());
    } else if (!talk ||
               typeof talk.presenter != "string" ||
               typeof talk.summary != "string") {
                 respond(response, 400, "Bad talk data")
    } else {
      talks[title] = { title: title,
                       presenter: talk.presenter,
                       summary: talk.summary,
                       comments: []};
      registerChange(title);
      respond(response, 204, null);
    }
  })
});

router.add("POST", /^\/talks\/([^\/]+)\/comments$/, function(request, response, title) {
  readStreamAsJSON(request, function(error, comment) {
    if (error) {
      respond(response, 400, error.toString());
    } else if (!comment ||
               typeof comment.author != "string" ||
               typeof comment.message != "string") {
      respond(response, 400, "Bad comment data");
    } else if (title in talks) {
      talks[title].comments.push(comment);
      registerChange(title)
      respond(response, 204, null);
    } else {
      respond(response, 404, `No talk ${title} in talks.`);
    }
  });
});


// Long Polling Support

function sendTalks(talks, response) {
  respondJSON(response, 200, {
    serverTime : Date.now(),
    talks : talks
  });
}

router.add("GET", /^\/talks$/, function(request, response) {
  const query = require("url").parse(request.url, true).query;
  if (query.changesSince == null) {
    const list = [];
    for (var title in talks)
      list.push(talks[title]);
    sendTalks(list, response);
  } else {
    var since = Number(query.changesSince);
    if (isNan(since)) {
      respond(response, 400, "Invalid parameter");
    } else {
      var changed = getChangedTalks(since);
      if (changed.length > 0)
        sendTalks(changed, response);
      else
        waitForChanges(since, response);
    }
  }
});

var waiting = [];

function waitForChanges(since, response) {
  var waiter = {
    since : since,
    response : responses
  }
  waiting.push(waiter);
  setTimeout(function(){
    var found = waiting.indexOf(waiter);
    if (found > -1) {
      waiting.splice(found, 1)
      sendTalks([], response);
    }
  }, 90 * 1000);
}

var change = [];

function registerChanges(title) {
  change.push({title : title, time : Date.now()});
  waiting.forEach(function(waiting) {
    sendTalks(getChangedTalks(waiter.since), waiter.response);
  });
  waiting = [];
}

function getChangedTalks(since) {
  var found = [];

  function alreadySeen(title) {
    return found.some(function(f) {return f.title == title});
  }

  for (var i = changed.length - 1; i >= 0; i--) {
    var change = changes[i];
    if (change.time <= since)
      break;
    else if (alreadySeen(change.title))
      continue;
    else if (change.title in talks)
      found.push(talks[change.title])
    else
      found.push({title : change.title, deleted : true})
  }
  return found;
}
