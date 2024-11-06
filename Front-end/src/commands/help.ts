import command from '../../config.json' assert {type: 'json'};

const helpObj = {
  "commands": [
    [
    "'about'",
    "Who made this website?",
    ],
    [
      "'projects'",
      "Maybe there's something interesting."
    ],
    [
      "'achievements'",
      "Flex Flex."
    ],
    // 
    //   "'workexp'",
    //   "Display previous work-experinces/internships."
    // ],
    [
      "'whoami'",
      "A perplexing question."
    ],
    ["'banner'",
      "Display the banner."
    ],
    [
      "'clear'",
      "Clear the terminal."
    ],
    [
      "",
      ""
    ],
    [
      "",
      "---[Projects]--"
    ]
  ],
}

const socials = {
  "commands": [
    
    [
      "",
      ""
    ],
    [
      "",
      "---[Socials]--"
    ],
    [
      "'s/github'",
      "Stalk me on GitHub (follow plz)"
    ],
    ["'s/linkedin'",
      "Let's connect on Linkedin"
    ],
    ["'s/discord'",
      "I am a pro-g(r)amer"
    ],
    ["'s/instagram'",
      "Folow me on Instagram"
    ],
    ["'s/gcloud'",
      "Felxin my google cloud skills"
    ],
    ["'s/gdeveloper'",
      "Got to get my eyes on that google-dev profile"
    ],
    ["'s/unity'",
      "Unity plz fix your servers(hire me to do that)"
    ],
    ["'s/email'",
      "Mail me your deepest fears"
    ],
    ["'sudo'",
      "???"
    ],
    ["'hackme'",
      "??hacker"
    ]
  ],
}

const createHelp = () : string[] => {
  const help : string[] = []
  help.push("<br>")

  

  helpObj.commands.forEach((ele) => {
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>";
    string += ele[0];
    string += "</span>";
    
    string += SPACE.repeat(20 - ele[0].length);
    string += ele[1];
    help.push(string);
  })

  // const SPACE = "&nbsp;";
  //   let string = "";
  //   string += SPACE.repeat(1);
  //   string += "<span class='command'>";
  //   string += ele[0];
  //   string += "</span>";
  //   string += SPACE.repeat(16 - ele[0].length);
  //   string += ele[1];
  //   help.push(string);

  command.projects.webdev.forEach((ele) =>{
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>'p/";
    string += ele[0];
    string += "'</span>";
    string += SPACE.repeat(16 - ele[0].length);
    string += ele[1];
    help.push(string);
  })
  command.projects.flutterdev.forEach((ele) =>{
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>'p/";
    string += ele[0];
    string += "'</span>";
    string += SPACE.repeat(16 - ele[0].length);
    string += ele[1];
    help.push(string);
  })
  command.projects.vrdev.forEach((ele) =>{
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>'p/";
    string += ele[0];
    string += "'</span>";
    string += SPACE.repeat(16 - ele[0].length);
    string += ele[1];
    help.push(string);
  })
  command.projects.cybersec.forEach((ele) =>{
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>'p/";
    string += ele[0];
    string += "'</span>";
    string += SPACE.repeat(16 - ele[0].length);
    string += ele[1];
    help.push(string);
  })
  command.projects.robotics.forEach((ele) =>{
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>'p/";
    string += ele[0];
    string += "'</span>";
    string += SPACE.repeat(16 - ele[0].length);
    string += ele[1];
    help.push(string);
  })

  socials.commands.forEach((ele) => {
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(1);
    string += "<span class='command'>";
    string += ele[0];
    string += "</span>";
    
    string += SPACE.repeat(20 - ele[0].length);
    string += ele[1];
    help.push(string);
  })

  help.push("<br>");
  help.push("Press <span class='keys'>[Tab]</span> for auto completion.");
  help.push("Press <span class='keys'>[Esc]</span> to clear the input line.");
  help.push("Press <span class='keys'>[↑][↓]</span> to scroll through your history of commands.");
  help.push("<br>");
  return help
}

export const HELP = createHelp();
