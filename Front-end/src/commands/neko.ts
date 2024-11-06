import command from '../../config.json' assert {type: 'json'};

const createNeko = () : string[] => {
  const Neko : string[] = [];

  
  

  Neko.push("<br>");
  Neko.push(command.neko);
 
  Neko.push("<br>");
  
  Neko.push("<br>");
  return Neko
}

export const Neko = createNeko();
