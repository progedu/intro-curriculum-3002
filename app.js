'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output':{}});
const prefectureDataMap = new Map(); //key:都道府県 value:集計データのオブジェクト
rl.on('line',(lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
      let value = prefectureDataMap.get(prefecture);
      if(!value){
          value = {
              popu10: 0,
              popu15: 0,
              change: null
          };
        }
      if(year === 2010){
          value.popu10 = popu;
      }
      if(year === 2015){
          value.popu15 = popu;
      }
      prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) { 
        value.change = Math.floor(value.popu15 / value.popu10 * 1000)/10 ; 
        
        //　変化率を％表示にするためにMath.floor(小数点切り捨て)を使用。 
        //　()で先に*1000をする事で整数の値をだし、最後に/10で小数点第一位までの変化率の％を出した。
        // 計算というよりは工夫して小数点％を出した形になる。小数第何位まで求めたいかによって値を変えればいい。

    　　}
      const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
      });

      const rankingStrings = rankingArray.map(([key, value],i ) => {
        return `${i+1} 位 ${key}: ${value.popu10} -> ${value.popu15} 変化率: ${value.change} %`;
    });
      console.log(rankingStrings);
    });