{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "candela-build-env";
  targetPkgs = pkgs: (with pkgs;
    [ 
      alsaLib
      atk
      cairo
      cups
      dbus
      expat
      fontconfig
      freetype
      gdk_pixbuf
      glib
      git
      gnumake
      gtk
      libnotify
      libpng
      nodejs
      nspr
      nss
      pango
      pixman
      pkgconfig
      python
      udev
      zlib
    ]) ++ (with pkgs.gnome;
    [
      GConf
    ]) ++ (with pkgs.xorg;
    [
      libX11
      libXcomposite
      libXcursor
      libXdamage
      libXext
      libXfixes
      libXi
      libXrandr
      libXrender
      libXtst
    ]);
  runScript = "zsh";
}).env
