'use strict';
//ライブラリを読み込みをするrequire。 node.jsに標準で入ってる、fs＝ﾌｧｲﾙｼｽﾃﾑﾓｼﾞｭｰﾙ、readline＝ﾘｰﾄﾞﾗｲﾝﾓｼﾞｭｰﾙ
//モジュール読み込む際は、文字列として''で指定すること。
const fs = require('fs');
//どんな風に読むのか。全部読めてから処理するのか、一行ずつなのか。
//csvは改行も区切りとして意味がある。だから一行ずつデータを読んでいくと綺麗に読み込めるし早いので、それ用のモジュールを使う
const readline = require('readline');
//読み込めるような状態にする
const rs = fs.createReadStream('./popu-pref.csv');
//読み込める状態になったものを、一行ずつ読んでいく
const rl = readline.createInterface({ 'input':rs, 'output': {} });
//非同期なNode.jsだといつ読めるかわからない。
//'line'とは一行読めたら以下の関数を実行してくださいという処理
//onとはイベント検知をするメソッド
rl.on('line', (lineString) => {
    //console.log(lineString);
    //↑のコードを実行する。①データをちゃんと読めたかどうかの確認。
});

//凄く早いけど、1行ずつ出てるのが確認できる。
//Node.jsはファイルを読み込むのに、結構コード書かなきゃいけない。


//↑の処理で一行ずつ読めた。だが、そのデータ一行そのものはまだ文字列としてくっついてる状態。
//csvはデータをカンマで区切ってあるので、それを分ける事で、数字データや文字列データとして抜き出していきたい。
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
//readlineﾓｼﾞｭｰﾙon、lineの中の無名関数の中に記述
rl.on('line', (lineString) => {
    //columnsとは列という意味で名づけ。0番目columnが年、1番目が県、3番目が15~19歳の人口
    //lineStringは文字列のこと。.split関数は「文字列を配列に変換してくれる」どこを区切りにするかを(',')で設定　練習.txt参照
    const columns = lineString.split(',');
    //配列のcolumn0,1,3だとわかりづらいので、わかりやすく変数名に一旦入れていく。年＝year　県＝prefecture  popuは人口
    const year = parseInt(columns[0]);　
    //parseInt関数とは:2010年や人口数は数値で取ってきたいのに、まだ文字列データのまま。それだと足し算等の計算ができず、文字列連結になってしまう。それを数値に変換してくれる。Number関数も同じ働き。
    const prefecture = columns[1];　//数字が2,7になってた為NaNで出力される。修正
    const popu = parseInt(columns[3]);
    //2010年と2015年の時だけ計算してね、というif文。基本はやる必要ないかと思うが、csvの一番上の行にタイトルが入ってるのでそれをはじかせるため。
    if (year === 2010 || year === 2015) {
        //console.log(year);
        //console.log(prefecture);
        //console.log(popu);
        //↑②1行をそれぞれの列を別データとして読めてるか確認。
        //連想配列とオブジェクト練習.txt参照　わかりにくいが一行ずつ読んでいくのがポイント！
        //↑のif文、最初は2010年のデータしか取れない。そうするとまだ変化率は出せないのでまずは一旦データを貯めておく処理をする。
        //↓都道府県のデータを取ってくる。
        let value = prefectureDataMap.get(prefecture);
            //ここからnew Map();に対しての中身を作っていく段階
        　　//都道府県のデータが無かったら、という事で一応形だけオブジェクトを作る。
        if (!value) {
            //↓オブジェクトの作り方は一章参照　https://www.nnn.ed.nico/courses/497/chapters/6888
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };//←ココは代入だからセミコロンを付けること。
        }
        //読み取った行が、2010だったらvalueオブジェクトのpopu10に数値データを入れる。（定数popuは↑で設定済）
        if (year === 2010) {
            value.popu10 = popu;
        }
        //読み取った行が、2015だったらvalueオブジェクトのpopu15に数値データを入れる。（定数popuは↑で設定済）
        if (year === 2015) {
            value.popu15 = popu;
        }
        //そして一旦その連想配列データとして、全ての都道府県名：prefecture, 全ての集計データオブジェクト:value を入れて、set:登録する。
        //まだこの段階では変化率は出ない。
        prefectureDataMap.set(prefecture, value);
    }
});
//ファイル全てが読み終わった、という意味を持つ　closeイベント
rl.on('close', () => {　//特にデータは要らないので空の引数＝無名関数で実行する。
    //console.log(prefectureDataMap);
    //③各都道府県別で、連想配列オブジェクトとして出力できるかどうか確認
    //↓③ができたら、for-of構文を使って、valueの２つの値を計算させる。練習.txt参照
    //key,valuetと書いているが、実際使っているのはvalueだけ。ここでは一応紹介として出す。
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    //console.log(prefectureDataMap);
    //④変化率がそれぞれ出力されるかどうかを確認。
    //並び変えのためにsort関数を使いたいが、連想配列のままではできないので、prefectureDataMapを普通の配列に戻してから.sort
    //前の値：pair1　と　後ろの値:pair2 とする。
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        //pair2：後ろのデータの、配列1番＝オブジェクトの、変化率が、前のデータよりも大きかったら、入れ替え
        return pair1[1].change - pair2[1].change;　//降順という意味
    });
    //console.log(rankingArray);　//⑤ただの配列になったが、こちらが並び変えた後の出力を確認。
    //map関数を利用して、オブジェクトから、ランキングを表しているような文字列を作ることができる。練習.txt参照
    const rankingStrings = rankingArray.map(([key, value], rank) => {
                                            //↑値は都道府県名も入っているから、keyも使う オブジェクトrank追加
        return '第' + (rank + 1) + '位:　' + key + '：' + value.popu10 + '=>' + value.popu15 + '　変化率：' + value.change;
    });             //添え字は0はじまりのため+1
    console.log(rankingStrings);
});

