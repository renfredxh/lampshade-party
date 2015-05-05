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
    this.load.audio('clink1', ['sfx/clink1.ogg', 'sfx/clink1.mp3', 'sfx/clink1.wav']);
    this.load.audio('clink2', ['sfx/clink2.ogg', 'sfx/clink2.mp3', 'sfx/clink2.wav']);
    this.load.audio('clink3', ['sfx/clink3.ogg', 'sfx/clink3.mp3', 'sfx/clink3.wav']);
    this.load.audio('clink4', ['sfx/clink4.ogg', 'sfx/clink4.mp3', 'sfx/clink4.wav']);
    this.load.audio('clink5', ['sfx/clink5.ogg', 'sfx/clink5.mp3', 'sfx/clink5.wav']);
    this.load.audio('clink6', ['sfx/clink6.ogg', 'sfx/clink6.mp3', 'sfx/clink6.wav']);
    this.load.audio('clink7', ['sfx/clink7.ogg', 'sfx/clink7.mp3', 'sfx/clink7.wav']);
    this.load.audio('clink8', ['sfx/clink8.ogg', 'sfx/clink8.mp3', 'sfx/clink8.wav']);
    this.load.audio('crash', ['sfx/crash.ogg', 'sfx/crash.mp3', 'sfx/crash.wav']);
    this.load.audio('jump', ['sfx/jump.ogg', 'sfx/jump.mp3', 'sfx/jump.wav']);
    this.load.audio('jump2', ['sfx/jump2.ogg', 'sfx/jump2.mp3', 'sfx/jump2.wav']);
    this.load.audio('beat', ['sfx/beat.wav', 'sfx/beat.mp3', 'sfx/beat.ogg']);
  },

  create: function () {
  },

  update: function () {
    this.music = this.add.audio('beat', 0.25, true);
    this.music.loop = true;
    this.music.play();
    this.state.start('Game');
  }

};
