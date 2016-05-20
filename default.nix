{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "candela-build-env";
  targetPkgs = pkgs: (with pkgs;
    [ 
      cairo
      fontconfig
      git
      gnumake
      libpng
      nodejs
      pixman
      pkgconfig
      python
      vim
    ]);
  runScript = "zsh";
}).env
