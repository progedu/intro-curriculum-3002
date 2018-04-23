'use strict';
// node.js で用意されたモジュールの呼び出し
const fs = require('fs');
const readline = require('readline');

// csvファイルからstreamを作成
const rs = fs.ReadStream('./popu-pref.csv');
// rsをinputに設定し、rlオブジェクトを作成
const rl = readline.createInterface({'input':rs,'output':{}});

// 要素を格納する連想配列を作成
const map = new Map(); // key : 都道府県 value : 集計データのオブジェクト

// rlオブジェクトにlineというイベントが発生したら実行される関数
rl.on('line',(lineString) => {

    // csvの配列作成
    const colums = lineString.split(',');

    // 各要素切り出し
    const year = parseInt(colums[0]);
    const prefecture = colums[2];
    const popu = parseInt(colums[7]);

    if (year == 2010 || year == 2015) {

        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu10:0,
                popu15:0,
                change:null
            };
        }
        if (year==2010) {
            value.popu10 += popu;
        }
        if (year==2015) {
            value.popu15 += popu;
        }
        map.set(prefecture,value);
    }

    // 読み込んだ1行分のデータを出力
    //console.log(lineString);
}
);
rl.resume();
// 全てのreadlineが読み終わったタイミングで出力
rl.on('close',() => {
    for(let pair of map){
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }

    // Arrayオブジェクト：配列構成のためのグローバルオブジェクト
    // Array.from 新規オブジェクトを作成
    // sortの仕方=比較関数
    // 正負、0で並び替え順を操作
    // 変化率が大きい=2015の方が大きい
    // 2015-2010=正。正の場合、pair2を前にする
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    // 復習：アロー関数＝functionを省略した書き方
    // 今回のmapはmap関数→Arrayの各要素を指定した関数を実行した形に変換
    // mapの取得した各要素を引数：pairとして受け取っている
    const rankingStrings = rankingArray.map((pair,e) => {
        return e + 1 + '位 ' + pair[0] + ':' + pair[1].popu10 + '=>' + pair[1].popu15 + '変化率：' + pair[1].change;
    });

    console.log(rankingStrings);
});
