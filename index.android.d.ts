import { AppShortcutsAPI, LaunchQuickAction } from "./index.common";
export declare class AppShortcuts implements AppShortcutsAPI {
    private supported;
    available(): Promise<boolean>;
    setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void;
}
