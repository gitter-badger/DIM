(function () {
  'use strict';

  angular.module('dimApp')
    .directive('dimStores', Stores);

  Stores.$inject = ['ngDialog'];

  function Stores(ngDialog) {
    return {
      controller: 'StoresCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
      template: [
        '<div ng-repeat="store in vm.stores" class="storage">',
        '  <div dim-store-heading store-data="store"></div>',
        '  <div dim-store-items store-data="store"></div>',
        '</div>'
      ].join('')
    };
  }
})();
