'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    prefectureDataMap.forEach((val) => val.change = val.popu15 / val.popu10);
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => pair1[1].change - pair2[1].change);
    const rankingStrings = rankingArray.map(([key, val], idx) => (idx + 1) + "位  " + key + ': ' + val.popu10 + '=>' + val.popu15 + ' 変化率:' + val.change);
    console.log(rankingStrings);
});