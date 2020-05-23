'use strict';
const fs = require('fs');
const readline = require('readline');
//読み込みストリーム作成
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 
  //読み込みたいストリームの設定
  input: rs, 
  //書き込みたいストリームの設定｛｝は空欄と言う意味
  output: [] });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    //if(!value)=valueがFalsy（その県のデータを処理するのが２回目だと下にあるsetメソッドでデータが入るため　Falsyにならない）
    if (!value) {
      value = {
        //とりあえず　０，null をいれてるだけ。あとから数値を入れ直す。
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
//終わるまで繰り返す↑
rl.on('close', () => {
  //prefectureDataMapのmapの中身の県名を　keyに、データを　value　に代入
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  //pairはある一つの行を示す
  //array from は、mapをkeyとvalueの対を配列とし、その配列を要素にした配列（ペア配列の配列）にへんかんする。
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
  //pair[0]が県名(key)、pair[1]が各集計オブジェクト(value)を指す（普通の配列になったから番号で呼び出すものを指定する）
    return pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value],i) => {
    return  (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});