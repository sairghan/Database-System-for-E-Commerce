storeApp.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'api/v1/';

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
		obj.showOrderDetails = function (data) {
            window.alert("hi!");
        }
        obj.get = function (q) {
			//console.log(q);
            return $http.get(serviceBase + q).then(function (results) {
				//console.log(results);
                return results.data;
            });
        };
        obj.post = function (q, object) {
			//console.log(object)
            return $http.post(serviceBase + q, object).then(function (results) {
				//console.log(results.data);
                return results.data;
            });
        };
        obj.put = function (q, object) {
			console.log(object);
            return $http.put(serviceBase + q, object).then(function (results) {
				console.log(results.data);
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);