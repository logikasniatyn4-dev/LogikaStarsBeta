let coins = 0;
let cups = 0;
let gems = 5;
let level = 1;
let hp = 100;
let enemyHp = 100;
let maxEnemyHp = 100;
let enemyDamage = 20;
let totalEnemies = 2;
let currentEnemyIndex = 1;
let position = 20;
let busy = false;
let ninja = false;
let selectedCharacter = "🤠";
let selectedName = "Ковбой";
const enemyTypes = ["👾", "🤖", "👹", "🧟", "👽"];

function update() {
    const lvlEl = document.getElementById("level");
    if (lvlEl) lvlEl.textContent = level;
    
    const menuLvl = document.getElementById("menuLevel");
    if (menuLvl) menuLvl.textContent = level;
    
    const arenaLvl = document.getElementById("arenaLevel");
    if (arenaLvl) arenaLvl.textContent = level;
    
    const prog = document.getElementById("enemyProgress");
    if (prog) prog.textContent = `${currentEnemyIndex}/${totalEnemies}`;
    
    const coinsEl = document.getElementById("coins");
    if (coinsEl) coinsEl.textContent = coins;
    
    const cupsEl = document.getElementById("cups");
    if (cupsEl) cupsEl.textContent = cups;
    
    const gemsEl = document.getElementById("gems");
    if (gemsEl) gemsEl.textContent = gems;
    
    const hpEl = document.getElementById("hp");
    if (hpEl) hpEl.textContent = hp;
    
    const enemyHpEl = document.getElementById("enemyHp");
    if (enemyHpEl) enemyHpEl.textContent = enemyHp;
    
    const myBar = document.getElementById("myHealthBar");
    if (myBar) myBar.style.width = hp + "%";
    
    const enemyBar = document.getElementById("enemyHealthBar");
    if (enemyBar) {
        const enemyPercent = maxEnemyHp > 0 ? Math.max(0, (enemyHp / maxEnemyHp) * 100) : 0;
        enemyBar.style.width = enemyPercent + "%";
    }
    
    const attBtn = document.getElementById("attackBtn");
    if (attBtn) attBtn.disabled = busy || hp <= 0 || enemyHp <= 0;
    
    const healBtn = document.getElementById("healBtn");
    if (healBtn) healBtn.disabled = busy || hp <= 0 || hp >= 100;
}

function hideAll() {
    ["menu", "game", "store", "heroes"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
}

function notify(message) {
    const box = document.getElementById("notification");
    if (!box) return;
    box.textContent = message;
    box.style.display = "block";
    clearTimeout(window.notifyTimer);
    window.notifyTimer = setTimeout(() => {
        box.style.display = "none";
    }, 1800);
}

function spawnEnemy() {
    const enemyEl = document.getElementById("enemy");
    if (!enemyEl) return;
    const randomIcon = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    maxEnemyHp = 75 + (level - 1) * 15 + (currentEnemyIndex - 1) * 15;
    enemyHp = maxEnemyHp;
    enemyDamage = 15 + Math.min(20, (level - 1) * 3);
    enemyEl.textContent = randomIcon;
    
    const iconLabel = document.getElementById("enemyIconLabel");
    if (iconLabel) iconLabel.textContent = randomIcon;
    
    enemyEl.style.display = "block";
    enemyEl.classList.remove("enemy-spawn");
    void enemyEl.offsetWidth;
    enemyEl.classList.add("enemy-spawn");
}

function startGame() {
    hideAll();
    const gamePanel = document.getElementById("game");
    if (gamePanel) gamePanel.classList.remove("hidden");
    
    hp = 100;
    position = 20;
    busy = false;
    totalEnemies = level === 1 ? 2 : (Math.random() < 0.5 ? 2 : 3);
    currentEnemyIndex = 1;
    
    const playerEl = document.getElementById("player");
    if (playerEl) {
        playerEl.textContent = selectedCharacter;
        playerEl.style.left = "20%";
        playerEl.style.filter = "none";
    }
    
    const playerLabel = document.getElementById("playerIconLabel");
    if (playerLabel) playerLabel.textContent = selectedCharacter;
    
    spawnEnemy();
    
    const msg = document.getElementById("message");
    if (msg) msg.textContent = `Рівень ${level}! Ворогів на арені: ${totalEnemies}. Бйся!`;
    
    update();
}

function attack() {
    if (busy || hp <= 0 || enemyHp <= 0) return;
    busy = true;
    update();
    const arena = document.getElementById("arena");
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    if (!arena || !player || !enemy) return;
    
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    const startX = player.offsetLeft;
    const startY = player.offsetTop;
    bullet.style.left = startX + "px";
    bullet.style.top = startY + "px";
    arena.appendChild(bullet);
    const endX = enemy.offsetLeft;
    const endY = enemy.offsetTop;
    bullet.animate([
        { left: startX + "px", top: startY + "px" },
        { left: endX + "px", top: endY + "px" }
    ], {
        duration: 400,
        easing: "linear",
        fill: "forwards"
    });
    player.classList.add("player-shake");
    setTimeout(() => {
        player.classList.remove("player-shake");
    }, 300);
    
    const msg = document.getElementById("message");
    if (msg) msg.textContent = "🔫 ПОСТРІЛ!";
    
    setTimeout(() => {
        bullet.remove();
        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.textContent = "💥";
        explosion.style.left = endX + "px";
        explosion.style.top = endY + "px";
        arena.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
        
        const playerDamage = selectedName === "Ніндзя" ? 35 : 25;
        enemyHp = Math.max(0, enemyHp - playerDamage);
        
        enemy.animate([
            { transform: "translate(-50%, -50%) scale(1)" },
            { transform: "translate(-50%, -50%) scale(1.4)" },
            { transform: "translate(-50%, -50%) scale(1)" }
        ], { duration: 250 });
        
        update();
        
        if (enemyHp <= 0) {
            if (currentEnemyIndex < totalEnemies) {
                if (msg) msg.textContent = `💥 Ворог ${currentEnemyIndex} знищений! З'являється наступний...`;
                enemy.style.display = "none";
                setTimeout(() => {
                    currentEnemyIndex++;
                    spawnEnemy();
                    busy = false;
                    if (msg) msg.textContent = `⚠️ Ворог ${currentEnemyIndex} із ${totalEnemies} виходить на арену!`;
                    update();
                }, 800);
            } else {
                busy = false;
                win();
            }
            return;
        }
        
        if (msg) msg.textContent = "💥 Влучне попадання!";
        setTimeout(() => {
            if (enemyHp > 0) {
                hp = Math.max(0, hp - enemyDamage);
            }
            if (hp <= 0 && msg) {
                msg.textContent = "💀 ТИ ПРОГРАВ! Спробуй ще раз!";
            }
            busy = false;
            update();
        }, 400);
    }, 400);
}

function win() {
    const rewardCoins = 30 + (level - 1) * 10;
    const rewardCups = 8 + (level - 1) * 2;
    coins += rewardCoins;
    cups += rewardCups;
    level++;
    
    const msg = document.getElementById("message");
    if (msg) msg.textContent = `🏆 РІВЕНЬ ПРОЙДЕНО! +${rewardCoins} 🪙 і +${rewardCups} 🏆!`;
    
    const enemy = document.getElementById("enemy");
    if (enemy) enemy.style.display = "none";
    
    update();
    notify(`⭐ ПЕРЕМОГА! Рівень ${level-1} пройдено!`);
}

function heal() {
    if (hp <= 0 || busy || hp >= 100) return;
    hp = Math.min(100, hp + 25);
    const arena = document.getElementById("arena");
    const player = document.getElementById("player");
    if (!arena || !player) return;
    
    const effect = document.createElement("div");
    effect.className = "heal-effect";
    effect.textContent = "💚 +25 ❤️";
    effect.style.left = position + "%";
    arena.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
    
    player.style.filter = "drop-shadow(0 0 20px #00ff55)";
    setTimeout(() => {
        player.style.filter = "none";
    }, 1000);
    
    const msg = document.getElementById("message");
    if (msg) msg.textContent = "💚 ТИ ВИЛІКУВАВСЯ!";
    update();
}

function move(dir) {
    if (hp <= 0 || busy) return;
    position = Math.max(10, Math.min(45, position + dir * 5));
    const player = document.getElementById("player");
    if (player) player.style.left = position + "%";
}

function shop() {
    hideAll();
    const store = document.getElementById("store");
    if (store) store.classList.add("hidden"); // Вправлено на видалення класу hidden
    store.classList.remove("hidden");
}

function buyHealth() {
    if (coins < 50) {
        notify("❌ Недостатньо монет!");
        return;
    }
    coins -= 50;
    hp = 100;
    update();
    notify("❤️ Здоров'я відновлено!");
}

function buyGems() {
    if (coins < 100) {
        notify("❌ Недостатньо монет!");
        return;
    }
    coins -= 100;
    gems += 2;
    update();
    notify("💎 +2 КРИСТАЛИ!");
}

function showHeroes() {
    hideAll();
    const heroes = document.getElementById("heroes");
    if (heroes) heroes.classList.remove("hidden");
}

function buyNinja() {
    if (ninja) {
        notify("🥷 Ніндзя вже твій!");
        return;
    }
    if (gems < 10) {
        notify("❌ Потрібно 10 кристалів!");
        return;
    }
    gems -= 10;
    ninja = true;
    update();
    notify("🥷 НІНДЗЯ РОЗБЛОКОВАНИЙ!");
}

function selectHero(character, name) {
    if (name === "Ніндзя" && !ninja) {
        notify("Спочатку розблокуй Ніндзю!");
        return;
    }
    selectedCharacter = character;
    selectedName = name;
    
    const menuChar = document.getElementById("menuCharacter");
    if (menuChar) menuChar.textContent = character;
    
    const menuHeroName = document.getElementById("menuHeroName");
    if (menuHeroName) menuHeroName.textContent = name;
    
    notify("⭐ Вибрано: " + name);
}

function back() {
    busy = false;
    hideAll();
    const menu = document.getElementById("menu");
    if (menu) menu.classList.remove("hidden");
    update();
}

update();
