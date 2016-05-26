(function () {
	'use strict';
	let fs = require('fs');
	let readline = require('readline');
	let rs = fs.ReadStream('./popu-pref.csv');
	let rl = readline.createInterface({ 'input': rs, 'output': {} });
	
	let map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
	rl.on('line', (line) => {
		let columns = line.split(',');
		let year = columns[0];
		let prefecture = columns[2];
		let popu = columns[7];
		if (year === '2010' || year === '2015') {
			let value = map.get(prefecture);
			if (!value) {
				value = {
					p10: 0,
					p15: 0,
					change: null
				};
			}
			if (year === '2010') {
				value.p10 += parseInt(popu);
			}
			if (year === '2015') {
				value.p15 += parseInt(popu);
			}
			map.set(prefecture, value);
		}
	});
	rl.resume();
	rl.on('close', () => {
		for (let pair of map) {
			let value = pair[1];
			value.change = value.p15 / value.p10;
		}
		// TODO 順位も一緒に出力するようにしてください
		let rankingArray = Array.from(map).sort((p1, p2) => {
			return p1[1].change - p2[1].change;
		});
		let rankingStrings = rankingArray.map((p, i) => {
			return (i+1) + '位 ' + p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change;
		});
		console.log(rankingStrings);
	});
})();
