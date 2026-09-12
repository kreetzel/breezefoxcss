// breezefoxcss — prefs the theme expects.
//
// Drop this next to chrome/ in your profile folder (the same place you put the
// CSS, one level up from the files themselves) and restart. Everything here is
// also listed in the README if you would rather set it by hand in about:config.
//
// Note that user.js is re-applied on every start, so a value set here wins over
// anything you later change in about:config. Delete a line to stop pinning it —
// but see the section below on why deleting is not the same as resetting.
//
// Verified on Firefox 153, Flatpak build, KDE Plasma 6.

// --- Required ---
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true); // load chrome/userChrome.css
user_pref("browser.compactmode.show", true);                            // expose the compact density option
user_pref("browser.uidensity", 1);                                      // compact — the theme assumes it
user_pref("widget.gtk.rounded-bottom-corners.enabled", true);           // optional, per the README
user_pref("widget.use-xdg-desktop-portal.file-picker", 1);              // KDE file dialogs (already implicit under Flatpak)

// --- Resetting prefs another theme may have changed ---
// Removing a user_pref does NOT reset the value already written to prefs.js, so
// if you are coming from a theme that set these, they have to be set back
// explicitly rather than just deleted. These are Firefox's defaults; drop the
// block if you are starting from a clean profile.
user_pref("browser.urlbar.scotchBonnet.enableOverride", true);          // breezefoxcss styles the search-mode switcher
user_pref("security.secure_connection_icon_color_gray", false);         // colored padlock, not Photon-style gray
user_pref("browser.newtabpage.activity-stream.logowordmark.alwaysVisible", true);

// Harmless and generally useful:
user_pref("svg.context-properties.content.enabled", true);              // lets chrome CSS recolor icons

// --- Native Plasma / Breeze widget behavior ---
// These are compiled StaticPrefs, so their shipped defaults are not readable from
// disk; some of these may be no-ops on your build. about:config shows modified
// values in bold.
user_pref("widget.non-native-theme.use-theme-accent", true);      // in-page checkboxes/radios use your accent
user_pref("widget.gtk.overlay-scrollbars.enabled", false);        // Breeze scrollbars are always-visible, not overlay
user_pref("widget.gtk.theme-scrollbar-colors.enabled", true);     // scrollbar colors from the Breeze GTK theme
user_pref("widget.gtk.libadwaita-colors.enabled", false);         // don't pull libadwaita colors over Breeze's

// Leave this false. Setting it true was observed to break context menus on the
// setup above: GTK draws the menu, but clicking an item never fires its
// oncommand, so every entry is dead. It also makes the `menu, menuitem` rules in
// chrome/popups.css dead code, since those style XUL popups rather than GTK ones.
user_pref("widget.gtk.native-context-menus", false);              // XUL-drawn context menus

// Plasma Global Menu — exports the menubar over DBus like a native Qt app.
// Only has an effect if you run a Global Menu applet in a panel; harmless otherwise.
user_pref("widget.gtk.global-menu.enabled", true);
user_pref("widget.gtk.global-menu.wayland.enabled", true);
