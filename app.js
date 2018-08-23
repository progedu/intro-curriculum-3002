'use strict';
// モジュールを呼び出す
const fs = require('fs');
const readline = require('readline');
// csv ファイルから Stream を生成
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
// 1 行読み込むたびに関数を実行
rl.on('line', (line) => {
    // データを種類毎に分ける
    const columns = line.split(',');
    const year = parseInt(columns[0], 10);
    const prefecture = columns[2];
    const popu = parseInt(columns[7], 10);
    if (year === 2010 || year === 2015) {
        // 年が 2010 もしくは 2015 の時にこの中の処理を実行
        let value = map.get(prefecture); // 現在の都道府県のデータを map から取得
        // データが無ければ新しく作る
        if (!value) {
            value = {
                popu10: 0, // 2010 年の人口
                popu15: 0, // 2015 年の人口
                change: null // 人口の変化率
            };
        }
        // 2010 年と 2015 年のそれぞれの人口を合計
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);// 都道府県のデータを map に設定
    }
});
rl.resume(); // Stream に情報を流し始める
// 全ての行を読み込み終わった後に関数を実行
rl.on('close', () => {
    // map の中身を順番に keyAndValue に移しながらループ
    for (let keyAndValue of map) { // keyAndValue の添え字 0 にキー、1 に値が入っている
        const value = keyAndValue[1];
        value.change = value.popu15 / value.popu10; // 人口の変化率を代入
    }
    // 人口が増えた順に入れ替える
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    // 見た目を分かりやすくする
    const rankingStrings = rankingArray.map((keyAndValue, key) => { // keyAndValue の添え字 0 にキー、1 に値が入っている
        const rank = key + 1;
        return '第' + rank + '位 ' + keyAndValue[0] + ': ' + keyAndValue[1].popu10 + ' => ' + keyAndValue[1].popu15 + ' 変化率: ' + keyAndValue[1].change;
    });
    console.log('人口が減った割合ランキング');
    console.log(rankingStrings); // ランキングを表示
});
