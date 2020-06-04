module.exports = function (obj) {
  //get badge link here. 1 . get username info. 2 .get repo info. 3. get variable 4. add variable to the readme

  function checkTOC(topicObj, title, hash) {
    if (topicObj) {
      return `* [${title}](${hash})`;
    } else {
      return ``;
    }
  }

  function checkSection(topicObj, hash, input) {
    if (topicObj) {
      return `${hash}
      ${input}`;
    } else {
      return ``;
    }
  }

  function checkLiveLink() {
    if (obj.liveurl) {
      return `
      You can see the application in action at ${obj.urlInput}`;
    } else {
      return ``;
    }
  }

  //   add title

  return `# ${obj.githubTitle}

  ![](https://img.shields.io/github/languages/top/${obj.githubusername}/${
    obj.repo
  })
  
  ## Description
  
  ${obj.description}
  ${checkLiveLink()}
  
  ## Table of Contents

  * [Installation](#installation)

  * [Usage](#usage)

  ${checkTOC(obj.credit, "Collaborators", "#collaborators")}
  
  ${checkTOC(obj.license, "License", "#license")}

  ## Installation

  ${obj.installation}

  ## Usage

  ${obj.usage}
  
  ${checkSection(obj.license, "## License", obj.licenseInput)}
  
  ${checkSection(obj.credit, "## Collaborators", obj.creditInput)}`;
};
