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
        MovingVelocity: 150,
        JumpVelocity: 350,
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

var Gamer = {

    parentGame: undefined,

    playerController: undefined,
    player: undefined,

    health: Defaults.Creature.Health,
    energy: Defaults.Creature.Energy,
    hungry: Defaults.Creature.Hungry,
    tiredness: Defaults.Creature.Tiredness,
    hurt: Defaults.Creature.Hurt,

    currentHealth: Defaults.Creature.Health,
    currentEnergy:  Defaults.Creature.Energy,
    currentHungry: Defaults.Creature.Hungry,
    currentTiredness: Defaults.Creature.Tiredness,
    currentHurt: Defaults.Creature.Hurt,

    score: 0,
   
    jumpedCount: 0,//qty of jumps
    pressingJump: false,//jump key is pressing
    beforeJumpingMoveVelocity: 0,

    init: function (_parent) {    
        this.parentGame = _parent;

        this.player = this.parentGame.game.add.sprite(32, this.parentGame.game.world.height - 150, 'dude');
        this.parentGame.game.physics.arcade.enable(this.player);//physics

        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = Defaults.BodyPhysics.Gravity;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0, 1, 2, 3], Defaults.Animation.Speed, true);
        this.player.animations.add('right', [5, 6, 7, 8], Defaults.Animation.Speed, true);

        return this;
    },

    update: function () {
        var that = Gamer;

        //  Reset the players velocity (movement)
        that.player.body.velocity.x = 0;

        that.collisions();

        //console.log(that.player.body.touching.down ? "touched down" : "in air");
        //console.log(that.jumpedCount);

        if (that.player.body.touching.down)
            that.jumpedCount = 0;

        that.input();
    },

    collisions: function () {
        this.parentGame.game.physics.arcade.collide(this.player, this.parentGame.platforms);
        this.parentGame.game.physics.arcade.collide(this.player, this.parentGame.items);
        this.parentGame.game.physics.arcade.overlap(this.player, this.parentGame.stars, this.collectStar, null, this);
    },

    input: function ()
    {
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

        this.playerController = {
            Up: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Up),
            Down: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Down),
            Left: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Left),
            Right: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Right),
            Jump: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Jump),
            Walk: this.parentGame.game.input.keyboard.addKey(Defaults.PlayerControls.Walk),
        };
        
        var speed = 1;
        if (this.playerController.Walk.isDown)
            speed = 1.5;
        else
            speed = 1;

        var regularMoveVelocity = Defaults.BodyPhysics.MovingVelocity;
        var ifLeftRightPressed = this.playerController.Left.isDown * -1 + this.playerController.Right.isDown;

        //left-right moving when jumping
        if (this.jumpedCount > 0) {
            var inJumpVelocity = this.beforeJumpingMoveVelocity;
            if (inJumpVelocity == 0) {
                if (this.playerController.Left.isDown)
                    inJumpVelocity = -regularMoveVelocity / 1.5;
                else if (this.playerController.Right.isDown)
                    inJumpVelocity = regularMoveVelocity / 1.5;
            }
            else
            {
                if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity < 0)
                { }
                else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity > 0)
                { }
                else if (ifLeftRightPressed > 0 && this.beforeJumpingMoveVelocity < 0)
                {
                    inJumpVelocity = 0;
                    this.player.animations.stop();
                    this.player.frame = 4;
                }
                else if (ifLeftRightPressed < 0 && this.beforeJumpingMoveVelocity > 0)
                {
                    inJumpVelocity = 0;
                    this.player.animations.stop();
                    this.player.frame = 4;
                }
                else
                    inJumpVelocity = inJumpVelocity/2;
            }
            this.player.body.velocity.x = inJumpVelocity;
        }
        //regular left-right moving/walking
        else {
            var moveVelocity = regularMoveVelocity * speed;

            if (this.playerController.Left.isDown) {
                this.player.body.velocity.x = -moveVelocity;
                this.player.animations.play('left');
            }
            else if (this.playerController.Right.isDown) {
                this.player.body.velocity.x = moveVelocity;
                this.player.animations.play('right');
            }
            else {
                this.player.animations.stop();
                this.player.frame = 4;
            }
        }

        if (this.playerController.Jump.isDown && this.jumpedCount == 1 && !this.pressingJump) {
            this.player.body.velocity.y = -Defaults.BodyPhysics.JumpVelocity;
            this.jumpedCount++;
            this.pressingJump = true;
            //this.beforeJumpingMoveVelocity = this.player.body.velocity.x;
        }
        else if (this.playerController.Jump.isDown && this.jumpedCount == 0 && !this.pressingJump) {
            if (this.player.body.touching.down) {
                this.player.body.velocity.y = -Defaults.BodyPhysics.JumpVelocity;
                this.jumpedCount++;
                this.pressingJump = true;
                this.beforeJumpingMoveVelocity = this.player.body.velocity.x;
            }
        }
        else if (this.playerController.Jump.isUp) {
            this.pressingJump = false;
        }

    },

    collectStar: function (player, star) {
        star.kill();
        this.score += 1;
    },
}

var TheGame = {
    assetsFolder: 'content/assets/',
    spritesFolder: undefined,
    game: undefined,

    gamer1: undefined,
    gamer2: undefined,
    platforms: undefined,
    items: undefined,
    stars: undefined,
    
    scoreText: undefined,

    init: function () {
        this.spritesFolder = this.assetsFolder + 'sprites' + '/';
        this.game = new Phaser.Game(Defaults.Screen.Width, Defaults.Screen.Height, Phaser.AUTO, 'content',
            { preload: this.preload, create: this.create, update: this.update, render: this.render });
    },

    preload: function () {
        TheGame.loadAssets();    
    },

    create: function () {
        TheGame.createWorld();
        TheGame.createLevel();
        TheGame.scoreText = TheGame.game.add.text(16, 16, "score: 0", { fontSize: '32px', fill: '#000' });
    },

    update: function () {
        TheGame.gamer1.update();
        TheGame.collisions();
        //TheGame.input();
        TheGame.output();
    },

    render: function () {
    },



    loadAssets: function () {
        jQuery.Game.LoadAsset(this.game, 'background', $.Game.AssetType.Image, this.spritesFolder + 'sky.png');
        jQuery.Game.LoadAsset(this.game, 'ground', $.Game.AssetType.Image, this.spritesFolder + 'platform.png');
        jQuery.Game.LoadAsset(this.game, 'star', $.Game.AssetType.Image, this.spritesFolder + 'star.png');
        jQuery.Game.LoadAsset(this.game, 'crate1', $.Game.AssetType.Image, this.spritesFolder + 'crate1.png');
        jQuery.Game.LoadAsset(this.game, 'crate2', $.Game.AssetType.Image, this.spritesFolder + 'crate.png');
        jQuery.Game.LoadAsset(this.game, 'dude', $.Game.AssetType.Spritesheet, this.spritesFolder + 'dude.png', new Point(32, 48));
    },

    createWorld: function()
    {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.add.sprite(0, 0, 'background');

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.stars = this.game.add.group();
        this.stars.enableBody = true;

        this.items = this.game.add.group();
        this.items.enableBody = true;

        this.gamer1 = Gamer.init(this);
    },

    createLevel: function()
    {
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
            star.body.gravity.y = Defaults.BodyPhysics.Gravity/15;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    },

    collisions: function ()
    {
        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.collide(this.items, this.platforms);
        this.game.physics.arcade.collide(this.items, this.stars);
    },

    output: function ()
    {
        this.scoreText.text = 'Score: ' + this.gamer1.score;
    },
}
