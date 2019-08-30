/**
 * 10〜19 歳の人が減った割合の都道府県ランキング
 */
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
    const popuU14 = parseInt(columns[2]);
    const popuU19 = parseInt(columns[3]);
    const popu = popuU14 + popuU19;
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popuY10: 0,
                popuY15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popuY10 = popu;
        }
        if (year === 2015) {
            value.popuY15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = ((value.popuY15 / value.popuY10) * 100).toFixed(2);
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return `${i + 1}位. ${key}: ${value.popuY10}=>${value.popuY15} 変化率: ${value.change}%`;
    });
    console.log(rankingStrings);
});