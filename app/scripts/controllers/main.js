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


    var stage = new PIXI.Container();
    var renderer = PIXI.autoDetectRenderer(800, 608, {view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb});

    var groundTexture = PIXI.Texture.fromImage("images/ground.png");
    var wallTexture = PIXI.Texture.fromImage("images/wall.png");

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
      stage.addChild(square);
    }


    function animate() {
      requestAnimationFrame(animate);
      renderer.render(stage);
      frames += 1;
    }

    animate();

  });
