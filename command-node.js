const figlet = require('figlet');
const fs = require('fs');

figlet.text("COMMAND LINE", function(error, data){
  if (error) console.log(error);
  else console.log(data);
});

fs.readFile("./some-file.txt", function(error, buffer){
  if (error) throw error;
  console.log("This file contained," + buffer.length, "bytes.", "The first byte is : ", buffer[0]);
});

fs.writeFile("created-file.txt", "Node created this file", function(err){
  if (err)
    console.log("Failed to write file", err);
  // else
    // fs.unlink("./created-file.txt", function(){
    //   console.log("File created then delete because hooray");
    // }
  // );
});



fs.readdir("./", function(err, files){
  if (err) throw err;
  else
    console.log(files);
});

fs.stat("./command-node.js", function(err, stats){
  if (err) throw err;
  else
    console.log(stats);
})



// log any remaining arguments
console.log("Args ", process.argv[2]);
