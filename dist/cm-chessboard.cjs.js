'use strict';

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
