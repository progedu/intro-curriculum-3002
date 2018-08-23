'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = parseInt(columns[0], 10);
    const prefecture = columns[2];
    const popu = parseInt(columns[7], 10);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let keyAndValue of map) { // keyAndValue の添え字 0 にキー、1 に値が入っている
        const value = keyAndValue[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((keyAndValue, key) => { // keyAndValue の添え字 0 にキー、1 に値が入っている
        const rank = key + 1;
        return '第' + rank + '位 ' + keyAndValue[0] + ': ' + keyAndValue[1].popu10 + '=>' + keyAndValue[1].popu15 + ' 変化率:' + keyAndValue[1].change;
    });
    console.log('人口が減った割合ランキング');
    console.log(rankingStrings);
});
