# breezefoxcss

Firefox `userChrome.css` made to match KDE's Breeze theming.

## Screenshots

![image](screen.png)

## How to

- Set Firefox's theme to **System theme — auto**
- In `about:config`, enable:
  - `toolkit.legacyUserProfileCustomizations.stylesheets`
  - `browser.compactmode.show`
  - `widget.gtk.rounded-bottom-corners.enabled` *(optional)*
- In `about:config`, set:
  - `browser.uidensity` to `1` (compact — the theme assumes it)
  - `widget.use-xdg-desktop-portal.file-picker` to `1` (KDE file dialogs; already
    implicit if you run Firefox as a Flatpak)
- Put all the files into the `chrome` folder inside your browser profile folder,
  creating it if it doesn't exist
- Restart Firefox
- Profit

### A note on colors

The theme styles with CSS system colors (`SelectedItem`, `-moz-menuhover`) rather
than hardcoded Breeze values, so it picks up your **actual** Plasma accent color and
color scheme instead of forcing Breeze blue. On Linux, Firefox derives those from
GTK — so if your GTK theme doesn't match your Plasma color scheme, you'll get Breeze
shapes with the wrong colors. For Flatpak Firefox specifically:

```sh
flatpak install flathub org.gtk.Gtk3theme.Breeze
flatpak override --user --env=GTK_THEME=Breeze:dark org.mozilla.firefox  # drop :dark for light
```

Scoping it with `--env` on the Firefox app leaves your other GTK apps alone.

## Going further: matching Plasma beyond the chrome

The CSS only styles Firefox's own UI. Two `about:config` prefs push the rest of the
browser closer to a native Qt app:

| Pref | Value | Effect |
|---|---|---|
| `widget.gtk.native-context-menus` | `true` | Context menus drawn by GTK (i.e. by Breeze) instead of by Firefox |
| `widget.gtk.overlay-scrollbars.enabled` | `false` | Breeze scrollbars are always-visible, not GNOME-style overlay |

**Already correct by default on Firefox 153** — listed only so you don't waste time
setting them: `widget.non-native-theme.use-theme-accent`,
`widget.gtk.theme-scrollbar-colors.enabled`, `widget.gtk.libadwaita-colors.enabled`,
`widget.gtk.global-menu.enabled` and `widget.gtk.global-menu.wayland.enabled`.

These are compiled StaticPrefs, so their defaults aren't readable from the install
tree. The quick way to tell what actually differs on your build: Firefox only writes
non-default values to `prefs.js`, so set a batch, restart, and grep that file —
whatever appears is doing something. `about:config` also shows modified values in bold.

There is also a `widget.non-native-theme.gtk.scrollbar.*` family (`round-thumb`,
`thumb-size`, `allow-buttons`) for tuning the scrollbar thumb. If scrollbars end up
looking worse rather than more Breeze-like, `widget.gtk.overlay-scrollbars.enabled`
is the first one to flip back.

### On context menus

With `widget.gtk.native-context-menus` enabled, menus are Breeze-GTK's, which
specifies a translucent accent fill, a 1px accent border and a `1.25mm` (~4.7px) item
radius — within a third of a pixel of the 5px this theme uses for its own XUL menus.
So native and CSS-drawn menus look nearly identical either way.

What Breeze-GTK does *not* specify is a `border-radius` on `menu` itself, so popups
have square corners while Plasma 6's Qt menus are rounded and blurred. That gap is in
`breeze-gtk`, not Firefox, and it affects every GTK app on the system. If you want
Plasma 6's rounded corners specifically, set `widget.gtk.native-context-menus` to
`false` and style `menupopup` in CSS instead — at the cost of hand-maintaining it, and
some tuning to stop the drop shadow rendering square on Wayland.

### plasma-browser-integration under Flatpak

[plasma-browser-integration](https://addons.mozilla.org/en-US/firefox/addon/plasma-integration/)
gives you panel media controls, downloads as Plasma notifications, tabs in Task
Manager and KRunner, and KDE Connect link sharing. It works out of the box with a
native Firefox, but the Flatpak build ships `filesystems=!host-os`, so it can
neither read the host's messaging manifest nor exec the connector binary.

Bridge it with `flatpak-spawn`. Create
`~/.var/app/org.mozilla.firefox/bin/plasma-browser-integration-host`:

```sh
#!/bin/sh
exec flatpak-spawn --host /usr/bin/plasma-browser-integration-host "$@"
```

`chmod +x` it, then create
`~/.var/app/org.mozilla.firefox/.mozilla/native-messaging-hosts/org.kde.plasma.browser_integration.json`:

```json
{
  "name": "org.kde.plasma.browser_integration",
  "description": "Native connector for KDE Plasma (Flatpak bridge)",
  "path": "/home/YOUR_USERNAME/.var/app/org.mozilla.firefox/bin/plasma-browser-integration-host",
  "type": "stdio",
  "allowed_extensions": ["plasma-browser-integration@kde.org"]
}
```

`path` must be absolute — `~` is not expanded. That directory is visible inside the
sandbox at the same path, so no remapping is needed despite `persistent=.mozilla`.
Finally, allow the sandbox to use `flatpak-spawn`, install the extension, and restart:

```sh
flatpak override --user --talk-name=org.freedesktop.Flatpak org.mozilla.firefox
```

Check the connector binary's real location on your distro; on Fedora-family systems
it is `/usr/bin/plasma-browser-integration-host`, and the manifest it installs is at
`/usr/lib64/mozilla/native-messaging-hosts/`.

## File layout

| File | Contents |
|---|---|
| `userChrome.css` | Entry point; imports everything below |
| `variables.css` | Shared corner radius, border color and Breeze negative |
| `buttons.css` | Toolbar and panel button variables |
| `tabs.css` | Tab strip, tab borders, close button |
| `popups.css` | Menus, urlbar dropdown, downloads panel |
| `findbar.css` | Floating find bar |
| `statuspanel.css` | Floating link-hover status panel |
| `userContent.css` | `about:` pages — newtab, preferences |

## Thanks to:

- [QNetITQ/WaveFox](https://github.com/QNetITQ/WaveFox)
- [RobotoSkunk/zen-better-findbar](https://github.com/RobotoSkunk/zen-better-findbar)
- [AmirhBeigi/zen-floating-statusbar](https://github.com/AmirhBeigi/zen-floating-statusbar)

## License

MIT — see [LICENSE](LICENSE).
