(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chessboard = exports.FEN_EMPTY_POSITION = exports.FEN_START_POSITION = exports.PIECE = exports.MARKER_TYPE = exports.INPUT_EVENT_TYPE = exports.MOVE_INPUT_MODE = exports.COLOR = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _ChessboardView = require("./ChessboardView.js");

var _ChessboardState = require("./ChessboardState.js");

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
        this.state = new _ChessboardState.ChessboardState();
        this.state.orientation = this.props.orientation;
        this.initialization = new Promise(function (resolve) {
            _this.view = new _ChessboardView.ChessboardView(_this, function () {
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
                var markerSquare = _ChessboardState.SQUARE_COORDINATES[marker.index];
                if (square === null && (type === null || type === marker.type) || type === null && square === markerSquare || type === marker.type && square === markerSquare) {
                    markersFound.push({ square: _ChessboardState.SQUARE_COORDINATES[marker.index], type: marker.type });
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
                    square: _ChessboardState.SQUARE_COORDINATES[index]
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


},{"./ChessboardState.js":4,"./ChessboardView.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChessboardMoveInput = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Svg = require("../svjs-svg/src/svjs-svg/Svg.js");

var _Chessboard = require("./Chessboard.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
                        _Svg.Svg.removeElement(this.dragablePiece);
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
                    if (this.props.moveInputMode === _Chessboard.MOVE_INPUT_MODE.dragPiece) {
                        this.view.setPieceVisibility(params.index, false);
                        this.createDragablePiece(params.piece);
                    }
                    break;

                case STATE.clickDragTo:
                    if (STATE.secondClickThreshold !== prevState) {
                        throw new Error("moveInputState");
                    }
                    if (this.props.moveInputMode === _Chessboard.MOVE_INPUT_MODE.dragPiece) {
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
                        _Svg.Svg.removeElement(this.dragablePiece);
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
            this.dragablePiece = _Svg.Svg.createSvg(document.body);
            this.dragablePiece.setAttribute("width", this.view.squareWidth);
            this.dragablePiece.setAttribute("height", this.view.squareHeight);
            this.dragablePiece.setAttribute("style", "pointer-events: none");
            this.dragablePiece.name = pieceName;
            var piece = _Svg.Svg.addElement(this.dragablePiece, "use", {
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
                    if (this.props.moveInputMode === _Chessboard.MOVE_INPUT_MODE.dragPiece) {
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
                if (this.props.moveInputMode === _Chessboard.MOVE_INPUT_MODE.dragPiece && (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo)) {
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
            this.state.removeMarkers(null, _Chessboard.MARKER_TYPE.move);
            if (this.startIndex) {
                this.state.addMarker(this.startIndex, _Chessboard.MARKER_TYPE.move);
            }
            if (this.endIndex) {
                this.state.addMarker(this.endIndex, _Chessboard.MARKER_TYPE.move);
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


},{"../svjs-svg/src/svjs-svg/Svg.js":6,"./Chessboard.js":1}],3:[function(require,module,exports){
"use strict";

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


},{}],4:[function(require,module,exports){
"use strict";

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


},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChessboardView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Author and copyright: Stefan Haack (https://shaack.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Repository: https://github.com/shaack/cm-chessboard
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * License: MIT, see file 'LICENSE'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Svg = require("../svjs-svg/src/svjs-svg/Svg.js");

var _ChessboardState = require("./ChessboardState.js");

var _ChessboardMoveInput = require("./ChessboardMoveInput.js");

var _Chessboard = require("./Chessboard.js");

var _ChessboardPiecesAnimation = require("./ChessboardPiecesAnimation.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SPRITE_LOADING_STATUS = {
    notLoaded: 1,
    loading: 2,
    loaded: 3
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
            _this.moveInput = new _ChessboardMoveInput.ChessboardMoveInput(_this, chessboard.state, chessboard.props, _this.moveStartCallback.bind(_this), _this.moveDoneCallback.bind(_this), _this.moveCanceledCallback.bind(_this));
            _this.animationQueue = [];
            if (chessboard.props.responsive) {
                _this.resizeListener = _this.handleResize.bind(_this);
                window.addEventListener("resize", _this.resizeListener);
            }
            if (chessboard.props.moveInputMode !== _Chessboard.MOVE_INPUT_MODE.viewOnly) {
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
            _Svg.Svg.removeElement(this.svg);
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
                _Svg.Svg.loadSprite(props.sprite.url, ["wk", "wq", "wr", "wb", "wn", "wp", "bk", "bq", "br", "bb", "bn", "bp", "marker1", "marker2"], function () {
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
                _Svg.Svg.removeElement(this.svg);
            }
            this.svg = _Svg.Svg.createSvg(this.chessboard.element);
            var cssClass = this.chessboard.props.style.cssClass ? this.chessboard.props.style.cssClass : "default";
            if (this.chessboard.props.style.showBorder) {
                this.svg.setAttribute("class", "cm-chessboard has-border " + cssClass);
            } else {
                this.svg.setAttribute("class", "cm-chessboard " + cssClass);
            }
            this.updateMetrics();
            this.boardGroup = _Svg.Svg.addElement(this.svg, "g", { class: "board" });
            this.coordinatesGroup = _Svg.Svg.addElement(this.svg, "g", { class: "coordinates" });
            this.markersGroup = _Svg.Svg.addElement(this.svg, "g", { class: "markers" });
            this.piecesGroup = _Svg.Svg.addElement(this.svg, "g", { class: "pieces" });
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
            var boardBorder = _Svg.Svg.addElement(this.boardGroup, "rect", { width: this.width, height: this.height });
            boardBorder.setAttribute("class", "border");
            if (this.chessboard.props.style.showBorder) {
                var innerPos = this.borderSize - this.borderSize / 9;
                var borderInner = _Svg.Svg.addElement(this.boardGroup, "rect", {
                    x: innerPos,
                    y: innerPos,
                    width: this.width - innerPos * 2,
                    height: this.height - innerPos * 2
                });
                borderInner.setAttribute("class", "border-inner");
            }
            for (var i = 0; i < 64; i++) {
                var index = this.chessboard.state.orientation === _Chessboard.COLOR.white ? i : 63 - i;
                var squareColor = (9 * index & 8) === 0 ? 'black' : 'white';
                var fieldClass = "square " + squareColor;
                var point = this.squareIndexToPoint(index);
                var squareRect = _Svg.Svg.addElement(this.boardGroup, "rect", {
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
                var textElement = _Svg.Svg.addElement(this.coordinatesGroup, "text", {
                    class: cssClass,
                    x: x,
                    y: y,
                    style: "font-size: " + this.scalingY * 8 + "px"
                });
                if (this.chessboard.state.orientation === _Chessboard.COLOR.white) {
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
                var _textElement = _Svg.Svg.addElement(this.coordinatesGroup, "text", {
                    class: _cssClass,
                    x: _x,
                    y: _y,
                    style: "font-size: " + this.scalingY * 8 + "px"
                });
                if (this.chessboard.state.orientation === _Chessboard.COLOR.white) {
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
            var pieceGroup = _Svg.Svg.addElement(this.piecesGroup, "g");
            pieceGroup.setAttribute("data-piece", pieceName);
            pieceGroup.setAttribute("data-index", index);
            var point = this.squareIndexToPoint(index);
            var transform = this.svg.createSVGTransform();
            transform.setTranslate(point.x, point.y);
            pieceGroup.transform.baseVal.appendItem(transform);
            var pieceUse = _Svg.Svg.addElement(pieceGroup, "use", { "href": "#" + pieceName, "class": "piece" });
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
            var markerGroup = _Svg.Svg.addElement(this.markersGroup, "g");
            markerGroup.setAttribute("data-index", marker.index);
            var point = this.squareIndexToPoint(marker.index);
            var transform = this.svg.createSVGTransform();
            transform.setTranslate(point.x, point.y);
            markerGroup.transform.baseVal.appendItem(transform);
            var markerUse = _Svg.Svg.addElement(markerGroup, "use", { href: "#" + marker.type.slice, class: "marker " + marker.type.class });
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
                this.currentAnimation = new _ChessboardPiecesAnimation.ChessboardPiecesAnimation(this, nextAnimation.fromSquares, nextAnimation.toSquares, this.chessboard.props.animationDuration / (this.animationQueue.length + 1), function () {
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
                    type: _Chessboard.INPUT_EVENT_TYPE.moveStart,
                    square: _ChessboardState.SQUARE_COORDINATES[index]
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
                    type: _Chessboard.INPUT_EVENT_TYPE.moveDone,
                    squareFrom: _ChessboardState.SQUARE_COORDINATES[fromIndex],
                    squareTo: _ChessboardState.SQUARE_COORDINATES[toIndex]
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
                    type: _Chessboard.INPUT_EVENT_TYPE.moveCanceled
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
            if (this.chessboard.state.orientation === _Chessboard.COLOR.white) {
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


},{"../svjs-svg/src/svjs-svg/Svg.js":6,"./Chessboard.js":1,"./ChessboardMoveInput.js":2,"./ChessboardPiecesAnimation.js":3,"./ChessboardState.js":4}],6:[function(require,module,exports){
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


},{}]},{},[6,5,1,2,4,3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImxpYi9jbS1jaGVzc2JvYXJkL0NoZXNzYm9hcmQuanMiLCJsaWIvY20tY2hlc3Nib2FyZC9DaGVzc2JvYXJkTW92ZUlucHV0LmpzIiwibGliL2NtLWNoZXNzYm9hcmQvQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbi5qcyIsImxpYi9jbS1jaGVzc2JvYXJkL0NoZXNzYm9hcmRTdGF0ZS5qcyIsImxpYi9jbS1jaGVzc2JvYXJkL0NoZXNzYm9hcmRWaWV3LmpzIiwibGliL3N2anMtc3ZnL3NyYy9zdmpzLXN2Zy9TdmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9lQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5DaGVzc2JvYXJkID0gZXhwb3J0cy5GRU5fRU1QVFlfUE9TSVRJT04gPSBleHBvcnRzLkZFTl9TVEFSVF9QT1NJVElPTiA9IGV4cG9ydHMuUElFQ0UgPSBleHBvcnRzLk1BUktFUl9UWVBFID0gZXhwb3J0cy5JTlBVVF9FVkVOVF9UWVBFID0gZXhwb3J0cy5NT1ZFX0lOUFVUX01PREUgPSBleHBvcnRzLkNPTE9SID0gdW5kZWZpbmVkO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBBdXRob3IgYW5kIGNvcHlyaWdodDogU3RlZmFuIEhhYWNrIChodHRwczovL3NoYWFjay5jb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL3NoYWFjay9jbS1jaGVzc2JvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogTGljZW5zZTogTUlULCBzZWUgZmlsZSAnTElDRU5TRSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblxudmFyIF9DaGVzc2JvYXJkVmlldyA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmRWaWV3LmpzXCIpO1xuXG52YXIgX0NoZXNzYm9hcmRTdGF0ZSA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmRTdGF0ZS5qc1wiKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIENPTE9SID0gZXhwb3J0cy5DT0xPUiA9IHtcbiAgICB3aGl0ZTogXCJ3XCIsXG4gICAgYmxhY2s6IFwiYlwiXG59O1xudmFyIE1PVkVfSU5QVVRfTU9ERSA9IGV4cG9ydHMuTU9WRV9JTlBVVF9NT0RFID0ge1xuICAgIHZpZXdPbmx5OiAwLFxuICAgIGRyYWdQaWVjZTogMSxcbiAgICBkcmFnTWFya2VyOiAyXG59O1xudmFyIElOUFVUX0VWRU5UX1RZUEUgPSBleHBvcnRzLklOUFVUX0VWRU5UX1RZUEUgPSB7XG4gICAgbW92ZVN0YXJ0OiBcIm1vdmVTdGFydFwiLFxuICAgIG1vdmVEb25lOiBcIm1vdmVEb25lXCIsXG4gICAgbW92ZUNhbmNlbGVkOiBcIm1vdmVDYW5jZWxlZFwiLFxuICAgIGNvbnRleHQ6IFwiY29udGV4dFwiXG59O1xudmFyIE1BUktFUl9UWVBFID0gZXhwb3J0cy5NQVJLRVJfVFlQRSA9IHtcbiAgICBtb3ZlOiB7IGNsYXNzOiBcIm1vdmVcIiwgc2xpY2U6IFwibWFya2VyMVwiIH0sXG4gICAgZW1waGFzaXplOiB7IGNsYXNzOiBcImVtcGhhc2l6ZVwiLCBzbGljZTogXCJtYXJrZXIyXCIgfVxufTtcbnZhciBQSUVDRSA9IGV4cG9ydHMuUElFQ0UgPSB7XG4gICAgd2hpdGVQYXduOiBcIndwXCIsXG4gICAgd2hpdGVCaXNob3A6IFwid2JcIixcbiAgICB3aGl0ZUtuaWdodDogXCJ3blwiLFxuICAgIHdoaXRlUm9vazogXCJ3clwiLFxuICAgIHdoaXRlUXVlZW46IFwid3FcIixcbiAgICB3aGl0ZUtpbmc6IFwid2tcIixcbiAgICBibGFja1Bhd246IFwiYnBcIixcbiAgICBibGFja0Jpc2hvcDogXCJiYlwiLFxuICAgIGJsYWNrS25pZ2h0OiBcImJuXCIsXG4gICAgYmxhY2tSb29rOiBcImJyXCIsXG4gICAgYmxhY2tRdWVlbjogXCJicVwiLFxuICAgIGJsYWNrS2luZzogXCJia1wiXG59O1xudmFyIEZFTl9TVEFSVF9QT1NJVElPTiA9IGV4cG9ydHMuRkVOX1NUQVJUX1BPU0lUSU9OID0gXCJybmJxa2Juci9wcHBwcHBwcC84LzgvOC84L1BQUFBQUFBQL1JOQlFLQk5SIHcgS1FrcSAtIDAgMVwiO1xudmFyIEZFTl9FTVBUWV9QT1NJVElPTiA9IGV4cG9ydHMuRkVOX0VNUFRZX1BPU0lUSU9OID0gXCI4LzgvOC84LzgvOC84LzhcIjtcblxudmFyIERFRkFVTFRfU1BSSVRFX0dSSUQgPSA0MDtcblxudmFyIENoZXNzYm9hcmQgPSBleHBvcnRzLkNoZXNzYm9hcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2hlc3Nib2FyZChlbGVtZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaGVzc2JvYXJkKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnByb3BzID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IFwiZW1wdHlcIiwgLy8gc2V0IGFzIGZlbiwgXCJzdGFydFwiIG9yIFwiZW1wdHlcIlxuICAgICAgICAgICAgb3JpZW50YXRpb246IENPTE9SLndoaXRlLCAvLyB3aGl0ZSBvbiBib3R0b21cbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgIHNob3dDb29yZGluYXRlczogdHJ1ZSwgLy8gc2hvdyByYW5rcyBhbmQgZmlsZXNcbiAgICAgICAgICAgICAgICBzaG93Qm9yZGVyOiBmYWxzZSAvLyBkaXNwbGF5IGEgYm9yZGVyIGFyb3VuZCB0aGUgYm9hcmRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNwb25zaXZlOiBmYWxzZSwgLy8gcmVzaXplcyB0aGUgYm9hcmQgb24gd2luZG93IHJlc2l6ZSwgaWYgdHJ1ZVxuICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDMwMCwgLy8gcGllY2VzIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIG1vdmVJbnB1dE1vZGU6IE1PVkVfSU5QVVRfTU9ERS52aWV3T25seSwgLy8gc2V0IHRvIE1PVkVfSU5QVVRfTU9ERS5kcmFnUGllY2Ugb3IgTU9WRV9JTlBVVF9NT0RFLmRyYWdNYXJrZXIgZm9yIGludGVyYWN0aXZlIG1vdmVtZW50XG4gICAgICAgICAgICBzcHJpdGU6IHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiLi9hc3NldHMvaW1hZ2VzL2NoZXNzYm9hcmQtc3ByaXRlLnN2Z1wiLCAvLyBwaWVjZXMgYW5kIG1hcmtlcnMgYXJlIHN0b3JlZCBlcyBzdmcgaW4gdGhlIHNwcml0ZVxuICAgICAgICAgICAgICAgIGdyaWQ6IERFRkFVTFRfU1BSSVRFX0dSSUQgLy8gdGhlIHNwcml0ZSBpcyB0aWxlZCB3aXRoIG9uZSBwaWVjZSBldmVyeSA0MHB4XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5wcm9wcywgcHJvcHMpO1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuc3ByaXRlLmdyaWQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc3ByaXRlLmdyaWQgPSBERUZBVUxUX1NQUklURV9HUklEO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgX0NoZXNzYm9hcmRTdGF0ZS5DaGVzc2JvYXJkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5vcmllbnRhdGlvbiA9IHRoaXMucHJvcHMub3JpZW50YXRpb247XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6YXRpb24gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgX3RoaXMudmlldyA9IG5ldyBfQ2hlc3Nib2FyZFZpZXcuQ2hlc3Nib2FyZFZpZXcoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvcHMucG9zaXRpb24gPT09IFwic3RhcnRcIikge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdGF0ZS5zZXRQb3NpdGlvbihGRU5fU1RBUlRfUE9TSVRJT04pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXMucHJvcHMucG9zaXRpb24gPT09IFwiZW1wdHlcIiB8fCBfdGhpcy5wcm9wcy5wb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdGF0ZS5zZXRQb3NpdGlvbihGRU5fRU1QVFlfUE9TSVRJT04pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnN0YXRlLnNldFBvc2l0aW9uKF90aGlzLnByb3BzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZpZXcucmVkcmF3KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwid2FybmluZzogdGhlIGNvbnN0cnVjdG9yIGNhbGxiYWNrIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnNcIik7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soX3RoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBUEkgLy9cblxuICAgIF9jcmVhdGVDbGFzcyhDaGVzc2JvYXJkLCBbe1xuICAgICAgICBrZXk6IFwic2V0UGllY2VcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFBpZWNlKHNxdWFyZSwgcGllY2UpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBfdGhpczIuaW5pdGlhbGl6YXRpb24udGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi5zdGF0ZS5zZXRQaWVjZShfdGhpczIuc3RhdGUuc3F1YXJlVG9JbmRleChzcXVhcmUpLCBwaWVjZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzMi52aWV3LmRyYXdQaWVjZXNEZWJvdW5jZWQoX3RoaXMyLnN0YXRlLnNxdWFyZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImdldFBpZWNlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQaWVjZShzcXVhcmUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnNxdWFyZXNbdGhpcy5zdGF0ZS5zcXVhcmVUb0luZGV4KHNxdWFyZSldO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwic2V0UG9zaXRpb25cIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFBvc2l0aW9uKGZlbikge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBhbmltYXRlZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMzLmluaXRpYWxpemF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudEZlbiA9IF90aGlzMy5zdGF0ZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVuUGFydHMgPSBmZW4uc3BsaXQoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVuTm9ybWFsaXplZCA9IGZlblBhcnRzWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmVuTm9ybWFsaXplZCAhPT0gY3VycmVudEZlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZTcXVhcmVzID0gX3RoaXMzLnN0YXRlLnNxdWFyZXMuc2xpY2UoMCk7IC8vIGNsb25lXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmVuID09PSBcInN0YXJ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpczMuc3RhdGUuc2V0UG9zaXRpb24oRkVOX1NUQVJUX1BPU0lUSU9OKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmVuID09PSBcImVtcHR5XCIgfHwgZmVuID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMzLnN0YXRlLnNldFBvc2l0aW9uKEZFTl9FTVBUWV9QT1NJVElPTik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzMy5zdGF0ZS5zZXRQb3NpdGlvbihmZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMzLnZpZXcuYW5pbWF0ZVBpZWNlcyhwcmV2U3F1YXJlcywgX3RoaXMzLnN0YXRlLnNxdWFyZXMuc2xpY2UoMCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpczMudmlldy5kcmF3UGllY2VzRGVib3VuY2VkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImdldFBvc2l0aW9uXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb3NpdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJhZGRNYXJrZXJcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZE1hcmtlcihzcXVhcmUpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBNQVJLRVJfVFlQRS5lbXBoYXNpemU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUuYWRkTWFya2VyKHRoaXMuc3RhdGUuc3F1YXJlVG9JbmRleChzcXVhcmUpLCB0eXBlKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5kcmF3TWFya2Vyc0RlYm91bmNlZCgpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZ2V0TWFya2Vyc1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TWFya2VycygpIHtcbiAgICAgICAgICAgIHZhciBzcXVhcmUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG51bGw7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgICAgICAgICAgdmFyIG1hcmtlcnNGb3VuZCA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJzLmZvckVhY2goZnVuY3Rpb24gKG1hcmtlcikge1xuICAgICAgICAgICAgICAgIHZhciBtYXJrZXJTcXVhcmUgPSBfQ2hlc3Nib2FyZFN0YXRlLlNRVUFSRV9DT09SRElOQVRFU1ttYXJrZXIuaW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChzcXVhcmUgPT09IG51bGwgJiYgKHR5cGUgPT09IG51bGwgfHwgdHlwZSA9PT0gbWFya2VyLnR5cGUpIHx8IHR5cGUgPT09IG51bGwgJiYgc3F1YXJlID09PSBtYXJrZXJTcXVhcmUgfHwgdHlwZSA9PT0gbWFya2VyLnR5cGUgJiYgc3F1YXJlID09PSBtYXJrZXJTcXVhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya2Vyc0ZvdW5kLnB1c2goeyBzcXVhcmU6IF9DaGVzc2JvYXJkU3RhdGUuU1FVQVJFX0NPT1JESU5BVEVTW21hcmtlci5pbmRleF0sIHR5cGU6IG1hcmtlci50eXBlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1hcmtlcnNGb3VuZDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInJlbW92ZU1hcmtlcnNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZU1hcmtlcnMoKSB7XG4gICAgICAgICAgICB2YXIgc3F1YXJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9IHNxdWFyZSAhPT0gbnVsbCA/IHRoaXMuc3RhdGUuc3F1YXJlVG9JbmRleChzcXVhcmUpIDogbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVtb3ZlTWFya2VycyhpbmRleCwgdHlwZSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZHJhd01hcmtlcnNEZWJvdW5jZWQoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNldE9yaWVudGF0aW9uXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRPcmllbnRhdGlvbihjb2xvcikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5vcmllbnRhdGlvbiA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy52aWV3LnJlZHJhdygpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZ2V0T3JpZW50YXRpb25cIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9yaWVudGF0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUub3JpZW50YXRpb247XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkZXN0cm95XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzNC5pbml0aWFsaXphdGlvbi50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM0LnZpZXcuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpczQudmlldyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzNC5zdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzNC5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBfdGhpczQuY29udGV4dE1lbnVMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZW5hYmxlTW92ZUlucHV0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVNb3ZlSW5wdXQoZXZlbnRIYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgY29sb3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm1vdmVJbnB1dE1vZGUgPT09IE1PVkVfSU5QVVRfTU9ERS52aWV3T25seSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwicHJvcHMubW92ZUlucHV0TW9kZSBpcyBNT1ZFX0lOUFVUX01PREUudmlld09ubHlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sb3IgPT09IENPTE9SLndoaXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dFdoaXRlRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbG9yID09PSBDT0xPUi5ibGFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRCbGFja0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0V2hpdGVFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0QmxhY2tFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubW92ZUlucHV0Q2FsbGJhY2sgPSBldmVudEhhbmRsZXI7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0Q3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkaXNhYmxlTW92ZUlucHV0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlTW92ZUlucHV0KCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dFdoaXRlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEJsYWNrRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSW5wdXRDYWxsYmFjayA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0Q3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJlbmFibGVDb250ZXh0SW5wdXRcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZUNvbnRleHRJbnB1dChldmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJjb250ZXh0TWVudUxpc3RlbmVyIGFscmVhZHkgZXhpc3RpbmdcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUxpc3RlbmVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIoe1xuICAgICAgICAgICAgICAgICAgICBjaGVzc2JvYXJkOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBJTlBVVF9FVkVOVF9UWVBFLmNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIHNxdWFyZTogX0NoZXNzYm9hcmRTdGF0ZS5TUVVBUkVfQ09PUkRJTkFURVNbaW5kZXhdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMuY29udGV4dE1lbnVMaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkaXNhYmxlQ29udGV4dElucHV0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlQ29udGV4dElucHV0KCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLmNvbnRleHRNZW51TGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENoZXNzYm9hcmQ7XG59KCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNoZXNzYm9hcmQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuQ2hlc3Nib2FyZE1vdmVJbnB1dCA9IHVuZGVmaW5lZDtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTsgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQXV0aG9yIGFuZCBjb3B5cmlnaHQ6IFN0ZWZhbiBIYWFjayAoaHR0cHM6Ly9zaGFhY2suY29tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9zaGFhY2svY20tY2hlc3Nib2FyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIExpY2Vuc2U6IE1JVCwgc2VlIGZpbGUgJ0xJQ0VOU0UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG5cbnZhciBfU3ZnID0gcmVxdWlyZShcIi4uL3N2anMtc3ZnL3NyYy9zdmpzLXN2Zy9TdmcuanNcIik7XG5cbnZhciBfQ2hlc3Nib2FyZCA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmQuanNcIik7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBTVEFURSA9IHtcbiAgICB3YWl0Rm9ySW5wdXRTdGFydDogMCxcbiAgICBwaWVjZUNsaWNrZWRUaHJlc2hvbGQ6IDEsXG4gICAgY2xpY2tUbzogMixcbiAgICBzZWNvbmRDbGlja1RocmVzaG9sZDogMyxcbiAgICBkcmFnVG86IDQsXG4gICAgY2xpY2tEcmFnVG86IDUsXG4gICAgbW92ZURvbmU6IDYsXG4gICAgcmVzZXQ6IDdcbn07XG5cbnZhciBEUkFHX1RIUkVTSE9MRCA9IDI7XG5cbnZhciBDaGVzc2JvYXJkTW92ZUlucHV0ID0gZXhwb3J0cy5DaGVzc2JvYXJkTW92ZUlucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENoZXNzYm9hcmRNb3ZlSW5wdXQodmlldywgc3RhdGUsIHByb3BzLCBtb3ZlU3RhcnRDYWxsYmFjaywgbW92ZURvbmVDYWxsYmFjaywgbW92ZUNhbmNlbGVkQ2FsbGJhY2spIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENoZXNzYm9hcmRNb3ZlSW5wdXQpO1xuXG4gICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLm1vdmVTdGFydENhbGxiYWNrID0gbW92ZVN0YXJ0Q2FsbGJhY2s7XG4gICAgICAgIHRoaXMubW92ZURvbmVDYWxsYmFjayA9IG1vdmVEb25lQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMubW92ZUNhbmNlbGVkQ2FsbGJhY2sgPSBtb3ZlQ2FuY2VsZWRDYWxsYmFjaztcbiAgICAgICAgdGhpcy5zZXRNb3ZlSW5wdXRTdGF0ZShTVEFURS53YWl0Rm9ySW5wdXRTdGFydCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKENoZXNzYm9hcmRNb3ZlSW5wdXQsIFt7XG4gICAgICAgIGtleTogXCJzZXRNb3ZlSW5wdXRTdGF0ZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0TW92ZUlucHV0U3RhdGUobmV3U3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG5cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzZXRNb3ZlSW5wdXRTdGF0ZVwiLCBPYmplY3Qua2V5cyhTVEFURSlbdGhpcy5tb3ZlSW5wdXRTdGF0ZV0sIFwiPT5cIiwgT2JqZWN0LmtleXMoU1RBVEUpW25ld1N0YXRlXSk7XG5cbiAgICAgICAgICAgIHZhciBwcmV2U3RhdGUgPSB0aGlzLm1vdmVJbnB1dFN0YXRlO1xuICAgICAgICAgICAgdGhpcy5tb3ZlSW5wdXRTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG5ld1N0YXRlKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFNUQVRFLndhaXRGb3JJbnB1dFN0YXJ0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgU1RBVEUucGllY2VDbGlja2VkVGhyZXNob2xkOlxuICAgICAgICAgICAgICAgICAgICBpZiAoU1RBVEUud2FpdEZvcklucHV0U3RhcnQgIT09IHByZXZTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW92ZUlucHV0U3RhdGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gcGFyYW1zLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlZFBpZWNlID0gcGFyYW1zLnBpZWNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXJ0RW5kTWFya2VycygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBwYXJhbXMucG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5wb2ludGVyTW92ZUxpc3RlbmVyICYmICF0aGlzLnBvaW50ZXJVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnR5cGUgPT09IFwibW91c2Vkb3duXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlck1vdmVMaXN0ZW5lciA9IHRoaXMub25Qb2ludGVyTW92ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlck1vdmVMaXN0ZW5lci50eXBlID0gXCJtb3VzZW1vdmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyVXBMaXN0ZW5lciA9IHRoaXMub25Qb2ludGVyVXAuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJVcExpc3RlbmVyLnR5cGUgPSBcIm1vdXNldXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5wb2ludGVyVXBMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZUxpc3RlbmVyID0gdGhpcy5vblBvaW50ZXJNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZUxpc3RlbmVyLnR5cGUgPSBcInRvdWNobW92ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMucG9pbnRlck1vdmVMaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50ZXJVcExpc3RlbmVyID0gdGhpcy5vblBvaW50ZXJVcC5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlclVwTGlzdGVuZXIudHlwZSA9IFwidG91Y2hlbmRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMucG9pbnRlclVwTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcImV2ZW50IHR5cGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIl9wb2ludGVyTW92ZUxpc3RlbmVyIG9yIF9wb2ludGVyVXBMaXN0ZW5lclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgU1RBVEUuY2xpY2tUbzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2FibGVQaWVjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX1N2Zy5TdmcucmVtb3ZlRWxlbWVudCh0aGlzLmRyYWdhYmxlUGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnYWJsZVBpZWNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlN0YXRlID09PSBTVEFURS5kcmFnVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5zZXRQaWVjZVZpc2liaWxpdHkocGFyYW1zLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgU1RBVEUuc2Vjb25kQ2xpY2tUaHJlc2hvbGQ6XG4gICAgICAgICAgICAgICAgICAgIGlmIChTVEFURS5jbGlja1RvICE9PSBwcmV2U3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vdmVJbnB1dFN0YXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRQb2ludCA9IHBhcmFtcy5wb2ludDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFNUQVRFLmRyYWdUbzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKFNUQVRFLnBpZWNlQ2xpY2tlZFRocmVzaG9sZCAhPT0gcHJldlN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb3ZlSW5wdXRTdGF0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5tb3ZlSW5wdXRNb2RlID09PSBfQ2hlc3Nib2FyZC5NT1ZFX0lOUFVUX01PREUuZHJhZ1BpZWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuc2V0UGllY2VWaXNpYmlsaXR5KHBhcmFtcy5pbmRleCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEcmFnYWJsZVBpZWNlKHBhcmFtcy5waWVjZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFNUQVRFLmNsaWNrRHJhZ1RvOlxuICAgICAgICAgICAgICAgICAgICBpZiAoU1RBVEUuc2Vjb25kQ2xpY2tUaHJlc2hvbGQgIT09IHByZXZTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW92ZUlucHV0U3RhdGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMubW92ZUlucHV0TW9kZSA9PT0gX0NoZXNzYm9hcmQuTU9WRV9JTlBVVF9NT0RFLmRyYWdQaWVjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LnNldFBpZWNlVmlzaWJpbGl0eShwYXJhbXMuaW5kZXgsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRHJhZ2FibGVQaWVjZShwYXJhbXMucGllY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBTVEFURS5tb3ZlRG9uZTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKFtTVEFURS5kcmFnVG8sIFNUQVRFLmNsaWNrVG8sIFNUQVRFLmNsaWNrRHJhZ1RvXS5pbmRleE9mKHByZXZTdGF0ZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb3ZlSW5wdXRTdGF0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEluZGV4ID0gcGFyYW1zLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmRJbmRleCAmJiB0aGlzLm1vdmVEb25lQ2FsbGJhY2sodGhpcy5zdGFydEluZGV4LCB0aGlzLmVuZEluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZTcXVhcmVzID0gdGhpcy5zdGF0ZS5zcXVhcmVzLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZXRQaWVjZSh0aGlzLnN0YXJ0SW5kZXgsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZXRQaWVjZSh0aGlzLmVuZEluZGV4LCB0aGlzLm1vdmVkUGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZTdGF0ZSA9PT0gU1RBVEUuY2xpY2tUbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5hbmltYXRlUGllY2VzKHByZXZTcXVhcmVzLCB0aGlzLnN0YXRlLnNxdWFyZXMuc2xpY2UoMCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUucmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZHJhd1BpZWNlcyh0aGlzLnN0YXRlLnNxdWFyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUucmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmRyYXdQaWVjZXNEZWJvdW5jZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUucmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBTVEFURS5yZXNldDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRJbmRleCAmJiAhdGhpcy5lbmRJbmRleCAmJiB0aGlzLm1vdmVkUGllY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2V0UGllY2UodGhpcy5zdGFydEluZGV4LCB0aGlzLm1vdmVkUGllY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kSW5kZXggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVkUGllY2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXJ0RW5kTWFya2VycygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnYWJsZVBpZWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfU3ZnLlN2Zy5yZW1vdmVFbGVtZW50KHRoaXMuZHJhZ2FibGVQaWVjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdhYmxlUGllY2UgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMucG9pbnRlck1vdmVMaXN0ZW5lci50eXBlLCB0aGlzLnBvaW50ZXJNb3ZlTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludGVyTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wb2ludGVyVXBMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5wb2ludGVyVXBMaXN0ZW5lci50eXBlLCB0aGlzLnBvaW50ZXJVcExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRlclVwTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUud2FpdEZvcklucHV0U3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwibW92ZUlucHV0U3RhdGUgXCIgKyBuZXdTdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJjcmVhdGVEcmFnYWJsZVBpZWNlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVEcmFnYWJsZVBpZWNlKHBpZWNlTmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2FibGVQaWVjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiZHJhZ2FibGVQaWVjZSBleGlzdHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRyYWdhYmxlUGllY2UgPSBfU3ZnLlN2Zy5jcmVhdGVTdmcoZG9jdW1lbnQuYm9keSk7XG4gICAgICAgICAgICB0aGlzLmRyYWdhYmxlUGllY2Uuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdGhpcy52aWV3LnNxdWFyZVdpZHRoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2FibGVQaWVjZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgdGhpcy52aWV3LnNxdWFyZUhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLmRyYWdhYmxlUGllY2Uuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwb2ludGVyLWV2ZW50czogbm9uZVwiKTtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2FibGVQaWVjZS5uYW1lID0gcGllY2VOYW1lO1xuICAgICAgICAgICAgdmFyIHBpZWNlID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLmRyYWdhYmxlUGllY2UsIFwidXNlXCIsIHtcbiAgICAgICAgICAgICAgICBocmVmOiBcIiNcIiArIHBpZWNlTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc2NhbGluZyA9IHRoaXMudmlldy5zcXVhcmVIZWlnaHQgLyB0aGlzLnByb3BzLnNwcml0ZS5ncmlkO1xuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVNjYWxlID0gdGhpcy5kcmFnYWJsZVBpZWNlLmNyZWF0ZVNWR1RyYW5zZm9ybSgpO1xuICAgICAgICAgICAgdHJhbnNmb3JtU2NhbGUuc2V0U2NhbGUoc2NhbGluZywgc2NhbGluZyk7XG4gICAgICAgICAgICBwaWVjZS50cmFuc2Zvcm0uYmFzZVZhbC5hcHBlbmRJdGVtKHRyYW5zZm9ybVNjYWxlKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm1vdmVEcmFnYWJsZVBpZWNlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlRHJhZ2FibGVQaWVjZSh4LCB5KSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdhYmxlUGllY2Uuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwb2ludGVyLWV2ZW50czogbm9uZTsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiBcIiArICh4IC0gdGhpcy52aWV3LnNxdWFyZUhlaWdodCAvIDIpICsgXCJweDsgdG9wOiBcIiArICh5IC0gdGhpcy52aWV3LnNxdWFyZUhlaWdodCAvIDIpICsgXCJweFwiKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm9uUG9pbnRlckRvd25cIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uUG9pbnRlckRvd24oZSkge1xuICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJtb3VzZWRvd25cIiAmJiBlLmJ1dHRvbiA9PT0gMCB8fCBlLnR5cGUgPT09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgcGllY2VFbGVtZW50ID0gdGhpcy52aWV3LmdldFBpZWNlKGluZGV4KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGllY2VOYW1lID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwaWVjZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlTmFtZSA9IHBpZWNlRWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBpZWNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPSBwaWVjZU5hbWUgPyBwaWVjZU5hbWUuc3Vic3RyKDAsIDEpIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlSW5wdXRTdGF0ZSAhPT0gU1RBVEUud2FpdEZvcklucHV0U3RhcnQgfHwgdGhpcy5zdGF0ZS5pbnB1dFdoaXRlRW5hYmxlZCAmJiBjb2xvciA9PT0gXCJ3XCIgfHwgdGhpcy5zdGF0ZS5pbnB1dEJsYWNrRW5hYmxlZCAmJiBjb2xvciA9PT0gXCJiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2Vkb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludCA9IHsgeDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ID0geyB4OiBlLnRvdWNoZXNbMF0uY2xpZW50WCwgeTogZS50b3VjaGVzWzBdLmNsaWVudFkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVJbnB1dFN0YXRlID09PSBTVEFURS53YWl0Rm9ySW5wdXRTdGFydCAmJiBwaWVjZU5hbWUgJiYgdGhpcy5tb3ZlU3RhcnRDYWxsYmFjayhpbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLnBpZWNlQ2xpY2tlZFRocmVzaG9sZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlOiBwaWVjZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZS50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLmNsaWNrVG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IHRoaXMuc3RhcnRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLnNlY29uZENsaWNrVGhyZXNob2xkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWVjZTogcGllY2VOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZS50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUubW92ZURvbmUsIHsgaW5kZXg6IGluZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm9uUG9pbnRlck1vdmVcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoZSkge1xuICAgICAgICAgICAgdmFyIHggPSB2b2lkIDAsXG4gICAgICAgICAgICAgICAgeSA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoZS50eXBlID09PSBcIm1vdXNlbW92ZVwiKSB7XG4gICAgICAgICAgICAgICAgeCA9IGUucGFnZVg7XG4gICAgICAgICAgICAgICAgeSA9IGUucGFnZVk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gXCJ0b3VjaG1vdmVcIikge1xuICAgICAgICAgICAgICAgIHggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgeSA9IGUudG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUudG91Y2hlc1swXS5jbGllbnRYLCBlLnRvdWNoZXNbMF0uY2xpZW50WSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlSW5wdXRTdGF0ZSA9PT0gU1RBVEUucGllY2VDbGlja2VkVGhyZXNob2xkIHx8IHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLnNlY29uZENsaWNrVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuc3RhcnRQb2ludC54IC0geCkgPiBEUkFHX1RIUkVTSE9MRCB8fCBNYXRoLmFicyh0aGlzLnN0YXJ0UG9pbnQueSAtIHkpID4gRFJBR19USFJFU0hPTEQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLnNlY29uZENsaWNrVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLmNsaWNrRHJhZ1RvLCB7IGluZGV4OiB0aGlzLnN0YXJ0SW5kZXgsIHBpZWNlOiB0aGlzLm1vdmVkUGllY2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLmRyYWdUbywgeyBpbmRleDogdGhpcy5zdGFydEluZGV4LCBwaWVjZTogdGhpcy5tb3ZlZFBpZWNlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm1vdmVJbnB1dE1vZGUgPT09IF9DaGVzc2JvYXJkLk1PVkVfSU5QVVRfTU9ERS5kcmFnUGllY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZURyYWdhYmxlUGllY2UoeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLmRyYWdUbyB8fCB0aGlzLm1vdmVJbnB1dFN0YXRlID09PSBTVEFURS5jbGlja0RyYWdUbyB8fCB0aGlzLm1vdmVJbnB1dFN0YXRlID09PSBTVEFURS5jbGlja1RvKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlICYmIHRhcmdldC5wYXJlbnRFbGVtZW50ID09PSB0aGlzLnZpZXcuYm9hcmRHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLnN0YXJ0SW5kZXggJiYgaW5kZXggIT09IHRoaXMuZW5kSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhcnRFbmRNYXJrZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRoaXMuc3RhcnRJbmRleCAmJiB0aGlzLmVuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhcnRFbmRNYXJrZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGFydEVuZE1hcmtlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMubW92ZUlucHV0TW9kZSA9PT0gX0NoZXNzYm9hcmQuTU9WRV9JTlBVVF9NT0RFLmRyYWdQaWVjZSAmJiAodGhpcy5tb3ZlSW5wdXRTdGF0ZSA9PT0gU1RBVEUuZHJhZ1RvIHx8IHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLmNsaWNrRHJhZ1RvKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEcmFnYWJsZVBpZWNlKHgsIHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm9uUG9pbnRlclVwXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblBvaW50ZXJVcChlKSB7XG4gICAgICAgICAgICB2YXIgeCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICB5ID0gdm9pZCAwLFxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwibW91c2V1cFwiKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gXCJ0b3VjaGVuZFwiKSB7XG4gICAgICAgICAgICAgICAgeCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgICAgICB5ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3ZlSW5wdXRTdGF0ZSA9PT0gU1RBVEUuZHJhZ1RvIHx8IHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLmNsaWNrRHJhZ1RvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFydEluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdmVJbnB1dFN0YXRlID09PSBTVEFURS5jbGlja0RyYWdUbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNldFBpZWNlKHRoaXMuc3RhcnRJbmRleCwgdGhpcy5tb3ZlZFBpZWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LnNldFBpZWNlVmlzaWJpbGl0eSh0aGlzLnN0YXJ0SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLnJlc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLmNsaWNrVG8sIHsgaW5kZXg6IGluZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNb3ZlSW5wdXRTdGF0ZShTVEFURS5tb3ZlRG9uZSwgeyBpbmRleDogaW5kZXggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb3ZlSW5wdXRTdGF0ZSA9PT0gU1RBVEUucGllY2VDbGlja2VkVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLmNsaWNrVG8sIHsgaW5kZXg6IGluZGV4IH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubW92ZUlucHV0U3RhdGUgPT09IFNUQVRFLnNlY29uZENsaWNrVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLnJlc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUNhbmNlbGVkQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5kcmF3UGllY2VzRGVib3VuY2VkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUucmVzZXQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVDYW5jZWxlZENhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXcuZHJhd1BpZWNlc0RlYm91bmNlZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TW92ZUlucHV0U3RhdGUoU1RBVEUucmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwidXBkYXRlU3RhcnRFbmRNYXJrZXJzXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVTdGFydEVuZE1hcmtlcnMoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnJlbW92ZU1hcmtlcnMobnVsbCwgX0NoZXNzYm9hcmQuTUFSS0VSX1RZUEUubW92ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydEluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hZGRNYXJrZXIodGhpcy5zdGFydEluZGV4LCBfQ2hlc3Nib2FyZC5NQVJLRVJfVFlQRS5tb3ZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmVuZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hZGRNYXJrZXIodGhpcy5lbmRJbmRleCwgX0NoZXNzYm9hcmQuTUFSS0VSX1RZUEUubW92ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZpZXcuZHJhd01hcmtlcnNEZWJvdW5jZWQoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICB0aGlzLnNldE1vdmVJbnB1dFN0YXRlKFNUQVRFLnJlc2V0KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDaGVzc2JvYXJkTW92ZUlucHV0O1xufSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DaGVzc2JvYXJkTW92ZUlucHV0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogQXV0aG9yIGFuZCBjb3B5cmlnaHQ6IFN0ZWZhbiBIYWFjayAoaHR0cHM6Ly9zaGFhY2suY29tKVxuICogUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL3NoYWFjay9jbS1jaGVzc2JvYXJkXG4gKiBMaWNlbnNlOiBNSVQsIHNlZSBmaWxlICdMSUNFTlNFJ1xuICovXG5cbnZhciBDSEFOR0VfVFlQRSA9IHtcbiAgICBtb3ZlOiAwLFxuICAgIGFwcGVhcjogMSxcbiAgICBkaXNhcHBlYXI6IDJcbn07XG5cbmZ1bmN0aW9uIEFuaW1hdGlvblJ1bm5pbmdFeGNlcHRpb24oKSB7fVxuXG52YXIgQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbiA9IGV4cG9ydHMuQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDaGVzc2JvYXJkUGllY2VzQW5pbWF0aW9uKHZpZXcsIGZyb21TcXVhcmVzLCB0b1NxdWFyZXMsIGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbik7XG5cbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgaWYgKHRoaXMudmlldy5hbmltYXRpb25SdW5uaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQW5pbWF0aW9uUnVubmluZ0V4Y2VwdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcm9tU3F1YXJlcyAmJiB0b1NxdWFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cyA9IHRoaXMuY3JlYXRlQW5pbWF0aW9uKGZyb21TcXVhcmVzLCB0b1NxdWFyZXMpO1xuICAgICAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgdGhpcy52aWV3LmFuaW1hdGlvblJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mcmFtZUhhbmRsZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvblN0ZXAuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbiwgW3tcbiAgICAgICAga2V5OiBcInNlZWtDaGFuZ2VzXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZWVrQ2hhbmdlcyhmcm9tU3F1YXJlcywgdG9TcXVhcmVzKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgYXBwZWFyZWRMaXN0ID0gW10sXG4gICAgICAgICAgICAgICAgZGlzYXBwZWFyZWRMaXN0ID0gW10sXG4gICAgICAgICAgICAgICAgY2hhbmdlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzU3F1YXJlID0gZnJvbVNxdWFyZXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIG5ld1NxdWFyZSA9IHRvU3F1YXJlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAobmV3U3F1YXJlICE9PSBwcmV2aW91c1NxdWFyZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3U3F1YXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBlYXJlZExpc3QucHVzaCh7IHBpZWNlOiBuZXdTcXVhcmUsIGluZGV4OiBpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1NxdWFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYXBwZWFyZWRMaXN0LnB1c2goeyBwaWVjZTogcHJldmlvdXNTcXVhcmUsIGluZGV4OiBpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXBwZWFyZWRMaXN0LmZvckVhY2goZnVuY3Rpb24gKGFwcGVhcmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3J0ZXN0RGlzdGFuY2UgPSA4O1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZE1vdmVkID0gbnVsbDtcbiAgICAgICAgICAgICAgICBkaXNhcHBlYXJlZExpc3QuZm9yRWFjaChmdW5jdGlvbiAoZGlzYXBwZWFyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFwcGVhcmVkLnBpZWNlID09PSBkaXNhcHBlYXJlZC5waWVjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vdmVEaXN0YW5jZSA9IF90aGlzLnNxdWFyZURpc3RhbmNlKGFwcGVhcmVkLmluZGV4LCBkaXNhcHBlYXJlZC5pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW92ZURpc3RhbmNlIDwgc2hvcnRlc3REaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kTW92ZWQgPSBkaXNhcHBlYXJlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG9ydGVzdERpc3RhbmNlID0gbW92ZURpc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTW92ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYXBwZWFyZWRMaXN0LnNwbGljZShkaXNhcHBlYXJlZExpc3QuaW5kZXhPZihmb3VuZE1vdmVkKSwgMSk7IC8vIHJlbW92ZSBmcm9tIGRpc2FwcGVhcmVkTGlzdCwgYmVjYXVzZSBpdCBpcyBtb3ZlZCBub3dcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IENIQU5HRV9UWVBFLm1vdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWVjZTogYXBwZWFyZWQucGllY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdEluZGV4OiBmb3VuZE1vdmVkLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9JbmRleDogYXBwZWFyZWQuaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgdHlwZTogQ0hBTkdFX1RZUEUuYXBwZWFyLCBwaWVjZTogYXBwZWFyZWQucGllY2UsIGF0SW5kZXg6IGFwcGVhcmVkLmluZGV4IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGlzYXBwZWFyZWRMaXN0LmZvckVhY2goZnVuY3Rpb24gKGRpc2FwcGVhcmVkKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgdHlwZTogQ0hBTkdFX1RZUEUuZGlzYXBwZWFyLCBwaWVjZTogZGlzYXBwZWFyZWQucGllY2UsIGF0SW5kZXg6IGRpc2FwcGVhcmVkLmluZGV4IH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY2hhbmdlcztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNyZWF0ZUFuaW1hdGlvblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uKGZyb21TcXVhcmVzLCB0b1NxdWFyZXMpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgY2hhbmdlcyA9IHRoaXMuc2Vla0NoYW5nZXMoZnJvbVNxdWFyZXMsIHRvU3F1YXJlcyk7XG4gICAgICAgICAgICB2YXIgYW5pbWF0ZWRFbGVtZW50cyA9IFtdO1xuICAgICAgICAgICAgY2hhbmdlcy5mb3JFYWNoKGZ1bmN0aW9uIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0ZWRJdGVtID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBjaGFuZ2UudHlwZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc3dpdGNoIChjaGFuZ2UudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIENIQU5HRV9UWVBFLm1vdmU6XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudCA9IF90aGlzMi52aWV3LmdldFBpZWNlKGNoYW5nZS5hdEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkSXRlbS5hdFBvaW50ID0gX3RoaXMyLnZpZXcuc3F1YXJlSW5kZXhUb1BvaW50KGNoYW5nZS5hdEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkSXRlbS50b1BvaW50ID0gX3RoaXMyLnZpZXcuc3F1YXJlSW5kZXhUb1BvaW50KGNoYW5nZS50b0luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIENIQU5HRV9UWVBFLmFwcGVhcjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkSXRlbS5lbGVtZW50ID0gX3RoaXMyLnZpZXcuZHJhd1BpZWNlKGNoYW5nZS5hdEluZGV4LCBjaGFuZ2UucGllY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWRJdGVtLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBDSEFOR0VfVFlQRS5kaXNhcHBlYXI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudCA9IF90aGlzMi52aWV3LmdldFBpZWNlKGNoYW5nZS5hdEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbmltYXRlZEVsZW1lbnRzLnB1c2goYW5pbWF0ZWRJdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGVkRWxlbWVudHM7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJhbmltYXRpb25TdGVwXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhbmltYXRpb25TdGVwKHRpbWUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRpbWVEaWZmID0gdGltZSAtIHRoaXMuc3RhcnRUaW1lO1xuICAgICAgICAgICAgaWYgKHRpbWVEaWZmIDw9IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZyYW1lSGFuZGxlID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uU3RlcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5mcmFtZUhhbmRsZSk7XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3LmFuaW1hdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdCA9IE1hdGgubWluKDEsIHRpbWVEaWZmIC8gdGhpcy5kdXJhdGlvbik7XG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSB0IDwgLjUgPyAyICogdCAqIHQgOiAtMSArICg0IC0gMiAqIHQpICogdDsgLy8gZWFzZUluT3V0XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVkRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYW5pbWF0ZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1hdGVkSXRlbS5lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoYW5pbWF0ZWRJdGVtLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgQ0hBTkdFX1RZUEUubW92ZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudC50cmFuc2Zvcm0uYmFzZVZhbC5yZW1vdmVJdGVtKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm0gPSBfdGhpczMudmlldy5zdmcuY3JlYXRlU1ZHVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtLnNldFRyYW5zbGF0ZShhbmltYXRlZEl0ZW0uYXRQb2ludC54ICsgKGFuaW1hdGVkSXRlbS50b1BvaW50LnggLSBhbmltYXRlZEl0ZW0uYXRQb2ludC54KSAqIHByb2dyZXNzLCBhbmltYXRlZEl0ZW0uYXRQb2ludC55ICsgKGFuaW1hdGVkSXRlbS50b1BvaW50LnkgLSBhbmltYXRlZEl0ZW0uYXRQb2ludC55KSAqIHByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudC50cmFuc2Zvcm0uYmFzZVZhbC5hcHBlbmRJdGVtKHRyYW5zZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIENIQU5HRV9UWVBFLmFwcGVhcjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gcHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIENIQU5HRV9UWVBFLmRpc2FwcGVhcjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlZEl0ZW0uZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMSAtIHByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYW5pbWF0ZWRJdGVtIGhhcyBubyBlbGVtZW50XCIsIGFuaW1hdGVkSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJzcXVhcmVEaXN0YW5jZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc3F1YXJlRGlzdGFuY2UoaW5kZXgxLCBpbmRleDIpIHtcbiAgICAgICAgICAgIHZhciBmaWxlMSA9IGluZGV4MSAlIDg7XG4gICAgICAgICAgICB2YXIgcmFuazEgPSBNYXRoLmZsb29yKGluZGV4MSAvIDgpO1xuICAgICAgICAgICAgdmFyIGZpbGUyID0gaW5kZXgyICUgODtcbiAgICAgICAgICAgIHZhciByYW5rMiA9IE1hdGguZmxvb3IoaW5kZXgyIC8gOCk7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5hYnMocmFuazIgLSByYW5rMSksIE1hdGguYWJzKGZpbGUyIC0gZmlsZTEpKTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDaGVzc2JvYXJkUGllY2VzQW5pbWF0aW9uO1xufSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DaGVzc2JvYXJkUGllY2VzQW5pbWF0aW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogQXV0aG9yIGFuZCBjb3B5cmlnaHQ6IFN0ZWZhbiBIYWFjayAoaHR0cHM6Ly9zaGFhY2suY29tKVxuICogUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL3NoYWFjay9jbS1jaGVzc2JvYXJkXG4gKiBMaWNlbnNlOiBNSVQsIHNlZSBmaWxlICdMSUNFTlNFJ1xuICovXG5cbnZhciBTUVVBUkVfQ09PUkRJTkFURVMgPSBleHBvcnRzLlNRVUFSRV9DT09SRElOQVRFUyA9IFtcImExXCIsIFwiYjFcIiwgXCJjMVwiLCBcImQxXCIsIFwiZTFcIiwgXCJmMVwiLCBcImcxXCIsIFwiaDFcIiwgXCJhMlwiLCBcImIyXCIsIFwiYzJcIiwgXCJkMlwiLCBcImUyXCIsIFwiZjJcIiwgXCJnMlwiLCBcImgyXCIsIFwiYTNcIiwgXCJiM1wiLCBcImMzXCIsIFwiZDNcIiwgXCJlM1wiLCBcImYzXCIsIFwiZzNcIiwgXCJoM1wiLCBcImE0XCIsIFwiYjRcIiwgXCJjNFwiLCBcImQ0XCIsIFwiZTRcIiwgXCJmNFwiLCBcImc0XCIsIFwiaDRcIiwgXCJhNVwiLCBcImI1XCIsIFwiYzVcIiwgXCJkNVwiLCBcImU1XCIsIFwiZjVcIiwgXCJnNVwiLCBcImg1XCIsIFwiYTZcIiwgXCJiNlwiLCBcImM2XCIsIFwiZDZcIiwgXCJlNlwiLCBcImY2XCIsIFwiZzZcIiwgXCJoNlwiLCBcImE3XCIsIFwiYjdcIiwgXCJjN1wiLCBcImQ3XCIsIFwiZTdcIiwgXCJmN1wiLCBcImc3XCIsIFwiaDdcIiwgXCJhOFwiLCBcImI4XCIsIFwiYzhcIiwgXCJkOFwiLCBcImU4XCIsIFwiZjhcIiwgXCJnOFwiLCBcImg4XCJdO1xuXG52YXIgQ2hlc3Nib2FyZFN0YXRlID0gZXhwb3J0cy5DaGVzc2JvYXJkU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2hlc3Nib2FyZFN0YXRlKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2hlc3Nib2FyZFN0YXRlKTtcblxuICAgICAgICB0aGlzLnNxdWFyZXMgPSBuZXcgQXJyYXkoNjQpLmZpbGwobnVsbCk7XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQ2hlc3Nib2FyZFN0YXRlLCBbe1xuICAgICAgICBrZXk6IFwic2V0UGllY2VcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFBpZWNlKGluZGV4LCBwaWVjZSkge1xuICAgICAgICAgICAgdGhpcy5zcXVhcmVzW2luZGV4XSA9IHBpZWNlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiYWRkTWFya2VyXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRNYXJrZXIoaW5kZXgsIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMubWFya2Vycy5wdXNoKHsgaW5kZXg6IGluZGV4LCB0eXBlOiB0eXBlIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwicmVtb3ZlTWFya2Vyc1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlTWFya2VycygpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICAgICAgICAgIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IG51bGwgJiYgdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFya2VycyA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtlcnMgPSB0aGlzLm1hcmtlcnMuZmlsdGVyKGZ1bmN0aW9uIChtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcmtlci50eXBlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IG1hcmtlci5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcmtlci50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hcmtlci50eXBlID09PSB0eXBlICYmIGluZGV4ID09PSBtYXJrZXIuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNldFBvc2l0aW9uXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRQb3NpdGlvbihmZW4pIHtcbiAgICAgICAgICAgIGlmIChmZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBmZW4ucmVwbGFjZSgvXlxccyovLCBcIlwiKS5yZXBsYWNlKC9cXHMqJC8sIFwiXCIpLnNwbGl0KC9cXC98XFxzLyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcGFydCA9IDA7IHBhcnQgPCA4OyBwYXJ0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHBhcnRzWzcgLSBwYXJ0XS5yZXBsYWNlKC9cXGQvZywgZnVuY3Rpb24gKHN0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bVNwYWNlcyA9IHBhcnNlSW50KHN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVNwYWNlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ICs9ICctJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IDg7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXIgPSByb3cuc3Vic3RyKGMsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBpZWNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyICE9PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hhci50b1VwcGVyQ2FzZSgpID09PSBjaGFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpZWNlID0gXCJ3XCIgKyBjaGFyLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGllY2UgPSBcImJcIiArIGNoYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcXVhcmVzW3BhcnQgKiA4ICsgY10gPSBwaWVjZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImdldFBvc2l0aW9uXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb3NpdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IG5ldyBBcnJheSg4KS5maWxsKFwiXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgcGFydCA9IDA7IHBhcnQgPCA4OyBwYXJ0KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGllY2UgPSB0aGlzLnNxdWFyZXNbcGFydCAqIDggKyBpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpZWNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZUNvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZUNvdW50ZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHNbNyAtIHBhcnRdICs9IHNwYWNlQ291bnRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFjZUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gcGllY2Uuc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBwaWVjZS5zdWJzdHIoMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3IgPT09IFwid1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHNbNyAtIHBhcnRdICs9IG5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydHNbNyAtIHBhcnRdICs9IG5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlQ291bnRlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydHNbNyAtIHBhcnRdICs9IHNwYWNlQ291bnRlcjtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VDb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJzcXVhcmVUb0luZGV4XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzcXVhcmVUb0luZGV4KHNxdWFyZSkge1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBzcXVhcmUuc3Vic3RyKDAsIDEpLmNoYXJDb2RlQXQoMCkgLSA5NztcbiAgICAgICAgICAgIHZhciByYW5rID0gc3F1YXJlLnN1YnN0cigxLCAxKSAtIDE7XG4gICAgICAgICAgICByZXR1cm4gOCAqIHJhbmsgKyBmaWxlO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENoZXNzYm9hcmRTdGF0ZTtcbn0oKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2hlc3Nib2FyZFN0YXRlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkNoZXNzYm9hcmRWaWV3ID0gdW5kZWZpbmVkO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpOyAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBBdXRob3IgYW5kIGNvcHlyaWdodDogU3RlZmFuIEhhYWNrIChodHRwczovL3NoYWFjay5jb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL3NoYWFjay9jbS1jaGVzc2JvYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogTGljZW5zZTogTUlULCBzZWUgZmlsZSAnTElDRU5TRSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cblxudmFyIF9TdmcgPSByZXF1aXJlKFwiLi4vc3Zqcy1zdmcvc3JjL3N2anMtc3ZnL1N2Zy5qc1wiKTtcblxudmFyIF9DaGVzc2JvYXJkU3RhdGUgPSByZXF1aXJlKFwiLi9DaGVzc2JvYXJkU3RhdGUuanNcIik7XG5cbnZhciBfQ2hlc3Nib2FyZE1vdmVJbnB1dCA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmRNb3ZlSW5wdXQuanNcIik7XG5cbnZhciBfQ2hlc3Nib2FyZCA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmQuanNcIik7XG5cbnZhciBfQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbiA9IHJlcXVpcmUoXCIuL0NoZXNzYm9hcmRQaWVjZXNBbmltYXRpb24uanNcIik7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBTUFJJVEVfTE9BRElOR19TVEFUVVMgPSB7XG4gICAgbm90TG9hZGVkOiAxLFxuICAgIGxvYWRpbmc6IDIsXG4gICAgbG9hZGVkOiAzXG59O1xuXG52YXIgQ2hlc3Nib2FyZFZpZXcgPSBleHBvcnRzLkNoZXNzYm9hcmRWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENoZXNzYm9hcmRWaWV3KGNoZXNzYm9hcmQsIGNhbGxiYWNrQWZ0ZXJDcmVhdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaGVzc2JvYXJkVmlldyk7XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25SdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hlc3Nib2FyZCA9IGNoZXNzYm9hcmQ7XG4gICAgICAgIHRoaXMuc3ByaXRlTG9hZFdhaXRpbmdUcmllcyA9IDA7XG4gICAgICAgIHRoaXMubG9hZFNwcml0ZShjaGVzc2JvYXJkLnByb3BzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5zcHJpdGVMb2FkV2FpdERlbGF5ID0gMDtcbiAgICAgICAgICAgIF90aGlzLm1vdmVJbnB1dCA9IG5ldyBfQ2hlc3Nib2FyZE1vdmVJbnB1dC5DaGVzc2JvYXJkTW92ZUlucHV0KF90aGlzLCBjaGVzc2JvYXJkLnN0YXRlLCBjaGVzc2JvYXJkLnByb3BzLCBfdGhpcy5tb3ZlU3RhcnRDYWxsYmFjay5iaW5kKF90aGlzKSwgX3RoaXMubW92ZURvbmVDYWxsYmFjay5iaW5kKF90aGlzKSwgX3RoaXMubW92ZUNhbmNlbGVkQ2FsbGJhY2suYmluZChfdGhpcykpO1xuICAgICAgICAgICAgX3RoaXMuYW5pbWF0aW9uUXVldWUgPSBbXTtcbiAgICAgICAgICAgIGlmIChjaGVzc2JvYXJkLnByb3BzLnJlc3BvbnNpdmUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXNpemVMaXN0ZW5lciA9IF90aGlzLmhhbmRsZVJlc2l6ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBfdGhpcy5yZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2hlc3Nib2FyZC5wcm9wcy5tb3ZlSW5wdXRNb2RlICE9PSBfQ2hlc3Nib2FyZC5NT1ZFX0lOUFVUX01PREUudmlld09ubHkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wb2ludGVyRG93bkxpc3RlbmVyID0gX3RoaXMucG9pbnRlckRvd25IYW5kbGVyLmJpbmQoX3RoaXMpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZXNzYm9hcmQuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIF90aGlzLnBvaW50ZXJEb3duTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZXNzYm9hcmQuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBfdGhpcy5wb2ludGVyRG93bkxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmNyZWF0ZVN2Z0FuZEdyb3VwcygpO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlTWV0cmljcygpO1xuICAgICAgICAgICAgY2FsbGJhY2tBZnRlckNyZWF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDaGVzc2JvYXJkVmlldywgW3tcbiAgICAgICAga2V5OiBcInBvaW50ZXJEb3duSGFuZGxlclwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcG9pbnRlckRvd25IYW5kbGVyKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW92ZUlucHV0Lm9uUG9pbnRlckRvd24oZSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkZXN0cm95XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlSW5wdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLnBvaW50ZXJEb3duTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5wb2ludGVyRG93bkxpc3RlbmVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5yZXNpemVEZWJvdW5jZSk7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMucmVkcmF3RGVib3VuY2UpO1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmRyYXdQaWVjZXNEZWJvdW5jZSk7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuZHJhd01hcmtlcnNEZWJvdW5jZSk7XG4gICAgICAgICAgICBfU3ZnLlN2Zy5yZW1vdmVFbGVtZW50KHRoaXMuc3ZnKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUXVldWUgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmN1cnJlbnRBbmltYXRpb24uZnJhbWVIYW5kbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3ByaXRlIC8vXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJsb2FkU3ByaXRlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkU3ByaXRlKHByb3BzLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChDaGVzc2JvYXJkVmlldy5zcHJpdGVMb2FkaW5nU3RhdHVzID09PSBTUFJJVEVfTE9BRElOR19TVEFUVVMubm90TG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgQ2hlc3Nib2FyZFZpZXcuc3ByaXRlTG9hZGluZ1N0YXR1cyA9IFNQUklURV9MT0FESU5HX1NUQVRVUy5sb2FkaW5nO1xuICAgICAgICAgICAgICAgIF9TdmcuU3ZnLmxvYWRTcHJpdGUocHJvcHMuc3ByaXRlLnVybCwgW1wid2tcIiwgXCJ3cVwiLCBcIndyXCIsIFwid2JcIiwgXCJ3blwiLCBcIndwXCIsIFwiYmtcIiwgXCJicVwiLCBcImJyXCIsIFwiYmJcIiwgXCJiblwiLCBcImJwXCIsIFwibWFya2VyMVwiLCBcIm1hcmtlcjJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgQ2hlc3Nib2FyZFZpZXcuc3ByaXRlTG9hZGluZ1N0YXR1cyA9IFNQUklURV9MT0FESU5HX1NUQVRVUy5sb2FkZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSwgcHJvcHMuc3ByaXRlLmdyaWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChDaGVzc2JvYXJkVmlldy5zcHJpdGVMb2FkaW5nU3RhdHVzID09PSBTUFJJVEVfTE9BRElOR19TVEFUVVMubG9hZGluZykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuc3ByaXRlTG9hZFdhaXRpbmdUcmllcysrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMyLnNwcml0ZUxvYWRXYWl0aW5nVHJpZXMgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMyLmxvYWRTcHJpdGUocHJvcHMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lb3V0IGxvYWRpbmcgc3ByaXRlXCIsIHByb3BzLnNwcml0ZS51cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zcHJpdGVMb2FkV2FpdERlbGF5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUxvYWRXYWl0RGVsYXkgKz0gMTA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKENoZXNzYm9hcmRWaWV3LnNwcml0ZUxvYWRpbmdTdGF0dXMgPT09IFNQUklURV9MT0FESU5HX1NUQVRVUy5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IgQ2hlc3Nib2FyZFZpZXcuc3ByaXRlTG9hZGluZ1N0YXR1c1wiLCBDaGVzc2JvYXJkVmlldy5zcHJpdGVMb2FkaW5nU3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERyYXcgLy9cblxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNyZWF0ZVN2Z0FuZEdyb3Vwc1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlU3ZnQW5kR3JvdXBzKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ZnKSB7XG4gICAgICAgICAgICAgICAgX1N2Zy5TdmcucmVtb3ZlRWxlbWVudCh0aGlzLnN2Zyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN2ZyA9IF9TdmcuU3ZnLmNyZWF0ZVN2Zyh0aGlzLmNoZXNzYm9hcmQuZWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgY3NzQ2xhc3MgPSB0aGlzLmNoZXNzYm9hcmQucHJvcHMuc3R5bGUuY3NzQ2xhc3MgPyB0aGlzLmNoZXNzYm9hcmQucHJvcHMuc3R5bGUuY3NzQ2xhc3MgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZXNzYm9hcmQucHJvcHMuc3R5bGUuc2hvd0JvcmRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY20tY2hlc3Nib2FyZCBoYXMtYm9yZGVyIFwiICsgY3NzQ2xhc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN2Zy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImNtLWNoZXNzYm9hcmQgXCIgKyBjc3NDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1ldHJpY3MoKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRHcm91cCA9IF9TdmcuU3ZnLmFkZEVsZW1lbnQodGhpcy5zdmcsIFwiZ1wiLCB7IGNsYXNzOiBcImJvYXJkXCIgfSk7XG4gICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzR3JvdXAgPSBfU3ZnLlN2Zy5hZGRFbGVtZW50KHRoaXMuc3ZnLCBcImdcIiwgeyBjbGFzczogXCJjb29yZGluYXRlc1wiIH0pO1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJzR3JvdXAgPSBfU3ZnLlN2Zy5hZGRFbGVtZW50KHRoaXMuc3ZnLCBcImdcIiwgeyBjbGFzczogXCJtYXJrZXJzXCIgfSk7XG4gICAgICAgICAgICB0aGlzLnBpZWNlc0dyb3VwID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLnN2ZywgXCJnXCIsIHsgY2xhc3M6IFwicGllY2VzXCIgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJ1cGRhdGVNZXRyaWNzXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVNZXRyaWNzKCkge1xuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2hlc3Nib2FyZC5lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNoZXNzYm9hcmQuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVzc2JvYXJkLnByb3BzLnN0eWxlLnNob3dCb3JkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlclNpemUgPSB0aGlzLndpZHRoIC8gMzI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyU2l6ZSA9IHRoaXMud2lkdGggLyAzMjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlubmVyV2lkdGggPSB0aGlzLndpZHRoIC0gMiAqIHRoaXMuYm9yZGVyU2l6ZTtcbiAgICAgICAgICAgIHRoaXMuaW5uZXJIZWlnaHQgPSB0aGlzLmhlaWdodCAtIDIgKiB0aGlzLmJvcmRlclNpemU7XG4gICAgICAgICAgICB0aGlzLnNxdWFyZVdpZHRoID0gdGhpcy5pbm5lcldpZHRoIC8gODtcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlSGVpZ2h0ID0gdGhpcy5pbm5lckhlaWdodCAvIDg7XG4gICAgICAgICAgICB0aGlzLnNjYWxpbmdYID0gdGhpcy5zcXVhcmVXaWR0aCAvIHRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zcHJpdGUuZ3JpZDtcbiAgICAgICAgICAgIHRoaXMuc2NhbGluZ1kgPSB0aGlzLnNxdWFyZUhlaWdodCAvIHRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zcHJpdGUuZ3JpZDtcbiAgICAgICAgICAgIHRoaXMucGllY2VYVHJhbnNsYXRlID0gdGhpcy5zcXVhcmVXaWR0aCAvIDIgLSB0aGlzLmNoZXNzYm9hcmQucHJvcHMuc3ByaXRlLmdyaWQgKiB0aGlzLnNjYWxpbmdZIC8gMjtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImhhbmRsZVJlc2l6ZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVzaXplKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5yZXNpemVEZWJvdW5jZSk7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZURlYm91bmNlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzMy5jaGVzc2JvYXJkLmVsZW1lbnQub2Zmc2V0V2lkdGggIT09IF90aGlzMy53aWR0aCB8fCBfdGhpczMuY2hlc3Nib2FyZC5lbGVtZW50Lm9mZnNldEhlaWdodCAhPT0gX3RoaXMzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMudXBkYXRlTWV0cmljcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpczMucmVkcmF3KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJyZWRyYXdcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlZHJhdygpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KF90aGlzNC5yZWRyYXdEZWJvdW5jZSk7XG4gICAgICAgICAgICAgICAgX3RoaXM0LnJlZHJhd0RlYm91bmNlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzNC5kcmF3Qm9hcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM0LmRyYXdDb29yZGluYXRlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpczQuZHJhd01hcmtlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM0LnNldEN1cnNvcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF90aGlzNC5kcmF3UGllY2VzRGVib3VuY2VkKF90aGlzNC5jaGVzc2JvYXJkLnN0YXRlLnNxdWFyZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCb2FyZCAvL1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZHJhd0JvYXJkXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3Qm9hcmQoKSB7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5ib2FyZEdyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkR3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5ib2FyZEdyb3VwLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm9hcmRCb3JkZXIgPSBfU3ZnLlN2Zy5hZGRFbGVtZW50KHRoaXMuYm9hcmRHcm91cCwgXCJyZWN0XCIsIHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfSk7XG4gICAgICAgICAgICBib2FyZEJvcmRlci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJvcmRlclwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZXNzYm9hcmQucHJvcHMuc3R5bGUuc2hvd0JvcmRlcikge1xuICAgICAgICAgICAgICAgIHZhciBpbm5lclBvcyA9IHRoaXMuYm9yZGVyU2l6ZSAtIHRoaXMuYm9yZGVyU2l6ZSAvIDk7XG4gICAgICAgICAgICAgICAgdmFyIGJvcmRlcklubmVyID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLmJvYXJkR3JvdXAsIFwicmVjdFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGlubmVyUG9zLFxuICAgICAgICAgICAgICAgICAgICB5OiBpbm5lclBvcyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggLSBpbm5lclBvcyAqIDIsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQgLSBpbm5lclBvcyAqIDJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBib3JkZXJJbm5lci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJvcmRlci1pbm5lclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2hlc3Nib2FyZC5zdGF0ZS5vcmllbnRhdGlvbiA9PT0gX0NoZXNzYm9hcmQuQ09MT1Iud2hpdGUgPyBpIDogNjMgLSBpO1xuICAgICAgICAgICAgICAgIHZhciBzcXVhcmVDb2xvciA9ICg5ICogaW5kZXggJiA4KSA9PT0gMCA/ICdibGFjaycgOiAnd2hpdGUnO1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZENsYXNzID0gXCJzcXVhcmUgXCIgKyBzcXVhcmVDb2xvcjtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSB0aGlzLnNxdWFyZUluZGV4VG9Qb2ludChpbmRleCk7XG4gICAgICAgICAgICAgICAgdmFyIHNxdWFyZVJlY3QgPSBfU3ZnLlN2Zy5hZGRFbGVtZW50KHRoaXMuYm9hcmRHcm91cCwgXCJyZWN0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogcG9pbnQueCwgeTogcG9pbnQueSwgd2lkdGg6IHRoaXMuc3F1YXJlV2lkdGgsIGhlaWdodDogdGhpcy5zcXVhcmVIZWlnaHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzcXVhcmVSZWN0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGZpZWxkQ2xhc3MpO1xuICAgICAgICAgICAgICAgIHNxdWFyZVJlY3Quc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBcIlwiICsgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZHJhd0Nvb3JkaW5hdGVzXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zdHlsZS5zaG93Q29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jb29yZGluYXRlc0dyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVzR3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5jb29yZGluYXRlc0dyb3VwLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaW5saW5lID0gIXRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zdHlsZS5zaG93Qm9yZGVyO1xuICAgICAgICAgICAgZm9yICh2YXIgZmlsZSA9IDA7IGZpbGUgPCA4OyBmaWxlKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMuYm9yZGVyU2l6ZSArICgxOCArIHRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zcHJpdGUuZ3JpZCAqIGZpbGUpICogdGhpcy5zY2FsaW5nWDtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gdGhpcy5zY2FsaW5nWSAqIDIuNjtcbiAgICAgICAgICAgICAgICB2YXIgY3NzQ2xhc3MgPSBcImNvb3JkaW5hdGUgZmlsZVwiO1xuICAgICAgICAgICAgICAgIGlmIChpbmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggKyB0aGlzLnNjYWxpbmdYICogMTUuNTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlc3Nib2FyZC5wcm9wcy5zdHlsZS5zaG93Qm9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0geSAtIHRoaXMuc2NhbGluZ1kgKiAxMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjc3NDbGFzcyArPSBmaWxlICUgMiA/IFwiIGRhcmtcIiA6IFwiIGxpZ2h0XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0ZXh0RWxlbWVudCA9IF9TdmcuU3ZnLmFkZEVsZW1lbnQodGhpcy5jb29yZGluYXRlc0dyb3VwLCBcInRleHRcIiwge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogY3NzQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBcImZvbnQtc2l6ZTogXCIgKyB0aGlzLnNjYWxpbmdZICogOCArIFwicHhcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZXNzYm9hcmQuc3RhdGUub3JpZW50YXRpb24gPT09IF9DaGVzc2JvYXJkLkNPTE9SLndoaXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50LnRleHRDb250ZW50ID0gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGZpbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50LnRleHRDb250ZW50ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgxMDQgLSBmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciByYW5rID0gMDsgcmFuayA8IDg7IHJhbmsrKykge1xuICAgICAgICAgICAgICAgIHZhciBfeCA9IHRoaXMuYm9yZGVyU2l6ZSAvIDMuNztcbiAgICAgICAgICAgICAgICB2YXIgX3kgPSB0aGlzLmJvcmRlclNpemUgKyAyNCAqIHRoaXMuc2NhbGluZ1kgKyByYW5rICogdGhpcy5zcXVhcmVIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIF9jc3NDbGFzcyA9IFwiY29vcmRpbmF0ZSByYW5rXCI7XG4gICAgICAgICAgICAgICAgaWYgKGlubGluZSkge1xuICAgICAgICAgICAgICAgICAgICBfY3NzQ2xhc3MgKz0gcmFuayAlIDIgPyBcIiBsaWdodFwiIDogXCIgZGFya1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVzc2JvYXJkLnByb3BzLnN0eWxlLnNob3dCb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF94ID0gX3ggKyB0aGlzLnNjYWxpbmdYICogMTA7XG4gICAgICAgICAgICAgICAgICAgICAgICBfeSA9IF95IC0gdGhpcy5zY2FsaW5nWSAqIDE1O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ggPSBfeCArIHRoaXMuc2NhbGluZ1ggKiAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3kgPSBfeSAtIHRoaXMuc2NhbGluZ1kgKiAxNTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgX3RleHRFbGVtZW50ID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLmNvb3JkaW5hdGVzR3JvdXAsIFwidGV4dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiBfY3NzQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHg6IF94LFxuICAgICAgICAgICAgICAgICAgICB5OiBfeSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IFwiZm9udC1zaXplOiBcIiArIHRoaXMuc2NhbGluZ1kgKiA4ICsgXCJweFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlc3Nib2FyZC5zdGF0ZS5vcmllbnRhdGlvbiA9PT0gX0NoZXNzYm9hcmQuQ09MT1Iud2hpdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RleHRFbGVtZW50LnRleHRDb250ZW50ID0gOCAtIHJhbms7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RleHRFbGVtZW50LnRleHRDb250ZW50ID0gMSArIHJhbms7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGllY2VzIC8vXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkcmF3UGllY2VzRGVib3VuY2VkXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3UGllY2VzRGVib3VuY2VkKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBzcXVhcmVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLmNoZXNzYm9hcmQuc3RhdGUuc3F1YXJlcztcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmRyYXdQaWVjZXNEZWJvdW5jZSk7XG4gICAgICAgICAgICB0aGlzLmRyYXdQaWVjZXNEZWJvdW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzNS5kcmF3UGllY2VzKHNxdWFyZXMpO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZHJhd1BpZWNlc1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZHJhd1BpZWNlcygpIHtcbiAgICAgICAgICAgIHZhciBzcXVhcmVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0aGlzLmNoZXNzYm9hcmQuc3RhdGUuc3F1YXJlcztcblxuICAgICAgICAgICAgd2hpbGUgKHRoaXMucGllY2VzR3JvdXAuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGllY2VzR3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5waWVjZXNHcm91cC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBpZWNlTmFtZSA9IHNxdWFyZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBpZWNlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdQaWVjZShpLCBwaWVjZU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImRyYXdQaWVjZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZHJhd1BpZWNlKGluZGV4LCBwaWVjZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBwaWVjZUdyb3VwID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLnBpZWNlc0dyb3VwLCBcImdcIik7XG4gICAgICAgICAgICBwaWVjZUdyb3VwLnNldEF0dHJpYnV0ZShcImRhdGEtcGllY2VcIiwgcGllY2VOYW1lKTtcbiAgICAgICAgICAgIHBpZWNlR3JvdXAuc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBpbmRleCk7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSB0aGlzLnNxdWFyZUluZGV4VG9Qb2ludChpbmRleCk7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtID0gdGhpcy5zdmcuY3JlYXRlU1ZHVHJhbnNmb3JtKCk7XG4gICAgICAgICAgICB0cmFuc2Zvcm0uc2V0VHJhbnNsYXRlKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgICAgICAgcGllY2VHcm91cC50cmFuc2Zvcm0uYmFzZVZhbC5hcHBlbmRJdGVtKHRyYW5zZm9ybSk7XG4gICAgICAgICAgICB2YXIgcGllY2VVc2UgPSBfU3ZnLlN2Zy5hZGRFbGVtZW50KHBpZWNlR3JvdXAsIFwidXNlXCIsIHsgXCJocmVmXCI6IFwiI1wiICsgcGllY2VOYW1lLCBcImNsYXNzXCI6IFwicGllY2VcIiB9KTtcbiAgICAgICAgICAgIC8vIGNlbnRlciBvbiBzcXVhcmVcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1UcmFuc2xhdGUgPSB0aGlzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRyYW5zZm9ybVRyYW5zbGF0ZS5zZXRUcmFuc2xhdGUodGhpcy5waWVjZVhUcmFuc2xhdGUsIDApO1xuICAgICAgICAgICAgcGllY2VVc2UudHJhbnNmb3JtLmJhc2VWYWwuYXBwZW5kSXRlbSh0cmFuc2Zvcm1UcmFuc2xhdGUpO1xuICAgICAgICAgICAgLy8gc2NhbGVcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1TY2FsZSA9IHRoaXMuc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybSgpO1xuICAgICAgICAgICAgdHJhbnNmb3JtU2NhbGUuc2V0U2NhbGUodGhpcy5zY2FsaW5nWSwgdGhpcy5zY2FsaW5nWSk7XG4gICAgICAgICAgICBwaWVjZVVzZS50cmFuc2Zvcm0uYmFzZVZhbC5hcHBlbmRJdGVtKHRyYW5zZm9ybVNjYWxlKTtcbiAgICAgICAgICAgIHJldHVybiBwaWVjZUdyb3VwO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwic2V0UGllY2VWaXNpYmlsaXR5XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRQaWVjZVZpc2liaWxpdHkoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciB2aXNpYmxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgcGllY2UgPSB0aGlzLmdldFBpZWNlKGluZGV4KTtcbiAgICAgICAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgcGllY2Uuc2V0QXR0cmlidXRlKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBpZWNlLnNldEF0dHJpYnV0ZShcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJnZXRQaWVjZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UGllY2UoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBpZWNlc0dyb3VwLnF1ZXJ5U2VsZWN0b3IoXCJnW2RhdGEtaW5kZXg9J1wiICsgaW5kZXggKyBcIiddXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFya2VycyAvL1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZHJhd01hcmtlcnNEZWJvdW5jZWRcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXdNYXJrZXJzRGVib3VuY2VkKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5kcmF3TWFya2Vyc0RlYm91bmNlKTtcbiAgICAgICAgICAgIHRoaXMuZHJhd01hcmtlcnNEZWJvdW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzNi5kcmF3TWFya2VycygpO1xuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZHJhd01hcmtlcnNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXdNYXJrZXJzKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHdoaWxlICh0aGlzLm1hcmtlcnNHcm91cC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrZXJzR3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5tYXJrZXJzR3JvdXAuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNoZXNzYm9hcmQuc3RhdGUubWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBfdGhpczcuZHJhd01hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJkcmF3TWFya2VyXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3TWFya2VyKG1hcmtlcikge1xuICAgICAgICAgICAgdmFyIG1hcmtlckdyb3VwID0gX1N2Zy5TdmcuYWRkRWxlbWVudCh0aGlzLm1hcmtlcnNHcm91cCwgXCJnXCIpO1xuICAgICAgICAgICAgbWFya2VyR3JvdXAuc2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiLCBtYXJrZXIuaW5kZXgpO1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gdGhpcy5zcXVhcmVJbmRleFRvUG9pbnQobWFya2VyLmluZGV4KTtcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm0gPSB0aGlzLnN2Zy5jcmVhdGVTVkdUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5zZXRUcmFuc2xhdGUocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICAgICAgICBtYXJrZXJHcm91cC50cmFuc2Zvcm0uYmFzZVZhbC5hcHBlbmRJdGVtKHRyYW5zZm9ybSk7XG4gICAgICAgICAgICB2YXIgbWFya2VyVXNlID0gX1N2Zy5TdmcuYWRkRWxlbWVudChtYXJrZXJHcm91cCwgXCJ1c2VcIiwgeyBocmVmOiBcIiNcIiArIG1hcmtlci50eXBlLnNsaWNlLCBjbGFzczogXCJtYXJrZXIgXCIgKyBtYXJrZXIudHlwZS5jbGFzcyB9KTtcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1TY2FsZSA9IHRoaXMuc3ZnLmNyZWF0ZVNWR1RyYW5zZm9ybSgpO1xuICAgICAgICAgICAgdHJhbnNmb3JtU2NhbGUuc2V0U2NhbGUodGhpcy5zY2FsaW5nWCwgdGhpcy5zY2FsaW5nWSk7XG4gICAgICAgICAgICBtYXJrZXJVc2UudHJhbnNmb3JtLmJhc2VWYWwuYXBwZW5kSXRlbSh0cmFuc2Zvcm1TY2FsZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFya2VyR3JvdXA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbmltYXRpb24gcXVldWUgLy9cblxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImFuaW1hdGVQaWVjZXNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFuaW1hdGVQaWVjZXMoZnJvbVNxdWFyZXMsIHRvU3F1YXJlcywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUXVldWUucHVzaCh7IGZyb21TcXVhcmVzOiBmcm9tU3F1YXJlcywgdG9TcXVhcmVzOiB0b1NxdWFyZXMsIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25SdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0UGllY2VBbmltYXRpb25JblF1ZXVlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJuZXh0UGllY2VBbmltYXRpb25JblF1ZXVlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0UGllY2VBbmltYXRpb25JblF1ZXVlKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzOCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBuZXh0QW5pbWF0aW9uID0gdGhpcy5hbmltYXRpb25RdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKG5leHRBbmltYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEFuaW1hdGlvbiA9IG5ldyBfQ2hlc3Nib2FyZFBpZWNlc0FuaW1hdGlvbi5DaGVzc2JvYXJkUGllY2VzQW5pbWF0aW9uKHRoaXMsIG5leHRBbmltYXRpb24uZnJvbVNxdWFyZXMsIG5leHRBbmltYXRpb24udG9TcXVhcmVzLCB0aGlzLmNoZXNzYm9hcmQucHJvcHMuYW5pbWF0aW9uRHVyYXRpb24gLyAodGhpcy5hbmltYXRpb25RdWV1ZS5sZW5ndGggKyAxKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV90aGlzOC5tb3ZlSW5wdXQuZHJhZ2FibGVQaWVjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXM4LmRyYXdQaWVjZXMobmV4dEFuaW1hdGlvbi50b1NxdWFyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzOC5uZXh0UGllY2VBbmltYXRpb25JblF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QW5pbWF0aW9uLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QW5pbWF0aW9uLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGxiYWNrcyAvL1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6IFwibW92ZVN0YXJ0Q2FsbGJhY2tcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmVTdGFydENhbGxiYWNrKGluZGV4KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVzc2JvYXJkLm1vdmVJbnB1dENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlc3Nib2FyZC5tb3ZlSW5wdXRDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICAgIGNoZXNzYm9hcmQ6IHRoaXMuY2hlc3Nib2FyZCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogX0NoZXNzYm9hcmQuSU5QVVRfRVZFTlRfVFlQRS5tb3ZlU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHNxdWFyZTogX0NoZXNzYm9hcmRTdGF0ZS5TUVVBUkVfQ09PUkRJTkFURVNbaW5kZXhdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwibW92ZURvbmVDYWxsYmFja1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZURvbmVDYWxsYmFjayhmcm9tSW5kZXgsIHRvSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZXNzYm9hcmQubW92ZUlucHV0Q2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVzc2JvYXJkLm1vdmVJbnB1dENhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgY2hlc3Nib2FyZDogdGhpcy5jaGVzc2JvYXJkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBfQ2hlc3Nib2FyZC5JTlBVVF9FVkVOVF9UWVBFLm1vdmVEb25lLFxuICAgICAgICAgICAgICAgICAgICBzcXVhcmVGcm9tOiBfQ2hlc3Nib2FyZFN0YXRlLlNRVUFSRV9DT09SRElOQVRFU1tmcm9tSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICBzcXVhcmVUbzogX0NoZXNzYm9hcmRTdGF0ZS5TUVVBUkVfQ09PUkRJTkFURVNbdG9JbmRleF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJtb3ZlQ2FuY2VsZWRDYWxsYmFja1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZUNhbmNlbGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVzc2JvYXJkLm1vdmVJbnB1dENhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLm1vdmVJbnB1dENhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgY2hlc3Nib2FyZDogdGhpcy5jaGVzc2JvYXJkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBfQ2hlc3Nib2FyZC5JTlBVVF9FVkVOVF9UWVBFLm1vdmVDYW5jZWxlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGVscGVycyAvL1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6IFwic2V0Q3Vyc29yXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDdXJzb3IoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5jaGVzc2JvYXJkLmluaXRpYWxpemF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpczkuY2hlc3Nib2FyZC5zdGF0ZS5pbnB1dFdoaXRlRW5hYmxlZCB8fCBfdGhpczkuY2hlc3Nib2FyZC5zdGF0ZS5pbnB1dEJsYWNrRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczkuYm9hcmRHcm91cC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJvYXJkIGlucHV0LWVuYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM5LmJvYXJkR3JvdXAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJib2FyZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNxdWFyZUluZGV4VG9Qb2ludFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc3F1YXJlSW5kZXhUb1BvaW50KGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgeCA9IHZvaWQgMCxcbiAgICAgICAgICAgICAgICB5ID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlc3Nib2FyZC5zdGF0ZS5vcmllbnRhdGlvbiA9PT0gX0NoZXNzYm9hcmQuQ09MT1Iud2hpdGUpIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy5ib3JkZXJTaXplICsgaW5kZXggJSA4ICogdGhpcy5zcXVhcmVXaWR0aDtcbiAgICAgICAgICAgICAgICB5ID0gdGhpcy5ib3JkZXJTaXplICsgKDcgLSBNYXRoLmZsb29yKGluZGV4IC8gOCkpICogdGhpcy5zcXVhcmVIZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHggPSB0aGlzLmJvcmRlclNpemUgKyAoNyAtIGluZGV4ICUgOCkgKiB0aGlzLnNxdWFyZVdpZHRoO1xuICAgICAgICAgICAgICAgIHkgPSB0aGlzLmJvcmRlclNpemUgKyBNYXRoLmZsb29yKGluZGV4IC8gOCkgKiB0aGlzLnNxdWFyZUhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHg6IHgsIHk6IHkgfTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDaGVzc2JvYXJkVmlldztcbn0oKTtcblxuQ2hlc3Nib2FyZFZpZXcuc3ByaXRlTG9hZGluZ1N0YXR1cyA9IFNQUklURV9MT0FESU5HX1NUQVRVUy5ub3RMb2FkZWQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNoZXNzYm9hcmRWaWV3LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogQXV0aG9yOiBzaGFhY2tcbiAqIERhdGU6IDIzLjExLjIwMTdcbiAqL1xuXG52YXIgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuaWYgKHR5cGVvZiBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgLy8gSUVcbiAgICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xufVxuXG52YXIgU3ZnID0gZXhwb3J0cy5TdmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3ZnKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3ZnKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU3ZnLCBudWxsLCBbe1xuICAgICAgICBrZXk6IFwiY3JlYXRlU3ZnXCIsXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogY3JlYXRlIHRoZSBTdmcgaW4gdGhlIEhUTUwgRE9NXG4gICAgICAgICAqIEBwYXJhbSBjb250YWluZXJFbGVtZW50XG4gICAgICAgICAqIEByZXR1cm5zIHtFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVN2ZygpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXJFbGVtZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBudWxsO1xuXG4gICAgICAgICAgICB2YXIgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OQU1FU1BBQ0UsIFwic3ZnXCIpO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBzdmcuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdmc7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGFuIEVsZW1lbnQgdG8gYSBTVkcgRE9NXG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIG5hbWVcbiAgICAgICAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICAgICAgICogQHJldHVybnMge0VsZW1lbnR9XG4gICAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiYWRkRWxlbWVudFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRWxlbWVudChwYXJlbnQsIG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR19OQU1FU1BBQ0UsIG5hbWUpO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwidXNlXCIpIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW1wieGxpbms6aHJlZlwiXSA9IGF0dHJpYnV0ZXNbXCJocmVmXCJdOyAvLyBmaXggZm9yIHNhZmFyaVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmluZGV4T2YoXCI6XCIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGUuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS9cIiArIHZhbHVlWzBdLCB2YWx1ZVsxXSwgYXR0cmlidXRlc1thdHRyaWJ1dGVdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIGF0dHJpYnV0ZXNbYXR0cmlidXRlXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFuIEVsZW1lbnQgZnJvbSBhIFNWRyBET01cbiAgICAgICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJyZW1vdmVFbGVtZW50XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkIHNwcml0ZSBpbnRvIGh0bWwgZG9jdW1lbnQgKGFzIGBzdmcvZGVmc2ApLCBlbGVtZW50cyBjYW4gYmUgcmVmZXJlbmNlZCBieSBgdXNlYCBmcm9tIGFsbCBTdmdzIGluIHBhZ2VcbiAgICAgICAgICogQHBhcmFtIHVybFxuICAgICAgICAgKiBAcGFyYW0gZWxlbWVudElkcyBhcnJheSBvZiBlbGVtZW50LWlkcywgcmVsZXZhbnQgZm9yIGB1c2VgIGluIHRoZSBzdmdzXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsZWQgYWZ0ZXIgc3VjY2Vzc2Z1bCBsb2FkLCBwYXJhbWV0ZXIgaXMgdGhlIHN2ZyBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBncmlkIHRoZSBncmlkIHNpemUgb2YgdGhlIHNwcml0ZVxuICAgICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImxvYWRTcHJpdGVcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWRTcHJpdGUodXJsLCBlbGVtZW50SWRzLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGdyaWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDE7XG5cbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgdXJsKTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciBzdmdEb20gPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlc3BvbnNlLCBcImltYWdlL3N2Zyt4bWxcIik7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHJlbGV2YW50IG5vZGVzIHRvIHNwcml0ZS1zdmdcbiAgICAgICAgICAgICAgICB2YXIgc3ByaXRlU3ZnID0gX3RoaXMuY3JlYXRlU3ZnKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICAgICAgICAgIHNwcml0ZVN2Zy5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6IG5vbmVcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRlZnMgPSBfdGhpcy5hZGRFbGVtZW50KHNwcml0ZVN2ZywgXCJkZWZzXCIpO1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlciByZWxldmFudCBub2Rlc1xuICAgICAgICAgICAgICAgIGVsZW1lbnRJZHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50Tm9kZSA9IHN2Z0RvbS5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3IsIG5vZGUgaWQ9XCIgKyBlbGVtZW50SWQgKyBcIiBub3QgZm91bmQgaW4gc3ByaXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybUxpc3QgPSBlbGVtZW50Tm9kZS50cmFuc2Zvcm0uYmFzZVZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhbnNmb3JtTGlzdC5udW1iZXJPZkl0ZW1zOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtID0gdHJhbnNmb3JtTGlzdC5nZXRJdGVtKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlLXRyYW5zZm9ybSBpdGVtcyBvbiBncmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybS50eXBlID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybS5zZXRUcmFuc2xhdGUodHJhbnNmb3JtLm1hdHJpeC5lICUgZ3JpZCwgdHJhbnNmb3JtLm1hdHJpeC5mICUgZ3JpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlsdGVyIGFsbCBpZHMgaW4gY2hpbGRzIG9mIHRoZSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyQ2hpbGRzID0gZnVuY3Rpb24gZmlsdGVyQ2hpbGRzKGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJDaGlsZHMoY2hpbGROb2RlLmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyQ2hpbGRzKGVsZW1lbnROb2RlLmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmcy5hcHBlbmRDaGlsZChlbGVtZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhzcHJpdGVTdmcpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTdmc7XG59KCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN2Zy5qcy5tYXAiXX0=
