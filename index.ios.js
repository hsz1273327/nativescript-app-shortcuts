import { Application } from "@nativescript/core";
const iOSApplication = Application.ios;
let quickActionCallback = null;
let lastQuickAction = null;
const callback = (application, shortcutItem, completionHandler) => {
    if (quickActionCallback !== null) {
        quickActionCallback(shortcutItem);
    }
    else {
        lastQuickAction = shortcutItem;
    }
};
let AppShortcutsUIApplicationDelegate = class AppShortcutsUIApplicationDelegate extends UIResponder {
    applicationPerformActionForShortcutItemCompletionHandler(application, shortcutItem, completionHandler) {
        callback(application, shortcutItem, completionHandler);
    }
};
AppShortcutsUIApplicationDelegate.ObjCProtocols = [UIApplicationDelegate];
AppShortcutsUIApplicationDelegate = __decorate([
    NativeClass()
], AppShortcutsUIApplicationDelegate);
(() => {
    if (iOSApplication.delegate !== undefined) {
        iOSApplication.delegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
    }
    else {
        iOSApplication.delegate = AppShortcutsUIApplicationDelegate;
    }
})();
export class AppShortcuts {
    setQuickActionCallback(callback) {
        quickActionCallback = callback;
        if (lastQuickAction !== null) {
            quickActionCallback(lastQuickAction);
            lastQuickAction = null;
        }
    }
}
//# sourceMappingURL=index.ios.js.map