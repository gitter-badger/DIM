(function() {
  'use strict';

  angular.module('dimApp').controller('dimStoreCtrl', StoreCtrl);

  StoresCtrl.$inject = ['$scope', 'dimStoreService'];

  function StoresCtrl($scope, dimStoreService) {
    var vm = this;

    vm.stores = null;

    activate();

    function activate() {
      dimStoreService.getStores()
        .then(function(result) {
          vm.stores = null;
        });
    }

    $scope.$on('')

    $scope.$watch(function () {
      return dimStoreService.getStores();
    }, function (newVal) {
      vm.stores = newVal;
    });
  }
})();
