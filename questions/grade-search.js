module.exports = {
  weekSearch: {
    type: "number",
    message: "Which homework week would you like to search?",
    name: "hmwk_week",
  },
  sortQuestion: {
    type: "list",
    message: "How would you like to see the data?",
    choices: [
      "Search By Student Name",
      "Search by Grade",
      "Show All",
      "Back to Assignment Search",
      "Main Menu",
    ],
    name: "sort_q",
  },
  studentSearch: {
    type: "input",
    message: "what is the students name?",
    name: "student",
  },
  gradeSearch: {
    type: "input",
    message: "What homework grade would you like to search?",
    name: "hmwkgrade",
  },
};
