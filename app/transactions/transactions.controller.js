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
            {value: 'options', label: 'All Transactions'},
            {value: 'donut', label: 'Ignore Donuts'},
            {value: 'cc', label: 'Remove C.C. Payments'}
        ];

        vm.setOption = function() {
            if(vm.selectedOption === 'donut') {
                vm.init('donut');
            } else if (vm.selectedOption === 'cc') {
                vm.init('cc');
            } else {
                vm.init('none');
            }
        };

        //console.log ('transcontroller', vm.transList);

        // Trap for errors returned by API call //
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

        // Transaction Summary Grid definition and customization //
        vm.gridOpts = {
            columnDefs: [
                { displayName: 'Year ', field: 'year', enableColumnMenu: false},
                { displayName: 'Month', field: 'month', enableColumnMenu: false },
                { displayName: 'Income', field: 'income', enableColumnMenu: false, cellFilter: 'currency', cellClass: 'totalcost-cell'},
                { displayName: 'Spent', field: 'spent', enableColumnMenu: false, cellFilter: 'currency', cellClass: 'totalcost-cell'},
                { displayName: 'Balance ',
                    field: 'amount',
                    enableColumnMenu: false,
                    cellTemplate:   '<div class="ui-grid-cell-contents" ng-if="row.entity.income > row.entity.spent">' +
                                        '<span class="green-cell">${{(row.entity.income - row.entity.spent).toFixed(2)}}</span>' +
                                    '</div>' +
                                    '<div class="ui-grid-cell-contents" ng-if="row.entity.income < row.entity.spent">' +
                                        '<span class="red-cell">-${{(row.entity.income - row.entity.spent).toFixed(2) * -1}}</span>' +
                                    '</div>'
                }
            ],

            rowHeight: 45
        };

        // Credit Card Transaction Grid definition and customization //
        vm.gridOptsCC = {
            columnDefs: [
                { displayName: 'Date', field: 'transaction-time', cellFilter: 'date', enableColumnMenu: false},
                { displayName: 'Description', field: 'merchant', enableColumnMenu: false},
                { displayName: 'Amount ',
                    field: 'amount',
                    enableColumnMenu: false,
                    cellTemplate:   '<div class="ui-grid-cell-contents" ng-if="row.entity.amount > 0">' +
                                        '<span class="green-cell">${{row.entity.amount}}</span>' +
                                    '</div>' +
                                    '<div class="ui-grid-cell-contents" ng-if="row.entity.amount < 0">' +
                                        '<span class="red-cell">-${{row.entity.amount*-1}}</span>' +
                                    '</div>'
                }
            ],

            rowHeight: 45
        };

        // Dynamically update the Transaction Summary Grid data.
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
                            gridObj.spent = parseInt(vm.aggrTrans[key][key2][key3]) / -10000;  // convert the negative value to positive for formatting
                            avgSpendArr.push(parseInt(vm.aggrTrans[key][key2][key3]) / -10000); // convert the negative value to positive
                        } else {
                            gridObj.income = parseInt(vm.aggrTrans[key][key2][key3]) / 10000;
                            avgIncomeArr.push(parseInt(vm.aggrTrans[key][key2][key3]) / 10000);
                        }
                    }

                    // compute the average spend by summing the array and dividing by the length //
                    vm.avgSpend = '$' + parseFloat(avgSpendArr.reduce(function (p, c) {
                            return p + c;
                        }) / gridData.length).toFixed(2);


                    vm.avgIncome = '$' + parseFloat(avgIncomeArr.reduce(function (p, c) {
                            return p + c;
                        }) / gridData.length ).toFixed(2);


                    gridData.push(gridObj);
                }
            }
            //console.log(gridData);
            vm.gridOpts.data = gridData;

        };

        // Update the Credit Card Trans Grid data //
        vm.setCCGridData = function() {
            var tempTransArr = JSON.parse(JSON.stringify(vm.transList.data.transactions)),   // make a DEEP copy of the array to work with //
                creditCardArr = [],
                newtransArr = [],
                nextIndexFound = null;

            for (var k = 0; k < tempTransArr.length; k++) {
                // don't process second part of transaction //
                if (k === nextIndexFound) {
                    continue;
                }

                var cc_amount = tempTransArr[k].amount;
                var oppositeAmount = (parseInt(cc_amount) * -1);
                var cc_transDate = new Date(tempTransArr[k]['transaction-time']);
                var nextAmountIndex = tempTransArr.map(function(x) {return x.amount; }).indexOf(oppositeAmount, k + 1);
                var objectFound = tempTransArr[nextAmountIndex];

                if (nextAmountIndex !== -1) {
                    nextIndexFound = nextAmountIndex;  // track the index of the second half of the transaction so we can skip it later //
                    var transDateOpp = new Date(tempTransArr[nextAmountIndex]['transaction-time']);
                    var daysDiff = transDateOpp.getDate() - cc_transDate.getDate();
                    if (daysDiff === 0 || daysDiff ===1 ) {
                        if (transDateOpp.getMonth() === cc_transDate.getMonth()) {
                            tempTransArr[k].amount /= 10000;
                            objectFound.amount /= 10000;
                            creditCardArr.push(tempTransArr[k]);
                            creditCardArr.push(objectFound);
                        } else {
                            tempTransArr[k].amount /= 10000;
                            tempTransArr[k].merchant += ' - NO MATCHING TRANSACTION';
                            creditCardArr.push(tempTransArr[k]);
                            nextIndexFound = null; // need to clear it because this is an unbalanced transaction
                        }
                    }
                } else {
                    newtransArr.push(tempTransArr[k]);  // this transaction is included in the aggregate list
                }
            }

            vm.gridOptsCC.data = creditCardArr;
            //console.log('cc array', creditCardArr);
            ///console.log('newtrans array', newtransArr);

            return newtransArr;
        };

        // filter can be donut, cc or none //
        vm.init = function(filter) {
            var month = '',
                year = '',
                amount = 0,
                merchant = '',
                transArr = JSON.parse(JSON.stringify(vm.transList.data.transactions)); // make a DEEP copy of the array to work with //

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

            // filter out credit card transactions
            if (filter === 'cc') {
                transArr = vm.setCCGridData();
            } else {
                vm.gridOptsCC.data = [];
            }

            // parse the data into a hash map based on year and month and spend type //
            for (var i =0; i < transArr.length ; i++) {
                var transDate = new Date(transArr[i]['transaction-time']);
                month = transDate.getMonth();
                year = transDate.getFullYear();
                amount = transArr[i].amount;
                merchant = transArr[i].merchant;

                // filter out these transactions //
                if (filter === 'donut') {
                    if (merchant === 'Krispy Kreme Donuts' || merchant === 'Dunkin #336784') {
                        continue; // skip these merchant transactions //
                    }
                }

                // add the transaction object to the aggregated table //
                updateTrans(year, month, amount);
            }

            //console.log(vm.aggrTrans);

            // set the top grid data
            vm.setGridData();
        };

        vm.init('none');

    }

    angular
        .module('lm')
        .controller('TransactionsController',['transList', TransactionsController]);
}());
