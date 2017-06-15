{ pkgs ? import <nixpkgs> {} }:

with pkgs;

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
    nodejs-7_x
    phantomjs2
    pkgconfig
    python2
  ] ++ libs;

  C_INCLUDE_PATH = "${fontconfig.dev}/include";

  shellHook = ''
    echo "Candela nix dev environment"
  '';
}
