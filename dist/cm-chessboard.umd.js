(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Chessboard = {})));
}(this, (function (exports) { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var Svg_1 = createCommonjsModule(function (module, exports) {

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


	});

	unwrapExports(Svg_1);
	var Svg_2 = Svg_1.Svg;

	var ChessboardState_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Author and copyright: Stefan Haack (https://shaack.com)
	 * Repository: https://github.com/shaack/cm-chessboard
	 * License: MIT, see file 'LICENSE'
	 */

	var SQUARE_COORDINATES = exports.SQUARE_COORDINATES = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];

	var ChessboardState = exports.ChessboardState = function () {
	    function ChessboardState() {
	        _classCallCheck(this, ChessboardState);

	        this.squares = new Array(64).fill(null);
	        this.orientation = null;
	        this.markers = [];
	    }

	    _createClass(ChessboardState, [{
	        key: "setPiece",
	        value: function setPiece(index, piece) {
	            this.squares[index] = piece;
	        }
	    }, {
	        key: "addMarker",
	        value: function addMarker(index, type) {
	            this.markers.push({ index: index, type: type });
	        }
	    }, {
	        key: "removeMarkers",
	        value: function removeMarkers() {
	            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            if (index === null && type === null) {
	                this.markers = [];
	            } else {
	                this.markers = this.markers.filter(function (marker) {
	                    if (marker.type === null) {
	                        if (index === marker.index) {
	                            return false;
	                        }
	                    } else if (index === null) {
	                        if (marker.type === type) {
	                            return false;
	                        }
	                    } else if (marker.type === type && index === marker.index) {
	                        return false;
	                    }
	                    return true;
	                });
	            }
	        }
	    }, {
	        key: "setPosition",
	        value: function setPosition(fen) {
	            if (fen) {
	                var parts = fen.replace(/^\s*/, "").replace(/\s*$/, "").split(/\/|\s/);
	                for (var part = 0; part < 8; part++) {
	                    var row = parts[7 - part].replace(/\d/g, function (str) {
	                        var numSpaces = parseInt(str);
	                        var ret = '';
	                        for (var i = 0; i < numSpaces; i++) {
	                            ret += '-';
	                        }
	                        return ret;
	                    });
	                    for (var c = 0; c < 8; c++) {
	                        var char = row.substr(c, 1);
	                        var piece = null;
	                        if (char !== '-') {
	                            if (char.toUpperCase() === char) {
	                                piece = "w" + char.toLowerCase();
	                            } else {
	                                piece = "b" + char;
	                            }
	                        }
	                        this.squares[part * 8 + c] = piece;
	                    }
	                }
	            }
	        }
	    }, {
	        key: "getPosition",
	        value: function getPosition() {
	            var parts = new Array(8).fill("");
	            for (var part = 0; part < 8; part++) {
	                var spaceCounter = 0;
	                for (var i = 0; i < 8; i++) {
	                    var piece = this.squares[part * 8 + i];
	                    if (piece === null) {
	                        spaceCounter++;
	                    } else {
	                        if (spaceCounter > 0) {
	                            parts[7 - part] += spaceCounter;
	                            spaceCounter = 0;
	                        }
	                        var color = piece.substr(0, 1);
	                        var name = piece.substr(1, 1);
	                        if (color === "w") {
	                            parts[7 - part] += name.toUpperCase();
	                        } else {
	                            parts[7 - part] += name;
	                        }
	                    }
	                }
	                if (spaceCounter > 0) {
	                    parts[7 - part] += spaceCounter;
	                    spaceCounter = 0;
	                }
	            }
	            return parts.join("/");
	        }
	    }, {
	        key: "squareToIndex",
	        value: function squareToIndex(square) {
	            var file = square.substr(0, 1).charCodeAt(0) - 97;
	            var rank = square.substr(1, 1) - 1;
	            return 8 * rank + file;
	        }
	    }]);

	    return ChessboardState;
	}();


	});

	unwrapExports(ChessboardState_1);
	var ChessboardState_2 = ChessboardState_1.SQUARE_COORDINATES;
	var ChessboardState_3 = ChessboardState_1.ChessboardState;

	var ChessboardMoveInput_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChessboardMoveInput = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */



	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// circular
	//import {MOVE_INPUT_MODE, MARKER_TYPE} from "./Chessboard.js"
	var MOVE_INPUT_MODE = {
	    viewOnly: 0,
	    dragPiece: 1,
	    dragMarker: 2
	};
	var MARKER_TYPE = {
	    move: { class: "move", slice: "marker1" },
	    emphasize: { class: "emphasize", slice: "marker2" }
	};

	var STATE = {
	    waitForInputStart: 0,
	    pieceClickedThreshold: 1,
	    clickTo: 2,
	    secondClickThreshold: 3,
	    dragTo: 4,
	    clickDragTo: 5,
	    moveDone: 6,
	    reset: 7
	};

	var DRAG_THRESHOLD = 2;

	var ChessboardMoveInput = exports.ChessboardMoveInput = function () {
	    function ChessboardMoveInput(view, state, props, moveStartCallback, moveDoneCallback, moveCanceledCallback) {
	        _classCallCheck(this, ChessboardMoveInput);

	        this.view = view;
	        this.state = state;
	        this.props = props;
	        this.moveStartCallback = moveStartCallback;
	        this.moveDoneCallback = moveDoneCallback;
	        this.moveCanceledCallback = moveCanceledCallback;
	        this.setMoveInputState(STATE.waitForInputStart);
	    }

	    _createClass(ChessboardMoveInput, [{
	        key: "setMoveInputState",
	        value: function setMoveInputState(newState) {
	            var _this = this;

	            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	            // console.log("setMoveInputState", Object.keys(STATE)[this.moveInputState], "=>", Object.keys(STATE)[newState]);

	            var prevState = this.moveInputState;
	            this.moveInputState = newState;

	            switch (newState) {

	                case STATE.waitForInputStart:
	                    break;

	                case STATE.pieceClickedThreshold:
	                    if (STATE.waitForInputStart !== prevState) {
	                        throw new Error("moveInputState");
	                    }
	                    this.startIndex = params.index;
	                    this.endIndex = null;
	                    this.movedPiece = params.piece;
	                    this.updateStartEndMarkers();
	                    this.startPoint = params.point;
	                    if (!this.pointerMoveListener && !this.pointerUpListener) {
	                        if (params.type === "mousedown") {

	                            this.pointerMoveListener = this.onPointerMove.bind(this);
	                            this.pointerMoveListener.type = "mousemove";
	                            window.addEventListener("mousemove", this.pointerMoveListener);

	                            this.pointerUpListener = this.onPointerUp.bind(this);
	                            this.pointerUpListener.type = "mouseup";
	                            window.addEventListener("mouseup", this.pointerUpListener);
	                        } else if (params.type === "touchstart") {

	                            this.pointerMoveListener = this.onPointerMove.bind(this);
	                            this.pointerMoveListener.type = "touchmove";
	                            window.addEventListener("touchmove", this.pointerMoveListener);

	                            this.pointerUpListener = this.onPointerUp.bind(this);
	                            this.pointerUpListener.type = "touchend";
	                            window.addEventListener("touchend", this.pointerUpListener);
	                        } else {
	                            throw Error("event type");
	                        }
	                    } else {
	                        throw Error("_pointerMoveListener or _pointerUpListener");
	                    }
	                    break;

	                case STATE.clickTo:
	                    if (this.dragablePiece) {
	                        Svg_1.Svg.removeElement(this.dragablePiece);
	                        this.dragablePiece = null;
	                    }
	                    if (prevState === STATE.dragTo) {
	                        this.view.setPieceVisibility(params.index);
	                    }
	                    break;

	                case STATE.secondClickThreshold:
	                    if (STATE.clickTo !== prevState) {
	                        throw new Error("moveInputState");
	                    }
	                    this.startPoint = params.point;
	                    break;

	                case STATE.dragTo:
	                    if (STATE.pieceClickedThreshold !== prevState) {
	                        throw new Error("moveInputState");
	                    }
	                    if (this.props.moveInputMode === MOVE_INPUT_MODE.dragPiece) {
	                        this.view.setPieceVisibility(params.index, false);
	                        this.createDragablePiece(params.piece);
	                    }
	                    break;

	                case STATE.clickDragTo:
	                    if (STATE.secondClickThreshold !== prevState) {
	                        throw new Error("moveInputState");
	                    }
	                    if (this.props.moveInputMode === MOVE_INPUT_MODE.dragPiece) {
	                        this.view.setPieceVisibility(params.index, false);
	                        this.createDragablePiece(params.piece);
	                    }
	                    break;

	                case STATE.moveDone:
	                    if ([STATE.dragTo, STATE.clickTo, STATE.clickDragTo].indexOf(prevState) === -1) {
	                        throw new Error("moveInputState");
	                    }
	                    this.endIndex = params.index;
	                    if (this.endIndex && this.moveDoneCallback(this.startIndex, this.endIndex)) {
	                        var prevSquares = this.state.squares.slice(0);
	                        this.state.setPiece(this.startIndex, null);
	                        this.state.setPiece(this.endIndex, this.movedPiece);
	                        if (prevState === STATE.clickTo) {
	                            this.view.animatePieces(prevSquares, this.state.squares.slice(0), function () {
	                                _this.setMoveInputState(STATE.reset);
	                            });
	                        } else {
	                            this.view.drawPieces(this.state.squares);
	                            this.setMoveInputState(STATE.reset);
	                        }
	                    } else {
	                        this.view.drawPiecesDebounced();
	                        this.setMoveInputState(STATE.reset);
	                    }
	                    break;

	                case STATE.reset:
	                    if (this.startIndex && !this.endIndex && this.movedPiece) {
	                        this.state.setPiece(this.startIndex, this.movedPiece);
	                    }
	                    this.startIndex = null;
	                    this.endIndex = null;
	                    this.movedPiece = null;
	                    this.updateStartEndMarkers();
	                    if (this.dragablePiece) {
	                        Svg_1.Svg.removeElement(this.dragablePiece);
	                        this.dragablePiece = null;
	                    }
	                    if (this.pointerMoveListener) {
	                        window.removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
	                        this.pointerMoveListener = null;
	                    }
	                    if (this.pointerUpListener) {
	                        window.removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
	                        this.pointerUpListener = null;
	                    }
	                    this.setMoveInputState(STATE.waitForInputStart);
	                    break;

	                default:
	                    throw Error("moveInputState " + newState);
	            }
	        }
	    }, {
	        key: "createDragablePiece",
	        value: function createDragablePiece(pieceName) {
	            if (this.dragablePiece) {
	                throw Error("dragablePiece exists");
	            }
	            this.dragablePiece = Svg_1.Svg.createSvg(document.body);
	            this.dragablePiece.setAttribute("width", this.view.squareWidth);
	            this.dragablePiece.setAttribute("height", this.view.squareHeight);
	            this.dragablePiece.setAttribute("style", "pointer-events: none");
	            this.dragablePiece.name = pieceName;
	            var piece = Svg_1.Svg.addElement(this.dragablePiece, "use", {
	                href: "#" + pieceName
	            });
	            var scaling = this.view.squareHeight / this.props.sprite.grid;
	            var transformScale = this.dragablePiece.createSVGTransform();
	            transformScale.setScale(scaling, scaling);
	            piece.transform.baseVal.appendItem(transformScale);
	        }
	    }, {
	        key: "moveDragablePiece",
	        value: function moveDragablePiece(x, y) {
	            this.dragablePiece.setAttribute("style", "pointer-events: none; position: absolute; left: " + (x - this.view.squareHeight / 2) + "px; top: " + (y - this.view.squareHeight / 2) + "px");
	        }
	    }, {
	        key: "onPointerDown",
	        value: function onPointerDown(e) {
	            if (e.type === "mousedown" && e.button === 0 || e.type === "touchstart") {
	                var index = e.target.getAttribute("data-index");
	                var pieceElement = this.view.getPiece(index);
	                if (index !== undefined) {
	                    var pieceName = void 0,
	                        color = void 0;
	                    if (pieceElement) {
	                        pieceName = pieceElement.getAttribute("data-piece");
	                        color = pieceName ? pieceName.substr(0, 1) : null;
	                    }
	                    if (this.moveInputState !== STATE.waitForInputStart || this.state.inputWhiteEnabled && color === "w" || this.state.inputBlackEnabled && color === "b") {
	                        var point = void 0;
	                        if (e.type === "mousedown") {
	                            point = { x: e.clientX, y: e.clientY };
	                        } else if (e.type === "touchstart") {
	                            point = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	                        }
	                        if (this.moveInputState === STATE.waitForInputStart && pieceName && this.moveStartCallback(index)) {
	                            this.setMoveInputState(STATE.pieceClickedThreshold, {
	                                index: index,
	                                piece: pieceName,
	                                point: point,
	                                type: e.type
	                            });
	                        } else if (this.moveInputState === STATE.clickTo) {
	                            if (index === this.startIndex) {
	                                this.setMoveInputState(STATE.secondClickThreshold, {
	                                    index: index,
	                                    piece: pieceName,
	                                    point: point,
	                                    type: e.type
	                                });
	                            } else {
	                                this.setMoveInputState(STATE.moveDone, { index: index });
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: "onPointerMove",
	        value: function onPointerMove(e) {
	            var x = void 0,
	                y = void 0,
	                target = void 0;
	            if (e.type === "mousemove") {
	                x = e.pageX;
	                y = e.pageY;
	                target = e.target;
	            } else if (e.type === "touchmove") {
	                x = e.touches[0].pageX;
	                y = e.touches[0].pageY;
	                target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
	            }
	            if (this.moveInputState === STATE.pieceClickedThreshold || this.moveInputState === STATE.secondClickThreshold) {
	                if (Math.abs(this.startPoint.x - x) > DRAG_THRESHOLD || Math.abs(this.startPoint.y - y) > DRAG_THRESHOLD) {
	                    if (this.moveInputState === STATE.secondClickThreshold) {
	                        this.setMoveInputState(STATE.clickDragTo, { index: this.startIndex, piece: this.movedPiece });
	                    } else {
	                        this.setMoveInputState(STATE.dragTo, { index: this.startIndex, piece: this.movedPiece });
	                    }
	                    if (this.props.moveInputMode === MOVE_INPUT_MODE.dragPiece) {
	                        this.moveDragablePiece(x, y);
	                    }
	                }
	            } else if (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo || this.moveInputState === STATE.clickTo) {
	                if (target && target.getAttribute && target.parentElement === this.view.boardGroup) {
	                    var index = target.getAttribute("data-index");
	                    if (index !== this.startIndex && index !== this.endIndex) {
	                        this.endIndex = index;
	                        this.updateStartEndMarkers();
	                    } else if (index === this.startIndex && this.endIndex !== null) {
	                        this.endIndex = null;
	                        this.updateStartEndMarkers();
	                    }
	                } else {
	                    this.endIndex = null;
	                    this.updateStartEndMarkers();
	                }
	                if (this.props.moveInputMode === MOVE_INPUT_MODE.dragPiece && (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo)) {
	                    this.moveDragablePiece(x, y);
	                }
	            }
	        }
	    }, {
	        key: "onPointerUp",
	        value: function onPointerUp(e) {
	            var x = void 0,
	                y = void 0,
	                target = void 0;
	            if (e.type === "mouseup") {
	                target = e.target;
	            } else if (e.type === "touchend") {
	                x = e.changedTouches[0].clientX;
	                y = e.changedTouches[0].clientY;
	                target = document.elementFromPoint(x, y);
	            }
	            if (target && target.getAttribute) {
	                var index = target.getAttribute("data-index");

	                if (index) {
	                    if (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo) {
	                        if (this.startIndex === index) {
	                            if (this.moveInputState === STATE.clickDragTo) {
	                                this.state.setPiece(this.startIndex, this.movedPiece);
	                                this.view.setPieceVisibility(this.startIndex);
	                                this.setMoveInputState(STATE.reset);
	                            } else {
	                                this.setMoveInputState(STATE.clickTo, { index: index });
	                            }
	                        } else {
	                            this.setMoveInputState(STATE.moveDone, { index: index });
	                        }
	                    } else if (this.moveInputState === STATE.pieceClickedThreshold) {
	                        this.setMoveInputState(STATE.clickTo, { index: index });
	                    } else if (this.moveInputState === STATE.secondClickThreshold) {
	                        this.setMoveInputState(STATE.reset);
	                        this.moveCanceledCallback();
	                    }
	                } else {
	                    this.view.drawPiecesDebounced();
	                    this.setMoveInputState(STATE.reset);
	                    this.moveCanceledCallback();
	                }
	            } else {
	                this.view.drawPiecesDebounced();
	                this.setMoveInputState(STATE.reset);
	            }
	        }
	    }, {
	        key: "updateStartEndMarkers",
	        value: function updateStartEndMarkers() {
	            this.state.removeMarkers(null, MARKER_TYPE.move);
	            if (this.startIndex) {
	                this.state.addMarker(this.startIndex, MARKER_TYPE.move);
	            }
	            if (this.endIndex) {
	                this.state.addMarker(this.endIndex, MARKER_TYPE.move);
	            }
	            this.view.drawMarkersDebounced();
	        }
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            this.setMoveInputState(STATE.reset);
	        }
	    }]);

	    return ChessboardMoveInput;
	}();


	});

	unwrapExports(ChessboardMoveInput_1);
	var ChessboardMoveInput_2 = ChessboardMoveInput_1.ChessboardMoveInput;

	var ChessboardPiecesAnimation_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Author and copyright: Stefan Haack (https://shaack.com)
	 * Repository: https://github.com/shaack/cm-chessboard
	 * License: MIT, see file 'LICENSE'
	 */

	var CHANGE_TYPE = {
	    move: 0,
	    appear: 1,
	    disappear: 2
	};

	function AnimationRunningException() {}

	var ChessboardPiecesAnimation = exports.ChessboardPiecesAnimation = function () {
	    function ChessboardPiecesAnimation(view, fromSquares, toSquares, duration, callback) {
	        _classCallCheck(this, ChessboardPiecesAnimation);

	        this.view = view;
	        if (this.view.animationRunning) {
	            throw new AnimationRunningException();
	        }
	        if (fromSquares && toSquares) {
	            this.animatedElements = this.createAnimation(fromSquares, toSquares);
	            this.duration = duration;
	            this.callback = callback;
	            this.view.animationRunning = true;
	            this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
	        }
	    }

	    _createClass(ChessboardPiecesAnimation, [{
	        key: "seekChanges",
	        value: function seekChanges(fromSquares, toSquares) {
	            var _this = this;

	            var appearedList = [],
	                disappearedList = [],
	                changes = [];
	            for (var i = 0; i < 64; i++) {
	                var previousSquare = fromSquares[i];
	                var newSquare = toSquares[i];
	                if (newSquare !== previousSquare) {
	                    if (newSquare) {
	                        appearedList.push({ piece: newSquare, index: i });
	                    }
	                    if (previousSquare) {
	                        disappearedList.push({ piece: previousSquare, index: i });
	                    }
	                }
	            }
	            appearedList.forEach(function (appeared) {
	                var shortestDistance = 8;
	                var foundMoved = null;
	                disappearedList.forEach(function (disappeared) {
	                    if (appeared.piece === disappeared.piece) {
	                        var moveDistance = _this.squareDistance(appeared.index, disappeared.index);
	                        if (moveDistance < shortestDistance) {
	                            foundMoved = disappeared;
	                            shortestDistance = moveDistance;
	                        }
	                    }
	                });
	                if (foundMoved) {
	                    disappearedList.splice(disappearedList.indexOf(foundMoved), 1); // remove from disappearedList, because it is moved now
	                    changes.push({
	                        type: CHANGE_TYPE.move,
	                        piece: appeared.piece,
	                        atIndex: foundMoved.index,
	                        toIndex: appeared.index
	                    });
	                } else {
	                    changes.push({ type: CHANGE_TYPE.appear, piece: appeared.piece, atIndex: appeared.index });
	                }
	            });
	            disappearedList.forEach(function (disappeared) {
	                changes.push({ type: CHANGE_TYPE.disappear, piece: disappeared.piece, atIndex: disappeared.index });
	            });
	            return changes;
	        }
	    }, {
	        key: "createAnimation",
	        value: function createAnimation(fromSquares, toSquares) {
	            var _this2 = this;

	            var changes = this.seekChanges(fromSquares, toSquares);
	            var animatedElements = [];
	            changes.forEach(function (change) {
	                var animatedItem = {
	                    type: change.type
	                };
	                switch (change.type) {
	                    case CHANGE_TYPE.move:
	                        animatedItem.element = _this2.view.getPiece(change.atIndex);
	                        animatedItem.atPoint = _this2.view.squareIndexToPoint(change.atIndex);
	                        animatedItem.toPoint = _this2.view.squareIndexToPoint(change.toIndex);
	                        break;
	                    case CHANGE_TYPE.appear:
	                        animatedItem.element = _this2.view.drawPiece(change.atIndex, change.piece);
	                        animatedItem.element.style.opacity = 0;
	                        break;
	                    case CHANGE_TYPE.disappear:
	                        animatedItem.element = _this2.view.getPiece(change.atIndex);
	                        break;
	                }
	                animatedElements.push(animatedItem);
	            });
	            return animatedElements;
	        }
	    }, {
	        key: "animationStep",
	        value: function animationStep(time) {
	            var _this3 = this;

	            if (!this.startTime) {
	                this.startTime = time;
	            }
	            var timeDiff = time - this.startTime;
	            if (timeDiff <= this.duration) {
	                this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
	            } else {
	                cancelAnimationFrame(this.frameHandle);
	                this.view.animationRunning = false;
	                this.callback();
	            }
	            var t = Math.min(1, timeDiff / this.duration);
	            var progress = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
	            this.animatedElements.forEach(function (animatedItem) {
	                if (animatedItem.element) {
	                    switch (animatedItem.type) {
	                        case CHANGE_TYPE.move:
	                            animatedItem.element.transform.baseVal.removeItem(0);
	                            var transform = _this3.view.svg.createSVGTransform();
	                            transform.setTranslate(animatedItem.atPoint.x + (animatedItem.toPoint.x - animatedItem.atPoint.x) * progress, animatedItem.atPoint.y + (animatedItem.toPoint.y - animatedItem.atPoint.y) * progress);
	                            animatedItem.element.transform.baseVal.appendItem(transform);
	                            break;
	                        case CHANGE_TYPE.appear:
	                            animatedItem.element.style.opacity = progress;
	                            break;
	                        case CHANGE_TYPE.disappear:
	                            animatedItem.element.style.opacity = 1 - progress;
	                            break;
	                    }
	                } else {
	                    console.warn("animatedItem has no element", animatedItem);
	                }
	            });
	        }
	    }, {
	        key: "squareDistance",
	        value: function squareDistance(index1, index2) {
	            var file1 = index1 % 8;
	            var rank1 = Math.floor(index1 / 8);
	            var file2 = index2 % 8;
	            var rank2 = Math.floor(index2 / 8);
	            return Math.max(Math.abs(rank2 - rank1), Math.abs(file2 - file1));
	        }
	    }]);

	    return ChessboardPiecesAnimation;
	}();


	});

	unwrapExports(ChessboardPiecesAnimation_1);
	var ChessboardPiecesAnimation_2 = ChessboardPiecesAnimation_1.ChessboardPiecesAnimation;

	var ChessboardView_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ChessboardView = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	//this a circular 
	//import {COLOR, MOVE_INPUT_MODE, INPUT_EVENT_TYPE} from "./Chessboard.js"










	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SPRITE_LOADING_STATUS = {
	    notLoaded: 1,
	    loading: 2,
	    loaded: 3

	    // kludge: redefined -- see above
	};var COLOR = {
	    white: "w",
	    black: "b"
	};
	var MOVE_INPUT_MODE = {
	    viewOnly: 0,
	    dragPiece: 1,
	    dragMarker: 2
	};
	var INPUT_EVENT_TYPE = {
	    moveStart: "moveStart",
	    moveDone: "moveDone",
	    moveCanceled: "moveCanceled",
	    context: "context"
	};

	var ChessboardView = exports.ChessboardView = function () {
	    function ChessboardView(chessboard, callbackAfterCreation) {
	        var _this = this;

	        _classCallCheck(this, ChessboardView);

	        this.animationRunning = false;
	        this.currentAnimation = null;
	        this.chessboard = chessboard;
	        this.spriteLoadWaitingTries = 0;
	        this.loadSprite(chessboard.props, function () {
	            _this.spriteLoadWaitDelay = 0;
	            _this.moveInput = new ChessboardMoveInput_1.ChessboardMoveInput(_this, chessboard.state, chessboard.props, _this.moveStartCallback.bind(_this), _this.moveDoneCallback.bind(_this), _this.moveCanceledCallback.bind(_this));
	            _this.animationQueue = [];
	            if (chessboard.props.responsive) {
	                _this.resizeListener = _this.handleResize.bind(_this);
	                window.addEventListener("resize", _this.resizeListener);
	            }
	            if (chessboard.props.moveInputMode !== MOVE_INPUT_MODE.viewOnly) {
	                _this.pointerDownListener = _this.pointerDownHandler.bind(_this);
	                _this.chessboard.element.addEventListener("mousedown", _this.pointerDownListener);
	                _this.chessboard.element.addEventListener("touchstart", _this.pointerDownListener);
	            }
	            _this.createSvgAndGroups();
	            _this.updateMetrics();
	            callbackAfterCreation();
	        });
	    }

	    _createClass(ChessboardView, [{
	        key: "pointerDownHandler",
	        value: function pointerDownHandler(e) {
	            e.preventDefault();
	            this.moveInput.onPointerDown(e);
	        }
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            this.moveInput.destroy();
	            window.removeEventListener('resize', this.resizeListener);
	            this.chessboard.element.removeEventListener("mousedown", this.pointerDownListener);
	            this.chessboard.element.removeEventListener("touchstart", this.pointerDownListener);
	            window.clearTimeout(this.resizeDebounce);
	            window.clearTimeout(this.redrawDebounce);
	            window.clearTimeout(this.drawPiecesDebounce);
	            window.clearTimeout(this.drawMarkersDebounce);
	            Svg_1.Svg.removeElement(this.svg);
	            this.animationQueue = [];
	            if (this.currentAnimation) {
	                cancelAnimationFrame(this.currentAnimation.frameHandle);
	            }
	        }

	        // Sprite //

	    }, {
	        key: "loadSprite",
	        value: function loadSprite(props, callback) {
	            var _this2 = this;

	            if (ChessboardView.spriteLoadingStatus === SPRITE_LOADING_STATUS.notLoaded) {
	                ChessboardView.spriteLoadingStatus = SPRITE_LOADING_STATUS.loading;
	                Svg_1.Svg.loadSprite(props.sprite.url, ["wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp", "marker1", "marker2"], function () {
	                    ChessboardView.spriteLoadingStatus = SPRITE_LOADING_STATUS.loaded;
	                    callback();
	                }, props.sprite.grid);
	            } else if (ChessboardView.spriteLoadingStatus === SPRITE_LOADING_STATUS.loading) {
	                setTimeout(function () {
	                    _this2.spriteLoadWaitingTries++;
	                    if (_this2.spriteLoadWaitingTries < 50) {
	                        _this2.loadSprite(props, callback);
	                    } else {
	                        console.error("timeout loading sprite", props.sprite.url);
	                    }
	                }, this.spriteLoadWaitDelay);
	                this.spriteLoadWaitDelay += 10;
	            } else if (ChessboardView.spriteLoadingStatus === SPRITE_LOADING_STATUS.loaded) {
	                callback();
	            } else {
	                console.error("error ChessboardView.spriteLoadingStatus", ChessboardView.spriteLoadingStatus);
	            }
	        }

	        // Draw //

	    }, {
	        key: "createSvgAndGroups",
	        value: function createSvgAndGroups() {
	            if (this.svg) {
	                Svg_1.Svg.removeElement(this.svg);
	            }
	            this.svg = Svg_1.Svg.createSvg(this.chessboard.element);
	            var cssClass = this.chessboard.props.style.cssClass ? this.chessboard.props.style.cssClass : "default";
	            if (this.chessboard.props.style.showBorder) {
	                this.svg.setAttribute("class", "cm-chessboard has-border " + cssClass);
	            } else {
	                this.svg.setAttribute("class", "cm-chessboard " + cssClass);
	            }
	            this.updateMetrics();
	            this.boardGroup = Svg_1.Svg.addElement(this.svg, "g", { class: "board" });
	            this.coordinatesGroup = Svg_1.Svg.addElement(this.svg, "g", { class: "coordinates" });
	            this.markersGroup = Svg_1.Svg.addElement(this.svg, "g", { class: "markers" });
	            this.piecesGroup = Svg_1.Svg.addElement(this.svg, "g", { class: "pieces" });
	        }
	    }, {
	        key: "updateMetrics",
	        value: function updateMetrics() {
	            this.width = this.chessboard.element.offsetWidth;
	            this.height = this.chessboard.element.offsetHeight;
	            if (this.chessboard.props.style.showBorder) {
	                this.borderSize = this.width / 32;
	            } else {
	                this.borderSize = this.width / 320;
	            }
	            this.innerWidth = this.width - 2 * this.borderSize;
	            this.innerHeight = this.height - 2 * this.borderSize;
	            this.squareWidth = this.innerWidth / 8;
	            this.squareHeight = this.innerHeight / 8;
	            this.scalingX = this.squareWidth / this.chessboard.props.sprite.grid;
	            this.scalingY = this.squareHeight / this.chessboard.props.sprite.grid;
	            this.pieceXTranslate = this.squareWidth / 2 - this.chessboard.props.sprite.grid * this.scalingY / 2;
	        }
	    }, {
	        key: "handleResize",
	        value: function handleResize() {
	            var _this3 = this;

	            window.clearTimeout(this.resizeDebounce);
	            this.resizeDebounce = setTimeout(function () {
	                if (_this3.chessboard.element.offsetWidth !== _this3.width || _this3.chessboard.element.offsetHeight !== _this3.height) {
	                    _this3.updateMetrics();
	                    _this3.redraw();
	                }
	            });
	        }
	    }, {
	        key: "redraw",
	        value: function redraw() {
	            var _this4 = this;

	            return new Promise(function (resolve) {
	                window.clearTimeout(_this4.redrawDebounce);
	                _this4.redrawDebounce = setTimeout(function () {
	                    _this4.drawBoard();
	                    _this4.drawCoordinates();
	                    _this4.drawMarkers();
	                    _this4.setCursor();
	                });
	                _this4.drawPiecesDebounced(_this4.chessboard.state.squares, function () {
	                    resolve();
	                });
	            });
	        }

	        // Board //

	    }, {
	        key: "drawBoard",
	        value: function drawBoard() {
	            while (this.boardGroup.firstChild) {
	                this.boardGroup.removeChild(this.boardGroup.lastChild);
	            }
	            var boardBorder = Svg_1.Svg.addElement(this.boardGroup, "rect", { width: this.width, height: this.height });
	            boardBorder.setAttribute("class", "border");
	            if (this.chessboard.props.style.showBorder) {
	                var innerPos = this.borderSize - this.borderSize / 9;
	                var borderInner = Svg_1.Svg.addElement(this.boardGroup, "rect", {
	                    x: innerPos,
	                    y: innerPos,
	                    width: this.width - innerPos * 2,
	                    height: this.height - innerPos * 2
	                });
	                borderInner.setAttribute("class", "border-inner");
	            }
	            for (var i = 0; i < 64; i++) {
	                var index = this.chessboard.state.orientation === COLOR.white ? i : 63 - i;
	                var squareColor = (9 * index & 8) === 0 ? 'black' : 'white';
	                var fieldClass = "square " + squareColor;
	                var point = this.squareIndexToPoint(index);
	                var squareRect = Svg_1.Svg.addElement(this.boardGroup, "rect", {
	                    x: point.x, y: point.y, width: this.squareWidth, height: this.squareHeight
	                });
	                squareRect.setAttribute("class", fieldClass);
	                squareRect.setAttribute("data-index", "" + index);
	            }
	        }
	    }, {
	        key: "drawCoordinates",
	        value: function drawCoordinates() {
	            if (!this.chessboard.props.style.showCoordinates) {
	                return;
	            }
	            while (this.coordinatesGroup.firstChild) {
	                this.coordinatesGroup.removeChild(this.coordinatesGroup.lastChild);
	            }
	            var inline = !this.chessboard.props.style.showBorder;
	            for (var file = 0; file < 8; file++) {
	                var x = this.borderSize + (18 + this.chessboard.props.sprite.grid * file) * this.scalingX;
	                var y = this.height - this.scalingY * 2.6;
	                var cssClass = "coordinate file";
	                if (inline) {
	                    x = x + this.scalingX * 15.5;
	                    if (this.chessboard.props.style.showBorder) {
	                        y = y - this.scalingY * 11;
	                    }
	                    cssClass += file % 2 ? " dark" : " light";
	                }
	                var textElement = Svg_1.Svg.addElement(this.coordinatesGroup, "text", {
	                    class: cssClass,
	                    x: x,
	                    y: y,
	                    style: "font-size: " + this.scalingY * 8 + "px"
	                });
	                if (this.chessboard.state.orientation === COLOR.white) {
	                    textElement.textContent = String.fromCharCode(97 + file);
	                } else {
	                    textElement.textContent = String.fromCharCode(104 - file);
	                }
	            }
	            for (var rank = 0; rank < 8; rank++) {
	                var _x = this.borderSize / 3.7;
	                var _y = this.borderSize + 24 * this.scalingY + rank * this.squareHeight;
	                var _cssClass = "coordinate rank";
	                if (inline) {
	                    _cssClass += rank % 2 ? " light" : " dark";
	                    if (this.chessboard.props.style.showBorder) {
	                        _x = _x + this.scalingX * 10;
	                        _y = _y - this.scalingY * 15;
	                    } else {
	                        _x = _x + this.scalingX * 2;
	                        _y = _y - this.scalingY * 15;
	                    }
	                }
	                var _textElement = Svg_1.Svg.addElement(this.coordinatesGroup, "text", {
	                    class: _cssClass,
	                    x: _x,
	                    y: _y,
	                    style: "font-size: " + this.scalingY * 8 + "px"
	                });
	                if (this.chessboard.state.orientation === COLOR.white) {
	                    _textElement.textContent = 8 - rank;
	                } else {
	                    _textElement.textContent = 1 + rank;
	                }
	            }
	        }

	        // Pieces //

	    }, {
	        key: "drawPiecesDebounced",
	        value: function drawPiecesDebounced() {
	            var _this5 = this;

	            var squares = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.chessboard.state.squares;
	            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            window.clearTimeout(this.drawPiecesDebounce);
	            this.drawPiecesDebounce = setTimeout(function () {
	                _this5.drawPieces(squares);
	                if (callback) {
	                    callback();
	                }
	            });
	        }
	    }, {
	        key: "drawPieces",
	        value: function drawPieces() {
	            var squares = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.chessboard.state.squares;

	            while (this.piecesGroup.firstChild) {
	                this.piecesGroup.removeChild(this.piecesGroup.lastChild);
	            }
	            for (var i = 0; i < 64; i++) {
	                var pieceName = squares[i];
	                if (pieceName) {
	                    this.drawPiece(i, pieceName);
	                }
	            }
	        }
	    }, {
	        key: "drawPiece",
	        value: function drawPiece(index, pieceName) {
	            var pieceGroup = Svg_1.Svg.addElement(this.piecesGroup, "g");
	            pieceGroup.setAttribute("data-piece", pieceName);
	            pieceGroup.setAttribute("data-index", index);
	            var point = this.squareIndexToPoint(index);
	            var transform = this.svg.createSVGTransform();
	            transform.setTranslate(point.x, point.y);
	            pieceGroup.transform.baseVal.appendItem(transform);
	            var pieceUse = Svg_1.Svg.addElement(pieceGroup, "use", { "href": "#" + pieceName, "class": "piece" });
	            // center on square
	            var transformTranslate = this.svg.createSVGTransform();
	            transformTranslate.setTranslate(this.pieceXTranslate, 0);
	            pieceUse.transform.baseVal.appendItem(transformTranslate);
	            // scale
	            var transformScale = this.svg.createSVGTransform();
	            transformScale.setScale(this.scalingY, this.scalingY);
	            pieceUse.transform.baseVal.appendItem(transformScale);
	            return pieceGroup;
	        }
	    }, {
	        key: "setPieceVisibility",
	        value: function setPieceVisibility(index) {
	            var visible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	            var piece = this.getPiece(index);
	            if (visible) {
	                piece.setAttribute("visibility", "visible");
	            } else {
	                piece.setAttribute("visibility", "hidden");
	            }
	        }
	    }, {
	        key: "getPiece",
	        value: function getPiece(index) {
	            return this.piecesGroup.querySelector("g[data-index='" + index + "']");
	        }

	        // Markers //

	    }, {
	        key: "drawMarkersDebounced",
	        value: function drawMarkersDebounced() {
	            var _this6 = this;

	            window.clearTimeout(this.drawMarkersDebounce);
	            this.drawMarkersDebounce = setTimeout(function () {
	                _this6.drawMarkers();
	            }, 10);
	        }
	    }, {
	        key: "drawMarkers",
	        value: function drawMarkers() {
	            var _this7 = this;

	            while (this.markersGroup.firstChild) {
	                this.markersGroup.removeChild(this.markersGroup.firstChild);
	            }
	            this.chessboard.state.markers.forEach(function (marker) {
	                _this7.drawMarker(marker);
	            });
	        }
	    }, {
	        key: "drawMarker",
	        value: function drawMarker(marker) {
	            var markerGroup = Svg_1.Svg.addElement(this.markersGroup, "g");
	            markerGroup.setAttribute("data-index", marker.index);
	            var point = this.squareIndexToPoint(marker.index);
	            var transform = this.svg.createSVGTransform();
	            transform.setTranslate(point.x, point.y);
	            markerGroup.transform.baseVal.appendItem(transform);
	            var markerUse = Svg_1.Svg.addElement(markerGroup, "use", { href: "#" + marker.type.slice, class: "marker " + marker.type.class });
	            var transformScale = this.svg.createSVGTransform();
	            transformScale.setScale(this.scalingX, this.scalingY);
	            markerUse.transform.baseVal.appendItem(transformScale);
	            return markerGroup;
	        }

	        // animation queue //

	    }, {
	        key: "animatePieces",
	        value: function animatePieces(fromSquares, toSquares, callback) {
	            this.animationQueue.push({ fromSquares: fromSquares, toSquares: toSquares, callback: callback });
	            if (!this.animationRunning) {
	                this.nextPieceAnimationInQueue();
	            }
	        }
	    }, {
	        key: "nextPieceAnimationInQueue",
	        value: function nextPieceAnimationInQueue() {
	            var _this8 = this;

	            var nextAnimation = this.animationQueue.shift();
	            if (nextAnimation !== undefined) {
	                this.currentAnimation = new ChessboardPiecesAnimation_1.ChessboardPiecesAnimation(this, nextAnimation.fromSquares, nextAnimation.toSquares, this.chessboard.props.animationDuration / (this.animationQueue.length + 1), function () {
	                    if (!_this8.moveInput.dragablePiece) {
	                        _this8.drawPieces(nextAnimation.toSquares);
	                    }
	                    _this8.nextPieceAnimationInQueue();
	                    if (nextAnimation.callback) {
	                        nextAnimation.callback();
	                    }
	                });
	            }
	        }

	        // Callbacks //

	    }, {
	        key: "moveStartCallback",
	        value: function moveStartCallback(index) {
	            if (this.chessboard.moveInputCallback) {
	                return this.chessboard.moveInputCallback({
	                    chessboard: this.chessboard,
	                    type: INPUT_EVENT_TYPE.moveStart,
	                    square: ChessboardState_1.SQUARE_COORDINATES[index]
	                });
	            } else {
	                return true;
	            }
	        }
	    }, {
	        key: "moveDoneCallback",
	        value: function moveDoneCallback(fromIndex, toIndex) {
	            if (this.chessboard.moveInputCallback) {
	                return this.chessboard.moveInputCallback({
	                    chessboard: this.chessboard,
	                    type: INPUT_EVENT_TYPE.moveDone,
	                    squareFrom: ChessboardState_1.SQUARE_COORDINATES[fromIndex],
	                    squareTo: ChessboardState_1.SQUARE_COORDINATES[toIndex]
	                });
	            } else {
	                return true;
	            }
	        }
	    }, {
	        key: "moveCanceledCallback",
	        value: function moveCanceledCallback() {
	            if (this.chessboard.moveInputCallback) {
	                this.chessboard.moveInputCallback({
	                    chessboard: this.chessboard,
	                    type: INPUT_EVENT_TYPE.moveCanceled
	                });
	            }
	        }

	        // Helpers //

	    }, {
	        key: "setCursor",
	        value: function setCursor() {
	            var _this9 = this;

	            this.chessboard.initialization.then(function () {
	                if (_this9.chessboard.state.inputWhiteEnabled || _this9.chessboard.state.inputBlackEnabled) {
	                    _this9.boardGroup.setAttribute("class", "board input-enabled");
	                } else {
	                    _this9.boardGroup.setAttribute("class", "board");
	                }
	            });
	        }
	    }, {
	        key: "squareIndexToPoint",
	        value: function squareIndexToPoint(index) {
	            var x = void 0,
	                y = void 0;
	            if (this.chessboard.state.orientation === COLOR.white) {
	                x = this.borderSize + index % 8 * this.squareWidth;
	                y = this.borderSize + (7 - Math.floor(index / 8)) * this.squareHeight;
	            } else {
	                x = this.borderSize + (7 - index % 8) * this.squareWidth;
	                y = this.borderSize + Math.floor(index / 8) * this.squareHeight;
	            }
	            return { x: x, y: y };
	        }
	    }]);

	    return ChessboardView;
	}();

	ChessboardView.spriteLoadingStatus = SPRITE_LOADING_STATUS.notLoaded;


	});

	unwrapExports(ChessboardView_1);
	var ChessboardView_2 = ChessboardView_1.ChessboardView;

	var Chessboard_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Chessboard = exports.FEN_EMPTY_POSITION = exports.FEN_START_POSITION = exports.PIECE = exports.MARKER_TYPE = exports.INPUT_EVENT_TYPE = exports.MOVE_INPUT_MODE = exports.COLOR = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */





	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var COLOR = exports.COLOR = {
	    white: "w",
	    black: "b"
	};
	var MOVE_INPUT_MODE = exports.MOVE_INPUT_MODE = {
	    viewOnly: 0,
	    dragPiece: 1,
	    dragMarker: 2
	};
	var INPUT_EVENT_TYPE = exports.INPUT_EVENT_TYPE = {
	    moveStart: "moveStart",
	    moveDone: "moveDone",
	    moveCanceled: "moveCanceled",
	    context: "context"
	};
	var MARKER_TYPE = exports.MARKER_TYPE = {
	    move: { class: "move", slice: "marker1" },
	    emphasize: { class: "emphasize", slice: "marker2" }
	};
	var PIECE = exports.PIECE = {
	    whitePawn: "wp",
	    whiteBishop: "wb",
	    whiteKnight: "wn",
	    whiteRook: "wr",
	    whiteQueen: "wq",
	    whiteKing: "wk",
	    blackPawn: "bp",
	    blackBishop: "bb",
	    blackKnight: "bn",
	    blackRook: "br",
	    blackQueen: "bq",
	    blackKing: "bk"
	};
	var FEN_START_POSITION = exports.FEN_START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	var FEN_EMPTY_POSITION = exports.FEN_EMPTY_POSITION = "8/8/8/8/8/8/8/8";

	var DEFAULT_SPRITE_GRID = 40;

	var Chessboard = exports.Chessboard = function () {
	    function Chessboard(element) {
	        var _this = this;

	        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	        _classCallCheck(this, Chessboard);

	        this.element = element;
	        this.props = {
	            position: "empty", // set as fen, "start" or "empty"
	            orientation: COLOR.white, // white on bottom
	            style: {
	                cssClass: "default",
	                showCoordinates: true, // show ranks and files
	                showBorder: false // display a border around the board
	            },
	            responsive: false, // resizes the board on window resize, if true
	            animationDuration: 300, // pieces animation duration in milliseconds
	            moveInputMode: MOVE_INPUT_MODE.viewOnly, // set to MOVE_INPUT_MODE.dragPiece or MOVE_INPUT_MODE.dragMarker for interactive movement
	            sprite: {
	                url: "./assets/images/chessboard-sprite.svg", // pieces and markers are stored es svg in the sprite
	                grid: DEFAULT_SPRITE_GRID // the sprite is tiled with one piece every 40px
	            }
	        };
	        Object.assign(this.props, props);
	        if (!this.props.sprite.grid) {
	            this.props.sprite.grid = DEFAULT_SPRITE_GRID;
	        }
	        this.state = new ChessboardState_1.ChessboardState();
	        this.state.orientation = this.props.orientation;
	        this.initialization = new Promise(function (resolve) {
	            _this.view = new ChessboardView_1.ChessboardView(_this, function () {
	                if (_this.props.position === "start") {
	                    _this.state.setPosition(FEN_START_POSITION);
	                } else if (_this.props.position === "empty" || _this.props.position === null) {
	                    _this.state.setPosition(FEN_EMPTY_POSITION);
	                } else {
	                    _this.state.setPosition(_this.props.position);
	                }
	                setTimeout(function () {
	                    _this.view.redraw().then(function () {
	                        resolve();
	                    });
	                });
	            });
	        }).then(function () {
	            if (callback) {
	                console.warn("warning: the constructor callback is deprecated and will be removed in future versions");
	                callback(_this);
	            }
	        });
	    }

	    // API //

	    _createClass(Chessboard, [{
	        key: "setPiece",
	        value: function setPiece(square, piece) {
	            var _this2 = this;

	            return new Promise(function (resolve) {
	                _this2.initialization.then(function () {
	                    _this2.state.setPiece(_this2.state.squareToIndex(square), piece);
	                    _this2.view.drawPiecesDebounced(_this2.state.squares, function () {
	                        resolve();
	                    });
	                });
	            });
	        }
	    }, {
	        key: "getPiece",
	        value: function getPiece(square) {
	            return this.state.squares[this.state.squareToIndex(square)];
	        }
	    }, {
	        key: "setPosition",
	        value: function setPosition(fen) {
	            var _this3 = this;

	            var animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	            return new Promise(function (resolve) {
	                _this3.initialization.then(function () {
	                    var currentFen = _this3.state.getPosition();
	                    var fenParts = fen.split(" ");
	                    var fenNormalized = fenParts[0];
	                    if (fenNormalized !== currentFen) {
	                        var prevSquares = _this3.state.squares.slice(0); // clone
	                        if (fen === "start") {
	                            _this3.state.setPosition(FEN_START_POSITION);
	                        } else if (fen === "empty" || fen === null) {
	                            _this3.state.setPosition(FEN_EMPTY_POSITION);
	                        } else {
	                            _this3.state.setPosition(fen);
	                        }
	                        if (animated) {
	                            _this3.view.animatePieces(prevSquares, _this3.state.squares.slice(0), function () {
	                                resolve();
	                            });
	                        } else {
	                            _this3.view.drawPiecesDebounced();
	                            resolve();
	                        }
	                    } else {
	                        resolve();
	                    }
	                });
	            });
	        }
	    }, {
	        key: "getPosition",
	        value: function getPosition() {
	            return this.state.getPosition();
	        }
	    }, {
	        key: "addMarker",
	        value: function addMarker(square) {
	            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MARKER_TYPE.emphasize;

	            this.state.addMarker(this.state.squareToIndex(square), type);
	            this.view.drawMarkersDebounced();
	        }
	    }, {
	        key: "getMarkers",
	        value: function getMarkers() {
	            var square = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            var markersFound = [];
	            this.state.markers.forEach(function (marker) {
	                var markerSquare = ChessboardState_1.SQUARE_COORDINATES[marker.index];
	                if (square === null && (type === null || type === marker.type) || type === null && square === markerSquare || type === marker.type && square === markerSquare) {
	                    markersFound.push({ square: ChessboardState_1.SQUARE_COORDINATES[marker.index], type: marker.type });
	                }
	            });
	            return markersFound;
	        }
	    }, {
	        key: "removeMarkers",
	        value: function removeMarkers() {
	            var square = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            var index = square !== null ? this.state.squareToIndex(square) : null;
	            this.state.removeMarkers(index, type);
	            this.view.drawMarkersDebounced();
	        }
	    }, {
	        key: "setOrientation",
	        value: function setOrientation(color) {
	            this.state.orientation = color;
	            this.view.redraw();
	        }
	    }, {
	        key: "getOrientation",
	        value: function getOrientation() {
	            return this.state.orientation;
	        }
	    }, {
	        key: "destroy",
	        value: function destroy() {
	            var _this4 = this;

	            return new Promise(function (resolve) {
	                _this4.initialization.then(function () {
	                    _this4.view.destroy();
	                    _this4.view = null;
	                    _this4.state = null;
	                    _this4.element.removeEventListener("contextmenu", _this4.contextMenuListener);
	                    resolve();
	                });
	            });
	        }
	    }, {
	        key: "enableMoveInput",
	        value: function enableMoveInput(eventHandler) {
	            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	            if (this.props.moveInputMode === MOVE_INPUT_MODE.viewOnly) {
	                throw Error("props.moveInputMode is MOVE_INPUT_MODE.viewOnly");
	            }
	            if (color === COLOR.white) {
	                this.state.inputWhiteEnabled = true;
	            } else if (color === COLOR.black) {
	                this.state.inputBlackEnabled = true;
	            } else {
	                this.state.inputWhiteEnabled = true;
	                this.state.inputBlackEnabled = true;
	            }
	            this.moveInputCallback = eventHandler;
	            this.view.setCursor();
	        }
	    }, {
	        key: "disableMoveInput",
	        value: function disableMoveInput() {
	            this.state.inputWhiteEnabled = false;
	            this.state.inputBlackEnabled = false;
	            this.moveInputCallback = null;
	            this.view.setCursor();
	        }
	    }, {
	        key: "enableContextInput",
	        value: function enableContextInput(eventHandler) {
	            if (this.contextMenuListener) {
	                console.warn("contextMenuListener already existing");
	                return;
	            }
	            this.contextMenuListener = function (e) {
	                e.preventDefault();
	                var index = e.target.getAttribute("data-index");
	                eventHandler({
	                    chessboard: this,
	                    type: INPUT_EVENT_TYPE.context,
	                    square: ChessboardState_1.SQUARE_COORDINATES[index]
	                });
	            };

	            this.element.addEventListener("contextmenu", this.contextMenuListener);
	        }

	        // noinspection JSUnusedGlobalSymbols

	    }, {
	        key: "disableContextInput",
	        value: function disableContextInput() {
	            this.element.removeEventListener("contextmenu", this.contextMenuListener);
	        }
	    }]);

	    return Chessboard;
	}();


	});

	var Chessboard = unwrapExports(Chessboard_1);
	var Chessboard_2 = Chessboard_1.Chessboard;
	var Chessboard_3 = Chessboard_1.FEN_EMPTY_POSITION;
	var Chessboard_4 = Chessboard_1.FEN_START_POSITION;
	var Chessboard_5 = Chessboard_1.PIECE;
	var Chessboard_6 = Chessboard_1.MARKER_TYPE;
	var Chessboard_7 = Chessboard_1.INPUT_EVENT_TYPE;
	var Chessboard_8 = Chessboard_1.MOVE_INPUT_MODE;
	var Chessboard_9 = Chessboard_1.COLOR;

	exports.default = Chessboard;
	exports.Chessboard = Chessboard_2;
	exports.FEN_EMPTY_POSITION = Chessboard_3;
	exports.FEN_START_POSITION = Chessboard_4;
	exports.PIECE = Chessboard_5;
	exports.MARKER_TYPE = Chessboard_6;
	exports.INPUT_EVENT_TYPE = Chessboard_7;
	exports.MOVE_INPUT_MODE = Chessboard_8;
	exports.COLOR = Chessboard_9;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
