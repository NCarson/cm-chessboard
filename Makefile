# beginning based on this gist:
# https://gist.github.com/hallettj/29b8e7815b264c88a0a0ee9dcddb6210

# good stuff on cdn browserify
# https://shinglyu.github.io/web/2018/02/08/minimal-react-js-without-a-build-step-updated.html
 
# these should be installed globally
BABEL := babel --presets=es2015
BROWSERIFY := browserify
UGLIFYJS := uglifyjs
NUNJUCKS := nunjucks
GZIP := gzip

# directory strucrue
INDEX_DIR := public
DIST_DIR := ./
TEMPL_DIR := templates
LIB_DIR := lib
SRC_DIR := src

TARGET_BUILD := $(DIST_DIR)/index.js

# do not minify if were in dev
ifeq ($(NODE_ENV),"development")
	TARGET := $(TARGET_BUILD)
else
	TARGET := $(DIST_DIR)/index.min.js
endif

TARGETS := $(TARGET)
TARGETS_GZ := $(TARGET).gz

#$(info $(TARGETS))
#$(info $(TARGETS_GZ))
#$(info $(TARGET_BUILD))

# -L follows sysmlinks
SRC_FILES := $(shell find -L $(SRC_DIR)/ -name '*.js')
TRANSPILED_FILES := $(patsubst $(SRC_DIR)/%,lib/%,$(SRC_FILES))
FLOW_FILES := $(patsubst %.js,%.js.flow,$(TRANSPILED_FILES))
COMP_FILES := $(shell find $(INDEX_DIR)/ -name '*.svg')
COMP_FILES_GZ := $(patsubst %.svg,%.svg.gz,$(COMP_FILES))


.PHONY: all clean clean_dist vendor_size
# make the vendor and target bundles
all: $(TARGETS) public/dist/test.js

# remove the build lib and dist files
clean:
	rm $(LIB_DIR)/* -fr
	rm $(TARGET) -f

%.gz: %
	$(GZIP) $< --stdout > $@

public/dist/test.js:
	$(BABEL) test.js --out-file test.js.es5
	$(BROWSERIFY) --transform -d -o public/dist/test.js test.js.es5

.PRECIOUS: %.min.js #make will delete these as 'intermediate' without this
%.min.js: %.js
	$(UGLIFYJS) -cmo $@ $<

$(TARGET_BUILD): $(FLOW_FILES) $(TRANSPILED_FILES)
	$(BROWSERIFY) --transform -d -o $(TARGET_BUILD) $(shell find $(LIB_DIR)/ -name '*.js')

# #XXX this is not doing anything right now
lib/%.js.flow: $(SRC_DIR)/%.js
	mkdir -p $(dir $@)
	cp $< $@

lib/%: src/%
	mkdir -p $(dir $@)
	$(BABEL) $< --out-file $@ --source-maps
