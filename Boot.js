var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

  init: function () {
    this.input.maxPointers = 1;

    //  Automatically pause if the browser tab the game is in loses focus.
    this.stage.disableVisibilityChange = false;

    if (this.game.device.desktop) {
      //  Desktop specific settings.
      this.scale.pageAlignHorizontally = true;
      this.scale.setMinMax(480, 260, 1920, 1200);
    } else {
      //  Mobile specific settings.
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1920, 1200);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }
  },

  preload: function () {

    //  Load preloader assets.
    this.load.image('preloaderBackground', 'assets/titlepage.png');
    this.load.image('preloaderTitle', 'assets/title.png');
    this.load.image('preloaderBar', 'assets/preloader_bar.png');
  },

  create: function () {
    this.state.start('Preloader');
  }

};
