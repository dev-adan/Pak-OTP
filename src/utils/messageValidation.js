// Helper function to detect gibberish or random text
const isGibberish = (text) => {
  // Split into words and remove empty strings
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) return true;

  // Common words in English and Roman Urdu
  const commonWords = new Set([
    // English
    'hello', 'hi', 'hey', 'the', 'and', 'or', 'but', 'for', 'with', 'to', 'from', 'in', 'on', 'at',
    // Roman Urdu common words
    'kya', 'hai', 'hain', 'ap', 'app', 'aap', 'yar', 'mein', 'mene', 'maine', 'hum', 'tum', 
    'phr', 'phir', 'ke', 'ki', 'ko', 'ka', 'theak', 'theek', 'acha', 'achha', 'nahi', 'nai',
    'kese', 'kaisay', 'kaise', 'ho', 'hn', 'han', 'haan', 'aur', 'main', 'mera', 'apka', 'apke',
    'dekh', 'dekhna', 'lena', 'lenge', 'jana', 'jayen', 'ajayen', 'ajao'
  ]);

  // Count meaningful words
  const meaningfulWords = words.filter(word => {
    const lowerWord = word.toLowerCase();
    
    // Allow common words from any supported language
    if (commonWords.has(lowerWord)) return true;
    
    // Too short or too long
    if (word.length < 2 || word.length > 15) return false;
    
    // Check for keyboard patterns (like 'asdf', 'qwer')
    const keyboardPatterns = /asdf|qwer|zxcv|hjkl|jkl|asd|wasd/i;
    if (keyboardPatterns.test(word)) return false;
    
    // Check for random patterns - more lenient for non-English
    if (/(.)\1{3,}/.test(word)) return false; // Repeated chars (allow up to 3)
    if (/[^a-z0-9\s'-]{2,}/i.test(word)) return false; // Special chars
    if (/[0-9]{3,}/.test(word)) return false; // Numbers
    
    // Check for alternating patterns (like 'adadad', 'asasas')
    if (/^(.{1,2})\1{3,}/i.test(word)) return false;
    
    return true;
  });

  // Calculate meaningful word ratio
  const meaningfulRatio = meaningfulWords.length / words.length;
  
  // Check for repeating words - more lenient
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const uniqueRatio = uniqueWords.size / words.length;
  
  // More lenient thresholds for multi-language support
  return meaningfulRatio < 0.6 || uniqueRatio < 0.4 || /asdf|qwer|zxcv|jkl/i.test(text);
};

/**
 * Message validation configuration
 */
const CONFIG = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 2000,
  MIN_WORDS: 2,
  MAX_REPEATED_CHARS: 4,
  SPAM_PATTERNS: [
    /(.)\1{4,}/,          // Repeated characters (e.g., 'aaaaa')
    /^[^a-zA-Z0-9]+$/,    // Only special characters
    /^[0-9]+$/            // Only numbers
  ]
};

/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the message is valid
 * @property {string} [error] - Error message if invalid
 */

/**
 * Check if message contains spam patterns
 * @param {string} message - Message to check
 * @returns {boolean} True if spam pattern found
 */
const containsSpamPatterns = (message) => {
  return CONFIG.SPAM_PATTERNS.some(pattern => pattern.test(message));
};

/**
 * Get word count from message
 * @param {string} message - Message to count words from
 * @returns {number} Number of words
 */
const getWordCount = (message) => {
  return message.split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Validates a message for the contact form
 * @param {string} message - Message to validate
 * @returns {ValidationResult} Validation result
 */
export const validateMessage = (message) => {
  // Null/undefined check
  if (!message) {
    return {
      isValid: false,
      error: 'Please write a message'
    };
  }

  // Trim and basic type check
  if (typeof message !== 'string') {
    return {
      isValid: false,
      error: 'Invalid message format'
    };
  }

  const trimmedMessage = message.trim();

  // Empty check
  if (!trimmedMessage) {
    return {
      isValid: false,
      error: 'Message cannot be empty'
    };
  }

  // Length check
  if (trimmedMessage.length < CONFIG.MIN_LENGTH) {
    return {
      isValid: false,
      error: 'Message is too short'
    };
  }

  if (trimmedMessage.length > CONFIG.MAX_LENGTH) {
    return {
      isValid: false,
      error: 'Message is too long'
    };
  }

  // Word count check
  if (getWordCount(trimmedMessage) < CONFIG.MIN_WORDS) {
    return {
      isValid: false,
      error: 'Please write a complete message'
    };
  }

  // Spam pattern check
  if (containsSpamPatterns(trimmedMessage)) {
    return {
      isValid: false,
      error: 'Please write a proper message'
    };
  }

  // All checks passed
  return { isValid: true };
};
