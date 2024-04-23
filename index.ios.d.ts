import { AppShortcutsAPI, LaunchQuickAction } from "./index.common";
export declare class AppShortcuts implements AppShortcutsAPI {
    private availability;
    available(): Promise<boolean>;
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
