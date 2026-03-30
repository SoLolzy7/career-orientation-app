// Simple scoring: count how many times each letter appears
// The personality type is built from the most frequent letters
export function calculatePersonality(answers, questions) {
  // Count occurrences of each trait letter
  const counts = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  answers.forEach(answer => {
    const letter = answer.value
    counts[letter] = (counts[letter] || 0) + 1
  })

  // Determine the dominant letter for each pair
  const type =
    (counts.I > counts.E ? 'I' : 'E') +
    (counts.S > counts.N ? 'S' : 'N') +
    (counts.T > counts.F ? 'T' : 'F') +
    (counts.J > counts.P ? 'J' : 'P')

  return { type, counts }
}