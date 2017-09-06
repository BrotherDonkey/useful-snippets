// goal is to create a basic html page with node

const figlet = require('figlet');
const fs = require('fs');

// use the argv to get the file path of the project / process, create base directory
const reg = new RegExp(/\/([\w||-])*/g); //improve regex!
const baseDirectory = process.argv[1].match(reg).join("");


// how to create a folder?

// plan -- create an html file with basics filled out. -index.js
// plan -- createa a linked css file with basic filed out. style.css
// plan -- create a basic js file with basics filed out. -script.js
// create a pages folder with one sample page.

const htmlTemplate =
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body>
    # H1
    Paragraph
    ## H2
    Paragraph
    ### h1
    Paragraph
  </body>
  </html>
  `
//
// console.log(fs.stat("./command-node.js", function(err, stats){
//   if (err) throw err;
//   else
//     console.log(stats);
// }))

function makeFile(projectName, type, path){

  //check for an existing project
  fs.readdir(`${__dirname}`, function(err, stats){
      if (err) throw err;
      else {
            const hasProjectFolder = stats.filter((item) => {if (item === name) return item;}).length > 0;
      }
    }
  })

  // create folders
  // for project
  //
  // // for styles
  // fs.mkdir(`project/styles`, function(err){
  //   if (err)
  //     throw new Error("Failed to create STYLES folder:" + err);
  // });
  //
  // //for scripts
  // fs.mkdir(`project/scripts`, function(err){
  //   if (err)
  //     throw new Error("Failed to create SCRIPTS folder:" + err);
  // });

  fs.writeFile(`${__dirname}${path || ``}/${name}.${type}`, htmlTemplate, function(err){
    if (err)
      throw new Error(`Failed to create file. ${err} Have you specified a path?`);
  });
}

function makeProject(){
};

makeFile(`hello`, `md`);
