
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
  create: function () {
    var game = this.game;

    /* define settings ---------------------------------------------------------------------------------------------- */
    this.settings = {};
    this.objects = {};
    this.objects.moving = new Set();
    var s = this.settings;
    var o = this.objects;

    s.gameSpeed = 3;
    s.skySpeed = 1;

    s.groundY = game.height * 1/5;


    /* add objects -------------------------------------------------------------------------------------------------- */
    // background
    o.skyTile = game.add.tileSprite(0, 0, game.width, 500, 'sky_tile');
    o.groundTile = game.add.tileSprite(0, s.groundY, game.width, game.height, 'ground_tile');

    // player
    o.playerChar = game.add.sprite(game.width * 2/5, game.height * 1/5, "player_char");
    o.playerChar.width = game.width * 1/7;
    o.playerChar.height = o.playerChar.width;

    var run = o.playerChar.animations.add("run");
    o.playerChar.animations.play("run", 12, true);

    // other
    o.rock = game.add.sprite(game.width * 4/5, game.height * 4/5, "rock");
    o.moving.add(o.rock);
    o.rock2 = game.add.sprite(game.width * 2/5, game.height * 5/7, "rock");
    o.moving.add(o.rock2);
  },

  update: function () {
    var game = this.game;
    var s = this.settings;
    var o = this.objects;

    o.skyTile.tilePosition.x -= s.skySpeed;
    o.groundTile.tilePosition.x -= s.gameSpeed;

    // move objects on field
    for (let i of o.moving) {
      if (i.x > 0 - i.width) {
        i.x -= s.gameSpeed;
      } else {
        o.moving.delete(i);
        i.destroy();
      }
    }
  },

  quitGame: function (pointer) {
    //  Destroy anything you no longer need: stop music, delete sprites, purge caches, free resources.

    this.state.start('MainMenu');
  }

};
