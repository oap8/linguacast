import { episodesApi } from "@/lib/api";
import { mockEpisodes, type Episode } from "@/lib/mockData";

type EpisodesListener = (episodes: Episode[]) => void;

let episodesCache: Episode[] = [...mockEpisodes];
const listeners: EpisodesListener[] = [];

const notify = () => {
  listeners.forEach((listener) => listener(episodesCache));
};

const setEpisodes = (episodes: Episode[]) => {
  episodesCache = episodes;
  notify();
};

export const episodesService = {
  subscribe(listener: EpisodesListener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  getSnapshot(): Episode[] {
    return episodesCache;
  },

  async fetchAll(): Promise<Episode[]> {
    const data = await episodesApi.getAll();
    setEpisodes(data);
    return data;
  },

  async fetchById(id: string): Promise<Episode | undefined> {
    const cached = episodesCache.find((ep) => ep.id === id);
    if (cached) {
      return cached;
    }
    return episodesApi.getById(id);
  },

  getRecommended(level: string, limit = 3): Episode[] {
    return episodesCache.filter((ep) => ep.level === level).slice(0, limit);
  },

  getByLevel(level: string): Episode[] {
    return episodesCache.filter((ep) => ep.level === level);
  },
};
