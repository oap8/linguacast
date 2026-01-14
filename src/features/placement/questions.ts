import { QuizQuestion, CEFRLevel } from './types';

export const placementQuestions: QuizQuestion[] = [
  // ============================================
  // A1 Level - Basic vocabulary, simple sentences, basic prepositions
  // ============================================
  {
    id: 'a1-1',
    level: 'A1',
    question: 'What is the correct greeting for the morning?',
    options: ['Good night', 'Good morning', 'Good evening', 'Goodbye'],
    correctAnswer: 1,
  },
  {
    id: 'a1-2',
    level: 'A1',
    question: 'Choose the correct sentence: "I ___ a student."',
    options: ['is', 'am', 'are', 'be'],
    correctAnswer: 1,
  },
  {
    id: 'a1-3',
    level: 'A1',
    question: 'What color is the sky on a sunny day?',
    options: ['Green', 'Red', 'Blue', 'Yellow'],
    correctAnswer: 2,
  },
  {
    id: 'a1-4',
    level: 'A1',
    question: 'How do you say "thank you" politely?',
    options: ['Thanks a lot', 'Thank you very much', 'Thanks', 'All of the above'],
    correctAnswer: 3,
  },
  {
    id: 'a1-5',
    level: 'A1',
    question: '"She ___ two brothers." Choose the correct verb.',
    options: ['have', 'has', 'having', 'haves'],
    correctAnswer: 1,
  },
  {
    id: 'a1-6',
    level: 'A1',
    question: 'What is the opposite of "big"?',
    options: ['Large', 'Small', 'Tall', 'Wide'],
    correctAnswer: 1,
  },
  // A1 Prepositions
  {
    id: 'a1-7',
    level: 'A1',
    question: 'The book is ___ the table.',
    options: ['on', 'at', 'of', 'to'],
    correctAnswer: 0,
  },
  {
    id: 'a1-8',
    level: 'A1',
    question: 'She lives ___ London.',
    options: ['on', 'at', 'in', 'to'],
    correctAnswer: 2,
  },
  {
    id: 'a1-9',
    level: 'A1',
    question: 'I go to school ___ bus.',
    options: ['on', 'by', 'in', 'with'],
    correctAnswer: 1,
  },
  {
    id: 'a1-10',
    level: 'A1',
    question: 'The cat is ___ the chair.',
    options: ['under', 'at', 'of', 'to'],
    correctAnswer: 0,
  },
  {
    id: 'a1-11',
    level: 'A1',
    question: 'We have class ___ Monday.',
    options: ['in', 'at', 'on', 'by'],
    correctAnswer: 2,
  },
  {
    id: 'a1-12',
    level: 'A1',
    question: 'The picture is ___ the wall.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 1,
  },

  // ============================================
  // A2 Level - Elementary grammar, everyday situations, more prepositions
  // ============================================
  {
    id: 'a2-1',
    level: 'A2',
    question: '"I ___ to the cinema yesterday." Choose the correct form.',
    options: ['go', 'went', 'going', 'goes'],
    correctAnswer: 1,
  },
  {
    id: 'a2-2',
    level: 'A2',
    question: 'Which sentence is correct?',
    options: [
      'He don\'t like coffee',
      'He doesn\'t likes coffee',
      'He doesn\'t like coffee',
      'He not like coffee',
    ],
    correctAnswer: 2,
  },
  {
    id: 'a2-3',
    level: 'A2',
    question: '"There are ___ apples on the table."',
    options: ['a', 'an', 'some', 'any'],
    correctAnswer: 2,
  },
  {
    id: 'a2-4',
    level: 'A2',
    question: 'What time is it? "It\'s half past three" means:',
    options: ['3:00', '3:15', '3:30', '3:45'],
    correctAnswer: 2,
  },
  {
    id: 'a2-5',
    level: 'A2',
    question: '"She is ___ than her sister."',
    options: ['tall', 'taller', 'tallest', 'more tall'],
    correctAnswer: 1,
  },
  {
    id: 'a2-6',
    level: 'A2',
    question: 'Which word means "not expensive"?',
    options: ['Cheap', 'Dear', 'Costly', 'Pricey'],
    correctAnswer: 0,
  },
  // A2 Prepositions
  {
    id: 'a2-7',
    level: 'A2',
    question: 'I am interested ___ learning English.',
    options: ['on', 'in', 'at', 'for'],
    correctAnswer: 1,
  },
  {
    id: 'a2-8',
    level: 'A2',
    question: 'She is afraid ___ spiders.',
    options: ['from', 'at', 'of', 'by'],
    correctAnswer: 2,
  },
  {
    id: 'a2-9',
    level: 'A2',
    question: 'He arrived ___ the airport at 6 PM.',
    options: ['in', 'on', 'at', 'to'],
    correctAnswer: 2,
  },
  {
    id: 'a2-10',
    level: 'A2',
    question: 'The movie starts ___ 8 o\'clock.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 2,
  },
  {
    id: 'a2-11',
    level: 'A2',
    question: 'I\'m looking ___ my keys. Have you seen them?',
    options: ['at', 'for', 'after', 'on'],
    correctAnswer: 1,
  },
  {
    id: 'a2-12',
    level: 'A2',
    question: 'She walked ___ the room and sat down.',
    options: ['into', 'in', 'at', 'on'],
    correctAnswer: 0,
  },

  // ============================================
  // B1 Level - Intermediate grammar, expressing opinions, complex prepositions
  // ============================================
  {
    id: 'b1-1',
    level: 'B1',
    question: '"If I ___ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correctAnswer: 2,
  },
  {
    id: 'b1-2',
    level: 'B1',
    question: '"She has been working here ___ five years."',
    options: ['for', 'since', 'during', 'while'],
    correctAnswer: 0,
  },
  {
    id: 'b1-3',
    level: 'B1',
    question: 'Which sentence uses the present perfect correctly?',
    options: [
      'I have seen that movie yesterday',
      'I saw that movie already',
      'I have already seen that movie',
      'I have see that movie',
    ],
    correctAnswer: 2,
  },
  {
    id: 'b1-4',
    level: 'B1',
    question: '"He asked me ___ I could help him."',
    options: ['that', 'if', 'what', 'when'],
    correctAnswer: 1,
  },
  {
    id: 'b1-5',
    level: 'B1',
    question: 'What does "break the ice" mean?',
    options: [
      'To destroy something frozen',
      'To start a conversation in a social situation',
      'To cool down a drink',
      'To be very cold',
    ],
    correctAnswer: 1,
  },
  {
    id: 'b1-6',
    level: 'B1',
    question: '"The meeting ___ cancelled due to bad weather."',
    options: ['is', 'was', 'has', 'been'],
    correctAnswer: 1,
  },
  // B1 Prepositions
  {
    id: 'b1-7',
    level: 'B1',
    question: 'She\'s been living here ___ 2015.',
    options: ['for', 'since', 'from', 'during'],
    correctAnswer: 1,
  },
  {
    id: 'b1-8',
    level: 'B1',
    question: 'I apologized ___ being late.',
    options: ['for', 'about', 'of', 'to'],
    correctAnswer: 0,
  },
  {
    id: 'b1-9',
    level: 'B1',
    question: 'He succeeded ___ passing the exam.',
    options: ['at', 'on', 'in', 'for'],
    correctAnswer: 2,
  },
  {
    id: 'b1-10',
    level: 'B1',
    question: 'I\'m not used ___ waking up early.',
    options: ['for', 'at', 'to', 'with'],
    correctAnswer: 2,
  },
  {
    id: 'b1-11',
    level: 'B1',
    question: 'They insisted ___ paying for dinner.',
    options: ['on', 'for', 'to', 'at'],
    correctAnswer: 0,
  },
  {
    id: 'b1-12',
    level: 'B1',
    question: 'This book is different ___ the one I read before.',
    options: ['than', 'from', 'to', 'with'],
    correctAnswer: 1,
  },

  // ============================================
  // B2 Level - Upper-intermediate, complex structures, advanced prepositions
  // ============================================
  {
    id: 'b2-1',
    level: 'B2',
    question: '"Had I known about the problem, I ___ you."',
    options: [
      'would help',
      'would have helped',
      'will help',
      'helped',
    ],
    correctAnswer: 1,
  },
  {
    id: 'b2-2',
    level: 'B2',
    question: 'Which sentence contains a relative clause?',
    options: [
      'The book is on the table',
      'The man who lives next door is a doctor',
      'She went to the store quickly',
      'They are playing football',
    ],
    correctAnswer: 1,
  },
  {
    id: 'b2-3',
    level: 'B2',
    question: '"She denied ___ the window."',
    options: ['to break', 'breaking', 'break', 'broke'],
    correctAnswer: 1,
  },
  {
    id: 'b2-4',
    level: 'B2',
    question: 'What does "to be on the fence" mean?',
    options: [
      'To be in a dangerous position',
      'To be undecided about something',
      'To be physically on a fence',
      'To be angry at someone',
    ],
    correctAnswer: 1,
  },
  {
    id: 'b2-5',
    level: 'B2',
    question: '"Not only ___ late, but he also forgot the documents."',
    options: ['he was', 'was he', 'he is', 'is he'],
    correctAnswer: 1,
  },
  {
    id: 'b2-6',
    level: 'B2',
    question: '"The project ___ by the time you arrive."',
    options: [
      'will complete',
      'will be completed',
      'will have been completed',
      'is completed',
    ],
    correctAnswer: 2,
  },
  // B2 Prepositions
  {
    id: 'b2-7',
    level: 'B2',
    question: 'The decision was made ___ behalf of the entire team.',
    options: ['in', 'on', 'at', 'for'],
    correctAnswer: 1,
  },
  {
    id: 'b2-8',
    level: 'B2',
    question: 'She\'s quite capable ___ handling the situation.',
    options: ['for', 'of', 'to', 'at'],
    correctAnswer: 1,
  },
  {
    id: 'b2-9',
    level: 'B2',
    question: 'The changes were implemented ___ accordance with the new policy.',
    options: ['on', 'at', 'in', 'by'],
    correctAnswer: 2,
  },
  {
    id: 'b2-10',
    level: 'B2',
    question: 'He was accused ___ stealing the documents.',
    options: ['for', 'of', 'with', 'about'],
    correctAnswer: 1,
  },
  {
    id: 'b2-11',
    level: 'B2',
    question: '___ spite of the rain, they continued the match.',
    options: ['In', 'On', 'At', 'With'],
    correctAnswer: 0,
  },
  {
    id: 'b2-12',
    level: 'B2',
    question: 'The report was submitted ___ advance of the deadline.',
    options: ['on', 'at', 'in', 'by'],
    correctAnswer: 2,
  },

  // ============================================
  // C1 Level - Advanced nuanced language, sophisticated prepositions
  // ============================================
  {
    id: 'c1-1',
    level: 'C1',
    question: '"___ his lack of experience, he managed to complete the task successfully."',
    options: ['Despite', 'Although', 'However', 'Moreover'],
    correctAnswer: 0,
  },
  {
    id: 'c1-2',
    level: 'C1',
    question: 'Which sentence demonstrates correct use of subjunctive mood?',
    options: [
      'I wish I was there',
      'I suggest that he goes home',
      'It is essential that she be present',
      'If I would have known, I would tell you',
    ],
    correctAnswer: 2,
  },
  {
    id: 'c1-3',
    level: 'C1',
    question: 'What does "to read between the lines" mean?',
    options: [
      'To read very carefully',
      'To understand the hidden meaning',
      'To skip parts of a text',
      'To read multiple books at once',
    ],
    correctAnswer: 1,
  },
  {
    id: 'c1-4',
    level: 'C1',
    question: '"The proposal, ___ merits are questionable, was nonetheless approved."',
    options: ['which', 'whose', 'that', 'whom'],
    correctAnswer: 1,
  },
  {
    id: 'c1-5',
    level: 'C1',
    question: 'Choose the sentence with correct punctuation:',
    options: [
      'The CEO, who was appointed last year is resigning.',
      'The CEO who was appointed last year, is resigning.',
      'The CEO, who was appointed last year, is resigning.',
      'The CEO who was appointed last year is resigning.',
    ],
    correctAnswer: 2,
  },
  {
    id: 'c1-6',
    level: 'C1',
    question: '"Scarcely ___ the station when the train departed."',
    options: [
      'I had reached',
      'had I reached',
      'I reached',
      'did I reach',
    ],
    correctAnswer: 1,
  },
  // C1 Prepositions
  {
    id: 'c1-7',
    level: 'C1',
    question: 'The success of the project hinges ___ securing adequate funding.',
    options: ['on', 'in', 'at', 'for'],
    correctAnswer: 0,
  },
  {
    id: 'c1-8',
    level: 'C1',
    question: 'She has a propensity ___ making hasty decisions.',
    options: ['to', 'for', 'of', 'in'],
    correctAnswer: 1,
  },
  {
    id: 'c1-9',
    level: 'C1',
    question: 'The negotiations broke down ___ account of irreconcilable differences.',
    options: ['in', 'on', 'at', 'by'],
    correctAnswer: 1,
  },
  {
    id: 'c1-10',
    level: 'C1',
    question: 'His behavior is tantamount ___ admitting guilt.',
    options: ['for', 'with', 'to', 'of'],
    correctAnswer: 2,
  },
  {
    id: 'c1-11',
    level: 'C1',
    question: 'The policy was implemented ___ the expense of employee morale.',
    options: ['on', 'at', 'in', 'for'],
    correctAnswer: 1,
  },
  {
    id: 'c1-12',
    level: 'C1',
    question: 'They acted ___ contravention of the established guidelines.',
    options: ['on', 'at', 'in', 'by'],
    correctAnswer: 2,
  },

  // ============================================
  // C2 Level - Mastery, sophisticated vocabulary, rare prepositions
  // ============================================
  {
    id: 'c2-1',
    level: 'C2',
    question: 'Which word best completes: "Her ___ remarks during the meeting undermined the entire negotiation."',
    options: ['impertinent', 'pertinent', 'immanent', 'eminent'],
    correctAnswer: 0,
  },
  {
    id: 'c2-2',
    level: 'C2',
    question: '"The author\'s use of ___ serves to highlight the absurdity of the situation."',
    options: ['metaphor', 'bathos', 'euphemism', 'hyperbole'],
    correctAnswer: 1,
  },
  {
    id: 'c2-3',
    level: 'C2',
    question: 'What is the meaning of "to prevaricate"?',
    options: [
      'To speak clearly and directly',
      'To avoid giving a direct answer',
      'To prepare something in advance',
      'To anticipate future events',
    ],
    correctAnswer: 1,
  },
  {
    id: 'c2-4',
    level: 'C2',
    question: 'Which sentence demonstrates zeugma?',
    options: [
      'She broke his heart and his favorite vase.',
      'The thunder roared across the sky.',
      'Time flies like an arrow.',
      'He was a lion in battle.',
    ],
    correctAnswer: 0,
  },
  {
    id: 'c2-5',
    level: 'C2',
    question: '"The committee\'s decision was met with ___ from all stakeholders."',
    options: ['approbation', 'opprobrium', 'equanimity', 'pusillanimity'],
    correctAnswer: 0,
  },
  {
    id: 'c2-6',
    level: 'C2',
    question: 'Identify the sentence with a dangling modifier:',
    options: [
      'Walking through the park, the flowers were beautiful.',
      'Walking through the park, I noticed the beautiful flowers.',
      'The flowers in the park were beautiful as I walked.',
      'I walked through the park and saw beautiful flowers.',
    ],
    correctAnswer: 0,
  },
  // C2 Prepositions & Advanced Usage
  {
    id: 'c2-7',
    level: 'C2',
    question: 'The artist\'s work is redolent ___ the Impressionist movement.',
    options: ['with', 'of', 'in', 'by'],
    correctAnswer: 1,
  },
  {
    id: 'c2-8',
    level: 'C2',
    question: 'His argument is predicated ___ a fundamental misunderstanding.',
    options: ['on', 'in', 'at', 'for'],
    correctAnswer: 0,
  },
  {
    id: 'c2-9',
    level: 'C2',
    question: 'The minister was found to be complicit ___ the cover-up.',
    options: ['with', 'of', 'in', 'to'],
    correctAnswer: 2,
  },
  {
    id: 'c2-10',
    level: 'C2',
    question: 'Her expertise is commensurate ___ her years of experience.',
    options: ['to', 'for', 'with', 'of'],
    correctAnswer: 2,
  },
  {
    id: 'c2-11',
    level: 'C2',
    question: 'The findings are consonant ___ previous research in the field.',
    options: ['to', 'with', 'for', 'of'],
    correctAnswer: 1,
  },
  {
    id: 'c2-12',
    level: 'C2',
    question: 'The decision was made pursuant ___ the board\'s recommendations.',
    options: ['with', 'for', 'to', 'of'],
    correctAnswer: 2,
  },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get all questions for a specific level
export const getQuestionsByLevel = (level: string): QuizQuestion[] => {
  return placementQuestions.filter((q) => q.level === level);
};

// Get random questions for a level (for quiz)
export const getRandomQuestionsForLevel = (level: CEFRLevel, count: number = 6): QuizQuestion[] => {
  const levelQuestions = getQuestionsByLevel(level);
  const shuffled = shuffleArray(levelQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
