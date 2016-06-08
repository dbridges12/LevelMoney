/**
 * Created by davidbridges on 4/4/16.
 */

(function() {
    'use strict';

    function headerBar($document) {

        return {
            templateUrl: 'app/directives/templates/header.html',
            replace: true,
            restrict: 'E'
        };
    }

    angular
        .module('lm')
        .directive('headerBar',['$document', headerBar]);
}());