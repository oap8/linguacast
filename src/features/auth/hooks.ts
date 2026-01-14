import { useSyncExternalStore } from "react";

import { authService } from "./service";
import type { User } from "@/lib/mockData";

export const useAuth = () => {
  const user = useSyncExternalStore(
    authService.subscribe,
    authService.getSnapshot,
    authService.getSnapshot,
  );

  const isAuthenticated = !!user;

  const login = (email: string, password: string) => authService.login(email, password);
  const signup = (email: string, password: string, name: string) => authService.signup(email, password, name);
  const logout = () => authService.logout();
  const updateProfile = (updates: Partial<User>) => authService.updateProfile(updates);
  const toggleFavorite = (episodeId: string) => authService.toggleFavorite(episodeId);
  const addXp = (amount: number) => authService.addXp(amount);

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    toggleFavorite,
    addXp,
  };
};
