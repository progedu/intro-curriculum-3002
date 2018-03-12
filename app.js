'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
<<<<<<< HEAD

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = columns[0];
    const prefecture = columns[2];
    const popu = columns[7];
    if (year === '2010' || year === '2015') {
=======
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const colums = lineString.split(',');
    const year = parseInt(colums[0]);
    const prefecture = colums[2];
    const popu = parseInt(colums[7]);
    if (year === 2010 || year === 2015) {
>>>>>>> 7b85eabf7250be5d78f4b5fbafd8a6e79c3049a5
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
<<<<<<< HEAD
        if (year === '2010') {
            value.popu10 += parseInt(popu);
        }
        if (year === '2015') {
            value.popu15 += parseInt(popu);
=======
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
>>>>>>> 7b85eabf7250be5d78f4b5fbafd8a6e79c3049a5
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
<<<<<<< HEAD
    // TODO 減った割合のランキングにして順位も一緒に出力するようにしてください
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
=======
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((pair, i) => {
        return (i + 1)+ '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});

>>>>>>> 7b85eabf7250be5d78f4b5fbafd8a6e79c3049a5
