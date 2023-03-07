const Word2Vec = require('word2vec');
const { cosineSimilarity } = require('ml-distance-cosine');

// Corpus de phrases
const corpus = [
    "Bonjour, comment ça va ?",
    "Quel temps fait-il aujourd'hui ?",
    "As-tu vu le match hier soir ?",
    "Quel est ton plat préféré ?",
    "Je suis fatigué, je vais me reposer",
];

// Phrase à trouver
const target = "Je suis épuisé, je vais me reposer";

// Chargement du modèle Word2Vec
Word2Vec.loadModel('./path/to/word2vec/model.bin', (err, model) => {
    if (err) throw err;

    // Représentation vectorielle des phrases
    const vectors = [];
    for (const sentence of corpus) {
        const words = sentence.split(' ');
        const vector = words.reduce((sum, word) => sum.add(model.getVector(word)), new Array(300).fill(0));
        vectors.push(vector);
    }
    const targetWords = target.split(' ');
    const targetVector = targetWords.reduce((sum, word) => sum.add(model.getVector(word)), new Array(300).fill(0));

    // Mesure de similarité
    const similarityScores = vectors.map((vector) => cosineSimilarity(targetVector, vector));

    // Récupération de la phrase la plus proche
    const mostSimilarIndex = similarityScores.indexOf(Math.max(...similarityScores));
    const mostSimilarSentence = corpus[mostSimilarIndex];

    console.log("Phrase la plus proche :", mostSimilarSentence);
});
