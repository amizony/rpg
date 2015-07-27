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
    var charTexture = PIXI.Texture.fromImage("images/SuaRQmP.png");
    var character;

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
    }).then(createChar);

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
      return false;
    }

    function createChar() {
      character = new PIXI.Sprite(charTexture);
      character.anchor.set(0.5);
      character.scale.set(0.05);
      var position = randPos();
      character.position.x = position[0]*32 + 16;
      character.position.y = position[1]*32 + 16;
      stage.addChild(character);
    }

    function randPos() {
      var posX = _.random(24);
      var posY = _.random(18);
      while (isWall(posX, posY)) {
        posX = _.random(24);
        posY = _.random(18);
      }
      return [posX, posY];
    }

    function moveChar(dir) {
      if (!isWall((character.position.x - 16) / 32 + dir[0], (character.position.y - 16) / 32 + dir[1])) {
        character.position.x += dir[0]*32;
        character.position.y += dir[1]*32;
      }
    }

    window.addEventListener("keydown", function(event) {
      // left key
      if (event.keyCode === 37) {
        moveChar([-1,0]);
      }
      // up key
      if (event.keyCode === 38) {
        moveChar([0,-1]);
      }
      // right key
      if (event.keyCode === 39) {
        moveChar([1,0]);
      }
      // down key
      if (event.keyCode === 40) {
        moveChar([0,1]);
      }
    });


    function animate() {
      renderer.render(stage);
      frames += 1;
      requestAnimationFrame(animate);
    }

    animate();

  });
