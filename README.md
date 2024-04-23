# NativeScript Icon Shortcuts plugin

A fork for [EddyVerbruggen/nativescript-app-shortcuts](https://github.com/EddyVerbruggen/nativescript-app-shortcuts)

<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-app-shortcuts/master/media/iOS.png" width="360px" />  <img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-app-shortcuts/master/media/Android.png" width="360px" />

## Supported platforms

* iPhone 6s / 6s Plus or newer, running iOS 9 or newer.
* Android 7.1 (API level 25) or newer.

## Features

* remove`configureQuickActions(actions: Array<QuickAction>): Promise<void>`,force on static shortcuts
* use deeplink in `android:data` in android instead of `android:targetClass`, use `android:targetClass` now in nativescript will throw system error

## Installation

From the command prompt go to your app's root folder and execute:

```bash
ns plugin add ns-shortcuts
```

## API

If you want to set static shortcut, you should first check if the device can support shortcut by api `available(): Promise<boolean>`.then you can declear the shortcuts in `app/App_Resources/<platform>`first then regist the callback.

### iOS config

You need to manually edit the `.plist`.
Fortunately NativeScript allows you to change this file through `app/App_Resources/iOS/Info.plist`. Anything added there is added to the final `.plist` during a build.

Note that dynamic actions will never replace static actions, so if you have two static actions you can add up to two dynamic ones. Any more will be ignored.

Here's an example which you can paste anywhere in the `.plist` file:

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemIconFile</key>
    <string>eye</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Eye</string>
    <key>UIApplicationShortcutItemSubtitle</key>
    <string>Awesome subtitle</string>
    <key>UIApplicationShortcutItemType</key>
    <string>eye</string>
  </dict>
</array>
```

A few notes:

* set shortcuts as dict item in the array.(you can add more if you like)
* `UIApplicationShortcutItemIconFile`.The second action above uses the built-in `UIApplicationShortcutIconTypeCompose` icon, but the first one uses a custom icon: `eye`. This expects the file `app/App_Resources/iOS/eye.png`. According to Apple's docs this needs to be a single color, transparent, square, `35x35` icon - but that size will look pixelated on retina devices so go ahead and use a `70x70` or `105x105` icon if you please.

* `UIApplicationShortcutItemTitle`.The title of the shortcut.

* `UIApplicationShortcutItemSubtitle`.The subtitle of the shortcut.

* `UIApplicationShortcutItemType`.The payload message which will send to the application when clicked the shortcut. It will set as the `type` param of `configureQuickActions` of the callback.

### Android config

1. Open `app/App_Resources/Android/AndroidManifest.xml` and add:

    ```xml
    <activity ..> <!-- your existing NativeScript activity -->
      <meta-data android:name="android.app.shortcuts"
                android:resource="@xml/shortcuts" />
    </activity>
    ```

2. Open `app/App_Resources/Android/src/main/AndroidManifest.xml`, set `deeplinking`

    ```xml
    <activity ..><!-- your existing NativeScript activity -->
    ...
      <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- url started with `myapp://` will work -->
        <data android:scheme="myapp" />
      </intent-filter>
    </activity>
    ```

3. Add the file you referenced in `AndroidManifest.xml`: `/app/App_Resources/Android/src/main/res/xml/shortcuts.xml` and add:

    ```xml
    <shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
      <shortcut
          android:shortcutId="eye"
          android:enabled="true"
          android:icon="@drawable/eye"
          android:shortcutShortLabel="@string/shortcut_short_label_eye"
          android:shortcutLongLabel="@string/shortcut_long_label_eye"
          android:shortcutDisabledMessage="@string/shortcut_disabled_message_eye">
        <intent android:action="android.intent.action.VIEW"
          android:targetPackage="org.nativescript.myAwesomeApp"
          android:data="myapp://shortcut.type.eye" />
        <categories android:name="android.shortcut.conversation"/>
      </shortcut>
    </shortcuts>
    ```

A few notes:

* This adds 1 static `shortcut` to your app (you can add more if you like).

* `android:shortcutId` is the id of certain shortcut.

* `android:icon`set the icon, in this example, you can drop `eye.png` into `/app/App_Resources/Android/src/main/res/drawable-nodpi/`.

* `android:shortcutShortLabel`,`android:shortcutLongLabel`,`android:shortcutDisabledMessage` is the shortcut's copywriting,you can set them in `app/App_Resources/Android/src/main/res/values/string.xml`

* `intent` declear the action when click the shortcut.`android:action` must be `android.intent.action.VIEW`,`android:targetPackage` must be the application's ID. `android:data` must use the scheme you defined in step 2,and the hostname must started with `shortcut.type.` as prefix.The value behind the prefix is the equivalent of the iOS `UIApplicationShortcutItemType`

* `categories android:name` must be `android.shortcut.conversation`

### regist callback

use API `setQuickActionCallback(callback: (data: LaunchQuickAction) => void): void` to regist callback for shortcuts.

The `ShortcutItemType` will in `LaunchQuickAction.type`. You can use it to route to the certain page.

```ts
import { AppShortcuts } from "ns-shortcuts"
import { router } from "~/router/router"
...
let appShortcuts = new AppShortcuts()
...
appShortcuts.setQuickActionCallback(shortcutItem => {
    console.log(`get QuickActionCallback`)
    switch (shortcutItem.type) {
        case "eye":
            {
                setTimeout(() => {
                    router.push("/page1", {
                        frame: "main-frame"
                    })
                    console.log(`get shortcutItem.type eye`)
                })
            }
            break;
        case "beer":
            {
                setTimeout(() => {
                    router.push("/page2", {
                        frame: "main-frame"
                    })
                    console.log(`get shortcutItem.type eye`)
                })
            }
            break;
        default:
            {
                setTimeout(() => {
                    router.push("/", { frame: "main-frame" }),
                    console.log(`get unknown shortcutItem.type ${shortcutItem.type}`)
                })
            }
            break;
    }
})
```

A few notes:

* if you want to use this plugin with [router-vue-native](https://www.npmjs.com/package/router-vue-native) or other router programme based on [manual-routing](https://docs.nativescript.org/guide/navigation/frames-and-pages), you'd better use only one Frame Only on the root node. Otherwise there will get `java.lang.RuntimeException: Unable to resume activity` error on android.

* route to a page need to set in `setTimeout(() => {route code})`. Otherwise there will get error.