
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

    create: function (game) {
      this.group1 = this.makeGroup(game);
      this.group2 = this.makeGroup(game);
      this.group2.x = game.width;

      var playerChar = game.add.sprite(game.width * 2/5, game.height * 1/5, "player_char");
      playerChar.width = game.width * 1/7;
      playerChar.height = playerChar.width;

      var run = playerChar.animations.add("run");
      playerChar.animations.play("run", 12, true);
    },

    makeGroup: function(game) {
      var newGroup = game.add.group();
      var gameBg = newGroup.create(0, 0, "game_bg");
      var testRock = newGroup.create(game.width * 2/5, game.height * 4/5, "test_rock");
      gameBg.height = game.height;
      gameBg.width = game.width;
      newGroup.height = game.height;
      newGroup.width = game.width;
      return newGroup;
    },

    update: function (game) {
      this.group1.x -= 3;
      this.group2.x -= 3;
      if (this.group1.x + this.group1.width < 1) {
          this.group1.x = game.width;
      }
      if (this.group2.x + this.group2.width < 1) {
          this.group2.x = game.width;
      }
    },

    quitGame: function (pointer) {
        //  Destroy anything you no longer need: stop music, delete sprites, purge caches, free resources.

        this.state.start('MainMenu');
    }

};
