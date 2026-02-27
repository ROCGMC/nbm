// 使用 CDN 引入 Firebase 模組
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 你提供的設定資訊
const firebaseConfig = {
  apiKey: "AIzaSyCjjfEnkLeaRXZsFPVxjwDWxz1IqbOBN7A",
  authDomain: "nbms-3dc57.firebaseapp.com",
  projectId: "nbms-3dc57",
  storageBucket: "nbms-3dc57.firebasestorage.app",
  messagingSenderId: "495363300459",
  appId: "1:495363300459:web:5494e7f2d37c8a12e0252e",
  measurementId: "G-8VHTY3E28B"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const guessesRef = ref(db, 'game/guesses');

// 玩家 ID (隨機產生一個簡單的 ID)
const myId = Math.random().toString(36).substring(7);

// 監聽遠端資料變化
onValue(guessesRef, (snapshot) => {
    const data = snapshot.val();
    updateUI(data);
});

// 定義送出函數 (掛載到 window 確保 HTML 能呼叫)
window.sendGuess = function() {
    const input = document.getElementById('guessInput');
    const val = input.value;
    
    if (!val) return;

    // 將資料推送到 Firebase
    push(guessesRef, {
        player: myId,
        number: parseInt(val),
        time: Date.now()
    });

    input.value = ''; // 清空輸入框
};

// 更新畫面
function updateUI(data) {
    const list = document.getElementById('history');
    const status = document.getElementById('status');
    list.innerHTML = '';
    
    if (!data) {
        status.innerText = "等待第一個玩家猜測...";
        return;
    }

    status.innerText = "連線中 - 即時對戰中";

    // 將資料轉成陣列並按時間倒序排列
    const entries = Object.values(data).sort((a, b) => b.time - a.time);
    
    entries.forEach(guess => {
        const li = document.createElement('li');
        li.className = 'guess-item';
        li.innerHTML = `<strong>玩家 ${guess.player}</strong> 猜了： <span>${guess.number}</span>`;
        list.appendChild(li);
    });
}
