'use strict';

/**
 * @ngdoc function
 * @name rpgApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rpgApp
 */
angular.module('rpgApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var frames = 0;
    var fps = 0;

    window.setInterval( function() {
      var fpsPosition = document.getElementById("fps-div");
      fps = "fps: " + frames;
      frames = 0;
      fpsPosition.innerHTML = fps;
    }, 1000);

    var map;
    function loadMap() {
    	map = JSON.parse(data);
    }

    loadMap();
    var stage = new PIXI.Container();
    var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb});

    var groundTexture = PIXI.Texture.fromImage("images/ground.png");
    var wallTexture = PIXI.Texture.fromImage("images/wall.png");

    var posX = -16;
    var posY = -16;

    for (var line in map) {
      posY += 32;
      posX = -16;
      for (var i = 0; i < map[line].length; i++) {
        posX += 32;
        map[line][i] = _.random(2);
        if (map[line][i] == 0) {
          createSquare(posX, posY, wallTexture);
        } else {
          createSquare(posX, posY, groundTexture);
        }
      }
    }

    function createSquare(x, y, texture) {
      var square = new PIXI.Sprite(texture);
      square.anchor.set(0.5);
      square.scale.set(0.125);
      square.position.x = x;
      square.position.y = y;
      stage.addChild(square);
    }


    function animate() {
      requestAnimationFrame(animate);
      renderer.render(stage);
      frames += 1;
    }

    animate();

  });
