"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:AdversariesServ
 * @description
 * Service generating an adversary for each fight depending of the player's level.
 * Adversary are meant to be weak at the beginning and may (depending of randomisation)
 * be stronger than the player as he gains levels.
 */

angular.module("rpgApp").service("AdversariesServ", ["ItemsDB", function (ItemsDB) {

  var $scope = {};

  var names = ["Alfred", "Bob", "Caleb", "Darius", "Eric", "Franz", "Gustav", "Henry", "Isidore", "Jasper", "Kilian", "Leopold",
               "Maurice", "Nazim", "Octave", "Peter", "Quentin", "Rys", "Stanis", "Ulric", "Vassili", "Wiliam", "Xavier", "Yann", "Zadig"];

  var ranks = {"-2": "Robber", "-1": "Highwayman", "0": "Henchman", "1": "Mercenary", "2": "Guard",
               "3": "Soldier", "4": "Squire", "5": "Veteran", "6": "Captain", "7": "Knight", "8": "Champion"};

  /**
   * Generate a random level between 1 and the player's level,
   * then for each 4 player's level, the adversary has one more level.
   * The level is the overall power of the adversary.
   *
   * @param {integer} charLevel: player's level.
   */
  function setLevel(charLevel) {
    $scope.level = _.random(1, charLevel) + _.floor(charLevel / 4);
  }

  /**
   * Set a random difficulty for the encounter depending of the player's level.
   * The difficulty is a small power adjustment of the adversary.
   *
   * @param {integer} charLevel: player's level.
   * @param {integer} param: (not yet used) adjustment in adversary difficulty.
   */
  function setDifficulty(charLevel, param) {
    var add = param || 0;
    $scope.difficulty = _.random(-1, _.floor(charLevel / 3)) - 1 + add;
  }

  /**
   * Set the stats depending on the level and difficulty.
   */
  function setStats() {
    $scope.attribute = {
      strength: _.random(-1, _.max([1, $scope.difficulty])) + _.random(0, _.floor($scope.level / 5)),
      dexterity: _.random(-1, _.max([1, $scope.difficulty])) + _.random(0, _.floor($scope.level / 5)),
      endurance: _.random(-1, _.max([1, $scope.difficulty])) + _.random(0, _.floor($scope.level / 5)),
      //intelligence: _.random(0,2),
      //wisdom: _.random(0,2)
    };

    $scope.classStats = {
      name: "NPC",
      desc: "An angry NPC",
      sprite: new PIXI.Texture.fromImage("images/enemy.png"),
      lifePerLevel: 8,
      weightBonus: 0,
      hitBonus: 0,
      hitMultiplier: 1,
      defenceBonus: 0,
      criticalDamagesBonus: 0
    };

    $scope.stats = {
      name: ranks[$scope.difficulty] + " " + names[_.random(names.length - 1)],
      level: $scope.level,
      xpReward: $scope.level * (100 + 20 * $scope.difficulty)
    };
    $scope.stats.lifeMax = $scope.stats.level * ($scope.classStats.lifePerLevel + $scope.attribute.endurance + $scope.difficulty);
    $scope.stats.life = $scope.stats.lifeMax;
    //$scope.stats.manaMax = $scope.stats.level * (2 + $scope.attribute.wisdom + _.random(2) * $scope.difficulty);
    //$scope.stats.mana = $scope.stats.manaMax;

    $scope.weapon = ItemsDB.randomBaseWeapon($scope.difficulty);

    $scope.armor = ItemsDB.randomBaseArmor($scope.difficulty);

    $scope.stats.hitBonus = _.floor(($scope.stats.level + $scope.attribute.strength + $scope.weapon.hitBonus + $scope.weapon.enhancement + $scope.classStats.hitBonus) * $scope.classStats.hitMultiplier * (1 - _.max([0, $scope.armor.weight - $scope.classStats.weightBonus]) / 100)) + $scope.difficulty;

    $scope.stats.defence = 10 + $scope.attribute.dexterity + $scope.armor.defence + $scope.armor.enhancement + $scope.classStats.defenceBonus + $scope.difficulty;

  }


  return {
    getStats: function() {
      return {
        stats: _.extend({}, $scope.stats),
        classStats: $scope.classStats,
        attribute: $scope.attribute,
        weapon: $scope.weapon,
        armor: $scope.armor,
        spells: $scope.spells,
        inventory: $scope.inventory,
      };
    },

    /**
     * Create a new adversary with a power depending on the player's level.
     *
     * @param {integer} charLevel: player's level.
     * @param {integer} param: (not yet used) adjustment in adversary difficulty.
     */
    defineAdversary: function(charLevel, param) {
      setLevel(charLevel);
      setDifficulty(charLevel, param);
      setStats();
    },

    /**
     * Create the final Boss.
     *
     * @param {integer} charLevel: player's level.
     */
    setBoss: function(charLevel) {
      $scope.level = 30;
      $scope.difficulty = _.floor(charLevel / 5);
      setStats();
      $scope.stats.name = "Imperator A.";
      $scope.classStats.sprite = new PIXI.Texture.fromImage("images/boss.png");
    }
  };


}]);
