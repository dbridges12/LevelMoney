/**
 * Created by davidbridges on 6/8/16.
 */

(function() {
    'use strict';
    function config($stateProvider, $locationProvider, $urlRouterProvider) {
        $locationProvider
            .html5Mode({
                enabled: true,     // hashbang URLs are disabled
                requireBase: false
            });


        $urlRouterProvider.otherwise('/LevelMoney/index.html');  // map to this state by default //

        $stateProvider
            .state('landing', {
                url: '/LevelMoney/index.html',
                controller: 'LandingController',
                controllerAs: 'landing',
                templateUrl: 'app/landing/landing.html'
            })
            .state('trans', {
                views: {
                    '': {
                        controller: 'TransactionsController',
                        controllerAs: 'trans',
                        templateUrl: 'app/transactions/transactions.html',
                        resolve: {
                            transList : function(GetAllTransService) {return GetAllTransService.getAllTrans();}
                        }
                    }
                }
            })
    }

    angular
        .module('lm', [
            'ui.router',
            'ui.grid',
            'ui.grid.resizeColumns',
            'ui.grid.moveColumns',
            'ngStorage',
            'ngResource',
            'mgcrea.ngStrap',
            'ngSanitize'
        ])
        .config(config);
}());