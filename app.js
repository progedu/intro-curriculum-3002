'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output':{}});
const map = new Map(); //key: 都道府県, value: 集計データのオブジェクト

rl.on('line', (lineString) => 
{
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    if (year === 2010 || year === 2015) 
    {
        let value = map.get(prefecture);
        if (!value)
        {
            value = 
            {
                popu10: 0, 
                popu15: 0, 
                change: null
            };
        }  
        if (year === 2010) value.popu10 += popu;
        if (year === 2015) value.popu15 += popu;

        map.set(prefecture, value);
    }
});

rl.resume();
rl.on('close', () => 
{
    for (const pair of map) 
    {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;        
    }

    //降順に並び替え
    /*
    pair2[1] - pair1[1] > 0ならpair2 -> pair1に
    pair2[1] - pair1[1] < 0ならpair1 -> pair2に
    pair2[1] - pair1[1] = 0ならそのまま

    Array.from(map)で配列として呼び出し(pair[0] = 都道府県, pair[1] = value)
    */
    const rankingArray = Array.from(map).sort((pair1, pair2) => 
    {
        return (pair2[1].change - pair1[1].change) * (-1);
    });

    const rankingStrings = rankingArray.map((pair, i) => 
    {
        return (i+1) + '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + '変化率: ' + pair[1].change;
    });

    console.log(rankingStrings);
});

