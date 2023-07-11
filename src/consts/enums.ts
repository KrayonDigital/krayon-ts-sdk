export enum SDKReadyStatus {
  Ready = 'ready', // Fully ready, with org
  ReadyNotOnboarded = 'ready-not-onboarded', // User details loaded, but not onboarded (no org present)
  Anonymous = 'anonymous', // API ready to call anonymous methods
  Loading = 'loading', // API is loading
  Error = 'error', // API is in error state
  NotLoaded = 'not-loaded',
}
