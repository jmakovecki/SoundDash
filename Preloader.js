
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function (game) {

		//	Display assets loaded in Boot.js
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.background.width = game.width;
		this.background.height = game.height;

		this.preloaderTitle = this.add.sprite(game.width * 3/10, game.height * 1/5, 'preloaderTitle');
		this.preloaderTitle.width = game.width * 2/5;
		this.preloaderTitle.height = this.preloaderTitle.width * 1/5;

		this.preloadBar = this.add.sprite(game.width/4, game.height*5/7, 'preloaderBar');
		this.preloadBar.width = game.width/2;
		this.preloadBar.height = game.height/12;

		//	Use preloadBar as a loader element.
		this.load.setPreloadSprite(this.preloadBar);

		//	Load other assets.
		game.load.image('titlepage', 'assets/titlepage.png');
		game.load.image('title', 'assets/title.png');
		game.load.spritesheet('playButton', 'assets/play_button_spritesheet.png', 500, 200);
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);

		game.load.spritesheet('move_button', 'assets/arrow_spritesheet.png', 500, 256);

		game.load.image('sky_tile', 'assets/sky_tile.png');
		game.load.image('ground_tile', 'assets/ground_tile.png');

		game.load.image('bubble_x', 'assets/bubble_x.png');
		game.load.spritesheet('bad_mood', 'assets/bad_mood.png', 200, 200);

		game.load.image('rock', 'assets/test_rock.png');

		// Load player
		game.load.spritesheet('player_char', 'assets/running-sheet.png', 1000, 1000);
		game.load.image('player_downed', 'assets/downed.png');

		// Load sounds
		var notes = Object.keys(soundfont);
		console.log(notes);
		for (var i = 0; i < notes.length; i++) {
			this.load.audio(notes[i], soundfont[notes[i]]);
		}
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {

		//	This loop is not needed yet, but will be if music is added.

		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		if (this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
