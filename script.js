let path = require("path");
let fs = require("fs");
const inquirer = require("inquirer");
let githubReadme = require("./questions/github.js");

//initialize application with question about what type of readme to create
inquirer
  .prompt([
    {
      type: "list",
      name: "readmetype",
      message: "What type of Readme file do you want to build?",
      choices: ["Github Readme", "Student Grade List"],
    },
  ])
  .then((answer) => {
    answer.readmetype === "Github Readme"
      ? githubCreate()
      : studentGradeCreate();
  });

function githubCreate() {
  inquirer.prompt(githubReadme.main).then((answers) => {
    console.log(answers);
  });
}

function studentGradeCreate() {
  console.log("start student grade app");
}
