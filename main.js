const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

const generateSentence = (data, color) => {
   
    while(data.includes(' <B> ')){
        let sentence, sentence2, word;
        sentence = data.split(' <B> ')
        word = sentence[1]
    
        sentence2 = word.split(' </B> ')
        word = sentence2.shift()
        sentence.slice(1, 0)

        data = sentence[0] + color + word.split(' ').filter(e => e != '').join(' ') + '\x1b[1m\x1b[0m' + sentence2 + (sentence.length > 2 ? ' <B>  ' + sentence[2] : '');
    }
    console.log(data)
}

const percentWithSentence = async (data, percents) => {
    let i, j;

    while(true) {

        await prompt.get(['sentence']).then( async (r, e) => {
            sentence = r.sentence.toLowerCase();
            research = r.sentence.split(' ');
            i = 0, j = 0;

            while(i < data.length){
                let percent = 0, line = data[i].split(' ')

                for ( let term of research) line.includes(term) ? percent += 100 / (research.length - 2) : '';

                if( 
                    sentence.toLowerCase().replaceAll('  ', ' ').includes(
                        line.join(' ').toLowerCase().replace(' <b> ', '').replace(' </b> ','').replaceAll('  ', ' ')
                    ) || 
                    line.join(' ').toLowerCase().replace(' <b> ', '').replace(' </b> ','').replaceAll('  ', ' ').includes(
                        sentence.toLowerCase().replaceAll('  ', ' ')
                    ) ){

                } else if(  percent > percents[0] && percent < percents[1] ){

                    generateSentence(data[i], '\x1b[31m');
                    j++;
                }
                else if( percent > percents[1] && percent < percents[2] ){
                    generateSentence(data[i], '\x1b[33m');
                    j++;
                }
                else if(  percent > percents[2] ){
                    generateSentence(data[i], '\x1b[32m');
                    j++;
                }
                i++
            }

            if( j == 0) console.log('\x1b[32m'+'Bonne réponse'+ '\x1b[0m');
            console.log('')
        })
    }
}

const Orthographe = async () => {
    percentWithSentence(fs.readFileSync(path.normalize(`${__dirname}/assets/orthographe.txt`)).toString().split('\n'), [70,80,90])
}

const Syntaxe = async () => {
    percentWithSentence(fs.readFileSync(path.normalize(`${__dirname}/assets/syntaxe.txt`)).toString().split('\n'), [50,60,70])
}

const Vocabulaire = async () => {
    let data = fs.readFileSync(path.normalize(`${__dirname}/assets/vocabulaire.txt`)).toString().split('\n'), i, j;

    while(true) {

        await prompt.get(['word']).then( async (r, e) => {
            researchWord = r.word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('');
            i = 0, j = 0;

            while(i < data.length){

                if( data[i].split(' -> ')[0].length > researchWord.length + 2 || data[i].split(' -> ')[0].length < researchWord.length - 2 ){

                } else if(r.word === data[i].split(' -> ')[0]){
                    generateSentence(data[i], '\x1b[32m');
                    j++;

                } else {
                    let percent = 0, dataWord = data[i].split(' -> ')[0].split('')

                    for ( let letter of researchWord ) dataWord.includes(letter) ? percent += 100 / researchWord.length : '';
                    
                    if(  percent > 90 && percent < 92 ){
    
                        generateSentence(data[i], '\x1b[31m');
                        j++;
                    }
                    else if( percent > 92 && percent < 95 ){
                        generateSentence(data[i], '\x1b[33m');
                        j++;
                    }
                    else if(  percent > 95 ){
                        
                        generateSentence(data[i], '\x1b[32m');
                        j++;
                    }
                }
                i++
            }

            if( j == 0)console.log('\x1b[32m'+'Error : Nothing Found'+ '\x1b[0m');
            console.log('')
        })
    }
}

const main = async () => {
    prompt.start();

    console.log('\n\n\x1b[1m\x1b[36m'+
        ' /$$    /$$  /$$$$$$  /$$    /$$$$$$$$ /$$$$$$  /$$$$$$ /$$$$$$$  /$$$$$$$$ \n'+
        '| $$   | $$ /$$__  $$| $$   |__  $$__//$$__  $$|_  $$_/| $$__  $$| $$_____/\n'+
        '| $$   | $$| $$  \\ $$| $$      | $$  | $$  \\ $$  | $$  | $$  \\ $$| $$      \n'+
        '|  $$ / $$/| $$  | $$| $$      | $$  | $$$$$$$$  | $$  | $$$$$$$/| $$$$$   \n'+
        ' \\  $$ $$/ | $$  | $$| $$      | $$  | $$__  $$  | $$  | $$__  $$| $$__/   \n'+
        '  \\  $$$/  | $$  | $$| $$      | $$  | $$  | $$  | $$  | $$  \\ $$| $$      \n'+
        '   \\  $/   |  $$$$$$/| $$$$$$$$| $$  | $$  | $$ /$$$$$$| $$  | $$| $$$$$$$$\n'+
        '    \\_/     \\______/ |________/|__/  |__/  |__/|______/|__/  |__/|________/\n'+
        '\x1b[0m\n'+

        'Apres insertion d\'une phrase plusieurs résultats vont apparaitre,\n'+
        'ils disposeront d\'un niveau de couleur parmis ceux ci-dessous :\n'+
        '    - \x1b[1m\x1b[31mrouge\x1b[0m : \x1b[1m50% a 60%\x1b[0m de correspondance, a n\'utiliser qu\'en cas extreme, peut etre fausse\n'+
        '    - \x1b[1m\x1b[33mjaune\x1b[0m : \x1b[1m60% a 70%\x1b[0m de correspondace, des indices mais pas parfait\n'+
        '    - \x1b[1m\x1b[32mvert \x1b[0m : plus de \x1b[1m70%\x1b[0m de correspondance, sans doute la bonne réponse.\n\n'+

        '\x1b[1m\x1b[31mSélectionnez votre niveau :\x1b[0m\n'+
        '   \x1b[1m1\x1b[0m - Orthographe \n'+
        '   \x1b[1m2\x1b[0m - Vocabulaire \n'+
        '   \x1b[1m3\x1b[0m - Syntaxe & Ponctuation\n\n'
    );

    await prompt.get(['type']).then( async (r, e) => {
        if ( r.type == '1' ){
            Orthographe();
        } else if ( r.type == '2' ){
            Vocabulaire();
        } else if ( r.type == '3' ){
            Syntaxe();
        }
    })
}
main()
