{
  description = "Angular Development Environment";

  inputs = {
    nixpkgs.url = "github:Nixos/nixpkgs/nixos-26.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux"; # Adjust for your architecture (e.g., aarch64-linux)
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_24
          pkgs.pnpm
          pkgs.json-server
        ];
        packages = [
        ];

      };
    };
}
