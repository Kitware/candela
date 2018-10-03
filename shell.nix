{ pkgs ? "null"}:

let cpkgs = import (fetchTarball {
  url = https://github.com/NixOS/nixpkgs-channels/archive/14a9ca27e69e33ac8ffb708de08883f8079f954a.tar.gz;
  sha256 = "1grsq8mcpl88v6kz8dp0vsybr0wzfg4pvhamj42dpd3vgr93l2ib";
}) {}; in

with cpkgs;

let libs = [
  alsaLib
  atk
  cairo
  cups
  dbus
  expat
  fontconfig.lib
  fontconfig.dev
  gdk_pixbuf
  glib
  gnome3.gconf
  gtk2
  nspr
  nss
  pango
  python27Packages.sphinx
  python27Packages.sphinx_rtd_theme
  freetype
  stdenv.cc.cc.lib
  zlib
] ++ (with xorg; [
  libX11
  libxcb
  libXcomposite
  libXcursor
  libXdamage
  libXext
  libXi
  libXfixes
  libXrandr
  libXrender
  libXScrnSaver
  libXtst
]);
in stdenv.mkDerivation {
  name = "candela";

  buildInputs = [
    electron
    nodejs-9_x
    phantomjs2
    pkgconfig
    python2
  ] ++ libs;

  C_INCLUDE_PATH = "${fontconfig.dev}/include";

  shellHook = ''
    echo "Candela nix dev environment"
  '';
}
