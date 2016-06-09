/**
 * Created by davidbridges on 6/8/16.
 */
(function() {

    function TransactionsController(transList) {
        var vm = this;

        vm.transList = transList;

        vm.aggrTrans = {};

        vm.avgSpend = 0;

        vm.avgIncome = 0;

        vm.month = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        vm.selectedOption = 'options';

        vm.options = [
            {value: 'options', label: 'Options'},
            {value: 'donut', label: 'Ignore Donuts'},
            {value: 'cc', label: 'Remove C.C. Payments'}
        ];

        vm.setOption = function() {
            if(vm.selectedOption === 'donut') {
                vm.init('donut');
            } else if (vm.selectedOption === 'cc') {

            } else {
                vm.init('none');
            }
        };

        console.log ('transcontroller', vm.transList);

        if (vm.transList.data.error !== 'no-error') {
            swal({
                title: 'API Error',
                html: 'Sorry, we had trouble retrieving your data: ' + vm.transList.data.error,
                confirmButtonText: 'Got it!',
                confirmButtonColor: '#f4b62f',
                closeOnConfirm: true,
                allowOutsideClick: true
            });
        }

        // Array Column definition and customization //
        vm.gridOpts = {
            columnDefs: [
                { displayName: 'Year ', field: 'year', enableColumnMenu: false},
                { displayName: 'Month', field: 'month', enableColumnMenu: false },
                { displayName: 'Income', field: 'income', enableColumnMenu: false, cellFilter: 'currency', cellClass: 'totalcost-cell'},
                { displayName: 'Spent', field: 'spent', enableColumnMenu: false, cellFilter: 'currency', cellClass: 'totalcost-cell'}
            ],

            rowHeight: 50
        };

        // Dynamically update the grid data based on tab selection
        vm.setGridData = function () {
            var gridData = [],
                avgSpendArr = [],
                avgIncomeArr = [],
                gridObj, key, key2;

            // need to create a flat object to push into the array for the grid //
            for (key in vm.aggrTrans) {
                if (!vm.aggrTrans.hasOwnProperty(key)) continue;

                for (key2 in vm.aggrTrans[key]) {
                    if (!vm.aggrTrans[key].hasOwnProperty(key2)) continue;

                    gridObj = {};
                    gridObj.year = key;
                    gridObj.month = vm.month[key2];

                    // amount data is stored in Centocents - convert to cents //
                    for (key3 in vm.aggrTrans[key][key2]) {
                        if (key3 === 'spent') {
                            gridObj.spent = parseInt(vm.aggrTrans[key][key2][key3]) / -10000;  // convert the negative value to positive
                            avgSpendArr.push(parseInt(vm.aggrTrans[key][key2][key3]) / -10000); // convert the negative value to positive
                        } else {
                            gridObj.income = parseInt(vm.aggrTrans[key][key2][key3]) / 10000;
                            avgIncomeArr.push(parseInt(vm.aggrTrans[key][key2][key3]) / 10000);
                        }
                    }

                    vm.avgSpend = '$' + parseFloat(avgSpendArr.reduce(function (p, c) {
                            return p + c;
                        }) / gridData.length).toFixed(2);


                    vm.avgIncome = '$' + parseFloat(avgIncomeArr.reduce(function (p, c) {
                            return p + c;
                        }) / gridData.length ).toFixed(2);


                    gridData.push(gridObj);
                }
            }

            console.log(gridData);

            vm.gridOpts.data = gridData;
        };

        vm.init = function(filter) {
            var month = '',
                year = '',
                amount = 0,
                merchant = '',
                transArr = vm.transList.data.transactions;

            vm.aggrTrans = {};  // clear when you enter this function every time

            // add and aggregate each transaction to the hash table //
            function updateTrans(year, month, amount) {
                // create the year object if it doesn't exist //
                if (!vm.aggrTrans[year]) {
                    vm.aggrTrans[year] = {};
                }

                // now create the month if it doesn't exist //
                if (!vm.aggrTrans[year][month]) {
                    vm.aggrTrans[year][month] = {};
                    vm.aggrTrans[year][month].spent=0;
                    vm.aggrTrans[year][month].income=0;
                }

                // check and see where to put the amount //
                if (amount > 0) {
                    vm.aggrTrans[year][month].income += parseInt(amount);
                } else {
                    vm.aggrTrans[year][month].spent += parseInt(amount);
                }

            }

            // parse the data into a hash map based on year and month and spend type //
            for (var i =0; i < transArr.length ; i++) {
                var transDate = new Date(transArr[i]['transaction-time']);
                month = transDate.getMonth();
                year = transDate.getFullYear();
                amount = transArr[i].amount;
                merchant = transArr[i].merchant;

                // add the transaction object to the aggregated table //
                if (filter === 'donut') {
                    if (merchant === 'Krispy Kreme Donuts' || merchant === 'Dunkin #336784') {
                        continue; // skip these merchant transactions //
                    }
                }

                if (filter === 'cc') {

                }
                updateTrans(year, month, amount);
            }

            console.log(vm.aggrTrans);

            // set the first tabs data
            vm.setGridData();
        };

        vm.init('none');

    }

    angular
        .module('lm')
        .controller('TransactionsController',['transList', TransactionsController]);
}());
