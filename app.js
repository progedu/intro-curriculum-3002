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
  const rankingStrings = rankingArray.map(([key, value],i) => {
    return (i + 1 )+ '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);

  const assert = require('assert');
  assert.equal(rankingStrings[0], '1位 岩手県: 64637=>57619 変化率:0.8914244163559571', `1位は岩手県でしたが、実際は${rankingStrings[0] }でした`);
  assert.equal(rankingStrings[9], '10位 島根県: 32899=>30642 変化率:0.9313960910665978', `10位は島根県でしたが、実際は${rankingStrings[0] }でした`);
  console.log('すべてのテストを通過しました');

});