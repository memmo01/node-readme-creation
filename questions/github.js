module.exports = {
  main: [
    {
      type: "input",
      message: "What your github username?",
      name: "githubusername",
    },
    {
      type: "input",
      message: "What is the title of your project?",
      name: "githubTitle",
    },
    {
      type: "input",
      name: "description",
      message: "Please write a short description about the project",
    },
    {
      type: "confirm",
      message: "Do you have a live url of the project?",
      name: "liveurl",
    },
    {
      type: "confirm",
      message: "Do you have a license with the project?",
      name: "license",
    },
    {
      type: "confirm",
      message: "Do you have collaborators you would like to give credit to?",
      name: "credit",
    },
  ],

  liveUrl: {
    type: "input",
    message: "Enter the url of the live project",
    name: "urlInput",
  },
  creditInput: {
    type: "input",
    message: "List who you want to give credit to",
    name: "creditInput",
  },

  licenseList: {
    type: "list",
    message: "Which license do you have",
    name: "licenseInput",
    choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3"],
  },

  responseQuestion: [],
};
