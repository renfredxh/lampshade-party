BasicGame.Game = function (game) {
  this.LAMP_VELOCITY = 250;
  this.LAMP_ANGULAR_VELOCITY = 4;
};

BasicGame.Game.prototype = {

    create: function () {
      this.background = this.add.tileSprite(0, 0, 1080, 720, 'partyBackground');
      this.background.width = 1080;

      this.physics.startSystem(Phaser.Physics.P2JS);

      // Lamp
      this.lamp = this.add.sprite(200, 200, 'lamp');
      this.physics.p2.enable(this.lamp);
      this.lamp.body.setRectangle(52, this.lamp.height);
      this.physics.p2.gravity.y = 250;
      this.physics.p2.restitution = 0.5;

      this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
      if (this.cursors.left.isDown) {
        this.lamp.body.rotateLeft(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveLeft(this.LAMP_VELOCITY);
      } else if (this.cursors.right.isDown) {
        this.lamp.body.rotateRight(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveRight(this.LAMP_VELOCITY);
      } else if (this.cursors.up.isDown) {
        if (this.lamp.body.y > 490) {
          this.lamp.body.moveUp(250);
        }
      }
    },

    quitGame: function (pointer) {
        this.state.start('Game');
    }

};
