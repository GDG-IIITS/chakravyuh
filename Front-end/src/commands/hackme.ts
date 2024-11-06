import command from '../../config.json' assert {type: 'json'};

const createHackme = () : string[] => {
  const Hackme : string[] = [];

  
  

  Hackme.push("<br>");
  Hackme.push(command.hackme);
  Hackme.push(command.hackme1);
 
  Hackme.push("<br>");
  
  Hackme.push("<br>");
  return Hackme
}

export const Hackme = createHackme();
