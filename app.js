'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
let gumma;
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
        change: null,
        likeGumma:null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      if (prefecture === '群馬県'){
        gumma = popu;
      }
      value.popu15 = popu;
    }

    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) { 
    value.change = Math.abs(value.popu15 - gumma)
    if(value.change === 0){
      value.likeGumma = '群馬';
    }else if(value.change < 10000){
      value.likeGumma = 'ほぼ群馬';
    }else if(value.change < 20000){
      value.likeGumma = 'まだ群馬';
    }else if(value.change < 30000){
      value.likeGumma = 'ギリ群馬';
    }else{
      value.likeGumma = '群馬ではない';
    }
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value],i) => {
    return `${i}位　${key}:2015年${value.popu15} 群馬との差:${value.change} (${value.likeGumma})`;
  });
  console.log(rankingStrings);
});