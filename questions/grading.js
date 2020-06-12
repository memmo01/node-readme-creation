module.exports = {
  assignmentInput: [
    {
      type: "input",
      name: "assignment_name",
      message: "enter the name of the assignment",
    },
    {
      type: "input",
      name: "week_num",
      message: "enter the week number",
    },
  ],
  gradeInput: [
    {
      type: "input",
      name: "student_name",
      message: "enter the students name",
    },
    {
      type: "list",
      name: "grade",
      message: "enter the grade for the assignment",
      choices: [
        "A+",
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D+",
        "D",
        "D-",
        "F",
        "Incomplete",
        "Plagiarism-flag",
      ],
    },
    {
      type: "input",
      message: "Enter Comments",
      name: "comments",
    },
  ],
  addMore: {
    type: "confirm",
    name: "add_more",
    message: "Would you like to submit another student input?",
  },
  results: [],
};
