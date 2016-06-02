//Ajouter des fonctions à Array
Array.prototype.cloner = function () {
    return this.slice(0);
};
Array.prototype.echanger = function (i1, i2) {
    var copy = this.cloner();
    var tmp = copy[i1];
    copy[i1] = copy[i2];
    copy[i2] = tmp;
    return copy;
};


//Array.prototype.indexOf, pas présent sur IE
if (!Array.prototype.hasOwnProperty("indexOf")) {
    Array.prototype.indexOf = function (x) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == x)
                return i;
        }
        return -1;
    };
}

//Array.prototype.map, pas présent sur IE
if (!Array.prototype.hasOwnProperty("map")) {
    Array.prototype.map = function (f) {
        var resultat = [];
        for (var i = 0; i < this.length; i++) {
            resultat[i] = f(this[i]);
        }
        return resultat;
    };
}

Array.prototype.aUn = function (e) {
    return this.indexOf(e) >= 0;
};
Array.prototype.insererA = function (i, x) {
    this.splice(i, 0, x);
};


var Util = {};
Util.estIndexValide = function (i) {
    return i >= 0 && i <= 2;
};
Util.index = function (x, y) {
    return 3 * y + x;
};
Util.x = function (index) {
    return index % 3;
};
Util.y = function (index) {
    return Math.floor(index / 3);
};

//Actions
var Action = {up: "haut", down: "bas", right: "droite", left: "gauche"};

//======== Manipuler les etats ==========

var Probleme = function (start_state) {
    this.init_state = start_state;
    return this;
};
Probleme.prototype.estBut = function (state) {
    if (state.length != 9)
        return false;

    for (var i = 0; i < 9; i++) {
        if (state[i] != i + 1)
            return false;
    }
    return true;
};
//Distance Manhatten
Probleme.prototype.cacheCoutApproximatif = [];
Probleme.prototype.coutApproximatif = function (state) {
    var index = state.toString();
    var cached = this.cacheCoutApproximatif[index];
    if (cached == null) {
        var cost = 0;
        for (var i = 0; i < 9; i++) {
            if (state[i] != i + 1 && state[i] != 9) {
                var tmp = state[i] - 1;
                cost = cost + Math.abs(Util.x(tmp) - Util.x(i)) + Math.abs(Util.y(tmp) - Util.y(i));
            }
        }
        this.cacheCoutApproximatif[index] = cost;
        return cost;
    }
    else {
        return cached;
    }
};
Probleme.prototype.actions = function (state) {
    var resultat = [];
    var count = 0;

    var i = state.indexOf(9);
    var ix = Util.x(i);
    var iy = Util.y(i);

    var newx = ix - 1;
    if (Util.estIndexValide(newx)) {
        resultat[count++] = Action.left;
    }

    newx = ix + 1;
    if (Util.estIndexValide(newx)) {
        resultat[count++] = Action.right;
    }

    var newy = iy - 1;
    if (Util.estIndexValide(newy)) {
        resultat[count++] = Action.up;
    }

    newy = iy + 1;
    if (Util.estIndexValide(newy)) {
        resultat[count] = Action.down;
    }

    return resultat;
};
Probleme.prototype.resultat = function (action, state) {
    var i1 = state.indexOf(9);
    var x = Util.x(i1);
    var y = Util.y(i1);

    switch (action) {
        case Action.up:
            return state.echanger(i1, Util.index(x, y - 1));
        case Action.down:
            return state.echanger(i1, Util.index(x, y + 1));
        case Action.right:
            return state.echanger(i1, Util.index(x + 1, y));
        case Action.left:
            return state.echanger(i1, Util.index(x - 1, y));
    }
};

Probleme.prototype.cout = function (from, to) {
    return 1;
};

Probleme.prototype.estSolvable = function (start) {
    start = start.cloner();
    start.splice(start.indexOf(9), 1);
    start[8] = 9;
    var count = 0;
    for (var i = 0; i < 8; i++) {
        if (start[i] != i + 1) {
            count++;
            var j = start.indexOf(i + 1);
            start[j] = start[i];
            start[i] = i + 1;
        }
    }
    return count % 2 == 0;
}

//============== L'algo A* ============================
var Resolveur = {};
Resolveur.trouverSolution = function (node) {
    var resultat = [];
    while (node.hasOwnProperty("action")) {
        resultat[resultat.length] = node.action;
        node = node.parent;
    }
    resultat.reverse();
    return resultat;
};
Resolveur.chercherGraphe = function (problem, frontier) {

    frontier.inserer({state: problem.init_state, cost: 0});
    var explored = [];
    var node;

    while (true) {
        if (!frontier.estVide()) {
            node = frontier.enleverPremier();
            if (problem.estBut(node.state))
                return Resolveur.trouverSolution(node);
            else {
                if (!explored.aUn(node.state.toString())) {
                    frontier.insererTout(problem.actions(node.state).map(function (a) {
                        var new_state = problem.resultat(a, node.state);
                        return {state: new_state, parent: node, cost: node.cost + problem.cout(node.state, new_state), action: a};
                    }));
                    explored[explored.length] = node.state.toString();
                }
            }
        }
        else
            return "failed";
    }
}


//Factory for PriorityQueue
function PriorityQueue(sortfunc) {
    this.contents = [];
    this.estVide = function () {
        return this.contents.length == 0;
    };
    this.enleverPremier = function () {
        return this.contents.shift();
    };

    //-- inserts --
    //find, using binary search, where to inserer x inside
    //sortedarray so that it stays sorted
    this.trouverIndex = function (x, sortedarray, sortfunc) {
        if (sortedarray.length == 0) {
            return 0;
        }
        var i1 = 0;
        var i2 = sortedarray.length - 1;

        while (true) {

            if (i1 > i2) {
                return i1;
            }

            var i = Math.ceil((i1 + i2) / 2);
            var c = sortfunc(x, sortedarray[i]);
            if (c < 0) {
                i2 = i - 1;
            } else {
                i1 = i + 1;
            }
        }
    };
    this.inserer = function (x) {
        var i = this.trouverIndex(x, this.contents, sortfunc);
        this.contents.insererA(i, x);
    };
    this.insererTout = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.inserer(arr[i]);
        }
    };
}

Resolveur.chercherAstar = function (problem) {
    return this.chercherGraphe(problem, new PriorityQueue(function (n1, n2) {
        return (n1.cost + problem.coutApproximatif(n1.state)) - (n2.cost + problem.coutApproximatif(n2.state));
    }));
};
