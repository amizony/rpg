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




    var stage = new PIXI.Container();
    var renderer = PIXI.autoDetectRenderer(800, 608, {view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb});

    var mapContainer = new PIXI.Container();
    var map;
    var groundTexture = PIXI.Texture.fromImage("images/ground.png");
    var wallTexture = PIXI.Texture.fromImage("images/wall.png");

    stage.addChild(mapContainer);
    $.getJSON("resources/map.json", function(data) {
       map = mapRefection(data);
       var posX = -16;
       var posY = -16;

       for (var line in map) {
         posY += 32;
         posX = -16;
         for (var i = 0; i < map[line].length; i++) {
           posX += 32;
           if (map[line][i] === 0) {
             createSquare(posX, posY, wallTexture);
           } else {
             createSquare(posX, posY, groundTexture);
           }
         }
       }
    });

    function mapRefection(data) {
      var reflectionX = _.random(1) === 1;
      var reflectionY = _.random(1) === 1;
      var mapp = data;

      if (reflectionX) {
        for (var line in mapp) {
          mapp[line] = mapp[line].reverse();
        }
      }
      if (reflectionY) {
        var temp = [];
        for (var line in mapp) {
          temp.push(mapp[line]);
        }
        for (var line in mapp) {
          mapp[line] = temp.pop();
        }
      }
      return mapp;
    }

    function createSquare(x, y, texture) {
      var square = new PIXI.Sprite(texture);
      square.anchor.set(0.5);
      square.scale.set(0.125);
      square.position.x = x;
      square.position.y = y;
      mapContainer.addChild(square);
    }

    function isWall(x, y) {
      console.log("hi");
      var count = 0;
      for (var line in map) {
        if (count === y) {
          for (var i = 0; i < map[line].length; i++) {
            if (i === x) {
              return (map[line][i] === 0);
            }
          }
        }
        count += 1;
      }
    }

    var character;
    var charTexture = PIXI.Texture.fromImage("images/SuaRQmP.png");
    function createChar() {
      character = new PIXI.Sprite(charTexture);
      character.anchor.set(0.5);
      character.scale.set(0.05);
      var position = randPos();
      character.position.x = position[0]*32 + 16;
      character.position.y = position[1]*32 + 16;
      stage.addChild(character);
    }
    createChar();

    function randPos() {
      var posX = _.random(12);
      var posY = _.random(12);
      while (isWall(posX, posY)) {
        console.log("is wall");
        posX = _.random(12);
        posY = _.random(12);
      }
      return [posX, posY];
    }

    function moveChar(dir) {

    }

    function animate() {
      renderer.render(stage);
      frames += 1;
      requestAnimationFrame(animate);
    }

    animate();

  });
