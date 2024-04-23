import { AppShortcutsAPI, LaunchQuickAction } from "./index.common";
export declare class AppShortcuts implements AppShortcutsAPI {
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
