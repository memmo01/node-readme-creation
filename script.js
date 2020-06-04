const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const githubReadme = require("./questions/github.js");
const readmeCreation = require("./text-file-creation/readme.js");
const gradeQuestions = require("./questions/grading.js")
let readmeAnswers;
let assignment;
let week;

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
    readmeAnswers = answers;
    checkConfirmQuestions(answers);
  });
}

//go through the answers and if there are yes answers to the confirm statements then load a question to gather more information about it

function checkConfirmQuestions(answers) {
  console.log(readmeAnswers);
  if (answers.liveurl) {
    githubReadme.responseQuestion.push(githubReadme.liveUrl);
  }

  if (answers.credit) {
    githubReadme.responseQuestion.push(githubReadme.creditInput);
  }
  if (answers.license) {
    githubReadme.responseQuestion.push(githubReadme.licenseList);
  }

  loadFollowupQuestions();
}

function loadFollowupQuestions() {
  inquirer.prompt(githubReadme.responseQuestion).then((answers) => {
    updateReadMeAnswers(
      answers.urlInput,
      answers.creditInput,
      answers.licenseInput
    );
  });
}
//add answers to readmeanswer obj
function updateReadMeAnswers(url, credit, license) {
  readmeAnswers.urlInput = url;
  readmeAnswers.creditInput = credit;
  readmeAnswers.licenseInput = license;

  saveFile(readmeCreation(readmeAnswers));
}

//add data to the readme file
function saveFile(data) {
  fs.writeFile("./readme_created/README.md", data, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("readme created successfully");
    }
  });
}


fs.readFileSync("./readme_created/readme.md", "utf-8", function (r, j) {
  console.log(j)
})

//separate function from the readme creator
function studentGradeCreate() {
  console.log("start student grade app");


  inquirer.prompt(gradeQuestions.assignmentInput).then(function (res) {

    assignment = res.assignment_name
    week = res.week_num


  })
  //i want a function that will add 1. student homework assignment, 2. student name , 3. student grades, 4. comments left 5. date added to a text file



}


function createGrade(assignment, week, name, grade, comments) {
  this.assignment = assignment;
  this.week = week;
  this.grade = grade;
  this.comments = comments
}