import { authApi } from "@/lib/api";
import { mockUser, type User } from "@/lib/mockData";

type AuthListener = (user: User | null) => void;

let currentUser: User | null = null;
const listeners: AuthListener[] = [];

const notify = () => {
  listeners.forEach((listener) => listener(currentUser));
};

const updateUser = (updated: User | null) => {
  currentUser = updated;
  notify();
};

const cloneUser = (overrides?: Partial<User>): User => ({
  ...(currentUser ?? mockUser),
  ...overrides,
});

export const authService = {
  subscribe(listener: AuthListener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  getSnapshot(): User | null {
    return currentUser;
  },

  async login(email: string, password: string) {
    const result = await authApi.login(email, password);
    updateUser({ ...result.user });
    return result;
  },

  async signup(email: string, password: string, name: string) {
    const result = await authApi.signup(email, password, name);
    updateUser({ ...result.user });
    return result;
  },

  async logout() {
    await authApi.logout();
    updateUser(null);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const next = cloneUser(updates);
    updateUser(next);
    return next;
  },

  async toggleFavorite(episodeId: string): Promise<string[]> {
    if (!currentUser) {
      throw new Error("No authenticated user");
    }
    const favorites = currentUser.favorites.includes(episodeId)
      ? currentUser.favorites.filter((id) => id !== episodeId)
      : [...currentUser.favorites, episodeId];
    updateUser({ ...currentUser, favorites });
    return favorites;
  },

  async addXp(amount: number): Promise<void> {
    if (!currentUser) return;

    const currentProgress = currentUser.progress;
    const newXp = currentProgress.xp + amount;
    const newLevel = calculateLevel(newXp);

    const updatedUser: User = {
      ...currentUser,
      level: newLevel,
      progress: {
        ...currentProgress,
        xp: newXp,
      },
    };

    // In a real app, we would await an API call here
    // await userApi.updateProgress(updatedUser.progress);
    updateUser(updatedUser);
  },
};
