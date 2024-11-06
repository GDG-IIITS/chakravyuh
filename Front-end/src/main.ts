import command from '../config.json' assert {type: 'json'};
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about"
import { DEFAULT } from "./commands/default";
import { PROJECTS } from "./commands/projects";
import { createWhoami } from "./commands/whoami";
import { Hackme } from "./commands/hackme";
import { Neko } from "./commands/neko";
import { ACHIEVEMENTS } from "./commands/achievements";

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0
let tempInput = ""
let userInput : string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;

//WRITELINESCOPY is used to during the "clear" command
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById("password-field") as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const PROMPT = document.getElementById("prompt");
const COMMANDS = ["help", "about", "projects", "whoami", "banner", "clear", "hackme", "sudo", "s/github", "s/linkedin", "s/instagram", "s/discord", "s/gcloud", "s/gdeveloper", "s/unity", "s/email", "achievements", "p/insiiits"];
const HISTORY : string[] = [];
const SUDO_PASSWORD = command.password;
const GIT_LINK = command.gitLink;
const LINKEDIN_LINK = command.linkedinLink;
const INSTAGRAM_LINK = command.instagramLink;
const GCLOUD_LINK = command.gcloudLink;
const GPROFILE_LINK = command.gprofileLink;
const UNITY_LINK = command.unityLink;
const DISCORD_LINK = command.discordLink;
const EMAIL_LINK = command.emailLink;


const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if(!MAIN) return

  MAIN.scrollTop = MAIN.scrollHeight;
}

function userInputHandler(e : KeyboardEvent) {
  const key = e.key;

  switch(key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }

      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;

  if (bareMode) {
    newUserInput = userInput;
  } else {
    newUserInput = `<span class='output'>${userInput}</span>`;
  }

  HISTORY.push(userInput);
  historyIdx = HISTORY.length

  //if clear then early return
  if (userInput === 'clear') {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return
  }

  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
      commandHandler(userInput.toLowerCase().trim());
    }
  
  USERINPUT.value = resetInput;
  userInput = resetInput; 
}

function tabKey() {
  let currInput = USERINPUT.value;

  for (const ele of COMMANDS) {
    if(ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return
    }
  }
}

function arrowKeys(e : string) {
  switch(e){
    case "ArrowDown":      
      if (historyIdx !== HISTORY.length) {
          historyIdx += 1;
          USERINPUT.value = HISTORY[historyIdx];
          if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;  
      }      
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

function commandHandler(input : string) {
  if(input.startsWith("rm -rf") && input.trim() !== "rm -rf") {
    if (isSudo) {
      if(input === "rm -rf src" && !bareMode) {
        bareMode = true;

        setTimeout(() => {
          if(!TERMINAL || !WRITELINESCOPY) return
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });

        easterEggStyles();
        setTimeout(() => {
          writeLines(["What made you think that was a good idea?", "<br>"]);
        }, 200)

        setTimeout(() => {
          writeLines(["Now everything is ruined. (P.S : you succesfully hacked the website, send me this image and claim your respect)", "<br>"]);
        }, 1200)

        } else if (input === "rm -rf src" && bareMode) {
          writeLines(["there's no more src folder.", "<br>"])
        } else {
          if(bareMode) {
            writeLines(["What else are you trying to delete?", "<br>"])
          } else {
            writeLines(["<br>", "Directory not found.", "type <span class='command'>'ls'</span> for a list of directories.", "<br>"]);
          }
        } 
      } else {
        writeLines(["Permission not granted.", "<br>"]);
    }
    return
  }
  if (input.startsWith("p/")) {

    let i = 0;

    for(const ele of command.projects.webdev){

      if (ele[0] == input.slice(2) ) {

        writeLines(createProject(ele))
        
      }
      else{
        i ++ ;
      }
    }
    for(const ele of command.projects.flutterdev){

      if (ele[0] == input.slice(2) ) {

        writeLines(createProject(ele))
        
      }else{
        i ++ ;
      }
    
    }
    for(const ele of command.projects.vrdev){

      if (ele[0] == input.slice(2) ) {

        writeLines(createProject(ele))
        
      }else{
        i ++ ;
      }
    
    }
    for(const ele of command.projects.cybersec){

      if (ele[0] == input.slice(2) ) {

        writeLines(createProject(ele))
        
      }else{
        i ++ ;
      }
    
    }
    for(const ele of command.projects.robotics){

      if (ele[0] == input.slice(2) ) {

        writeLines(createProject(ele))
        
      }else{
        i ++ ;
      }
    }
    if (i >= 100) {
      writeLines(DEFAULT);

      i=0;
    }
    
  }
  switch(input) {
    
    case 'clear':
      setTimeout(() => {
        if(!TERMINAL || !WRITELINESCOPY) return
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      })
      break;
    case 'banner':
      if(bareMode) {
        writeLines(["WebShell v1.0.0", "<br>"])
        break;
      }
      writeLines(BANNER);
      break;
    case 'help':
      if(bareMode) {
        writeLines(["maybe restarting your browser will fix this.", "<br>"])
        break;
      }
      writeLines(HELP);
      break;
    case 'whoami':      
      if(bareMode) {
        writeLines([`${command.username}`, "<br>"])
        break;
      }
      writeLines(createWhoami());
      break;
    case 'about':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      writeLines(ABOUT);
      break;
    case 'projects':
      if(bareMode) {
        writeLines(["I don't want you to break the other projects.", "<br>"])
        break;
      }
      writeLines(PROJECTS);
      break;
    case 'achievements':
      if(bareMode) {
        writeLines(["I don't want you to break the other things.", "<br>"])
        break;
      }
      writeLines(ACHIEVEMENTS);
      break;
    case 's/github':
      writeLines(["Redirecting to github.com...", "<br>"]);
      setTimeout(() => {
        window.open( GIT_LINK, '_blank');
      }, 500);
      break;
      case 'hackme':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      writeLines(Hackme);
      break;
      case 'neko':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      writeLines(Neko);
      break;
    case 's/linkedin':
      writeLines(["Redirecting to linkedin...", "<br>"]);
      setTimeout(() => {
        window.open( LINKEDIN_LINK, '_blank');
      }, 500);
     break;
    case 's/discord':
      writeLines(["Redirecting to discord...", "<br>"]);
      setTimeout(() => {
        window.open( DISCORD_LINK, '_blank');
      }, 500);
     break;
    case 's/instagram':
      writeLines(["Redirecting to instagram...", "<br>"]);
      setTimeout(() => {
        window.open( INSTAGRAM_LINK, '_blank');
      }, 500);
     break;
    case 's/gcloud':
      writeLines(["Redirecting to google cloud profile...", "<br>"]);
      setTimeout(() => {
        window.open( GCLOUD_LINK, '_blank');
      }, 500);
     break;
    case 's/gdeveloper':
      writeLines(["Redirecting to google developer profile...", "<br>"]);
      setTimeout(() => {
        window.open( GPROFILE_LINK, '_blank');
      }, 500);
     break;
    case 's/unity':
      writeLines(["Redirecting to unity learn profile...", "<br>"]);
      setTimeout(() => {
        window.open( UNITY_LINK, '_blank');
      }, 500);
      break;
    
    case 's/email':
      writeLines(["Redirecting to email...", "<br>"]);
      setTimeout(() => {
        window.open( EMAIL_LINK, '_blank');
      }, 500);
      break;
      
    
    case 'rm -rf':
      if (bareMode) {
        writeLines(["don't try again.", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>", "<br>"]);
      } else {
        writeLines(["Permission not granted.", "<br>"])
      }
        break;
    case 'sudo':
      if(bareMode) {
        writeLines(["no.", "<br>"])
        break;
      }
      if(!PASSWORD) return
      isPasswordInput = true;
      USERINPUT.disabled = true;

      if(INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => {
        PASSWORD_INPUT.focus();
      }, 100);

      break;
    case 'p/insiiits':
      
      break;
    case 'ls':
      if(bareMode) {
        writeLines(["", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["src", "<br>"]);
      } else {
        writeLines(["Permission not granted.", "<br>"]);
      }
      break;
    default:
      if (input.startsWith("p/")) {
        break;
      }
      if(bareMode) {
        writeLines(["type 'help'", "<br>"])
        break;
      }

      writeLines(DEFAULT);
      break;
  }  
}

function writeLines(message : string[]) {
  message.forEach((item, idx) => {
    displayText(item, idx);
  });
}

function displayText(item : string, idx : number) {
  setTimeout(() => {
    if(!mutWriteLines) return
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

const createProject = (ele: string[]) : string[] => {

  const project : string[] = [];

  project.push("<br>")
  let string = "";
  const SPACE = "&nbsp;";
  
  string += "---><span class='name'>";
  string += ele[11];
  string += "</span>";
  string += SPACE.repeat(16 - ele[0].length);
  
  project.push(string)
  project.push("<br>")
  
  project.push(ele[1])
  project.push("<br>")
  project.push(ele[2])
  project.push(ele[3])
  project.push(ele[9])
  project.push(ele[10])
  project.push("<br>")

  project.push(ele[4])
  project.push(ele[5])
  project.push(ele[6])
  project.push(ele[7])
  project.push(ele[8])
  project.push("<br>")

  project.push(ele[14])
  project.push(ele[15])
  project.push(ele[16])



  return project
}


function revertPasswordChanges() {
    if (!INPUT_HIDDEN || !PASSWORD) return
    PASSWORD_INPUT.value = "";
    USERINPUT.disabled = false;
    INPUT_HIDDEN.style.display = "block";
    PASSWORD.style.display = "none";
    isPasswordInput = false;

    setTimeout(() => {
      USERINPUT.focus();
    }, 200)
}

function passwordHandler() {
  if (passwordCounter === 2) {
    if (!INPUT_HIDDEN || !mutWriteLines || !PASSWORD) return
    writeLines(["<br>", "INCORRECT PASSWORD.", "PERMISSION NOT GRANTED.", "<br>"])
    revertPasswordChanges();
    passwordCounter = 0;
    return
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return
    writeLines(["<br>", "PERMISSION GRANTED.", "Try <span class='command'>'rm -rf'</span>", "<br>"])
    revertPasswordChanges();
    isSudo = true;
    return
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

function easterEggStyles() {   
  const bars = document.getElementById("bars");
  const body = document.body;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");

  if (!bars) return
  bars.innerHTML = "";
  bars.remove()

  if (main) main.style.border = "none";

  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";

  for (let i = 0; i < span.length; i++) {
    span[i].style.color = "white";
  }

  USERINPUT.style.backgroundColor = "black";
  USERINPUT.style.color = "white";
  USERINPUT.style.fontFamily = "VT323, monospace";
  USERINPUT.style.fontSize = "20px";
  if (PROMPT) PROMPT.style.color = "white";

}

const initEventListeners = () => {
  if(HOST) {
    HOST.innerText= command.hostname;
  }

  if(USER) {
    USER.innerText = command.username;
  }

  if(PRE_HOST) {
    PRE_HOST.innerText= command.hostname;
  }

  if(PRE_USER) {
    PRE_USER.innerText = command.username;
  } 

    window.addEventListener('load', () => {
    writeLines(BANNER);
  });
  
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);

  window.addEventListener('click', () => {
    USERINPUT.focus();
  });

  // console.log(`%cPassword: ${command.password}`, "color: red; font-size: 20px;");
}

initEventListeners();
