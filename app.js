'use strict';
// require は、Node.js のモジュールを呼び出し
const fs = require('fs'); // fs はファイルシステムを扱うモジュール
const readline = require('readline'); // readline はファイルを一行ずつ読み込むモジュール
const rs = fs.createReadStream('./popu-pref.csv');
// createReadStream でファイル読み込みを行うStream生成

const rl = readline.createInterface({ input: rs, output: {} });
// 上のStream を、readline オブジェクトの入力として、rl オブジェクトを作成？

const prefdata_map = new Map();

rl.on('line', lineString => {   //line イベント発生時に以下を発動
  const pop_array = lineString.split(',');
  const year = parseInt(pop_array[0]);
  const pref = pop_array[1]
  const pop_num = parseInt(pop_array[3]);

  if (year === 2010 || year === 2015) {
    let value = prefdata_map.get(pref);
    if (!value) {
      value = {
        pop10: 0,
        pop15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.pop10 = pop_num;
    }
    if (year === 2015) {
      value.pop15 = pop_num;
    }
    prefdata_map.set(pref, value);
  }
});



rl.on('close', () => {
  for (let [key, value] of prefdata_map) {
    value.change = value.pop15 / value.pop10;
  }
  const ranking_array = Array.from(prefdata_map).sort((pair1, pair2) => { // 2つの引数の大小でsort
    return -pair2[1].change + pair1[1].change;
  })
  // 以下は単なる配列の整形だが、ここでmap関数（Mapの各要素に作用）を利用
  const ranking_strings = ranking_array.map(([key, value],i) => {
    return (' 第'+(i+1)+'位' + key + ':' + value.pop10 + '=>' + value.pop15 + '変化:' + value.change);
  });
  console.log(ranking_strings);
});