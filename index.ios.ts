import { Application } from "@nativescript/core";
import { AppShortcutsAPI, LaunchQuickAction } from "./index.common";

const iOSApplication = Application.ios;

let quickActionCallback: (data: LaunchQuickAction) => void = null;
let lastQuickAction: any = null;

const callback = (application, shortcutItem, completionHandler) => {
  if (quickActionCallback !== null) {
    quickActionCallback(shortcutItem);
  } else {
    lastQuickAction = shortcutItem;
  }
};

@NativeClass()
class AppShortcutsUIApplicationDelegate extends UIResponder implements UIApplicationDelegate {
  public static ObjCProtocols = [UIApplicationDelegate];

  applicationPerformActionForShortcutItemCompletionHandler(application: UIApplication, shortcutItem: UIApplicationShortcutItem, completionHandler: (p1: boolean) => void): void {
    callback(application, shortcutItem, completionHandler);
  }
}

(() => {
  if (iOSApplication.delegate !== undefined) {
    // Play nice with other plugins by not completely ignoring anything already added to the appdelegate
    iOSApplication.delegate.prototype.applicationPerformActionForShortcutItemCompletionHandler = callback;
  } else {
    iOSApplication.delegate = AppShortcutsUIApplicationDelegate;
  }
})();

export class AppShortcuts implements AppShortcutsAPI {
  // caching for efficiency

  public setQuickActionCallback(callback: (data: LaunchQuickAction) => void) {
    quickActionCallback = callback;
    if (lastQuickAction !== null) {
      quickActionCallback(lastQuickAction);
      lastQuickAction = null;
    }
  }
}
