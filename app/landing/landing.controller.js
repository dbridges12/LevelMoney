/**
 * Created by davidbridges on 6/8/16.
 */

(function() {

    function LandingController($state, GetAllTransService) {
        var vm = this;

        // init the connect button so the spinner is hidden //
        vm.loading = false;


        /**
         * @function connect
         * @desc Calls getalltrans service and routes to transaction page on success
         */
        vm.connect = function () {
            vm.loading = true;  // start the loading spinner //
            $state.go('trans').then(
                function successCallback() {
                    vm.loading = false;
                },
                function errorCallback() {
                    vm.loading = false;
                }
            );

        };

        /**
         * @function OpenHelp
         * @desc Opens a Sweet Alert window with the help text displayed
         */
        vm.openHelp = function () {
            swal({
                title: 'Levelmoney Help',
                html: 'Just click the <b>Connect</b> button to access<br /> the transaction screen.',
                confirmButtonText: 'Got it!',
                confirmButtonColor: '#f4b62f',
                closeOnConfirm: true,
                allowOutsideClick: true
            });
        };

    }

    angular
        .module('lm')
        .controller('LandingController',['$state', 'GetAllTransService', LandingController]);
}());