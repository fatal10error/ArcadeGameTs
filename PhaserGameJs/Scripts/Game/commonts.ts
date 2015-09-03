/// <reference path="../phaser/phaser.d.ts"/>

var Defaults =
{
    Screen:
    {
        Width: 800,
        Height: 600,
    },
    PlayerControls:
    {
        Jump: Phaser.Keyboard.SPACEBAR,
        Up: Phaser.Keyboard.W,
        Left: Phaser.Keyboard.A,
        Down: Phaser.Keyboard.S,
        Right: Phaser.Keyboard.D,
        Walk: Phaser.Keyboard.SHIFT,
    },
    BodyPhysics:
    {
        Gravity: 1000,
        MovingVelocity: 100,
        JumpVelocity: 350,
        MoveAcceleration: .02,
        InJumpAcceleration: .01,
        Weight: 100,//kg
        WeightKoeff: 100//depends from Weight
    },
    Animation:
    {
        Speed: 10,
    },
    //basic values, should be customized for different creatures by multiplying add adding
    Creature:
    {
        Health: 100, //show generic health lvl, depends from hurt and tiredness
        //Hurt can be recieved when recieve damage from enemy or falling or when much time hungry
        Hurt: 100, //actually not-hurt. Less than 100 is hurt.
        Energy: 100, //used when do power actions, like walking or using heavy weight axe
        Hungry: 100, //actually not-hungry. Less than 100 is hungry
        Tiredness: 100, //actually not-tiredness. Less than 100 is tired
    }
};

class Point {

    X: number;
    Y: number;

    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
    }
}

enum AssetType {
    Image,
    Spritesheet,
}

class Common {
    static LoadAsset(gameObj: Phaser.Game, name: string, type: AssetType, path: string, position?: Point) {
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
}

interface String {
    format(...args: string[]): string;
}

String.prototype.format = function (...args: string[]) {
    return this.replace(/{(\d+)}/g, function (match, numb) {
        return typeof args[numb] != 'undefined'
            ? args[numb]
            : match
            ;
    });
}


