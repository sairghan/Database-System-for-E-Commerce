address(addressid, bldgnumber, street, city, state, country, postalcode,addresstypeid);
addresstype(addresstypeid, addresstype);
customer(custid, name, custypeid, addressid);
businessdemo(custid, businesstype, income);
individualdemo(custid, sex, married, income );
customertype(customertypeid, customertype);
jobdetails(jobid, jobtitle, salary);
login(userid, email, phone, password, logintypeid, created);  key- email, phone
logintype (logintypeid, logintype);
orders (orderid, custid,total,status,dateordered);
order_items (orderid, productid, quantity);			
products_new (productid,sku,productname,description,producttypeid,stock,color,price,cal,carot,itc,folate,potassium,fiber, status); key-pid, sku, pname
producttype (producttypeid,producttype);
region (regionid,regionname,addressid,phonenumber);
region_manager (regionid, regmanagerid);
store (storeid,addressid,numsalespersons,producttype,regionid);
employee (employeeid,name,addressid,storeid,jobid);


____________-----------------________________________


CREATE TABLE address (
  addressid int(11) NOT NULL AUTO_INCREMENT,
  bldgnumber varchar(10) NOT NULL,
  street varchar(50) NOT NULL,
  city varchar(50) NOT NULL,
  state varchar(50) NOT NULL,
  country varchar(50) NOT NULL,
  postalcode varchar(10) NOT NULL,
  addresstypeid int(11) DEFAULT 1,
  PRIMARY KEY (addressid),
  CONSTRAINT address_ibfk_1 FOREIGN KEY (addresstypeid) REFERENCES addresstype (addresstypeid) 
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE addresstype (
  addresstypeid int(11) NOT NULL AUTO_INCREMENT,
  addresstype varchar(50) NOT NULL,
  PRIMARY KEY (addresstypeid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE customer (
  custid int(11) NOT NULL,
  name varchar(50) NOT NULL,
  custtypeid int(11) NOT NULL,
  addressid int(11) DEFAULT 0,
  PRIMARY KEY (custid),
  KEY custtypeid (custtypeid),
  CONSTRAINT customer_ibfk_1 FOREIGN KEY (custtypeid) REFERENCES customertype (customertypeid),
  CONSTRAINT customer_ibfk_2 FOREIGN KEY (addressid) REFERENCES address (addressid)
  ON DELETE SET DEFAULT
  ON UPDATE CASCADE,
  CONSTRAINT customer_ibfk_3 FOREIGN KEY (custid) REFERENCES login (userid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE businessdemo (
  custid int(11) NOT NULL,
  businesstype varchar(50) DEFAULT 'Others',
  income int(20) DEFAULT 0 CHECK(income>=0),
  PRIMARY KEY (custid),
  CONSTRAINT businessdemo_ibfk_1 FOREIGN KEY (custid) REFERENCES customer (custid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE individualdemo (
  custid int(11) NOT NULL,
  sex varchar(5) DEFAULT 'NS',
  married varchar(5) DEFAULT 'NS',
  income int(20) DEFAULT 0 CHECK(income>=0),
  PRIMARY KEY (custid),
  CONSTRAINT individualdemo_ibfk_1 FOREIGN KEY (custid) REFERENCES customer (custid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE customertype (
  customertypeid int(11) NOT NULL AUTO_INCREMENT,
  customertype varchar(50) NOT NULL,
  PRIMARY KEY (customertypeid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE jobdetails (
  jobid int(11) NOT NULL AUTO_INCREMENT,
  jobtitle varchar(25) NOT NULL,
  salary int(15) NOT NULL CHECK(salary>=0),,
  PRIMARY KEY (jobid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE login (
  userid int(11) NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  phone varchar(100) NOT NULL,
  password varchar(200) NOT NULL,
  logintypeid int(11) NOT NULL,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userid),
  KEY logintypeid (logintypeid),
  CONSTRAINT login_ibfk_1 FOREIGN KEY (logintypeid) REFERENCES logintype (logintypeid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE logintype (
  logintypeid int(11) NOT NULL AUTO_INCREMENT,
  logintype varchar(50) NOT NULL,
  PRIMARY KEY (logintypeid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE orders (
  orderid int(11) NOT NULL AUTO_INCREMENT,
  custid int(11) NOT NULL,
  total int(20) NOT NULL CHECK(total>=0),
  status varchar(20) NOT NULL,
  dateordered timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (orderid),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (custid) REFERENCES customer (custid)		
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE order_items (
  orderid int(11) NOT NULL AUTO_INCREMENT,
  productid int(11) NOT NULL,
  quantity int(20) DEFAULT 0 CHECK(quantity>=0),,
  PRIMARY KEY (orderid,productid),
  KEY productid (productid),
  CONSTRAINT order_items_ibfk_1 FOREIGN KEY (orderid) REFERENCES orders (orderid)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT order_items_ibfk_2 FOREIGN KEY (productid) REFERENCES products_new (productid)
  ON DELETE NO ACTION
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE products_new (
  productid int(11) NOT NULL AUTO_INCREMENT,
  sku varchar(10) NOT NULL,
  productname varchar(20) NOT NULL,
  description varchar(500) DEFAULT 'NOT MENTIONED',
  producttypeid int(11) DEFAULT 0,
  stock int(20) DEFAULT 0 CHECK(stock>=0),
  color varchar(10) DEFAULT 'None',
  price double DEFAULT 0.0 CHECK(price>=0),
  cal int(11) DEFAULT 0 CHECK(cal>=0),
  carot int(11) DEFAULT 0 CHECK(carot>=0),
  itc int(11) DEFAULT 0 CHECK(itc>=0),
  folate int(11) DEFAULT 0 CHECK(folate>=0),
  potassium int(11) DEFAULT 0 CHECK(potassium>=0),
  fiber int(11) DEFAULT 0 CHECK(fiber>=0),
  status varchar(10) NOT NULL,
  PRIMARY KEY (productid),
  KEY producttypeid (producttypeid),
  CONSTRAINT products_new_ibfk_1 FOREIGN KEY (producttypeid) REFERENCES producttype (producttypeid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


CREATE TABLE producttype (
  producttypeid int(11) NOT NULL AUTO_INCREMENT,
  producttype varchar(20) NOT NULL,
  PRIMARY KEY (producttypeid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE region (
  regionid int(11) NOT NULL AUTO_INCREMENT,
  regionname varchar(25) NOT NULL,
  addressid int(11) NOT NULL,
  phonenumber varchar(20) NOT NULL,
  PRIMARY KEY (regionid),
  CONSTRAINT region_ibfk_1 FOREIGN KEY (addressid) REFERENCES address (addressid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE region_manager (
  regionid int(11) NOT NULL,
  regmanagerid int(11) DEFAULT 0,
  PRIMARY KEY (regionid),
  CONSTRAINT region_manager_ibfk_1 FOREIGN KEY (regionid) REFERENCES region (regionid)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT region_manager_ibfk_2 FOREIGN KEY (regmanagerid) REFERENCES employee (employeeid)
  ON DELETE SET DEFAULT
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE store (
  storeid int(11) NOT NULL AUTO_INCREMENT,
  addressid int(11) NOT NULL,
  numsalespersons int(11) NOT NULL DEFAULT '0',
  producttype int(11) NOT NULL,
  regionid int(11) NOT NULL,
  PRIMARY KEY (storeid),
  KEY regionid (regionid),
  CONSTRAINT store_ibfk_1 FOREIGN KEY (regionid) REFERENCES region (regionid)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT store_ibfk_2 FOREIGN KEY (addressid) REFERENCES address (addressid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE employee (
  employeeid int(11) NOT NULL,
  name varchar(50) NOT NULL,
  addressid int(11) DEFAULT 0,
  storeid int(11) NOT NULL DEFAULT 0,
  jobid int(11) NOT NULL,
  PRIMARY KEY (employeeid),
  KEY jobid (jobid),
  KEY storeid (storeid),
  CONSTRAINT employee_ibfk_1 FOREIGN KEY (employeeid) REFERENCES login (userid)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT employee_ibfk_2 FOREIGN KEY (addressid) REFERENCES address (addressid)
  ON DELETE DEFAULT
  ON UPDATE CASCADE,
  CONSTRAINT employee_ibfk_3 FOREIGN KEY (jobid) REFERENCES jobdetails (jobid)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  CONSTRAINT employee_ibfk_4 FOREIGN KEY (storeid) REFERENCES store (storeid)
  ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;












