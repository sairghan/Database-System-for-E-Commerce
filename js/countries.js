storeApp.factory("CountryService", ['$filter', function($filter){
 var service = {};
  
  
  var countrylist = [
            { "id": 1, "country": "USA" },
            { "id": 2, "country": "Canada" },
            { "id": 3, "country": "India" },
    ];
  
  var statelist = [
    {"Id":1, "state":"Pennsylvania", "countryId": "USA"},
    {"Id":2, "state":"California", "countryId": "USA"},
    {"Id":3, "state":"New York", "countryId": "USA"},
    {"Id":4, "state":"New Brunswick", "countryId": "Canada"},
    {"Id":5, "state":"Manitoba", "countryId": "Canada"},
    {"Id":6, "state":"Delhi", "countryId": "India"},
    {"Id":7, "state":"Bombay", "countryId": "India"},
    {"Id":8, "state":"Calcutta", "countryId": "India"}
  ];
  
  var citylist = [
    {"Id":1, "city":"Pittsburgh", "stateId": "Pennsylvania"},
    {"Id":2, "city":"Philadelphia", "stateId": "Pennsylvania"},
    {"Id":3, "city":"Harisburg", "stateId": "Pennsylvania"},
    {"Id":4, "city":"Lancaster", "stateId": "Pennsylvania"},
    {"Id":5, "city":"Adelanto", "stateId": "California"},
    {"Id":6, "city":"Artesia", "stateId": "California"},
    {"Id":7, "city":"Benicia", "stateId": "California"},
    {"Id":8, "city":"Clovis", "stateId": "California"},
    {"Id":9, "city":"Dublin", "stateId": "California"},
    {"Id":10, "city":"Manhattan", "stateId": "New York"},
    {"Id":11, "city":"Bronx", "stateId": "New York"},
    {"Id":12, "city":"Brooklyn", "stateId": "New York"},
    {"Id":13, "city":"Queens", "stateId": "New York"},
    {"Id":14, "city":"Staten Island", "stateId": "New York"},
    {"Id":15, "city":"Bathurst", "stateId": "New Brunswick"},
    {"Id":16, "city":"Campbellton", "stateId": "New Brunswick"},
    {"Id":17, "city":"Dieppe", "stateId": "New Brunswick"},
    {"Id":18, "city":"Edmundston", "stateId": "New Brunswick"},
    {"Id":19, "city":"Fredericton", "stateId": "New Brunswick"},
    {"Id":20, "city":"Miramichi", "stateId": "New Brunswick"},
    {"Id":21, "city":"Moncton", "stateId": "New Brunswick"},
    {"Id":22, "city":"Brandon", "stateId": "Manitoba"},
    {"Id":23, "city":"Dauphin", "stateId": "Manitoba"},
    {"Id":24, "city":"Flin Flon", "stateId": "Manitoba"},
    {"Id":25, "city":"Morden", "stateId": "Manitoba"},
    {"Id":26, "city":"Portage la Prairie", "stateId": "Manitoba"},
    {"Id":27, "city":"Selkirk", "stateId": "Manitoba"},
    {"Id":28, "city":"Steinbach", "stateId": "Manitoba"},
    {"Id":29, "city":"Thompson", "stateId": "Manitoba"},
    {"Id":30, "city":"Winkler", "stateId": "Manitoba"},
    {"Id":31, "city":"South Delhi", "stateId": "Delhi"},
    {"Id":32, "city":"North Delhi", "stateId": "Delhi"},
    {"Id":33, "city":"East Delhi", "stateId": "Delhi"},
    {"Id":34, "city":"West Delhi", "stateId": "Delhi"},
    {"Id":35, "city":"Old Delhi", "stateId": "Delhi"},
    {"Id":36, "city":"New Delhi", "stateId": "Delhi"},
    {"Id":37, "city":"Yamuna Paar", "stateId": "Delhi"},
    {"Id":38, "city":"Chembur", "stateId": "Bombay"},
    {"Id":39, "city":"Borivali West", "stateId": "Bombay"},
    {"Id":40, "city":"Ghatkopar West", "stateId": "Bombay"},
    {"Id":41, "city":"Juhu", "stateId": "Bombay"},
    {"Id":42, "city":"Mira Road", "stateId": "Bombay"},
    {"Id":43, "city":"Powai", "stateId": "Bombay"},
    {"Id":44, "city":"Virar West", "stateId": "Bombay"},
    {"Id":45, "city":"Rajarhat", "stateId": "Calcutta"},
    {"Id":46, "city":"Park Street", "stateId": "Calcutta"},
    {"Id":47, "city":"Golpark", "stateId": "Calcutta"},
    {"Id":48, "city":"Chandan Nagar", "stateId": "Calcutta"}
];
  
  service.getCountry = function(){    
    return countrylist;
  };
  
  service.getCountryState = function(countryId){
    var states = ($filter('filter')(statelist, {countryId: countryId}));
    return states;
  };
  
  
  service.getStateCity = function(stateId){    
   
    var items = ($filter('filter')(citylist, {stateId: stateId}));      
    return items;
  };
  
  return service;
  
  
}]);