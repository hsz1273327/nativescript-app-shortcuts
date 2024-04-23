import { Application, Utils } from "@nativescript/core";
const iOSApplication = Application.ios;
const iOSUtils = Utils.ios;
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
    constructor() {
        this.availability = null;
    }
    available() {
        return new Promise((resolve, reject) => {
            if (this.availability !== null) {
                resolve(this.availability);
                return;
            }
            if (iOSUtils.MajorVersion >= 13) {
                resolve(true);
                return;
            }
            if (iOSUtils.MajorVersion >= 9) {
                if (iOSApplication.nativeApp.keyWindow === null) {
                    setTimeout(() => {
                        this.availability = 2 === iOSApplication.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
                        resolve(this.availability);
                    });
                }
                else {
                    this.availability = 2 === iOSApplication.nativeApp.keyWindow.rootViewController.traitCollection.forceTouchCapability;
                    resolve(this.availability);
                }
            }
            else {
                this.availability = false;
                resolve(this.availability);
            }
        });
    }
    setQuickActionCallback(callback) {
        quickActionCallback = callback;
        if (lastQuickAction !== null) {
            quickActionCallback(lastQuickAction);
            lastQuickAction = null;
        }
    }
}
//# sourceMappingURL=index.ios.js.map