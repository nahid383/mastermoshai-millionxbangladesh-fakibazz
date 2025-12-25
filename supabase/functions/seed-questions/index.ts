import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sample questions data
const sampleQuestions = [
  // SSC Math
  { subject_id: 'math', topic: 'algebra', question: 'What is the value of x if 2x + 5 = 15?', question_bangla: 'যদি 2x + 5 = 15 হয়, তাহলে x এর মান কত?', options: ['3', '5', '7', '10'], correct_answer: 1, explanation: 'To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5', explanation_bangla: '2x + 5 = 15 সমাধান করতে, উভয় পক্ষ থেকে 5 বিয়োগ করুন: 2x = 10। তারপর 2 দিয়ে ভাগ করুন: x = 5', difficulty: 'easy' },
  { subject_id: 'math', topic: 'geometry', question: 'What is the sum of angles in a triangle?', question_bangla: 'একটি ত্রিভুজের কোণগুলোর সমষ্টি কত?', options: ['90°', '180°', '270°', '360°'], correct_answer: 1, explanation: 'The sum of interior angles of a triangle is always 180 degrees.', explanation_bangla: 'একটি ত্রিভুজের অন্তঃকোণগুলোর সমষ্টি সর্বদা 180 ডিগ্রি।', difficulty: 'easy' },
  { subject_id: 'math', topic: 'trigonometry', question: 'What is sin(30°)?', question_bangla: 'sin(30°) এর মান কত?', options: ['0', '1/2', '√3/2', '1'], correct_answer: 1, explanation: 'sin(30°) = 1/2 is a standard trigonometric value.', explanation_bangla: 'sin(30°) = 1/2 একটি মানক ত্রিকোণমিতিক মান।', difficulty: 'medium' },
  { subject_id: 'math', topic: 'statistics', question: 'What is the mean of 2, 4, 6, 8, 10?', question_bangla: '2, 4, 6, 8, 10 এর গড় কত?', options: ['4', '5', '6', '7'], correct_answer: 2, explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6', explanation_bangla: 'গড় = (2+4+6+8+10)/5 = 30/5 = 6', difficulty: 'easy' },
  { subject_id: 'math', topic: 'algebra', question: 'Simplify: (a+b)²', question_bangla: 'সরলীকরণ করুন: (a+b)²', options: ['a² + b²', 'a² + 2ab + b²', 'a² - 2ab + b²', '2a² + 2b²'], correct_answer: 1, explanation: '(a+b)² = a² + 2ab + b² is a standard algebraic identity.', explanation_bangla: '(a+b)² = a² + 2ab + b² একটি মানক বীজগাণিতিক সূত্র।', difficulty: 'medium' },
  
  // SSC Physics
  { subject_id: 'physics', topic: 'mechanics', question: 'What is the SI unit of force?', question_bangla: 'বলের SI একক কী?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct_answer: 1, explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton.', explanation_bangla: 'বলের SI একক হল নিউটন (N), স্যার আইজ্যাক নিউটনের নামে নামকরণ করা হয়েছে।', difficulty: 'easy' },
  { subject_id: 'physics', topic: 'electricity', question: 'What is Ohm\'s Law?', question_bangla: 'ওহমের সূত্র কী?', options: ['V = IR', 'P = VI', 'E = mc²', 'F = ma'], correct_answer: 0, explanation: 'Ohm\'s Law states V = IR, where V is voltage, I is current, and R is resistance.', explanation_bangla: 'ওহমের সূত্র বলে V = IR, যেখানে V হল ভোল্টেজ, I হল কারেন্ট এবং R হল রেজিস্ট্যান্স।', difficulty: 'easy' },
  { subject_id: 'physics', topic: 'optics', question: 'What phenomenon causes a rainbow?', question_bangla: 'রংধনু তৈরির কারণ কোন ঘটনা?', options: ['Reflection', 'Refraction', 'Dispersion', 'Diffraction'], correct_answer: 2, explanation: 'Dispersion of light causes rainbows - white light splits into its component colors.', explanation_bangla: 'আলোর বিচ্ছুরণ রংধনু তৈরি করে - সাদা আলো তার উপাদান রঙে বিভক্ত হয়।', difficulty: 'medium' },
  { subject_id: 'physics', topic: 'mechanics', question: 'What is the acceleration due to gravity on Earth?', question_bangla: 'পৃথিবীতে মাধ্যাকর্ষণ ত্বরণ কত?', options: ['9.8 m/s', '9.8 m/s²', '10 km/s²', '8.9 m/s²'], correct_answer: 1, explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s².', explanation_bangla: 'পৃথিবীতে মাধ্যাকর্ষণ ত্বরণ প্রায় 9.8 m/s²।', difficulty: 'easy' },
  { subject_id: 'physics', topic: 'mechanics', question: 'What is kinetic energy?', question_bangla: 'গতিশক্তি কী?', options: ['Energy at rest', 'Energy due to motion', 'Energy due to position', 'Heat energy'], correct_answer: 1, explanation: 'Kinetic energy is the energy possessed by an object due to its motion. KE = ½mv²', explanation_bangla: 'গতিশক্তি হল গতির কারণে কোনো বস্তুর শক্তি। KE = ½mv²', difficulty: 'easy' },
  
  // SSC Chemistry
  { subject_id: 'chemistry', topic: 'periodic-table', question: 'How many elements are in the modern periodic table?', question_bangla: 'আধুনিক পর্যায় সারণিতে কতটি মৌল আছে?', options: ['92', '108', '118', '120'], correct_answer: 2, explanation: 'The modern periodic table contains 118 confirmed elements.', explanation_bangla: 'আধুনিক পর্যায় সারণিতে ১১৮টি নিশ্চিত মৌল আছে।', difficulty: 'easy' },
  { subject_id: 'chemistry', topic: 'acids-bases', question: 'What is the pH of pure water?', question_bangla: 'বিশুদ্ধ পানির pH কত?', options: ['0', '7', '14', '1'], correct_answer: 1, explanation: 'Pure water has a neutral pH of 7.', explanation_bangla: 'বিশুদ্ধ পানির pH নিরপেক্ষ, অর্থাৎ 7।', difficulty: 'easy' },
  { subject_id: 'chemistry', topic: 'organic', question: 'What is the molecular formula of methane?', question_bangla: 'মিথেনের আণবিক সংকেত কী?', options: ['CH₄', 'C₂H₆', 'C₃H₈', 'CO₂'], correct_answer: 0, explanation: 'Methane is CH₄, the simplest hydrocarbon with one carbon and four hydrogen atoms.', explanation_bangla: 'মিথেন হল CH₄, সবচেয়ে সরল হাইড্রোকার্বন যাতে একটি কার্বন ও চারটি হাইড্রোজেন পরমাণু আছে।', difficulty: 'easy' },
  { subject_id: 'chemistry', topic: 'periodic-table', question: 'What is the symbol for gold?', question_bangla: 'সোনার প্রতীক কী?', options: ['Ag', 'Au', 'Go', 'Gd'], correct_answer: 1, explanation: 'Au is the symbol for gold, from the Latin word "aurum".', explanation_bangla: 'Au হল সোনার প্রতীক, ল্যাটিন শব্দ "aurum" থেকে এসেছে।', difficulty: 'easy' },
  { subject_id: 'chemistry', topic: 'reactions', question: 'What type of reaction is combustion?', question_bangla: 'দহন কোন ধরনের বিক্রিয়া?', options: ['Decomposition', 'Combination', 'Oxidation', 'Reduction'], correct_answer: 2, explanation: 'Combustion is an oxidation reaction where a substance reacts with oxygen.', explanation_bangla: 'দহন একটি জারণ বিক্রিয়া যেখানে কোনো পদার্থ অক্সিজেনের সাথে বিক্রিয়া করে।', difficulty: 'medium' },
  
  // SSC Biology
  { subject_id: 'biology', topic: 'cell', question: 'What is the powerhouse of the cell?', question_bangla: 'কোষের পাওয়ার হাউস কোনটি?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], correct_answer: 2, explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP (energy).', explanation_bangla: 'মাইটোকন্ড্রিয়াকে কোষের পাওয়ার হাউস বলা হয় কারণ এটি ATP (শক্তি) উৎপাদন করে।', difficulty: 'easy' },
  { subject_id: 'biology', topic: 'genetics', question: 'What does DNA stand for?', question_bangla: 'DNA এর পূর্ণরূপ কী?', options: ['Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Deoxyribose Acid', 'None of these'], correct_answer: 0, explanation: 'DNA stands for Deoxyribonucleic Acid, which carries genetic information.', explanation_bangla: 'DNA এর পূর্ণরূপ হল Deoxyribonucleic Acid, যা জেনেটিক তথ্য বহন করে।', difficulty: 'easy' },
  { subject_id: 'biology', topic: 'human-body', question: 'How many bones are in the adult human body?', question_bangla: 'প্রাপ্তবয়স্ক মানবদেহে কতটি হাড় আছে?', options: ['180', '206', '250', '300'], correct_answer: 1, explanation: 'An adult human body has 206 bones.', explanation_bangla: 'একজন প্রাপ্তবয়স্ক মানুষের শরীরে ২০৬টি হাড় থাকে।', difficulty: 'easy' },
  { subject_id: 'biology', topic: 'photosynthesis', question: 'What gas do plants absorb during photosynthesis?', question_bangla: 'সালোকসংশ্লেষণের সময় উদ্ভিদ কোন গ্যাস শোষণ করে?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct_answer: 2, explanation: 'Plants absorb carbon dioxide (CO₂) during photosynthesis to make glucose.', explanation_bangla: 'সালোকসংশ্লেষণের সময় উদ্ভিদ কার্বন ডাই-অক্সাইড (CO₂) শোষণ করে গ্লুকোজ তৈরি করে।', difficulty: 'easy' },
  { subject_id: 'biology', topic: 'evolution', question: 'Who proposed the theory of evolution?', question_bangla: 'বিবর্তন তত্ত্ব কে প্রস্তাব করেছিলেন?', options: ['Newton', 'Darwin', 'Einstein', 'Mendel'], correct_answer: 1, explanation: 'Charles Darwin proposed the theory of evolution by natural selection.', explanation_bangla: 'চার্লস ডারউইন প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব প্রস্তাব করেছিলেন।', difficulty: 'easy' },
  
  // HSC Chemistry 2nd Paper
  { subject_id: 'chemistry-2', topic: 'organic-hsc', question: 'What is the general formula of alkanes?', question_bangla: 'অ্যালকেনের সাধারণ সংকেত কী?', options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'], correct_answer: 1, explanation: 'Alkanes have the general formula CnH2n+2, where n is the number of carbon atoms.', explanation_bangla: 'অ্যালকেনের সাধারণ সংকেত CnH2n+2, যেখানে n হল কার্বন পরমাণুর সংখ্যা।', difficulty: 'easy' },
  { subject_id: 'chemistry-2', topic: 'hydrocarbons', question: 'Which hydrocarbon is the simplest alkane?', question_bangla: 'কোন হাইড্রোকার্বন সবচেয়ে সরল অ্যালকেন?', options: ['Ethane', 'Methane', 'Propane', 'Butane'], correct_answer: 1, explanation: 'Methane (CH4) is the simplest alkane with only one carbon atom.', explanation_bangla: 'মিথেন (CH4) হল সবচেয়ে সরল অ্যালকেন যাতে মাত্র একটি কার্বন পরমাণু আছে।', difficulty: 'easy' },
  { subject_id: 'chemistry-2', topic: 'organic-hsc', question: 'What is the functional group of aldehydes?', question_bangla: 'অ্যালডিহাইডের কার্যকরী গ্রুপ কী?', options: ['-OH', '-CHO', '-COOH', '-CO-'], correct_answer: 1, explanation: 'Aldehydes contain the -CHO (formyl) functional group.', explanation_bangla: 'অ্যালডিহাইডে -CHO (ফর্মিল) কার্যকরী গ্রুপ থাকে।', difficulty: 'easy' },
  { subject_id: 'chemistry-2', topic: 'polymers', question: 'What is the monomer of polythene?', question_bangla: 'পলিথিনের মনোমার কী?', options: ['Ethane', 'Ethene', 'Ethyne', 'Methane'], correct_answer: 1, explanation: 'Polythene (polyethylene) is made from ethene (C2H4) monomers.', explanation_bangla: 'পলিথিন (পলিইথিলিন) ইথিন (C2H4) মনোমার থেকে তৈরি হয়।', difficulty: 'easy' },
  { subject_id: 'chemistry-2', topic: 'env-chemistry', question: 'Which gas causes acid rain?', question_bangla: 'কোন গ্যাস এসিড বৃষ্টির কারণ?', options: ['O2', 'N2', 'SO2', 'H2'], correct_answer: 2, explanation: 'Sulfur dioxide (SO2) combines with water to form sulfuric acid, causing acid rain.', explanation_bangla: 'সালফার ডাইঅক্সাইড (SO2) পানির সাথে মিশে সালফিউরিক এসিড তৈরি করে এসিড বৃষ্টি ঘটায়।', difficulty: 'easy' },
  
  // HSC Biology 1st Paper
  { subject_id: 'biology-1', topic: 'cell-hsc', question: 'Which type of cell division produces identical daughter cells?', question_bangla: 'কোন ধরনের কোষ বিভাজন অভিন্ন অপত্য কোষ তৈরি করে?', options: ['Meiosis', 'Mitosis', 'Amitosis', 'Binary fission'], correct_answer: 1, explanation: 'Mitosis produces two identical daughter cells with the same chromosome number.', explanation_bangla: 'মাইটোসিস একই ক্রোমোসোম সংখ্যা সহ দুটি অভিন্ন অপত্য কোষ তৈরি করে।', difficulty: 'easy' },
  { subject_id: 'biology-1', topic: 'cell-chemistry', question: 'Which biomolecule stores genetic information?', question_bangla: 'কোন জৈব অণু জেনেটিক তথ্য সংরক্ষণ করে?', options: ['Protein', 'Carbohydrate', 'Lipid', 'Nucleic acid'], correct_answer: 3, explanation: 'Nucleic acids (DNA and RNA) store and transmit genetic information.', explanation_bangla: 'নিউক্লিক এসিড (DNA এবং RNA) জেনেটিক তথ্য সংরক্ষণ ও প্রেরণ করে।', difficulty: 'easy' },
  { subject_id: 'biology-1', topic: 'plant-physiology', question: 'What is the site of photosynthesis in plants?', question_bangla: 'উদ্ভিদে সালোকসংশ্লেষণের স্থান কোথায়?', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], correct_answer: 1, explanation: 'Photosynthesis occurs in chloroplasts, which contain chlorophyll.', explanation_bangla: 'সালোকসংশ্লেষণ ক্লোরোপ্লাস্টে ঘটে, যেখানে ক্লোরোফিল থাকে।', difficulty: 'easy' },
  { subject_id: 'biology-1', topic: 'plant-taxonomy', question: 'What is the scientific name of rice?', question_bangla: 'ধানের বৈজ্ঞানিক নাম কী?', options: ['Triticum aestivum', 'Oryza sativa', 'Zea mays', 'Hordeum vulgare'], correct_answer: 1, explanation: 'Oryza sativa is the scientific name of rice.', explanation_bangla: 'Oryza sativa ধানের বৈজ্ঞানিক নাম।', difficulty: 'medium' },
  { subject_id: 'biology-1', topic: 'cell-hsc', question: 'How many chromosomes are in a human body cell?', question_bangla: 'মানবদেহের কোষে কতটি ক্রোমোসোম থাকে?', options: ['23', '46', '44', '48'], correct_answer: 1, explanation: 'Human body cells (somatic cells) contain 46 chromosomes (23 pairs).', explanation_bangla: 'মানবদেহের কোষে (দেহ কোষ) ৪৬টি ক্রোমোসোম (২৩ জোড়া) থাকে।', difficulty: 'easy' },
  
  // HSC Biology 2nd Paper
  { subject_id: 'biology-2', topic: 'animal-physiology', question: 'What is the main organ of the circulatory system?', question_bangla: 'রক্ত সংবহন তন্ত্রের প্রধান অঙ্গ কী?', options: ['Lungs', 'Heart', 'Liver', 'Kidney'], correct_answer: 1, explanation: 'The heart is the main organ that pumps blood through the circulatory system.', explanation_bangla: 'হৃৎপিণ্ড প্রধান অঙ্গ যা রক্ত সংবহন তন্ত্রের মাধ্যমে রক্ত পাম্প করে।', difficulty: 'easy' },
  { subject_id: 'biology-2', topic: 'genetics-hsc', question: 'Who proposed the theory of evolution by natural selection?', question_bangla: 'প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব কে প্রস্তাব করেন?', options: ['Lamarck', 'Darwin', 'Mendel', 'Wallace'], correct_answer: 1, explanation: 'Charles Darwin proposed the theory of evolution by natural selection.', explanation_bangla: 'চার্লস ডারউইন প্রাকৃতিক নির্বাচনের মাধ্যমে বিবর্তন তত্ত্ব প্রস্তাব করেন।', difficulty: 'easy' },
  { subject_id: 'biology-2', topic: 'animal-diversity', question: 'Which phylum do insects belong to?', question_bangla: 'পতঙ্গ কোন পর্বের অন্তর্ভুক্ত?', options: ['Mollusca', 'Arthropoda', 'Annelida', 'Chordata'], correct_answer: 1, explanation: 'Insects belong to phylum Arthropoda, characterized by jointed legs and exoskeleton.', explanation_bangla: 'পতঙ্গ আর্থ্রোপোডা পর্বের অন্তর্ভুক্ত, যার বৈশিষ্ট্য সন্ধিযুক্ত পা এবং বহিঃকঙ্কাল।', difficulty: 'easy' },
  { subject_id: 'biology-2', topic: 'human-physiology-hsc', question: 'Which hormone regulates blood sugar level?', question_bangla: 'কোন হরমোন রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে?', options: ['Thyroxine', 'Adrenaline', 'Insulin', 'Testosterone'], correct_answer: 2, explanation: 'Insulin, produced by the pancreas, regulates blood sugar levels.', explanation_bangla: 'অগ্ন্যাশয় থেকে উৎপন্ন ইনসুলিন রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে।', difficulty: 'easy' },
  { subject_id: 'biology-2', topic: 'genetics-hsc', question: 'What is the ratio of Mendel\'s monohybrid cross in F2 generation?', question_bangla: 'মেন্ডেলের একসংকর ক্রসে F2 প্রজন্মে অনুপাত কত?', options: ['1:1', '1:2:1', '3:1', '9:3:3:1'], correct_answer: 2, explanation: 'Mendel\'s monohybrid cross gives a 3:1 phenotypic ratio in F2 generation.', explanation_bangla: 'মেন্ডেলের একসংকর ক্রসে F2 প্রজন্মে ৩:১ ফিনোটাইপিক অনুপাত পাওয়া যায়।', difficulty: 'medium' },
  
  // HSC English
  { subject_id: 'english-hsc', topic: 'grammar-hsc', question: 'Which sentence is in passive voice?', question_bangla: 'কোন বাক্যটি কর্মবাচ্যে আছে?', options: ['She writes a letter.', 'A letter is written by her.', 'She is writing.', 'Write a letter.'], correct_answer: 1, explanation: 'In passive voice, the object becomes the subject. "A letter is written by her" is passive.', explanation_bangla: 'কর্মবাচ্যে, কর্ম কর্তা হয়ে যায়। "A letter is written by her" কর্মবাচ্য।', difficulty: 'easy' },
  { subject_id: 'english-hsc', topic: 'grammar-hsc', question: 'Choose the correct indirect speech: He said, "I am happy."', question_bangla: 'সঠিক পরোক্ষ উক্তি বেছে নিন: He said, "I am happy."', options: ['He said that I am happy.', 'He said that he was happy.', 'He said that he is happy.', 'He said he am happy.'], correct_answer: 1, explanation: 'In indirect speech, "I am" changes to "he was" and tense shifts back.', explanation_bangla: 'পরোক্ষ উক্তিতে, "I am" পরিবর্তন হয়ে "he was" হয় এবং কাল পিছিয়ে যায়।', difficulty: 'medium' },
  { subject_id: 'english-hsc', topic: 'essay-hsc', question: 'What is the first paragraph of an essay called?', question_bangla: 'প্রবন্ধের প্রথম অনুচ্ছেদকে কী বলে?', options: ['Conclusion', 'Body', 'Introduction', 'Summary'], correct_answer: 2, explanation: 'The first paragraph of an essay is the introduction, which presents the topic.', explanation_bangla: 'প্রবন্ধের প্রথম অনুচ্ছেদ হল ভূমিকা, যা বিষয়বস্তু উপস্থাপন করে।', difficulty: 'easy' },
  { subject_id: 'english-hsc', topic: 'vocabulary-hsc', question: 'What is the antonym of "ancient"?', question_bangla: '"Ancient" এর বিপরীত শব্দ কী?', options: ['Old', 'Modern', 'Historic', 'Antique'], correct_answer: 1, explanation: 'Modern is the antonym of ancient. Ancient means very old, modern means contemporary.', explanation_bangla: 'Modern হল ancient এর বিপরীত। Ancient মানে অতি পুরাতন, modern মানে সমসাময়িক।', difficulty: 'easy' },
  { subject_id: 'english-hsc', topic: 'grammar-hsc', question: 'Identify the correct sentence:', question_bangla: 'সঠিক বাক্য চিহ্নিত করুন:', options: ['He don\'t know.', 'He doesn\'t knows.', 'He doesn\'t know.', 'He not know.'], correct_answer: 2, explanation: '"He doesn\'t know" is correct. With third person singular, use doesn\'t + base verb.', explanation_bangla: '"He doesn\'t know" সঠিক। তৃতীয় পুরুষ একবচনে doesn\'t + মূল ক্রিয়া ব্যবহার হয়।', difficulty: 'easy' },
  
  // HSC Bangla
  { subject_id: 'bangla-hsc', topic: 'sahitya', question: 'Who wrote "Gitanjali"?', question_bangla: '"গীতাঞ্জলি" কে লিখেছেন?', options: ['Kazi Nazrul Islam', 'Rabindranath Tagore', 'Bankim Chandra', 'Sarat Chandra'], correct_answer: 1, explanation: 'Rabindranath Tagore wrote Gitanjali, for which he won the Nobel Prize.', explanation_bangla: 'রবীন্দ্রনাথ ঠাকুর গীতাঞ্জলি লিখেছেন, যার জন্য তিনি নোবেল পুরস্কার পেয়েছেন।', difficulty: 'easy' },
  { subject_id: 'bangla-hsc', topic: 'byakaran', question: 'What is the plural of "মানুষ" (manush)?', question_bangla: '"মানুষ" এর বহুবচন কী?', options: ['মানুষগুলো', 'মানুষরা', 'মানুষসব', 'মানুষগণ'], correct_answer: 1, explanation: '"মানুষরা" or "মানুষগণ" are the plural forms of "মানুষ".', explanation_bangla: '"মানুষরা" বা "মানুষগণ" হল "মানুষ" এর বহুবচন।', difficulty: 'easy' },
  { subject_id: 'bangla-hsc', topic: 'kobita', question: 'Who is known as the "Rebel Poet" of Bangladesh?', question_bangla: 'বাংলাদেশের "বিদ্রোহী কবি" কে?', options: ['Rabindranath Tagore', 'Kazi Nazrul Islam', 'Jibanananda Das', 'Shamsur Rahman'], correct_answer: 1, explanation: 'Kazi Nazrul Islam is known as the "Rebel Poet" for his revolutionary poems.', explanation_bangla: 'কাজী নজরুল ইসলাম তাঁর বিপ্লবী কবিতার জন্য "বিদ্রোহী কবি" নামে পরিচিত।', difficulty: 'easy' },
  { subject_id: 'bangla-hsc', topic: 'upanyas', question: 'Who wrote "পথের পাঁচালী" (Pather Panchali)?', question_bangla: '"পথের পাঁচালী" কে লিখেছেন?', options: ['Sarat Chandra', 'Bibhutibhushan Bandyopadhyay', 'Bankim Chandra', 'Manik Bandyopadhyay'], correct_answer: 1, explanation: 'Bibhutibhushan Bandyopadhyay wrote Pather Panchali, later made into a famous film.', explanation_bangla: 'বিভূতিভূষণ বন্দ্যোপাধ্যায় পথের পাঁচালী লিখেছেন, যা পরে বিখ্যাত চলচ্চিত্র হয়েছে।', difficulty: 'easy' },
  { subject_id: 'bangla-hsc', topic: 'natok', question: 'Who is the author of "রক্তাক্ত প্রান্তর" (Roktakto Prantor)?', question_bangla: '"রক্তাক্ত প্রান্তর" এর লেখক কে?', options: ['Nurul Momen', 'Munier Chowdhury', 'Selim Al Deen', 'Syed Shamsul Haque'], correct_answer: 1, explanation: 'Munier Chowdhury wrote "Roktakto Prantor", a famous historical play.', explanation_bangla: 'মুনীর চৌধুরী "রক্তাক্ত প্রান্তর" লিখেছেন, একটি বিখ্যাত ঐতিহাসিক নাটক।', difficulty: 'medium' },
  
  // HSC ICT
  { subject_id: 'ict', topic: 'programming', question: 'Which language is called the "mother of all languages"?', question_bangla: 'কোন ভাষাকে "সকল ভাষার জননী" বলা হয়?', options: ['Python', 'Java', 'C', 'BASIC'], correct_answer: 2, explanation: 'C is often called the mother of programming languages as many languages derived from it.', explanation_bangla: 'C কে প্রায়ই প্রোগ্রামিং ভাষার জননী বলা হয় কারণ অনেক ভাষা এ থেকে এসেছে।', difficulty: 'easy' },
  { subject_id: 'ict', topic: 'database', question: 'What does SQL stand for?', question_bangla: 'SQL এর পূর্ণরূপ কী?', options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Logic', 'System Query Language'], correct_answer: 1, explanation: 'SQL stands for Structured Query Language, used to manage databases.', explanation_bangla: 'SQL এর পূর্ণরূপ হল Structured Query Language, যা ডাটাবেস পরিচালনায় ব্যবহৃত হয়।', difficulty: 'easy' },
  { subject_id: 'ict', topic: 'networking', question: 'What does HTTP stand for?', question_bangla: 'HTTP এর পূর্ণরূপ কী?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyperlink Text Transfer Protocol', 'High Text Transfer Protocol'], correct_answer: 0, explanation: 'HTTP stands for HyperText Transfer Protocol, used for web communication.', explanation_bangla: 'HTTP এর পূর্ণরূপ হল HyperText Transfer Protocol, যা ওয়েব যোগাযোগে ব্যবহৃত হয়।', difficulty: 'easy' },
  { subject_id: 'ict', topic: 'hardware', question: 'What is the brain of a computer?', question_bangla: 'কম্পিউটারের মস্তিষ্ক কোনটি?', options: ['RAM', 'Hard Disk', 'CPU', 'Monitor'], correct_answer: 2, explanation: 'The CPU (Central Processing Unit) is called the brain of the computer.', explanation_bangla: 'CPU (সেন্ট্রাল প্রসেসিং ইউনিট) কে কম্পিউটারের মস্তিষ্ক বলা হয়।', difficulty: 'easy' },
  { subject_id: 'ict', topic: 'web', question: 'What does HTML stand for?', question_bangla: 'HTML এর পূর্ণরূপ কী?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlink Text Mark Language', 'Home Tool Markup Language'], correct_answer: 0, explanation: 'HTML stands for HyperText Markup Language, used to create web pages.', explanation_bangla: 'HTML এর পূর্ণরূপ হল HyperText Markup Language, যা ওয়েব পেজ তৈরিতে ব্যবহৃত হয়।', difficulty: 'easy' },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if questions already exist
    const { count } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Database already has ${count} questions. Skipping seed.` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert questions
    const { data, error } = await supabase
      .from("questions")
      .insert(sampleQuestions)
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${data.length} questions!` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Seed error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
