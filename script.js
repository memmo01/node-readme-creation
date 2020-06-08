const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const githubReadme = require("./questions/github.js");
const readmeCreation = require("./components/readme-creation.js");
const gradeQuestions = require("./questions/grading.js");
const gradeSearchQuestions = require("./questions/grade-search.js");
const hmwkSearch = require("./components/hmwk-search.js");
const ProgressBar = require("progress");
const mainQuestion = require("./questions/main.js");

let readmeAnswers;
//global variables for assignment and week grading part of app is working with
let assignment;
let week;
let hmwkWeekData;

function questionPrompt(questionDir) {
  return inquirer.prompt(questionDir);
}

function sortMainQAnswer(answer) {
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
}

initializeApp();
//initialize application with question about what type of readme to create
async function initializeApp() {
  try {
    let mainQ = await questionPrompt(mainQuestion);
    sortMainQAnswer(mainQ);
  } catch (err) {
    console.error(err);
  }
}

async function githubCreate() {
  try {
    let githubAnswer = await questionPrompt(githubReadme.main);
    readmeAnswers = githubAnswer;
    checkConfirmQuestions(githubAnswer);
  } catch (err) {
    console.error(err);
  }
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

async function loadFollowupQuestions() {
  try {
    let followUpAns = await questionPrompt(githubReadme.responseQuestion);

    updateReadMeAnswers(
      followUpAns.urlInput,
      followUpAns.creditInput,
      followUpAns.licenseInput
    );
  } catch (err) {
    console.error(err);
  }
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
async function studentGradeCreate() {
  try {
    console.log("start student grade app");

    let gradeAns = await questionPrompt(gradeQuestions.assignmentInput);

    assignment = gradeAns.assignment_name;
    week = gradeAns.week_num;

    addStudentInfo();
  } catch (err) {
    console.error(err);
  }
}

//update information about the week and assignment with student information (name, grade, comments). Place it into a constructor and push it to an object to use later
async function addStudentInfo() {
  try {
    let studenInfoAns = await questionPrompt(gradeQuestions.gradeInput);

    let newStudentSubmit = new submission(
      assignment,
      week,
      studenInfoAns.student_name,
      studenInfoAns.grade,
      studenInfoAns.comments
    );

    gradeQuestions.results.push(newStudentSubmit);
    console.log(gradeQuestions.results);
    checkForMore();
  } catch (err) {
    console.error(err);
  }
}

//check if more students need to be added
async function checkForMore() {
  try {
    let moreStudents = await questionPrompt(gradeQuestions.addMore);

    if (moreStudents.add_more) {
      addStudentInfo();
    } else {
      console.log("thank you we will now send information to a text file");
      checkPath();
      saveFile(
        "./readme_created/hwgrades/week" + week + ".txt",
        JSON.stringify(gradeQuestions.results)
      );
    }
  } catch (err) {
    console.error(err);
  }
}

function checkPath() {
  let dir = "./readme_created/hwgrades";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else {
    return;
  }
}

//**********student grade search section**********

async function studentGradeSearch(newMessage) {
  try {
    let message = "Welcome to 'Grade Search' !";

    if (newMessage) {
      message = newMessage;
    }
    console.log(message);
    let weekSearch = await questionPrompt(gradeSearchQuestions.weekSearch);

    //if res is not a number then alert user and run app again

    if (!isNaN(weekSearch.hmwk_week)) {
      hmwkWeekData = hmwkSearch.searchFile(weekSearch.hmwk_week, fs);
      sortQuestions();
    } else {
      studentGradeSearch("***You can only enter in a number for this input***");
    }
  } catch (err) {
    console.error(err);
  }

  //grab week information from file and then save it in an array to access if needed later. Then start a new function too parse through it based on what the user is looking for
}

//allows user to search through data by: name, grade, or show all
async function sortQuestions() {
  try {
    let gradeSearchType = await questionPrompt(
      gradeSearchQuestions.sortQuestion
    );

    if (gradeSearchType.sort_q === "Show All") {
      hmwkSearch.showData(hmwkWeekData, "all");
      sortQuestions();
    }
    if (gradeSearchType.sort_q === "Search By Student Name") {
      let name = await questionPrompt(gradeSearchQuestions.studentSearch);
      hmwkSearch.showData(hmwkWeekData, "name", name.student);
      sortQuestions();
    }

    if (gradeSearchType.sort_q === "Search by Grade") {
      console.log("search here grade");
      let grade = await questionPrompt(gradeSearchQuestions.gradeSearch);
      hmwkSearch.showData(hmwkWeekData, "grade", grade.hmwkgrade);
      sortQuestions();
    }

    if (gradeSearchType.sort_q === "Back to Assignment Search") {
      studentGradeSearch();
    }
    if (gradeSearchType.sort_q === "Main Menu") {
      initializeApp();
    }
  } catch (err) {
    console.error(err);
  }
}
