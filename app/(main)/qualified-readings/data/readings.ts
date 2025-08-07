import { Reading, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'self-identity',
    name: 'Self-Identity & Authenticity',
    description:
      'Discover your authentic self and unlock your true potential through personalized astrological insights.',
    icon: '🌟',
  },
  {
    id: 'mindset',
    name: 'Mindset & Growth',
    description:
      'Transform your mindset and develop the mental frameworks for success and personal growth.',
    icon: '🧠',
  },
  {
    id: 'love',
    name: 'Love & Relationships',
    description:
      'Navigate your romantic journey with clarity and understanding of your relationship patterns.',
    icon: '💕',
  },
  {
    id: 'career',
    name: 'Career & Purpose',
    description:
      'Find your calling and align your professional path with your unique astrological blueprint.',
    icon: '💼',
  },
];

export const readings: Reading[] = [
  // Self Identity Category
  {
    id: 'core-self',
    name: 'Core Self & Personality Blueprint',
    subtitle: 'Discover your authentic self',
    description:
      'Unlock the essence of who you truly are through your Sun and Rising sign',
    detailedDescription:
      'This comprehensive reading explores your core vitality (Sun) and how you instinctively engage the world (Rising). Discover the authentic self that lies beneath social conditioning and understand the beautiful complexity of your identity.',
    price: 9.99,
    category: 'self-identity',
    icon: '🌟',
  },
  {
    id: 'inner-warrior',
    name: 'Your Inner Warrior – Confidence & Drive',
    subtitle: 'Unlock your inner strength',
    description:
      'Harness your natural courage and resilience through Mars energy',
    detailedDescription:
      'Tap into your innate warrior spirit and discover how your Mars placement shapes your instinctive energy, motivation, and natural courage. Learn to trust your inner fire and express your strength authentically.',
    price: 12.99,
    category: 'self-identity',
    icon: '⚔️',
  },
  {
    id: 'self-belief',
    name: 'Self-Belief & Inner Light',
    subtitle: 'Build confidence and self-worth',
    description:
      'Develop unshakeable self-confidence and reclaim your radiance',
    detailedDescription:
      "Transform your relationship with yourself and reconnect with your inner light. This reading explores your Sun's expression, how your confidence may have been shaped by experience, and how to gently reclaim your natural radiance.",
    price: 11.99,
    category: 'self-identity',
    icon: '💎',
  },
  {
    id: 'chart-ruler',
    name: 'The Chart Ruler & Your Guiding Energy',
    subtitle: 'Discover your inner compass',
    description:
      'Understand your lifelong guiding energy and how it shapes your path',
    detailedDescription:
      'Explore the planet that rules your Rising sign - your chart ruler - and how it functions as an internal compass throughout life. Discover your instinctive motivation, expressive style, and the subtle rhythm that shapes how you act and align with yourself.',
    price: 13.99,
    category: 'self-identity',
    icon: '🧭',
  },

  // Mindset Category
  {
    id: 'growth-mindset',
    name: 'Growth Mindset',
    subtitle: 'Embrace continuous learning',
    description: 'Develop resilience and adaptability',
    detailedDescription:
      'Learn how to cultivate a growth mindset that embraces challenges as opportunities. This reading shows you how to develop resilience, adaptability, and the mental frameworks needed for continuous personal and professional growth.',
    price: 14.99,
    category: 'mindset',
    icon: '🌱',
  },
  {
    id: 'mental-clarity',
    name: 'Mental Clarity',
    subtitle: 'Clear your mind and focus',
    description: 'Achieve mental clarity and sharp focus',
    detailedDescription:
      'Cut through mental fog and achieve crystal-clear thinking. This reading helps you develop mental discipline, improve concentration, and create the mental space needed for better decision-making and creativity.',
    price: 13.99,
    category: 'mindset',
    icon: '🧘',
  },

  // Love Category
  {
    id: 'love-patterns',
    name: 'Love Patterns',
    subtitle: 'Understand your relationship dynamics',
    description: 'Discover your romantic blueprint',
    detailedDescription:
      'Uncover the patterns that shape your romantic relationships and understand your unique approach to love. This reading reveals your love language, attachment style, and how to create healthier, more fulfilling relationships.',
    price: 15.99,
    category: 'love',
    icon: '💕',
  },
  {
    id: 'soulmate-compatibility',
    name: 'Soulmate Compatibility',
    subtitle: 'Find your perfect match',
    description: 'Navigate your path to true love',
    detailedDescription:
      "Discover what makes you truly compatible with others and learn to recognize soulmate connections. This reading helps you understand your ideal partner qualities and how to attract relationships that align with your soul's journey.",
    price: 16.99,
    category: 'love',
    icon: '💫',
  },

  // Career Category
  {
    id: 'career-path',
    name: 'Career Path',
    subtitle: 'Find your professional calling',
    description: 'Align your work with your purpose',
    detailedDescription:
      'Discover your natural career inclinations and find work that aligns with your authentic self. This reading reveals your professional strengths, ideal work environment, and the career path that will bring you the most fulfillment.',
    price: 17.99,
    category: 'career',
    icon: '💼',
  },
  {
    id: 'leadership-style',
    name: 'Leadership Style',
    subtitle: 'Unlock your leadership potential',
    description: 'Develop your natural leadership abilities',
    detailedDescription:
      'Discover your unique leadership style and learn how to inspire and guide others effectively. This reading reveals your natural leadership strengths, communication style, and how to develop your influence in any setting.',
    price: 18.99,
    category: 'career',
    icon: '👑',
  },
];

export const getReadingsByCategory = (categoryId: string): Reading[] => {
  return readings.filter((reading) => reading.category === categoryId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find((category) => category.id === categoryId);
};
