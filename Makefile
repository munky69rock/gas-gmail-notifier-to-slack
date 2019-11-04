init:
	@if [ -z "$(SCRIPT_ID)" ]; then \
		echo ""; \
		echo Specify SCRIPT_ID; \
		echo ""; \
		echo \`SCRIPT_ID=\$$SCRIPT_ID make\`; \
		echo ""; \
		exit 1; \
	fi
	clasp clone $(SCRIPT_ID) --rootDir=./src
	rm ./src/コード.js

.PHONY: init
