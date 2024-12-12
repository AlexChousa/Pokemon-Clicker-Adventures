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

const route1 = document.getElementById("route-1");
const route1Img = document.getElementById("route-1-img");
const route1Tag = document.getElementById("route-1-tag");
const route1ProgressBar = document.getElementById("route-1-progress");

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

//Declaraciones botones
const palletTownBtn = document.getElementById("pallet-town-button");

//SETUP

let totalTreats = 0;
let treatsPerClick = 100;
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
        return building1TPS() + route1TPS();
    }
    const building1TPS = () => {
        return 1*building1Level*building1Bonus;
    }
    const route1TPS = () => {
        return 2*route1Level*route1Bonus;
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
let helperDamage = 0;

//Pallet Town
let building1Level = 0;
let building1Progress = 0;
let building1Bonus = 1;

const palletTownClick = () => {
    building1Progress += calculateTPC();
    palletTownMaxHp()
}
const  drawPalletTownHp = () => {
    building1Progress += helperDamage
    palletTownMaxHp()
}
const palletTownMaxHp = () => {
    const totalHp = hpScale(100, (building1Level - 1));
    if (building1Progress >= totalHp) {
        building1Level ++ 
        building1Progress = 0
        progressBar1.style.width = 0 + "%";
        building1Tag.innerText = `${building1Progress} / ${hpScale(100, building1Level)} Town is level ${building1Level}`;
        checkBuilding1Achievements();
    } else if (!palletTown.classList.contains("building-to-buy")){
        progressBar1.style.width = (building1Progress/totalHp)*100 + "%";
        building1Tag.innerText = `${building1Progress} / ${totalHp} Town is level ${building1Level}`;
    }
}
building1.addEventListener("click", () => {
    if (totalTreats >= 30 && palletTown.classList.contains("building-to-buy")) {
        totalTreats -= 30;
        draw();
        palletTown.classList.remove("building-to-buy");
        building1Tag.innerText = `0 / 100 Town is level ${building1Level}`;
        building1Level = 1
    } else if (!palletTown.classList.contains("building-to-buy")) {
        palletTownClick();
    }
    return;
})

//Route 1

let route1Level = 0;
let route1Progress = 0;
let route1Bonus = 1;

route1.addEventListener("click", () => {
    if (totalTreats >= 100 && route1Img.classList.contains("building-to-buy")) {
        totalTreats -= 100;
        draw(); 
        route1Img.classList.remove("building-to-buy");
        route1Tag.innerText = `0 / 300 Route is level ${route1Level}`;
        route1Level = 1
    } else if (!route1Img.classList.contains("building-to-buy")) {
        route1Click()
    }
})

const route1Click = () => {
    route1Progress += calculateTPC();
    route1MaxHp()
}

const route1MaxHp = () => {
    const totalHp = hpScale(300, (route1Level - 1));
    if (route1Progress >= totalHp) {
        route1Level ++ 
        route1Progress = 0
        route1ProgressBar.style.width = 0 + "%";
        route1Tag.innerText = `${route1Progress} / ${hpScale(100, route1Level)} Route is level ${route1Level}`;
        checkAchievements();
    } else if (!route1Img.classList.contains("building-to-buy")){
        route1ProgressBar.style.width = (route1Progress/totalHp)*100 + "%";
        route1Tag.innerText = `${route1Progress} / ${totalHp} Route is level ${route1Level}`;
    }
}

//HELPERS
let momLevel = 0;
const baseMomPrice = 10;

    //Pallet Town Helpers
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

const checkAchievements = () => {
    if(building1Level === 1) {
        achievement1.classList.remove("locked");
        achievementBonus += 0.05;
    };
    if(building1Level === 10) {
        achievement2.classList.remove("locked");
        achievementBonus += 0.07;
    };
};

//Botones 

palletTownBtn.addEventListener("click", () => {
    if(document.getElementById("pallet-town-helpers").classList.contains("showAnimation")) {
        document.getElementById("pallet-town-helpers").classList.remove("showAnimation")
        document.getElementById("pallet-town-helpers").classList.add("hideAnimation")
        setTimeout(()=>{
            document.getElementById("pallet-town-helpers").classList.remove("flex-center")
            document.getElementById("pallet-town-helpers").classList.add("hidden")
        }, 380)
    } else {
        setTimeout(()=>{
            document.getElementById("pallet-town-helpers").classList.add("showAnimation")
            document.getElementById("pallet-town-helpers").classList.remove("hideAnimation")
        }, 20)
        
        document.getElementById("pallet-town-helpers").classList.add("flex-center")
        document.getElementById("pallet-town-helpers").classList.remove("hidden")
    }
})