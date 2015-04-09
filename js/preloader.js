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
    this.load.image('yuengling', 'assets/yuengling.png');
    this.load.image('hpnotiq', 'assets/hpnotiq.png');
    this.load.image('guinness', 'assets/guinness.png');
    this.load.image('pbr', 'assets/pbr.png');
    this.load.image('woodchuck', 'assets/woodchuck.png');
    this.load.image('jackdaniels', 'assets/jack-daniels.png');
    this.load.image('everclear', 'assets/everclear.png');
    this.load.image('fourloko', 'assets/fourloko.png');
    this.load.image('somersby', 'assets/somersby.png');
    this.load.image('rouge', 'assets/rouge.png');
    this.load.image('coorslight', 'assets/coors.png');
    this.load.image('smirnoffice', 'assets/smirnoff-ice.png');
    this.load.image('malibu', 'assets/malibu.png');
  },

  create: function () {
  },

  update: function () {
    this.state.start('Game');
  }

};
