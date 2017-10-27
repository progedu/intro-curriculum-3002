'use strict';

//Node.jsのモジュ fsファイルを扱う,readlineファイルを一行ずつ読み込む
const fs=require('fs');
const readline=require('readline');
//ファイルを読み込みを行う Stream を生成
const rs = fs.ReadStream('./popu-pref.csv');
//readlineオブジェクトのinputとして設定し、rlオブジェクトを作成
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();   // key: 都道府県 value: 集計データのオブジェクト

//rlオブジェクトで line というイベントが発生したらこの無名関数を呼んでください
rl.on('line', (lineString) => {
    //引数 lineString で与えられた文字列をカンマ , で分割してそれを columns という配列に
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);  //parseInt():文字列を整数値に変換する関数
    const prefecture =columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);

    }
});

//ストリームに情報を流し始める処理
rl.resume();

//rlオブジェクトで lineというイベントが発生したらコンソールに出力
rl.on('close', () => {
    for (let pair of map) { // of の前に与えられた変数に代入 mapからpairに代入ループ
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair2, pair1) => {
        return pair2[1].change - pair1[1].change;
    });

    //連想配列のMapとは別のものの map関数が使われる
    const rankingStrings = rankingArray.map((pair, i) => {
        return (i+1) + ' : ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
