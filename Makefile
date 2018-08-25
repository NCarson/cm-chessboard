# beginning based on this gist:
# https://gist.github.com/hallettj/29b8e7815b264c88a0a0ee9dcddb6210

# good stuff on cdn browserify
# https://shinglyu.github.io/web/2018/02/08/minimal-react-js-without-a-build-step-updated.html
#
.DELETE_ON_ERROR:
 
# these should be installed globally
BABEL := babel --presets=es2015
BROWSERIFY := browserify
BROWSERIFY_SHIM :=
UGLIFYJS := uglifyjs
NUNJUCKS := nunjucks
GZIP := gzip
LINTER := eslint --parser babel-eslint --plugin react --plugin import

# directory structure
INDEX_DIR := public
DIST_DIR := $(INDEX_DIR)/dist
TEMPL_DIR := templates
LIB_DIR := lib
SRC_DIR := src
DEP_FILE := $(LIB_DIR)/.deps

SRC_FILES := $(shell find $(SRC_DIR)/ -name '*.js')
LIB_FILES := $(patsubst $(SRC_DIR)/%,$(LIB_DIR)/%,$(SRC_FILES))
MIN_FILES := $(patsubst $(LIB_DIR)/%.js,$(LIB_DIR)/%.min.js,$(LIB_FILES))

#libs that should not go in vendor build
BROKEN_LIBS :=

#CDN libs will be excluded from the vender build
# but you have to set them up yourself
CDN_LIBS :=

TARGET := index.js

.PHONY: all clean
all: $(TARGET)

# remove the build lib and dist files
clean:
	rm $(LIB_DIR)/* -fr
	rm $(TARGET) -f

#%.gz: %
#	$(GZIP) $< --stdout > $@

$(TARGET): $(LIB_FILES)
	#$(BROWSERIFY) $(LIB_FILES) --standalone Chessboard > $(TARGET)
	#$(BROWSERIFY) -o $(TARGET) $(LIB_FILES)
	rollup -c

.PRECIOUS: %.min.js #make will delete these as 'intermediate' without this
%.min.js: $(LIB_FILES)
	$(UGLIFYJS) -cmo $@ $<
	cp $< $@

$(LIB_DIR)/%: $(SRC_DIR)/%
	$(LINTER) $<
	mkdir $(dir $@) -p
	$(BABEL) $< --out-file $@ --source-maps

