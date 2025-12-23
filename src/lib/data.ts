// SSC/HSC Subject and Question Data

export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  nameBn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  question: string;
  questionBn?: string;
  options: string[];
  optionsBn?: string[];
  correctAnswer: number;
  explanation: string;
  explanationBn?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  medium: 'bangla' | 'english';
  level: 'ssc' | 'hsc';
  streak: number;
  totalPoints: number;
  questionsAnswered: number;
  correctAnswers: number;
  weakTopics: string[];
  strongTopics: string[];
  dailyGoal: number;
  dailyProgress: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameBn: 'গণিত',
    icon: '📐',
    color: 'from-blue-500 to-indigo-600',
    topics: [
      { id: 'algebra', name: 'Algebra', nameBn: 'বীজগণিত', difficulty: 'medium', bloomLevel: 'apply' },
      { id: 'geometry', name: 'Geometry', nameBn: 'জ্যামিতি', difficulty: 'medium', bloomLevel: 'understand' },
      { id: 'trigonometry', name: 'Trigonometry', nameBn: 'ত্রিকোণমিতি', difficulty: 'hard', bloomLevel: 'apply' },
      { id: 'statistics', name: 'Statistics', nameBn: 'পরিসংখ্যান', difficulty: 'easy', bloomLevel: 'analyze' },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    nameBn: 'পদার্থবিজ্ঞান',
    icon: '⚛️',
    color: 'from-purple-500 to-pink-600',
    topics: [
      { id: 'mechanics', name: 'Mechanics', nameBn: 'বলবিদ্যা', difficulty: 'medium', bloomLevel: 'apply' },
      { id: 'electricity', name: 'Electricity', nameBn: 'বিদ্যুৎ', difficulty: 'hard', bloomLevel: 'analyze' },
      { id: 'optics', name: 'Optics', nameBn: 'আলোকবিজ্ঞান', difficulty: 'medium', bloomLevel: 'understand' },
      { id: 'waves', name: 'Waves', nameBn: 'তরঙ্গ', difficulty: 'medium', bloomLevel: 'understand' },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    nameBn: 'রসায়ন',
    icon: '🧪',
    color: 'from-green-500 to-teal-600',
    topics: [
      { id: 'organic', name: 'Organic Chemistry', nameBn: 'জৈব রসায়ন', difficulty: 'hard', bloomLevel: 'apply' },
      { id: 'inorganic', name: 'Inorganic Chemistry', nameBn: 'অজৈব রসায়ন', difficulty: 'medium', bloomLevel: 'remember' },
      { id: 'periodic', name: 'Periodic Table', nameBn: 'পর্যায় সারণী', difficulty: 'easy', bloomLevel: 'remember' },
      { id: 'reactions', name: 'Chemical Reactions', nameBn: 'রাসায়নিক বিক্রিয়া', difficulty: 'medium', bloomLevel: 'understand' },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    nameBn: 'জীববিজ্ঞান',
    icon: '🧬',
    color: 'from-emerald-500 to-green-600',
    topics: [
      { id: 'cell', name: 'Cell Biology', nameBn: 'কোষবিদ্যা', difficulty: 'medium', bloomLevel: 'understand' },
      { id: 'genetics', name: 'Genetics', nameBn: 'বংশগতি', difficulty: 'hard', bloomLevel: 'analyze' },
      { id: 'ecology', name: 'Ecology', nameBn: 'বাস্তুবিদ্যা', difficulty: 'easy', bloomLevel: 'understand' },
      { id: 'human', name: 'Human Physiology', nameBn: 'মানব শারীরবিদ্যা', difficulty: 'medium', bloomLevel: 'apply' },
    ],
  },
  {
    id: 'english',
    name: 'English',
    nameBn: 'ইংরেজি',
    icon: '📚',
    color: 'from-orange-500 to-red-600',
    topics: [
      { id: 'grammar', name: 'Grammar', nameBn: 'ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply' },
      { id: 'vocabulary', name: 'Vocabulary', nameBn: 'শব্দভাণ্ডার', difficulty: 'easy', bloomLevel: 'remember' },
      { id: 'comprehension', name: 'Reading Comprehension', nameBn: 'পাঠ বোধগম্যতা', difficulty: 'medium', bloomLevel: 'analyze' },
      { id: 'writing', name: 'Writing Skills', nameBn: 'লেখার দক্ষতা', difficulty: 'hard', bloomLevel: 'create' },
    ],
  },
  {
    id: 'bangla',
    name: 'Bangla',
    nameBn: 'বাংলা',
    icon: '🇧🇩',
    color: 'from-red-500 to-rose-600',
    topics: [
      { id: 'sahitya', name: 'Literature', nameBn: 'সাহিত্য', difficulty: 'medium', bloomLevel: 'analyze' },
      { id: 'byakaran', name: 'Grammar', nameBn: 'ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply' },
      { id: 'rochona', name: 'Essay Writing', nameBn: 'রচনা', difficulty: 'hard', bloomLevel: 'create' },
      { id: 'kobita', name: 'Poetry', nameBn: 'কবিতা', difficulty: 'medium', bloomLevel: 'evaluate' },
    ],
  },
];

export const sampleQuestions: Question[] = [
  {
    id: 'q1',
    subjectId: 'math',
    topicId: 'algebra',
    question: 'What is the value of x in the equation 2x + 5 = 15?',
    questionBn: '2x + 5 = 15 সমীকরণে x এর মান কত?',
    options: ['3', '5', '7', '10'],
    optionsBn: ['৩', '৫', '৭', '১০'],
    correctAnswer: 1,
    explanation: 'To solve 2x + 5 = 15, subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5.',
    explanationBn: '2x + 5 = 15 সমাধান করতে, উভয় দিক থেকে 5 বিয়োগ করলে 2x = 10 পাওয়া যায়, তারপর 2 দিয়ে ভাগ করলে x = 5 পাওয়া যায়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q2',
    subjectId: 'math',
    topicId: 'algebra',
    question: 'Simplify: (3x² + 2x) - (x² - 4x)',
    questionBn: 'সরলীকরণ করুন: (3x² + 2x) - (x² - 4x)',
    options: ['2x² + 6x', '2x² - 2x', '4x² + 6x', '4x² - 2x'],
    correctAnswer: 0,
    explanation: 'Distribute the negative sign: 3x² + 2x - x² + 4x = 2x² + 6x',
    explanationBn: 'ঋণাত্মক চিহ্ন বন্টন করুন: 3x² + 2x - x² + 4x = 2x² + 6x',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q3',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'A car travels 100 km in 2 hours. What is its average speed?',
    questionBn: 'একটি গাড়ি 2 ঘন্টায় 100 কিমি যায়। এর গড় গতি কত?',
    options: ['25 km/h', '50 km/h', '75 km/h', '200 km/h'],
    optionsBn: ['২৫ কিমি/ঘণ্টা', '৫০ কিমি/ঘণ্টা', '৭৫ কিমি/ঘণ্টা', '২০০ কিমি/ঘণ্টা'],
    correctAnswer: 1,
    explanation: 'Average speed = Total distance / Total time = 100 km / 2 hours = 50 km/h',
    explanationBn: 'গড় গতি = মোট দূরত্ব / মোট সময় = 100 কিমি / 2 ঘন্টা = 50 কিমি/ঘণ্টা',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q4',
    subjectId: 'chemistry',
    topicId: 'periodic',
    question: 'What is the atomic number of Carbon?',
    questionBn: 'কার্বনের পারমাণবিক সংখ্যা কত?',
    options: ['4', '6', '8', '12'],
    optionsBn: ['৪', '৬', '৮', '১২'],
    correctAnswer: 1,
    explanation: 'Carbon has 6 protons in its nucleus, so its atomic number is 6.',
    explanationBn: 'কার্বনের নিউক্লিয়াসে 6টি প্রোটন আছে, তাই এর পারমাণবিক সংখ্যা 6।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q5',
    subjectId: 'biology',
    topicId: 'cell',
    question: 'Which organelle is known as the "powerhouse of the cell"?',
    questionBn: 'কোন অঙ্গাণুকে "কোষের পাওয়ারহাউস" বলা হয়?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Body'],
    optionsBn: ['নিউক্লিয়াস', 'মাইটোকন্ড্রিয়া', 'রাইবোসোম', 'গলগি বডি'],
    correctAnswer: 1,
    explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for the cell.',
    explanationBn: 'মাইটোকন্ড্রিয়া কোষীয় শ্বসনের মাধ্যমে ATP উৎপাদন করে, কোষকে শক্তি সরবরাহ করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q6',
    subjectId: 'english',
    topicId: 'grammar',
    question: 'Choose the correct form: "She ___ to school every day."',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 1,
    explanation: 'With third person singular subjects (she/he/it), we use "goes" in simple present tense.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q7',
    subjectId: 'math',
    topicId: 'geometry',
    question: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
    questionBn: '8 সেমি দৈর্ঘ্য এবং 5 সেমি প্রস্থের আয়তক্ষেত্রের ক্ষেত্রফল কত?',
    options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'],
    optionsBn: ['১৩ সেমি²', '২৬ সেমি²', '৪০ সেমি²', '৮০ সেমি²'],
    correctAnswer: 2,
    explanation: 'Area of rectangle = length × width = 8 × 5 = 40 cm²',
    explanationBn: 'আয়তক্ষেত্রের ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ = 8 × 5 = 40 সেমি²',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q8',
    subjectId: 'physics',
    topicId: 'electricity',
    question: 'What is the SI unit of electric current?',
    questionBn: 'বৈদ্যুতিক প্রবাহের SI একক কী?',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    optionsBn: ['ভোল্ট', 'অ্যাম্পিয়ার', 'ওহম', 'ওয়াট'],
    correctAnswer: 1,
    explanation: 'The SI unit of electric current is Ampere (A), named after André-Marie Ampère.',
    explanationBn: 'বৈদ্যুতিক প্রবাহের SI একক হল অ্যাম্পিয়ার (A), আন্দ্রে-মারি অ্যাম্পিয়ারের নামে নামকরণ করা হয়েছে।',
    difficulty: 'easy',
    points: 10,
  },
];

export const badges: Badge[] = [
  { id: 'first_quiz', name: 'First Steps', description: 'Complete your first quiz', icon: '🎯' },
  { id: 'streak_3', name: 'On Fire', description: '3-day learning streak', icon: '🔥' },
  { id: 'streak_7', name: 'Dedicated Learner', description: '7-day learning streak', icon: '⭐' },
  { id: 'perfect_quiz', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯' },
  { id: 'subject_master', name: 'Subject Master', description: 'Complete all topics in a subject', icon: '🏆' },
  { id: 'points_100', name: 'Century', description: 'Earn 100 points', icon: '💎' },
  { id: 'points_500', name: 'Scholar', description: 'Earn 500 points', icon: '📜' },
  { id: 'points_1000', name: 'Expert', description: 'Earn 1000 points', icon: '🎓' },
];

export const defaultProfile: StudentProfile = {
  id: '1',
  name: '',
  medium: 'english',
  level: 'ssc',
  streak: 0,
  totalPoints: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  weakTopics: [],
  strongTopics: [],
  dailyGoal: 10,
  dailyProgress: 0,
  badges: [],
};
