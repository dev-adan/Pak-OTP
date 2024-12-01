// Helper function to detect gibberish or random text
const isGibberish = (text) => {
  // Count consonants in sequence
  const consecutiveConsonants = text.match(/[bcdfghjklmnpqrstvwxz]{4,}/gi);
  if (consecutiveConsonants) return true;

  // Count vowel/consonant ratio (natural language usually has a more balanced ratio)
  const vowels = text.match(/[aeiou]/gi)?.length || 0;
  const consonants = text.match(/[bcdfghjklmnpqrstvwxz]/gi)?.length || 0;
  if (consonants > 0 && vowels / consonants < 0.2) return true;

  // Check for random character sequences
  const words = text.split(/\s+/);
  const randomWords = words.filter(word => 
    // Words with no vowels
    !/[aeiou]/i.test(word) ||
    // Random character sequences
    /[^a-z0-9\s]{3,}|[a-z]{8,}/i.test(word)
  );
  
  return randomWords.length > words.length / 3;
};

export const validateMessage = (message) => {
  // Basic checks
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }

  const trimmedMessage = message.trim();

  // Check length
  if (trimmedMessage.length < 10) {
    return { isValid: false, error: 'Message is too short (minimum 10 characters)' };
  }

  if (trimmedMessage.length > 2000) {
    return { isValid: false, error: 'Message is too long (maximum 2000 characters)' };
  }

  // Check for repeated characters (e.g., "....." or "aaaaa")
  if (/(.)\1{4,}/.test(trimmedMessage)) {
    return { isValid: false, error: 'Message contains too many repeated characters' };
  }

  // Check for gibberish or random text
  if (isGibberish(trimmedMessage)) {
    return { 
      isValid: false, 
      error: 'Please enter a meaningful message using proper words' 
    };
  }

  return { isValid: true };
};
