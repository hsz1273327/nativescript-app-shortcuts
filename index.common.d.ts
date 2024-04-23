export interface LaunchQuickAction {
    type?: string;
    localizedTitle?: string;
}
export interface AppShortcutsAPI {
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
