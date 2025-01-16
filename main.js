//Declaraciones generales
const pokeball = document.getElementById("pokeball");
const scoreTag = document.getElementById("treat_tag");

//Declaraciones de mejoras
const baseClickUpgrade1 = document.getElementById("upgrade-click-1");
const baseTpsUpgrade1 = document.getElementById("upgrade-tps-1");
const multiClickUpgrade1 = document.getElementById("upgrade-multi-click-1")

//Declaraciones de edificios
const palletTown = document.getElementById("palletTown");

const route1 = document.getElementById("route1")

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
        return townTPS() + routeTPS();
    }
    const townTPS = () => {
        let tps = Object.values(townData).reduce((sum, town) =>{
            return town.bought ? sum + (town.baseTPS * town.bonusTps * town.level || 0) : sum
        }, 0) 
        return tps
    }
    const routeTPS = () => {
        let tps = Object.values(routeData).reduce((sum, route) =>{
            return route.bought ? sum + (route.baseTPS * route.bonusTps * route.level || 0) : sum
        }, 0) 
        return tps
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

let townData = {
    palletTown: {
        name: "palletTown",
        level: 0,
        progress: 0,
        bonusTps: 1,
        baseHp: 100,
        basePrice: 30, 
        bought: false,
        baseTPS: 1,
    }
}

palletTown.addEventListener("click", () => {
    townClick(townData.palletTown)
})

const townClick = (obj) => {
    const imgElement = obj.name + "Img"
    const img = document.getElementById(imgElement);

    const tagElement = obj.name + "Tag"
    const tag = document.getElementById(tagElement);

    const prgressElement = obj.name + "Progress"
    const progressBar = document.getElementById(prgressElement);

    if(totalTreats >= obj.basePrice && obj.bought === false) {
        totalTreats -= obj.basePrice;
        draw(); 
        obj.bought = true
        obj.level = 1
        img.classList.remove("building-to-buy")
        tag.innerText = `0 / ${obj.baseHp} Town is level ${obj.level}`;
    }
    obj.progress += calculateTPC()
 
    const totalHp = hpScale(obj.baseHp, (obj.level - 1))
    if (obj.progress >= totalHp){
        obj.level += 1
        obj.progress = 0
        progressBar.style.width = 0 + "%"
        tag.innerText = `${obj.progress} / ${hpScale(obj.baseHp, (obj.level - 1))} Town is level ${obj.level}`
        checkAchievements();
    } else if (obj.bought === true) {
        progressBar.style.width = (obj.progress / totalHp) * 100 + "%"
        tag.innerText = `${obj.progress} / ${totalHp} Town is level ${obj.level}`
    }
}
//RUTAS
let routeData = {
    route1: {
        name: "route1",
        level: 0,
        progress: 0,
        bonusTps: 1,
        baseHp: 300,
        basePrice: 100,
        bought: false,
        baseTPS: 2,
        catchPKMN: [16, 19]
    }
}

route1.addEventListener("click", () => {
    routeClick(routeData.route1);
})

const routeClick = (obj) => {
    const imgElement = obj.name + "Img"
    const img = document.getElementById(imgElement)

    const tagElement = obj.name + "Tag"
    const tag = document.getElementById(tagElement)

    const progressElement = obj.name + "Progress"
    const progressBar = document.getElementById(progressElement)


    if(totalTreats >= obj.basePrice && obj.bought === false) {
        totalTreats -= obj.basePrice;
        draw(); 
        obj.bought = true
        obj.level = 1
        img.classList.remove("building-to-buy")
        tag.innerText = `0 / ${obj.baseHp} Route is level ${obj.level}`;
    }
    obj.progress += calculateTPC()
 
    const totalHp = hpScale(obj.baseHp, (obj.level - 1))
    if (obj.progress >= totalHp){
        obj.level += 1
        obj.progress = 0
        progressBar.style.width = 0 + "%"
        tag.innerText = `${obj.progress} / ${hpScale(obj.baseHp, (obj.level - 1))} Route is level ${obj.level}`
        checkAchievements();
    } else if (obj.bought === true) {
        progressBar.style.width = (obj.progress / totalHp) * 100 + "%"
        tag.innerText = `${obj.progress} / ${totalHp} Route is level ${obj.level}`
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

// Catch pokemon

