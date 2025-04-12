/**
 * Utility functions for spelling and similarity checking
 */
const SpellingUtils = {
  /**
   * Calculate string similarity between two strings
   * @param {string} str1 - First string to compare
   * @param {string} str2 - Second string to compare
   * @returns {number} - Similarity score between 0 and 1
   */
  calculateSimilarity: (str1, str2) => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;
    
    // Character-by-character comparison
    let matches = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    // Direct matches
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) matches++;
    }
    
    // Transposed characters
    for (let i = 0; i < minLength - 1; i++) {
      if (str1[i] === str2[i+1] && str1[i+1] === str2[i]) {
        matches += 0.5;
      }
    }
    
    return matches / maxLength;
  },
  
  /**
   * Detect possible spelling errors by finding closest match
   * @param {string} word - Word to check
   * @param {Array|Set} knownWords - List of known good words
   * @param {number} threshold - Similarity threshold (0-1)
   * @returns {Object|null} - Match details or null if no match found
   */
  detectSpellingErrors: (word, knownWords, threshold = 0.75) => {
    if (word.length <= 2 || /^\d+$/.test(word)) return null;
    
    let bestMatch = null;
    let highestScore = 0;
    
    for (const knownWord of knownWords) {
      if (Math.abs(word.length - knownWord.length) > 3) continue;
      
      const score = SpellingUtils.calculateSimilarity(word, knownWord);
      if (score > threshold && score < 1 && score > highestScore) {
        highestScore = score;
        bestMatch = knownWord;
      }
    }
    
    return bestMatch ? { word: bestMatch, score: highestScore } : null;
  },
  
  // Add other spelling utility functions as needed
};

module.exports = { SpellingUtils };