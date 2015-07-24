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
    var groundTexture = PIXI.Texture.fromImage("images/ground.png");
    var wallTexture = PIXI.Texture.fromImage("images/wall.png");

    stage.addChild(mapContainer);
    $.getJSON("resources/map.json", function(data) {
       var map = mapRefection(data);
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

    var character;
    var charTexture = PIXI.Texture.fromImage("images/SuaRQmP.png");
    function createChar(x, y) {
      character = new PIXI.Sprite(charTexture);
      character.anchor.set(0.5);
      character.scale.set(0.05);
      character.position.x = x;
      character.position.y = y;
      stage.addChild(character);
    }
    createChar(400, 300);

    function animate() {
      var movX = _.random(-3, 3);
      var movY = _.random(-3, 3);
      character.position.x += movX;
      character.position.y += movY;

      renderer.render(stage);
      frames += 1;
      requestAnimationFrame(animate);
    }

    animate();

  });
