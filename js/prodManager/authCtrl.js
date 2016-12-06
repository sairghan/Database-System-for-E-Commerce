storeApp.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, dataSharingService) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('prodLogin', {
            customer: customer
        }).then(function (results) {
			Data.toast(results);
			dataSharingService.addCustomer(results);
            if (results.status == "success") {
                $location.path('console');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',street:'', bldgnumber:'', city:'', state:'', country:'', zip:''};
    $scope.signUp = function (customer) {
		customer.logintypeid = "1";
		customer.addresstypeid = "1";
		customer.custtypeid = "1";
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
		sessionStorage.setItem('prodlogin', "null");
		//localStorage.clear();
		//console.log("sessionVal1:"+ sessionStorage.getItem('prodlogin'));
		//sessionStorage.clear();
		//console.log("sessionVal2:"+ sessionStorage.getItem('prodlogin'));
        Data.get('logoutProd').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    };
});