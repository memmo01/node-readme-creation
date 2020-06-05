module.exports = {
  //search for text file and send back data from it
  searchFile: function (data, fs) {
    let hmwkData = fs.readFileSync(
      `./readme_created/hwgrades/week${data}.txt`,
      "utf-8"
    );

    return JSON.parse(hmwkData);
  },

  //takes data and formats it to look nice on console.log
  showData: function (data, sort, subject, gradeSpectrum) {
    let personData;
    let usedData;

    switch (sort) {
      case "all":
        usedData = data;
        break;
      case "name":
        usedData = this.findStudent(data, subject);
        break;
      case "grade":
        usedData = this.sortGrade(data, subject, gradeSpectrum);
        break;
      default:
        usedData = data;
        break;
    }

    usedData.forEach(function (person) {
      personData += `

       Name: ${person.name}
       Assignment: ${person.assignment}
       Week: ${person.week}
       Grade: ${person.grade}
       ____________________
       `;
    });

    //displays data
    console.log(personData);
  },

  //finds student by name
  findStudent: function (data, name) {
    let student = data.filter(function (data) {
      if (data.name === name) {
        return data;
      }
    });
    return student;
  },

  //function created to sort through what the user is trying to find
  sortGrade: function (data, grade) {
    let grades = [
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
    ];
    let student = data.filter(function (studentData) {
      //searches for grades equal to or greater than the input grade
      if (grade.indexOf(">") !== -1) {
        let gradeSplit = grade.slice(1);
        let x = grades.indexOf(gradeSplit);

        for (let i = 0; i <= x; i++) {
          if (grades[i] === studentData.grade) {
            studentData.num = i;
            return studentData;
          }
        }
      }

      //searches for grades equal to or less than the input grade
      if (grade.indexOf("<") !== -1) {
        let gradeSplit = grade.slice(1);
        let x = grades.indexOf(gradeSplit);

        for (let i = x; i <= grades.length - 1; i++) {
          if (grades[i] === studentData.grade) {
            studentData.num = i;
            return studentData;
          }
        }
      }
      //searches for grades equal to the input grade
      if (studentData.grade === grade) {
        studentData.num = i;
        return studentData;
      }
    });
    student.sort(function (a, b) {
      return a.num - b.num;
    });

    return student;
  },
};
