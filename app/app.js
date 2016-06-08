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
            .state('actions', {
                views: {
                    '': {
                        controller: 'ActionsController',
                        controllerAs: 'actions',
                        templateUrl: 'app/actions/actions.html',
                        resolve: {
                            infoPageUrl : function(GetUrlService) {return GetUrlService.getAd();}
                        }

                    },
                    'nav@actions': {templateUrl: 'app/actions/templates/navbar.html'},
                    'custinfo@actions': {templateUrl: 'app/actions/templates/custinfo.html'}
                }
            })

            .state('actions.ad', {
                templateUrl: 'app/actions/templates/infopage.html'
            })

            .state('actions.editsite', {
                templateUrl: 'app/actions/templates/editsite.html'
            })

            .state('actions.detail', {
                views: {
                    '': {
                        templateUrl: 'app/actions/templates/detail.html'
                    },
                    'custinfo@actions.detail': {templateUrl: 'app/actions/templates/custinfo.html'}
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
            'ngResource'
        ])
        .config(config);
}());