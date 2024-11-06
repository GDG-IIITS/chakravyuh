import command from '../../config.json' assert {type: 'json'};

const createAbout = () : string[] => {
  const about : string[] = [];

  const SPACE = "&nbsp;";

  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";
  
  const email = `<i class='fa-solid fa-envelope'></i> ${EMAIL}`;   
  const github = `<i class='fa-brands fa-github'></i> ${GITHUB}`;
  const linkedin = `<i class='fa-brands fa-linkedin'></i> ${LINKEDIN}`;
  let string = "";

  about.push("<br>");
  about.push("Hello I am Abhijit Patil 🖐️,");
  about.push(command.aboutGreeting);
  about.push("currently attending IIIT Sri City in ECE branch.📍");
  about.push(command.aboutSkills);
  about.push("so don't judge me just yet.");
  about.push(command.aboutSkills1);
  about.push("<span class='command'>'projects'</span> + enter");
  about.push("to understand me better 😊.");
  about.push("<br>");
  about.push("But other than that, I am a simple man,");
  about.push("a student in the daytime 👨‍🎓");
  about.push("and a programmer in the night time, 👨‍💻");
  about.push("working on the next Big thing from my dorm room.💻");
  about.push("If you liked this website, reach out to me !!");
  about.push("<br>");
  string += SPACE.repeat(1);
  string += email;
  string += SPACE.repeat(16 - EMAIL.length);
  string += `<a target='_blank' href='mailto:${command.emailLink}?Subject=Hello&body=Just saw yuor website and it amazed me'>${command.social.email}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(1);
  string += github;
  string += SPACE.repeat(16 - GITHUB.length);
  string += `<a target='_blank' href='${command.gitLink}'>${command.social.github}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(1);
  string += linkedin;
  string += SPACE.repeat(16 - LINKEDIN.length);  
  string += `<a target='_blank' href='${command.linkedinLink}'>${command.social.linkedin}</a>`;
  about.push(string);

  about.push("<br>");
  return about
}

export const ABOUT = createAbout();
