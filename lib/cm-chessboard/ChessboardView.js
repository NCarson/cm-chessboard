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

//this a circular 
//import {COLOR, MOVE_INPUT_MODE, INPUT_EVENT_TYPE} from "./Chessboard.js"


var _Svg = require("./Svg.js");

var _ChessboardState = require("./ChessboardState.js");

var _ChessboardMoveInput = require("./ChessboardMoveInput.js");

var _ChessboardPiecesAnimation = require("./ChessboardPiecesAnimation.js");

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
            _this.moveInput = new _ChessboardMoveInput.ChessboardMoveInput(_this, chessboard.state, chessboard.props, _this.moveStartCallback.bind(_this), _this.moveDoneCallback.bind(_this), _this.moveCanceledCallback.bind(_this));
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
                var index = this.chessboard.state.orientation === COLOR.white ? i : 63 - i;
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
                var _textElement = _Svg.Svg.addElement(this.coordinatesGroup, "text", {
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
                    type: INPUT_EVENT_TYPE.moveStart,
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
                    type: INPUT_EVENT_TYPE.moveDone,
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

//# sourceMappingURL=ChessboardView.js.map