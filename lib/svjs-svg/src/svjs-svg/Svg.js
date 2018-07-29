"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Author: shaack
 * Date: 23.11.2017
 */

var SVG_NAMESPACE = "http://www.w3.org/2000/svg";

if (typeof NodeList.prototype.forEach !== "function") {
    // IE
    NodeList.prototype.forEach = Array.prototype.forEach;
}

var Svg = exports.Svg = function () {
    function Svg() {
        _classCallCheck(this, Svg);
    }

    _createClass(Svg, null, [{
        key: "createSvg",


        /**
         * create the Svg in the HTML DOM
         * @param containerElement
         * @returns {Element}
         */
        value: function createSvg() {
            var containerElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var svg = document.createElementNS(SVG_NAMESPACE, "svg");
            if (containerElement) {
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                containerElement.appendChild(svg);
            }
            return svg;
        }

        /**
         * Add an Element to a SVG DOM
         * @param parent
         * @param name
         * @param attributes
         * @returns {Element}
         */

    }, {
        key: "addElement",
        value: function addElement(parent, name, attributes) {
            var element = document.createElementNS(SVG_NAMESPACE, name);
            if (name === "use") {
                attributes["xlink:href"] = attributes["href"]; // fix for safari
            }
            for (var attribute in attributes) {
                if (attribute.indexOf(":") !== -1) {
                    var value = attribute.split(":");
                    element.setAttributeNS("http://www.w3.org/1999/" + value[0], value[1], attributes[attribute]);
                } else {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
            parent.appendChild(element);
            return element;
        }

        /**
         * Remove an Element from a SVG DOM
         * @param element
         */

    }, {
        key: "removeElement",
        value: function removeElement(element) {
            element.parentNode.removeChild(element);
        }

        /**
         * Load sprite into html document (as `svg/defs`), elements can be referenced by `use` from all Svgs in page
         * @param url
         * @param elementIds array of element-ids, relevant for `use` in the svgs
         * @param callback called after successful load, parameter is the svg element
         * @param grid the grid size of the sprite
         */

    }, {
        key: "loadSprite",
        value: function loadSprite(url, elementIds, callback) {
            var _this = this;

            var grid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

            var request = new XMLHttpRequest();
            request.open("GET", url);
            request.send();
            request.onload = function () {
                var response = request.response;
                var parser = new DOMParser();
                var svgDom = parser.parseFromString(response, "image/svg+xml");
                // add relevant nodes to sprite-svg
                var spriteSvg = _this.createSvg(document.body);
                spriteSvg.setAttribute("style", "display: none");
                var defs = _this.addElement(spriteSvg, "defs");
                // filter relevant nodes
                elementIds.forEach(function (elementId) {
                    var elementNode = svgDom.getElementById(elementId);
                    if (!elementNode) {
                        console.error("error, node id=" + elementId + " not found in sprite");
                    } else {
                        var transformList = elementNode.transform.baseVal;
                        for (var i = 0; i < transformList.numberOfItems; i++) {
                            var transform = transformList.getItem(i);
                            // re-transform items on grid
                            if (transform.type === 2) {
                                transform.setTranslate(transform.matrix.e % grid, transform.matrix.f % grid);
                            }
                        }
                        // filter all ids in childs of the node
                        var filterChilds = function filterChilds(childNodes) {
                            childNodes.forEach(function (childNode) {
                                if (childNode.nodeType === Node.ELEMENT_NODE) {
                                    childNode.removeAttribute("id");
                                    if (childNode.hasChildNodes()) {
                                        filterChilds(childNode.childNodes);
                                    }
                                }
                            });
                        };
                        filterChilds(elementNode.childNodes);
                        defs.appendChild(elementNode);
                    }
                });
                callback(spriteSvg);
            };
        }
    }]);

    return Svg;
}();

//# sourceMappingURL=Svg.js.map