import command from '../../config.json' assert {type: 'json'};

const createProject = () : string[] => {
  let string = "";
  let string2 = "";
  const projects : string[] = [];
  const files = `${command.projects.webdev.length} File(s)`;
  const files1 = `${command.projects.flutterdev.length} File(s)`;
  const files2 = `${command.projects.vrdev.length} File(s)`;
  const files3 = `${command.projects.cybersec.length} File(s)`;
  const files4 = `${command.projects.robotics.length} File(s)`;

  const SPACE = "&nbsp;";

  projects.push("<br>")
  projects.push("Here is an overview of some of my projects domain-wise")
  projects.push("do <span class = 'command'>p/[project name]</span> to get more details about the project")
  projects.push("<br>")

  //Webdev
  projects.push("---> <span class='domainname'>WEB DEV</span>")
  projects.push("<br>")
  
  command.projects.webdev.forEach((ele) => {
    let link = `<span class = 'projectname'>${ele[11]} </span>`
    // string += SPACE.repeat(1);
    string += link;
    string += SPACE.repeat(16 - ele[11].length);
    // string += ele[1];
    // string += SPACE.repeat(20 - ele[1].length);
    string += ele[2];
    string += SPACE.repeat(20 - ele[2].length);
    string += ele[3];
    projects.push(string);
    string2 += SPACE.repeat(2);
    string2 += ele[1];
    projects.push(string2);
    projects.push("<br>");
    string = '';
    string2 = '';
    });

  // projects.push("<br>");
  projects.push(files);
  projects.push("<br>");

  //Appdev
  projects.push("---> <span class='domainname'>FLUTTER DEV</span>")
  projects.push("<br>")
  
  command.projects.flutterdev.forEach((ele) => {
    let link = `<span class = 'projectname'>${ele[11]} </span>`
    // string += SPACE.repeat(1);
    string += link;
    // string += SPACE.repeat(16 - ele[11].length);
    // string += ele[1];
    // string += SPACE.repeat(20 - ele[1].length);
    string += ele[2];
    string += SPACE.repeat(20 - ele[2].length);
    string += ele[3];
    projects.push(string);
    string2 += SPACE.repeat(2);
    string2 += ele[1];
    projects.push(string2);
    projects.push("<br>");
    string = '';
    string2 = '';
    });

  // projects.push("<br>");
  projects.push(files1);
  projects.push("<br>");


  //VR DEV
  projects.push("---> <span class='domainname'>VR DEV</span>")
  projects.push("<br>")
  
  command.projects.vrdev.forEach((ele) => {
    let link = `<span class = 'projectname'>${ele[11]} </span>`
    // string += SPACE.repeat(1);
    string += link;
    string += SPACE.repeat(16 - ele[11].length);
    // string += ele[1];
    // string += SPACE.repeat(20 - ele[1].length);
    string += ele[2];
    string += SPACE.repeat(20 - ele[2].length);
    string += ele[3];
    projects.push(string);
    string2 += SPACE.repeat(2);
    string2 += ele[1];
    projects.push(string2);
    projects.push("<br>");
    string = '';
    string2 = '';
    });

  // projects.push("<br>");
  projects.push(files2);
  projects.push("<br>");


  //CYBER SEC
  projects.push("---> <span class='domainname'>CYBER SECURITY</span>")
  projects.push("<br>")
  
  command.projects.cybersec.forEach((ele) => {
    let link = `<span class = 'projectname'>${ele[11]} </span>`
    // string += SPACE.repeat(1);
    string += link;
    string += SPACE.repeat(16 - ele[11].length);
    // string += ele[1];
    // string += SPACE.repeat(20 - ele[1].length);
    string += ele[2];
    string += SPACE.repeat(20 - ele[2].length);
    string += ele[3];
    projects.push(string);
    string2 += SPACE.repeat(2);
    string2 += ele[1];
    projects.push(string2);
    projects.push("<br>");
    string = '';
    string2 = '';
    });

  // projects.push("<br>");
  projects.push(files3);
  projects.push("<br>");


  //robotics
  projects.push("---> <span class='domainname'>ROBOTICS</span>")
  projects.push("<br>")
  
  command.projects.robotics.forEach((ele) => {
    let link = `<span class = 'projectname'>${ele[11]} </span>`
    // string += SPACE.repeat(1);
    string += link;
    string += SPACE.repeat(16 - ele[11].length);
    // string += ele[1];
    // string += SPACE.repeat(20 - ele[1].length);
    string += ele[2];
    string += SPACE.repeat(20 - ele[2].length);
    string += ele[3];
    projects.push(string);
    string2 += SPACE.repeat(2);
    string2 += ele[1];
    projects.push(string2);
    projects.push("<br>");
    string = '';
    string2 = '';
    });

  // projects.push("<br>");
  projects.push(files4);
  projects.push("<br>");


  return projects
}

export const PROJECTS = createProject()
