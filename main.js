//Declaraciones generales
const pokeball = document.getElementById("pokeball");
const scoreTag = document.getElementById("treat_tag");

//Declaraciones de mejoras
const baseClickUpgrade1 = document.getElementById("upgrade-click-1");
const baseTpsUpgrade1 = document.getElementById("upgrade-tps-1");
const multiClickUpgrade1 = document.getElementById("upgrade-multi-click-1")

//Declaraciones de edificios
const building1 = document.getElementById("building-1");
const palletTown = document.getElementById("pallet-town-img");
const building1Tag = document.getElementById("building-1-tag");
const progressBar1 = document.getElementById("progress-1");

//Declaraciones de Helpers
const momSprite = document.getElementById("mom-sprite");
const momLevelTag = document.getElementById("mom-level");
const momPriceTag = document.getElementById("mom-price");

//Declaraciones menú 
const achievementsBtn = document.getElementById("achievements-btn");
const achievementsGrid = document.getElementById("achievements-grid");

//Declaraciones logros
const achievement1 =  document.getElementById("achievement-sprite-1");
const achievement2 =  document.getElementById("achievement-sprite-2");

//SETUP

let totalTreats = 0;
let treatsPerClick = 10;
let treatsPerSecond = 0;
let tpsMultiplier = 1;
let tpcMultiplier = 1;
let isAchievementsShowing = false;
let achievementBonus = 1.00;

//UPDATER

const clickUpdate = () => {
    totalTreats += calculateTPC();
    draw();
    return
}

const cpsUpdate = () => {
    totalTreats += calculateTPS();
    drawPalletTownHp();
    draw();
}

setInterval(cpsUpdate, 1000);

function draw() {
    scoreTag.innerText = `You have ${totalTreats} treats.`;
    return;
}

//ESCALAS

const priceScale = (base, level) => {
    return Math.floor(base + ((base/9)*Math.pow(level, 2)));
}

const hpScale = (base, level) => {
    return Math.floor(base + ((base/15)*Math.pow(level, 2)));
}

const calculateTPS = () => {
    return Math.round((treatsPerSecond + buildingsTPS()) * tpsMultiplier * achievementBonus);
}

const calculateTPC = () => {
    return Math.round(treatsPerClick * tpcMultiplier * achievementBonus);
}

    //ESCALAS POR EDIFICIO
    const buildingsTPS = () => {
        return building1TPS();
    }
    const building1TPS = () => {
        return 1*building1Level*building1Bonus;
    }

//UPGRADES
//BASE CLICK 1
baseClickUpgrade1.addEventListener("click", () => {
    if (totalTreats >= 10 && baseClickUpgrade1.classList.contains("to-buy")) {
        totalTreats -= 10
        treatsPerClick += 1;
        draw();
        baseClickUpgrade1.classList.remove("to-buy");
        baseClickUpgrade1.classList.add("bought");
    }
    return;
})
// BASE TPS 1
baseTpsUpgrade1.addEventListener("click", () => {
    if (totalTreats >= 20 && baseTpsUpgrade1.classList.contains("to-buy")) {
        totalTreats -= 20
        treatsPerSecond += 1;
        draw();
        baseTpsUpgrade1.classList.remove("to-buy");
        baseTpsUpgrade1.classList.add("bought");
    }
    return;
})
// MULTI CLICK 1
multiClickUpgrade1.addEventListener("click", () => {
    if (totalTreats >= 100 && multiClickUpgrade1.classList.contains("to-buy")) {
        totalTreats -= 100
        tpcMultiplier += 1;
        draw();
        multiClickUpgrade1.classList.remove("to-buy");
        multiClickUpgrade1.classList.add("bought");
    }
    return;
})
//Edificios

let building1Level = 0;
let building1Progress = 0;
let building1Bonus = 1;
let helperDamage = 0;

const palletTownClick = () => {
    building1Progress += calculateTPC();
    palletTownMaxHp()
}

const  drawPalletTownHp = () => {
    building1Progress += helperDamage
    palletTownMaxHp()
}

const palletTownMaxHp = () => {
    const totalHp = hpScale(100, building1Level);
    if (building1Progress >= totalHp) {
        building1Level ++ 
        building1Progress = 0
        progressBar1.style.width = 0 + "%";
        building1Tag.innerText = `${building1Progress} / ${hpScale(100, building1Level)} This building is level ${building1Level}`;
        checkBuilding1Achievements();
    } else {
        progressBar1.style.width = (building1Progress/totalHp)*100 + "%";
        building1Tag.innerText = `${building1Progress} / ${totalHp} This building is level ${building1Level}`;
    }
}

building1.addEventListener("click", () => {
    if (totalTreats >= 30 && palletTown.classList.contains("building-to-buy")) {
        totalTreats -= 30;
        draw();
        palletTown.classList.remove("building-to-buy");
        building1Hp = 100;
        building1Tag.innerText = `0 / 100`;
    } else if (!palletTown.classList.contains("building-to-buy")) {
        palletTownClick();
    }
    return;
})
//HELPERS
let momLevel = 0;
const baseMomPrice = 10;

momSprite.addEventListener("click", () => {
    if (totalTreats >=  priceScale(10, momLevel) && !palletTown.classList.contains("building-to-buy")) {
        totalTreats -= priceScale(10, momLevel)
        draw()
        momLevel++
        helperDamage += 1
        console.log(helperDamage)
        momLevelTag.innerText = `Level: ${momLevel}`
        momPriceTag.innerText = `Price: ${priceScale(10, momLevel)} Treats`
    } else if (palletTown.classList.contains("building-to-buy")) {
        alert("You don't have Pallet Town unlocked")
    }
})

//POKEBOLA

pokeball.addEventListener("click", clickUpdate);

// Menu

achievementsBtn.addEventListener("click", () => {
    if(!isAchievementsShowing) {
        achievementsGrid.classList.remove("hidden");
        isAchievementsShowing = !isAchievementsShowing;
    } else if (isAchievementsShowing) {
        achievementsGrid.classList.add("hidden");
        isAchievementsShowing = !isAchievementsShowing;
    }
})

//LOGROS

const checkBuilding1Achievements = () => {
    if(building1Level === 1) {
        achievement1.classList.remove("locked");
        achievementBonus += 0.05;
        console.log("Logro 1");
    };
    if(building1Level === 10) {
        achievement2.classList.remove("locked");
        achievementBonus += 0.07;
        console.log("Logro 2");
    };
};