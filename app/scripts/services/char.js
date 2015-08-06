"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharServ
 * @description
 * #CharServ
 * Service of the rpgApp
**/

angular.module("rpgApp").service("CharServ", ["MapServ", function (MapServ) {

  var $scope = {};

  function randPos() {
    var posX = _.random(1,23);
    var posY = _.random(1,17);
    while (MapServ.isWall([posX, posY])) {
      posX = _.random(1,23);
      posY = _.random(1,17);
    }
    return [posX, posY];
  }


  return {
    create: function() {
      var position = randPos();
      $scope.position = {
        x: position[0],
        y: position[1]
      };

      // and other char inits
      $scope.attribute = {
        strength: 4,
        dexterity: 2,
        endurance: 3,
        intelligence: 0,
        wisdom: 1,
      };

      $scope.stats = {
        level: 1,
        experience: 0,
        lifeMax: this.level * (8 + $scope.attribute.endurance),
        life: this.lifeMax,
        manaMax: this.level * (2 + $scope.attribute.wisdom),
        mana: this.manaMax,
        hitBonus: this.level + $scope.attribute.strength, //+ $scope.weapon.enhancement,
        defence: 10 + $scope.attribute.dexterity //+ $scope.armor.defence + $scope.armor.enhancement
      };

      $scope.weapon = {
        name: "Rusty dagger",
        damages: "1d4",
        enhancement: 0
      };

      $scope.armor = {
        name: "Rusty Mail",
        defence: 0,
        enhancement: 0
      };

      $scope.spells = {
        "Heavy Blow": {
          damages: 5,
          hitBonus: -2,
          mana: 1
        },
        "Precise Blow": {
          damages: -1,
          hitBonus: 2,
          mana: 1
        }
      };

      $scope.inventory = {};

      $scope.quests = {};


    },
    getPosition: function() {
      return [$scope.position.x, $scope.position.y];
    },
    updatePosition: function(direction) {
      $scope.position.x += direction[0];
      $scope.position.y += direction[1];
      console.log("New hero location: " + $scope.position.x + ", " + $scope.position.y);
    },
    getAllDatas: function() {
      return {
        stats: $scope.stats,
        attribute: $scope.attribute
      };
    }
  };

}]);
