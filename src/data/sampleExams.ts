import { Exam } from '../types/exam';

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'matric-math-2016',
    title: 'Grade 12 Entrance Exam - Mathematics',
    titleAm: 'የ12ኛ ክፍል ማትሪክ - የሂሳብ ፈተና (Entrance Exam)',
    category: 'matric',
    categoryLabelEn: 'Grade 12 Matric',
    categoryLabelAm: '12ኛ ክፍል ማትሪክ',
    description: 'Ethiopian University Entrance Examination (EUEE) standard sample questions with step-by-step solutions.',
    descriptionAm: 'የኢትዮጵያ ዩኒቨርሲቲ መግቢያ ፈተና (ማትሪክ) የሂሳብ ፈተና ጥያቄዎች ከሙሉ ማብራሪያ ጋር።',
    subject: 'Mathematics',
    year: '2016 E.C (2024)',
    totalTimeMinutes: 15,
    passPercentage: 50,
    source: 'built-in',
    questions: [
      {
        id: 'm1',
        questionText: 'If f(x) = 2x³ - 5x² + 4x - 1, what is the derivative f\'(2)?',
        options: [
          { id: 'A', text: '8' },
          { id: 'B', text: '12' },
          { id: 'C', text: '16' },
          { id: 'D', text: '4' }
        ],
        correctAnswer: 'A',
        explanation: 'f\'(x) = 6x² - 10x + 4. Substitute x = 2: f\'(2) = 6(2)² - 10(2) + 4 = 6(4) - 20 + 4 = 24 - 20 + 4 = 8. (ማብራሪያ፡ የ f(x) ዴሪቬቲቭ 6x² - 10x + 4 ሲሆን x=2 ሲተካ 8 ይሰጣል)',
        difficulty: 'Medium',
        topic: 'Calculus'
      },
      {
        id: 'm2',
        questionText: 'What is the sum of the first 20 terms of the arithmetic progression 3, 7, 11, 15, ...?',
        options: [
          { id: 'A', text: '780' },
          { id: 'B', text: '820' },
          { id: 'C', text: '860' },
          { id: 'D', text: '740' }
        ],
        correctAnswer: 'B',
        explanation: 'Here a = 3, d = 4, n = 20. S_n = (n/2)[2a + (n - 1)d] = (20/2)[2(3) + 19(4)] = 10[6 + 76] = 10[82] = 820.',
        difficulty: 'Easy',
        topic: 'Sequences & Series'
      },
      {
        id: 'm3',
        questionText: 'What is the limit: lim (x -> 3) (x² - 9) / (x - 3)?',
        options: [
          { id: 'A', text: '0' },
          { id: 'B', text: '3' },
          { id: 'C', text: '6' },
          { id: 'D', text: 'Undefined' }
        ],
        correctAnswer: 'C',
        explanation: '(x² - 9)/(x - 3) = (x - 3)(x + 3)/(x - 3) = x + 3. When x -> 3, 3 + 3 = 6. (ፋክተራይዝ ሲደረግ x + 3 ሆኖ 3 ስንተካ 6 ይሰጣል)',
        difficulty: 'Easy',
        topic: 'Limits'
      },
      {
        id: 'm4',
        questionText: 'Which one of the following matrices is invertible (has a non-zero determinant)?',
        options: [
          { id: 'A', text: '[ [2, 4], [1, 2] ]' },
          { id: 'B', text: '[ [3, 1], [6, 2] ]' },
          { id: 'C', text: '[ [4, 2], [1, 3] ]' },
          { id: 'D', text: '[ [0, 0], [5, 7] ]' }
        ],
        correctAnswer: 'C',
        explanation: 'Determinant of C: (4*3) - (2*1) = 12 - 2 = 10 ≠ 0. Since det ≠ 0, it is invertible. (ዲተርሚናንቱ ዜሮ ስላልሆነ ኢንቨርሲብል ነው)',
        difficulty: 'Medium',
        topic: 'Matrices'
      },
      {
        id: 'm5',
        questionText: 'What is the probability of rolling a prime number on a fair six-sided die?',
        options: [
          { id: 'A', text: '1/3' },
          { id: 'B', text: '1/2' },
          { id: 'C', text: '2/3' },
          { id: 'D', text: '5/6' }
        ],
        correctAnswer: 'B',
        explanation: 'The prime numbers on a die are {2, 3, 5} -> 3 outcomes. Total outcomes = 6. Probability = 3/6 = 1/2.',
        difficulty: 'Easy',
        topic: 'Probability'
      }
    ]
  },
  {
    id: 'exit-exam-aptitude',
    title: 'University Exit Exam - Critical Reasoning & NGAT',
    titleAm: 'የዩኒቨርሲቲ መውጫ ፈተና - አፕቲትዩድ እና አመክንዮ (Exit Exam / NGAT)',
    category: 'exit',
    categoryLabelEn: 'Exit Exam / NGAT',
    categoryLabelAm: 'መውጫ ፈተና (Exit Exam)',
    description: 'Higher Education relevance & exit test questions measuring analytical problem-solving skills.',
    descriptionAm: 'ለተመራቂ ተማሪዎች የሚሰጥ የመውጫ እና የድህረ-ምረቃ ፈተና (NGAT) አመክንዮ ጥያቄዎች።',
    subject: 'General Aptitude',
    year: '2024 Model',
    totalTimeMinutes: 12,
    passPercentage: 60,
    source: 'built-in',
    questions: [
      {
        id: 'e1',
        questionText: 'Complete the number pattern: 7, 14, 28, 56, __?',
        options: [
          { id: 'A', text: '84' },
          { id: 'B', text: '112' },
          { id: 'C', text: '98' },
          { id: 'D', text: '124' }
        ],
        correctAnswer: 'B',
        explanation: 'Each number is multiplied by 2 (Doubled): 7*2=14, 14*2=28, 28*2=56, 56*2=112.',
        difficulty: 'Easy',
        topic: 'Number Sequences'
      },
      {
        id: 'e2',
        questionText: 'Statement: "All engineers are problem solvers. Some problem solvers are leaders." Which conclusion definitely follows?',
        options: [
          { id: 'A', text: 'All leaders are engineers' },
          { id: 'B', text: 'Some leaders are engineers' },
          { id: 'C', text: 'All engineers are leaders' },
          { id: 'D', text: 'None of the above definitely follows' }
        ],
        correctAnswer: 'D',
        explanation: 'We cannot deduce any definite intersection between leaders and engineers solely from the given premises. (ከተሰጠው መነሻ ላይ ኢንጅነሮች እና መሪዎች በእርግጠኝነት እንደሚገናኙ ማረጋገጥ አይቻልም)',
        difficulty: 'Hard',
        topic: 'Syllogism & Logic'
      },
      {
        id: 'e3',
        questionText: 'A car travels 180 km in 2 hours and 30 minutes. What is its average speed in km/h?',
        options: [
          { id: 'A', text: '72 km/h' },
          { id: 'B', text: '68 km/h' },
          { id: 'C', text: '75 km/h' },
          { id: 'D', text: '80 km/h' }
        ],
        correctAnswer: 'A',
        explanation: 'Speed = Distance / Time. 2 hours 30 mins = 2.5 hours. Speed = 180 / 2.5 = 72 km/h.',
        difficulty: 'Medium',
        topic: 'Quantitative Reasoning'
      },
      {
        id: 'e4',
        questionText: 'Which research method is best suited for establishing cause-and-effect relationships?',
        options: [
          { id: 'A', text: 'Survey questionnaire' },
          { id: 'B', text: 'Observational case study' },
          { id: 'C', text: 'Experimental research with control group' },
          { id: 'D', text: 'Descriptive cross-sectional study' }
        ],
        correctAnswer: 'C',
        explanation: 'True experimental designs with controlled independent variables are the gold standard for testing causal hypotheses.',
        difficulty: 'Medium',
        topic: 'Research Methodology'
      }
    ]
  },
  {
    id: 'driving-license-ethiopia',
    title: 'Driving License Theory Test - Traffic Rules',
    titleAm: 'የመንጃ ፍቃድ የቲዎሪ ፈተና - የትራፊክ ደንቦች እና ምልክቶች',
    category: 'driving',
    categoryLabelEn: 'Driving License',
    categoryLabelAm: 'መንጃ ፍቃድ',
    description: 'Official Ethiopian road traffic code, safety priorities, road signs, and safe driving rules.',
    descriptionAm: 'የኢትዮጵያ የትራፊክ ደንቦች፣ የመንገድ ምልክቶች እና የአደጋ መከላከያ የፈተና ጥያቄዎች።',
    subject: 'Traffic Law',
    year: '2024/2016',
    totalTimeMinutes: 10,
    passPercentage: 70,
    source: 'built-in',
    questions: [
      {
        id: 'd1',
        questionText: 'በክብ አደባባይ (Roundabout) ውስጥ ለመግባት የሚዘጋጅ አሽከርካሪ ለማን ቅድሚያ መስጠት አለበት?',
        options: [
          { id: 'A', text: 'ለሚከተለው ተሽከርካሪ' },
          { id: 'B', text: 'በአደባባዩ ውስጥ እየተሽከረከረ ላለ ተሽከርካሪ (ግራ እጁ ላለ)' },
          { id: 'C', text: 'ከትልቁ የጭነት መኪና በስተቀር ለማንም ቅድሚያ አይሰጥም' },
          { id: 'D', text: 'ፈጣን ፍጥነት ላለው መኪና' }
        ],
        correctAnswer: 'B',
        explanation: 'በአደባባይ ደንብ መሰረት አስቀድሞ በክብ አደባባይ ውስጥ ያለ እና ከግራ በኩል የሚመጣ ተሽከርካሪ ቅድሚያ አለው።',
        difficulty: 'Easy',
        topic: 'ቅድሚያ መስጠት'
      },
      {
        id: 'd2',
        questionText: 'የቢጫ (Yellow/Amber) የትራፊክ መብራት ሲበራ ትክክለኛው እርምጃ ምንድነው?',
        options: [
          { id: 'A', text: 'መብራቱ ከመቀየሩ በፊት ፍጥነትን ጨምሮ ማለፍ' },
          { id: 'B', text: 'የማቆሚያ መስመሩን ካለፉ በጥንቃቄ ማለፍ፣ ካላለፉ ግን በሰላም ለማቆም መዘጋጀት' },
          { id: 'C', text: 'ወዲያውኑ ድንገተኛ ፍሬን መያዝ' },
          { id: 'D', text: 'የጥላ ምልክት መስጠት' }
        ],
        correctAnswer: 'B',
        explanation: 'ቢጫ መብራት ለማቆም ዝግጅት ማሳሰቢያ ነው። መስመሩን አስቀድመው ካላለፉ በሰላም ማቆም ግዴታ ነው፤ መሀል ከደረሱ ግን ማለፍ ይችላሉ።',
        difficulty: 'Medium',
        topic: 'የትራፊክ መብራቶች'
      },
      {
        id: 'd3',
        questionText: 'የሶስት ማዕዘን ቅርጽ ያለው እና ጫፉ ወደ ላይ የቀና የመንገድ ምልክት ምንን ያሳያል?',
        options: [
          { id: 'A', text: 'የማስጠንቀቂያ ምልክት (Warning Sign)' },
          { id: 'B', text: 'የክልከላ ምልክት (Prohibitory Sign)' },
          { id: 'C', text: 'የመረጃ ምልክት (Information Sign)' },
          { id: 'D', text: 'የአስገዳጅነት ምልክት (Mandatory Sign)' }
        ],
        correctAnswer: 'A',
        explanation: 'ጫፉ ወደ ላይ የሆነ ሶስት ማዕዘን ምልክት ከፊት አደጋ ወይም ለውጥ መኖሩን የሚያስጠነቅቅ የማስጠንቀቂያ (Warning) ምልክት ነው።',
        difficulty: 'Easy',
        topic: 'የመንገድ ምልክቶች'
      },
      {
        id: 'd4',
        questionText: 'በዝናብ ወቅት የመንገድ ተሽከርካሪ ማቆሚያ ርቀት (Stopping Distance) ምን ይሆናል?',
        options: [
          { id: 'A', text: 'ይቀንሳል' },
          { id: 'B', text: 'ተመሳሳይ ሆኖ ይቀራል' },
          { id: 'C', text: 'መንገዱ ስለሚንሸራተት ርቀቱ በእጥፍ ይጨምራል' },
          { id: 'D', text: 'በጎማው አየር መጠን ብቻ ይወሰናል' }
        ],
        correctAnswer: 'C',
        explanation: 'በእርጥብ መንገድ ላይ የጎማና አስፋልት ሰበቃ (friction) ስለሚቀንስ ፍሬን ሲያዙ መኪናው የሚቆምበት ርቀት በእጅጉ ይረዝማል።',
        difficulty: 'Medium',
        topic: 'የአደጋ መከላከያ'
      }
    ]
  }
];
