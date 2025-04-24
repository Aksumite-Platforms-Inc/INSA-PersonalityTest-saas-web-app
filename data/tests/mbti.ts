export const mbtiTest = {
  title: "MBTI Personality Test",
  description:
    "Discover your Myers-Briggs Type Indicator (MBTI) by responding to two sections of questions—one based on paired preferences, and one based on individual trait alignment.",
  pages: {
    page1: [
      { id: 1, left: "makes lists", right: "relies on memory" },
      { id: 2, left: "sceptical", right: "wants to believe" },
      { id: 3, left: "bored by time alone", right: "needs time alone" },
      {
        id: 4,
        left: "accepts things as they are",
        right: "unsatisfied with the way things are",
      },
      {
        id: 5,
        left: "keeps a clean room",
        right: "just puts stuff where ever",
      },
      {
        id: 6,
        left: 'thinks "robotic" is an insult',
        right: "strives to have a mechanical mind",
      },
      { id: 7, left: "energetic", right: "mellow" },
      {
        id: 8,
        left: "prefer to take multiple choice test",
        right: "prefer essay answers",
      },
      { id: 9, left: "chaotic", right: "organized" },
      { id: 10, left: "easily hurt", right: "thick-skinned" },
      { id: 11, left: "works best in groups", right: "works best alone" },
      {
        id: 12,
        left: "focused on the present",
        right: "focused on the future",
      },
      { id: 13, left: "plans far ahead", right: "plans at the last minute" },
      { id: 14, left: "wants people's respect", right: "wants their love" },
      {
        id: 15,
        left: "gets worn out by parties",
        right: "gets fired up by parties",
      },
      { id: 16, left: "fits in", right: "stands out" },
      { id: 17, left: "keeps options open", right: "commits" },
      {
        id: 18,
        left: "wants to be good at fixing things",
        right: "wants to be good at fixing people",
      },
      { id: 19, left: "talks more", right: "listens more" },
      {
        id: 20,
        left: "when describing an event, will tell people what happened",
        right: "when describing an event, will tell people what it meant",
      },
      { id: 21, left: "gets work done right away", right: "procrastinates" },
      { id: 22, left: "follows the heart", right: "follows the head" },
      { id: 23, left: "stays at home", right: "goes out on the town" },
      { id: 24, left: "wants the big picture", right: "wants the details" },
      { id: 25, left: "improvises", right: "prepares" },
      {
        id: 26,
        left: "bases morality on justice",
        right: "bases morality on compassion",
      },
      {
        id: 27,
        left: "finds it difficult to yell very loudly",
        right: "yelling to others when they are far away comes naturally",
      },
      { id: 28, left: "theoretical", right: "empirical" },
      { id: 29, left: "works hard", right: "plays hard" },
      { id: 30, left: "uncomfortable with emotions", right: "values emotions" },
      {
        id: 31,
        left: "likes to perform in front of other people",
        right: "avoids public speaking",
      },
      {
        id: 32,
        left: 'likes to know "who?", "what?", "when?"',
        right: 'likes to know "why?"',
      },
    ],
    page2: [
      {
        id: 1,
        trait: "E",
        text: "I help other shoppers who are at a store and appear to be lost.",
      },
      {
        id: 2,
        trait: "I",
        text: "I obsessively recall recent/past encounters in my head.",
      },
      {
        id: 3,
        trait: "E",
        text: "I appear confident before presentations and tests.",
      },
      {
        id: 4,
        trait: "I",
        text: "I ignore calls and messages, unless it's someone I really want to talk to.",
      },
      {
        id: 5,
        trait: "E",
        text: "When playing video games, I care more about socializing than achievements.",
      },
      {
        id: 6,
        trait: "I",
        text: "I have a small number of lifelong friends, instead of a large group of people to hang out with.",
      },
      {
        id: 7,
        trait: "I",
        text: "I get to know people through text or social media rather than in person.",
      },
      {
        id: 8,
        trait: "S",
        text: "I think physical appearance counts as or reflects/correlates to personality.",
      },
      {
        id: 9,
        trait: "N",
        text: "I often come up with new ideas to make society better.",
      },
      { id: 10, trait: "S", text: "I tend to trip over things often." },
      {
        id: 11,
        trait: "N",
        text: "I recognize the interconnectedness of various subjects.",
      },
      {
        id: 12,
        trait: "S",
        text: "I talk to trees, and feel that I can sense nature.",
      },
      {
        id: 13,
        trait: "N",
        text: "I frequently imagine different possibilities for the future.",
      },
      { id: 14, trait: "S", text: "I frequently check burners/locks." },

      {
        id: 15,
        trait: "F",
        text: "I have extreme fear of failing or looking bad in front of everyone.",
      },
      {
        id: 16,
        trait: "T",
        text: "I will admit to being wrong in order to learn the truth.",
      },
      {
        id: 17,
        trait: "F",
        text: "I refuse to do a job unless it is authentic and aligns with my purpose.",
      },
      {
        id: 18,
        trait: "T",
        text: "I do things usually attributed to men like fixing things and snowmobiling.",
      },
      {
        id: 19,
        trait: "F",
        text: "I hate watching people feel embarrassed / get rejected.",
      },
      {
        id: 20,
        trait: "T",
        text: "I get very frustrated when others insist wrong facts are right.",
      },
      {
        id: 21,
        trait: "F",
        text: "I feel deeply affected when others are upset.",
      },

      {
        id: 22,
        trait: "J",
        text: "I constantly overextend myself (make projects way bigger than needed).",
      },
      {
        id: 23,
        trait: "P",
        text: "I spend more time on learning about new things than focusing on the things that need to be done.",
      },
      {
        id: 24,
        trait: "J",
        text: "I carry additional workload on team projects to achieve better results.",
      },
      {
        id: 25,
        trait: "P",
        text: "I am forgetful when it comes to personal history.",
      },
      { id: 26, trait: "J", text: "I study how to hold on to my money." },
      {
        id: 27,
        trait: "P",
        text: "I'll take a different path home today because I went the other way last time.",
      },
      {
        id: 28,
        trait: "P",
        text: "I'm often unaware of the physical environment.",
      },
    ],
  },
};
