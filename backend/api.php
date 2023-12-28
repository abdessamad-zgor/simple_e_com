<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

require_once __DIR__ . '/vendor/autoload.php';

// connexion à l'instance MongoDB 
$client = new MongoDB\Client('mongodb://localhost:27017');
// selection du collection 'produits' dans la base de donnes 'e_com'
$produits_col = $client->e_com->produits;

// extraction du methode du requet
$method = $_SERVER['REQUEST_METHOD'];
// extraction du parametre 'id' si presente
$id = $_GET['id'] ?? '';

if ($method === 'GET') {
  // trouver tous les documents dans la collection 'produits'  
  $produits = $produits_col->find([])->toArray();
  // retourner la result comme reponse JSON
  echo json_encode($produits);
  // retourner un seul produits 
  if($id){
    $produit = $produits_col->findOne(
      ["_id"=>new MongoDB\BSON\ObjectId("$id")]
    )->toArray();
    echo json_encode($produit);
  }
} elseif ($method === 'PUT') {
  // recuperer les information du produit depuis le requets
  $values = json_decode(file_get_contents('php://input') );
  // faire la mise a jour d'un produit 
  $result = $produits_col->updateOne(
    ["_id" => new MongoDB\BSON\ObjectId("$id")],
    ['$set' => $values]
  );
  // return le results du mise a jour 
  echo json_encode(
    [
      "upsertedId"=>$result->getUpsertedId(),
      "upsertedCount"=>$result->getUpsertedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
} elseif ($method === 'POST') {

  // recuperer les information du produit depuis le requets
  $values = json_decode(file_get_contents('php://input'));
  // faire l'insertion d'un produit 
  $result = $produits_col->insertOne($values);
  // return le result d'insertion 
  echo json_encode(
    [
      "insertedId"=>$result->getInsertedId(),
      "insertedCount"=>$result->getInsertedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
} elseif ($method === 'DELETE') {
  // faire la suppression d'un produit
  $result = $produits_col->deleteOne(
    ["_id" => new MongoDB\BSON\ObjectId("$id")]
  );
  // return le result du suppression
  echo json_encode(
    [
      "deletedCount"=>$result->getDeletedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
}
?>
