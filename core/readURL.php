<?php 
include ('database.php');
$url = new ViewURL(); 
class ViewURL{
   
    private $tablename = 'urls';

 
public function readURL(){

$database = new Database();
$db = $database->getConnection();

  $query = "SELECT
                *
            FROM
                " . $this->tablename;
          
        $stmt = $db->prepare($query);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "$row[url_link]";
    
        }


}

public function checkURL($url){

    $query1 = "SELECT
            *
        FROM
            " . $this->tablename . "
        WHERE 
             url_link = ?";

    $stmt = $this->query($query1);
    $stmt->bindParam(1, $url);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row>0) {

        return true;
    }
    else{
        return false;
    }
}

}
?>
