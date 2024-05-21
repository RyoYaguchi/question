function main() {
	g.game.pushScene(start1());
}
//start画面
function start1() {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["takezou", "player", "se", "iku"]
	});
	scene.onLoad.add(() => {
		//フォント設定
		const object = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 40
		});
		//ルール一行
		const rule = new g.Label({
			scene: scene,
			font: object,
			text: "鍵を拾ってから出る",
			fontSize: 30,
			textColor: "blue",
			x: 0,
			y: 0
		});
		const rule2 = new g.Label({
			scene: scene,
			font: object,
			text: "←接触で敗北",
			fontSize: 30,
			textColor: "blue",
			x: 40,
			y: 50
		});
		scene.append(rule);
		scene.append(rule2);
		var x = 0
		var y = 60
		const enemy = createenemy(scene, x, y);
		scene.append(enemy);
		var x = 200
		var y = 200
		const takezo = createtakezou(scene, x, y);
		scene.append(takezo);
		const rule3 = new g.Label({
			scene: scene,
			font: object,
			text: "↓!Click This Takezou!↓",
			fontSize: 30,
			textColor: "red",
			x: 70,
			y: 150
		});
		scene.append(rule3);
		takezo.touchable = true;
		takezo.onPointDown.add(() => {
			scene.asset.getAudioById("iku").play();
			g.game.pushScene(game());
			takezo.modified();
		})
	});
	return scene;
}//↑start画面

//↓メイン画面
function game() {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["takezou", "player", "se", "iku"]

	});
	scene.onLoad.add(() => {
		//ここから鍵その他用のフォント設定
		const object = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 40
		});
		//ここまで鍵用のフォント設定
		//エンティティ作る
		var x = 230
		var y = 300
		const takezou = createtakezou(scene, x, y);
		scene.append(takezou);
		takezou.touchable = true;

		//enemyランダム位置テスト
		//Math.floor()=少数切り捨て g.game.random.generate()=0~1の乱数生成 *XでX未満の乱数になるはず
		
		var x = Math.floor(g.game.random.generate() * g.game.width);
		var y = Math.floor(g.game.random.generate() * g.game.height);
		const enemy = createenemy(scene, x, y);
		if (enemy.y>=g.game.height-100){
			enemy.y=(enemy.y-100)}
		scene.append(enemy); //この処理はenemy一斉につくるfunctionでまとめたほうがええね
		//ここまでenemyランダム位置テスト
		
		//縦enemy
		var x = Math.floor(g.game.random.generate() * g.game.width);
		var y = Math.floor(g.game.random.generate() * g.game.height);
		const tateenemy = createtateenemy(scene, x, y);
		if (tateenemy.y>=g.game.height-100){
			tateenemy.y=(tateenemy.y-100)}
		scene.append(tateenemy)
		//ここまで縦enemy
		

		//creategoal
		const goal = new g.Label({
			scene: scene,
			font: object,
			text: "出",
			fontSize: 50,
			textColor: "blue",
			x: 450,
			y: 0
		});
		scene.append(goal);

		//cratekey functionにまとめたいんだけど
		const key = new g.Label({
			scene: scene,
			font: object,
			text: "鍵",
			fontSize: 50,
			textColor: "red",
			x: 250,
			y: 0
		});
		scene.append(key);
		var keyflg = false

		//enemy移動用
		moveenemy(enemy);
		movetateenemy(tateenemy);
		//takezou操作用 		
		takezou.onPointMove.add((ev) => {
			takezou.x += ev.prevDelta.x;
			takezou.y += ev.prevDelta.y;
			takezou.modified();
		});

		//takezouとenemyの接触判定および接触の際の処理
		takezou.onUpdate.add(() => {
			var ret = g.Collision.intersectAreas(takezou, enemy);
			if (ret) {
				scene.asset.getAudioById("iku").play();
				g.game.replaceScene(gameover());
				// 衝突している場合
				//イクーしてゲームオーバー
			} else {
				// 衝突しなかった場合
			}
		});
		//takezouとkey
		key.onUpdate.add(() => {
			var takekey = g.Collision.intersectAreas(takezou, key);
			if (takekey) {
				// 衝突している場合
				keyflg = true
				scene.asset.getAudioById("se").play();
				key.destroy();
				//音鳴ってkeyflag =trueとkeyのエンティティdestroy
			} else {
				// 衝突しなかった場合

			}
		});
		//takezouとgoal
		goal.onUpdate.add(() => {
			var takekey = g.Collision.intersectAreas(takezou, goal);
			if (takekey) {
				// 衝突している場合
				if (keyflg = true) {
					scene.asset.getAudioById("iku").play();
					g.game.replaceScene(gameclear());
					//鍵ある場合
				}
				else {
					//鍵ない場合
				}

			} else {
				// 衝突しなかった場合
			}
		});
		//↑goal処理
	//secカウント
	let sec=5;
		let secT = new g.Label({
			scene: scene,
			font: object,
			text: `${sec}`,
			fontSize: 50,
			textColor: "blue",
			x: 0,
			y: 500
		});
		scene.append(secT);
	
	scene.setInterval(function() {
//		if(sec==0){scene.asset.getAudioById("iku").play();
//			g.game.replaceScene(gameover());	}
//	else if(sec<0) {
		let sec="unko"
//		}
				secT.text =`${sec}`
				secT.modified(scene);
}, 1000);
	//ここまでsecカウント
	
	});//scene onload
	return scene;
	
}//↑game function

function createtakezou(scene, x, y) {
	return new g.Sprite({
		scene: scene,
		src: scene.asset.getImageById("takezou"),
		x: x,
		y: y,
		scaleX: 0.4,
		scaleY: 0.4,
	});
	
}

//ここから
function createenemy(scene, x, y) {
	return new g.Sprite({
		scene: scene,
		src: scene.asset.getImageById("player"),
		x: x,
		y: y,
		scaleX: 0.4,
		scaleY: 0.4
	});
}

function createtateenemy(scene, x, y) {
	return new g.Sprite({
		scene: scene,
		src: scene.asset.getImageById("player"),
		x: x,
		y: y,
		scaleX: 0.4,
		scaleY: 0.4
	});
}

//ここまでenemyを生成するコード

//ここからenemy moove
function moveenemy(enemy) {
	var flg = false
	enemy.onUpdate.add(() => {
		if (enemy.x == 0) {
			flg = false
		}

		if (enemy.x >= g.game.width / 4) {
			flg = true
		}
		if (flg == false) {
			++enemy.x;
			enemy.modified();
		}
		else if (flg == true) {
			--enemy.x;
			enemy.modified();
		}
		
	});
}
//
//
function movetateenemy(tateenemy) {
	var tateflg = false
	tateenemy.onUpdate.add(() => {
		if (tateenemy.y == 0) {
			tateflg = false
		}

		if (tateenemy.y >= g.game.height / 4) {
			tateflg = true
		}
		if (tateflg == false) {
			++tateenemy.y;
			tateenemy.modified();
		}
		else if (tateflg == true) {
			--tateenemy.y;
			tateenemy.modified();
		}
	});
}
//tate

//timetick
// function timetick(scene){}

//gameover
function gameover() {
	const scene = new g.Scene({ game: g.game });
	const font = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 15
	});
	const gameover = new g.Label({
		scene: scene,
		font: font,
		text: "いきました……",
		fontSize: 15,
		textColor: "blue",
		x: 10,
		y: 20
	});
	scene.append(gameover);
	return scene;
}//gameover func

function gameclear() {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["takezou", "player", "se", "iku"]
	});
	const font = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 15
	});
	const gameclear = new g.Label({
		scene: scene,
		font: font,
		text: "いきました!!",
		fontSize: 15,
		textColor: "blue",
		x: 10,
		y: 20
	});
	const stop = new g.Label({
		scene: scene,
		font: font,
		text: "クリックでいかなくする(うるさい場合)",
		fontSize: 15,
		textColor: "red",
		x: 300,
		y: 300
	});
	scene.setInterval(function() {
		scene.asset.getAudioById("iku").play();
	}, 1000);

	scene.append(gameclear)
	scene.append(stop)
	stop.touchable = true;

	stop.onPointDown.add(() => {
		var stage = 1;
		g.game.pushScene(start1());
	})
	return scene;
}
module.exports = main;
