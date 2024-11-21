function loadTestPalettes(){
    const fs = require('fs');

    fs.readFile('src/assets/testPalettes.json', 'utf8', (err, data) => {
        if(err) {
            console.log('Error loading palettes.', err); 
            return;
        }

        const jsonData = JSON.parse(data);
    });

    return jsonData.palettes;
}