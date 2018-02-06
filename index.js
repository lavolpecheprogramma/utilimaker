var inquirer = require('inquirer');
var math = require('./functions/math');
var geometry = require('./functions/geometry');
var time = require('./functions/time');
var canvas = require('./functions/canvas');

var allUtils = { 
  "MATH": math, 
  "GEOMETRY": geometry,
  "TIME": time,
  "CANVAS": canvas
};

var questions = [
   {
    type: 'checkbox',
    message: 'Selected utilities',
    name: 'Utilities',
    choices: []
  }
];

for (k in allUtils) {
  questions[0].choices.push(new inquirer.Separator(' = '+k+' = ') );
  for (utils in allUtils[k]) {
    questions[0].choices.push({
      name: utils.toString(),
      value: {
        group : k,
        name : utils.toString(),
        function : allUtils[k][utils].toString()
      }
    });
  }
}

inquirer.prompt(questions).then(function (answers) {
  
  console.log('\nCreating utility file..');

  var fs = require('fs');
  var stream = fs.createWriteStream("utils.js");
  stream.once('open', function(fd) {
    var group = '';
    stream.write("var Utils = {}; \n");
    for (var i = 0; i < answers.Utilities.length; i++) {
      if(answers.Utilities[i].group != group){
        group = answers.Utilities[i].group;
        stream.write("Utils."+answers.Utilities[i].group+" = {}; \n");    
      }
      stream.write("Utils."+answers.Utilities[i].group+"."+answers.Utilities[i].name+" = "+answers.Utilities[i].function+" \n");
    }
    stream.write("module.exports = Utils; \n");
    stream.end();

    console.log('File created!');
  });
});