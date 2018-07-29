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

//# sourceMappingURL=ChessboardPiecesAnimation.js.map