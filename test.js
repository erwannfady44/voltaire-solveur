const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assets', 'orthographe_modifie.txt');
const fichier = fs.readFileSync(filePath, 'utf-8');
const lignes = fichier.split('\n');
const data = [];
let end = [];
const phrase = "C'est une activité que j'ai beaucoup aimée exercer.";

for (let l of lignes) {
    const tab = l.split('|');
    tab[0] = parseInt(tab[0]);
    data.push(tab);
}


function toHex(str) {
    var result = 0;
    for (const c of str) {
        if (c === '<')
            result -= 98;
        else {
            const r = c.charCodeAt(0);
            //si c'est une minuscule
            if (r >= 97 && r <= 122)
                result += r;
            else if (r >= 65 && r <= 90)
                result += (r + 0x20);
        }
    }
    return result;
}

function recupererValeursProches(n) {
    const seuil = 0.18; // 20%
    const valeursProches = [];
    const min = n - seuil * n;
    const max = n + seuil * n;
    for (let d of data) {
        if (d[0] >= min && d[0] <= max) {
            valeursProches.push(d);
        } else if (d[0] > max) {
            return valeursProches;
        }
    }
}

function ajouterDansTableauTrie(valeur, tableau) {
    let debut = 0;
    let fin = tableau.length - 1;

    // Recherche dichotomique pour trouver la position d'insertion
    while (debut <= fin) {
        let milieu = Math.floor((debut + fin) / 2);

        if (tableau[milieu][2] < valeur[2]) {
            debut = milieu + 1;
        } else {
            fin = milieu - 1;
        }
    }

    // Insérer la valeur à l'index trouvé
    tableau.splice(debut, 0, valeur);
}

function recupPhrase() {
    let res = recupererValeursProches(toHex(phrase))

    for (let i = 0; i < res.length; i++) {
        let score = 0;

        for (let j = 0; j < res[i][1].length; j++) {
            let p = phrase;
            if (res[i][1].charAt(j) === '<') {
                j+=2;
            } else if (res[i][1].charAt(j) !== ' ' && res[i][1].charAt(j) !== '/' && res[i][1].charAt(j) !== '>' && res[i][1].charAt(j) !== '.') {
                for (let k = 0; k < p.length; k++) {
                    if (p.charAt(k) === res[i][1].charAt(j)) {
                        score++;
                        p = p.substring(0, k - 1) + p.substring(k, p.length);
                        break;
                    }
                }
            }
        }


        res[i][2] = score;
    }
    res.sort((a, b) => {
        if (a[2] > b[2])
            return -1;
        else if (a[2] === b[2])
            return 0;
        else
            return 1;
    })

    let best = [];
    for (let i = 0; i < 10; i++) {
        best.push(res[i]);
    }

    let comma = phrase.split(",").length - 1;

    for (let b of best) {
        b[3] = Math.abs(comma - (b[1].split(",").length));
    }

    best.sort((a, b) => {
        if (a[3] < b[3])
            return -1;
        else if (a[3] === b[3])
            return 0;
        else
            return 1;
    })

    let last = [];
    for (let b of best) {
        if (comma - b[3] === 0)
            last.push(b);
    }


    let space = phrase.split(" ").length - 1;

    for (let b of last) {
        b[4] = Math.abs(space - (b[1].split(" ").length - 6));
    }

    last.sort((a, b) => {
        if (a[4] < b[4])
            return -1;
        else if (a[4] === b[4])
            return 0;
        else
            return 1;
    })

    for (let i = 0; i < 3; i++) {
        end.push(last[i]);
    }

    return end;
}

end = recupPhrase();
//console.log(end)
console.log(toHex(phrase))

for (const e of end)
    console.log(e[1])

/*for (let i = 0; i < end.length; i++) {
    if (end[i][1].includes("gré de signer ces trois documents.")) {
        console.log(i);
        console.log(end[i]);
        return;
    }
}*/
