BasicGame.Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;

  this.ready = false;
};

BasicGame.Preloader.prototype = {

  preload: function () {
    //  Here we load the rest of the assets our game needs.
    //  As this is just a Project Template I've not provided these assets, swap them for your own.
    this.load.image('partyBackground', 'assets/partyLights.jpg');
    this.load.image('lamp', 'assets/lamp.png');

  },

  create: function () {
  },

  update: function () {
    this.state.start('Game');
  }

};
