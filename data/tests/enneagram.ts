export const enneagramTest = {
  title: "Enneagram Profile",
  description:
    "Identify your core motivations and personality type according to the Enneagram system.",
  questions: [
    // Type A
    { id: 1, text: "I am too strict with myself and others.", type: "A" },
    {
      id: 2,
      text: "I am always aware of what needs to be corrected.",
      type: "A",
    },
    { id: 3, text: "I am more organized than most.", type: "A" },
    { id: 4, text: "I am more formal than most people.", type: "A" },
    {
      id: 5,
      text: "I often resent it when I see people doing a slack job.",
      type: "A",
    },
    {
      id: 6,
      text: "I am meticulous and fastidious, even about details that other people find minor.",
      type: "A",
    },
    { id: 7, text: "I hold a tight rein on my temper.", type: "A" },
    { id: 8, text: "I can't rest until the job is done.", type: "A" },
    {
      id: 9,
      text: "I have a compulsion to do things the right way, even if it's not cost effective.",
      type: "A",
    },
    {
      id: 10,
      text: "I have been told I am a perfectionist and I suppose it is true.",
      type: "A",
    },
    { id: 11, text: "I seldom compromise my principles.", type: "A" },
    {
      id: 12,
      text: "Sometimes I am too critical of others but I am much harder on myself than I am on others.",
      type: "A",
    },

    // Type B
    {
      id: 13,
      text: "I love to take care of people and I'm good at it.",
      type: "B",
    },
    {
      id: 14,
      text: "It's hard for me to put my feelings aside, even to get a job done.",
      type: "B",
    },
    {
      id: 15,
      text: "In most close relationships, I give more than I take.",
      type: "B",
    },
    { id: 16, text: "I am more loving than most people.", type: "B" },
    {
      id: 17,
      text: "I try to get closer to people by being generous with my time and energy.",
      type: "B",
    },
    {
      id: 18,
      text: "Sometimes I have overextended myself in trying to help people.",
      type: "B",
    },
    { id: 19, text: "No one would ever call me selfish!", type: "B" },
    {
      id: 20,
      text: "Others need my assistance much more than I need theirs.",
      type: "B",
    },
    {
      id: 21,
      text: "People see me as a warm and sympathetic person.",
      type: "B",
    },
    {
      id: 22,
      text: "Life's about give and take, so giving love is the most important thing in my life.",
      type: "B",
    },
    {
      id: 23,
      text: "I'm proud of the fact that many people depend on me.",
      type: "B",
    },
    { id: 24, text: "I'm good at motivating people.", type: "B" },

    // Type C
    {
      id: 25,
      text: "Success, prestige, and recognition really matter to me.",
      type: "C",
    },
    {
      id: 26,
      text: "It's important to me that I be admired by others - and many people do admire me.",
      type: "C",
    },
    {
      id: 27,
      text: "For better or worse, I compare myself to others to assess how I'm doing.",
      type: "C",
    },
    {
      id: 28,
      text: "I am a good networker; I know how to make connections.",
      type: "C",
    },
    {
      id: 29,
      text: "People are attracted to me because I impress them.",
      type: "C",
    },
    {
      id: 30,
      text: "I am competitive and ambitious, but I do not think of myself as cut throat.",
      type: "C",
    },
    {
      id: 31,
      text: "It would be the worst thing to be seen by others as a loser.",
      type: "C",
    },
    { id: 32, text: "I am good at getting things done.", type: "C" },
    {
      id: 33,
      text: "It is important to me that I win the respect of others.",
      type: "C",
    },
    {
      id: 34,
      text: "Even if I don't have it all together, at least I'm going to seem to have it all together.",
      type: "C",
    },
    { id: 35, text: "I'll do what it takes to be successful.", type: "C" },
    {
      id: 36,
      text: "I have a real sensitivity to how my presentation is affecting others and I can alter it if I have to.",
      type: "C",
    },

    // Type D
    {
      id: 37,
      text: "I am more sensitive than most people; sometimes the world just seems too harsh.",
      type: "D",
    },
    { id: 38, text: "I am highly individualistic.", type: "D" },
    {
      id: 39,
      text: "I am more temperamental than most but it's because my feelings are so strong.",
      type: "D",
    },
    {
      id: 40,
      text: "I am drawn to emotional intensity and am not afraid to explore the depths.",
      type: "D",
    },
    {
      id: 41,
      text: "It's strange but I think that there is something beautiful about sadness.",
      type: "D",
    },
    {
      id: 42,
      text: "I want to be noticed but it also makes me uncomfortable.",
      type: "D",
    },
    {
      id: 43,
      text: "Most people don't know that I am actually really sensitive, as I tend to conceal my emotions.",
      type: "D",
    },
    {
      id: 44,
      text: "I don't let it show, but if I'm with someone who is as unique as I am, I get a bit jealous.",
      type: "D",
    },
    { id: 45, text: "I am more dramatic than most.", type: "D" },
    {
      id: 46,
      text: "I tend to escape reality into a world of idealized fantasy.",
      type: "D",
    },
    {
      id: 47,
      text: "The aesthetics of my surroundings has a strong influence on my mood.",
      type: "D",
    },
    {
      id: 48,
      text: "I enjoy remembering the past even if it is a bit melancholic.",
      type: "D",
    },

    // Type E
    {
      id: 49,
      text: "I often refrain from acting, as I'm afraid of being overwhelmed.",
      type: "E",
    },
    {
      id: 50,
      text: "I am uncomfortable when people want an emotional response from me.",
      type: "E",
    },
    {
      id: 51,
      text: "I avoid expressing strong emotions.",
      type: "E",
    },
    {
      id: 52,
      text: "I want to observe and think, without giving myself away, before I go into action.",
      type: "E",
    },
    {
      id: 53,
      text: "If I'm not careful, I can get too isolated from others.",
      type: "E",
    },
    {
      id: 54,
      text: "I accumulate lots of knowledge to counteract my lack of self-confidence.",
      type: "E",
    },
    {
      id: 55,
      text: "I tend not to consider asking help from others, even from those I love.",
      type: "E",
    },
    {
      id: 56,
      text: "I'm not comfortable with self-revelation.",
      type: "E",
    },
    {
      id: 57,
      text: "I tend to have mixed feelings about many people.",
      type: "E",
    },
    {
      id: 58,
      text: "Sometimes I don't know what I'm feeling until I've had a chance to think about it.",
      type: "E",
    },
    {
      id: 59,
      text: "While I value my close relationships, I often feel most myself when I am alone.",
      type: "E",
    },
    {
      id: 60,
      text: "When I really get involved in an intellectual problem that stimulates me, I tend to detach from my emotions.",
      type: "E",
    },

    // Type F
    {
      id: 61,
      text: "I want to win the approval of those in authority, sometimes even when I don't really like them.",
      type: "F",
    },
    {
      id: 62,
      text: "I am skeptical, suspicious and doubtful.",
      type: "F",
    },
    {
      id: 63,
      text: "Even though it is frequently irrational, I sometimes worry whether people are talking about me behind my back.",
      type: "F",
    },
    {
      id: 64,
      text: "While I am very loyal myself, I frequently worry that others are not going to be loyal to me.",
      type: "F",
    },
    {
      id: 65,
      text: "I am attuned to anything that might be dangerous and I am security conscious.",
      type: "F",
    },
    {
      id: 66,
      text: "It's important to me to feel as though I 'belong.'",
      type: "F",
    },
    {
      id: 67,
      text: "To deal with the fear I always have, I'm as nice and warm as possible towards everyone.",
      type: "F",
    },
    {
      id: 68,
      text: "I'm constantly on the lookout for things that might go wrong.",
      type: "F",
    },
    {
      id: 69,
      text: "Change - whether to a new job or new school, makes me more anxious than it does most people.",
      type: "F",
    },
    {
      id: 70,
      text: "It takes me quite a lot of time and effort to make important decisions and I frequently second guess myself.",
      type: "F",
    },
    {
      id: 71,
      text: "People often aren't what they seem, so I can really be suspicious of their motives.",
      type: "F",
    },
    {
      id: 72,
      text: "I can easily imagine all the things that might go wrong, as I have a really vivid imagination.",
      type: "F",
    },

    // Type G
    {
      id: 73,
      text: "I don't get depressed easily, if at all.",
      type: "G",
    },
    {
      id: 74,
      text: "I plan the next adventure before the current one is finished.",
      type: "G",
    },
    {
      id: 75,
      text: "I don't mind taking a risk; I really like to beat the odds.",
      type: "G",
    },
    {
      id: 76,
      text: "I get bored more easily than most people; I am always looking for new experiences.",
      type: "G",
    },
    {
      id: 77,
      text: "I don't like commitment. Who wants to be locked into something, especially if something better presents itself?",
      type: "G",
    },
    {
      id: 78,
      text: "When making a decision, I often ask myself 'which option will yield the maximum enjoyment?'.",
      type: "G",
    },
    {
      id: 79,
      text: "I'm a brainstormer. For every problem, I can think of 10 approaches to a solution.",
      type: "G",
    },
    {
      id: 80,
      text: "I want to enjoy things, so I'm not very disciplined.",
      type: "G",
    },
    {
      id: 81,
      text: "It's hard to stay passionate and focused.",
      type: "G",
    },
    {
      id: 82,
      text: "I generally don't like to stay at one task for very long. I get restless and want to move onto something else.",
      type: "G",
    },
    {
      id: 83,
      text: "I'm really good with the big picture but I don't have much patience with detail work.",
      type: "G",
    },
    {
      id: 84,
      text: "I secretly fear deprivation and being without the nicer things of life.",
      type: "G",
    },

    // Type H
    {
      id: 85,
      text: "I'm pretty domineering.",
      type: "H",
    },
    {
      id: 86,
      text: "Your happiness and your feelings are your responsibility, not mine.",
      type: "H",
    },
    {
      id: 87,
      text: "Rules annoy me.",
      type: "H",
    },
    {
      id: 88,
      text: "I come on pretty strong and can sometimes intimidate people.",
      type: "H",
    },
    {
      id: 89,
      text: "I welcome a good fight as it clears the air.",
      type: "H",
    },
    {
      id: 90,
      text: "I almost never lose control of myself.",
      type: "H",
    },
    {
      id: 91,
      text: "I think it's weak to back down from confrontation.",
      type: "H",
    },
    {
      id: 92,
      text: "I'm pretty tough.",
      type: "H",
    },
    {
      id: 93,
      text: "I have been told that I lack tact but I think the important thing is to tell the truth.",
      type: "H",
    },
    {
      id: 94,
      text: "My tendency to tell people what's wrong and what they should do about it has sometimes annoyed them.",
      type: "H",
    },
    {
      id: 95,
      text: "I have more energy and strength than most people.",
      type: "H",
    },
    {
      id: 96,
      text: "I don't give a damn about morality but I've got my own brand of integrity.",
      type: "H",
    },

    // Type I
    {
      id: 97,
      text: "I tend to trust most people.",
      type: "I",
    },
    {
      id: 98,
      text: "I could probably use a little more ambition.",
      type: "I",
    },
    {
      id: 99,
      text: "It's easy for me to accept other people, and they seem comfortable around me because I don't judge them.",
      type: "I",
    },
    {
      id: 100,
      text: "I'm quite unobtrusive and easy to get along with.",
      type: "I",
    },
    {
      id: 101,
      text: "Nobody likes to be intruded upon, but I hate it!",
      type: "I",
    },
    {
      id: 102,
      text: "I go along with what others want unless I have a very strong desire of my own, which I usually don't.",
      type: "I",
    },
    {
      id: 103,
      text: "I tend to avoid conflict.",
      type: "I",
    },
    {
      id: 104,
      text: "I don't tend to over commit myself - I have a limited amount of time and energy.",
      type: "I",
    },
    {
      id: 105,
      text: "Usually I just focus on the positive sides of people, as focusing on negative traits or events does not help making relationships more harmonious.",
      type: "I",
    },
    {
      id: 106,
      text: "I often lose my focus as my attention tends to drift off from the main issues.",
      type: "I",
    },
    {
      id: 107,
      text: "I generally appear calm and even tempered, even when I am under an enormous strain.",
      type: "I",
    },
    {
      id: 108,
      text: "I see all points of view when there is a dispute, so it's hard for me to take a side.",
      type: "I",
    },
  ],
  options: [
    { value: "1", label: "No" },
    { value: "2", label: "Partly" },
    { value: "3", label: "Yes" },
  ],
};
