import { AppShortcutsAPI, LaunchQuickAction } from "./index.common";
import { Application } from "@nativescript/core";
import * as urlparse from 'url-parse';

declare const android: any;

let quickActionCallback: (data: LaunchQuickAction) => void = null;
let lastQuickAction: any = null;

const SHORTCUT_PREFIX = "shortcut.type.";

(() => {
  const iconHandler = args => {
    if (!args || !args.android || !args.android.getData) {
      return
    }
    const launchAction = args.android.getData()
    const url = urlparse(launchAction, true)
    const isShortcutAction = launchAction && url.hostname.includes(SHORTCUT_PREFIX)
    const type = url.hostname.replace(SHORTCUT_PREFIX, "")
    if (isShortcutAction) {
      args.android.setAction("")
      const quickAction = {
        type: type
      }
      if (quickActionCallback) {
        quickActionCallback(quickAction)
      }
      else {
        lastQuickAction = quickAction
      }
    }
  }

  Application.on("launch", (args) => iconHandler(args));
})();

export class AppShortcuts implements AppShortcutsAPI {
  private supported(): boolean {
    return android.os.Build.VERSION.SDK_INT >= 25; // Android 7.1+
  }

  available(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(this.supported());
    });
  }

  setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void {
    quickActionCallback = callback;
    if (lastQuickAction !== null) {
      quickActionCallback(lastQuickAction);
      lastQuickAction = null;
    }
  }
}