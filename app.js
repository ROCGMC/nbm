// Firebase 設定 (需從 Firebase Console 取得)
const firebaseConfig = { /* 貼上你的配置 */ };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 監聽遠端資料變化
db.ref('game/guesses').on('value', (snapshot) => {
    const data = snapshot.val();
    updateUI(data); // 更新畫面的函式
});

function sendGuess() {
    const val = document.getElementById('guessInput').value;
    db.ref('game/guesses').push({
        player: crypto.randomUUID().slice(0,4),
        number: val,
        time: Date.now()
    });
}
