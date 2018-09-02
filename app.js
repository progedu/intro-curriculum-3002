'use strict';
const fs = require('fs');    /fsはFileSystem　ファイルを扱うためのモジュール/
const readline = require('readline');   /readlineはファイルを1行ずつ読むためのモジュール/
const rs = fs.ReadStream('./popu-pref.csv');  /ファイルの読み込みを行うStreamを作成/
const rl = readline.createInterface({ 'input':rs, 'output': {} });//
const prefectureDataMap = new Map(); /key:都道府県 value:集計データのオブジェクト/
rl.on('line', (lineString) => {     /rl オブジェクトで line というイベントが発生したらこの無名関数を呼んでください、という意味/
    const columns = lineString.split(','); /lineStringで与えられた文字列をカンマで分割してcolumnsという配列にしている/
    const year = parseInt(columns[0]); /parseIntは文字列を整数値に変換する/
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 += popu;
        }
        if (year === 2015){
            value.popu15 += popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.resume();/resumuメソッドはストリームに情報を流し始める処理/
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change ;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});
