module.exports = {
  weekSearch: {
    type: "number",
    message: "Which homework week would you like to search?",
    name: "hmwk_week",
  },
  sortQuestion: {
    type: "list",
    message: "How would you like to do?",
    choices: [
      "Search By Student Name",
      "Search by Grade",
      "New Entry",
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
