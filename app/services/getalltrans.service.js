/**
 * Created by davidbridges on 6/8/16.
 */

(function() {

    function GetAllTransService($http, $q) {
        var GetAllTransService = {};

        GetAllTransService.connectURL = 'https://prod-api.level-labs.com/api/v2/core/get-all-transactions';

        GetAllTransService.getAllTrans = function () {

            var deferred = $q.defer();  //  Create a deferred operation.

            var req = {
                method: 'POST',
                url: GetAllTransService.connectURL,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json'
                },
                data: {
                    args: {
                        "uid": 1110590645,
                        "token": "DE8185F67367597706CCED1069BD8C26",
                        "api-token": "AppTokenForInterview",
                        "json-strict-mode": false,
                        "json-verbose-response": false
                    }
                }
            };

            $http(req).then(
                function successCallback(response) {
                    deferred.resolve(response);
                },
                function errorCallback(response) {
                    deferred.resolve(response);
                }
            );

            return deferred.promise;
        };

        return GetAllTransService;

    }

    angular
        .module('lm')
        .factory('GetAllTransService', ['$http', '$q', GetAllTransService]);
}());