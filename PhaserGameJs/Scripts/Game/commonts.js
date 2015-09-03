/// <reference path="../phaser/phaser.d.ts"/>
var Defaults = {
    Screen: {
        Width: 800,
        Height: 600,
    },
    PlayerControls: {
        Jump: Phaser.Keyboard.SPACEBAR,
        Up: Phaser.Keyboard.W,
        Left: Phaser.Keyboard.A,
        Down: Phaser.Keyboard.S,
        Right: Phaser.Keyboard.D,
        Walk: Phaser.Keyboard.SHIFT,
    },
    BodyPhysics: {
        Gravity: 1000,
        MovingVelocity: 100,
        JumpVelocity: 350,
        MoveAcceleration: .02,
        InJumpAcceleration: .01,
        Weight: 100,
        WeightKoeff: 100 //depends from Weight
    },
    Animation: {
        Speed: 10,
    },
    //basic values, should be customized for different creatures by multiplying add adding
    Creature: {
        Health: 100,
        //Hurt can be recieved when recieve damage from enemy or falling or when much time hungry
        Hurt: 100,
        Energy: 100,
        Hungry: 100,
        Tiredness: 100,
    }
};
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.X = x;
        this.Y = y;
    }
    return Point;
})();
var AssetType;
(function (AssetType) {
    AssetType[AssetType["Image"] = 0] = "Image";
    AssetType[AssetType["Spritesheet"] = 1] = "Spritesheet";
})(AssetType || (AssetType = {}));
var Common = (function () {
    function Common() {
    }
    Common.LoadAsset = function (gameObj, name, type, path, position) {
        switch (type) {
            case AssetType.Image:
                gameObj.load.image(name, path);
                break;
            case AssetType.Spritesheet:
                gameObj.load.spritesheet(name, path, position.X, position.Y);
                break;
            default:
                console.log("Was not able to load asset: Name='{0}', Type='{1}', Path='{2}'".format(name, type.toString(), path));
                break;
        }
    };
    ;
    return Common;
})();
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    return this.replace(/{(\d+)}/g, function (match, numb) {
        return typeof args[numb] != 'undefined'
            ? args[numb]
            : match;
    });
};
//# sourceMappingURL=commonts.js.map