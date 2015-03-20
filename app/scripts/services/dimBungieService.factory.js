(function () {
  'use strict';

  angular.module('dimApp')
    .factory('dimBungieService', BungieService);

  BungieService.$inject = ['$rootScope', '$q', '$timeout', '$http', 'dimConfig', 'dimPlatformIds'];

  function BungieService($rootScope, $q, $timeout, $http, dimConfig, dimPlatformIds) {
    var tokenPromise = null;
    var service = {
      getPlatformIds: getPlatformIds,
      getStores: getStores
    };

    function getPlatformIds() {
      return $q.when()
        .then(getBungleToken)
        .then(getBnetUserRequest)
        .then($http)
        .then(processBnetUserRequest, rejectBnetUserRequest)
        .then(generatePlatfromIds);
    }

    function getStores() {
      return $q.when()
        .then(getBungleToken)
        .all([getDestinyGuiardianInventories(), getDestinyVault()]);
    }

    function getBnetCookies() {
      return $q(function (resolve, reject) {
        chrome.cookies.getAll({
          'domain': '.bungie.net'
        }, getAllCallback);

        function getAllCallback(cookies) {
          if (_.size(cookies) > 0) {
            resolve(cookies);
          } else {
            reject('No cookies found.');
          }
        }
      });
    }

    function getBungleToken() {
      tokenPromise = tokenPromise || $q.when()
        .then(getBnetCookies)
        .then(function(cookies) {
          return $q(function (resolve, reject) {
            var cookie = _.find(cookies, function (cookie) {
              return cookie.name === 'bungled';
            });

            if (!_.isUndefined(cookie)) {
              resolve(cookie.value);
            } else {
              if (_.isUndefined(location.search.split('reloaded')[1])) {
                chrome.tabs.create({
                  url: 'http://bungie.net',
                  active: false
                });

                setTimeout(function () {
                  window.location.reload(window.location.href + "?reloaded=true");
                }, 5000);
              }

              reject('No bungled cookie found.');
            }
          });
        });

      return tokenPromise;
    }

    function getBnetUserRequest(token) {
      return {
        method: 'GET',
        url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
        headers: {
          'X-API-Key': '57c5ff5864634503a0340ffdfbeb20c0',
          'x-csrf': token
        },
        withCredentials: true
      };
    }

    function processBnetUserRequest(response) {
      if (response.data.ErrorCode === 99) {
        return($q.reject("Please log into Bungie.net before using this extension."));
      }

      return(response.data);
    }

    function rejectBnetUserRequest(error) {
      return $q.reject("Message missing.");
    }

    function generatePlatfromIds(data) {
      var bungieUser = data.Response;
      var result = {};

      if (bungieUser.gamerTag) {
        result.xbl = {
          id: bungieUser.gamerTag,
          type: 1,
          label: 'Xbox'
        };
      }

      if (bungieUser.psnId) {
        result.psn = {
          id: bungieUser.psnId,
          type: 2,
          label: 'PlayStation'
        };
      }

      return result;
    }

    function getDestinyGuiardianInventories() {
      var promises = [];

      inventoryData = {};

      _.each(dimConfig.characterIds, function (characterId) {
        var p = $q(function (resolve, reject) {
          var request = {
            method: 'GET',
            url: 'https://www.bungie.net/Platform/Destiny/' + dimConfig.active.type + '/Account/' + dimConfig.membershipId + '/Character/' + characterId + '/Inventory/?definitions=true',
            headers: {
              'X-API-Key': '57c5ff5864634503a0340ffdfbeb20c0',
              'x-csrf': token
            },
            withCredentials: true
          };

          $http(request)
            .success(function (data, status, headers, config) {
              data.Response.characterId = characterId;
              inventoryData[characterId] = data.Response;
              resolve(data.Response);
            })
            .error(function (data) {
              reject(data);
              return;
            });
        });

        promises.push(p);
      });

      return $q.all(promises);
    }

    function getDestinyVault() {
      return $q(function(resolve, reject) {
        var request = {
          method: 'GET',
          url: 'https://www.bungie.net/Platform/Destiny/' + dimConfig.active.type + '/MyAccount/Vault/?definitions=true',
          headers: {
            'X-API-Key': '57c5ff5864634503a0340ffdfbeb20c0',
            'x-csrf': token
          },
          withCredentials: true
        };

        $http(request)
          .success(function (data, status, headers, config) {
            resolve(data);
          })
          .error(function (data) {
            reject(data);
          });
      });
    }

    return service;
  }
})();
