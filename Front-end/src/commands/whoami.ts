const whoamiObj = {
  "message" : [
    [
      "In the kaleidoscope of existence,",
      "I am but a reflection questioning the enigma - "
    ],
    [
      "Amidst cosmic whispers,",
      "I navigate the maze of self-discovery,",
      "echoing the eternal refrain - "
    ],
    [
      "In the symphony of life,",
      "I am a note inquiring its own melody,",
      "harmonizing with the universal query - ",
    ],
    [
      "As stardust contemplating its journey,",
      "I ponder the cosmic query,",
      "silently asking - ",
    ],
    [
      "In the tapestry of reality,",
      "I am the thread of self-inquiry,",
      "weaving through the eternal question - "
    ],
    [
      "Some people read Some people can read War and Peace,",
      "and come away thinking it's a simple adventure story.",
      "Others can read the ingredients on a chewing gum wrapper,",
      "and unlock the secrets of the universe - ",
      
    ],
  ],
}

export const createWhoami = () : string[] => {
  const whoami : string[] = [];  
  const r = Math.floor(Math.random() * whoamiObj.message.length);
  whoami.push("<br>");

  whoamiObj.message[r].forEach((ele, idx) => {
    if (idx === whoamiObj.message[r].length - 1) {
      ele += "<span class='command'>who am I?</span>";
    }
    whoami.push(ele);
  });

  whoami.push("<br>");

  return whoami
}
