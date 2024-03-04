const fs = require('fs');
const natural = require('natural');
const readline = require('readline');

// Lire le contenu du fichier
const corpus = fs.readFileSync('assets/orthographe_modifie.txt', 'utf8');
const corpus2 = fs.readFileSync('assets/orthographe.txt', 'utf8');

let objective = 0.85;

// Séparer les phrases en utilisant un séparateur approprié (dans cet exemple, '\n')
const sentences = corpus.split('\n');
const sentences2 = corpus2.split('\n');

let result = -1;

// Fonction pour trouver la phrase la plus proche
function findClosestSentence(reference) {
    if (reference.charAt(reference.length - 1) === '.')
        reference = reference.substring(0, reference.length - 1) + "\r.";
    else
        reference = reference + "\r";
    let maxSimilarity = -1;
    let closestSentence = '';
    let i = -1;
    sentences.forEach((sentence) => {
        i++;
        const similarity = natural.JaroWinklerDistance(reference, sentence, {ignoreCase: false});
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            closestSentence = sentence;
            result = i;
        }
    });
    console.log(maxSimilarity, closestSentence);
    if (maxSimilarity > 0.86)
        return result;
    else
        return -1;
}


// Boucle pour demander des phrases de référence
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez un objectif : ', (reference) => {
    objective = reference;
    askReference();
});

function askReference() {
    rl.question('Entrez une phrase de référence (tapez "exit" pour quitter) : ', (reference) => {
        if (reference === 'exit') {
            rl.close();
            return;
        }
        if (Math.random() * 100 > objective) {
            console.log("Ajouter une faute")
        } else {
            const closestSentence = findClosestSentence(reference);
            if (closestSentence === -1)
                console.log("Pas de faute");
            else {
                let fault = false;
                for (let i = 0; i < sentences[result].length - 1; i++) {
                    if (reference.charAt(i) !== sentences[result].charAt(i)) {
                        console.log(sentences2[result])
                        fault = true;
                        break;
                    }

                }
                if (!fault)
                    console.log("Pas de faute");
            }
        }
        askReference();

    });
}


