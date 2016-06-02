var table = [];
table[0] = 1;
table[1] = 2;
table[2] = 3;
table[3] = 4;
table[4] = 5;
table[5] = 6;
table[6] = 7;
table[7] = 8;
table[8] = 9;

var tableAresoudre = [];
tableAresoudre = table;

var images = [];
var imageBlanc = new Image();
images[0] = new Image();
images[1] = new Image();
images[2] = new Image();
images[3] = new Image();
images[4] = new Image();
images[5] = new Image();
images[6] = new Image();
images[7] = new Image();
images[8] = new Image();
var image1 = "images/1.png";
var image2 = "images/2.png";
var image3 = "images/3.png";
var image4 = "images/4.png";
var image5 = "images/5.png";
var image6 = "images/6.png";
var image7 = "images/7.png";
var image8 = "images/8.png";
var image9 = "images/9.png";
imageBlanc.src = image9;
images[0].src = image1;
images[1].src = image2;
images[2].src = image3;
images[3].src = image4;
images[4].src = image5;
images[5].src = image6;
images[6].src = image7;
images[7].src = image8;
images[8].src = image9;

var bouger = document.getElementById('bouger');
var randomiser_btn = document.getElementById('randomiser');
var resoudre_btn = document.getElementById('resoudre');
var recommencer_btn = document.getElementById('recommencer');
var prochain_btn = document.getElementById('prochain');
var texte = document.getElementById('texte');
var bravo = document.getElementById('bravo');

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

window.onload = function () {
    canvas.onclick = clicSurCanvas;

    /* Clic sur bouger */
    bouger.onclick = function () {
        bouger_random(images);  //Bouger aléatoirement
        dessinerTout(images);   //Redessiner
    };

    /* Clic sur randomiser */
    randomiser_btn.onclick = function () {
        for (var i = 0; i < 10; i++) {  //Bouger aléatoirement 10 fois
            bouger_random(images);
        }
        dessinerTout(images);
    };

    /* Clic sur résoudre */
    resoudre_btn.onclick = resoudre;
    
    prochain_btn.onclick = prochain;

    /* Clic sur recommencer */
    recommencer_btn.onclick = function () {
        location.href = "index.html";
    };

    dessinerTout(images);
};/* end doc ready */


function clicSurCanvas(e) {
    /* Recuperer la position du curseur */
    var mouseX = (e.layerX - 10) || 0;
    var mouseY = (e.layerY - 10) || 0;
    var x = Math.floor(mouseX / 100);
    var y = Math.floor(mouseY / 100);

    /* Quel numero dans le tableau */
    var locationClic = x + (y * 3);

    /* Ou se trouve le blanc */
    var locationBlanc = positionBlanc(images);

    if ((locationBlanc - 3) == locationClic && (locationBlanc - 3 >= 0)) {	//haut

    } else if ((locationBlanc + 3) == locationClic && (locationBlanc + 3 <= 8)) {	//bas

    } else if ((locationBlanc - 1) == locationClic && (locationBlanc % 3 != 0)) {	//gauche

    } else if ((locationBlanc + 1) == locationClic && ((locationBlanc - 2) % 3 != 0)) {	//droite

    }
    else {  //Si on ne peux pas bouger
        return;
    }
    echanger(images, locationBlanc, locationClic);
    dessinerTout(images);
}

/* Echanger deux positions */
function echanger(imagesArray, ancien, nouveau) {
    var foo = imagesArray[ancien];
    imagesArray[ancien] = imagesArray[nouveau];
    imagesArray[nouveau] = foo;

    var bar = table[ancien];
    table[ancien] = table[nouveau];
    table[nouveau] = bar;
    
    if (table[0] == 1 && table[1] == 2 && table[2] == 3 && table[3] == 4 &&
            table[4] == 5 && table[5] == 6 && table[6] == 7 &&
            table[7] == 8 && table[8] == 9) {
        bravo.innerHTML = "Bravo!";
    }
    else {
        bravo.innerHTML = '';
    }
}


/* Randomiser les images */
function bouger_random(imageArray) {
    /* Ou se trouve le blanc */
    var locationBlanc = positionBlanc(imageArray);
    var locationClic = locationBlanc;

    var haut = 0;
    var bas = 0;
    var gauche = 0;
    var droite = 0;
    var total = 0;

    var possible = "";

    if (locationBlanc - 3 >= 0) {	//haut
        haut = 1;
    }
    if (locationBlanc + 3 <= 8) {	//bas
        bas = 10;
    }
    if (locationBlanc % 3 != 0) {	//gauche
        gauche = 100;
    }
    if ((locationBlanc - 2) % 3 != 0) {	//droite
        droite = 1000;
    }

    total = haut + bas + gauche + droite;

    if (total >= 1000) {
        possible = "" + total;
    } else if (total >= 100) {
        possible = "0" + total;
    } else if (total >= 10) {
        possible = "00" + total;
    } else if (total >= 1) {
        possible = "000" + total;
    }

    var foo = Math.floor(Math.random() * 4);

    while (possible[foo] != 1) {
        foo = (foo + 1) % 4;
    }

    switch (foo) {
        case 0:
            locationClic = locationBlanc + 1;
            break;
        case 1:
            locationClic = locationBlanc - 1;
            break;
        case 2:
            locationClic = locationBlanc + 3;
            break;
        case 3:
            locationClic = locationBlanc - 3;
            break;
    }

    echanger(images, locationBlanc, locationClic);
}

/* Renvoie la position du blanc */
function positionBlanc(imageArray) {
    for (var i = 0; i < 9; i++) {
        if (imageArray[i].src == imageBlanc.src) {
            return i;
        }
    }
}

function trouverNombreAbouger(action, etat) {
    var i = etat.indexOf(9);
    switch (action) {
        case Action.up:
            return etat[Util.index(Util.x(i), Util.y(i) - 1)];
        case Action.down:
            return etat[Util.index(Util.x(i), Util.y(i) + 1)];
        case Action.right:
            return etat[Util.index(Util.x(i) + 1, Util.y(i))];
        case Action.left:
            return etat[Util.index(Util.x(i) - 1, Util.y(i))];
    }
}


function resoudre() {
    var probleme = new Probleme(tableAresoudre);
    var sol = Resolveur.chercherAstar(probleme);
    var resultat = "<table class=\"table table-striped\">";
    for (var i = 0; i < sol.length; i++) {
        var n = trouverNombreAbouger(sol[i], tableAresoudre);
        tableAresoudre = probleme.resultat(sol[i], tableAresoudre);
        resultat += "<tr><td>"+(i+1)+"</td><td>Bougez " + n + "</td></tr>";
    }
    resultat += "</table>";
    texte.innerHTML = resultat;
    tableAresoudre = table;
}

function prochain() {
    var probleme = new Probleme(tableAresoudre);
    var sol = Resolveur.chercherAstar(probleme);
    switch (sol[0]) {
        case 'haut':
            echanger(images, positionBlanc(images), positionBlanc(images) - 3);
            break;
        case 'bas':
            echanger(images, positionBlanc(images), positionBlanc(images) + 3);
            break;
        case 'gauche':
            echanger(images, positionBlanc(images), positionBlanc(images) - 1);
            break;
        case 'droite':
            echanger(images, positionBlanc(images), positionBlanc(images) + 1);
            break;
    }
    dessinerTout(images);
    tableAresoudre = table;
}


/* Dessine un carre dans le canvas. x,y sont les coordonnees */
function dessinerCarre(image, x, y) {
    context.drawImage(image, x * 100, y * 100, 100, 100);	/* Un carre fait 100px*100px */
}

/* Dessine tous les carres dans le canvas
 imagesArray contient les images a afficher */
function dessinerTout(imagesArray) {
    dessinerBackground(canvas, context);	/* Dessiner le background */
    var numImage = 0;
    var resolu = false;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            dessinerCarre(imagesArray[numImage], j, i);	/* Dessiner chaque carre */
            numImage++;
        }
    }
}

/* Dessine le background */
function dessinerBackground(canvas, context) {
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}
