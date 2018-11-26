'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県, value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const population_15_to_19 = parseInt(columns[7]);
    
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                population_2010_age_15_to_19: 0,
                population_2015_age_15_to_19: 0,
                change: null
            };
        }
        if( year === 2010) {
            value.population_2010_age_15_to_19 += population_15_to_19;
        }
        if( year === 2015) {
            value.population_2015_age_15_to_19 += population_15_to_19;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

rl.resume();

rl.on('close', () => {
    for( let [key, value] of prefectureDataMap) {
        value.change = value.population_2015_age_15_to_19 / value.population_2010_age_15_to_19;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map( ([key, value], rank_number) => {
        return "減少率" + (rank_number + 1) + "位：" + key + "(変化率 = " + value.change + "): " + value.population_2010_age_15_to_19 + ' => ' + value.population_2015_age_15_to_19;
    });
    console.log(rankingStrings);
});