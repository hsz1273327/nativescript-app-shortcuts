

export interface LaunchQuickAction {
  /**
   * The type you previously passed in as QuickAction.type.
   */
  type?: string;

  /**
   * The text you previously passed in as QuickAction.title.
   * iOS only.
   */
  localizedTitle?: string;
}

export interface AppShortcutsAPI {
  available(): Promise<boolean>;
  setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}