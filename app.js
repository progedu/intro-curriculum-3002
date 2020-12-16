'use strict'; //JS strict mode


const fs = require('fs') ; //fs = File System
const readline = require('readline') ; // ファイルを１行ずつ読み込むモジュール
const rs = fs.createReadStream('./popu-pref.csv') ; 
const rl = readline.createInterface({input: rs, output: {} }) ; 
const prefectureDataMap = new Map() ; 

rl.on('line' , lineString => { //lineが発生したら
    const columns = lineString.split(',') ;
    const year = parseInt(columns[0]) ;
    const prefecture = columns[1] ; 
    const popu = parseInt(columns[3]) ;

    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture) ; //prefecture から値を取得
        if(!value){ //もしvalueがnullなら
            value = {
                popu10 : 0 ,
                popu15 : 0 ,
                change : null 
            };
        }
        if(year === 2010){
            value.popu10 = popu ;
        }
        if( year ===2015){
            value.popu15 = popu ;
        }

        prefectureDataMap.set(prefecture , value ) ; 

    }
}) ;

rl.on('close' , () =>{//rl closeしたら出力
    for( let [key , value] of prefectureDataMap){//valueの中のkeyについてのループ
        value.change = value.popu15/value.popu10 ; 
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1 , pair2) => {//map -> array変換
        return -pair2[1].change + pair1[1].change ; 
    }) ; 
    let index = 0 ; 
    const rankingStrings = rankingArray.map(([key, value]) => {
        
        index = index + 1 ; 
        return (
            index + '位' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
        );
        
    });
    console.log(rankingStrings);

}) ; 
