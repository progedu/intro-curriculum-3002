'use strict';
// イベント駆動型プログラミング
const fs = require('fs'); // FileSystem、ファイルを扱うモジュール
const readline = require('readline'); // ファイルを一行ずつ読み込むためのモジュール
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => { // lineStringは文字列の意味、つまりここで文字列を出力している
    const columns = lineString.split(','); // 文字列をカンマで区切って配列にする
    const year = parseInt(columns[0]); // 文字列を数値として扱えるようにparseInt関数を使用
    const prefecture = columns[1];
    const popu = parseInt(columns[3]); // 文字列を数値として扱えるようにparseInt関数を使用
    if (year === 2010 || year === 2015) { // 2010年と2015年のデータのみ表示（最初の行は非表示）
      let value = prefectureDataMap.get(prefecture);
      if (!value) { // データが取得できなかったら以下のオブジェクトにデータを入れる
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
    for (let [key,value] of prefectureDataMap) {
      value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
      return pair1[1].change - pair2[1].change;
    });
    const rankingString = rankingArray.map(([key,value],i) => {
        // return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
        return `${i + 1}位 ${key}: ${value.popu10} -> ${value.popu15} 変化率: ${value.change}`;
    });
    console.log(rankingString);
  });