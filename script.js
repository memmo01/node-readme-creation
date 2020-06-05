const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const githubReadme = require("./questions/github.js");
const readmeCreation = require("./components/readme-creation.js");
const gradeQuestions = require("./questions/grading.js");
const gradeSearchQuestions = require("./questions/grade-search.js");
const hmwkSearch = require("./components/hmwk-search.js");
const ProgressBar = require("progress");

let readmeAnswers;
//global variables for assignment and week grading part of app is working with
let assignment;
let week;
let hmwkWeekData;
initializeApp();
//initialize application with question about what type of readme to create
function initializeApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "readmetype",
        message: "What type of Readme file do you want to build?",
        choices: [
          "Github Readme",
          "Add Weekly Homework Grades",
          "Search Grades",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.readmetype) {
        case "Github Readme":
          githubCreate();
          break;
        case "Add Weekly Homework Grades":
          studentGradeCreate();
          break;
        case "Search Grades":
          studentGradeSearch();
          break;
      }
    });
}

function githubCreate() {
  inquirer.prompt(githubReadme.main).then((answers) => {
    readmeAnswers = answers;
    checkConfirmQuestions(answers);
  });
}

//go through the answers and if there are yes answers to the confirm statements then load a question to gather more information about it

function checkConfirmQuestions(answers) {
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

  saveFile("./readme_created/README.md", readmeCreation(readmeAnswers));
}

//add data to file
function saveFile(filepath, data) {
  fs.writeFile(filepath, data, function (err) {
    progressBarLoad(filepath);
    if (err) {
      console.log(err);
    } else {
      console.log("Creating File...");
    }
  });
}

function progressBarLoad(filepath) {
  var bar = new ProgressBar(":bar", { total: 20 });
  var timer = setInterval(function () {
    bar.tick();
    if (bar.complete) {
      console.log("file created successfully in " + filepath);

      clearInterval(timer);
    }
  }, 100);
}

//**** student grading section of program ****/

//constructor for building object about student
function submission(assignment, week, name, grade, comments) {
  this.assignment = assignment;
  this.week = week;
  this.name = name;
  this.grade = grade;
  this.comments = comments;
}

//get information about the week and assignment
function studentGradeCreate() {
  console.log("start student grade app");

  inquirer.prompt(gradeQuestions.assignmentInput).then(function (res) {
    assignment = res.assignment_name;
    week = res.week_num;

    addStudentInfo();
  });

  //update information about the week and assignment with student information (name, grade, comments). Place it into a constructor and push it to an object to use later
  function addStudentInfo() {
    inquirer.prompt(gradeQuestions.gradeInput).then(function (res) {
      let x = new submission(
        assignment,
        week,
        res.student_name,
        res.grade,
        res.comments
      );

      gradeQuestions.results.push(x);
      console.log(gradeQuestions.results);
      checkForMore();
    });
  }

  //check if more students need to be added
  function checkForMore() {
    inquirer.prompt(gradeQuestions.addMore).then(function (res) {
      if (res.add_more) {
        addStudentInfo();
      } else {
        console.log("thank you we will now send information to a text file");
        checkPath();
        saveFile(
          "./readme_created/hwgrades/week" + week + ".txt",
          JSON.stringify(gradeQuestions.results)
        );
      }
    });
  }

  function checkPath() {
    let dir = "./readme_created/hwgrades";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      return;
    }
  }
}

//**********student grade search section**********

function studentGradeSearch(newMessage) {
  let message = "Welcome to 'Grade Search' !";

  if (newMessage) {
    message = newMessage;
  }
  console.log(message);
  inquirer.prompt(gradeSearchQuestions.weekSearch).then(function (res) {
    console.log(res);
    //if res is not a number then alert user and run app again

    if (!isNaN(res.hmwk_week)) {
      hmwkWeekData = hmwkSearch.searchFile(res.hmwk_week, fs);
      sortQuestions();
    } else {
      studentGradeSearch("***You can only enter in a number for this input***");
    }

    //grab week information from file and then save it in an array to access if needed later. Then start a new function too parse through it based on what the user is looking for
  });
}

//allows user to search through data by: name, grade, or show all
function sortQuestions() {
  inquirer.prompt(gradeSearchQuestions.sortQuestion).then(function (res) {
    if (res.sort_q === "Show All") {
      hmwkSearch.showData(hmwkWeekData, "all");
      sortQuestions();
    }
    if (res.sort_q === "Search By Student Name") {
      inquirer.prompt(gradeSearchQuestions.studentSearch).then(function (res) {
        hmwkSearch.showData(hmwkWeekData, "name", res.student);
        sortQuestions();
      });
    }
    if (res.sort_q === "Search by Grade") {
      inquirer.prompt(gradeSearchQuestions.gradeSearch).then(function (res) {
        hmwkSearch.showData(hmwkWeekData, "grade", res.hmwkgrade);
        sortQuestions();
      });
    }

    if (res.sort_q === "Back to Assignment Search") {
      studentGradeSearch();
    }
    if (res.sort_q === "Main Menu") {
      initializeApp();
    }
  });
}
