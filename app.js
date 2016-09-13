'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (line) => {
    const columns = line.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                p10: 0,
                p15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.p10 += popu;  // value.p10 = value.p10 + popu と同じ意味
        }
        if (year === 2015) {
            value.p15 += popu;  // データが男と女で分かれてるから足し合わせる処理
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.p15 / value.p10;
    }

    const rankingArray = Array.from(map).sort((p1, p2) => {
        return p1[1].change - p2[1].change;
    });
    const rankingStrings = rankingArray.map((p, i) => {

//  出力が読みやすくなるように，頑張って整形してみました!

        const prefecture = p[0];
        if (prefecture !== '鹿児島県' && prefecture !== '和歌山県' && prefecture !== '神奈川県' ){
            p[0] = ( prefecture + '　' ) ; // ３文字の都道府県は全角スペースをつける
        }

        if (p[1].p10 < 100000){
            p[1].p10 = (' ' + p[1].p10);    // 人口が 5ケタなら 先頭にスペースを追加
        }
        
        if (p[1].p15 < 100000){
            p[1].p15 = (' ' + p[1].p15);
        }

        if ((i + 1) < 10){      // ランキングの順位が 10位未満ならスペースをはさむ。まぁ i < 9 なんだけど。
            return '第 ' + (i + 1) + '位  ' + p[0] + ': ' + p[1].p10 + ' => ' + p[1].p15 + ' 変化率:' + p[1].change;
        } else {
            return '第' + (i + 1) + '位  ' + p[0] + ': ' + p[1].p10 + ' => ' + p[1].p15 + ' 変化率:' + p[1].change;
            }
    });

//   rl.resume();   // close もイベントなら先に書いても動くよね？　と思ってやってみた痕跡。　ちゃんと動いた。

    console.log(rankingStrings);    
});