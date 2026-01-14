export interface Episode {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in seconds
  audioUrl: string;
  transcript: string;
  thumbnail: string;
  category: string;
  isNew?: boolean;
}

export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface User {
  id: string;
  email: string;
  name: string;
  level: UserLevel;
  avatar: string;
  favorites: string[];
  progress: {
    episodesCompleted: number;
    totalMinutes: number;
    streak: number;
    xp: number;
  };
  hasCompletedPlacement?: boolean;
}

export const mockEpisodes: Episode[] = [
  {
    id: '1',
    title: 'Morning Coffee Conversations',
    description: 'Learn everyday vocabulary through casual morning conversations about coffee, breakfast, and starting the day.',
    level: 'beginner',
    duration: 480,
    audioUrl: '/audio/episode-1.mp3',
    transcript: 'Good morning! Would you like some coffee? Yes, please. I take mine with milk and sugar. How about you? I prefer black coffee, no sugar. It helps me wake up faster...',
    thumbnail: '/thumbnails/coffee.jpg',
    category: 'Daily Life',
    isNew: true,
  },
  {
    id: '2',
    title: 'At the Airport',
    description: 'Essential phrases and vocabulary for navigating airports, checking in, and boarding flights.',
    level: 'intermediate',
    duration: 720,
    audioUrl: '/audio/episode-2.mp3',
    transcript: 'Excuse me, where is the check-in counter for international flights? It is on your left, near gate B. Thank you. Do you have any baggage to check in?...',
    thumbnail: '/thumbnails/airport.jpg',
    category: 'Travel',
  },
  {
    id: '3',
    title: 'Business Meeting Essentials',
    description: 'Professional vocabulary and phrases for conducting successful business meetings in English.',
    level: 'advanced',
    duration: 900,
    audioUrl: '/audio/episode-3.mp3',
    transcript: 'Let us begin the quarterly review. As you can see from the charts, our revenue has increased by fifteen percent. This is largely due to our new marketing strategy...',
    thumbnail: '/thumbnails/business.jpg',
    category: 'Business',
  },
  {
    id: '4',
    title: 'Ordering at a Restaurant',
    description: 'Practice ordering food, asking questions about the menu, and handling common restaurant scenarios.',
    level: 'beginner',
    duration: 540,
    audioUrl: '/audio/episode-4.mp3',
    transcript: 'Hello, welcome to our restaurant. A table for two, please. Right this way. Here are your menus. I will be back in a few minutes to take your order...',
    thumbnail: '/thumbnails/restaurant.jpg',
    category: 'Daily Life',
    isNew: true,
  },
  {
    id: '5',
    title: 'Technology and Social Media',
    description: 'Modern vocabulary related to technology, apps, social media, and digital communication.',
    level: 'intermediate',
    duration: 660,
    audioUrl: '/audio/episode-5.mp3',
    transcript: 'Have you seen the latest smartphone release? Yes, the camera quality is amazing. I mostly use my phone for social media and streaming videos...',
    thumbnail: '/thumbnails/tech.jpg',
    category: 'Technology',
  },
  {
    id: '6',
    title: 'Academic Discussions',
    description: 'Advanced vocabulary for academic settings, research discussions, and scholarly debates.',
    level: 'advanced',
    duration: 1080,
    audioUrl: '/audio/episode-6.mp3',
    transcript: 'The hypothesis presented in this research paper challenges conventional understanding. However, the methodology employed raises several questions about the validity of the conclusions...',
    thumbnail: '/thumbnails/academic.jpg',
    category: 'Education',
  },
];

export const mockUser: User = {
  id: '1',
  email: 'learner@linguacast.com',
  name: 'Alex Johnson',
  level: 'intermediate',
  avatar: '',
  favorites: ['1', '4'],
  progress: {
    episodesCompleted: 12,
    totalMinutes: 320,
    streak: 7,
    xp: 2450,
  },
};

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-success/10 text-success border-success/20';
    case 'intermediate':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'advanced':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'master':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};
