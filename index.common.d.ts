export interface LaunchQuickAction {
    type?: string;
    localizedTitle?: string;
}
export interface AppShortcutsAPI {
    available(): Promise<boolean>;
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
