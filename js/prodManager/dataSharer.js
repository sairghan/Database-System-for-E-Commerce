storeApp.service("dataSharingService", function() {
 var customer = [];
 var producttypes = [];
 var regionids = [];

   this.addCustomer = function(newObj) {
    while(customer.length > 0) {
		customer.pop();
	}
      customer.push(newObj);
  }

  this.getCustomer = function(){
      return customer;
  }
  
  this.addProductTypes = function(newObj) {
      producttypes = newObj;
  }
  
  this.getProductTypes = function(){
      return producttypes;
  }
  
  this.addRegionIds = function(newObj) {
      regionids = newObj;
  }
  
  this.getRegionIds = function(){
      return regionids;
  }

});