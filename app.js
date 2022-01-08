'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = columns[0];
    const prefecture = columns[2];
    const popu = columns[7];
    if (year === '2010' || year === '2015') {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === '2010') {
            value.popu10 += parseInt(popu);
        }
        if (year === '2015') {
            value.popu15 += parseInt(popu);
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingString = rankingArray.map((pair, ranking) => {
        ranking ++;
        return ranking + '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingString);
});
