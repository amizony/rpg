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

  function levelUP() {
    $scope.stats.experience -= $scope.stats.level *1000;
    $scope.stats.level += 1;

    $scope.stats.lifeMax = $scope.stats.level * (8 + $scope.attribute.endurance);
    $scope.stats.life = $scope.stats.lifeMax;
    $scope.stats.manaMax = $scope.stats.level * (2 + $scope.attribute.wisdom);
    $scope.stats.mana = $scope.stats.manaMax;
    $scope.stats.hitBonus = $scope.stats.level + $scope.attribute.strength; //+ $scope.weapon.enhancement;
    $scope.stats.defence = 10 + $scope.stats.level + $scope.attribute.dexterity; //+ $scope.armor.defence + $scope.armor.enhancement;

    console.log("You gained a level! You are now level " + $scope.stats.level);
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
        experience: 0
      };
      $scope.stats.lifeMax = $scope.stats.level * (8 + $scope.attribute.endurance);
      $scope.stats.life = $scope.stats.lifeMax;
      $scope.stats.manaMax = $scope.stats.level * (2 + $scope.attribute.wisdom);
      $scope.stats.mana = $scope.stats.manaMax;

      $scope.weapon = {
        name: "Rusty sword",
        damages: "1d6",
        enhancement: 0
      };

      $scope.stats.hitBonus = $scope.stats.level + $scope.attribute.strength + $scope.weapon.enhancement;

      $scope.armor = {
        name: "Leather Armor",
        defence: 2,
        enhancement: 0
      };

      $scope.stats.defence = 10 + $scope.stats.level + $scope.attribute.dexterity + $scope.armor.defence + $scope.armor.enhancement;

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
      //console.log("New hero location: " + $scope.position.x + ", " + $scope.position.y);
    },
    getAllDatas: function() {
      return {
        stats: $scope.stats,
        attribute: $scope.attribute,
        weapon: $scope.weapon,
        armor: $scope.armor,
        spells: $scope.spells,
        inventory: $scope.inventory,
        quests: $scope.quests
      };
    },
    takeDamages: function(dmg) {
      $scope.stats.life -= dmg;
    },
    getXP: function(exp) {
      $scope.stats.experience += exp;
      if ($scope.stats.experience >= $scope.stats.level * 1000) {
        levelUP();
      }
    },
    dying: function() {
      // for now only a 'resurection'
      console.log("The gods are merciful, you can continue your quest.");
      $scope.stats.life = $scope.stats.lifeMax;
    }
  };

}]);
