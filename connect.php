<?php
header("Content-Type: application/json; charset=UTF-8");
$obj = json_decode($_REQUEST["x"], false);
//creer une connexion....les information d'identification de la bd
$conn = new mysqli("localhost", "root", "", "senmoneydb");
////recupere les ligne de la table sendmoney
switch($obj->tra){
    case "choix":
        $stmt = $conn->prepare("SELECT numero FROM comptes");
        $stmt->execute();
        break;
    case "solde":
        $stmt = $conn->prepare("SELECT solde,code FROM comptes WHERE numero =".$obj->numSelectionne);
        $stmt->execute();
        break;
    case "verification":
        $stmt = $conn->prepare("SELECT numero FROM comptes WHERE numero =".$obj->destinataire);
        $stmt->execute();
        break;
    case "transfert":
        $stmt = $conn->prepare("INSERT INTO transfert (id, montant, expediteur, destinataire) VALUES (null,".$obj->montant.",".$obj->numSelectionne.",".$obj->destinataire.")");
        $stmt->execute();
        $stmt2 = $conn->prepare("UPDATE comptes SET solde=solde-".$obj->montant." WHERE numero=".$obj->numSelectionne);
        $stmt2->execute();
        $stmt3 = $conn->prepare("UPDATE comptes SET solde=solde+".$obj->montant." WHERE numero=".$obj->destinataire);
        $stmt3->execute();
        break;
    case "modificationCode":
        $stmt2 = $conn->prepare("UPDATE comptes SET code=".$obj->nouveauCode." WHERE numero=".$obj->numSelectionne);
        $stmt2->execute();
        break;

    case "consulTransaction":
        $stmt = $conn->prepare("SELECT montant,expediteur,destinataire FROM transfert WHERE expediteur=".$obj->numSelectionne." OR destinataire=".$obj->numSelectionne." LIMIT ".$obj->limit);
        $stmt->execute();
        break;
}

$result = $stmt->get_result();
$outp = $result->fetch_all(MYSQLI_ASSOC);
//affiche le tableau au format json
echo json_encode($outp);
$conn->close();
?>
