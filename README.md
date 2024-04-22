# NativeScript Icon Shortcuts plugin

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/EddyVerbruggen/nativescript-app-shortcuts.svg?branch=master
[build-url]:https://travis-ci.org/EddyVerbruggen/nativescript-app-shortcuts
[npm-image]:http://img.shields.io/npm/v/nativescript-app-shortcuts.svg
[npm-url]:https://npmjs.org/package/nativescript-app-shortcuts
[downloads-image]:http://img.shields.io/npm/dm/nativescript-app-shortcuts.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

<img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-app-shortcuts/master/media/iOS.png" width="360px" />  <img src="https://raw.githubusercontent.com/EddyVerbruggen/nativescript-app-shortcuts/master/media/Android.png" width="360px" />

### Supported platforms

* iPhone 6s / 6s Plus or newer, running iOS 9 or newer.
* Android 7.1 (API level 25) or newer.

## Installation
From the command prompt go to your app's root folder and execute:

```
ns plugin add ns-shortcuts
```


## API
## Configuring Static Actions
With `configureQuickActions` you can configure dynamic actions,
but what if you want actions to be available immediately after the app as installed from the store?

### iOS
You need to manually edit the `.plist`.
Fortunately NativeScript allows you to change this file through `app/App_Resources/iOS/Info.plist`. Anything added there is added to the final `.plist` during a build.

Note that dynamic actions will never replace static actions, so if you have two static actions you can add up to two dynamic ones. Any more will be ignored.

Here's an example which you can paste anywhere in the `.plist` file:

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemIconFile</key>
    <string>Eye</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Eye from plist</string>
    <key>UIApplicationShortcutItemSubtitle</key>
    <string>Awesome subtitle</string>
    <key>UIApplicationShortcutItemType</key>
    <string>eyefromplist</string>
  </dict>
  <dict>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeCompose</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>Compose</string>
    <key>UIApplicationShortcutItemType</key>
    <string>compose</string>
  </dict>
</array>
```

#### UIApplicationShortcutItemIconFile

The second action above uses the built-in `UIApplicationShortcutIconTypeCompose` icon, but the first one uses a custom icon: `Eye`. This expects the file `app/App_Resources/iOS/Eye.png`. According to Apple's docs this needs to be a single color, transparent, square, `35x35` icon - but that size will look pixelated on retina devices so go ahead and use a `70x70` or `105x105` icon if you please.

#### UIApplicationShortcutItemTitle / UIApplicationShortcutItemSubtitle

You can guess what those do, right? Only the title is mandatory.

#### UIApplicationShortcutItemType

This is the same as the `type` param of `configureQuickActions`, so it's what you'll receive in the callback you may have configured in `app.js` / `app.ts`  as `payload.type`. Just do something cool with that info (like routing to a specific page and loading some content).

### Android
Open `app/App_Resources/Android/AndroidManifest.xml` and add:

```xml
<activity ..> <!-- your existing NativeScript activity -->
  <meta-data android:name="android.app.shortcuts"
             android:resource="@xml/shortcuts" />
</activity>
```

Add the file you referenced in `AndroidManifest.xml`: `/app/App_Resources/Android/xml/shortcuts.xml` and add:

```xml
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
  <shortcut
      android:shortcutId="compose"
      android:enabled="true"
      android:icon="@drawable/add"
      android:shortcutShortLabel="@string/shortcut_short_label1"
      android:shortcutLongLabel="@string/shortcut_long_label1"
      android:shortcutDisabledMessage="@string/shortcut_disabled_message1">
    <intent
        android:action="shortcut.type.compose"
        android:targetPackage="org.nativescript.plugindemo.appshortcuts"
        android:targetClass="com.tns.NativeScriptActivity"/>
    <categories android:name="android.shortcut.conversation"/>
  </shortcut>
</shortcuts>
```

A few notes:
- This adds 1 static `shortcut` to your app (you can add more if you like).
- Make sure the `action` has the `shortcut.type.` prefix. The value behind the prefix is the equivalent of the iOS `UIApplicationShortcutItemType`.
- The `targetPackage` needs to be your app id.
- The `targetClass` needs to be the `activity` class as mentioned in `AndroidManifest.xml`, which is `com.tns.NativeScriptApplication` by default. 
