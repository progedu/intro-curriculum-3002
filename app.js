'use strict';
//node.jsに用意されたモジュールを呼び出す
const fs = require('fs');//fs = FileSystem ファイルを扱うためのモジュール
const readline = require('readline'); //leadine ファイルを一行ずつ読み込むためのモジュール
const rs = fs.ReadStream('./popu-pref.csv');　//./popu-pref.csvからファイルの読み込みを行うStreamを生成
const rl = readline.createInterface({'input':rs, 'output': {} });//feadlineオブジェクトのinputとして設定して、rlオブジェクトを生成
const map = new Map(); //key: 都道府県 value:集計データのオブジェクト　集計されたデータを格納する連想配列
rl.on('line', (lineString) => {　//rlオブジェクトでlineというイベントが発生したらこの無名関数を呼び出す
	const colums = lineString.split(','); //引数lineStringで与えられた文字列をカンマで分割して、それをcolumsという配列にする。lineString.split()は、文字列を対象とした関数なので、結果も文字列。
	const year = parseInt(colums[0]); //配列columsの要素へ並び順の番号でアクセスして、集計年、都道府県、15〜19歳の人口、をそえぞれ変数に保存している。perseIntは文字列を整数値に変換する関数
	const prefecture = colums[2];
	const popu = parseInt(colums[7]);
	if (year === 2010 || year === 2015) {
		let value = map.get(prefecture);
		if (!value) {
			value = {
				popu10: 0, //2010年の人口
				popu15: 0, //2015年の人口
				change: null //人口の変化率
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
rl.resume(); //resumeメソッドの呼び出しはストリームに情報を流し始める処理です
rl.on('close', () => {
	for (let pair of map) { //for-of 構文といいます。Map や Array の中身を of の前に与えられた変数に代入して for ループと同じことができます。
		const value = pair[1];
		value.change = value.popu15 / value.popu10;
	}
	const rankingArray = Array.from(map).sort((pair1, pair2) => { //Array.from(map) の部分で、連想配列を普通の配列に変換する処理をおこなう
		return pair1[1].change - pair2[1].change;
	});
	const rankingStrings = rankingArray.map((pair, i) => {
		return (i + 1) + '位' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
	});
	console.log(rankingStrings);
});
