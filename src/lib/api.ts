import { mockEpisodes, mockUser, type Episode, type User } from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API (placeholders)
export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    // Mock login - in production, this would call the backend
    if (email && password) {
      return { success: true, user: mockUser, token: 'mock-jwt-token' };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (email: string, password: string, name: string) => {
    await delay(500);
    // Mock signup
    if (email && password && name) {
      return { 
        success: true, 
        user: { ...mockUser, email, name },
        token: 'mock-jwt-token' 
      };
    }
    throw new Error('Signup failed');
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    await delay(300);
    return mockUser;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(300);
    return { ...mockUser, ...updates };
  },

  toggleFavorite: async (episodeId: string): Promise<string[]> => {
    await delay(200);
    const favorites = mockUser.favorites.includes(episodeId)
      ? mockUser.favorites.filter(id => id !== episodeId)
      : [...mockUser.favorites, episodeId];
    return favorites;
  },
};

// Episodes API
export const episodesApi = {
  getAll: async (): Promise<Episode[]> => {
    await delay(400);
    return mockEpisodes;
  },

  getById: async (id: string): Promise<Episode | undefined> => {
    await delay(300);
    return mockEpisodes.find(ep => ep.id === id);
  },

  getByLevel: async (level: string): Promise<Episode[]> => {
    await delay(300);
    return mockEpisodes.filter(ep => ep.level === level);
  },

  getRecommended: async (userLevel: string): Promise<Episode[]> => {
    await delay(300);
    // Return episodes matching user level + some from adjacent levels
    return mockEpisodes.filter(ep => ep.level === userLevel).slice(0, 3);
  },
};
