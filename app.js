'use strict';
const fs = require('fs'); // 外部ファイルを読み込むオブジェクトを呼び出し
const readline = require('readline'); // 1行ごと読むオブジェクトを呼び出し
const rs = fs.ReadStream('./popu-pref.csv'); // 外部ファイルをストリーミングで読む
const rl = readline.createInterface( // ストリームファイルをセット
  { 'input': rs, 
    'output': {} 
  });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => { // 読み込んだファイルを一行ごとに関数実行
    const columns = lineString.split(','); // 文字列を,で分割して配列に格納
    const year = parseInt(columns[0]); // 年度を数値にする
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture); // 連想配列からデータを取ってくる
        if (!value) { // データがない場合に初期化
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu; // オブジェクトに2010年度人口データを入れる
        }
        if (year === 2015) {
            value.popu15 += popu; // オブジェクトに2015年度人口データを入れる
        }
        prefectureDataMap.set(prefecture, value); // 都道府県をkeyにしてvalueオブジェクトを格納
    }
});
rl.on('close', () => { // 処理を終了した際に関数実行
  for (let [key, value] of prefectureDataMap) { 
      value.change = value.popu15 / value.popu10; // オブジェクトvalueのchangeに変化率を入れる
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair1[1].change - pair2[1].change; // 変化率でソートをかける
  });
  const rankingStrings = rankingArray.map(([key, value],i) => { // 新しい配列を作る
      return  '☆第' + (i+1) + '位☆ ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});
