'use strict';
const readline1 = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
let answ = 0
readline1.question('表示したい年代に対応する数字を入力してください。[1]:0〜4歳, [2]:5〜9歳, [3]:10〜14歳, [4]:15〜19歳, [5]:20〜24歳, [6]:25〜29歳, [7]:30〜34歳,[8]: 35〜39歳, [9]:40〜44歳, [10]:45〜49歳, [11]:50〜54歳, [12]:55〜59歳, [13]:60〜64歳, [14]:65〜69歳, [15]:70〜74歳, [16]:75〜79歳, [17]:80〜84歳, [18]:85〜89歳, [19]:90歳以上', (answer) => {
  const answ = parseInt(answer) + 3
  readline1.question('表示方法を選んでください。[1]: 昇順, [2]: 降順', (answer) => {
    const ans = parseInt(answer)
    const fs = require('fs');
    const readline = require('readline');
    const rs = fs.ReadStream('./popu-pref.csv');
    const rl = readline.createInterface({ 'input': rs, 'output': {} });
    const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
    rl.on('line', (line) => {
      const columns = line.split(',');
      const year = columns[0];
      const prefecture = columns[2];
      const popu = columns[answ];
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
        if (ans === 1) {
          return pair1[1].change - pair2[1].change;
        } else if (ans === 2) {
          return pair2[1].change - pair1[1].change;
        }
      });
      const rankingStrings = rankingArray.map(([key, value], i) => {
          return (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
      });
      console.log(rankingStrings);
    });
    readline1.close();
  });
});