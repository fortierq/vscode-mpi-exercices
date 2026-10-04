.PHONY: check release

check:
	nix develop -c npm test

release: check
	nix develop -c npm run package
