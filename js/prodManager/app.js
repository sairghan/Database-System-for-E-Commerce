'use strict';
var storeApp = angular.module('prodManager', ['ngRoute','ui.bootstrap', 'ngAnimate', 'toaster']);
// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
storeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
		when('/login', {
            title: 'Login',
            templateUrl: 'partials/backendLogin.html',
            controller: 'authCtrl'
        }).
		when('/logout', {
            title: 'Logout',
			templateUrl: 'partials/backendLogin.html',
			controller: 'logoutCtrl'
        }).
		when('/', {
			title: 'Login',
			templateUrl: 'partials/backendLogin.html',
			controller: 'authCtrl',
			role: '0'
        }).
		when('/console', {
			title: 'Console',
			templateUrl: 'partials/consoleBackend.html',
			controller: 'productsCtrl'
        }).
		when('/Inventory', {
			title: 'Console',
			templateUrl: 'partials/consoleBackend.html',
			controller: 'productsCtrl'
        }).
		when('/Orders', {
			title: 'Console',
			templateUrl: 'partials/consoleBackend.html',
			controller: 'productsCtrl'
        }).
		when('/Reports', {
			title: 'Console',
			templateUrl: 'partials/consoleBackend.html',
			controller: 'productsCtrl'
        }).
		when('/Admin', {
			title: 'Console',
			templateUrl: 'partials/consoleBackend.html',
			controller: 'productsCtrl'
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
            Data.get('prodsession').then(function (results) {
				//console.log(results);
                if (results.puid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.puid;
                    $rootScope.name = results.pname;
                    $rootScope.email = results.pemail;
					//$location.path(next.$$route.originalPath);
                } else {
					$rootScope.name = results.pname;
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory("DataService", function () {


});