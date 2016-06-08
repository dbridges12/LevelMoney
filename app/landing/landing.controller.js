/**
 * Created by davidbridges on 6/8/16.
 */

(function() {

    function LandingController($state, TranslationService, LoginService) {
        var vm = this;

        // init the connect button so the spinner is hidden //
        vm.loading = false;


        /**
         * @function OpenHelp
         * @desc Opens a Sweet Alert window with the help gif displayed
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
        .controller('LandingController',['$state', LandingController]);
}());