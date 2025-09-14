// =======================
// بيانات اللاعب
// =======================
let player = {
  name: "Guest",
  gold: 50,
  food: 30,
  mana: 0,
  wins: 0,
  soldiers: 0,
  knights: 0,
  mages: 0,
  cannons: 0,
  archers: 0,
  navy: 0,
  skeleton: 0,
  spearman: 0,
  thief: 0,
  assassin: 0,
  healer: 0,
  cavalryArcher: 0,
  golem: 0,
  necromancer: 0,
  ballista: 0,
  giant: 0,
  ninja: 0,
  paladin: 0,
  phoenix: 0,
  dragon: 0,
  titan: 0,
  buildings: {
    goldMine: 1,
    farm: 1,
    mageTower: 1,
    barracks: 1,
    archery: 1,
    dock: 1,
    blacksmith: 1,
    workshop: 1,
    library: 1
  },
  heroes: {}
};

let isGuest = false;

// =======================
// تسجيل دخول / تسجيل
// =======================
function login() {
  const username = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const stored = localStorage.getItem("player_" + username);
  if (!stored) { alert("هذا المستخدم غير موجود!"); return; }
  const data = JSON.parse(stored);
  if (data.password !== password) { alert("كلمة المرور خاطئة!"); return; }
  player = data.player;
  player.name = username;
  isGuest = false;
  startGame();
}

function signup() {
  const username = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) { alert("يرجى إدخال اسم مستخدم وكلمة مرور!"); return; }
  if (localStorage.getItem("player_" + username)) { alert("هذا المستخدم موجود بالفعل!"); return; }
  localStorage.setItem("player_" + username, JSON.stringify({ password, player }));
  player.name = username;
  isGuest = false;
  startGame();
}

function playAsGuest() {
  isGuest = true;
  player.name = "Guest" + Math.floor(Math.random() * 1000);
  startGame();
}

function logout() { location.reload(); }

// =======================
// شاشة اللعبة
// =======================
function startGame() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("player-name").innerText = player.name;
  updateUI();
  setInterval(generateResources, 3000);
  loadLeaderboard();
}

// =======================
// تحديث واجهة اللعبة
// =======================
function updateUI() {
  document.getElementById("gold").innerText = player.gold;
  document.getElementById("food").innerText = player.food;
  document.getElementById("mana").innerText = player.mana;

  const units = ["skeleton","spearman","soldier","thief","archer","assassin","knight","healer","mage",
                 "cavalryArcher","golem","necromancer","cannon","ballista","giant","ninja","navy",
                 "paladin","phoenix","dragon","titan"];

  const unitsData = {
    skeleton: {gold:10,food:5,mana:0},
    spearman: {gold:20,food:10,mana:0},
    soldier: {gold:50,food:30,mana:0},
    thief: {gold:30,food:20,mana:0},
    archer: {gold:70,food:90,mana:0},
    assassin: {gold:80,food:60,mana:0},
    knight: {gold:60,food:40,mana:0},
    healer: {gold:50,food:0,mana:50},
    mage: {gold:70,food:50,mana:0},
    cavalryArcher: {gold:100,food:80,mana:0},
    golem: {gold:120,food:100,mana:0},
    necromancer: {gold:150,food:0,mana:120},
    cannon: {gold:80,food:60,mana:0},
    ballista: {gold:200,food:150,mana:0},
    giant: {gold:250,food:200,mana:0},
    ninja: {gold:180,food:100,mana:0},
    navy: {gold:100,food:80,mana:0},
    paladin: {gold:300,food:200,mana:100},
    phoenix: {gold:400,food:0,mana:250},
    dragon: {gold:500,food:300,mana:200},
    titan: {gold:500,food:500,mana:300}
  };

  // تحديث أزرار الوحدات
  units.forEach(u => {
    const btn = document.querySelector(#actions button[onclick*="${u}"]);
    if(btn){
      const data = unitsData[u];
      btn.textContent = ${u} (ذهب: ${data.gold}, طعام: ${data.food}, مانا: ${data.mana});
    }
    const el = document.getElementById(u);
    if(el) el.innerText = player[u] || 0;
  });

  // تحديث أزرار المباني مع السعر الحالي
  const buildingsCost = { 
    goldMine: 50, farm: 40, mageTower: 60, barracks: 70, archery: 50, dock: 80,
    blacksmith: 90, workshop: 100, library: 120
  };
  for (let b in player.buildings) {
    const btn = document.querySelector(#buildings button[onclick*="${b}"]);
    const cost = buildingsCost[b] * player.buildings[b];
    if(btn) btn.textContent = ${b} (ترقية: ${cost} ذهب);
  }
}

// =======================
// الموارد والجيش
// =======================
function generateResources() {
  player.gold += 5 + player.buildings.goldMine;
  player.food += 3 + player.buildings.farm;
  player.mana += 2 + player.buildings.mageTower;

  player.soldiers += player.buildings.barracks;
  player.archers += player.buildings.archery;
  player.navy += player.buildings.dock;
  player.gold += player.buildings.blacksmith * 2;
  player.food += player.buildings.workshop * 2;
  player.mana += player.buildings.library * 3;

  updateUI();
  saveProgress();
}

// =======================
// تدريب الوحدات
// =======================
function trainUnit(name){
  const unitsData = {
    skeleton: {gold:10,food:5,mana:0},
    spearman: {gold:20,food:10,mana:0},
    soldier: {gold:50,food:30,mana:0},
    thief: {gold:30,food:20,mana:0},
    archer: {gold:70,food:90,mana:0},
    assassin: {gold:80,food:60,mana:0},
    knight: {gold:60,food:40,mana:0},
    healer: {gold:50,food:0,mana:50},
    mage: {gold:70,food:50,mana:0},
    cavalryArcher: {gold:100,food:80,mana:0},
    golem: {gold:120,food:100,mana:0},
    necromancer: {gold:150,food:0,mana:120},
    cannon: {gold:80,food:60,mana:0},
    ballista: {gold:200,food:150,mana:0},
    giant: {gold:250,food:200,mana:0},
    ninja: {gold:180,food:100,mana:0},
    navy: {gold:100,food:80,mana:0},
    paladin: {gold:300,food:200,mana:100},
    phoenix: {gold:400,food:0,mana:250},
    dragon: {gold:500,food:300,mana:200},
    titan: {gold:500,food:500,mana:300}
  };
  const unit = unitsData[name];
  if(player.gold>=unit.gold && player.food>=unit.food && player.mana>=unit.mana){
    player.gold-=unit.gold; player.food-=unit.food; player.mana-=unit.mana;
    player[name] = (player[name] || 0)+1;
    updateUI(); saveProgress(); updateLeaderboard();
  } else alert("ليس لديك موارد كافية!");
}

// =======================
// هجوم على العدو
// =======================
function attackEnemy() {
  const power = player.soldiers*2 + player.knights*5 + player.mages*7 + player.cannons*10 + player.archers*4 + player.navy*8;
  const enemy = Math.floor(Math.random()*50);
  if(power>enemy){ 
    alert("انتصار! قوة العدو: "+enemy); 
    player.wins++; player.gold+=10; player.food+=5; player.mana+=5; 
  }
  else{ 
    alert("هزيمة... قوة العدو: "+enemy); 
    player.soldiers=Math.max(0,player.soldiers-Math.floor(Math.random()*2)); 
    player.knights=Math.max(0,player.knights-Math.floor(Math.random()*1)); 
  }
  updateUI(); saveProgress(); updateLeaderboard();
}

// =======================
// السوق
// =======================
function buyGold(){ if(player.food>=20){player.food-=20;player.gold+=10; updateUI(); saveProgress();} else alert("طعام غير كافي!"); }
function sellGold(){ if(player.gold>=10){player.gold-=10;player.food+=15; updateUI(); saveProgress();} else alert("ذهب غير كافي!"); }
function buyMana(){ if(player.gold>=30){player.gold-=30;player.mana+=20; updateUI(); saveProgress();} else alert("ذهب غير كافي!"); }
function sellMana(){ if(player.mana>=20){player.mana-=20;player.gold+=25; updateUI(); saveProgress();} else alert("مانا غير كافي!"); }

// =======================
// المباني
// =======================
function upgradeBuilding(name){
  const baseCost = { 
    goldMine:50, farm:40, mageTower:60, barracks:70, archery:50, dock:80,
    blacksmith:90, workshop:100, library:120
  };
  const cost = baseCost[name]*player.buildings[name];
  if(player.gold>=cost){ player.gold-=cost; player.buildings[name]++; updateUI(); saveProgress(); updateLeaderboard(); }
  else alert("ذهب غير كافي للترقية!");
}

// =======================
// الأبطال
// =======================
function unlockHero(name){
  const cost = {arthur:1000,merlin:1500,lancelot:2000,morgana:3000};
  if(player.gold>=cost[name] && !player.heroes[name]){ player.gold-=cost[name]; player.heroes[name]=true; updateUI(); saveProgress(); alert(name+" تم فتحه!"); updateLeaderboard(); }
  else alert("لا يمكنك فتح هذا البطل!");
}

// =======================
// التعاويذ
// =======================
function castFireball(){ if(player.mana>=150){player.mana-=150; alert("Fireball أطلقت على العدو!"); updateUI(); saveProgress(); updateLeaderboard();} else alert("مانا غير كافي!"); }
function castHeal(){ if(player.mana>=80){player.mana-=80; player.soldiers+=2; player.knights+=1; updateUI(); saveProgress(); alert("تم الشفاء!"); updateLeaderboard(); } else alert("مانا غير كافي!"); }
function castBoost(){ if(player.mana>=250){player.mana-=250; player.soldiers+=3; updateUI(); saveProgress(); alert("Boost نشط!"); updateLeaderboard(); } else alert("مانا غير كافي!"); }

// =======================
// حفظ/تحميل التقدم
// =======================
function saveProgress(){
  if(isGuest){ localStorage.setItem('guestPlayer',JSON.stringify(player)); }
  else { 
    localStorage.setItem("player_"+player.name,JSON.stringify({ password: (localStorage.getItem("player_"+player.name)? JSON.parse(localStorage.getItem("player_"+player.name)).password:""), player }));
  }
}

// =======================
// لوحة الصدارة من السيرفر
// =======================
async function updateLeaderboard() {
  if(isGuest) return; // الزائر لا يخزن على السيرفر

  try {
    // إرسال بيانات اللاعب الحالي لتحديثه على السيرفر
    await fetch("http://localhost:5000/update", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username: player.name, data: player })
    });

    // جلب أعلى 10 لاعبين من السيرفر
    const res = await fetch("http://localhost:5000/leaderboard");
    const lb = await res.json();

    // تحديث واجهة الـ leaderboard
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    lb.forEach(p => {
      const li = document.createElement("li");
      li.textContent = ${p.name}: ${p.wins} انتصار;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("خطأ في جلب اللوحة:", err);
  }
}

async function loadLeaderboard() {
  await updateLeaderboard();
}
// =======================
// جلب اللاعبين للهجوم عليهم
// =======================
async function showPlayersForAttack() {
  if(isGuest){ 
    document.getElementById("attack-players").innerHTML = "<p>الزائر لا يمكنه الهجوم على لاعبين آخرين.</p>";
    return; 
  }
  try {
    const res = await fetch("http://localhost:5000/leaderboard");
    const lb = await res.json();
    const listDiv = document.getElementById("attack-players");
    listDiv.innerHTML = ""; // مسح السابق
    lb.forEach(p => {
      if(p.name !== player.name){ 
        const btn = document.createElement("button");
        btn.textContent = هاجم ${p.name};
        btn.className = "red";
        btn.onclick = ()=>attackEnemy(p.name);
        listDiv.appendChild(btn);
      }
    });
  } catch(err){
    console.error("خطأ في جلب اللاعبين:", err);
    document.getElementById("attack-players").innerHTML = "<p>خطأ في جلب اللاعبين.</p>";
  }
}

// =======================
// الهجوم على لاعب محدد عبر السيرفر
// =======================
async function attackEnemy(defenderName){
  if(isGuest){ alert("الزائر لا يمكنه الهجوم على لاعبين آخرين."); return; }
  try {
    const res = await fetch("http://localhost:5000/attack", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ attacker: player.name, defender: defenderName })
    });
    const data = await res.json();
    if(data.error){ alert(data.error); return; }

    alert(data.result + "\nتحديث الجيش بعد الهجوم");

    // تحديث بيانات اللاعب
    player = data.attacker;
    updateUI();
    saveProgress();
    updateLeaderboard();
    showPlayersForAttack(); // تحديث قائمة الخصوم
  } catch(err){
    console.error("خطأ في الهجوم:", err);
    alert("حدث خطأ أثناء الهجوم.");
  }
}

// استدعاء الدالة بعد تحميل الـ leaderboard
async function loadLeaderboard() {
  await updateLeaderboard();
  await showPlayersForAttack();
}
