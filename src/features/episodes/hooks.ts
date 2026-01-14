import { useCallback, useSyncExternalStore } from "react";

import { episodesService } from "./service";

export const useEpisodes = () => {
  const episodes = useSyncExternalStore(
    episodesService.subscribe,
    episodesService.getSnapshot,
    episodesService.getSnapshot,
  );

  const fetchAll = useCallback(() => episodesService.fetchAll(), []);
  const fetchById = useCallback((id: string) => episodesService.fetchById(id), []);
  const getRecommended = useCallback(
    (level: string, limit?: number) => episodesService.getRecommended(level, limit),
    [],
  );
  const getByLevel = useCallback((level: string) => episodesService.getByLevel(level), []);

  return {
    episodes,
    fetchAll,
    fetchById,
    getRecommended,
    getByLevel,
  };
};
