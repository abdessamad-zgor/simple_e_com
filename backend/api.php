<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

require_once __DIR__ . '/vendor/autoload.php';

$client = new MongoDB\Client('mongodb://localhost:27017');
$produits_col = $client->e_com->produits;

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? '';

if ($method === 'GET') {
  $produits = $produits_col->find([])->toArray();
  echo json_encode($produits);
  if($id){
    $produit = $produits_col->findOne(
      ["_id"=>new MongoDB\BSON\ObjectId("$id")]
    )->toArray();
    echo json_encode($produit);
  }
} elseif ($method === 'PUT') {
  $values = json_decode(file_get_contents('php://input') );
  $result = $produits_col->updateOne(
    ["_id" => new MongoDB\BSON\ObjectId("$id")],
    ['$set' => $values]
  );
  echo json_encode(
    [
      "upsertedId"=>$result->getUpsertedId(),
      "upsertedCount"=>$result->getUpsertedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
} elseif ($method === 'POST') {
  $values = json_decode(file_get_contents('php://input'));
  $result = $produits_col->insertOne($values);
  echo json_encode(
    [
      "insertedId"=>$result->getInsertedId(),
      "insertedCount"=>$result->getInsertedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
} elseif ($method === 'DELETE') {
  $result = $produits_col->deleteOne(
    ["_id" => new MongoDB\BSON\ObjectId("$id")]
  );
  echo json_encode(
    [
      "deletedCount"=>$result->getDeletedCount(),
      "isAcknowledged"=>$result->isAcknowledged()
    ]
  );
}
?>
