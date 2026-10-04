NODE_VERSION ?= 22.13.1
NVM_DIR ?= $(HOME)/.nvm

.PHONY: release

release:
	. "$(NVM_DIR)/nvm.sh" && nvm exec $(NODE_VERSION) npm test
	. "$(NVM_DIR)/nvm.sh" && nvm exec $(NODE_VERSION) npm run package