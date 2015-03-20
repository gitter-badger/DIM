/*jshint -W027*/

(function () {
  'use strict';

  angular.module('dimApp')
    .directive('dimPlatformChoice', PlatformChoice);

  PlatformChoice.$inject = [];

  function PlatformChoice() {
    return {
      controller: 'dimPlatformChoiceCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
      restrict: 'A',
      template: [
        '<span id="user" class="header-right">{{ vm.active.id }}</span>',
        '<select id="system" ng-options="platform.label for platform in vm.platforms" ng-model="vm.active" ng-change="vm.update()"></select>'
      ].join('')
    };
  }
})();
