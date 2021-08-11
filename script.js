var numSelectionne;
function menuPrincipal() {

    numSelectionne = document.querySelector("#num").value;
    var numchoisi = window.prompt(
        "MENU SENMONEY\n" +
        "" + numSelectionne + "\n" +
        "Taper le numéro du service choisi \n" +
        "1: Solde de mon compte \n" +
        "2: Transfert d'argent \n" +
        "3: Paiment de facture \n" +
        "4: Options");
    return numchoisi;
}
function main() {
    var choix = menuPrincipal();
    switch (choix) {
        case "1":
            printSolde();
            break;
        case "2":
            transferer();
            break;
        case "3":

            break;
        case "4":
            options();
            break;
        default:
            break;
    }
}

function printSolde() {
    var codesaisi = window.prompt("Saisir le code");
    obj = { "tra": "solde", "numSelectionne": numSelectionne, "code": codesaisi };
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mySolde = JSON.parse(this.responseText);
            alert("Le solde de ton compte est " + mySolde[0].solde);
            main();

        }
    }
    xmlhttp.open("GET", "connect.php?x=" + dbParam, true);
    xmlhttp.send();
}
function printSolde2() {

    obj = { "tra": "solde", "numSelectionne": numSelectionne };
    dbParam = JSON.stringify(obj);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            mySolde = JSON.parse(this.responseText);
            alert("Le solde de ton compte après le transfert est " + mySolde[0].solde);
            main();
        }
    }
    xmlhttp.open("GET", "connect.php?x=" + dbParam, true);
    xmlhttp.send();
}

function transferer() {
    montant = window.prompt("TRANSFERT\n" +
            "Veuillez saisir le montant à transférer \n"
            );
    var destinataire;
    if (montant != null) {
        objSolde = { "tra": "solde", "numSelectionne": numSelectionne };
        dbParamSolde = JSON.stringify(objSolde);
        xmlhttpSolde = new XMLHttpRequest();
        xmlhttpSolde.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                myObjSolde = JSON.parse(this.responseText);
                soldeCpt = myObjSolde[0].solde;
                if (montant > soldeCpt) {
                    alert("Solde insuffisant pour effectuer le transfert!");
                    main();
                } else {
                    transfertNext();
                }
            }
        }
        xmlhttpSolde.open("GET", "connect.php?x=" + dbParamSolde, true);
        xmlhttpSolde.send();
    } else {
        main();
    }

    function transfertNext() {
        destinataire = window.prompt("TRANSFERT\n" +
                    "Numéro destinataire \n"
                    );
        objDest = { "tra": "verification", "destinataire": destinataire };//1
        dbParamDest = JSON.stringify(objDest);//2
        xmlhttpDest = new XMLHttpRequest();//3
        xmlhttpDest.onreadystatechange = function () {//5
            if (this.readyState == 4 && this.status == 200) {
                myObjDest = JSON.parse(this.responseText);
                if (myObjDest[0] == null) {
                    alert("Ce numéro n'a pas de compte!");
                    main();
                } else {
                    executerTranfert();
                }
            }
        }
        xmlhttpDest.open("GET", "connect.php?x=" + dbParamDest, true);//4
        xmlhttpDest.send();//5
    }

    function executerTranfert() {
        objTransfert = { "tra": "transfert", "numSelectionne": numSelectionne, "montant": montant, "destinataire": destinataire };
        dbParamTransfert = JSON.stringify(objTransfert);
        xmlhttpTransfert = new XMLHttpRequest();
        xmlhttpTransfert.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

            }
        }
        xmlhttpTransfert.open("GET", "connect.php?x=" + dbParamTransfert, true);
        xmlhttpTransfert.send();
        alert("Transfert effectué avec succès!");
        printSolde2();
    }
}

function options() {
    var choixOption =  window.prompt("Options\n" +
            "Choisir une option\n" +
            "1: Modifier votre code\n" +
            "2: Consulter les quatre derinières transactions"
        );
    switch (choixOption) {
        case "1":
            modificationCode();
            break;
        case "2":
            afficherTransactions();
            break;
        default:
            break;
    }



    function modificationCode() {
        nouveauCode = window.prompt("Modification de ton code\n" +
                    "Nouveau code \n"
                    );
        obj = { "tra": "modificationCode", "numSelectionne": numSelectionne,"nouveauCode":nouveauCode };
        dbParam = JSON.stringify(obj);
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

            }
        }
        xmlhttp.open("GET", "connect.php?x=" + dbParam, true);
        xmlhttp.send();

        alert("Ton code a été modifié avec succès!");
        main();
    }
    function afficherTransactions() {
        obj = { "tra": "consulTransaction", "numSelectionne": numSelectionne,"limit":5 };
        dbParam = JSON.stringify(obj);
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var myObj = JSON.parse(this.responseText);
                var out = "Cinq  premières transactions \n";
                for(let x in myObj) {

                    out +=" Expéditeur : " +
                    myObj[x].expediteur +
                    " Destinataire : " +
                    myObj[x].destinataire +
                    " montant : " +
                    myObj[x].montant+
                    "\n" ;
                }
                alert(out);
                main();
            }
        }
        xmlhttp.open("GET", "connect.php?x=" + dbParam, true);
        xmlhttp.send();
    }
}
