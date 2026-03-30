// Scoring function based on 1-5 scale
// Threshold for each group is 15 (5 questions x 3 average)
// Score > 15 leans toward first trait (E, N, F, P)
// Score ≤ 15 leans toward second trait (I, S, T, J)

export function calculatePersonality(answers, questions) {
  // Initialize scores for each group
  const groupScores = {
    EI: 0,  // Extroversion vs Introversion
    SN: 0,  // Intuition vs Sensing
    TF: 0,  // Feeling vs Thinking
    JP: 0   // Perceiving vs Judging
  };
  
  // Count questions per group
  const groupCounts = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };
  
  // Calculate total scores for each group
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const group = question.group;
      const score = answer.value; // Value from 1-5
      
      groupScores[group] += score;
      groupCounts[group]++;
    }
  });
  
  // Determine traits based on threshold of 15
  // Score > 15: leans toward E, N, F, P
  // Score ≤ 15: leans toward I, S, T, J
  const energy = groupScores.EI > 15 ? 'E' : 'I';
  const perception = groupScores.SN > 15 ? 'N' : 'S';
  const decision = groupScores.TF > 15 ? 'F' : 'T';
  const lifestyle = groupScores.JP > 15 ? 'P' : 'J';
  
  const type = energy + perception + decision + lifestyle;
  
  // Calculate percentage for each pair (based on deviation from threshold)
  const calculatePercentage = (score, maxScore = 25) => {
    // Max score per group: 5 questions x 5 points = 25
    // Min score: 5 questions x 1 point = 5
    // Threshold: 15
    // Calculate strength percentage of dominant trait
    const deviation = Math.abs(score - 15);
    const maxDeviation = 10; // 25 - 15 = 10
    const percentage = Math.round((deviation / maxDeviation) * 100);
    return Math.min(percentage, 100);
  };
  
  const percentages = {
    EI: {
      E: groupScores.EI,
      I: groupScores.EI,
      dominant: energy,
      percentage: calculatePercentage(groupScores.EI),
      score: groupScores.EI
    },
    SN: {
      S: groupScores.SN,
      N: groupScores.SN,
      dominant: perception,
      percentage: calculatePercentage(groupScores.SN),
      score: groupScores.SN
    },
    TF: {
      T: groupScores.TF,
      F: groupScores.TF,
      dominant: decision,
      percentage: calculatePercentage(groupScores.TF),
      score: groupScores.TF
    },
    JP: {
      J: groupScores.JP,
      P: groupScores.JP,
      dominant: lifestyle,
      percentage: calculatePercentage(groupScores.JP),
      score: groupScores.JP
    }
  };
  
  return { 
    type, 
    scores: groupScores, 
    percentages,
    rawScores: groupScores,
    groupCounts
  };
}

// Get detailed description for each trait
export function getTraitDescription(trait) {
  const descriptions = {
    'E': { 
      name: 'Extroversion', 
      description: 'Energized by being around others, enjoys social interaction and group activities',
      characteristics: ['Energetic', 'Outgoing', 'Team-oriented']
    },
    'I': { 
      name: 'Introversion', 
      description: 'Energy comes from time alone, enjoys deep thinking and independent work',
      characteristics: ['Thoughtful', 'Focused', 'Independent']
    },
    'S': { 
      name: 'Sensing', 
      description: 'Pays attention to details, practical, relies on experience and concrete data',
      characteristics: ['Practical', 'Detail-oriented', 'Realistic']
    },
    'N': { 
      name: 'Intuition', 
      description: 'Sees the big picture, future-oriented, enjoys exploring new ideas',
      characteristics: ['Creative', 'Visionary', 'Innovative']
    },
    'T': { 
      name: 'Thinking', 
      description: 'Decisions based on logic, analysis, and objective facts',
      characteristics: ['Logical', 'Analytical', 'Fair']
    },
    'F': { 
      name: 'Feeling', 
      description: 'Decisions based on personal values, emotions, and harmony',
      characteristics: ['Empathetic', 'Compassionate', 'Harmonious']
    },
    'J': { 
      name: 'Judging', 
      description: 'Prefers structure, clear plans, and early decisions',
      characteristics: ['Organized', 'Punctual', 'Planner']
    },
    'P': { 
      name: 'Perceiving', 
      description: 'Enjoys flexibility, adapts to change, keeps options open',
      characteristics: ['Flexible', 'Spontaneous', 'Adaptable']
    }
  };
  return descriptions[trait];
}

// Function to determine detailed personality type based on decision tree
export function getPersonalityDetails(type, careersData) {
  const careerInfo = careersData[type] || {
    description: 'Your unique personality type',
    careers: []
  };
  
  // Personality analysis based on decision tree from the document
  const analysis = {
    INTJ: {
      core: 'The Strategist - Strategic thinking, independent, problem solver',
      strengths: ['Strategic thinking', 'Independent', 'Decisive']
    },
    INTP: {
      core: 'The Thinker - Logical analysis, curious, enjoys exploration',
      strengths: ['Logical', 'Analytical', 'Creative']
    },
    ENTJ: {
      core: 'The Leader - Decisive, strategic, organized',
      strengths: ['Leadership', 'Strategic', 'Decisive']
    },
    ENTP: {
      core: 'The Innovator - Creative, enjoys debate, innovative',
      strengths: ['Creative', 'Flexible', 'Negotiation']
    },
    INFJ: {
      core: 'The Advocate - Insightful, humanistic, visionary',
      strengths: ['Understanding', 'Vision', 'Patient']
    },
    INFP: {
      core: 'The Idealist - Creative, authentic, empathetic',
      strengths: ['Creative', 'Authentic', 'Empathetic']
    },
    ENFJ: {
      core: 'The Mentor - Enthusiastic, connecting, inspiring',
      strengths: ['Communication', 'Leadership', 'Understanding']
    },
    ENFP: {
      core: 'The Explorer - Creative, energetic, loves connections',
      strengths: ['Creative', 'Enthusiastic', 'Flexible']
    },
    ISTJ: {
      core: 'The Realist - Responsible, detail-oriented, systematic',
      strengths: ['Responsible', 'Detail-oriented', 'Reliable']
    },
    ISFJ: {
      core: 'The Protector - Dedicated, thoughtful, caring',
      strengths: ['Thoughtful', 'Dedicated', 'Patient']
    },
    ESTJ: {
      core: 'The Supervisor - Practical, efficient, organized',
      strengths: ['Organized', 'Decisive', 'Efficient']
    },
    ESFJ: {
      core: 'The Caregiver - Warm, caring, community builder',
      strengths: ['Caring', 'Social', 'Responsible']
    },
    ISTP: {
      core: 'The Craftsman - Skilled, practical, problem solver',
      strengths: ['Skilled', 'Practical', 'Problem solver']
    },
    ISFP: {
      core: 'The Artist - Sensitive, creative, appreciates beauty',
      strengths: ['Creative', 'Sensitive', 'Authentic']
    },
    ESTP: {
      core: 'The Doer - Action-oriented, pragmatic, risk-taker',
      strengths: ['Energetic', 'Practical', 'Decisive']
    },
    ESFP: {
      core: 'The Performer - Lively, optimistic, enjoys being center of attention',
      strengths: ['Energetic', 'Enthusiastic', 'Flexible']
    }
  };
  
  return {
    ...careerInfo,
    coreDescription: analysis[type]?.core || 'Your unique personality type',
    strengths: analysis[type]?.strengths || ['Creative', 'Flexible', 'Persistent']
  };
}
