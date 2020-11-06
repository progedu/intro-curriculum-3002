'use strict';

const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });

const prefectureData =  new Map();
rl.on('line', (lineString) => {
  const split = lineString.split(',');
  let year = parseInt(split[0]);
  let prefecture = split[1];
  let popu = parseInt(split[3])
  
  if (year === 2010 || year ===  2015) {
    let value = prefectureData.get(prefecture);
    if(!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      }
    };
    if(year===2010) {
      value.popu10 = popu;
    }
    if(year===2015) {
      value.popu15 = popu;
    }
    prefectureData.set(prefecture, value)
  }
  // console.log(prefectureData)
})
rl.on('close', () => {
  for(let [key, val] of prefectureData) {
    val.change = val.popu15 / val.popu10
  }
  // console.log(prefectureData);
  const rankingArray = Array.from(prefectureData).sort((n, m) => {
    return n[1].change - m[1].change;
  }) 
  const ranking = rankingArray.map(([key, val], i) => {
    return (
      `${i+1}位 ${key}: ${val.popu10} => ${val.popu15} 変化率: ${val.change}`
    )
  })
  console.log('減少率の順位');
  console.log(ranking);
})