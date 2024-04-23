import { AppShortcutsAPI, LaunchQuickAction } from "./ns-shortcuts.common";
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


  setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void {
    quickActionCallback = callback;
    if (lastQuickAction !== null) {
      quickActionCallback(lastQuickAction);
      lastQuickAction = null;
    }
  }
}