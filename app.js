'use strict';
const fs = require('fs');                                            //fs関数呼び出し
const readline = require('readline');                              //readline関数呼び出し
const rs = fs.ReadStream('./popu-pref.csv');                        //ReadStreamでcsvをストリーム形式で読み込み
const rl = readline.createInterface({'input': rs, 'output': {} });  //createInterface関数でcsv
const map = new Map();                                               // key: 都道府県 value: 集計データのオブジェクト   

rl.on('line',(lineString) =>{                                       //イベント種類line（1行読み込んだら）が実行されるごとに無名関数(linestrings)を実行
                                                                  //.on（イベント種類,実行関数）はあるイベントが起こったらある関数を実行するという書き方
    const columns = lineString.split(',');                         //split(条件)関数ある文字列を条件にしたがって配列（リスト変数）に変換してくれる関数                               
    const year = parseInt(columns[0]);                              //parseInt() は、文字列を整数値に変換する関数(つまり多言語で言う型変換、jsは型は指定しない言語なので、変数は文字なのか、数値なのか、オブジェクトなのか意識が必要)。csvから読み取ったばかりだと全て文字列扱いになる
    const prefecture = columns[2];                                  //配列2番めの件名を変数に代入
    const popu = parseInt(columns[7]);                              //15~19歳の人口
                                                          
    if(year === 2010 ||year === 2015){    
           let value = map.get(prefecture);
           if(!value){
               value= {
                   popu10:0,
                   popu15:0,
                   change:null
               };
           }
           if(year ===2010){
               value.popu10 +=popu;
           }
           if(year ===2015){
               value.popu15 += popu;
           }    
           map.set(prefecture,value);                               //{都道府県,{popu10,popu15,change}}と言うリストを作る     
    }
});
rl.resume();
rl.on('close',() => {                                               //全ての行を読み込み終わった際.on('close',() =>
    for (let pair of map){
        const value = pair[1];
        value.change = value.popu15/value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1,pair2)=>{      //オブジェクトArrayが持っている関数from()を実行（引数はmap配列）し、
        return pair1[1].change-pair2[1].change 
    });
    let i;
    const rankingStrings = rankingArray.map((pair,i) => {
        return i+1+pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });

    console.log(rankingStrings);
});                                                    //rl.onを実行