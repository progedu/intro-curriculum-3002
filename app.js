'use strict';
// Node用のモジュールの呼び出し（fs）
// fsは、ファイルを扱うためのモジュール
const fs = require('fs');
// Node用のモジュールの呼び出し（readline）
// readlineは、ファイルを1行ずつ読み込むためのモジュール
const readline = require('readline');
// csvファイルからファイルの読み込みを行うStreamを生成→readlineオブジェクトのinputとして設定し、rlオブジェクトを作成している。
// Node.jsでは、入出力が発生する処理をほとんどStreamという形で扱う。イベント駆動型プログラミング。
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // // 集計されたデータを格納する連想配列。key: 都道府県 value: 集計データのオブジェクト
// rlオブジェクトでlineというイベントが発生したタイミングでコンソールに引数lineStringの内容が出力。※このlineStringには読み込んだ1行の文字列が入っている。
rl.on('line', (lineString) => {
    // 引数lineStringで与えられた文字列をカンマで分割、それをcolumsという配列にしている。["集計年","都道府県名","10〜14歳の人口","15〜19歳の人口"]
    const colums = lineString.split(',');
    // 配列columsの要素へ並び順の番号でアクセスし、集計年（0番目）、都道府県（1番目）、15〜19歳の人口（3番目）をそれぞれ変数に保存。
    // parseInt()は、文字列を整数列に変換する関数。
    const year = parseInt(colums[0]);
    const prefecture = colums[1];
    const popu = parseInt(colums[3]);
    if (year === 2010 || year === 2015) {
        // 連想配列 prefectureDataMapからデータを取得。
        let value = prefectureDataMap.get(prefecture);
        // valueがFalsyの場合にはvalueに初期値のオブジェクトを代入。
        if (!value) {
            value = {
                // オブジェクトのプロパティ popu10 が2010年の人口変化率を表すプロパティ
                // オブジェクトのプロパティ popu15 が2015年の人口変化率を表すプロパティ
                // change が人口の変化率を表すプロパティ。初期値ではnullを代入しておく。
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
    // 人口のデータを連想配列に保存。→次から同じ県のデータが来れば、let value = prefectureDataMap.get(prefecture); で保存したオブジェクトが取得される。
    if (year === 2010) {
        value.popu10 = popu;
    }
    if (year === 2015) {
        value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
    }
});
// closeイベントはすべての行の読み込みが終わった後に呼び出される。
// その際の処理は、各県各年男女のデータが集計されたMapのオブジェクトを出力。
rl.on('close', () => {
    // for-of文：MapやArrayの中身をofの前に与えられた変数に代入してforループと同じことができる。
    // キーと値で要素が2つある配列が前に与えられた変数に代入される：分割代入
    // closeイベントの無名関数を実装。
    for (let [key, value] of prefectureDataMap) {
        // 変化率：valueオブジェクトのchangeプロパティに変化率を代入するコード
        value.change = value.popu15 / value.popu10;
    }
    // 1. Array fromで連想配列を通常の配列にする処理。 2. Arrayのsort関数を読んで無名関数を渡す。※sortに対して渡す関数は比較関数。並び替えをするルールを決められる。
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        // return pair2[1].change - pair1[1].change;
        return pair1[1].change - pair2[1].change;
    });
    // map関数：Arrayの要素それぞれを与えられた関数を適用した内容に変換するもの。（マッピングの関数）
    // map関数の第2引数を記述することで要素の添字を取得できる。
    const rankingStrings = rankingArray.map(([key, value], i) => {
        return (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率：' + value.change;
    });
    console.log(rankingStrings);
});