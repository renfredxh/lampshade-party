BasicGame.Game = function (game) {
  this.LAMP_VELOCITY = 350;
  this.LAMP_FAST_FALL_VELOCITY = 1111;
  this.LAMP_JUMP_VELOCITY = 580;
  this.LAMP_ANGULAR_VELOCITY = 2;
  this.MOVE_TIMEOUT = 200;
  this.LEVEL_COUNT = 5;
  this.DRINK_TYPES = [
    { name: 'malibu', mass: 3, velocity: 200, spin: 360 },
    { name: 'everclear', mass: 20, velocity: 151, spin: 20 },
    { name: 'jackdaniels', mass: 4.5, velocity: 200, spin: 0 },
    { name: 'woodchuck', mass: 1, velocity: 600, spin: 10 },
    { name: 'pbr', mass: 0.8, velocity: 150, spin: 10 },
    { name: 'guinness', mass: 3, velocity: 100, spin: 0 },
    { name: 'hpnotiq', mass: 0.5, velocity: 20, spin: 900 },
    { name: 'yuengling', mass: 0.3, velocity: 200, spin: 100 },
    { name: 'fourloko', mass: 0.4, velocity: 400, spin: 1000 },
    { name: 'somersby', mass: 0.8, velocity: 10, spin: 150 },
    { name: 'rouge', mass: 1.5, velocity: 300, spin: 300 },
    { name: 'coorslight', mass: 0.1, velocity: 50, spin: 50 },
    { name: 'smirnoffice', mass: 0.8, velocity: 300, spin: 30 },
  ];
};

BasicGame.Game.prototype = {

    create: function () {
      this.level = -1;
      this.thrownCount = 0;
      this.throwsPerLevel = null;
      this.rnd.sow([Date.now(), this.time.now]);

      this.background = this.add.tileSprite(0, 0, 1080, 720, 'partyBackground');
      this.background.width = 1080;

      this.clinkSfx = [
        this.add.audio('clink1'), this.add.audio('clink2'),
        this.add.audio('clink3'), this.add.audio('clink4'),
        this.add.audio('clink5'), this.add.audio('clink6'),
        this.add.audio('clink7'), this.add.audio('clink8')
      ];

      this.crashSfx = this.add.audio('crash', 0.55);
      this.crashSfx.allowMultiple = false;
      this.jumpSfx = this.add.audio('jump', 0.60);
      this.doubleJumpSfx = this.add.audio('jump2', 0.60);

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

    playClink: function() {
      var sound = this.rnd.pick(this.clinkSfx);
      sound.play();
    },

    moveLamp: function() {
      if (this.cursors.left.isDown && this.lamp.canMove.left) {
        this.lamp.body.rotateLeft(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveLeft(this.LAMP_VELOCITY);
      } else if (this.cursors.right.isDown && this.lamp.canMove.right) {
        this.lamp.body.rotateRight(this.LAMP_ANGULAR_VELOCITY);
        this.lamp.body.moveRight(this.LAMP_VELOCITY);
      } else if (this.cursors.down.isDown && this.lamp.canMove.down) {
        this.lamp.body.moveDown(this.LAMP_FAST_FALL_VELOCITY);
      } else if (this.cursors.up.isDown) {
        if (this.lamp.jumps > 0 && this.lamp.canMove.up) {
          if (this.lamp.jumps === 2) this.jumpSfx.play();
          else this.doubleJumpSfx.play();
          this.lamp.body.moveUp(this.LAMP_JUMP_VELOCITY);
          this.lamp.jumps--;
        }
      }
      this.lamp.canMove = {
        left: this.cursors.left.isUp,
        right: this.cursors.right.isUp,
        up: this.cursors.up.isUp,
        down: this.cursors.down.isUp
      };
    },

    throwDrink: function() {
      var drink = this.drinks.getFirstDead();
      var type = this.rnd.pick(this.DRINK_TYPES);
      drink.loadTexture(type.name);
      this.physics.p2.enable(drink);
      this.rnd.pick([
        function() {
          drink.reset(0, 100);
          drink.body.moveRight(type.velocity);
        },
        function() {
          drink.reset(1080, 100);
          drink.body.moveLeft(type.velocity);
        },
        function() {
          drink.reset(0, 350);
          drink.body.moveRight(type.velocity);
        },
        function() {
          drink.reset(1080, 350);
          drink.body.moveLeft(type.velocity);
        },
        function() {
          drink.reset(270, 0);
          drink.body.moveDown(type.velocity);
        },
        function() {
          drink.reset(540, 0);
          drink.body.moveDown(type.velocity);
        },
        function() {
          drink.reset(810, 0);
          drink.body.moveDown(type.velocity);
        },
      ])();
      drink.body.rotateLeft(this.rnd.pick([1, -1]) * type.spin);
      drink.body.mass = type.mass;
      this.activeDrinks.push(drink);
      this.thrownCount++;
      if (this.thrownCount >= this.throwsPerLevel && this.level < this.LEVEL_COUNT - 1) {
        this.levelUp();
      }
    },

    levelUp: function() {
      this.level++;
      var timeBetweenThrows = [1.5, 1, 0.5, 0.3, 0.1][this.level];
      this.throwsPerLevel = [5, 10, 25, 50, 10000][this.level];
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
        this.crashSfx.play(false);
        this.resetGame();
      } else if (shapeB === this.floorBound && shapeA === this.lamp.base) {
        this.lamp.jumps = 2;
      } else if (shapeB.type === 32){
        // On collision with a rectangle (drink), play sound effects.
        if (shapeB.wasHit === undefined || shapeB.wasHit === false) {
          this.playClink();
          shapeB.wasHit = true;
          timer = this.time.create();
          timer.add(750, function() { shapeB.wasHit = false; }, this);
          timer.start();
        }
      }
    },

    resetGame: function (pointer) {
        this.state.restart(true, false);
    }

};
