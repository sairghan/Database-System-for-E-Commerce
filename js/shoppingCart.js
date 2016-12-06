//----------------------------------------------------------------
// shopping cart
//
storeApp.factory("shoppingCartService", function($location, Data) {
var obj = {};

obj.shoppingCart = function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.checkoutParameters = {};
    this.items = [];
	
    // load items from local storage when initializing
    this.loadItems();

    // save items to local storage when unloading
    var self = this;
    $(window).unload(function () {
        if (self.clearCart) {
            self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
    });
}

// load items from local storage
obj.shoppingCart.prototype.loadItems = function () {
	
    var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
    if (items != null && JSON != null) {
        try {
            var items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.sku != null && item.name != null && item.price != null && item.quantity != null && item.customerid != null) {
                    item = new cartItem(item.sku, item.name, item.price, item.quantity, item.customerid);
                    this.items.push(item);
                }
            }
        }
        catch (err) {
            // ignore errors while loading...
        }
    }
}

// save items to local storage
obj.shoppingCart.prototype.saveItems = function () {
    if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
    }
}

// adds an item to the cart
obj.shoppingCart.prototype.addItem = function (sku, name, price, quantity, customerid, producttype) {
    quantity = this.toNumber(quantity);
    if (quantity != 0) {

        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
            var item = this.items[i];
            if (item.sku == sku) {
                found = true;
                item.quantity = this.toNumber(item.quantity + quantity);
                if (item.quantity <= 0) {
                    this.items.splice(i, 1);
                }
            }
        }
		
        // new item, add now
        if (!found) {
            var item = new cartItem(sku, name, price, quantity, customerid, producttype);
            this.items.push(item);
        }

        // save changes
        this.saveItems();
    }
}

// get the total price for all items currently in the cart
obj.shoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
}

// get the total price for all items currently in the cart
obj.shoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku == null || item.sku == sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
}

// clear the cart
obj.shoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.saveItems();
}

// define checkout parameters
obj.shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "Google") {
        throw "serviceName must be 'PayPal' or 'Google'.";
    }
    if (merchantID == null) {
        throw "A merchantID is required in order to checkout.";
    }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
}


// check out
obj.shoppingCart.prototype.checkout = function (serviceName, clearCart) {
//console.log("Hi");
this.checkoutMySQL(clearCart);
/*
    // select serviceName if we have to
    if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }*/
	
}

//Checkout using our mysql db
obj.shoppingCart.prototype.checkoutMySQL = function (parms, clearCart) {

	var dataSet ={};
	var data = {}
    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        dataSet["item_number"] = item.sku;
        dataSet["item_name"] = item.name;
        dataSet["quantity"] = item.quantity;
        dataSet["amount"] = item.price.toFixed(2);
		dataSet["custid"] = item.customerid;
		dataSet["producttypeid"] = item.producttype;
		dataSet["total"] = item.price.toFixed(2) * item.quantity;
		
		data[i] = dataSet;  
		dataSet ={};		
    }
	
	Data.post('order', {
            order: data
        }).then(function (results) {
            Data.toast(results);
			//Data.showOrderDetails(results);
			//console.log(results);
			//var form = $('<form/></form>');
			//$("body").append(form);
			// submit form and clear cart
			this.clearCart = clearCart == null || clearCart;
			//form.submit();
			//form.remove();
            if (results.status == "success") {
                $location.path('/vieworders');
            }
        });
		
	// build form
    var form = $('<form/></form>');
    $("body").append(form);
   
    // submit form and clear cart
    this.clearCart = clearCart == null || clearCart;
	
    //form.submit();
    //form.remove();
}


// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
obj.shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        data["item_name_" + ctr] = item.name;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = item.price.toFixed(2);
    }

    // build form
    var form = $('<form/></form>');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
obj.shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}

// utility methods
obj.shoppingCart.prototype.addFormFields = function (form, data) {
    if (data != null) {
        $.each(data, function (name, value) {
            if (value != null) {
                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                form.append(input);
            }
        });
    }
}
obj.shoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

//----------------------------------------------------------------
// items in the cart
//
function cartItem(sku, name, price, quantity, customerid, producttype) {
    this.sku = sku;
    this.name = name;
    this.price = price * 1;
    this.quantity = quantity * 1;
	this.customerid = customerid;
	this.producttype = producttype;
}

return obj;
});

