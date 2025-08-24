import type { ReadingConfig } from './types';

export const READING_CONFIG: Record<string, ReadingConfig> = {

  'roots-security': {
    id: 'roots-security',
    name: 'Emotional Roots',
    category: 'Home & Family',
    promise: 'Your foundation, home life, and emotional security patterns.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '🏠',
    extractor: 'RootsSecurityExtractor',
    prompt: 'roots-security',
    editorPrompt: 'editor-roots-security',
    marketing: {
      oneLiner: 'How your inner foundations shape safety, belonging, and the defenses you lean on.',
      valueBullets: [
        'Understand your deepest emotional needs and where you feel most at home',
        'Recognize the defenses you use to guard your heart — and their hidden costs',
        'See how early family patterns still shape your sense of security today'
      ],
      bestForTags: ['Emotional Needs', 'Security Patterns'],
      whatWeExplore: [
        'Moon — emotional core & needs',
        'Moon aspects — support and tension in relationships',
        'Saturn — boundaries, defenses, and caution in closeness',
        'Saturn aspects — stabilizing strengths vs. protective walls',
        'IC sign — tone of early home and safety imprint',
        'Planets in the 4th — family patterns that echo into adulthood'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 800–1100 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'drive-ambition': {
    id: 'drive-ambition',
    name: 'Drive & Ambition',
    category: 'Career & Achievement',
    promise: 'Your inner engine for drive, power, and life direction.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '🚀',
    extractor: 'DriveAmbitionExtractor',
    prompt: 'drive-ambition',
    editorPrompt: 'editor-drive-ambition',
    marketing: {
      oneLiner: 'Your inner engine for drive, power, and life direction.',
      valueBullets: [
        'Discover your natural motivation style and how you pursue goals',
        'Understand the power dynamics that shape ambition and resilience',
        'Clarify your career path, achievements, and public image'
      ],
      bestForTags: ['Career Direction', 'Personal Achievement'],
      whatWeExplore: [
        'Mars — energy, motivation, and how you assert yourself',
        'Pluto — willpower, intensity, and transformative ambition',
        'Midheaven — public goals and life direction',
        'Planets in the 10th — added strengths and pressures in achievement'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'boundaries-protection': {
    id: 'boundaries-protection',
    name: 'Boundaries & Defenses',
    category: 'Relationships & Trust',
    promise: 'How you protect yourself, set boundaries, and project strength to the world.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '🛡️',
    extractor: 'BoundariesProtectionExtractor',
    prompt: 'boundaries-protection',
    editorPrompt: 'editor-boundaries-protection',
    marketing: {
      oneLiner: 'How you protect yourself, set boundaries, and project strength to the world.',
      valueBullets: [
        'Discover where you build protective walls and why they formed',
        'Understand how hidden fears or power dynamics shape your defenses',
        'See how your outer mask affects closeness, trust, and connection'
      ],
      bestForTags: ['Boundaries & Trust', 'Self-Protection Patterns', 'Guardedness in Relationships'],
      whatWeExplore: [
        'Saturn — your walls, caution, and lessons in self-reliance',
        'Pluto — deep defenses and control patterns that guard vulnerability',
        'Ascendant — your protective mask and how others first perceive you',
        'Planets in the 1st house — added strengths and risks in your armor',
        'Saturn/Pluto aspects — where resilience and fear intertwine',
        'Everyday examples of how you guard closeness'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'love-intimacy': {
    id: 'love-intimacy',
    name: 'Love & Intimacy',
    category: 'Relationships & Trust',
    promise: 'The hidden patterns that shape how you love, attract, and open to intimacy.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '💕',
    extractor: 'LoveIntimacyExtractor',
    prompt: 'love-intimacy',
    editorPrompt: 'editor-love-intimacy',
    marketing: {
      oneLiner: 'The hidden patterns that shape how you love, attract, and open to intimacy.',
      valueBullets: [
        'Discover the qualities you seek in partners and how you show love in return',
        'Understand your repeating dynamics around closeness, trust, and conflict',
        'Learn where passion, playfulness, and long-term partnership naturally come alive for you'
      ],
      bestForTags: ['Relationship Patterns', 'Attraction & Intimacy', 'Dating Insights'],
      whatWeExplore: [
        'Venus — your love language & attraction style',
        '7th house/Descendant — what you seek in partnership & commitment',
        '5th house — romance, dating patterns & playful intimacy',
        'Moon–Venus aspects — emotional needs in love',
        'Sun–Venus aspects — how self-expression shapes attraction',
        'Partnership dynamics — closeness, trust & repeating themes'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'mind-communication': {
    id: 'mind-communication',
    name: 'Communication Style',
    category: 'Learning & Expression',
    promise: 'How you think, learn, and express yourself in everyday life and beyond.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '🧠',
    extractor: 'MindCommunicationExtractor',
    prompt: 'mind-communication',
    editorPrompt: 'editor-mind-communication',
    marketing: {
      oneLiner: 'How you think, learn, and express yourself in everyday life and beyond.',
      valueBullets: [
        'Understand your natural mental rhythm and communication tone',
        'See where your thoughts flow most easily and where they may get stuck',
        'Discover how you learn, share ideas, and connect with others'
      ],
      bestForTags: ['Communication Habits', 'Learning & Mental Style', 'Worldview & Philosophy'],
      whatWeExplore: [
        'Mercury — your cognitive style & self-expression',
        'Mercury aspects — strengths and challenges in thinking and communication',
        '3rd house — everyday exchanges with peers, siblings, and colleagues',
        'Planets in the 3rd — emotional, social, or intellectual influence on daily dialogue',
        '9th house (optional) — worldview, beliefs, and higher learning',
        'Mental patterns — strengths, challenges, and everyday examples'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'self-worth-values': {
    id: 'self-worth-values',
    name: 'Self-Worth & Values',
    category: 'Identity & Direction',
    promise: 'How you define your worth, what you value, and the confidence it brings to your life.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '💎',
    extractor: 'SelfWorthValuesExtractor',
    prompt: 'self-worth-values',
    editorPrompt: 'editor-self-worth-values',
    marketing: {
      oneLiner: 'How you define your worth, what you value, and the confidence it brings to your life.',
      valueBullets: [
        'Understand where your natural confidence comes from — and what weakens it',
        'Clarify the values and priorities that give your life stability and meaning',
        'See how your relationship with money, pleasure, and growth reflects your self-worth'
      ],
      bestForTags: ['Self-Esteem', 'Money & Resources', 'Inner Confidence'],
      whatWeExplore: [
        'Sun — your identity and core source of confidence',
        '2nd house — how you measure self-worth, values, and security',
        'Planets in the 2nd — how money, resources, and possessions affect your self-image',
        'Venus — pleasure, love, and how beauty shapes your sense of worth',
        'Jupiter — optimism, growth, and expansion in values and resources',
        'Key aspects — patterns that support or challenge your confidence'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'healing-transformation': {
    id: 'healing-transformation',
    name: 'Heal & Transform',
    category: 'Growth & Development',
    promise: 'How your deepest wounds become the key to resilience, healing, and inner strength.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '🦋',
    extractor: 'HealingTransformationExtractor',
    prompt: 'healing-transformation',
    editorPrompt: 'editor-healing-transformation',
    marketing: {
      oneLiner: 'How your deepest wounds become the key to resilience, healing, and inner strength.',
      valueBullets: [
        'Understand your core wounds and where they most impact your life',
        'Discover how hidden challenges shape your resilience and transformation',
        'Learn how crises become opportunities for renewal and empowerment'
      ],
      bestForTags: ['Emotional Healing', 'Transformation Journeys', 'Resilience Building'],
      whatWeExplore: [
        'Chiron — your core wound and pathway to healing',
        'Pluto — your instinct for transformation and inner power',
        '8th house — how you face crisis, intimacy, and shared depths',
        'Chiron–Sun/Moon/Saturn aspects — pain patterns & healing gifts',
        'Pluto–Venus/Mars/Ascendant aspects — empowerment & shadow dynamics',
        '8th house planets — where crisis turns into renewal'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  'meaning-spiritual-growth': {
    id: 'meaning-spiritual-growth',
    name: 'Spirituality & Meaning',
    category: 'Growth & Development',
    promise: 'Your path of faith, wisdom, and the deeper meaning that guides your life.',
    length: '10–12 min',
    delivery: 'On-screen + PDF',
    icon: '✨',
    extractor: 'MeaningSpiritualGrowthExtractor',
    prompt: 'meaning-spiritual-growth',
    editorPrompt: 'editor-meaning-spiritual-growth',
    marketing: {
      oneLiner: 'Your path of faith, wisdom, and the deeper meaning that guides your life.',
      valueBullets: [
        'Discover how you naturally search for truth, growth, and a guiding philosophy',
        'Understand where you find inspiration — and where illusions or doubts may cloud your path',
        'See how life experiences, learning, and belief shape your personal sense of purpose'
      ],
      bestForTags: ['Spiritual Growth', 'Life Purpose', 'Worldview & Beliefs'],
      whatWeExplore: [
        'Jupiter — your style of growth, optimism, and inner faith',
        'Neptune — your ideals, intuition, and spiritual longing',
        '9th house — worldview, higher learning, and philosophy of life',
        'Jupiter–Neptune aspects — balance between wisdom and idealism',
        'Planets in the 9th — how personal energies shape your beliefs',
        'Strengths and challenges in building a meaningful life path'
      ],
      whatYouReceive: 'You\'ll receive a 5-section, 900–1200 word personalized reading. Each reading is delivered instantly on-screen and as a downloadable PDF.',
      deliveryDetails: 'View instantly on-screen + PDF by email'
    }
  },
  // Add more readings here as you create them
  // 'spiritual-path': { ... },
  // 'family-dynamics': { ... },
};

// Helper functions
export function getReadingConfig(readingId: string): ReadingConfig | undefined {
  return READING_CONFIG[readingId];
}

export function getAllReadingConfigs(): ReadingConfig[] {
  return Object.values(READING_CONFIG);
}

export function getAvailableReadingIds(): string[] {
  return Object.keys(READING_CONFIG);
}

export function getReadingsByCategory(category: string): ReadingConfig[] {
  return getAllReadingConfigs().filter(reading => reading.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(getAllReadingConfigs().map(reading => reading.category));
  return Array.from(categories);
}
