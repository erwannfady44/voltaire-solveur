const fs = require('fs');
const path = require('path');

function calculHex() {
    return new Promise(resolve => {
        // Lire le fichier orthagraphe.txt
        fs.readFile('assets/orthographe.txt', 'utf-8', (err, data) => {
            if (err) throw err;

            // Ajouter le chiffre 5 en début de chaque ligne
            const lines = data.split('\n');
            const modifiedLines = lines.map(line => `${toHex(line)}|${line}`);

            // Écrire le résultat dans un nouveau fichier
            fs.writeFile('assets/orthographe_modifie.txt', modifiedLines.join('\n'), err => {
                if (err) throw err;
                console.log('Le fichier a été modifié avec succès !');
                resolve();
            });
        });
    })
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

function trierPhrases() {
    // Récupérer le chemin absolu du fichier
    const filePath = path.join(__dirname, 'assets', 'orthographe_modifie.txt');

    // Lire le contenu du fichier
    const fichier = fs.readFileSync(filePath, 'utf-8');

    // Séparer les phrases en un tableau de lignes
    const lignes = fichier.split('\n');

    // Trier les phrases par ordre croissant
    lignes.sort((a, b) => {
        const numeroA = parseInt(a.split('|')[0]);
        const numeroB = parseInt(b.split('|')[0]);
        return numeroA - numeroB;
    });

    // Rejoindre les lignes triées pour former le fichier trié
    const fichierTrie = lignes.join('\n');

    // Écrire le fichier trié
    fs.writeFileSync(filePath, fichierTrie);

    return fichierTrie;
}
async function main() {
    await calculHex();
    trierPhrases();
}

main()