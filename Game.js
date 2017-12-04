
BasicGame.Game = function (game) {

  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

  //  You can use any of these from any function within this State.
  //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {
  create: function() {
    var game = this.game;

    /* define config ---------------------------------------------------------------------------------------------- */
    this.status = {};
    this.config = {};
    this.objects = {};
    this.objects.moving = new Set();
    var c = this.config;               // holds heneral configuration (mostly set once and left that way ehile ingame)
    var o = this.objects;              // holds displayed (and hidden) game objects
    var s = this.status;               // holds current state of the game (tends to change often)

    c.gameSpeed = 3;
    c.skySpeed = 1;
    c.moveTime = 1000;                 // time spent moving in miliseconds


    c.groundY = game.height * 1/5;

    c.lanes = [16/20, 14/20, 12/20, 10/20, 8/20, 6/20, 4/20];
    for (var i = 0; i < c.lanes.length; i++) {
      c.lanes[i] *= game.height;
    }


    // states
    s.activeLane = 2;

    s.moving = false;
    s.moveStart = 0;
    s.moveFrom = 0;
    s.moveTo = 0;


    /* add objects -------------------------------------------------------------------------------------------------- */
    // background
    o.skyTile = game.add.tileSprite(0, 0, game.width, 500, 'sky_tile');
    o.groundTile = game.add.tileSprite(0, c.groundY, game.width, game.height, 'ground_tile');

    // other
    o.rock = game.add.sprite(game.width * 4/5, game.height * 4/5, "rock");
    o.moving.add(o.rock);
    o.rock2 = game.add.sprite(game.width * 2/5, game.height * 5/7, "rock");
    o.moving.add(o.rock2);

    // player
    o.playerChar = game.add.sprite(game.width * 2/5, c.lanes[s.activeLane], "player_char");
    o.playerChar.width = game.width * 1/7;
    o.playerChar.height = o.playerChar.width;

    var run = o.playerChar.animations.add("run");
    o.playerChar.animations.play("run", 12, true);


    /* add keybinds ------------------------------------------------------------------------------------------------- */
    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    var key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    var key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    var key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    var key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    var key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    var key7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    key1.onDown.add(this.doMove, this, 0, 1);
    key2.onDown.add(this.doMove, this, 0, 2);
    key3.onDown.add(this.doMove, this, 0, 3);
    key4.onDown.add(this.doMove, this, 0, 4);
    key5.onDown.add(this.doMove, this, 0, 5);
    key6.onDown.add(this.doMove, this, 0, 6);
    key7.onDown.add(this.doMove, this, 0, 7);
  },


  doMove: function(a, lane) {
    var s = this.status;
    if (!s.moving) {
      var c = this.config;
      var o = this.objects;

      s.activeLane = lane;
      s.moving = true;
      s.moveStart = (new Date()).getTime();
      s.moveFrom = o.playerChar.y;
      s.moveTo = c.lanes[lane-1];
    }
  },


  getMovePos: function() {    // move function: -(1/2)*x^2 + x;   integrated: x^2/2 - x^3/6;   integrated on [0, 2]: 2/3
    var c = this.config;
    var o = this.objects;
    var s = this.status;


    // scale time from move start to move end to interval [0, 2]
    var currentPos = ((new Date()).getTime() - s.moveStart) / c.moveTime * 2;
    // get area under the curve on interval [0, currentPos]
    var area = Math.pow(currentPos, 2) / 2 - Math.pow(currentPos, 3) / 6;
    var movePercent = 2/3 / area;

    return s.moveFrom + (s.moveTo - s.moveFrom) * movePercent;
  },


  update: function() {
    var game = this.game;
    var c = this.config;
    var o = this.objects;
    var s = this.status;

    // move player
    if (s.moving) {
      if ((new Date()).getTime() < s.moveStart + c.moveTime) {
        o.playerChar.y = this.getMovePos();
      } else {                                         // last frame
        o.playerChar.y = s.moveTo;
        s.moving = false;
      }
    }

    // move background
    o.skyTile.tilePosition.x -= c.skySpeed;
    o.groundTile.tilePosition.x -= c.gameSpeed;

    // move objects on field
    for (let i of o.moving) {
      if (i.x > 0 - i.width) {
        i.x -= c.gameSpeed;
      } else {
        o.moving.delete(i);
        i.destroy();
      }
    }
  },


  quitGame: function(pointer) {
    //  Destroy anything you no longer need: stop music, delete sprites, purge caches, free resources.

    this.state.start('MainMenu');
  }

};
