{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "candela-build-env";
  targetPkgs = pkgs: (with pkgs;
    [ 
      cairo
      fontconfig
      freetype
      git
      gnumake
      libpng
      nodejs
      pixman
      pkgconfig
      python
      vim
      zlib
    ]);
  runScript = "zsh";
}).env
