// SSC/HSC Subject and Question Data

export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
  topics: Topic[];
  level?: 'ssc' | 'hsc' | 'both';
  part?: 1 | 2;
}

export interface Topic {
  id: string;
  name: string;
  nameBn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  hasNotes?: boolean;
}

export interface Note {
  id: string;
  topicId: string;
  subjectId: string;
  title: string;
  titleBn?: string;
  content: string;
  contentBn?: string;
  xpReward: number;
  readTime: number; // in minutes
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
  readNotes?: string[]; // IDs of notes the user has read
  avatarUrl?: string; // Profile picture URL
  // Admission fields
  institution?: string;
  admissionYear?: string;
  targetUniversity?: string;
  targetDepartment?: string;
  examDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

// SSC Subjects
export const sscSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    nameBn: 'গণিত',
    icon: '📐',
    color: 'from-blue-500 to-indigo-600',
    level: 'ssc',
    topics: [
      { id: 'algebra', name: 'Algebra', nameBn: 'বীজগণিত', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'geometry', name: 'Geometry', nameBn: 'জ্যামিতি', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'trigonometry', name: 'Trigonometry', nameBn: 'ত্রিকোণমিতি', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'statistics', name: 'Statistics', nameBn: 'পরিসংখ্যান', difficulty: 'easy', bloomLevel: 'analyze', hasNotes: true },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    nameBn: 'পদার্থবিজ্ঞান',
    icon: '⚛️',
    color: 'from-purple-500 to-pink-600',
    level: 'ssc',
    topics: [
      { id: 'mechanics', name: 'Mechanics', nameBn: 'বলবিদ্যা', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'electricity', name: 'Electricity', nameBn: 'বিদ্যুৎ', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
      { id: 'optics', name: 'Optics', nameBn: 'আলোকবিজ্ঞান', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'waves', name: 'Waves', nameBn: 'তরঙ্গ', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    nameBn: 'রসায়ন',
    icon: '🧪',
    color: 'from-green-500 to-teal-600',
    level: 'ssc',
    topics: [
      { id: 'organic', name: 'Organic Chemistry', nameBn: 'জৈব রসায়ন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'inorganic', name: 'Inorganic Chemistry', nameBn: 'অজৈব রসায়ন', difficulty: 'medium', bloomLevel: 'remember', hasNotes: true },
      { id: 'periodic', name: 'Periodic Table', nameBn: 'পর্যায় সারণী', difficulty: 'easy', bloomLevel: 'remember', hasNotes: true },
      { id: 'reactions', name: 'Chemical Reactions', nameBn: 'রাসায়নিক বিক্রিয়া', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    nameBn: 'জীববিজ্ঞান',
    icon: '🧬',
    color: 'from-emerald-500 to-green-600',
    level: 'ssc',
    topics: [
      { id: 'cell', name: 'Cell Biology', nameBn: 'কোষবিদ্যা', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'genetics', name: 'Genetics', nameBn: 'বংশগতি', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
      { id: 'ecology', name: 'Ecology', nameBn: 'বাস্তুবিদ্যা', difficulty: 'easy', bloomLevel: 'understand', hasNotes: true },
      { id: 'human', name: 'Human Physiology', nameBn: 'মানব শারীরবিদ্যা', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
    ],
  },
  {
    id: 'english',
    name: 'English',
    nameBn: 'ইংরেজি',
    icon: '📚',
    color: 'from-orange-500 to-red-600',
    level: 'ssc',
    topics: [
      { id: 'grammar', name: 'Grammar', nameBn: 'ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'vocabulary', name: 'Vocabulary', nameBn: 'শব্দভাণ্ডার', difficulty: 'easy', bloomLevel: 'remember', hasNotes: true },
      { id: 'comprehension', name: 'Reading Comprehension', nameBn: 'পাঠ বোধগম্যতা', difficulty: 'medium', bloomLevel: 'analyze', hasNotes: true },
      { id: 'writing', name: 'Writing Skills', nameBn: 'লেখার দক্ষতা', difficulty: 'hard', bloomLevel: 'create', hasNotes: true },
    ],
  },
  {
    id: 'bangla',
    name: 'Bangla',
    nameBn: 'বাংলা',
    icon: '🇧🇩',
    color: 'from-red-500 to-rose-600',
    level: 'ssc',
    topics: [
      { id: 'sahitya', name: 'Literature', nameBn: 'সাহিত্য', difficulty: 'medium', bloomLevel: 'analyze', hasNotes: true },
      { id: 'byakaran', name: 'Grammar', nameBn: 'ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'rochona', name: 'Essay Writing', nameBn: 'রচনা', difficulty: 'hard', bloomLevel: 'create', hasNotes: true },
      { id: 'kobita', name: 'Poetry', nameBn: 'কবিতা', difficulty: 'medium', bloomLevel: 'evaluate', hasNotes: true },
    ],
  },
];

// HSC Subjects with Part 1 and Part 2
export const hscSubjects: Subject[] = [
  // Physics Part 1
  {
    id: 'physics-1',
    name: 'Physics 1st Paper',
    nameBn: 'পদার্থবিজ্ঞান ১ম পত্র',
    icon: '⚛️',
    color: 'from-purple-500 to-pink-600',
    level: 'hsc',
    part: 1,
    topics: [
      { id: 'vectors', name: 'Vectors', nameBn: 'ভেক্টর', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'dynamics', name: 'Dynamics', nameBn: 'গতিবিদ্যা', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'work-energy', name: 'Work & Energy', nameBn: 'কাজ ও শক্তি', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'rotation', name: 'Rotational Motion', nameBn: 'ঘূর্ণন গতি', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
      { id: 'gravitation', name: 'Gravitation', nameBn: 'মহাকর্ষ', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
    ],
  },
  // Physics Part 2
  {
    id: 'physics-2',
    name: 'Physics 2nd Paper',
    nameBn: 'পদার্থবিজ্ঞান ২য় পত্র',
    icon: '🔬',
    color: 'from-violet-500 to-purple-600',
    level: 'hsc',
    part: 2,
    topics: [
      { id: 'electricity-hsc', name: 'Electricity', nameBn: 'তড়িৎ', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'magnetism', name: 'Magnetism', nameBn: 'চুম্বকত্ব', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'modern-physics', name: 'Modern Physics', nameBn: 'আধুনিক পদার্থবিজ্ঞান', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
      { id: 'semiconductor', name: 'Semiconductor', nameBn: 'অর্ধপরিবাহী', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'atomic-physics', name: 'Atomic Physics', nameBn: 'পারমাণবিক পদার্থবিজ্ঞান', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
    ],
  },
  // Chemistry Part 1
  {
    id: 'chemistry-1',
    name: 'Chemistry 1st Paper',
    nameBn: 'রসায়ন ১ম পত্র',
    icon: '🧪',
    color: 'from-green-500 to-teal-600',
    level: 'hsc',
    part: 1,
    topics: [
      { id: 'atomic-structure', name: 'Atomic Structure', nameBn: 'পরমাণুর গঠন', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'periodic-properties', name: 'Periodic Properties', nameBn: 'পর্যায়বৃত্ত ধর্ম', difficulty: 'medium', bloomLevel: 'remember', hasNotes: true },
      { id: 'chemical-bonding', name: 'Chemical Bonding', nameBn: 'রাসায়নিক বন্ধন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'states-matter', name: 'States of Matter', nameBn: 'পদার্থের অবস্থা', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
    ],
  },
  // Chemistry Part 2
  {
    id: 'chemistry-2',
    name: 'Chemistry 2nd Paper',
    nameBn: 'রসায়ন ২য় পত্র',
    icon: '⚗️',
    color: 'from-teal-500 to-cyan-600',
    level: 'hsc',
    part: 2,
    topics: [
      { id: 'organic-hsc', name: 'Organic Chemistry', nameBn: 'জৈব রসায়ন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'hydrocarbons', name: 'Hydrocarbons', nameBn: 'হাইড্রোকার্বন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'polymers', name: 'Polymers', nameBn: 'পলিমার', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'env-chemistry', name: 'Environmental Chemistry', nameBn: 'পরিবেশ রসায়ন', difficulty: 'easy', bloomLevel: 'understand', hasNotes: true },
    ],
  },
  // Biology Part 1
  {
    id: 'biology-1',
    name: 'Biology 1st Paper',
    nameBn: 'জীববিজ্ঞান ১ম পত্র',
    icon: '🧬',
    color: 'from-emerald-500 to-green-600',
    level: 'hsc',
    part: 1,
    topics: [
      { id: 'cell-hsc', name: 'Cell & Cell Division', nameBn: 'কোষ ও কোষ বিভাজন', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'cell-chemistry', name: 'Cell Chemistry', nameBn: 'কোষ রসায়ন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'plant-physiology', name: 'Plant Physiology', nameBn: 'উদ্ভিদ শারীরবিদ্যা', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'plant-taxonomy', name: 'Plant Taxonomy', nameBn: 'উদ্ভিদ শ্রেণীবিন্যাস', difficulty: 'medium', bloomLevel: 'remember', hasNotes: true },
    ],
  },
  // Biology Part 2
  {
    id: 'biology-2',
    name: 'Biology 2nd Paper',
    nameBn: 'জীববিজ্ঞান ২য় পত্র',
    icon: '🦠',
    color: 'from-lime-500 to-green-600',
    level: 'hsc',
    part: 2,
    topics: [
      { id: 'animal-physiology', name: 'Animal Physiology', nameBn: 'প্রাণী শারীরবিদ্যা', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'genetics-hsc', name: 'Genetics & Evolution', nameBn: 'বংশগতি ও বিবর্তন', difficulty: 'hard', bloomLevel: 'analyze', hasNotes: true },
      { id: 'animal-diversity', name: 'Animal Diversity', nameBn: 'প্রাণী বৈচিত্র্য', difficulty: 'medium', bloomLevel: 'remember', hasNotes: true },
      { id: 'human-physiology-hsc', name: 'Human Physiology', nameBn: 'মানব শারীরবিদ্যা', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
    ],
  },
  // Higher Mathematics Part 1
  {
    id: 'higher-math-1',
    name: 'Higher Math 1st Paper',
    nameBn: 'উচ্চতর গণিত ১ম পত্র',
    icon: '📊',
    color: 'from-blue-500 to-indigo-600',
    level: 'hsc',
    part: 1,
    topics: [
      { id: 'matrices', name: 'Matrices & Determinants', nameBn: 'ম্যাট্রিক্স ও নির্ণায়ক', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'complex-numbers', name: 'Complex Numbers', nameBn: 'জটিল সংখ্যা', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'polynomials', name: 'Polynomials', nameBn: 'বহুপদী', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'trigonometry-hsc', name: 'Trigonometry', nameBn: 'ত্রিকোণমিতি', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
    ],
  },
  // Higher Mathematics Part 2
  {
    id: 'higher-math-2',
    name: 'Higher Math 2nd Paper',
    nameBn: 'উচ্চতর গণিত ২য় পত্র',
    icon: '📈',
    color: 'from-indigo-500 to-blue-600',
    level: 'hsc',
    part: 2,
    topics: [
      { id: 'calculus', name: 'Calculus', nameBn: 'ক্যালকুলাস', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'integration', name: 'Integration', nameBn: 'সমাকলন', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'coordinate-geometry', name: 'Coordinate Geometry', nameBn: 'স্থানাঙ্ক জ্যামিতি', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'probability-stats', name: 'Probability & Statistics', nameBn: 'সম্ভাবনা ও পরিসংখ্যান', difficulty: 'medium', bloomLevel: 'analyze', hasNotes: true },
    ],
  },
  // Common HSC subjects
  {
    id: 'english-hsc',
    name: 'English',
    nameBn: 'ইংরেজি',
    icon: '📚',
    color: 'from-orange-500 to-red-600',
    level: 'hsc',
    topics: [
      { id: 'grammar-hsc', name: 'Advanced Grammar', nameBn: 'উন্নত ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'essay-hsc', name: 'Essay Writing', nameBn: 'প্রবন্ধ রচনা', difficulty: 'hard', bloomLevel: 'create', hasNotes: true },
      { id: 'literature-hsc', name: 'Literature', nameBn: 'সাহিত্য', difficulty: 'medium', bloomLevel: 'analyze', hasNotes: true },
    ],
  },
  {
    id: 'bangla-hsc',
    name: 'Bangla',
    nameBn: 'বাংলা',
    icon: '🇧🇩',
    color: 'from-red-500 to-rose-600',
    level: 'hsc',
    topics: [
      { id: 'sahitya-hsc', name: 'Literature', nameBn: 'সাহিত্য', difficulty: 'medium', bloomLevel: 'analyze', hasNotes: true },
      { id: 'byakaran-hsc', name: 'Grammar', nameBn: 'ব্যাকরণ', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'rochona-hsc', name: 'Essay Writing', nameBn: 'রচনা', difficulty: 'hard', bloomLevel: 'create', hasNotes: true },
    ],
  },
  {
    id: 'ict',
    name: 'ICT',
    nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    icon: '💻',
    color: 'from-cyan-500 to-blue-600',
    level: 'hsc',
    topics: [
      { id: 'number-system', name: 'Number System', nameBn: 'সংখ্যা পদ্ধতি', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
      { id: 'programming', name: 'Programming', nameBn: 'প্রোগ্রামিং', difficulty: 'hard', bloomLevel: 'apply', hasNotes: true },
      { id: 'database', name: 'Database', nameBn: 'ডেটাবেস', difficulty: 'medium', bloomLevel: 'understand', hasNotes: true },
      { id: 'web', name: 'Web Design', nameBn: 'ওয়েব ডিজাইন', difficulty: 'medium', bloomLevel: 'apply', hasNotes: true },
    ],
  },
];

// Helper to get subjects based on level
export const getSubjectsByLevel = (level: 'ssc' | 'hsc'): Subject[] => {
  return level === 'ssc' ? sscSubjects : hscSubjects;
};

// All subjects combined (for backward compatibility)
export const subjects: Subject[] = [...sscSubjects, ...hscSubjects];

// Sample Notes for Learning Section
export const sampleNotes: Note[] = [
  // SSC Notes
  {
    id: 'note-1',
    topicId: 'cell',
    subjectId: 'biology',
    title: 'Introduction to Cells',
    titleBn: 'কোষের পরিচিতি',
    content: `# The Cell - Basic Unit of Life

A cell is the smallest structural and functional unit of all living organisms. There are two main types of cells:

## 1. Prokaryotic Cells
- No membrane-bound nucleus
- Found in bacteria and archaea
- Simple internal structure

## 2. Eukaryotic Cells
- Membrane-bound nucleus
- Found in plants, animals, fungi
- Complex internal structure with organelles

### Key Organelles:
- **Nucleus**: Contains DNA, controls cell activities
- **Mitochondria**: Powerhouse of the cell, produces ATP
- **Ribosomes**: Protein synthesis
- **Endoplasmic Reticulum**: Transport system
- **Golgi Body**: Packaging and shipping`,
    contentBn: `# কোষ - জীবনের মৌলিক একক

কোষ হল সমস্ত জীবের ক্ষুদ্রতম গঠনগত ও কার্যকরী একক। দুই প্রধান ধরনের কোষ আছে:

## ১. প্রোক্যারিওটিক কোষ
- ঝিল্লি-আবদ্ধ নিউক্লিয়াস নেই
- ব্যাকটেরিয়া ও আর্কিয়ায় পাওয়া যায়
- সরল অভ্যন্তরীণ গঠন

## ২. ইউক্যারিওটিক কোষ
- ঝিল্লি-আবদ্ধ নিউক্লিয়াস আছে
- উদ্ভিদ, প্রাণী, ছত্রাকে পাওয়া যায়
- জটিল অভ্যন্তরীণ গঠন

### প্রধান অঙ্গাণু:
- **নিউক্লিয়াস**: DNA ধারণ করে, কোষের কার্যক্রম নিয়ন্ত্রণ করে
- **মাইটোকন্ড্রিয়া**: কোষের পাওয়ারহাউস, ATP উৎপাদন করে
- **রাইবোসোম**: প্রোটিন সংশ্লেষণ
- **এন্ডোপ্লাজমিক রেটিকুলাম**: পরিবহন ব্যবস্থা
- **গলগি বডি**: প্যাকেজিং ও পরিবহন`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-2',
    topicId: 'algebra',
    subjectId: 'math',
    title: 'Solving Linear Equations',
    titleBn: 'সরলরৈখিক সমীকরণ সমাধান',
    content: `# Linear Equations

A linear equation is an equation where the highest power of the variable is 1.

## General Form
ax + b = c

## Steps to Solve:
1. **Isolate the variable term**: Move all terms with x to one side
2. **Combine like terms**: Simplify both sides
3. **Solve for x**: Divide both sides by the coefficient of x

### Example:
Solve: 2x + 5 = 15

**Step 1**: Subtract 5 from both sides
2x + 5 - 5 = 15 - 5
2x = 10

**Step 2**: Divide both sides by 2
2x/2 = 10/2
x = 5

### Practice Tips:
- Always check your answer by substituting back
- Keep the equation balanced - what you do to one side, do to the other`,
    xpReward: 20,
    readTime: 4,
  },
  {
    id: 'note-3',
    topicId: 'mechanics',
    subjectId: 'physics',
    title: 'Newton\'s Laws of Motion',
    titleBn: 'নিউটনের গতি সূত্র',
    content: `# Newton's Laws of Motion

## First Law (Law of Inertia)
An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.

## Second Law (F = ma)
The acceleration of an object depends on:
- The net force acting on the object
- The mass of the object

**Formula**: F = m × a
- F = Force (Newtons)
- m = Mass (kg)
- a = Acceleration (m/s²)

## Third Law (Action-Reaction)
For every action, there is an equal and opposite reaction.

### Examples:
- Walking: You push ground backward, ground pushes you forward
- Rocket: Exhaust gases push down, rocket goes up

### Key Formulas:
- Weight: W = mg (g = 9.8 m/s²)
- Momentum: p = mv`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-4',
    topicId: 'organic',
    subjectId: 'chemistry',
    title: 'Introduction to Organic Chemistry',
    titleBn: 'জৈব রসায়নের পরিচিতি',
    content: `# Organic Chemistry

Organic chemistry is the study of carbon compounds.

## Why Carbon?
- Can form 4 bonds
- Can form chains and rings
- Creates diverse molecules

## Basic Functional Groups:
- **Alkanes**: Single bonds only (CH₄)
- **Alkenes**: Double bonds (C₂H₄)
- **Alkynes**: Triple bonds (C₂H₂)
- **Alcohols**: -OH group
- **Aldehydes**: -CHO group`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-5',
    topicId: 'grammar',
    subjectId: 'english',
    title: 'Parts of Speech',
    titleBn: 'পদ প্রকরণ',
    content: `# Parts of Speech

## 8 Parts of Speech:
1. **Noun**: Names (dog, city, happiness)
2. **Pronoun**: Replaces nouns (he, she, it)
3. **Verb**: Action or state (run, is, think)
4. **Adjective**: Describes nouns (big, beautiful)
5. **Adverb**: Describes verbs (quickly, very)
6. **Preposition**: Shows relationships (in, on, at)
7. **Conjunction**: Connects words (and, but, or)
8. **Interjection**: Expresses emotion (wow, oh!)`,
    xpReward: 20,
    readTime: 4,
  },
  {
    id: 'note-6',
    topicId: 'sahitya',
    subjectId: 'bangla',
    title: 'বাংলা সাহিত্যের যুগ বিভাগ',
    titleBn: 'বাংলা সাহিত্যের যুগ বিভাগ',
    content: `# বাংলা সাহিত্যের যুগ বিভাগ

## প্রাচীন যুগ (৯৫০-১২০০)
- চর্যাপদ
- বৌদ্ধ সাহিত্য

## মধ্যযুগ (১২০০-১৮০০)
- মঙ্গলকাব্য
- বৈষ্ণব পদাবলী
- রোমান্টিক প্রণয়কাব্য

## আধুনিক যুগ (১৮০০-বর্তমান)
- রবীন্দ্রনাথ ঠাকুর
- কাজী নজরুল ইসলাম
- জীবনানন্দ দাশ`,
    xpReward: 25,
    readTime: 5,
  },
  // HSC Notes - Physics 1st Paper
  {
    id: 'note-hsc-phy1-1',
    topicId: 'vectors',
    subjectId: 'physics-1',
    title: 'Vectors and Scalars',
    titleBn: 'ভেক্টর ও স্কেলার',
    content: `# Vectors and Scalars

## Scalar Quantities
- Only magnitude, no direction
- Examples: mass, time, temperature, speed

## Vector Quantities
- Both magnitude and direction
- Examples: displacement, velocity, force, acceleration

## Vector Operations:
- **Addition**: Triangle/Parallelogram law
- **Subtraction**: Add negative vector
- **Dot Product**: A·B = |A||B|cosθ
- **Cross Product**: A×B = |A||B|sinθ n̂`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-hsc-phy1-2',
    topicId: 'dynamics',
    subjectId: 'physics-1',
    title: 'Dynamics and Motion',
    titleBn: 'গতিবিদ্যা',
    content: `# Dynamics

## Key Concepts:
- **Inertia**: Resistance to change in motion
- **Momentum**: p = mv
- **Impulse**: J = FΔt = Δp

## Conservation Laws:
- Conservation of Momentum
- Conservation of Energy

## Friction:
- Static friction: fs ≤ μsN
- Kinetic friction: fk = μkN`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Physics 2nd Paper
  {
    id: 'note-hsc-phy2-1',
    topicId: 'electricity-hsc',
    subjectId: 'physics-2',
    title: 'Electric Current and Circuits',
    titleBn: 'তড়িৎ প্রবাহ ও বর্তনী',
    content: `# Electric Current

## Ohm's Law
V = IR

## Kirchhoff's Laws:
1. **Junction Rule**: ΣI = 0
2. **Loop Rule**: ΣV = 0

## Resistors:
- Series: R_total = R1 + R2 + R3
- Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-phy2-2',
    topicId: 'modern-physics',
    subjectId: 'physics-2',
    title: 'Modern Physics',
    titleBn: 'আধুনিক পদার্থবিজ্ঞান',
    content: `# Modern Physics

## Photoelectric Effect
E = hf - φ

## de Broglie Wavelength
λ = h/p = h/mv

## Bohr's Atomic Model
- Electrons in discrete orbits
- Energy levels: En = -13.6/n² eV`,
    xpReward: 35,
    readTime: 7,
  },
  // HSC Notes - Chemistry 1st Paper
  {
    id: 'note-hsc-chem1-1',
    topicId: 'atomic-structure',
    subjectId: 'chemistry-1',
    title: 'Atomic Structure',
    titleBn: 'পরমাণুর গঠন',
    content: `# Atomic Structure

## Subatomic Particles:
- **Proton**: +1 charge, in nucleus
- **Neutron**: 0 charge, in nucleus
- **Electron**: -1 charge, in orbitals

## Quantum Numbers:
1. Principal (n): Energy level
2. Azimuthal (l): Orbital shape
3. Magnetic (m): Orbital orientation
4. Spin (s): Electron spin`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-hsc-chem1-2',
    topicId: 'chemical-bonding',
    subjectId: 'chemistry-1',
    title: 'Chemical Bonding',
    titleBn: 'রাসায়নিক বন্ধন',
    content: `# Chemical Bonding

## Types of Bonds:
1. **Ionic**: Transfer of electrons
2. **Covalent**: Sharing of electrons
3. **Metallic**: Sea of electrons

## Hybridization:
- sp: Linear (180°)
- sp²: Trigonal planar (120°)
- sp³: Tetrahedral (109.5°)`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Chemistry 2nd Paper
  {
    id: 'note-hsc-chem2-1',
    topicId: 'organic-hsc',
    subjectId: 'chemistry-2',
    title: 'Organic Reactions',
    titleBn: 'জৈব বিক্রিয়া',
    content: `# Organic Reactions

## Reaction Types:
1. **Substitution**: One atom replaces another
2. **Addition**: Atoms added to double bond
3. **Elimination**: Atoms removed, double bond forms
4. **Oxidation/Reduction**: Electron transfer

## Named Reactions:
- Wurtz reaction
- Friedel-Crafts reaction
- Aldol condensation`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Biology 1st Paper
  {
    id: 'note-hsc-bio1-1',
    topicId: 'cell-hsc',
    subjectId: 'biology-1',
    title: 'Cell Division',
    titleBn: 'কোষ বিভাজন',
    content: `# Cell Division

## Mitosis
- Produces 2 identical cells
- Phases: Prophase, Metaphase, Anaphase, Telophase
- For growth and repair

## Meiosis
- Produces 4 haploid cells
- Two divisions: Meiosis I and II
- For gamete production
- Crossing over occurs`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-bio1-2',
    topicId: 'plant-physiology',
    subjectId: 'biology-1',
    title: 'Photosynthesis',
    titleBn: 'সালোকসংশ্লেষণ',
    content: `# Photosynthesis

## Equation:
6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

## Light Reactions:
- Occur in thylakoids
- Produce ATP and NADPH

## Dark Reactions (Calvin Cycle):
- Occur in stroma
- Fix CO₂ into glucose`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Biology 2nd Paper
  {
    id: 'note-hsc-bio2-1',
    topicId: 'genetics-hsc',
    subjectId: 'biology-2',
    title: 'Mendelian Genetics',
    titleBn: 'মেন্ডেলীয় বংশগতি',
    content: `# Mendelian Genetics

## Mendel's Laws:
1. **Law of Segregation**: Alleles separate during gamete formation
2. **Law of Independent Assortment**: Genes for different traits assort independently

## Key Terms:
- Genotype: Genetic makeup (AA, Aa, aa)
- Phenotype: Physical expression
- Dominant vs Recessive`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-bio2-2',
    topicId: 'human-physiology-hsc',
    subjectId: 'biology-2',
    title: 'Nervous System',
    titleBn: 'স্নায়ুতন্ত্র',
    content: `# Nervous System

## Divisions:
1. **Central Nervous System**: Brain + Spinal cord
2. **Peripheral Nervous System**: Nerves

## Neuron Structure:
- Dendrites: Receive signals
- Cell body: Contains nucleus
- Axon: Transmits signals

## Synapse:
- Gap between neurons
- Neurotransmitters cross the gap`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Higher Math 1st Paper
  {
    id: 'note-hsc-math1-1',
    topicId: 'matrices',
    subjectId: 'higher-math-1',
    title: 'Matrices and Determinants',
    titleBn: 'ম্যাট্রিক্স ও নির্ণায়ক',
    content: `# Matrices

## Types:
- Row matrix, Column matrix
- Square matrix, Identity matrix
- Symmetric, Skew-symmetric

## Operations:
- Addition: A + B
- Multiplication: A × B
- Transpose: Aᵀ
- Inverse: A⁻¹

## Determinant:
For 2×2 matrix: |A| = ad - bc`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-math1-2',
    topicId: 'complex-numbers',
    subjectId: 'higher-math-1',
    title: 'Complex Numbers',
    titleBn: 'জটিল সংখ্যা',
    content: `# Complex Numbers

## Form: z = a + bi
Where i = √(-1)

## Operations:
- Addition: (a+bi) + (c+di) = (a+c) + (b+d)i
- Multiplication: (a+bi)(c+di) = (ac-bd) + (ad+bc)i

## Polar Form:
z = r(cosθ + isinθ) = re^(iθ)`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - Higher Math 2nd Paper
  {
    id: 'note-hsc-math2-1',
    topicId: 'calculus',
    subjectId: 'higher-math-2',
    title: 'Differentiation',
    titleBn: 'অন্তরীকরণ',
    content: `# Differentiation

## Basic Rules:
- Power rule: d/dx(xⁿ) = nxⁿ⁻¹
- Product rule: (uv)' = u'v + uv'
- Quotient rule: (u/v)' = (u'v - uv')/v²
- Chain rule: dy/dx = dy/du × du/dx

## Applications:
- Finding slopes
- Maximum/Minimum values
- Rate of change`,
    xpReward: 35,
    readTime: 7,
  },
  {
    id: 'note-hsc-math2-2',
    topicId: 'integration',
    subjectId: 'higher-math-2',
    title: 'Integration',
    titleBn: 'সমাকলন',
    content: `# Integration

## Basic Rules:
- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C
- ∫eˣ dx = eˣ + C
- ∫1/x dx = ln|x| + C

## Methods:
- Substitution
- Integration by parts
- Partial fractions

## Applications:
- Area under curves
- Volume of revolution`,
    xpReward: 35,
    readTime: 7,
  },
  // HSC Notes - ICT
  {
    id: 'note-hsc-ict-1',
    topicId: 'number-system',
    subjectId: 'ict',
    title: 'Number Systems',
    titleBn: 'সংখ্যা পদ্ধতি',
    content: `# Number Systems

## Types:
1. **Binary (Base 2)**: 0, 1
2. **Octal (Base 8)**: 0-7
3. **Decimal (Base 10)**: 0-9
4. **Hexadecimal (Base 16)**: 0-9, A-F

## Conversions:
- Binary to Decimal: Multiply by powers of 2
- Decimal to Binary: Divide by 2, collect remainders`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-hsc-ict-2',
    topicId: 'programming',
    subjectId: 'ict',
    title: 'Programming Basics',
    titleBn: 'প্রোগ্রামিং বেসিক',
    content: `# Programming Basics

## Key Concepts:
- Variables: Store data
- Data types: int, float, string, boolean
- Operators: +, -, *, /, %

## Control Structures:
- if-else: Decision making
- for loop: Known iterations
- while loop: Unknown iterations

## Functions:
- Reusable code blocks
- Parameters and return values`,
    xpReward: 30,
    readTime: 6,
  },
  // HSC Notes - English
  {
    id: 'note-hsc-eng-1',
    topicId: 'grammar-hsc',
    subjectId: 'english-hsc',
    title: 'Advanced Grammar',
    titleBn: 'উন্নত ব্যাকরণ',
    content: `# Advanced Grammar

## Sentence Transformation:
- Active to Passive voice
- Direct to Indirect speech
- Affirmative to Negative

## Complex Sentences:
- Noun clauses
- Adjective clauses
- Adverb clauses`,
    xpReward: 25,
    readTime: 5,
  },
  // HSC Notes - Bangla
  {
    id: 'note-hsc-bng-1',
    topicId: 'sahitya-hsc',
    subjectId: 'bangla-hsc',
    title: 'বাংলা সাহিত্যের ইতিহাস',
    titleBn: 'বাংলা সাহিত্যের ইতিহাস',
    content: `# বাংলা সাহিত্যের ইতিহাস

## আধুনিক যুগের প্রধান সাহিত্যিক:
- রবীন্দ্রনাথ ঠাকুর: গীতাঞ্জলি, গোরা
- কাজী নজরুল ইসলাম: বিদ্রোহী, অগ্নিবীণা
- জীবনানন্দ দাশ: বনলতা সেন
- মানিক বন্দ্যোপাধ্যায়: পদ্মা নদীর মাঝি

## সাহিত্যের বিভিন্ন রূপ:
- কবিতা, গল্প, উপন্যাস, নাটক`,
    xpReward: 25,
    readTime: 5,
  },
  // Additional SSC Notes
  {
    id: 'note-7',
    topicId: 'geometry',
    subjectId: 'math',
    title: 'Properties of Triangles',
    titleBn: 'ত্রিভুজের বৈশিষ্ট্য',
    content: `# Properties of Triangles

## Types of Triangles by Sides:
1. **Equilateral**: All sides equal
2. **Isosceles**: Two sides equal
3. **Scalene**: No sides equal

## Types by Angles:
1. **Acute**: All angles < 90°
2. **Right**: One angle = 90°
3. **Obtuse**: One angle > 90°

## Important Properties:
- Sum of angles = 180°
- Sum of any two sides > third side
- Area = ½ × base × height
- Pythagoras: a² + b² = c² (right triangle)`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-8',
    topicId: 'statistics',
    subjectId: 'math',
    title: 'Mean, Median, and Mode',
    titleBn: 'গড়, মধ্যমা এবং প্রচুরক',
    content: `# Measures of Central Tendency

## Mean (Average)
Mean = Sum of all values / Number of values

## Median (Middle Value)
- Arrange data in order
- Middle value for odd n
- Average of two middle values for even n

## Mode (Most Frequent)
- Value that appears most often
- A dataset can have multiple modes

## Example:
Data: 2, 3, 4, 4, 5, 6, 7
- Mean = 31/7 = 4.43
- Median = 4
- Mode = 4`,
    xpReward: 20,
    readTime: 4,
  },
  {
    id: 'note-9',
    topicId: 'electricity',
    subjectId: 'physics',
    title: 'Electric Circuits Basics',
    titleBn: 'বৈদ্যুতিক বর্তনীর মূলনীতি',
    content: `# Electric Circuits

## Key Concepts:
- **Current (I)**: Flow of charge, measured in Amperes
- **Voltage (V)**: Electric potential difference, measured in Volts
- **Resistance (R)**: Opposition to current, measured in Ohms

## Ohm's Law:
V = I × R

## Series Circuit:
- Current same everywhere
- Voltage divides
- R_total = R₁ + R₂ + R₃

## Parallel Circuit:
- Voltage same everywhere
- Current divides
- 1/R_total = 1/R₁ + 1/R₂ + 1/R₃`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-10',
    topicId: 'optics',
    subjectId: 'physics',
    title: 'Reflection and Refraction',
    titleBn: 'প্রতিফলন ও প্রতিসরণ',
    content: `# Light: Reflection & Refraction

## Reflection:
- Light bounces off surfaces
- Angle of incidence = Angle of reflection
- Types: Regular (mirror) vs Diffuse (rough surface)

## Refraction:
- Light bends when passing through different media
- Snell's Law: n₁ sin θ₁ = n₂ sin θ₂
- Causes: Different speeds in different media

## Real-life Examples:
- Mirrors (reflection)
- Lens in glasses (refraction)
- Rainbow (refraction + dispersion)`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-11',
    topicId: 'inorganic',
    subjectId: 'chemistry',
    title: 'Acids, Bases and Salts',
    titleBn: 'এসিড, ক্ষার ও লবণ',
    content: `# Acids, Bases and Salts

## Acids:
- Donate H⁺ ions
- pH < 7
- Examples: HCl, H₂SO₄, CH₃COOH

## Bases:
- Accept H⁺ or donate OH⁻
- pH > 7
- Examples: NaOH, KOH, NH₃

## Salts:
- Formed from acid-base reaction
- Examples: NaCl, CaSO₄

## pH Scale:
0-6: Acidic
7: Neutral
8-14: Basic`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-12',
    topicId: 'reactions',
    subjectId: 'chemistry',
    title: 'Types of Chemical Reactions',
    titleBn: 'রাসায়নিক বিক্রিয়ার প্রকারভেদ',
    content: `# Types of Chemical Reactions

## 1. Combination (Synthesis)
A + B → AB
Example: 2H₂ + O₂ → 2H₂O

## 2. Decomposition
AB → A + B
Example: 2H₂O → 2H₂ + O₂

## 3. Single Displacement
A + BC → AC + B
Example: Zn + CuSO₄ → ZnSO₄ + Cu

## 4. Double Displacement
AB + CD → AD + CB
Example: NaCl + AgNO₃ → NaNO₃ + AgCl

## 5. Combustion
Fuel + O₂ → CO₂ + H₂O + Energy`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-13',
    topicId: 'genetics',
    subjectId: 'biology',
    title: 'DNA and RNA',
    titleBn: 'DNA এবং RNA',
    content: `# DNA and RNA

## DNA (Deoxyribonucleic Acid)
- Double helix structure
- Sugar: Deoxyribose
- Bases: A, T, G, C
- Function: Stores genetic info

## RNA (Ribonucleic Acid)
- Single stranded
- Sugar: Ribose
- Bases: A, U, G, C
- Types: mRNA, tRNA, rRNA

## Central Dogma:
DNA → RNA → Protein
(Transcription → Translation)`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-14',
    topicId: 'ecology',
    subjectId: 'biology',
    title: 'Food Chains and Food Webs',
    titleBn: 'খাদ্য শৃঙ্খল ও খাদ্যজাল',
    content: `# Food Chains and Food Webs

## Food Chain:
Linear pathway of energy transfer
Example: Grass → Grasshopper → Frog → Snake → Eagle

## Trophic Levels:
1. Producers (plants)
2. Primary consumers (herbivores)
3. Secondary consumers (carnivores)
4. Tertiary consumers (top predators)

## Food Web:
- Multiple interconnected food chains
- More realistic representation
- Shows ecosystem complexity

## Energy Transfer:
Only 10% energy passes to next level`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-15',
    topicId: 'vocabulary',
    subjectId: 'english',
    title: 'Common Prefixes and Suffixes',
    titleBn: 'সাধারণ উপসর্গ ও প্রত্যয়',
    content: `# Prefixes and Suffixes

## Common Prefixes:
- un- (not): unhappy, undo
- re- (again): redo, rewrite
- pre- (before): preview, predict
- dis- (not): disagree, disable
- mis- (wrong): mistake, misunderstand

## Common Suffixes:
- -tion (noun): education, celebration
- -ly (adverb): quickly, happily
- -ful (full of): beautiful, helpful
- -less (without): careless, hopeless
- -able (can be): readable, enjoyable`,
    xpReward: 20,
    readTime: 4,
  },
  {
    id: 'note-16',
    topicId: 'byakaran',
    subjectId: 'bangla',
    title: 'বাংলা ব্যাকরণ: কারক',
    titleBn: 'বাংলা ব্যাকরণ: কারক',
    content: `# কারক

## কারক কী?
বাক্যে ক্রিয়াপদের সাথে বিশেষ্য বা সর্বনাম পদের সম্পর্ককে কারক বলে।

## কারকের প্রকারভেদ:
১. **কর্তৃকারক**: কে/কারা ক্রিয়া করে
২. **কর্মকারক**: কাকে/কী ক্রিয়া করা হয়
৩. **করণকারক**: কী দ্বারা/কীসের সাহায্যে
৪. **সম্প্রদান কারক**: কাকে দেওয়া হয়
৫. **অপাদান কারক**: কোথা থেকে
৬. **অধিকরণ কারক**: কোথায়/কখন`,
    xpReward: 25,
    readTime: 5,
  },
  // Additional HSC Notes
  {
    id: 'note-hsc-phy1-3',
    topicId: 'work-energy',
    subjectId: 'physics-1',
    title: 'Work, Energy and Power',
    titleBn: 'কাজ, শক্তি ও ক্ষমতা',
    content: `# Work, Energy and Power

## Work:
W = F × d × cos θ
- Unit: Joule (J)
- Work done against gravity: W = mgh

## Energy:
- Kinetic Energy: KE = ½mv²
- Potential Energy: PE = mgh
- Total Mechanical Energy = KE + PE

## Power:
P = W/t = F × v
- Unit: Watt (W)
- 1 HP = 746 W

## Conservation of Energy:
Energy cannot be created or destroyed, only transformed.`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-phy1-4',
    topicId: 'gravitation',
    subjectId: 'physics-1',
    title: 'Gravitation',
    titleBn: 'মহাকর্ষ',
    content: `# Gravitation

## Newton's Law of Gravitation:
F = G(m₁m₂)/r²

## Gravitational Field Strength:
g = GM/r²
At Earth's surface: g ≈ 9.8 m/s²

## Escape Velocity:
v_e = √(2GM/R)
For Earth: v_e ≈ 11.2 km/s

## Orbital Velocity:
v_o = √(GM/r)

## Kepler's Laws:
1. Elliptical orbits
2. Equal areas in equal times
3. T² ∝ r³`,
    xpReward: 35,
    readTime: 7,
  },
  {
    id: 'note-hsc-chem2-2',
    topicId: 'hydrocarbons',
    subjectId: 'chemistry-2',
    title: 'Hydrocarbons',
    titleBn: 'হাইড্রোকার্বন',
    content: `# Hydrocarbons

## Types:
1. **Alkanes**: CₙH₂ₙ₊₂ (single bonds)
   - Methane, Ethane, Propane
   
2. **Alkenes**: CₙH₂ₙ (double bond)
   - Ethene, Propene
   
3. **Alkynes**: CₙH₂ₙ₋₂ (triple bond)
   - Ethyne (Acetylene)

## IUPAC Naming:
- meth- (1C), eth- (2C), prop- (3C), but- (4C)
- -ane (alkane), -ene (alkene), -yne (alkyne)

## Properties:
- Nonpolar
- Low melting/boiling points
- Combustible`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-bio2-3',
    topicId: 'animal-physiology',
    subjectId: 'biology-2',
    title: 'Circulatory System',
    titleBn: 'রক্ত সংবহন তন্ত্র',
    content: `# Circulatory System

## Components:
1. Heart (4 chambers)
2. Blood vessels (arteries, veins, capillaries)
3. Blood

## Double Circulation:
- Pulmonary: Heart → Lungs → Heart
- Systemic: Heart → Body → Heart

## Blood Components:
- Plasma (55%)
- RBC (carries O₂)
- WBC (immunity)
- Platelets (clotting)

## Heart Cycle:
- Systole: Contraction
- Diastole: Relaxation
- Heart rate: ~72 bpm`,
    xpReward: 30,
    readTime: 6,
  },
  {
    id: 'note-hsc-math2-3',
    topicId: 'coordinate-geometry',
    subjectId: 'higher-math-2',
    title: 'Straight Lines',
    titleBn: 'সরলরেখা',
    content: `# Straight Lines

## Forms of Line Equation:
1. **Slope-intercept**: y = mx + c
2. **Point-slope**: y - y₁ = m(x - x₁)
3. **Two-point**: (y-y₁)/(y₂-y₁) = (x-x₁)/(x₂-x₁)
4. **Intercept**: x/a + y/b = 1

## Slope:
m = (y₂ - y₁)/(x₂ - x₁) = tan θ

## Distance:
d = |ax₁ + by₁ + c|/√(a² + b²)

## Parallel Lines: m₁ = m₂
## Perpendicular: m₁ × m₂ = -1`,
    xpReward: 35,
    readTime: 7,
  },
  {
    id: 'note-hsc-ict-3',
    topicId: 'database',
    subjectId: 'ict',
    title: 'Database Fundamentals',
    titleBn: 'ডাটাবেস মৌলিক ধারণা',
    content: `# Database Fundamentals

## What is a Database?
Organized collection of data

## DBMS Components:
- Tables (Relations)
- Fields (Columns)
- Records (Rows)

## Key Types:
- Primary Key: Unique identifier
- Foreign Key: Links tables
- Candidate Key: Potential primary keys

## SQL Commands:
- SELECT: Retrieve data
- INSERT: Add data
- UPDATE: Modify data
- DELETE: Remove data

## Normalization:
- 1NF, 2NF, 3NF
- Reduces redundancy`,
    xpReward: 25,
    readTime: 5,
  },
  {
    id: 'note-hsc-ict-4',
    topicId: 'web',
    subjectId: 'ict',
    title: 'HTML and CSS Basics',
    titleBn: 'HTML এবং CSS বেসিক',
    content: `# HTML and CSS

## HTML Structure:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>Heading</h1>
  <p>Paragraph</p>
</body>
</html>
\`\`\`

## Common Tags:
- <h1>-<h6>: Headings
- <p>: Paragraph
- <a>: Links
- <img>: Images
- <div>: Container

## CSS Basics:
\`\`\`css
selector {
  property: value;
}
\`\`\``,
    xpReward: 30,
    readTime: 6,
  },
];

export const sampleQuestions: Question[] = [
  // Math Questions
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
    id: 'q-math-3',
    subjectId: 'math',
    topicId: 'trigonometry',
    question: 'What is the value of sin(30°)?',
    questionBn: 'sin(30°) এর মান কত?',
    options: ['1/2', '√3/2', '1', '0'],
    optionsBn: ['১/২', '√৩/২', '১', '০'],
    correctAnswer: 0,
    explanation: 'sin(30°) = 1/2. This is one of the standard angles.',
    explanationBn: 'sin(30°) = ১/২। এটি একটি আদর্শ কোণ।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-math-4',
    subjectId: 'math',
    topicId: 'statistics',
    question: 'What is the mean of 5, 10, 15, 20, 25?',
    questionBn: '৫, ১০, ১৫, ২০, ২৫ এর গড় কত?',
    options: ['10', '15', '20', '25'],
    optionsBn: ['১০', '১৫', '২০', '২৫'],
    correctAnswer: 1,
    explanation: 'Mean = (5+10+15+20+25)/5 = 75/5 = 15',
    explanationBn: 'গড় = (৫+১০+১৫+২০+২৫)/৫ = ৭৫/৫ = ১৫',
    difficulty: 'easy',
    points: 10,
  },
  // Physics Questions
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
  {
    id: 'q-physics-3',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'What is Newton\'s Second Law of Motion?',
    questionBn: 'নিউটনের দ্বিতীয় গতিসূত্র কী?',
    options: ['F = ma', 'F = mv', 'E = mc²', 'P = mv'],
    correctAnswer: 0,
    explanation: 'Newton\'s Second Law states that Force = mass × acceleration (F = ma)',
    explanationBn: 'নিউটনের দ্বিতীয় গতিসূত্র বলে বল = ভর × ত্বরণ (F = ma)',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-4',
    subjectId: 'physics',
    topicId: 'optics',
    question: 'What is the speed of light in vacuum?',
    questionBn: 'শূন্য মাধ্যমে আলোর গতি কত?',
    options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
    correctAnswer: 1,
    explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s.',
    explanationBn: 'শূন্য মাধ্যমে আলোর গতি প্রায় 3 × 10⁸ m/s।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-5',
    subjectId: 'physics',
    topicId: 'waves',
    question: 'What type of wave is sound?',
    questionBn: 'শব্দ কোন ধরনের তরঙ্গ?',
    options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Surface'],
    optionsBn: ['অনুপ্রস্থ', 'অনুদৈর্ঘ্য', 'তাড়িতচুম্বকীয়', 'পৃষ্ঠ'],
    correctAnswer: 1,
    explanation: 'Sound is a longitudinal wave where particles vibrate parallel to the direction of wave propagation.',
    explanationBn: 'শব্দ একটি অনুদৈর্ঘ্য তরঙ্গ যেখানে কণাগুলি তরঙ্গ প্রসারণের দিকে সমান্তরালে কম্পিত হয়।',
    difficulty: 'medium',
    points: 15,
  },
  // Chemistry Questions
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
    id: 'q-chem-2',
    subjectId: 'chemistry',
    topicId: 'organic',
    question: 'What is the functional group in alcohols?',
    questionBn: 'অ্যালকোহলে কোন কার্যকরী গ্রুপ থাকে?',
    options: ['-COOH', '-OH', '-CHO', '-NH₂'],
    correctAnswer: 1,
    explanation: 'Alcohols contain the hydroxyl (-OH) functional group.',
    explanationBn: 'অ্যালকোহলে হাইড্রক্সিল (-OH) কার্যকরী গ্রুপ থাকে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-chem-3',
    subjectId: 'chemistry',
    topicId: 'inorganic',
    question: 'What is the chemical symbol for Gold?',
    questionBn: 'সোনার রাসায়নিক প্রতীক কী?',
    options: ['Ag', 'Au', 'Fe', 'Cu'],
    correctAnswer: 1,
    explanation: 'Au is the chemical symbol for Gold, derived from Latin "Aurum".',
    explanationBn: 'Au সোনার রাসায়নিক প্রতীক, ল্যাটিন "Aurum" থেকে এসেছে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-chem-4',
    subjectId: 'chemistry',
    topicId: 'reactions',
    question: 'What type of reaction is: 2H₂ + O₂ → 2H₂O?',
    questionBn: '2H₂ + O₂ → 2H₂O কোন ধরনের বিক্রিয়া?',
    options: ['Decomposition', 'Combination', 'Displacement', 'Neutralization'],
    optionsBn: ['বিয়োজন', 'সংযোজন', 'প্রতিস্থাপন', 'প্রশমন'],
    correctAnswer: 1,
    explanation: 'This is a combination (synthesis) reaction where two substances combine to form one.',
    explanationBn: 'এটি একটি সংযোজন বিক্রিয়া যেখানে দুটি পদার্থ মিলে একটি তৈরি হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-chem-5',
    subjectId: 'chemistry',
    topicId: 'periodic',
    question: 'How many elements are in the first period of the periodic table?',
    questionBn: 'পর্যায় সারণির প্রথম পর্যায়ে কতটি মৌল আছে?',
    options: ['2', '8', '18', '32'],
    optionsBn: ['২', '৮', '১৮', '৩২'],
    correctAnswer: 0,
    explanation: 'The first period has only 2 elements: Hydrogen (H) and Helium (He).',
    explanationBn: 'প্রথম পর্যায়ে মাত্র ২টি মৌল আছে: হাইড্রোজেন (H) এবং হিলিয়াম (He)।',
    difficulty: 'easy',
    points: 10,
  },
  // Biology Questions - Fixed: Added more questions
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
    id: 'q-bio-2',
    subjectId: 'biology',
    topicId: 'cell',
    question: 'What is the function of the nucleus?',
    questionBn: 'নিউক্লিয়াসের কাজ কী?',
    options: ['Energy production', 'Protein synthesis', 'Control center containing DNA', 'Waste removal'],
    optionsBn: ['শক্তি উৎপাদন', 'প্রোটিন সংশ্লেষণ', 'DNA ধারণকারী নিয়ন্ত্রণ কেন্দ্র', 'বর্জ্য অপসারণ'],
    correctAnswer: 2,
    explanation: 'The nucleus is the control center of the cell, containing genetic material (DNA) that controls cell activities.',
    explanationBn: 'নিউক্লিয়াস কোষের নিয়ন্ত্রণ কেন্দ্র, যেখানে জেনেটিক পদার্থ (DNA) থাকে যা কোষের কার্যক্রম নিয়ন্ত্রণ করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-3',
    subjectId: 'biology',
    topicId: 'genetics',
    question: 'What is the full form of DNA?',
    questionBn: 'DNA এর পূর্ণ রূপ কী?',
    options: ['Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Deoxyribose Acid', 'Dinucleic Acid'],
    correctAnswer: 0,
    explanation: 'DNA stands for Deoxyribonucleic Acid, which carries genetic information.',
    explanationBn: 'DNA এর পূর্ণ রূপ ডিঅক্সিরাইবোনিউক্লিক এসিড, যা জেনেটিক তথ্য বহন করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-4',
    subjectId: 'biology',
    topicId: 'genetics',
    question: 'Who is known as the "Father of Genetics"?',
    questionBn: '"বংশগতির জনক" কে?',
    options: ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Robert Hooke'],
    optionsBn: ['চার্লস ডারউইন', 'গ্রেগর মেন্ডেল', 'লুই পাস্তুর', 'রবার্ট হুক'],
    correctAnswer: 1,
    explanation: 'Gregor Mendel is known as the Father of Genetics for his work on pea plant inheritance.',
    explanationBn: 'গ্রেগর মেন্ডেল মটরশুঁটি গাছের বংশগতি নিয়ে গবেষণার জন্য বংশগতির জনক হিসেবে পরিচিত।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-5',
    subjectId: 'biology',
    topicId: 'ecology',
    question: 'What is the primary source of energy in most ecosystems?',
    questionBn: 'বেশিরভাগ বাস্তুতন্ত্রে প্রাথমিক শক্তির উৎস কী?',
    options: ['Water', 'Soil', 'Sun', 'Wind'],
    optionsBn: ['পানি', 'মাটি', 'সূর্য', 'বায়ু'],
    correctAnswer: 2,
    explanation: 'The sun is the primary source of energy in most ecosystems, used by plants for photosynthesis.',
    explanationBn: 'সূর্য বেশিরভাগ বাস্তুতন্ত্রে প্রাথমিক শক্তির উৎস, যা উদ্ভিদ সালোকসংশ্লেষণের জন্য ব্যবহার করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-6',
    subjectId: 'biology',
    topicId: 'human',
    question: 'What is the largest organ in the human body?',
    questionBn: 'মানবদেহের সবচেয়ে বড় অঙ্গ কোনটি?',
    options: ['Liver', 'Heart', 'Skin', 'Brain'],
    optionsBn: ['যকৃত', 'হৃদপিণ্ড', 'ত্বক', 'মস্তিষ্ক'],
    correctAnswer: 2,
    explanation: 'The skin is the largest organ in the human body, covering about 2 square meters.',
    explanationBn: 'ত্বক মানবদেহের সবচেয়ে বড় অঙ্গ, যা প্রায় ২ বর্গমিটার আচ্ছাদিত করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-7',
    subjectId: 'biology',
    topicId: 'cell',
    question: 'Which organelle is responsible for protein synthesis?',
    questionBn: 'কোন অঙ্গাণু প্রোটিন সংশ্লেষণের জন্য দায়ী?',
    options: ['Mitochondria', 'Ribosome', 'Lysosome', 'Vacuole'],
    optionsBn: ['মাইটোকন্ড্রিয়া', 'রাইবোসোম', 'লাইসোসোম', 'গহ্বর'],
    correctAnswer: 1,
    explanation: 'Ribosomes are responsible for protein synthesis in cells.',
    explanationBn: 'রাইবোসোম কোষে প্রোটিন সংশ্লেষণের জন্য দায়ী।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-8',
    subjectId: 'biology',
    topicId: 'human',
    question: 'How many chambers does the human heart have?',
    questionBn: 'মানুষের হৃদপিণ্ডে কতটি প্রকোষ্ঠ আছে?',
    options: ['2', '3', '4', '5'],
    optionsBn: ['২', '৩', '৪', '৫'],
    correctAnswer: 2,
    explanation: 'The human heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower).',
    explanationBn: 'মানুষের হৃদপিণ্ডে ৪টি প্রকোষ্ঠ আছে: ২টি অলিন্দ (উপরে) এবং ২টি নিলয় (নিচে)।',
    difficulty: 'easy',
    points: 10,
  },
  // English Questions
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
    id: 'q-eng-2',
    subjectId: 'english',
    topicId: 'vocabulary',
    question: 'What is the synonym of "happy"?',
    options: ['Sad', 'Joyful', 'Angry', 'Tired'],
    correctAnswer: 1,
    explanation: '"Joyful" is a synonym of "happy" meaning feeling or showing great pleasure.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-eng-3',
    subjectId: 'english',
    topicId: 'grammar',
    question: 'Which is the correct passive voice of "She writes a letter"?',
    options: ['A letter is written by her', 'A letter was written by her', 'A letter will be written by her', 'A letter has been written by her'],
    correctAnswer: 0,
    explanation: 'In simple present tense, passive voice uses "is/am/are + past participle".',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-eng-4',
    subjectId: 'english',
    topicId: 'vocabulary',
    question: 'What is the antonym of "ancient"?',
    options: ['Old', 'Modern', 'Historic', 'Traditional'],
    correctAnswer: 1,
    explanation: '"Modern" is the antonym of "ancient", meaning belonging to the present time.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-eng-5',
    subjectId: 'english',
    topicId: 'comprehension',
    question: 'What is the main purpose of a thesis statement?',
    options: ['To summarize the conclusion', 'To present the main argument', 'To list sources', 'To provide background'],
    correctAnswer: 1,
    explanation: 'A thesis statement presents the main argument or point of an essay.',
    difficulty: 'medium',
    points: 15,
  },
  // HSC Physics 1st Paper
  {
    id: 'q-hsc-phy1-1',
    subjectId: 'physics-1',
    topicId: 'vectors',
    question: 'What is the magnitude of a unit vector?',
    questionBn: 'একক ভেক্টরের মান কত?',
    options: ['0', '1', '2', 'Infinity'],
    optionsBn: ['০', '১', '২', 'অসীম'],
    correctAnswer: 1,
    explanation: 'A unit vector has a magnitude of exactly 1.',
    explanationBn: 'একক ভেক্টরের মান ঠিক ১।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy1-2',
    subjectId: 'physics-1',
    topicId: 'dynamics',
    question: 'What is the unit of momentum?',
    questionBn: 'ভরবেগের একক কী?',
    options: ['kg·m/s²', 'kg·m/s', 'N/s', 'J/s'],
    correctAnswer: 1,
    explanation: 'Momentum = mass × velocity, so its unit is kg·m/s.',
    explanationBn: 'ভরবেগ = ভর × বেগ, তাই এর একক kg·m/s।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy1-3',
    subjectId: 'physics-1',
    topicId: 'work-energy',
    question: 'What is the SI unit of work?',
    questionBn: 'কাজের SI একক কী?',
    options: ['Watt', 'Newton', 'Joule', 'Pascal'],
    optionsBn: ['ওয়াট', 'নিউটন', 'জুল', 'প্যাসকেল'],
    correctAnswer: 2,
    explanation: 'The SI unit of work is Joule (J). 1 J = 1 N·m',
    explanationBn: 'কাজের SI একক জুল (J)। ১ J = ১ N·m',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy1-4',
    subjectId: 'physics-1',
    topicId: 'gravitation',
    question: 'What is the value of gravitational constant G?',
    questionBn: 'মহাকর্ষ ধ্রুবক G এর মান কত?',
    options: ['6.67 × 10⁻¹¹ N·m²/kg²', '9.8 m/s²', '3 × 10⁸ m/s', '1.6 × 10⁻¹⁹ C'],
    correctAnswer: 0,
    explanation: 'G = 6.67 × 10⁻¹¹ N·m²/kg² is the universal gravitational constant.',
    explanationBn: 'G = 6.67 × 10⁻¹¹ N·m²/kg² সার্বজনীন মহাকর্ষ ধ্রুবক।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-phy1-5',
    subjectId: 'physics-1',
    topicId: 'rotation',
    question: 'What is the SI unit of angular velocity?',
    questionBn: 'কৌণিক বেগের SI একক কী?',
    options: ['m/s', 'rad/s', 'Hz', 'rpm'],
    correctAnswer: 1,
    explanation: 'Angular velocity is measured in radians per second (rad/s).',
    explanationBn: 'কৌণিক বেগ রেডিয়ান/সেকেন্ড (rad/s) এ পরিমাপ করা হয়।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Physics 2nd Paper
  {
    id: 'q-hsc-phy2-1',
    subjectId: 'physics-2',
    topicId: 'electricity-hsc',
    question: "What is Ohm's Law?",
    questionBn: 'ওহমের সূত্র কী?',
    options: ['V = IR', 'P = IV', 'E = mc²', 'F = ma'],
    correctAnswer: 0,
    explanation: "Ohm's Law states V = IR, where V is voltage, I is current, and R is resistance.",
    explanationBn: 'ওহমের সূত্র বলে V = IR, যেখানে V ভোল্টেজ, I বিদ্যুৎ প্রবাহ, R রোধ।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy2-2',
    subjectId: 'physics-2',
    topicId: 'magnetism',
    question: 'What is the SI unit of magnetic flux?',
    questionBn: 'চৌম্বক ফ্লাক্সের SI একক কী?',
    options: ['Tesla', 'Weber', 'Henry', 'Ampere'],
    optionsBn: ['টেসলা', 'ওয়েবার', 'হেনরি', 'অ্যাম্পিয়ার'],
    correctAnswer: 1,
    explanation: 'The SI unit of magnetic flux is Weber (Wb). 1 Wb = 1 T·m²',
    explanationBn: 'চৌম্বক ফ্লাক্সের SI একক ওয়েবার (Wb)। ১ Wb = ১ T·m²',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy2-3',
    subjectId: 'physics-2',
    topicId: 'modern-physics',
    question: 'What is the charge of an electron?',
    questionBn: 'ইলেকট্রনের চার্জ কত?',
    options: ['+1.6 × 10⁻¹⁹ C', '-1.6 × 10⁻¹⁹ C', '0 C', '9.1 × 10⁻³¹ C'],
    correctAnswer: 1,
    explanation: 'An electron has a charge of -1.6 × 10⁻¹⁹ Coulombs.',
    explanationBn: 'ইলেকট্রনের চার্জ -1.6 × 10⁻¹⁹ কুলম্ব।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-phy2-4',
    subjectId: 'physics-2',
    topicId: 'semiconductor',
    question: 'What type of semiconductor is Silicon at room temperature?',
    questionBn: 'সাধারণ তাপমাত্রায় সিলিকন কোন ধরনের অর্ধপরিবাহী?',
    options: ['P-type', 'N-type', 'Intrinsic', 'Extrinsic'],
    optionsBn: ['P-টাইপ', 'N-টাইপ', 'অন্তর্জাত', 'বহির্জাত'],
    correctAnswer: 2,
    explanation: 'Pure Silicon at room temperature is an intrinsic semiconductor.',
    explanationBn: 'বিশুদ্ধ সিলিকন সাধারণ তাপমাত্রায় অন্তর্জাত অর্ধপরিবাহী।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-phy2-5',
    subjectId: 'physics-2',
    topicId: 'atomic-physics',
    question: "Who proposed the atomic model with electron orbits?",
    questionBn: 'ইলেকট্রন কক্ষপথ সহ পারমাণবিক মডেল কে প্রস্তাব করেন?',
    options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
    optionsBn: ['ডাল্টন', 'থমসন', 'রাদারফোর্ড', 'বোর'],
    correctAnswer: 3,
    explanation: 'Niels Bohr proposed the atomic model with electrons in discrete orbits.',
    explanationBn: 'নিলস বোর বিচ্ছিন্ন কক্ষপথে ইলেকট্রন সহ পারমাণবিক মডেল প্রস্তাব করেন।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Chemistry 1st Paper
  {
    id: 'q-hsc-chem1-1',
    subjectId: 'chemistry-1',
    topicId: 'atomic-structure',
    question: 'What is the maximum number of electrons in the first shell?',
    questionBn: 'প্রথম শেলে সর্বাধিক কতটি ইলেকট্রন থাকতে পারে?',
    options: ['2', '8', '18', '32'],
    optionsBn: ['২', '৮', '১৮', '৩২'],
    correctAnswer: 0,
    explanation: 'The first shell (n=1) can hold a maximum of 2 electrons.',
    explanationBn: 'প্রথম শেলে (n=১) সর্বাধিক ২টি ইলেকট্রন থাকতে পারে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem1-2',
    subjectId: 'chemistry-1',
    topicId: 'chemical-bonding',
    question: 'What type of bond is formed between Na and Cl in NaCl?',
    questionBn: 'NaCl-এ Na ও Cl এর মধ্যে কোন ধরনের বন্ধন গঠিত হয়?',
    options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
    optionsBn: ['সমযোজী', 'আয়নিক', 'ধাতব', 'হাইড্রোজেন'],
    correctAnswer: 1,
    explanation: 'NaCl has ionic bond formed by transfer of electron from Na to Cl.',
    explanationBn: 'NaCl-এ Na থেকে Cl-এ ইলেকট্রন স্থানান্তরের মাধ্যমে আয়নিক বন্ধন গঠিত হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem1-3',
    subjectId: 'chemistry-1',
    topicId: 'states-matter',
    question: 'At what temperature does water boil at standard pressure?',
    questionBn: 'প্রমাণ চাপে পানি কত তাপমাত্রায় ফুটে?',
    options: ['0°C', '100°C', '212°C', '373°C'],
    optionsBn: ['০°C', '১০০°C', '২১২°C', '৩৭৩°C'],
    correctAnswer: 1,
    explanation: 'Water boils at 100°C (212°F or 373 K) at standard atmospheric pressure.',
    explanationBn: 'প্রমাণ বায়ুমণ্ডলীয় চাপে পানি ১০০°C (২১২°F বা ৩৭৩ K) এ ফুটে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem1-4',
    subjectId: 'chemistry-1',
    topicId: 'periodic-properties',
    question: 'Which group elements are called halogens?',
    questionBn: 'কোন গ্রুপের মৌলগুলিকে হ্যালোজেন বলা হয়?',
    options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'],
    optionsBn: ['গ্রুপ ১', 'গ্রুপ ২', 'গ্রুপ ১৭', 'গ্রুপ ১৮'],
    correctAnswer: 2,
    explanation: 'Group 17 elements (F, Cl, Br, I, At) are called halogens.',
    explanationBn: 'গ্রুপ ১৭ এর মৌলগুলি (F, Cl, Br, I, At) হ্যালোজেন বলা হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem1-5',
    subjectId: 'chemistry-1',
    topicId: 'atomic-structure',
    question: 'What is the mass number of an atom with 6 protons and 6 neutrons?',
    questionBn: '৬টি প্রোটন ও ৬টি নিউট্রন বিশিষ্ট পরমাণুর ভর সংখ্যা কত?',
    options: ['6', '12', '18', '36'],
    optionsBn: ['৬', '১২', '১৮', '৩৬'],
    correctAnswer: 1,
    explanation: 'Mass number = protons + neutrons = 6 + 6 = 12 (This is Carbon-12).',
    explanationBn: 'ভর সংখ্যা = প্রোটন + নিউট্রন = ৬ + ৬ = ১২ (এটি কার্বন-১২)।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Higher Math 1st Paper
  {
    id: 'q-hsc-hm1-1',
    subjectId: 'higher-math-1',
    topicId: 'matrices',
    question: 'What is the determinant of a 2×2 identity matrix?',
    questionBn: '২×২ একক ম্যাট্রিক্সের নির্ণায়ক কত?',
    options: ['0', '1', '2', '-1'],
    optionsBn: ['০', '১', '২', '-১'],
    correctAnswer: 1,
    explanation: 'The determinant of any identity matrix is 1.',
    explanationBn: 'যেকোনো একক ম্যাট্রিক্সের নির্ণায়ক ১।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm1-2',
    subjectId: 'higher-math-1',
    topicId: 'complex-numbers',
    question: 'What is the value of i²?',
    questionBn: 'i² এর মান কত?',
    options: ['1', '-1', 'i', '-i'],
    optionsBn: ['১', '-১', 'i', '-i'],
    correctAnswer: 1,
    explanation: 'i² = -1, where i is the imaginary unit.',
    explanationBn: 'i² = -১, যেখানে i হল কাল্পনিক একক।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm1-3',
    subjectId: 'higher-math-1',
    topicId: 'trigonometry-hsc',
    question: 'What is the value of cos(0°)?',
    questionBn: 'cos(0°) এর মান কত?',
    options: ['0', '1', '-1', '1/2'],
    optionsBn: ['০', '১', '-১', '১/২'],
    correctAnswer: 1,
    explanation: 'cos(0°) = 1',
    explanationBn: 'cos(0°) = ১',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm1-4',
    subjectId: 'higher-math-1',
    topicId: 'polynomials',
    question: 'What is the degree of the polynomial x³ + 2x² - 5x + 1?',
    questionBn: 'x³ + 2x² - 5x + 1 বহুপদীটির ঘাত কত?',
    options: ['1', '2', '3', '4'],
    optionsBn: ['১', '২', '৩', '৪'],
    correctAnswer: 2,
    explanation: 'The degree is the highest power of x, which is 3.',
    explanationBn: 'ঘাত হল x এর সর্বোচ্চ সূচক, যা ৩।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm1-5',
    subjectId: 'higher-math-1',
    topicId: 'matrices',
    question: 'If A is a 3×2 matrix and B is a 2×4 matrix, what is the size of AB?',
    questionBn: 'যদি A একটি 3×2 ম্যাট্রিক্স এবং B একটি 2×4 ম্যাট্রিক্স হয়, AB এর আকার কত?',
    options: ['3×4', '2×2', '4×3', '3×2'],
    optionsBn: ['৩×৪', '২×২', '৪×৩', '৩×২'],
    correctAnswer: 0,
    explanation: 'AB will be a 3×4 matrix (rows of A × columns of B).',
    explanationBn: 'AB একটি ৩×৪ ম্যাট্রিক্স হবে (A এর সারি × B এর কলাম)।',
    difficulty: 'medium',
    points: 15,
  },
  // HSC Higher Math 2nd Paper
  {
    id: 'q-hsc-hm2-1',
    subjectId: 'higher-math-2',
    topicId: 'calculus',
    question: 'What is the derivative of x²?',
    questionBn: 'x² এর অন্তরক কত?',
    options: ['x', '2x', 'x²', '2'],
    optionsBn: ['x', '2x', 'x²', '২'],
    correctAnswer: 1,
    explanation: 'd/dx(x²) = 2x using the power rule.',
    explanationBn: 'সূচক নিয়ম ব্যবহার করে d/dx(x²) = 2x।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-2',
    subjectId: 'higher-math-2',
    topicId: 'integration',
    question: 'What is ∫2x dx?',
    questionBn: '∫2x dx = ?',
    options: ['x + C', 'x² + C', '2x² + C', '2 + C'],
    optionsBn: ['x + C', 'x² + C', '2x² + C', '২ + C'],
    correctAnswer: 1,
    explanation: '∫2x dx = x² + C',
    explanationBn: '∫2x dx = x² + C',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-3',
    subjectId: 'higher-math-2',
    topicId: 'coordinate-geometry',
    question: 'What is the distance between points (0,0) and (3,4)?',
    questionBn: '(০,০) এবং (৩,৪) বিন্দু দুটির মধ্যে দূরত্ব কত?',
    options: ['3', '4', '5', '7'],
    optionsBn: ['৩', '৪', '৫', '৭'],
    correctAnswer: 2,
    explanation: 'Distance = √(3² + 4²) = √(9 + 16) = √25 = 5',
    explanationBn: 'দূরত্ব = √(৩² + ৪²) = √(৯ + ১৬) = √২৫ = ৫',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-4',
    subjectId: 'higher-math-2',
    topicId: 'probability-stats',
    question: 'What is the probability of getting heads when tossing a fair coin?',
    questionBn: 'একটি সুষম মুদ্রা টস করলে হেড পাওয়ার সম্ভাবনা কত?',
    options: ['0', '1/4', '1/2', '1'],
    optionsBn: ['০', '১/৪', '১/২', '১'],
    correctAnswer: 2,
    explanation: 'P(heads) = 1/2 for a fair coin.',
    explanationBn: 'সুষম মুদ্রার জন্য P(হেড) = ১/২।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-5',
    subjectId: 'higher-math-2',
    topicId: 'calculus',
    question: 'What is the derivative of sin(x)?',
    questionBn: 'sin(x) এর অন্তরক কত?',
    options: ['sin(x)', 'cos(x)', '-sin(x)', '-cos(x)'],
    optionsBn: ['sin(x)', 'cos(x)', '-sin(x)', '-cos(x)'],
    correctAnswer: 1,
    explanation: 'd/dx[sin(x)] = cos(x)',
    explanationBn: 'd/dx[sin(x)] = cos(x)',
    difficulty: 'easy',
    points: 10,
  },
  // Additional Physics Questions for 10+ questions
  {
    id: 'q-physics-6',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'What is the SI unit of momentum?',
    questionBn: 'ভরবেগের SI একক কী?',
    options: ['kg·m/s', 'N·s', 'Both A and B', 'J/s'],
    optionsBn: ['kg·m/s', 'N·s', 'A এবং B উভয়', 'J/s'],
    correctAnswer: 2,
    explanation: 'Momentum = mass × velocity. Its unit is kg·m/s which equals N·s (Newton-second).',
    explanationBn: 'ভরবেগ = ভর × বেগ। এর একক kg·m/s যা N·s (নিউটন-সেকেন্ড) এর সমান।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-physics-7',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'What is the acceleration due to gravity on Earth?',
    questionBn: 'পৃথিবীতে মাধ্যাকর্ষণ ত্বরণ কত?',
    options: ['9.8 m/s', '9.8 m/s²', '10 km/s²', '8.9 m/s²'],
    correctAnswer: 1,
    explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s².',
    explanationBn: 'পৃথিবীতে মাধ্যাকর্ষণ ত্বরণ প্রায় 9.8 m/s²।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-8',
    subjectId: 'physics',
    topicId: 'electricity',
    question: 'What is Ohm\'s Law?',
    questionBn: 'ওহমের সূত্র কী?',
    options: ['V = IR', 'P = VI', 'E = mc²', 'F = ma'],
    correctAnswer: 0,
    explanation: 'Ohm\'s Law states V = IR, where V is voltage, I is current, and R is resistance.',
    explanationBn: 'ওহমের সূত্র বলে V = IR, যেখানে V হল ভোল্টেজ, I হল কারেন্ট এবং R হল রেজিস্ট্যান্স।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-9',
    subjectId: 'physics',
    topicId: 'optics',
    question: 'What phenomenon causes a rainbow?',
    questionBn: 'রংধনু তৈরির কারণ কোন ঘটনা?',
    options: ['Reflection', 'Refraction', 'Dispersion', 'Diffraction'],
    optionsBn: ['প্রতিফলন', 'প্রতিসরণ', 'বিচ্ছুরণ', 'অপবর্তন'],
    correctAnswer: 2,
    explanation: 'Dispersion of light causes rainbows - white light splits into its component colors.',
    explanationBn: 'আলোর বিচ্ছুরণ রংধনু তৈরি করে - সাদা আলো তার উপাদান রঙে বিভক্ত হয়।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-physics-10',
    subjectId: 'physics',
    topicId: 'waves',
    question: 'What is the relationship between frequency and wavelength?',
    questionBn: 'কম্পাঙ্ক এবং তরঙ্গদৈর্ঘ্যের মধ্যে সম্পর্ক কী?',
    options: ['Directly proportional', 'Inversely proportional', 'No relation', 'Equal'],
    optionsBn: ['সমানুপাতিক', 'বিপরীত সমানুপাতিক', 'কোনো সম্পর্ক নেই', 'সমান'],
    correctAnswer: 1,
    explanation: 'Frequency and wavelength are inversely proportional: v = fλ, where v is constant.',
    explanationBn: 'কম্পাঙ্ক এবং তরঙ্গদৈর্ঘ্য বিপরীত সমানুপাতিক: v = fλ, যেখানে v ধ্রুবক।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-physics-11',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'What is kinetic energy?',
    questionBn: 'গতিশক্তি কী?',
    options: ['Energy at rest', 'Energy due to motion', 'Energy due to position', 'Heat energy'],
    optionsBn: ['স্থির শক্তি', 'গতির কারণে শক্তি', 'অবস্থানের কারণে শক্তি', 'তাপ শক্তি'],
    correctAnswer: 1,
    explanation: 'Kinetic energy is the energy possessed by an object due to its motion. KE = ½mv²',
    explanationBn: 'গতিশক্তি হল গতির কারণে কোনো বস্তুর শক্তি। KE = ½mv²',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-12',
    subjectId: 'physics',
    topicId: 'electricity',
    question: 'What is the unit of electrical resistance?',
    questionBn: 'তড়িৎ রোধের একক কী?',
    options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
    optionsBn: ['অ্যাম্পিয়ার', 'ভোল্ট', 'ওহম', 'ওয়াট'],
    correctAnswer: 2,
    explanation: 'The SI unit of electrical resistance is Ohm (Ω).',
    explanationBn: 'তড়িৎ রোধের SI একক হল ওহম (Ω)।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Chemistry 2nd Paper
  {
    id: 'q-hsc-chem2-1',
    subjectId: 'chemistry-2',
    topicId: 'organic-hsc',
    question: 'What is the general formula of alkanes?',
    questionBn: 'অ্যালকেনের সাধারণ সংকেত কী?',
    options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'],
    correctAnswer: 1,
    explanation: 'Alkanes have the general formula CnH2n+2, where n is the number of carbon atoms.',
    explanationBn: 'অ্যালকেনের সাধারণ সংকেত CnH2n+2, যেখানে n হল কার্বন পরমাণুর সংখ্যা।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem2-2',
    subjectId: 'chemistry-2',
    topicId: 'hydrocarbons',
    question: 'Which hydrocarbon is the simplest alkane?',
    questionBn: 'কোন হাইড্রোকার্বন সবচেয়ে সরল অ্যালকেন?',
    options: ['Ethane', 'Methane', 'Propane', 'Butane'],
    optionsBn: ['ইথেন', 'মিথেন', 'প্রোপেন', 'বিউটেন'],
    correctAnswer: 1,
    explanation: 'Methane (CH4) is the simplest alkane with only one carbon atom.',
    explanationBn: 'মিথেন (CH4) হল সবচেয়ে সরল অ্যালকেন যাতে মাত্র একটি কার্বন পরমাণু আছে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem2-3',
    subjectId: 'chemistry-2',
    topicId: 'organic-hsc',
    question: 'What is the functional group of aldehydes?',
    questionBn: 'অ্যালডিহাইডের কার্যকরী গ্রুপ কী?',
    options: ['-OH', '-CHO', '-COOH', '-CO-'],
    correctAnswer: 1,
    explanation: 'Aldehydes contain the -CHO (formyl) functional group.',
    explanationBn: 'অ্যালডিহাইডে -CHO (ফর্মিল) কার্যকরী গ্রুপ থাকে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem2-4',
    subjectId: 'chemistry-2',
    topicId: 'polymers',
    question: 'What is the monomer of polythene?',
    questionBn: 'পলিথিনের মনোমার কী?',
    options: ['Ethane', 'Ethene', 'Ethyne', 'Methane'],
    optionsBn: ['ইথেন', 'ইথিন', 'ইথাইন', 'মিথেন'],
    correctAnswer: 1,
    explanation: 'Polythene (polyethylene) is made from ethene (C2H4) monomers.',
    explanationBn: 'পলিথিন (পলিইথিলিন) ইথিন (C2H4) মনোমার থেকে তৈরি হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem2-5',
    subjectId: 'chemistry-2',
    topicId: 'env-chemistry',
    question: 'Which gas causes acid rain?',
    questionBn: 'কোন গ্যাস এসিড বৃষ্টির কারণ?',
    options: ['O2', 'N2', 'SO2', 'H2'],
    correctAnswer: 2,
    explanation: 'Sulfur dioxide (SO2) combines with water to form sulfuric acid, causing acid rain.',
    explanationBn: 'সালফার ডাইঅক্সাইড (SO2) পানির সাথে মিশে সালফিউরিক এসিড তৈরি করে এসিড বৃষ্টি ঘটায়।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Biology 1st Paper
  {
    id: 'q-hsc-bio1-1',
    subjectId: 'biology-1',
    topicId: 'cell-hsc',
    question: 'Which type of cell division produces identical daughter cells?',
    questionBn: 'কোন ধরনের কোষ বিভাজন অভিন্ন অপত্য কোষ তৈরি করে?',
    options: ['Meiosis', 'Mitosis', 'Amitosis', 'Binary fission'],
    optionsBn: ['মিয়োসিস', 'মাইটোসিস', 'অ্যামাইটোসিস', 'দ্বি-বিভাজন'],
    correctAnswer: 1,
    explanation: 'Mitosis produces two identical daughter cells with the same chromosome number.',
    explanationBn: 'মাইটোসিস একই ক্রোমোসোম সংখ্যা সহ দুটি অভিন্ন অপত্য কোষ তৈরি করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio1-2',
    subjectId: 'biology-1',
    topicId: 'cell-chemistry',
    question: 'Which biomolecule stores genetic information?',
    questionBn: 'কোন জৈব অণু জেনেটিক তথ্য সংরক্ষণ করে?',
    options: ['Protein', 'Carbohydrate', 'Lipid', 'Nucleic acid'],
    optionsBn: ['প্রোটিন', 'কার্বোহাইড্রেট', 'লিপিড', 'নিউক্লিক এসিড'],
    correctAnswer: 3,
    explanation: 'Nucleic acids (DNA and RNA) store and transmit genetic information.',
    explanationBn: 'নিউক্লিক এসিড (DNA এবং RNA) জেনেটিক তথ্য সংরক্ষণ ও প্রেরণ করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio1-3',
    subjectId: 'biology-1',
    topicId: 'plant-physiology',
    question: 'What is the site of photosynthesis in plants?',
    questionBn: 'উদ্ভিদে সালোকসংশ্লেষণের স্থান কোথায়?',
    options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
    optionsBn: ['মাইটোকন্ড্রিয়া', 'ক্লোরোপ্লাস্ট', 'নিউক্লিয়াস', 'রাইবোসোম'],
    correctAnswer: 1,
    explanation: 'Photosynthesis occurs in chloroplasts, which contain chlorophyll.',
    explanationBn: 'সালোকসংশ্লেষণ ক্লোরোপ্লাস্টে ঘটে, যেখানে ক্লোরোফিল থাকে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio1-4',
    subjectId: 'biology-1',
    topicId: 'plant-taxonomy',
    question: 'What is the scientific name of rice?',
    questionBn: 'ধানের বৈজ্ঞানিক নাম কী?',
    options: ['Triticum aestivum', 'Oryza sativa', 'Zea mays', 'Hordeum vulgare'],
    correctAnswer: 1,
    explanation: 'Oryza sativa is the scientific name of rice.',
    explanationBn: 'Oryza sativa ধানের বৈজ্ঞানিক নাম।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-bio1-5',
    subjectId: 'biology-1',
    topicId: 'cell-hsc',
    question: 'How many chromosomes are in a human body cell?',
    questionBn: 'মানবদেহের কোষে কতটি ক্রোমোসোম থাকে?',
    options: ['23', '46', '44', '48'],
    optionsBn: ['২৩', '৪৬', '৪৪', '৪৮'],
    correctAnswer: 1,
    explanation: 'Human body cells (somatic cells) contain 46 chromosomes (23 pairs).',
    explanationBn: 'মানবদেহের কোষে (দেহ কোষ) ৪৬টি ক্রোমোসোম (২৩ জোড়া) থাকে।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Biology 2nd Paper
  {
    id: 'q-hsc-bio2-1',
    subjectId: 'biology-2',
    topicId: 'animal-physiology',
    question: 'What is the main organ of the circulatory system?',
    questionBn: 'রক্ত সংবহন তন্ত্রের প্রধান অঙ্গ কী?',
    options: ['Lungs', 'Heart', 'Liver', 'Kidney'],
    optionsBn: ['ফুসফুস', 'হৃৎপিণ্ড', 'যকৃত', 'বৃক্ক'],
    correctAnswer: 1,
    explanation: 'The heart is the main organ that pumps blood through the circulatory system.',
    explanationBn: 'হৃৎপিণ্ড প্রধান অঙ্গ যা রক্ত সংবহন তন্ত্রের মাধ্যমে রক্ত পাম্প করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio2-2',
    subjectId: 'biology-2',
    topicId: 'genetics-hsc',
    question: 'Who proposed the theory of evolution by natural selection?',
    questionBn: 'প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব কে প্রস্তাব করেন?',
    options: ['Lamarck', 'Darwin', 'Mendel', 'Wallace'],
    optionsBn: ['ল্যামার্ক', 'ডারউইন', 'মেন্ডেল', 'ওয়ালেস'],
    correctAnswer: 1,
    explanation: 'Charles Darwin proposed the theory of evolution by natural selection.',
    explanationBn: 'চার্লস ডারউইন প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব প্রস্তাব করেন।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio2-3',
    subjectId: 'biology-2',
    topicId: 'animal-diversity',
    question: 'Which phylum do insects belong to?',
    questionBn: 'পতঙ্গ কোন পর্বের অন্তর্ভুক্ত?',
    options: ['Mollusca', 'Arthropoda', 'Annelida', 'Chordata'],
    optionsBn: ['মলাস্কা', 'আর্থ্রোপোডা', 'অ্যানেলিডা', 'কর্ডাটা'],
    correctAnswer: 1,
    explanation: 'Insects belong to phylum Arthropoda, characterized by jointed legs and exoskeleton.',
    explanationBn: 'পতঙ্গ আর্থ্রোপোডা পর্বের অন্তর্ভুক্ত, যার বৈশিষ্ট্য সন্ধিযুক্ত পা এবং বহিঃকঙ্কাল।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio2-4',
    subjectId: 'biology-2',
    topicId: 'human-physiology-hsc',
    question: 'Which hormone regulates blood sugar level?',
    questionBn: 'কোন হরমোন রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে?',
    options: ['Thyroxine', 'Adrenaline', 'Insulin', 'Testosterone'],
    optionsBn: ['থাইরক্সিন', 'অ্যাড্রেনালিন', 'ইনসুলিন', 'টেস্টোস্টেরন'],
    correctAnswer: 2,
    explanation: 'Insulin, produced by the pancreas, regulates blood sugar levels.',
    explanationBn: 'অগ্ন্যাশয় থেকে উৎপন্ন ইনসুলিন রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio2-5',
    subjectId: 'biology-2',
    topicId: 'genetics-hsc',
    question: 'What is the ratio of Mendel\'s monohybrid cross in F2 generation?',
    questionBn: 'মেন্ডেলের একসংকর ক্রসে F2 প্রজন্মে অনুপাত কত?',
    options: ['1:1', '1:2:1', '3:1', '9:3:3:1'],
    optionsBn: ['১:১', '১:২:১', '৩:১', '৯:৩:৩:১'],
    correctAnswer: 2,
    explanation: 'Mendel\'s monohybrid cross gives a 3:1 phenotypic ratio in F2 generation.',
    explanationBn: 'মেন্ডেলের একসংকর ক্রসে F2 প্রজন্মে ৩:১ ফিনোটাইপিক অনুপাত পাওয়া যায়।',
    difficulty: 'medium',
    points: 15,
  },
  // HSC English
  {
    id: 'q-hsc-eng-1',
    subjectId: 'english-hsc',
    topicId: 'grammar-hsc',
    question: 'Which sentence is in passive voice?',
    questionBn: 'কোন বাক্যটি কর্মবাচ্যে আছে?',
    options: ['She writes a letter.', 'A letter is written by her.', 'She is writing.', 'Write a letter.'],
    correctAnswer: 1,
    explanation: 'In passive voice, the object becomes the subject. "A letter is written by her" is passive.',
    explanationBn: 'কর্মবাচ্যে, কর্ম কর্তা হয়ে যায়। "A letter is written by her" কর্মবাচ্য।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-eng-2',
    subjectId: 'english-hsc',
    topicId: 'grammar-hsc',
    question: 'Choose the correct indirect speech: He said, "I am happy."',
    questionBn: 'সঠিক পরোক্ষ উক্তি বেছে নিন: He said, "I am happy."',
    options: ['He said that I am happy.', 'He said that he was happy.', 'He said that he is happy.', 'He said he am happy.'],
    correctAnswer: 1,
    explanation: 'In indirect speech, "I am" changes to "he was" and tense shifts back.',
    explanationBn: 'পরোক্ষ উক্তিতে, "I am" পরিবর্তন হয়ে "he was" হয় এবং কাল পিছিয়ে যায়।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-eng-3',
    subjectId: 'english-hsc',
    topicId: 'essay-hsc',
    question: 'What is the first paragraph of an essay called?',
    questionBn: 'প্রবন্ধের প্রথম অনুচ্ছেদকে কী বলে?',
    options: ['Conclusion', 'Body', 'Introduction', 'Summary'],
    optionsBn: ['উপসংহার', 'মূল অংশ', 'ভূমিকা', 'সারসংক্ষেপ'],
    correctAnswer: 2,
    explanation: 'The first paragraph of an essay is the introduction, which presents the topic.',
    explanationBn: 'প্রবন্ধের প্রথম অনুচ্ছেদ হল ভূমিকা, যা বিষয়টি উপস্থাপন করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-eng-4',
    subjectId: 'english-hsc',
    topicId: 'literature-hsc',
    question: 'Who wrote "Romeo and Juliet"?',
    questionBn: '"রোমিও অ্যান্ড জুলিয়েট" কে লিখেছেন?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 1,
    explanation: 'William Shakespeare wrote "Romeo and Juliet" around 1594-1596.',
    explanationBn: 'উইলিয়াম শেক্সপিয়ার ১৫৯৪-১৫৯৬ সালের দিকে "রোমিও অ্যান্ড জুলিয়েট" লিখেছেন।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-eng-5',
    subjectId: 'english-hsc',
    topicId: 'grammar-hsc',
    question: 'What is the plural of "child"?',
    questionBn: '"Child" শব্দের বহুবচন কী?',
    options: ['Childs', 'Childes', 'Children', 'Childrens'],
    correctAnswer: 2,
    explanation: '"Child" has an irregular plural form: "children".',
    explanationBn: '"Child" এর অনিয়মিত বহুবচন রূপ "children"।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC Bangla
  {
    id: 'q-hsc-bng-1',
    subjectId: 'bangla-hsc',
    topicId: 'sahitya-hsc',
    question: '"গীতাঞ্জলি" কার রচনা?',
    questionBn: '"গীতাঞ্জলি" কার রচনা?',
    options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জীবনানন্দ দাশ', 'মাইকেল মধুসূদন দত্ত'],
    correctAnswer: 1,
    explanation: '"গীতাঞ্জলি" রবীন্দ্রনাথ ঠাকুরের রচনা, যার জন্য তিনি নোবেল পুরস্কার পেয়েছিলেন।',
    explanationBn: '"গীতাঞ্জলি" রবীন্দ্রনাথ ঠাকুরের রচনা, যার জন্য তিনি নোবেল পুরস্কার পেয়েছিলেন।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bng-2',
    subjectId: 'bangla-hsc',
    topicId: 'byakaran-hsc',
    question: '"সুন্দর" শব্দের বিপরীত শব্দ কোনটি?',
    questionBn: '"সুন্দর" শব্দের বিপরীত শব্দ কোনটি?',
    options: ['কুৎসিত', 'মন্দ', 'অসুন্দর', 'খারাপ'],
    correctAnswer: 2,
    explanation: '"সুন্দর" এর বিপরীত শব্দ "অসুন্দর"।',
    explanationBn: '"সুন্দর" এর বিপরীত শব্দ "অসুন্দর"।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bng-3',
    subjectId: 'bangla-hsc',
    topicId: 'sahitya-hsc',
    question: '"বিদ্রোহী" কবিতার রচয়িতা কে?',
    questionBn: '"বিদ্রোহী" কবিতার রচয়িতা কে?',
    options: ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জসীমউদ্দীন', 'সুকান্ত ভট্টাচার্য'],
    correctAnswer: 1,
    explanation: '"বিদ্রোহী" কবিতা কাজী নজরুল ইসলামের লেখা।',
    explanationBn: '"বিদ্রোহী" কবিতা কাজী নজরুল ইসলামের লেখা।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bng-4',
    subjectId: 'bangla-hsc',
    topicId: 'byakaran-hsc',
    question: '"পদ্মা নদীর মাঝি" উপন্যাসের লেখক কে?',
    questionBn: '"পদ্মা নদীর মাঝি" উপন্যাসের লেখক কে?',
    options: ['বঙ্কিমচন্দ্র চট্টোপাধ্যায়', 'শরৎচন্দ্র চট্টোপাধ্যায়', 'মানিক বন্দ্যোপাধ্যায়', 'তারাশঙ্কর বন্দ্যোপাধ্যায়'],
    correctAnswer: 2,
    explanation: '"পদ্মা নদীর মাঝি" মানিক বন্দ্যোপাধ্যায়ের বিখ্যাত উপন্যাস।',
    explanationBn: '"পদ্মা নদীর মাঝি" মানিক বন্দ্যোপাধ্যায়ের বিখ্যাত উপন্যাস।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bng-5',
    subjectId: 'bangla-hsc',
    topicId: 'rochona-hsc',
    question: 'প্রবন্ধ রচনায় কোন অংশটি সবচেয়ে গুরুত্বপূর্ণ?',
    questionBn: 'প্রবন্ধ রচনায় কোন অংশটি সবচেয়ে গুরুত্বপূর্ণ?',
    options: ['ভূমিকা', 'মূল বক্তব্য', 'উপসংহার', 'শিরোনাম'],
    correctAnswer: 1,
    explanation: 'প্রবন্ধের মূল বক্তব্য অংশটি সবচেয়ে গুরুত্বপূর্ণ যেখানে বিষয়টি বিশদভাবে আলোচনা করা হয়।',
    explanationBn: 'প্রবন্ধের মূল বক্তব্য অংশটি সবচেয়ে গুরুত্বপূর্ণ যেখানে বিষয়টি বিশদভাবে আলোচনা করা হয়।',
    difficulty: 'easy',
    points: 10,
  },
  // HSC ICT
  {
    id: 'q-hsc-ict-1',
    subjectId: 'ict',
    topicId: 'number-system',
    question: 'What is the binary equivalent of decimal 10?',
    questionBn: 'দশমিক ১০ এর বাইনারি সমতুল্য কত?',
    options: ['1010', '1100', '1001', '1110'],
    optionsBn: ['১০১০', '১১০০', '১০০১', '১১১০'],
    correctAnswer: 0,
    explanation: '10 in decimal = 1010 in binary (8+2=10).',
    explanationBn: 'দশমিকে ১০ = বাইনারিতে ১০১০ (৮+২=১০)।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-2',
    subjectId: 'ict',
    topicId: 'programming',
    question: 'Which symbol is used for assignment in C programming?',
    questionBn: 'C প্রোগ্রামিংয়ে অ্যাসাইনমেন্টের জন্য কোন চিহ্ন ব্যবহার করা হয়?',
    options: ['==', '=', ':=', '==='],
    correctAnswer: 1,
    explanation: 'Single equals sign (=) is used for assignment in C programming.',
    explanationBn: 'C প্রোগ্রামিংয়ে অ্যাসাইনমেন্টের জন্য একক সমান চিহ্ন (=) ব্যবহার করা হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-3',
    subjectId: 'ict',
    topicId: 'database',
    question: 'What does SQL stand for?',
    questionBn: 'SQL এর পূর্ণরূপ কী?',
    options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Language', 'System Query Language'],
    correctAnswer: 1,
    explanation: 'SQL stands for Structured Query Language, used for database management.',
    explanationBn: 'SQL এর পূর্ণরূপ Structured Query Language, যা ডাটাবেস ব্যবস্থাপনায় ব্যবহৃত হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-4',
    subjectId: 'ict',
    topicId: 'web',
    question: 'What does HTML stand for?',
    questionBn: 'HTML এর পূর্ণরূপ কী?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
    correctAnswer: 0,
    explanation: 'HTML stands for Hyper Text Markup Language, used for creating web pages.',
    explanationBn: 'HTML এর পূর্ণরূপ Hyper Text Markup Language, যা ওয়েব পেজ তৈরিতে ব্যবহৃত হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-5',
    subjectId: 'ict',
    topicId: 'number-system',
    question: 'What is the hexadecimal equivalent of binary 1111?',
    questionBn: 'বাইনারি ১১১১ এর হেক্সাডেসিমেল সমতুল্য কত?',
    options: ['E', 'F', '15', '10'],
    optionsBn: ['E', 'F', '১৫', '১০'],
    correctAnswer: 1,
    explanation: 'Binary 1111 = 15 in decimal = F in hexadecimal.',
    explanationBn: 'বাইনারি ১১১১ = দশমিকে ১৫ = হেক্সাডেসিমেলে F।',
    difficulty: 'medium',
    points: 15,
  },
  // Additional SSC Questions
  {
    id: 'q-math-5',
    subjectId: 'math',
    topicId: 'algebra',
    question: 'What is the value of (a+b)² when a=3 and b=2?',
    questionBn: '(a+b)² এর মান কত যখন a=3 এবং b=2?',
    options: ['20', '25', '30', '36'],
    optionsBn: ['২০', '২৫', '৩০', '৩৬'],
    correctAnswer: 1,
    explanation: '(a+b)² = (3+2)² = 5² = 25',
    explanationBn: '(a+b)² = (3+2)² = 5² = 25',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-math-6',
    subjectId: 'math',
    topicId: 'geometry',
    question: 'What is the sum of interior angles of a triangle?',
    questionBn: 'ত্রিভুজের অন্তর্বৃত্ত কোণের সমষ্টি কত?',
    options: ['90°', '180°', '270°', '360°'],
    optionsBn: ['৯০°', '১৮০°', '২৭০°', '৩৬০°'],
    correctAnswer: 1,
    explanation: 'The sum of interior angles of any triangle is always 180°.',
    explanationBn: 'যেকোনো ত্রিভুজের অন্তর্বৃত্ত কোণের সমষ্টি সর্বদা ১৮০°।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-math-7',
    subjectId: 'math',
    topicId: 'trigonometry',
    question: 'What is the value of cos(60°)?',
    questionBn: 'cos(60°) এর মান কত?',
    options: ['0', '1/2', '√3/2', '1'],
    optionsBn: ['০', '১/২', '√৩/২', '১'],
    correctAnswer: 1,
    explanation: 'cos(60°) = 1/2. This is a standard trigonometric value.',
    explanationBn: 'cos(60°) = ১/২। এটি একটি আদর্শ ত্রিকোণমিতিক মান।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-math-8',
    subjectId: 'math',
    topicId: 'statistics',
    question: 'What is the median of 3, 7, 9, 12, 15?',
    questionBn: '৩, ৭, ৯, ১২, ১৫ এর মধ্যমা কত?',
    options: ['7', '9', '10', '12'],
    optionsBn: ['৭', '৯', '১০', '১২'],
    correctAnswer: 1,
    explanation: 'The middle value of the ordered set is 9.',
    explanationBn: 'সাজানো সংখ্যাগুলোর মধ্যের মান হল ৯।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-6',
    subjectId: 'physics',
    topicId: 'mechanics',
    question: 'What is the formula for kinetic energy?',
    questionBn: 'গতিশক্তির সূত্র কী?',
    options: ['mgh', '½mv²', 'mv', 'ma'],
    correctAnswer: 1,
    explanation: 'Kinetic energy = ½mv², where m is mass and v is velocity.',
    explanationBn: 'গতিশক্তি = ½mv², যেখানে m ভর এবং v বেগ।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-physics-7',
    subjectId: 'physics',
    topicId: 'electricity',
    question: 'What happens to current when resistance increases (voltage constant)?',
    questionBn: 'রোধ বাড়লে বিদ্যুৎ প্রবাহের কী হয় (ভোল্টেজ স্থির থাকলে)?',
    options: ['Increases', 'Decreases', 'Stays same', 'Becomes zero'],
    optionsBn: ['বাড়ে', 'কমে', 'একই থাকে', 'শূন্য হয়'],
    correctAnswer: 1,
    explanation: 'By Ohm\'s law V=IR, if V is constant and R increases, I decreases.',
    explanationBn: 'ওহমের সূত্র অনুযায়ী V=IR, V স্থির থাকলে R বাড়লে I কমে।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-physics-8',
    subjectId: 'physics',
    topicId: 'optics',
    question: 'Which phenomenon causes a pencil to appear bent in water?',
    questionBn: 'কোন ঘটনার কারণে পানিতে পেন্সিল বাঁকা দেখায়?',
    options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'],
    optionsBn: ['প্রতিফলন', 'প্রতিসরণ', 'বিবর্তন', 'বিচ্ছুরণ'],
    correctAnswer: 1,
    explanation: 'Refraction of light at the water-air interface makes the pencil appear bent.',
    explanationBn: 'পানি-বায়ু পৃষ্ঠে আলোর প্রতিসরণের কারণে পেন্সিল বাঁকা দেখায়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-chem-6',
    subjectId: 'chemistry',
    topicId: 'organic',
    question: 'What is the molecular formula of methane?',
    questionBn: 'মিথেনের আণবিক সূত্র কী?',
    options: ['CH₃', 'CH₄', 'C₂H₆', 'C₂H₄'],
    correctAnswer: 1,
    explanation: 'Methane has one carbon atom bonded to four hydrogen atoms: CH₄.',
    explanationBn: 'মিথেনে একটি কার্বন পরমাণু চারটি হাইড্রোজেন পরমাণুর সাথে বন্ধিত: CH₄।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-chem-7',
    subjectId: 'chemistry',
    topicId: 'inorganic',
    question: 'What is the pH of pure water?',
    questionBn: 'বিশুদ্ধ পানির pH কত?',
    options: ['0', '7', '10', '14'],
    optionsBn: ['০', '৭', '১০', '১৪'],
    correctAnswer: 1,
    explanation: 'Pure water has a neutral pH of 7.',
    explanationBn: 'বিশুদ্ধ পানির pH নিরপেক্ষ, মান ৭।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-9',
    subjectId: 'biology',
    topicId: 'cell',
    question: 'Which organelle contains chlorophyll in plant cells?',
    questionBn: 'উদ্ভিদ কোষে কোন অঙ্গাণুতে ক্লোরোফিল থাকে?',
    options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Vacuole'],
    optionsBn: ['মাইটোকন্ড্রিয়া', 'ক্লোরোপ্লাস্ট', 'নিউক্লিয়াস', 'গহ্বর'],
    correctAnswer: 1,
    explanation: 'Chloroplasts contain chlorophyll and are responsible for photosynthesis.',
    explanationBn: 'ক্লোরোপ্লাস্টে ক্লোরোফিল থাকে এবং এটি সালোকসংশ্লেষণের জন্য দায়ী।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bio-10',
    subjectId: 'biology',
    topicId: 'ecology',
    question: 'What percentage of energy is transferred between trophic levels?',
    questionBn: 'ট্রফিক স্তরের মধ্যে কত শতাংশ শক্তি স্থানান্তরিত হয়?',
    options: ['1%', '10%', '50%', '100%'],
    optionsBn: ['১%', '১০%', '৫০%', '১০০%'],
    correctAnswer: 1,
    explanation: 'Only about 10% of energy is transferred from one trophic level to the next.',
    explanationBn: 'এক ট্রফিক স্তর থেকে অন্য স্তরে প্রায় ১০% শক্তি স্থানান্তরিত হয়।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-bio-11',
    subjectId: 'biology',
    topicId: 'human',
    question: 'Which blood type is the universal donor?',
    questionBn: 'কোন রক্তের গ্রুপ সার্বজনীন দাতা?',
    options: ['A', 'B', 'AB', 'O'],
    correctAnswer: 3,
    explanation: 'Type O negative is the universal donor as it has no antigens.',
    explanationBn: 'O নেগেটিভ সার্বজনীন দাতা কারণ এতে কোনো অ্যান্টিজেন নেই।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-eng-6',
    subjectId: 'english',
    topicId: 'grammar',
    question: 'What is the past tense of "write"?',
    options: ['Writed', 'Wrote', 'Written', 'Writing'],
    correctAnswer: 1,
    explanation: '"Wrote" is the simple past tense of "write".',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-eng-7',
    subjectId: 'english',
    topicId: 'vocabulary',
    question: 'What does "diligent" mean?',
    options: ['Lazy', 'Hardworking', 'Careless', 'Slow'],
    correctAnswer: 1,
    explanation: 'Diligent means showing care and effort in work or duties.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-bng-1',
    subjectId: 'bangla',
    topicId: 'byakaran',
    question: '"সন্ধি" শব্দের অর্থ কী?',
    questionBn: '"সন্ধি" শব্দের অর্থ কী?',
    options: ['বিচ্ছেদ', 'মিলন', 'বিভাজন', 'পৃথক'],
    correctAnswer: 1,
    explanation: 'সন্ধি শব্দের অর্থ মিলন। দুটি ধ্বনির মিলনকে সন্ধি বলে।',
    explanationBn: 'সন্ধি শব্দের অর্থ মিলন। দুটি ধ্বনির মিলনকে সন্ধি বলে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-bng-2',
    subjectId: 'bangla',
    topicId: 'sahitya',
    question: '"গীতাঞ্জলি" কার রচনা?',
    questionBn: '"গীতাঞ্জলি" কার রচনা?',
    options: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জীবনানন্দ দাশ', 'মাইকেল মধুসূদন দত্ত'],
    correctAnswer: 1,
    explanation: '"গীতাঞ্জলি" রবীন্দ্রনাথ ঠাকুরের কবিতা সংকলন যার জন্য তিনি নোবেল পুরস্কার পান।',
    explanationBn: '"গীতাঞ্জলি" রবীন্দ্রনাথ ঠাকুরের কবিতা সংকলন যার জন্য তিনি নোবেল পুরস্কার পান।',
    difficulty: 'easy',
    points: 10,
  },
  // Additional HSC Questions
  {
    id: 'q-hsc-phy1-6',
    subjectId: 'physics-1',
    topicId: 'vectors',
    question: 'What is the dot product of two perpendicular vectors?',
    questionBn: 'দুটি লম্ব ভেক্টরের বিন্দু গুণফল কত?',
    options: ['0', '1', 'Maximum', 'Infinity'],
    optionsBn: ['০', '১', 'সর্বোচ্চ', 'অসীম'],
    correctAnswer: 0,
    explanation: 'A·B = |A||B|cosθ. For perpendicular vectors θ=90°, so cos90°=0.',
    explanationBn: 'A·B = |A||B|cosθ। লম্ব ভেক্টরের জন্য θ=90°, তাই cos90°=0।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-phy1-7',
    subjectId: 'physics-1',
    topicId: 'work-energy',
    question: 'What is the relationship between work and kinetic energy?',
    questionBn: 'কাজ ও গতিশক্তির মধ্যে সম্পর্ক কী?',
    options: ['Work = Change in PE', 'Work = Change in KE', 'Work = Mass × Velocity', 'Work = Force'],
    correctAnswer: 1,
    explanation: 'Work-Energy Theorem: Net work done = Change in kinetic energy.',
    explanationBn: 'কার্য-শক্তি উপপাদ্য: নিট কাজ = গতিশক্তির পরিবর্তন।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-phy2-6',
    subjectId: 'physics-2',
    topicId: 'electricity-hsc',
    question: 'What is the power dissipated in a resistor?',
    questionBn: 'রোধে বিলুপ্ত ক্ষমতা কত?',
    options: ['P = V/R', 'P = IR', 'P = I²R', 'P = R/V'],
    correctAnswer: 2,
    explanation: 'Power in a resistor P = I²R = V²/R = VI.',
    explanationBn: 'রোধে ক্ষমতা P = I²R = V²/R = VI।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-chem1-6',
    subjectId: 'chemistry-1',
    topicId: 'chemical-bonding',
    question: 'What is the hybridization of carbon in methane?',
    questionBn: 'মিথেনে কার্বনের হাইব্রিডাইজেশন কী?',
    options: ['sp', 'sp²', 'sp³', 'sp³d'],
    correctAnswer: 2,
    explanation: 'Carbon in methane has sp³ hybridization with tetrahedral geometry.',
    explanationBn: 'মিথেনে কার্বনের sp³ হাইব্রিডাইজেশন এবং চতুস্তলীয় গঠন।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-chem2-3',
    subjectId: 'chemistry-2',
    topicId: 'hydrocarbons',
    question: 'What is the general formula of alkenes?',
    questionBn: 'অ্যালকিনের সাধারণ সূত্র কী?',
    options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
    correctAnswer: 1,
    explanation: 'Alkenes have the general formula CₙH₂ₙ with one C=C double bond.',
    explanationBn: 'অ্যালকিনের সাধারণ সূত্র CₙH₂ₙ যেখানে একটি C=C দ্বি-বন্ধন থাকে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio1-3',
    subjectId: 'biology-1',
    topicId: 'cell-hsc',
    question: 'How many chromosomes are in a human somatic cell?',
    questionBn: 'মানুষের দেহকোষে কতটি ক্রোমোজোম থাকে?',
    options: ['23', '44', '46', '92'],
    optionsBn: ['২৩', '৪৪', '৪৬', '৯২'],
    correctAnswer: 2,
    explanation: 'Human somatic cells have 46 chromosomes (23 pairs).',
    explanationBn: 'মানুষের দেহকোষে ৪৬টি ক্রোমোজোম থাকে (২৩ জোড়া)।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-bio2-4',
    subjectId: 'biology-2',
    topicId: 'genetics-hsc',
    question: 'What is the ratio of Mendel\'s monohybrid cross in F2 generation?',
    questionBn: 'মেন্ডেলের মনোহাইব্রিড ক্রসে F2 প্রজন্মের অনুপাত কত?',
    options: ['1:1', '1:2:1', '3:1', '9:3:3:1'],
    optionsBn: ['১:১', '১:২:১', '৩:১', '৯:৩:৩:১'],
    correctAnswer: 2,
    explanation: 'Monohybrid cross gives a 3:1 phenotypic ratio in F2.',
    explanationBn: 'মনোহাইব্রিড ক্রসে F2 তে ৩:১ ফিনোটাইপিক অনুপাত পাওয়া যায়।',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: 'q-hsc-hm1-4',
    subjectId: 'higher-math-1',
    topicId: 'trigonometry-hsc',
    question: 'What is sin²θ + cos²θ equal to?',
    questionBn: 'sin²θ + cos²θ এর মান কত?',
    options: ['0', '1', '2', 'tan²θ'],
    optionsBn: ['০', '১', '২', 'tan²θ'],
    correctAnswer: 1,
    explanation: 'sin²θ + cos²θ = 1 is the fundamental Pythagorean identity.',
    explanationBn: 'sin²θ + cos²θ = 1 মৌলিক পিথাগোরিয়ান অভেদ।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-3',
    subjectId: 'higher-math-2',
    topicId: 'calculus',
    question: 'What is the derivative of x³?',
    questionBn: 'x³ এর অন্তরক কত?',
    options: ['3x', '3x²', 'x²', '2x³'],
    optionsBn: ['3x', '3x²', 'x²', '2x³'],
    correctAnswer: 1,
    explanation: 'd/dx(x³) = 3x² using the power rule.',
    explanationBn: 'd/dx(x³) = 3x² পাওয়ার রুল ব্যবহার করে।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-hm2-4',
    subjectId: 'higher-math-2',
    topicId: 'integration',
    question: 'What is ∫2x dx?',
    questionBn: '∫2x dx কত?',
    options: ['2x + C', 'x² + C', '2x² + C', 'x + C'],
    optionsBn: ['2x + C', 'x² + C', '2x² + C', 'x + C'],
    correctAnswer: 1,
    explanation: '∫2x dx = 2(x²/2) + C = x² + C',
    explanationBn: '∫2x dx = 2(x²/2) + C = x² + C',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-6',
    subjectId: 'ict',
    topicId: 'programming',
    question: 'What is the output of: printf("%d", 5+3);',
    questionBn: 'printf("%d", 5+3); এর আউটপুট কী?',
    options: ['5+3', '53', '8', 'Error'],
    optionsBn: ['5+3', '53', '8', 'Error'],
    correctAnswer: 2,
    explanation: '5+3 is evaluated first (=8), then printed as integer.',
    explanationBn: '5+3 প্রথমে হিসাব হয় (=8), তারপর integer হিসেবে প্রিন্ট হয়।',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: 'q-hsc-ict-7',
    subjectId: 'ict',
    topicId: 'web',
    question: 'What does CSS stand for?',
    questionBn: 'CSS এর পূর্ণরূপ কী?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 1,
    explanation: 'CSS stands for Cascading Style Sheets, used for styling web pages.',
    explanationBn: 'CSS এর পূর্ণরূপ Cascading Style Sheets, ওয়েব পেজ স্টাইলিংয়ে ব্যবহৃত।',
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
  { id: 'note_reader', name: 'Bookworm', description: 'Read 5 notes', icon: '📚' },
  { id: 'surprise_ace', name: 'Surprise Ace', description: 'Score 100% on a surprise test', icon: '🎊' },
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
  readNotes: [],
};
