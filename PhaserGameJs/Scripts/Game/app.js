/// <reference path="commonts.ts"/>
/// <reference path="../phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TheGame;
(function (TheGame) {
    var Gamer = (function () {
        function Gamer(_parent) {
            this.weight = Defaults.BodyPhysics.Weight; //depends on which acceleration will get creature
            this.health = Defaults.Creature.Health;
            this.energy = Defaults.Creature.Energy;
            this.hungry = Defaults.Creature.Hungry;
            this.tiredness = Defaults.Creature.Tiredness;
            this.hurt = Defaults.Creature.Hurt;
            this.currentHealth = Defaults.Creature.Health;
            this.currentEnergy = Defaults.Creature.Energy;
            this.currentHungry = Defaults.Creature.Hungry;
            this.currentTiredness = Defaults.Creature.Tiredness;
            this.currentHurt = Defaults.Creature.Hurt;
            this.score = 0;
            this.jumpedCount = 0; //qty of jumps
            this.pressingJump = false; //jump key is pressing
            this.beforeJumpingMoveVelocity = 0;
            this.inJumpVelocity = 0;
            this.moveVelocity = 0;
            this.parentGame = _parent;
            this.player = this.parentGame.game.add.sprite(32, this.parentGame.game.world.height - 150, 'dude');
            this.parentGame.game.physics.arcade.enable(this.player); //physics
            this.player.body.bounce.y = 0;
            this.player.body.gravity.y = Defaults.BodyPhysics.Gravity;
            this.player.body.collideWorldBounds = true;
            this.player.animations.add('left', [0, 1, 2, 3], Defaults.Animation.Speed, true);
            this.player.animations.add('right', [5, 6, 7, 8], Defaults.Animation.Speed, true);
            this.playerController = {
                Up: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Up),
                Down: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Down),
                Left: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Left),
                Right: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Right),
                Jump: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Jump),
                Walk: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Walk),
            };
        }
        ;
        Gamer.prototype.update = function () {
            //var that = Gamer;
            //  Reset the players velocity (movement)
            this.player.body.velocity.x = 0;
            this.collisions();
            //console.log(that.player.body.touching.down ? "touched down" : "in air");
            //console.log(that.jumpedCount);
            if (this.player.body.touching.down)
                this.jumpedCount = 0;
            this.input();
        };
        ;
        Gamer.prototype.collisions = function () {
            this.parentGame.game.physics.arcade.collide(this.player, this.parentGame.platforms);
            this.parentGame.game.physics.arcade.collide(this.player, this.parentGame.items);
            this.parentGame.game.physics.arcade.overlap(this.player, this.parentGame.stars, this.collectStar, null, this);
        };
        ;
        Gamer.prototype.changeVelocity = function (velocity, speedIncrement) {
            if (velocity > 0) {
                if ((velocity + speedIncrement) >= 0)
                    return velocity + speedIncrement;
            }
            else if (velocity < 0) {
                if ((velocity + speedIncrement) <= 0)
                    return velocity + speedIncrement;
            }
            return velocity;
        };
        ;
        Gamer.prototype.input = function () {
            //var cursors = this.parentGame.game.input.keyboard.createCursorKeys();
            //if (cursors.left.isDown) {
            //    this.player.body.velocity.x = -Defaults.BodyPhysics.MovingVelocity;
            //    this.player.animations.play('left');
            //}
            //else if (cursors.right.isDown) {
            //    this.player.body.velocity.x = Defaults.BodyPhysics.MovingVelocity;
            //    this.player.animations.play('right');
            //}
            //else {
            //    this.player.animations.stop();
            //    this.player.frame = 4;
            //}
            var regularMoveVelocity = Defaults.BodyPhysics.MovingVelocity;
            var ifLeftRightPressed = this.playerController.Left.isDown * -1 + this.playerController.Right.isDown;
            //OLD CODE, it works perfectly but it is not what we really need
            //left-right moving when jumping
            //if (this.jumpedCount > 0) {
            //    var inJumpVelocity = this.beforeJumpingMoveVelocity;
            //    if (inJumpVelocity == 0) {
            //        if (this.playerController.Left.isDown)
            //            inJumpVelocity = -regularMoveVelocity / 1.5;
            //        else if (this.playerController.Right.isDown)
            //            inJumpVelocity = regularMoveVelocity / 1.5;
            //    }
            //    else {
            //        if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity < 0)
            //        { }
            //        else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity > 0)
            //        { }
            //        else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity < 0) {
            //            inJumpVelocity = 0;
            //            this.player.animations.stop();
            //            this.player.frame = 4;
            //        }
            //        else if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity > 0) {
            //            inJumpVelocity = 0;
            //            this.player.animations.stop();
            //            this.player.frame = 4;
            //        }
            //        else
            //            inJumpVelocity = inJumpVelocity / 2;
            //    }
            //    this.player.body.velocity.x = inJumpVelocity;
            //}
            if (this.jumpedCount > 0) {
                var adjustedAcceleration = (Defaults.BodyPhysics.InJumpAcceleration * Defaults.BodyPhysics.WeightKoeff / Defaults.BodyPhysics.Weight);
                var speedIncrement = adjustedAcceleration * regularMoveVelocity / 1.5;
                if (this.inJumpVelocity == 0) {
                    if (this.playerController.Left.isDown) {
                        this.inJumpVelocity -= regularMoveVelocity;
                        this.beforeJumpingMoveVelocity = this.inJumpVelocity;
                    }
                    else if (this.playerController.Right.isDown) {
                        this.inJumpVelocity += regularMoveVelocity;
                        this.beforeJumpingMoveVelocity = this.inJumpVelocity;
                    }
                }
                else {
                    speedIncrement = adjustedAcceleration * this.beforeJumpingMoveVelocity;
                    if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity < 0) {
                        this.inJumpVelocity = this.changeVelocity(this.inJumpVelocity, speedIncrement);
                    }
                    else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity > 0) {
                        this.inJumpVelocity = this.changeVelocity(this.inJumpVelocity, speedIncrement);
                    }
                    else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity < 0) {
                        this.inJumpVelocity = this.changeVelocity(this.inJumpVelocity, -speedIncrement * 3);
                        this.player.animations.stop();
                        this.player.frame = 4;
                    }
                    else if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity > 0) {
                        this.inJumpVelocity = this.changeVelocity(this.inJumpVelocity, -speedIncrement * 3);
                        this.player.animations.stop();
                        this.player.frame = 4;
                    }
                }
                this.player.body.velocity.x = this.inJumpVelocity;
            }
            else {
                //is not correct code (all regular moving)
                var speed = Defaults.BodyPhysics.MoveAcceleration
                    * Defaults.BodyPhysics.WeightKoeff * 5 / Defaults.BodyPhysics.Weight;
                if (this.playerController.Walk.isDown)
                    speed = speed * 2;
                this.moveVelocity += speed;
                if (this.playerController.Left.isDown) {
                    this.player.body.velocity.x = -this.moveVelocity - Defaults.BodyPhysics.MovingVelocity;
                    this.player.animations.play('left');
                }
                else if (this.playerController.Right.isDown) {
                    this.player.body.velocity.x = this.moveVelocity + Defaults.BodyPhysics.MovingVelocity;
                    this.player.animations.play('right');
                }
                else {
                    this.player.animations.stop();
                    this.player.frame = 4;
                    this.moveVelocity = 0;
                }
            }
            if (this.playerController.Jump.isDown && !this.pressingJump
                && this.jumpedCount == 1) {
                this.player.body.velocity.y = -Defaults.BodyPhysics.JumpVelocity;
                this.jumpedCount++;
                this.pressingJump = true;
            }
            else if (this.playerController.Jump.isDown && !this.pressingJump
                && this.jumpedCount == 0 && !this.player.body.touching.down) {
                this.player.body.velocity.y = -Defaults.BodyPhysics.JumpVelocity;
                this.jumpedCount = 2;
                this.pressingJump = true;
            }
            else if (this.playerController.Jump.isDown && this.jumpedCount == 0 && !this.pressingJump) {
                if (this.player.body.touching.down) {
                    this.player.body.velocity.y = -Defaults.BodyPhysics.JumpVelocity;
                    this.jumpedCount++;
                    this.pressingJump = true;
                    this.inJumpVelocity = this.beforeJumpingMoveVelocity = this.player.body.velocity.x;
                }
            }
            else if (this.playerController.Jump.isUp) {
                this.pressingJump = false;
            }
        };
        ;
        Gamer.prototype.collectStar = function (player, star) {
            star.kill();
            this.score += 1;
        };
        ;
        return Gamer;
    })();
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            _super.call(this);
        }
        TitleScreenState.prototype.preload = function () {
            this.load.image("title", General.spritesFolder + "titleScreen.png");
        };
        TitleScreenState.prototype.create = function () {
            this.titleScreenImage = this.add.sprite(0, 0, "title");
            this.input.onDown.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
        };
        TitleScreenState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
        };
        return TitleScreenState;
    })(Phaser.State);
    TheGame.TitleScreenState = TitleScreenState;
    var GameRunningState = (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            _super.call(this);
        }
        GameRunningState.prototype.preload = function () {
            Common.LoadAsset(this.game, 'background', AssetType.Image, General.spritesFolder + 'sky.png');
            Common.LoadAsset(this.game, 'ground', AssetType.Image, General.spritesFolder + 'platform.png');
            Common.LoadAsset(this.game, 'star', AssetType.Image, General.spritesFolder + 'star.png');
            Common.LoadAsset(this.game, 'crate1', AssetType.Image, General.spritesFolder + 'crate1.png');
            Common.LoadAsset(this.game, 'crate2', AssetType.Image, General.spritesFolder + 'crate.png');
            Common.LoadAsset(this.game, 'dude', AssetType.Spritesheet, General.spritesFolder + 'dude.png', new Point(32, 48));
        };
        GameRunningState.prototype.create = function () {
            this.createWorld();
            this.createLevel();
            this.scoreText = this.game.add.text(16, 16, "score: 0", { fontSize: '32px', fill: '#000' });
            this.debugText = this.game.add.text(16, 64, "", { fontSize: '10px', fill: '#000' });
        };
        GameRunningState.prototype.update = function () {
            this.gamer1.update();
            this.collisions();
            //TheGame.input();
            this.output();
        };
        GameRunningState.prototype.render = function () {
        };
        GameRunningState.prototype.createWorld = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.add.sprite(0, 0, 'background');
            var fdf = this.game.add.group();
            ;
            this.platforms = this.game.add.group();
            this.platforms.enableBody = true;
            this.stars = this.game.add.group();
            this.stars.enableBody = true;
            this.items = this.game.add.group();
            this.items.enableBody = true;
            this.gamer1 = new Gamer(this);
        };
        ;
        GameRunningState.prototype.createLevel = function () {
            var ground = this.platforms.create(0, this.game.world.height - 32, 'ground');
            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 1);
            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;
            //  Now let's create ledges
            var ledge = this.platforms.create(300, 450, 'ground');
            ledge.body.immovable = true;
            ledge = this.platforms.create(-150, 350, 'ground');
            ledge.body.immovable = true;
            ledge = this.platforms.create(200, 250, 'ground');
            ledge.body.immovable = true;
            var crate1 = this.items.create(330, 400, 'crate2');
            crate1.body.gravity.y = Defaults.BodyPhysics.Gravity;
            //var crate1 = this.platforms.create(330, 400, 'crate1');
            //var crate2 = this.platforms.create(500, 430, 'crate2');
            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 12; i++) {
                //  Create a star inside of the 'stars' group
                var star = this.stars.create(i * 70, 0, 'star');
                //  Let gravity do its thing
                star.body.gravity.y = Defaults.BodyPhysics.Gravity / 15;
                //  This just gives each star a slightly random bounce value
                star.body.bounce.y = 0.7 + Math.random() * 0.2;
            }
        };
        GameRunningState.prototype.collisions = function () {
            this.game.physics.arcade.collide(this.stars, this.platforms);
            this.game.physics.arcade.collide(this.items, this.platforms);
            this.game.physics.arcade.collide(this.items, this.stars);
        };
        ;
        GameRunningState.prototype.output = function () {
            this.scoreText.text = 'Score: ' + this.gamer1.score;
            this.printDebug();
        };
        ;
        GameRunningState.prototype.printDebug = function () {
            this.debugText.text = "Jumped: {0}\nSpeed: {1}\nLast Before Jump Speed: {2}\nLast Jump Speed: {3}\nLast Move Speed: {4}"
                .format(this.gamer1.jumpedCount == 0 ? "No" : (this.gamer1.jumpedCount == 1 ? "Once" : "Twice"), this.gamer1.player.body.velocity.x, this.gamer1.beforeJumpingMoveVelocity.toString(), this.gamer1.inJumpVelocity.toString(), this.gamer1.moveVelocity.toString());
        };
        ;
        return GameRunningState;
    })(Phaser.State);
    TheGame.GameRunningState = GameRunningState;
    var General = (function () {
        function General() {
            this.game = new Phaser.Game(Defaults.Screen.Width, Defaults.Screen.Height, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", GameRunningState, false);
            this.game.state.add("TitleScreenState", TitleScreenState, false);
            this.game.state.start("TitleScreenState", true, true);
        }
        General.assetsFolder = 'Content/assets/';
        General.spritesFolder = General.assetsFolder + 'sprites' + '/';
        return General;
    })();
    TheGame.General = General;
})(TheGame || (TheGame = {}));
window.onload = function () {
    var game = new TheGame.General();
};
//# sourceMappingURL=app.js.map