
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
		this.load.image('titlepage', 'assets/titlepage.png');
		this.load.image('title', 'assets/title.png');
		this.load.spritesheet('playButton', 'assets/play_button_spritesheet.png', 500, 200);
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);

		game.load.image('sky_tile', 'assets/sky_tile.png');
		game.load.image('ground_tile', 'assets/ground_tile.png');

		game.load.image('rock', 'assets/test_rock.png');
		game.load.spritesheet('player_char', 'assets/rolling.png', 300, 300);
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
