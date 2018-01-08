
BasicGame.Settings = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.Settings.prototype = {

	create: function (game) {
		this.background = this.add.sprite(0, 0, 'titlepage');
		this.background.width = game.width;
		this.background.height = game.height;

		this.title = this.add.sprite(game.width * 3/10, game.height * 1/30, 'title');
		this.title.width = game.width * 2/5;
		this.title.height = this.title.width * 1/5;

		this.playButton = this.add.button(game.width * 2/5, game.height * 82/100, 'playButton', this.startGame, this, 1, 0, 2);
		this.playButton.width = game.width * 1/5;
		this.playButton.height = this.playButton.width * 2/5;

		// select the notes to be used in game
		game.optArray = [["C1", "D1", "E1", "F1", "G1", "A1", "B1", "C2"],
										 ["C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3"],
								 		 ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"],
										 ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
										 ["C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"],
								 		 ["C6", "D6", "E6", "F6", "G6", "A6", "B6", "C7"]];

		var content = ["C1-C2", "C2-C3", "C3-C4", "C4-C5", "C5-C6", "C6-C7"];


		game.picked = game.optArray[3];
		game.notes = [];
		var setPicked = function(id) {
			for (var i = 0; i < game.optArray[id].length; i++) {
				game.picked[i] = game.optArray[id][i];
				game.notes[i] = game.add.audio(game.picked[i]);
			}
		}

		setPicked(3);
		this.picked = game.picked;

		var playNote = function(note) {
			game.notes[note].play();
		}

		/* add keybinds ------------------------------------------------------------------------------------------------- */
		var keyCodes = [Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE, Phaser.Keyboard.FOUR,
										Phaser.Keyboard.FIVE, Phaser.Keyboard.SIX, Phaser.Keyboard.SEVEN, Phaser.Keyboard.EIGHT];
		var keys = [];

		for (var i = 0; i < keyCodes.length; i++) {
			keys[i] = game.input.keyboard.addKey(keyCodes[i]);
			console.log(keys[i]);
			console.log(i);
			keys[i].keyID = i;
			keys[i].onDown.add(function(evt) {
				testerArray[evt.keyID].beginFill(0xffda8b);
				testerArray[evt.keyID].drawRoundedRect(tPos[evt.keyID], testersY, testerW - 2 * tMargin, testersH, 10);
				testerArray[evt.keyID].endFill();

				playNote(evt.keyID);
			});
			keys[i].onUp.add(function(evt) {
				testerArray[evt.keyID].beginFill(0xfeedc9);
				testerArray[evt.keyID].drawRoundedRect(tPos[evt.keyID], testersY, testerW - 2 * tMargin, testersH, 10);
				testerArray[evt.keyID].endFill();
			});
		}

		var buttons = 6;
		var perLine = 3;
		var perColumn = 3;
		var margin = game.height / 200;

		var fieldX = game.width / 7;
		var fieldY = game.height * 3 / 12;
		var fieldWidth = game.width * (5 / 7);
		var fieldHeight = game.height * (1 / 3);
		var buttonWidth = fieldWidth / perLine;
		var buttonHeight = fieldHeight / perColumn;

		var pos = []
		var buttonArray = [];
		var textArray = [];
		var textStyle = {fill: "#3f287e", boundsAlignH: "center", boundsAlignV: "middle", fontSize: game.height / 20};

		for (var i = 0; i < buttons; i++) {
			var row = Math.floor(i / perColumn);
			var col = i % perLine;

			pos[i] = [];
			pos[i][0] = fieldX + col * buttonWidth + margin;
			pos[i][1] = fieldY + row * buttonHeight + margin;

			buttonArray[i] = game.add.graphics();
			buttonArray[i].beginFill(0xfeedc9);
			buttonArray[i].drawRoundedRect(pos[i][0], pos[i][1], buttonWidth - 2 * margin, buttonHeight - 2 * margin, 10);
			buttonArray[i].endFill();

			buttonArray[i].inputEnabled = true;
			buttonArray[i].buttonID = i;
			buttonArray[i].events.onInputDown.add(function(evt) {
				var i = evt.buttonID;
				buttonArray[i].beginFill(0xffda8b);
				buttonArray[i].drawRoundedRect(pos[i][0], pos[i][1], buttonWidth - 2 * margin, buttonHeight - 2 * margin, 10);
				buttonArray[i].endFill();
				setPicked(evt.buttonID);
			}, this);
			buttonArray[i].events.onInputOver.add(function(evt) {
				var i = evt.buttonID;
				buttonArray[i].beginFill(0xfffaef);
				buttonArray[i].drawRoundedRect(pos[i][0], pos[i][1], buttonWidth - 2 * margin, buttonHeight - 2 * margin, 10);
				buttonArray[i].endFill();
			}, this);

			var normalize = function(evt) {
				var i = evt.buttonID;
				buttonArray[i].beginFill(0xfeedc9);
				buttonArray[i].drawRoundedRect(pos[i][0], pos[i][1], buttonWidth - 2 * margin, buttonHeight - 2 * margin, 10);
				buttonArray[i].endFill();
			};
			buttonArray[i].events.onInputOut.add(normalize, this);
			buttonArray[i].events.onInputUp.add(normalize, this);

			textArray[i] = game.add.text(0, 0, content[i], textStyle);
			textArray[i].setTextBounds(pos[i][0], pos[i][1], buttonWidth - 2 * margin, buttonHeight);


		}

		var testersX = game.width / 10;
		var testersY = game.height * 3 / 5;
		var testersW = game.width * 8 / 10;
		var testersH = game.height / 10;
		var testerW = testersW / 8;
		var tMargin = game.height / 150;

		var tPos = [];
		var testerArray = [];
		var tTextArray = [];
		var tTextStyle = {fill: "#3f287e", boundsAlignH: "center", boundsAlignV: "middle", fontSize: game.height / 14};

		for (var i = 0; i < 8; i++) {
			tPos[i] = testersX + i * testerW + tMargin;

			testerArray[i] = game.add.graphics();
			testerArray[i].beginFill(0xfeedc9);
			testerArray[i].drawRoundedRect(tPos[i], testersY, testerW - 2 * tMargin, testersH, 10);
			testerArray[i].endFill();

			testerArray[i].inputEnabled = true;
			testerArray[i].buttonID = i;
			testerArray[i].events.onInputDown.add(function(evt) {
				var i = evt.buttonID;
				testerArray[i].beginFill(0xffda8b);
				testerArray[i].drawRoundedRect(tPos[i], testersY, testerW - 2 * tMargin, testersH, 10);
				testerArray[i].endFill();

				playNote(i);

			}, this);
			testerArray[i].events.onInputOver.add(function(evt) {
				var i = evt.buttonID;
				testerArray[i].beginFill(0xfffaef);
				testerArray[i].drawRoundedRect(tPos[i], testersY, testerW - 2 * tMargin, testersH, 10);
				testerArray[i].endFill();
			}, this);

			var normalize = function(evt) {
				var i = evt.buttonID;
				testerArray[i].beginFill(0xfeedc9);
				testerArray[i].drawRoundedRect(tPos[i], testersY, testerW - 2 * tMargin, testersH, 10);
				testerArray[i].endFill();
			};
			testerArray[i].events.onInputOut.add(normalize, this);
			testerArray[i].events.onInputUp.add(normalize, this);

			tTextArray[i] = game.add.text(0, 0, i + 1, tTextStyle);
			tTextArray[i].setTextBounds(tPos[i], testersY, testerW - 2 * tMargin, testersH);


		}
	},

	update: function () {



	},

	startGame: function (pointer) {
		//this.music.stop();

		this.state.start('Game', true, false, this.picked);
	}

};
