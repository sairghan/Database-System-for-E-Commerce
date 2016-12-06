'use strict';
var storeApp = angular.module('AngularStore', ['ngRoute','ui.bootstrap', 'ngAnimate', 'toaster']);
// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
storeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
		when('/store', {
			templateUrl: 'partials/store.htm',
			controller: 'storeController' 
		}).
		when('/products/:productSku', {
			templateUrl: 'partials/product.htm',
			controller: 'storeController'
		}).
		when('/cart', {
			templateUrl: 'partials/shoppingCart.htm',
			controller: 'storeController'
		}).
		when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl'
        }).
		when('/logout', {
            title: 'Logout',
			templateUrl: 'partials/login.html',
			controller: 'logoutCtrl'
        }).
		when('/signup', {
			title: 'Signup',
			templateUrl: 'partials/signup.html',
			controller: 'authCtrl'
        }).
		when('/Individual', {
			title: 'Signup Individual',
			templateUrl: 'partials/signup.html',
			controller: 'authCtrl'
        }).
		when('/Business', {
			title: 'Signup Business',
			templateUrl: 'partials/signup.html',
			controller: 'authCtrl'
        }).
		when('/dashboard', {
			title: 'Dashboard',
			templateUrl: 'partials/dashboard.html',
			controller: 'authCtrl'
        }).
		when('/vieworders', {
			title: 'Your Orders',
			templateUrl: 'partials/customerorders.html',
			controller: 'storeController'
        }).
		when('/viewprofile', {
			title: 'Your Orders',
			templateUrl: 'partials/profile.html',
			controller: 'authCtrl'
        }).
		when('/viewbusinessprofile', {
			title: 'Your Orders',
			templateUrl: 'partials/busprofile.html',
			controller: 'authCtrl'
        }).
		when('/', {
			title: 'Login',
			templateUrl: 'partials/login.html',
			controller: 'authCtrl',
			role: '0'
        }).
		when('/productmanager', {
			title: 'Products',
			templateUrl: 'partials/products.html',
			controller: 'productsCtrl'
		}).
        otherwise({
			redirectTo: '/login'
		});
}]).run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function (results) {
				//console.log(results.uid);
                if (results.uid) {
					//console.log(results.uid);
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
					//$location.path(next.$$route.originalPath);
                } else {
					$rootScope.name = results.name;
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login' || nextUrl == '/Business' || nextUrl == '/Individual') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory("DataService", function (shoppingCartService) {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCartService.shoppingCart("AngularStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", "bernardo.castilho-facilitator@gmail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "500640663394527",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});