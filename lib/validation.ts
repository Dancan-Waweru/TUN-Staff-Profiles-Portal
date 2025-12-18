import { z } from 'zod'

// URL validation patterns for professional platforms
const URL_PATTERNS = {
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  googleScholar: /^https:\/\/scholar\.google\.com\/citations\?user=[a-zA-Z0-9_-]+(&.*)?$/,
  orcid: /^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/,
  researchgate: /^https:\/\/(www\.)?researchgate\.net\/profile\/[a-zA-Z0-9-_]+\/?$/,
  website: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(\/.*)?$/
}

// Custom validation functions
export const validateLinkedInUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return true // Optional field
  return URL_PATTERNS.linkedin.test(url)
}

export const validateGoogleScholarUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return true // Optional field
  return URL_PATTERNS.googleScholar.test(url)
}

export const validateOrcidUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return true // Optional field
  return URL_PATTERNS.orcid.test(url)
}

export const validateResearchGateUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return true // Optional field
  return URL_PATTERNS.researchgate.test(url)
}

export const validateWebsiteUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === '') return true // Optional field
  return URL_PATTERNS.website.test(url)
}

// Zod schema with custom validation
export const professionalLinksSchema = z.object({
  linkedinUrl: z.string().optional().refine(validateLinkedInUrl, {
    message: 'LinkedIn URL must be in format: https://linkedin.com/in/username'
  }),
  googleScholarUrl: z.string().optional().refine(validateGoogleScholarUrl, {
    message: 'Google Scholar URL must be in format: https://scholar.google.com/citations?user=USER_ID'
  }),
  orcidUrl: z.string().optional().refine(validateOrcidUrl, {
    message: 'ORCID URL must be in format: https://orcid.org/0000-0000-0000-0000'
  }),
  researchgateUrl: z.string().optional().refine(validateResearchGateUrl, {
    message: 'ResearchGate URL must be in format: https://researchgate.net/profile/Username'
  }),
  websiteUrl: z.string().optional().refine(validateWebsiteUrl, {
    message: 'Website URL must be a valid HTTP/HTTPS URL'
  })
})

// Helper function to get validation error message
export const getUrlValidationError = (platform: string, url: string): string | null => {
  if (!url) return null
  
  switch (platform) {
    case 'linkedin':
      return validateLinkedInUrl(url) ? null : 'LinkedIn URL must be in format: https://linkedin.com/in/username'
    case 'googleScholar':
      return validateGoogleScholarUrl(url) ? null : 'Google Scholar URL must be in format: https://scholar.google.com/citations?user=USER_ID'
    case 'orcid':
      return validateOrcidUrl(url) ? null : 'ORCID URL must be in format: https://orcid.org/0000-0000-0000-0000'
    case 'researchgate':
      return validateResearchGateUrl(url) ? null : 'ResearchGate URL must be in format: https://researchgate.net/profile/Username'
    case 'website':
      return validateWebsiteUrl(url) ? null : 'Website URL must be a valid HTTP/HTTPS URL'
    default:
      return null
  }
}

// Helper function to format URL examples
export const getUrlExample = (platform: string): string => {
  switch (platform) {
    case 'linkedin':
      return 'https://linkedin.com/in/john-doe'
    case 'googleScholar':
      return 'https://scholar.google.com/citations?user=ABC123DEF'
    case 'orcid':
      return 'https://orcid.org/0000-0000-0000-0000'
    case 'researchgate':
      return 'https://researchgate.net/profile/John-Doe'
    case 'website':
      return 'https://johndoe.com or https://username.medium.com'
    default:
      return ''
  }
}