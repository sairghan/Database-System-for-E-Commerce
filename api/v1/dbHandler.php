<?php

class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }
	/**
     * Fetching single record
     */
    public function getReportQueries($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
        return $result = $r->fetch_all(MYSQLI_ASSOC);    
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
		
		//return $query;
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
		
        if ($r) {
            $new_row_id = $this->conn->insert_id;
			return $new_row_id;
            } else {
            return NULL;
        }
		return $response;
    }
	
/*New Functions */

function select($table, $columns, $where){
		
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like '".$value."'";
                $a[":".$key] = $value;
            }
			///$query = "select productid,sku,productname,description,price from products_new";
			$query = "select ".$columns." from ".$table." where 1=1 ". $w;
			
			$r = $this->conn->query($query) or die($this->conn->error.__LINE__);
			$rows = $r->fetch_all(MYSQLI_ASSOC); 
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
	
    function select2($table, $columns, $where, $order){
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
            $stmt = $this->db->prepare("select ".$columns." from ".$table." where 1=1 ". $w." ".$order);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
	
    function insert($table, $columnsArray, $requiredColumnsArray) {
        $this->verifyRequiredParams($columnsArray, $requiredColumnsArray);
        
        try{
            $a = array();
            $c = "";
            $v = "";
            foreach ($columnsArray as $key => $value) {
                $c .= $key. ", ";
                $v .= ":".$key. ", ";
                $a[":".$key] = $value;
            }
            $c = rtrim($c,', ');
            $v = rtrim($v,', ');
            $stmt =  $this->db->prepare("INSERT INTO $table($c) VALUES($v)");
            $stmt->execute($a);
            $affected_rows = $stmt->rowCount();
            $lastInsertId = $this->db->lastInsertId();
            $response["status"] = "success";
            $response["message"] = $affected_rows." row inserted into database";
            $response["data"] = $lastInsertId;
        }catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = 'Insert Failed: ' .$e->getMessage();
            $response["data"] = 0;
        }
        return $response;
    }
	
    function update($table, $columnsArray, $where){ 
       // $this->verifyRequiredParams($columnsArray);
        try{
            $a = array();
            $w = "";
            $c = "";
			
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " = ".$value;
                $a[":".$key] = $value;
            }
			
            foreach ($columnsArray as $key => $value) {
                $c .= $key. " = '".$value."', ";
                $a[":".$key] = $value;
            }
                $c = rtrim($c,", ");
			
			$query = "UPDATE $table SET $c WHERE 1=1 ".$w;
			
			$r = $this->conn->query($query) or die($this->conn->error.__LINE__);
		
			if ($r) {
				$new_row_id = $this->conn->affected_rows;
				$response["status"] = "success";
                //$response["message"] = $new_row_id." row(s) updated in database";	
				$response["message"] = "Congratulations!! your order has been placed!!";	
            } 
			else {
				$response["status"] = "warning";
				$response["message"] = "Sorry! your order was not placed!";
			}
			
        }catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = "Update Failed: " .$e->getMessage();
        }
		
        return $response;
    }
	
    function delete($table, $where){
        if(count($where)<=0){
            $response["status"] = "warning";
            $response["message"] = "Delete Failed: At least one condition is required";
        }else{
            try{
                $a = array();
                $w = "";
                foreach ($where as $key => $value) {
                    $w .= " and " .$key. " = '".$value."'";
                    $a[":".$key] = $value;
                }
                $query = "DELETE FROM $table WHERE 1=1 ".$w;
               # $stmt->execute($a);
               # $affected_rows = $stmt->rowCount();
			   $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
				if ($r) {
				$affected = $this->conn->affected_rows;
				$response["status"] = "success";
                $response["message"] = $affected." row(s) updated in database";		
				} 
				else {
					$response["status"] = "warning";
					$response["message"] = "No row deleted";
				}
            }catch(Exception $e){
                $response["status"] = "error";
                $response["message"] = 'Delete Failed: ' .$e->getMessage();
            }
        }
        return $response;
    }

/*End New Functions*/
	
public function getSession(){
    if (!isset($_SESSION)) {
        session_start();
    }
    $sess = array();
    if(isset($_SESSION['uid']))
    {
        $sess["uid"] = $_SESSION['uid'];
        $sess["name"] = $_SESSION['name'];
        $sess["email"] = $_SESSION['email'];
    }
    else
    {
        $sess["uid"] = '';
        $sess["name"] = 'Guest';
        $sess["email"] = '';
    }
    return $sess;
}

public function getSessionProd(){
    if (!isset($_SESSION)) {
        session_start();
    }
    $sess = array();
    if(isset($_SESSION['puid']))
    {
        $sess["puid"] = $_SESSION['puid'];
        $sess["pname"] = $_SESSION['pname'];
        $sess["pemail"] = $_SESSION['pemail'];
    }
    else
    {
        $sess["puid"] = '';
        $sess["pname"] = 'Guest';
        $sess["pemail"] = '';
    }
    return $sess;
}

public function destroySession(){
    if (!isset($_SESSION)) {
    session_start();
    }
    if(isSet($_SESSION['uid']))
    {
        unset($_SESSION['uid']);
        unset($_SESSION['name']);
        unset($_SESSION['email']);
        $info='info';
        if(isSet($_COOKIE[$info]))
        {
            setcookie ($info, '', time() - $cookie_time);
        }
        $msg="Logged Out Successfully...";
    }
    else
    {
        $msg = "Not logged in...";
    }
    return $msg;
}

public function destroySessionProd(){
    if (!isset($_SESSION)) {
    session_start();
    }
    if(isSet($_SESSION['puid']))
    {
        unset($_SESSION['puid']);
        unset($_SESSION['pname']);
        unset($_SESSION['pemail']);
        $info='info';
        if(isSet($_COOKIE[$info]))
        {
            setcookie ($info, '', time() - $cookie_time);
        }
        $msg="Logged Out Successfully...";
    }
    else
    {
        $msg = "Not logged in...";
    }
    return $msg;
}
 
}

?>
