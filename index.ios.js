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
var AppShortcutsUIApplicationDelegate = /** @class */ (function (_super) {
    __extends(AppShortcutsUIApplicationDelegate, _super);
    function AppShortcutsUIApplicationDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppShortcutsUIApplicationDelegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = function (application, shortcutItem, completionHandler) {
        callback(application, shortcutItem, completionHandler);
    };
    AppShortcutsUIApplicationDelegate.ObjCProtocols = [UIApplicationDelegate];
    return AppShortcutsUIApplicationDelegate;
}(UIResponder));
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