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

//# sourceMappingURL=ChessboardState.js.map