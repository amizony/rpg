"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:CharServ
 * @description
 * Service holding every data related to the character.
 * Provide functions to access or modify them.
 */

angular.module("rpgApp").service("CharServ", ["MapServ", function (MapServ) {

  var $scope = {};

  /**
   * Determine the initial position of the player.
   *
   * @return {array} position of hero, as [x,y].
   */
  function randPos() {
    var posX = _.random(0,37);
    var posY = _.random(0,35);
    while (MapServ.isWall([posX, posY])) {
      posX = _.random(0,37);
      posY = _.random(0,35);
    }
    return [posX, posY];
  }


  /**
   * Randomize attribute with a non-linear repartition
   *
   * @return {integer} attribute, between 0 and 4.
   */
  function randAttribute() {
    var dice1 = _.random(1, 6);
    var dice2 = _.random(1, 6);
    var attribute = _.floor((dice1 + dice2 - 4) / 2);
    return Math.max(0, attribute);
  }

  /**
   * Provide a level increase to the player.
   * Increase and recalculate the player's stats.
   */
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
    /**
     * Create the character.
     */
    create: function() {
      var position = randPos();
      $scope.position = {
        x: position[0],
        y: position[1]
      };

      $scope.attribute = {
        strength: randAttribute(),
        dexterity: randAttribute(),
        endurance: randAttribute(),
        intelligence: randAttribute(),
        wisdom: randAttribute()
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
        critical: [19, 2],
        enhancement: 0
      };

      $scope.stats.hitBonus = $scope.stats.level + $scope.attribute.strength + $scope.weapon.enhancement;

      $scope.armor = {
        name: "Leather Armor",
        defence: 2,
        enhancement: 0
      };

      $scope.stats.defence = 10 + _.floor($scope.stats.level / 2) + $scope.attribute.dexterity + $scope.armor.defence + $scope.armor.enhancement;

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

      $scope.inventory = {
        "Resurection Stone": {
          quantity: 3,
          usable: false
        },
        "Life Potion": {
          quantity: 5,
          usable: true
        }
      };

      $scope.quests = {};


    },
    /**
     * @return {array} cell coordinates of player, as [x,y].
     */
    getPosition: function() {
      return [$scope.position.x, $scope.position.y];
    },

    /**
     * @param {array} direction: adjustment of position to apply, as [+x, +y].
     */
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

    /**
     * function not yet used
     *
     * @param {integer} dmg: damages taken by the player.
     */
    takeDamages: function(dmg) {
      $scope.stats.life -= dmg;
      if ($scope.stats.life < 1) {
        this.die();
      }
    },

    /**
     * @param {integer} exp: experience gained by the player.
     */
    getXP: function(exp) {
      $scope.stats.experience += exp;
      if ($scope.stats.experience >= $scope.stats.level * 1000) {
        levelUP();
      }
    },
    /**
     * Gaining a new item or increasing the number of one already in inventory.
     *
     * @param {string} name: the item to add to the inventory.
     */
    gainItem: function(name) {
      if (_.isUndefined($scope.inventory[name])) {
        $scope.inventory[name].quantity = 1;
        $scope.inventory[name].usable = false; // will require an item DB
      } else {
        $scope.inventory[name].quantity += 1;
      }
    },

    /**
     * When the life reaches 0 the character dies. A Resurection Stone allows to continue,
     * else a new game is started.
     *
     * @return {string} message to display in the combat log.
     */
    die: function() {
      if ($scope.inventory["Resurection Stone"].quantity > 0) {
        $scope.inventory["Resurection Stone"].quantity -= 1;
        $scope.stats.life = $scope.stats.lifeMax;
        return ["The use of a Resurection Stone allows you to continue your adventure (" + $scope.inventory["Resurection Stone"].quantity + " left)."];
      } else {
        var temp = $scope.position;
        this.create();
        $scope.position = temp;
        return ["No Resurection Stones left - Game Over.", "New Game started"];
      }
    },

    /**
     * Regain 1 mana point.
     */
    manaRegen: function() {
      $scope.stats.mana = Math.min($scope.stats.mana + 1, $scope.stats.manaMax);
    },

    /**
     * Regain 1 life point.
     */
    lifeRegen: function() {
      $scope.stats.life = Math.min($scope.stats.life + 1, $scope.stats.lifeMax);
    }
  };

}]);
