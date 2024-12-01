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
    return { isValid: false, error: 'Email is required' };
  }

  // Remove leading/trailing whitespace
  email = email.trim().toLowerCase();

  // Check length
  if (email.length > 254) { // Maximum length for email addresses
    return { isValid: false, error: 'Email is too long' };
  }

  if (email.length < 5) { // Minimum reasonable length (a@b.c)
    return { isValid: false, error: 'Email is too short' };
  }

  // Basic format check using regex
  const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicFormatRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // More detailed format validation
  const detailedFormatRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!detailedFormatRegex.test(email)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  // Split email into local and domain parts
  const [localPart, domain] = email.split('@');

  // Check local part length
  if (localPart.length > 64) {
    return { isValid: false, error: 'Local part of email is too long' };
  }

  // Check domain part
  const domainParts = domain.split('.');
  
  // Domain must have at least two parts and a valid TLD
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Invalid domain format' };
  }

  // Get domain without TLD and TLD
  const domainWithoutTld = domainParts[domainParts.length - 2];
  const tld = domainParts[domainParts.length - 1];

  // Check if TLD is too short or too long
  if (tld.length < 2 || tld.length > 63) {
    return { isValid: false, error: 'Invalid top-level domain' };
  }

  // Check for TLD typos first
  if (commonTldTypos[tld]) {
    return { 
      isValid: false, 
      error: `Invalid top-level domain. Did you mean .${commonTldTypos[tld]}?` 
    };
  }

  // If no common typo found, check if TLD is valid
  if (!validTLDs.includes(tld)) {
    const suggestedTld = validTLDs.find(validTld => 
      validTld.length === tld.length && 
      levenshteinDistance(validTld, tld) <= 1
    );
    return { 
      isValid: false, 
      error: suggestedTld 
        ? `Invalid top-level domain. Did you mean .${suggestedTld}?`
        : 'Invalid top-level domain'
    };
  }

  // Check for numeric characters in domain
  if (/\d/.test(domainWithoutTld)) {
    // Check if it's a common email provider
    const baseProvider = domainWithoutTld.replace(/\d+/g, '');
    if (validEmailProviders.includes(baseProvider)) {
      return { 
        isValid: false, 
        error: `Invalid email provider. Did you mean ${baseProvider}.${tld}?` 
      };
    }
    return { 
      isValid: false, 
      error: 'Email provider cannot contain numbers' 
    };
  }

  // Check for common domain typos first
  if (commonDomainTypos[domainWithoutTld]) {
    return { 
      isValid: false, 
      error: `Did you mean ${commonDomainTypos[domainWithoutTld]}.${tld}?` 
    };
  }

  // If no common typo found, check if it's a valid email provider
  if (!validEmailProviders.includes(domainWithoutTld)) {
    // Find closest match
    const suggestedProvider = validEmailProviders.find(provider => 
      levenshteinDistance(provider, domainWithoutTld) <= 2
    );
    if (suggestedProvider) {
      return { 
        isValid: false, 
        error: `Unknown email provider. Did you mean ${suggestedProvider}.${tld}?` 
      };
    }
    return {
      isValid: false,
      error: 'Unknown email provider'
    };
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots' };
  }

  return { isValid: true, error: null };
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
