/**
 * Stable component contract: only `config` appears on timeline components.
 * Option shapes evolve on `*Config` types and semver, not on `ComponentProps<…>`.
 */
export type VirtualizedTimelineRootProps<TConfig> = {
  readonly config: TConfig;
};
