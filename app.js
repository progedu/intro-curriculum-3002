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
  for (let [key, value] of prefectureDataMap) { 
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value], index) => {
    //変化率を百分率に変換、小数点以下2ケタまで。100%以上と未満で切り出し桁数を切り替え
    const changePercent = value.change >= 1 ? String(value.change * 100).slice(0, 6) + '%' : String(value.change * 100).slice(0, 5) + '%'
    //人口の数値はnumber.toLocaleStringで3ケタ区切りに
    //String.padStartとString.padEndでコラム位置を揃えて見やすく
    return String(index + 1).padStart(2) + '位:' + String(key).padEnd(4, '　') +
      ': ' + value.popu10.toLocaleString('ja-JP').padStart(7) + ' => ' + value.popu15.toLocaleString('ja-JP').padStart(7) +
      ' 変化率:' + changePercent.padStart(8);
  });
  console.log(rankingStrings);
});