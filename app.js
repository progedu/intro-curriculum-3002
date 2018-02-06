'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); // 連想配列。key: 都道府県 value: 集計データのオブジェクト(10年人口、15年人口、変化率の3つ)

rl.on('line', (lineString) => {
    const colums = lineString.split(',');
    const year = parseInt(colums[0]);
    const prefecture = colums[2];
    const popu = parseInt(colums[7]);

    if (year === 2010 || year === 2015){

        let value = map.get(prefecture);
        
        //その県のデータを処理するのが初めてであれば、value の値は undefined になるので、
        //value の値は Falsy となり、value に初期値が代入される。
        if (!value) {
            value = {
                popu10 : 0,
                popu15 : 0,
                change : null
            };
        }

        if (year === 2010) {
            value.popu10 += popu;　//+=は代入演算子。a+=b aにbを足して、aに代入する
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        //連想配列に保存
        map.set(prefecture, value);
    }
});
rl.resume();
//'close' イベントは、全ての行を読み込み終わった際に呼び出される。
//変化率の計算(データが揃ったあとでしか正しく行えないので、close イベントの中へ実装)
rl.on('close', () => {
    //for-of 構文。Map の中身を of の前に与えられた変数に代入して for ループ。
    //配列に含まれる要素を使いたいだけで、添字は不要な場合に便利
    for (let pair of map) {
        //mapの集計データのオブジェクト(10年人口、15年人口、変化率の3つ)をvalueに代入
        const value = pair[1];
        //オブジェクトのうち変化率に計算結果を代入
        value.change = value.popu15 / value.popu10;
    }
    //並べ替え
    //Array.from(map) で、連想配列を普通の配列に変換->sort 関数を呼んで比較関数に2つの引数を渡す
    //①＞②=正->①を前に、①＝②＝0->並びを変えない。①＜②＝負->②を前にする。降順はpair2-pair1、昇順は逆。
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    //きれいに出力
    //ここに出てくる map は連想配列の Map とは別の「map 関数」。Array の各要素に関数を適用し変換する
    const rankingStrings = rankingArray.map((pair , i) => {
        return '減少率第' + (i+1) + '位== ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});