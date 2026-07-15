# iOS Build & App Store Submission

QuickPrep is wrapped for iOS with [Capacitor](https://capacitorjs.com). The `ios/` folder in this repo is a real Xcode project — everything below happens on your Mac, since it needs Xcode.

## One-time setup (on your Mac)

1. Install Xcode from the App Store if you don't have it.
2. Clone/pull this repo, then:
   ```
   npm install
   npm run ios:sync   # builds the web app and copies it into ios/App/App/public
   npm run ios:open   # opens ios/App/App.xcodeproj in Xcode
   ```
3. In Xcode, select the `App` target → **Signing & Capabilities** → choose your Apple Developer team. Xcode will provision automatically.
4. Set the **Bundle Identifier** if you want something other than `com.adamcmcewen.quickprep` (also update it in `capacitor.config.json` at the repo root if you change it).
5. Add the app icon: drop your 1024×1024 icon into `ios/App/App/Assets.xcassets/AppIcon.appiconset` (Xcode will let you drag it into the asset catalog and generate the other sizes).

No CocoaPods step is needed — this project uses Swift Package Manager, which Xcode resolves automatically when you open it.

## Every time you change the app

```
npm run ios:sync
```
This rebuilds `dist/` and copies the latest web build into the iOS project. Re-run it before testing or archiving a new build.

## Testing on a device/simulator

In Xcode, pick a simulator or your connected iPhone from the scheme selector and hit Run.

## Submitting to the App Store

1. In Xcode: **Product → Archive**.
2. Once archived, use the Organizer window → **Distribute App** → **App Store Connect** → follow the prompts to upload.
3. In [App Store Connect](https://appstoreconnect.apple.com), create the app listing (if you haven't) and fill in:
   - **Privacy Policy URL** — `https://advm301.github.io/ezmacros/privacy.html` (requires enabling GitHub Pages on this repo once — Settings → Pages → deploy from branch `master`, folder `/docs`)
   - **Support URL** — `https://advm301.github.io/ezmacros/support.html`
   - Screenshots (required sizes vary by device — Xcode's simulator can generate these), app description, keywords, age rating, category.
4. Since sign-in is email-only (no third-party login), you do **not** need to add "Sign in with Apple."
5. Submit for review.

## Already handled in-app

- **Account deletion** — required by App Store guideline 5.1.1(v). There's a "Delete Account" link in the app header that permanently removes the user's diary, ratings, photos, and account via a Supabase Edge Function.
- **Privacy policy content** — see `docs/privacy.html`.
