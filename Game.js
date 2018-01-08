
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
  init: function(picked) {
    this.picked = picked;
  },


  create: function() {
    var game = this.game;

    /* define config ------------------------------------------------------------------------------------------------ */
    this.status = {};
    this.config = {};
    this.objects = {};
    this.objects.moving = new Set();
    var c = this.config;                // holds heneral configuration (mostly set once and left that way ehile ingame)
    var o = this.objects;               // holds displayed (and hidden) game objects
    var s = this.status;                // holds current state of the game (tends to change often)

    c.playerWidth = game.width * 1/4;   // width of player character, affected by game height
    c.gameSpeed = c.playerWidth / 1000; // speed in pixels per milisecond
    c.skySpeed = c.gameSpeed/3;         // speed of sky
    c.moveTime = 1000;                  // time spent moving between lanes in miliseconds
    c.noteDelay = 3000;                 // time between two notes being played
    c.reactionWindow = 2000;            // time the player has to respond to a played note
    c.bubbleWindow = 1000;              // time to show the X bubble for

    c.groundY = game.height * 1/5;

    c.lanes = [39/40, 36/40, 33/40, 30/40, 27/40, 24/40, 21/40, 18/40];



    /* set states --------------------------------------------------------------------------------------------------- */
    s.prevTime = (new Date()).getTime();
    s.prevNoteTime = s.prevTime;
    s.bubbleTime = s.prevTime;
    s.inReactionWindow = false;        // not currently waiting to evaluate player input

    // lines and movement
    s.activeLane = 2;
    s.moving = false;
    s.moveStart = 0;
    s.moveFrom = 0;
    s.moveTo = 0;

    // health and score
    s.health = 2;
    s.score = 0;

    // ingame states
    s.gameOver = false;

    // notes
    o.notes = [];
		for (var i = 0; i < this.picked.length; i++) {
			o.notes[i] = this.add.audio(this.picked[i]);
		}
    console.log(this.picked);
    console.log(o.notes);
    console.log(o.notes[0]);


    /* add objects -------------------------------------------------------------------------------------------------- */
    // background
    o.skyTile = game.add.tileSprite(0, 0, game.width, 500, 'sky_tile');
    o.groundTile = game.add.tileSprite(0, c.groundY, game.width, game.height, 'ground_tile');

    // other
    /*o.rock = game.add.sprite(game.width * 4/5, game.height * 4/5, "rock");
    o.moving.add(o.rock);
    o.rock2 = game.add.sprite(game.width * 2/5, game.height * 5/7, "rock");
    o.moving.add(o.rock2);*/
    
    
    o.grass1 = game.add.sprite(game.width * 2/5 + (c.noteDelay + c.reactionWindow) * c.gameSpeed, c.groundY, "grass1");
    console.log("first: "+ (game.width * 2/5 + (c.noteDelay + c.reactionWindow) * c.gameSpeed));
    o.grass1.width = game.width / 4;
    o.grass1.geight = game.height - c.groundY;
    o.moving.add(o.grass1);
    
    o.grass2 = game.add.sprite(game.width * 2/5 + (2 * c.noteDelay + c.reactionWindow) * c.gameSpeed, c.groundY, "grass1");
    o.grass2.width = game.width / 4;
    o.grass2.geight = game.height - c.groundY;
    o.moving.add(o.grass2);
    
    o.bubbleX = game.add.sprite(0, 0, "bubble_x");
    o.bubbleX.visible = false;

    // player
    o.playerChar = game.add.sprite(game.width * 2/5, c.lanes[s.activeLane], "player_char");
    o.playerChar.width = game.width * 1/4;
    o.playerChar.height = o.playerChar.width;

    var run = o.playerChar.animations.add("run");
    o.playerChar.animations.play("run", 14, true);

    // downed player
    o.playerDowned = game.add.sprite(0, 0, "player_downed");
    o.playerDowned.width = o.playerChar.width * 1.2;
    o.playerDowned.height = o.playerChar.height / 2;
    o.playerDowned.visible = false;

    o.badMood = game.add.sprite(0, 0, "bad_mood");
    o.badMood.visible = false;

    // onscreen text
    var textStyle = {fill: "#5e3073", fontSize: game.height/14+"px", stroke: "#ffffff", strokeThickness: "4"};
    o.healthText = game.add.text(30, 30, "❤️ " + s.health, textStyle);
    o.scoreText = game.add.text(30, 30, "0 🏆", textStyle);
    o.scoreText.right = game.width - 30;

    /* post object adding config ------------------------------------------------------------------------------------ */
    // scale lanes and move them to accomodate for player height
    for (var i = 0; i < c.lanes.length; i++) {
      c.lanes[i] = game.height * c.lanes[i] - o.playerChar.height;
    }


    /* add keybinds ------------------------------------------------------------------------------------------------- */
    var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    var key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    var key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    var key4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    var key5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    var key6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    var key7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
    var key8 = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
    key1.onDown.add(this.doMove, this, 0, 0);
    key2.onDown.add(this.doMove, this, 0, 1);
    key3.onDown.add(this.doMove, this, 0, 2);
    key4.onDown.add(this.doMove, this, 0, 3);
    key5.onDown.add(this.doMove, this, 0, 4);
    key6.onDown.add(this.doMove, this, 0, 5);
    key7.onDown.add(this.doMove, this, 0, 6);
    key8.onDown.add(this.doMove, this, 0, 7);

    buttons = [];
    buttons.push(this.add.button(game.width / 40, c.lanes[0] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 0)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[1] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 1)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[2] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 2)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[3] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 3)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[4] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 4)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[5] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 5)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[6] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 6)}, this, 1, 0, 2));
    buttons.push(this.add.button(game.width / 40, c.lanes[7] + o.playerChar.height / 5 * 4, 'move_button', function(){this.doMove(0, 7)}, this, 1, 0, 2));
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].height = game.height * 2 / 30;
      buttons[i].width = game.width / 20;
    }

    o.playerChar.y = c.lanes[s.activeLane];
  },


  doMove: function(a, lane) {
    console.log(lane + 1);
    var s = this.status;
    var o = this.objects;
    if (!s.moving && lane != s.activeLane) {
      o.bubbleX.visible = false;

      var c = this.config;
      var o = this.objects;

      s.activeLane = lane;
      s.moving = true;
      s.moveStart = (new Date()).getTime();
      s.moveFrom = o.playerChar.y;
      s.moveTo = c.lanes[lane];
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
    var movePercent = area / (2/3);

    return s.moveFrom + (s.moveTo - s.moveFrom) * movePercent;
  },


  update: function() {
    var game = this.game;
    var c = this.config;
    var o = this.objects;
    var s = this.status;

    if (!s.gameOver) {
      var now = (new Date()).getTime();

      if (now >= s.bubbleTime) {
        o.bubbleX.visible = false;
      }

      // play note
      if (now > s.prevNoteTime + c.noteDelay) {
        s.prevNoteTime = now;
        s.activeNote = Math.floor(Math.random() * o.notes.length);
        o.notes[s.activeNote].play();
        console.log("Played " + (s.activeNote + 1));                                                                    // TODO: REMOVE IN FINAL VERSION
        s.inReactionWindow = true;
      }

      // check player input, drop health if false
      if (s.inReactionWindow && now > s.prevNoteTime + c.reactionWindow) {
        if (s.activeLane != s.activeNote) {
          s.health--;
          o.healthText.text = "❤️ " + s.health;

          if (s.health <= 0) {
            s.moving = false;
            s.gameOver = true;

            // make the poor girl faceplant
            o.playerDowned.x = o.playerChar.x + o.playerChar.width / 2;
            o.playerDowned.y = o.playerChar.y + o.playerChar.height / 2;
            o.playerDowned.visible = true;
            o.moving.add(o.playerDowned);

            // make her upset about faceplanting
            o.badMood.x = o.playerDowned.x + o.playerDowned.width * 85 / 120;
            o.badMood.y = o.playerDowned.y + o.playerDowned.height * 8 / 50;
            o.badMood.height = o.playerDowned.height / 2.5;
            o.badMood.width = o.badMood.height;
            o.badMood.visible = true;
            o.badMood.animations.add("flip");
            o.badMood.animations.play("flip", 4, true);
            o.moving.add(o.badMood);

            o.playerChar.destroy();
          } else {
            o.bubbleX.height = o.playerChar.height * 0.3;
            o.bubbleX.width = o.playerChar.width * 0.3;
            o.bubbleX.x = o.playerChar.x + o.playerChar.width * 0.4;
            o.bubbleX.y = o.playerChar.y - o.bubbleX.height;
            o.bubbleX.visible = true;
            s.bubbleTime = now + c.bubbleWindow;
          }
        } else {
          s.score++;
          o.scoreText.text = s.score + " 🏆";
        }

        s.inReactionWindow = false;
      }

      // move player
      if (s.moving) {
        if (now < s.moveStart + c.moveTime) {
          o.playerChar.y = this.getMovePos();
        } else {                                         // last frame
          o.playerChar.y = s.moveTo;
          s.moving = false;
        }
      }
    }

    // move background
    o.skyTile.tilePosition.x -= c.skySpeed * ((new Date()).getTime() - s.prevTime);
    o.groundTile.tilePosition.x -= c.gameSpeed * ((new Date()).getTime() - s.prevTime);

    // move objects on field
	for (let i of o.moving) {
		var objNow = (new Date()).getTime();
		if (i.x > 0 - i.width) {
			i.x -= c.gameSpeed * (objNow - s.prevTime);
		} else {
			if (i == o.grass1 || i == o.grass2) {
				i.x = game.width * 2/5 + (c.noteDelay - (objNow - s.prevNoteTime) + c.reactionWindow) * c.gameSpeed;
				game.width * 2/5 + (c.noteDelay + c.reactionWindow) * c.gameSpeed
				console.log("i.x = " + i.x+", asd: "+(objNow - s.prevNoteTime));
			} else {
				if (i == o.playerDowned) {
					this.doGameOver();
				}
			
				o.moving.delete(i);
				i.destroy();
			}
		}
	}

    s.prevTime = (new Date()).getTime();
  },


  doGameOver: function() {


    this.quitGame();
  },


  quitGame: function(pointer) {   //  Destroy anything you no longer need: stop music, delete sprites, purge caches, free resources.
    var o = this.objects;

    for (let i of o.moving) {
      o.moving.delete(i);
      i.destroy();
    }
    o.skyTile.destroy();
    o.groundTile.destroy();

    this.state.start('MainMenu');
  }

};
