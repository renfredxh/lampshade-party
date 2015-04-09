BasicGame.Game = function (game) {
  this.LAMP_VELOCITY = 350;
  this.LAMP_JUMP_VELOCITY = 580;
  this.LAMP_ANGULAR_VELOCITY = 2;
  this.MOVE_TIMEOUT = 200;
};

BasicGame.Game.prototype = {

    create: function () {
      this.background = this.add.tileSprite(0, 0, 1080, 720, 'partyBackground');
      this.background.width = 1080;

      this.physics.startSystem(Phaser.Physics.P2JS);
      this.physics.p2.gravity.y = 250;
      this.physics.p2.restitution = 0.5;

      /**
       * Floor
       */
      this.floor = this.add.sprite(0, 720);
      this.physics.p2.enable(this.floor);
      this.floor.body.clearShapes();
      this.floorBound = this.floor.body.addRectangle(1080, 1, 1080/2, 0);
      this.floor.body.static = true;

      /*
       * Lamp
       */
      this.lamp = this.add.sprite(this.world.centerX, 500, 'lamp');
      this.lamp.canMove = { left: true, right: true };

      // Lamp Physics
      this.physics.p2.enable(this.lamp);
      this.lamp.body.setRectangle(52, this.lamp.height);
      this.lamp.body.damping = 0.5;
      this.lamp.body.angularDamping = 0.6;
      // Lamp Body
      this.lamp.body.clearShapes();
      this.lamp.body.addRectangle(52, 20, 0, this.lamp.height/2 - 10);
      this.lamp.body.addRectangle(16, 250, 0, 36);
      this.lamp.rightShade = this.lamp.body.addRectangle(78, 45, 10, -125, Phaser.Math.degToRad(70));
      this.lamp.leftShade = this.lamp.body.addRectangle(78, 45, -12, -125, Phaser.Math.degToRad(-70));
      this.lamp.body.collideWorldBounds = true;
      this.lamp.body.onBeginContact.add(this.hitFloor, this);
      //this.lamp.body.debug = true;

      /*
       * Drinks
       */
      this.activeDrinks = [];
      this.yuenglings = this.add.group();
      this.yuenglings.createMultiple(5, 'yuengling', 0, false);

      this.time.events.repeat(Phaser.Timer.SECOND * 3, 100, this.throwDrink, this);

      this.cursors = this.input.keyboard.createCursorKeys();


      //this.lampDebug = new Phaser.Physics.P2.BodyDebug(this, this.lamp.body);
    },

    update: function () {
      this.moveLamp();
      this.recycle();
    },

    moveLamp: function() {
      if (this.cursors.left.isDown && this.lamp.canMove.left) {
        this.lamp.body.rotateLeft(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveLeft(this.LAMP_VELOCITY);
      } else if (this.cursors.right.isDown && this.lamp.canMove.right) {
        this.lamp.body.rotateRight(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveRight(this.LAMP_VELOCITY);
      } else if (this.cursors.up.isDown) {
        if (this.lamp.body.y >= 0) {
          this.lamp.body.moveUp(this.LAMP_JUMP_VELOCITY);
        }
      }
      this.lamp.canMove = { left: this.cursors.left.isUp, right: this.cursors.right.isUp };
    },

    throwDrink: function() {
      var drink = this.yuenglings.getFirstDead();
      drink.reset(0, 100);
      this.physics.p2.enable(drink);
      drink.body.moveRight(200);
      drink.body.rotateLeft(100);
      this.activeDrinks.push(drink);
    },

    recycle: function() {
      var inactive = [];
      this.activeDrinks.forEach(function(drink) {
        if (drink.y > 650 && drink.body.velocity.y <= 1) {
          drink.kill();
          inactive.push(drink);
        }
      });
      inactive.forEach(function(drink) {
        var index = this.activeDrinks.indexOf(drink);
        this.activeDrinks.splice(index, 1);
      }.bind(this));
    },

    hitFloor: function(body, shapeA, shapeB) {

      if (shapeB === this.floorBound && 
          (shapeA === this.lamp.leftShade || shapeA === this.lamp.rightShade)) {
        this.resetGame();
      }
    },

    resetGame: function (pointer) {
        this.state.restart();
    }

};
