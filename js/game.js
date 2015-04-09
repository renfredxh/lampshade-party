BasicGame.Game = function (game) {
  this.LAMP_VELOCITY = 350;
  this.LAMP_JUMP_VELOCITY = 580;
  this.LAMP_ANGULAR_VELOCITY = 2;
  this.MOVE_TIMEOUT = 200;
  this.LEVEL_COUNT = 4;
};

BasicGame.Game.prototype = {

    create: function () {
      this.level = -1;
      this.thrownCount = 0;
      this.throwsPerLevel = null;

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
      this.lamp.canMove = { left: true, right: true, up: true };
      this.lamp.jumps = 2;

      // Lamp Physics
      this.physics.p2.enable(this.lamp);
      this.lamp.body.setRectangle(52, this.lamp.height);
      this.lamp.body.damping = 0.5;
      this.lamp.body.angularDamping = 0.6;
      // Lamp Body
      this.lamp.body.clearShapes();
      this.lamp.base = this.lamp.body.addRectangle(52, 20, 0, this.lamp.height/2 - 10);
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

      this.drinks = this.add.group();
      this.drinks .createMultiple(50, '', 0, false);

      this.cursors = this.input.keyboard.createCursorKeys();

      this.levelUp();
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
        if (this.lamp.jumps > 0 && this.lamp.canMove.up) {
          this.lamp.body.moveUp(this.LAMP_JUMP_VELOCITY);
          this.lamp.jumps--;
        }
      }
      this.lamp.canMove = { left: this.cursors.left.isUp, right: this.cursors.right.isUp, up: this.cursors.up.isUp };
    },

    throwDrink: function() {
      var drink = this.drinks.getFirstDead();
      drink.loadTexture('yuengling');
      this.physics.p2.enable(drink);
      drink.reset(0, 100);
      drink.body.moveRight(200);
      drink.body.rotateLeft(100);
      this.activeDrinks.push(drink);
      this.thrownCount++;
      if (this.thrownCount >= this.throwsPerLevel && this.level < this.LEVEL_COUNT - 1) {
        this.levelUp();
      }
    },

    levelUp: function() {
      this.level++;
      var timeBetweenThrows = [3, 1, 0.5, 0.3][this.level];
      this.throwsPerLevel = [10, 15, 50, 1000][this.level];
      this.time.events.repeat(Phaser.Timer.SECOND * timeBetweenThrows, this.throwsPerLevel, this.throwDrink, this);
      this.thrownCount = 0;
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
      } else if (shapeB === this.floorBound && shapeA === this.lamp.base) {
        this.lamp.jumps = 2;
      }
    },

    resetGame: function (pointer) {
        this.state.restart(true, false);
    }

};
