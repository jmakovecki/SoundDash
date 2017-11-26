
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function (game) {
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		this.background = this.add.sprite(0, 0, 'titlepage');
		this.background.width = game.width;
		this.background.height = game.height;

		this.title = this.add.sprite(game.width * 3/10, game.height * 1/5, 'title');
		this.title.width = game.width * 2/5;
		this.title.height = this.title.width * 1/5;

		this.playButton = this.add.button(game.width * 2/5, game.height * 3/5, 'playButton', this.startGame, this, 1, 0, 2);
		this.playButton.width = game.width * 1/5;
		this.playButton.height = this.playButton.width * 2/5;
	},

	update: function () {

		//	Main menu effects

	},

	startGame: function (pointer) {
		//this.music.stop();

		this.state.start('Game');
	}

};
