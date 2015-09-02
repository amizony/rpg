"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharCreation
 * @description
 * Service taking care of character creation (display and stats init).
 */

angular.module("rpgApp").service("CharCreation", ["ItemsDB", function (ItemsDB) {

  var $scope = {};

  // own display

  // choose a class

  // roll attributes (and reroll them at a price)

  // choose a sprite

  //choose a name

 // stater items depending on class or can be choosen

 return {
  create: function (dfd) {
    $scope.creationPage = new PIXI.Container();

    var newText = new PIXI.Text("Character Creation Page, wait 3s to continue", {});
    newText.position.x = 100;
    newText.position.y = 200;
    $scope.creationPage.addChild(newText);


    var result;

    // async char creation
    window.setTimeout(function() {
      result = window.confirm("Continue?");
    }, 3000);

    // validating the char when done and proceed to the game (will be a button)
    var int = window.setInterval(function() {
      if (result) {
        dfd.resolve();
        clearInterval(int);
      }
    }, 100);

    return $scope.creationPage;
  },
  getDisplay() {
    return $scope.creationPage;
  }

 };
}]);
