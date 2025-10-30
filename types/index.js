// TypeScript-style JSDoc type definitions for WishBloom

/**
 * @typedef {Object} Contributor
 * @property {string} id - Unique identifier
 * @property {string} name - Contributor's name
 * @property {string} [email] - Optional email
 * @property {number} contributionCount - Number of contributions
 */

/**
 * @typedef {Object} Memory
 * @property {string} id - Unique identifier
 * @property {string} title - Memory title
 * @property {string} description - Memory description
 * @property {string} date - Memory date
 * @property {Contributor} contributor - Who added this memory
 * @property {string} [imageUrl] - Optional image URL
 * @property {'standard'|'featured'|'quote'} type - Memory type
 * @property {string[]} tags - Memory tags
 * @property {number} rotation - Rotation angle in degrees
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier
 * @property {'letter'|'poem'} type - Message type
 * @property {string} [greeting] - Optional greeting for letters
 * @property {string} content - Main message content
 * @property {string} [closing] - Optional closing for letters
 * @property {string} signature - Sender's signature
 * @property {string} [title] - Optional title for poems
 * @property {string} [postscript] - Optional postscript
 * @property {Contributor} contributor - Who wrote this message
 * @property {string} date - Message date
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} WishBloom
 * @property {string} id - Unique identifier
 * @property {string} recipientName - Recipient's name
 * @property {number} [age] - Recipient's age
 * @property {string} [creativeAgeDescription] - Creative age description
 * @property {string} introMessage - Welcome message
 * @property {string} uniqueUrl - Unique URL slug
 * @property {Contributor} createdBy - Creator
 * @property {Contributor[]} contributors - All contributors
 * @property {Memory[]} memories - All memories
 * @property {Message[]} messages - All messages
 * @property {string[]} celebrationWishPhrases - Floating wish phrases
 * @property {string} createdDate - ISO date string
 * @property {number} viewCount - Number of views
 * @property {boolean} [isArchived] - Archive status
 */

export {}
