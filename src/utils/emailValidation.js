/**
 * Comprehensive email validation utility
 */

// List of valid top-level domains
const validTLDs = [
  'com', 'net', 'org', 'edu', 'gov', 'mil',
  'io', 'co', 'ai', 'app', 'dev', 'tech',
  'info', 'biz', 'name', 'mobi', 'pro',
  'int', 'museum', 'aero', 'jobs', 'cat',
  'uk', 'us', 'ca', 'au', 'de', 'fr', 'jp',
  'ru', 'ch', 'it', 'nl', 'se', 'no', 'es',
  'pk', 'in', 'cn'
];

// List of valid email providers
const validEmailProviders = [
  'gmail',
  'yahoo',
  'hotmail',
  'outlook',
  'aol',
  'icloud',
  'protonmail',
  'zoho',
  'mail',
  'live',
  'msn'
];

// List of common domain typos
const commonDomainTypos = {
  'gmial': 'gmail',
  'gmal': 'gmail',
  'gmil': 'gmail',
  'gmai': 'gmail',
  'yaho': 'yahoo',
  'yahooo': 'yahoo',
  'hotmal': 'hotmail',
  'hotmai': 'hotmail',
  'outloo': 'outlook',
  'outlok': 'outlook'
};

// List of common TLD typos
const commonTldTypos = {
  'con': 'com',
  'comm': 'com',
  'comme': 'com',
  'col': 'com',
  'net1': 'net',
  'nett': 'net',
  'orgn': 'org',
  'orgg': 'org'
};

export const validateEmail = (email) => {
  // Basic checks
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Please enter your email address so we can get back to you' };
  }

  // Remove leading/trailing whitespace
  email = email.trim().toLowerCase();

  // Check length
  if (email.length > 254) { // Maximum length for email addresses
    return { isValid: false, error: 'This email seems unusually long. Could you double-check it?' };
  }

  if (email.length < 5) { // Minimum reasonable length (a@b.c)
    return { isValid: false, error: 'This email seems too short. Please enter your full email address' };
  }

  // Basic format check using regex
  const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicFormatRegex.test(email)) {
    return { isValid: false, error: 'Your email should look like "name@example.com"' };
  }

  // More detailed format validation
  const detailedFormatRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!detailedFormatRegex.test(email)) {
    return { isValid: false, error: 'Some characters in your email address don\'t look right' };
  }

  // Split email into local and domain parts
  const [localPart, domain] = email.split('@');

  // Check local part length
  if (localPart.length > 64) {
    return { isValid: false, error: 'The part before @ is too long. Could you check it?' };
  }

  // Check domain part
  const domainParts = domain.split('.');
  
  // Domain must have at least two parts and a valid TLD
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Your email domain should have a proper ending (like .com)' };
  }

  const tld = domainParts[domainParts.length - 1];
  
  // Check for common TLD typos and suggest corrections
  if (!validTLDs.includes(tld)) {
    const typoCorrection = commonTldTypos[tld];
    if (typoCorrection) {
      return { 
        isValid: false, 
        error: `Did you mean to type "${email.replace(tld, typoCorrection)}"?` 
      };
    }
    
    // Find closest matching TLD
    let closestMatch = '';
    let minDistance = Infinity;
    for (const validTld of validTLDs) {
      const distance = levenshteinDistance(tld, validTld);
      if (distance < minDistance && distance <= 2) {
        minDistance = distance;
        closestMatch = validTld;
      }
    }
    
    if (closestMatch) {
      return { 
        isValid: false, 
        error: `Did you mean to use "${email.replace(tld, closestMatch)}"?` 
      };
    }
    
    return { 
      isValid: false, 
      error: 'The email ending doesn\'t look right. Common ones are .com, .net, or .org' 
    };
  }

  // Check for common domain typos
  const domainWithoutTld = domainParts[domainParts.length - 2];
  const typoCorrection = commonDomainTypos[domainWithoutTld];
  if (typoCorrection) {
    const correctedEmail = email.replace(domainWithoutTld, typoCorrection);
    return { 
      isValid: false, 
      error: `Did you mean "${correctedEmail}"?` 
    };
  }

  return { isValid: true };
};

// Helper function to calculate Levenshtein distance for suggesting similar TLDs
function levenshteinDistance(str1, str2) {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator,
      );
    }
  }
  return track[str2.length][str1.length];
}
