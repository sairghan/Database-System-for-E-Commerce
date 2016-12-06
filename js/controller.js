'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
storeApp.controller('storeController', function($scope, $rootScope, $modal, $routeParams, $location, $http, Data, DataService, dataSharingService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
	

    // use routing to pick the selected product
    //if ($routeParams.productSku != null) {
    //    $scope.product = $scope.store.getProduct($routeParams.productSku);
	//	console.log($scope.product);
    //}
	/*
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('store');
            }
        });
    };
	*/
	//$scope.customer = {name:"test"};
	//console.log(sessionStorage.getItem('customer'));
	//$scope.customer = {};
	if(sessionStorage.getItem('customer') == "null" || sessionStorage.getItem('customer') == null || sessionStorage.getItem('customer') == "undefined"){
		//console.log("Hello");
		$scope.customer = dataSharingService.getCustomer()[0];
		//console.log("CustDet: "+$scope.customer);
		sessionStorage.setItem('customer', JSON.stringify($scope.customer));
	}
	else if(sessionStorage.getItem('customer') != "null"){
		$scope.customer = JSON.parse(sessionStorage.getItem('customer'));
	}
	
	$scope.product = {};
	var item = [];
	 if ($routeParams.productSku != null) {
		Data.get('product/'+$routeParams.productSku).then(function(data){
			var i =0;
			$scope.product = new product(data.data[i]["sku"],data.data[i]["producttypeid"],data.data[i]["productname"], data.data[i]["description"], data.data[i]["price"], data.data[i]["stock"], data.data[i]["cal"], data.data[i]["carot"], data.data[i]["itc"], data.data[i]["folate"], data.data[i]["potassium"], data.data[i]["fiber"]);
			//console.log($scope.product);
		});
    }
	
	$scope.products = {};
	var items = [];
	if ($routeParams.productSku == null) {
		Data.get('store').then(function(data){
			//console.log(data.data[0]["description"]);
			for(var i=0 ; i <data.data.length; i++) {
				items.push(new product(data.data[i]["sku"],data.data[i]["producttypeid"],data.data[i]["productname"], data.data[i]["description"], data.data[i]["price"], data.data[i]["stock"], data.data[i]["cal"], data.data[i]["carot"], data.data[i]["itc"], data.data[i]["folate"], data.data[i]["potassium"], data.data[i]["fiber"]));
		}
		$scope.products = items;
		
		});
	}
	
	$scope.orders = {};
	var orderitems = [];
	//console.log($scope.customer.custid);
	Data.get('getOrders/'+$scope.customer.custid).then(function(data){
		var form = $('<form/></form>');
		$("body").append(form);
		form.submit();
		form.remove();
		$scope.orders = data;
		
	});
	
	 $scope.getOrderDetails = function(order){
        Data.get("getOrderDetail/"+order.orderid).then(function(results){
			console.log(results);
			$scope.open(results, 50);
		});
    };
	
	$scope.open = function (p,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/orderDetails.html',
          controller: 'orderDetailController',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
	}
	
	$scope.oColumns = [
				{text:"OrderID (Click for Details)",predicate:"id",sortable:true,dataType:"number"},
				{text:"CustomerID",predicate:"custid",sortable:true,dataType:"number"},             
				{text:"Total Amount",predicate:"total",sortable:true, dataType:"number"},
				{text:"Date Ordered",predicate:"dateordered",sortable:true},
				{text:"Status",predicate:"",sortable:false}
	];
	
	$scope.orderBySel = [{ value: "price", name: "Cheapest" }, { value: "-price", name: "Costliest" }];
});

storeApp.controller('orderDetailController', function ($scope, $modalInstance, item) { 
 $scope.order = item;
});
