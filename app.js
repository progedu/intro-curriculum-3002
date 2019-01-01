'use strict';

// read libraries
const fs = require('fs');
const readline = require('readline');

// create stream to read a file
const rs = fs.ReadStream('./popu-pref.csv');
// create a readline object and set it as input
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();

// read lines one by one
rl.on('line', (lineString) => {
    let lineArray = lineString.split(',');
    let year = parseInt(lineArray[0]);
    let prefecture = lineArray[2];
    let popu = parseInt(lineArray[7]);
    let value = map.get(prefecture);

    if(!value){
        value = {
            popu10: 0,
            popu15: 0,
            change: 0
        };
    }else if(year === 2010){
        value.popu10 += popu;
    }else if(year === 2015){
        value.popu15 += popu;
    }
    if (value.popu10 != 0 && value.popu15 != 0){
        value.change = value.popu15 / value.popu10;
    }
    map.set(prefecture, value);
});
rl.resume();
rl.on('close', () => {
    /* sort data
    map data example '鹿児島県' => { popu10: 84977, popu15: 77730, change: 0.9147181001918167 },
    array convertd data example [ '沖縄県',
    { popu10: 83477, popu15: 81426, change: 0.9754303580627 } ] ]
    */
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    // add ranking
    for (let i = 0; i < rankingArray.length; i ++){
        rankingArray[i][1].ranking = i;
    }
    const rankingString = rankingArray.map((pair, i) => {
        return "ランキング: " + i + ", " + pair[0] + ": " + pair[1].popu10 
            + "=> " + pair[1].popu15 + ", 変化率: " + pair[1].change;
    });
    console.log(rankingString);
});
