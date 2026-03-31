// Scoring function based on 1-5 scale
// Threshold for each group is 15 (5 questions x 3 average)
// Score > 15 leans toward first trait (E, N, F, P)
// Score ≤ 15 leans toward second trait (I, S, T, J)

export function calculatePersonality(answers, questions) {
  // Initialize scores for each group
  const groupScores = {
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
      const score = answer.value;
      groupScores[group] += score;
    }
  });
  
  console.log('📊 Raw group scores:', groupScores);
  
  // Determine traits based on threshold of 15
  const energy = groupScores.EI > 15 ? 'E' : 'I';
  const perception = groupScores.SN > 15 ? 'N' : 'S';
  const decision = groupScores.TF > 15 ? 'F' : 'T';
  const lifestyle = groupScores.JP > 15 ? 'P' : 'J';
  
  const type = energy + perception + decision + lifestyle;
  
  console.log('🎯 Result type:', type);
  
  // Calculate percentage strength (0-100)
  const calculateStrengthPercentage = (score) => {
    // Score range: 5 to 25, threshold at 15
    // Max deviation from threshold = 10
    const deviation = Math.abs(score - 15);
    const maxDeviation = 10;
    let percentage = Math.round((deviation / maxDeviation) * 100);
    // Ensure percentage is between 0 and 100
    percentage = Math.min(100, Math.max(0, percentage));
    return percentage;
  };
  
  // Calculate percentages for each pair
  // The dominant trait gets the strength percentage, the other gets 100 - strength
  const eiStrength = calculateStrengthPercentage(groupScores.EI);
  const snStrength = calculateStrengthPercentage(groupScores.SN);
  const tfStrength = calculateStrengthPercentage(groupScores.TF);
  const jpStrength = calculateStrengthPercentage(groupScores.JP);
  
  const percentages = {
    EI: {
      E: groupScores.EI > 15 ? eiStrength : 100 - eiStrength,
      I: groupScores.EI <= 15 ? eiStrength : 100 - eiStrength,
      dominant: energy,
      strength: eiStrength,
      rawScore: groupScores.EI
    },
    SN: {
      S: groupScores.SN <= 15 ? snStrength : 100 - snStrength,
      N: groupScores.SN > 15 ? snStrength : 100 - snStrength,
      dominant: perception,
      strength: snStrength,
      rawScore: groupScores.SN
    },
    TF: {
      T: groupScores.TF <= 15 ? tfStrength : 100 - tfStrength,
      F: groupScores.TF > 15 ? tfStrength : 100 - tfStrength,
      dominant: decision,
      strength: tfStrength,
      rawScore: groupScores.TF
    },
    JP: {
      J: groupScores.JP <= 15 ? jpStrength : 100 - jpStrength,
      P: groupScores.JP > 15 ? jpStrength : 100 - jpStrength,
      dominant: lifestyle,
      strength: jpStrength,
      rawScore: groupScores.JP
    }
  };
  
  console.log('📈 Percentages:', {
    EI: `E: ${percentages.EI.E}%, I: ${percentages.EI.I}%`,
    SN: `S: ${percentages.SN.S}%, N: ${percentages.SN.N}%`,
    TF: `T: ${percentages.TF.T}%, F: ${percentages.TF.F}%`,
    JP: `J: ${percentages.JP.J}%, P: ${percentages.JP.P}%`
  });
  
  return { 
    type, 
    rawScores: groupScores,
    percentages
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
      core: 'The Commander - Bold, imaginative, strong-willed leader',
      strengths: ['Leadership', 'Strategic', 'Decisive']
    },
    ENTP: {
      core: 'The Debater - Creative, quick-witted, enjoys intellectual challenges',
      strengths: ['Creative', 'Flexible', 'Negotiation']
    },
    INFJ: {
      core: 'The Advocate - Insightful, humanistic, visionary',
      strengths: ['Understanding', 'Vision', 'Patient']
    },
    INFP: {
      core: 'The Mediator - Idealistic, creative, driven by strong values',
      strengths: ['Creative', 'Authentic', 'Empathetic']
    },
    ENFJ: {
      core: 'The Protagonist - Charismatic, inspiring, natural leader',
      strengths: ['Communication', 'Leadership', 'Understanding']
    },
    ENFP: {
      core: 'The Campaigner - Enthusiastic, creative, people-oriented',
      strengths: ['Creative', 'Enthusiastic', 'Flexible']
    },
    ISTJ: {
      core: 'The Logistician - Practical, fact-minded, dependable',
      strengths: ['Responsible', 'Detail-oriented', 'Reliable']
    },
    ISFJ: {
      core: 'The Defender - Dedicated, warm-hearted, protective',
      strengths: ['Thoughtful', 'Dedicated', 'Patient']
    },
    ESTJ: {
      core: 'The Executive - Efficient, organized, practical leader',
      strengths: ['Organized', 'Decisive', 'Efficient']
    },
    ESFJ: {
      core: 'The Consul - Caring, social, community-oriented',
      strengths: ['Caring', 'Social', 'Responsible']
    },
    ISTP: {
      core: 'The Virtuoso - Bold, practical, hands-on problem solver',
      strengths: ['Skilled', 'Practical', 'Problem solver']
    },
    ISFP: {
      core: 'The Adventurer - Flexible, charming, artistic',
      strengths: ['Creative', 'Sensitive', 'Authentic']
    },
    ESTP: {
      core: 'The Entrepreneur - Energetic, perceptive, risk-taker',
      strengths: ['Energetic', 'Practical', 'Decisive']
    },
    ESFP: {
      core: 'The Entertainer - Spontaneous, energetic, enthusiastic',
      strengths: ['Energetic', 'Enthusiastic', 'Flexible']
    }
  };
  
  return {
    ...careerInfo,
    coreDescription: analysis[type]?.core || 'Your unique personality type',
    strengths: analysis[type]?.strengths || ['Creative', 'Flexible', 'Persistent']
  };
}
