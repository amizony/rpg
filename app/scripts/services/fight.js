"use strict";

/**
 * @ngdoc function
 * @name rpgApp.service:FightEngine
 * @description
 * #FightEngine
 * Service of the rpgApp
**/

angular.module("rpgApp").service("FightEngine", ["CharServ", "AdversariesDB", function (CharServ, AdversariesDB) {

  var $scope = {};


  return {
    fight: function() {
      var player = CharServ.getAllDatas();
      var mob = AdversariesDB.getStats();

      // do stuff

      var victory = (_.random(3) > 0);
      return victory;
    }
  };




}]);
