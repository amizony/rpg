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
    var renderer = PIXI.autoDetectRenderer(800, 600, {view:document.getElementById("game-canvas"), backgroundColor : 0x1099bb});

    var texture = PIXI.Texture.fromImage("images/yeoman.png");
    var yeo = new PIXI.Sprite(texture);
    yeo.anchor.x = 0.5;
    yeo.anchor.y = 0.5;
    yeo.position.x = 400;
    yeo.position.y = 300;
    stage.addChild(yeo);


    animate();
    function run(callback) {
      requestAnimationFrame(callback);
      frames += 1;
    }


    function animate() {
      requestAnimationFrame(animate);
      var posX = _.random(-5, 5);
      var posY = _.random(-5, 5);
      yeo.position.x += posX;
      yeo.position.y += posY;
      renderer.render(stage);
      frames += 1;
    }

  });
