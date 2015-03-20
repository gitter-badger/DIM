(function () {
  'use strict';

  angular.module('dimApp')
    .value('dimPlatformIds', {
      xbl: null,
      psn: null
    })
    .value('dimConfig', {
      'membershipType': -1,
      'active': {}
    })
    .value('dimItemTier', {
      exotic: 'exotic',
      legendary: 'legendary',
      rare: 'rare',
      uncommon: 'uncommon',
      basic: 'basic'
    })
    .value('dimCategory', {
      Weapons: [
        'Primary',
        'Special',
        'Heavy',
      ],
      Armor: [
        'Helmet',
        'Gauntlets',
        'Chest',
        'Leg',
        'ClassItem',
      ],
      General: [
        'Emblem',
        'Armor',
        'Ghost',
        'Ship',
        'Vehicle',
        'Consumable',
        'Material'
      ]
    });

  angular.module('dimApp')
    .config(function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/inventory");

      $stateProvider
        .state('inventory', {
          url: "/inventory",
          templateUrl: "views/inventory.html"
        });
    });
})();
