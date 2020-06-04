const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const githubReadme = require("./questions/github.js");
const readmeCreation = require("./text-file-creation/readme.js");
const gradeQuestions = require("./questions/grading.js")
let readmeAnswers;
//global variables for assignment and week grading part of app is working with
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

//get information about the week and assignment
function studentGradeCreate() {
  console.log("start student grade app");


  inquirer.prompt(gradeQuestions.assignmentInput).then(function (res) {

    assignment = res.assignment_name
    week = res.week_num

    addStudentInfo()

  })

  //update information about the week and assignment with student information (name, grade, comments). Place it into a constructor and push it to an object to use later
  function addStudentInfo() {
    inquirer.prompt(gradeQuestions.gradeInput).then(function (res) {
      let x = new submission(assignment, week, res.student_name, res.grade, res.comments)

      gradeQuestions.results.push(x)
      console.log(gradeQuestions.results)
      checkForMore()
    })

  }

  //check if more students need to be added
  function checkForMore() {
    inquirer.prompt(gradeQuestions.addMore).then(function (res) {
      if (res.add_more) {
        addStudentInfo()
      }
      else {
        console.log("thank you we will now send information to a text file")
      }
    })

  }


}

//constructor for building object about student
function submission(assignment, week, name, grade, comments) {
  this.assignment = assignment;
  this.week = week;
  this.name = name;
  this.grade = grade;
  this.comments = comments
}