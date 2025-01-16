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
const momSprite = document.getElementById("momSprite")
const momLevelTag = document.getElementById("momLevel");
const momPriceTag = document.getElementById("momPrice");

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
    helperDamage()
    draw();
}
 
setInterval(cpsUpdate, 1000);

function draw() {
    scoreTag.innerText = `You have ${totalTreats} treats.`;
    return;
}

const helperDamage = () => {
    calculateTotalDamage("palletTown")
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
        helpers: {
            mom: {
                name: "mom",
                level: 0,
                basePrice: 10,
                baseDamage: 1,
                hired: false,
                unlocked: true,
            },
            blue: {
                name: "blue",
                level: 0,
                basePrice: 1000,
                baseDamage: 100,
                hired: false,
                unlocked: true,
            }
        }
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

    momSprite.addEventListener("click", () => {
        helperClick(townData.palletTown.helpers.mom)
    })

    const helperClick = (obj) => {
        const imgElement = obj.name + "Img"
        const img = document.getElementById(imgElement)

        const levelElement = obj.name + "Level"
        const levelTag = document.getElementById(levelElement)

        const priceElement = obj.name + "Price"
        const priceTag = document.getElementById(priceElement)

        const marker = "townData." + obj.town + ".bought"
        console.log(marker)

        if (totalTreats >= obj.basePrice && obj.hired === false && obj.unlocked === true) {
            totalTreats -= obj.basePrice
            draw()
            obj.hired = true 
            obj.level = 1
            img.classList.remove("building-to-buy")
            levelTag.innerText = `Level: ${obj.level}`
            priceTag.innerText = `Price ${priceScale(obj.basePrice, obj.level)} Treats`
        } else if (obj.unlocked === false) {
            alert("The helper seems not interested in working for you")
        } else if (obj.unlocked === true && totalTreats < obj.basePrice){
            alert("You don't have enough treats to hire this helper")
        } else if (totalTreats >= priceScale(obj.basePrice, obj.level) && obj.hired === true) {
            totalTreats -= priceScale(obj.basePrice, obj.level)
            obj.level += 1
            levelTag.innerText = `Level: ${obj.level}`
            priceTag.innerText = `Price ${priceScale(obj.basePrice, obj.level)} Treats`
        }
    }

    const calculateTotalDamage = (town) => {
        const helpers = townData[town].helpers;
        let totalDamage = 0;
        Object.keys(helpers).forEach(helperKey => {
            const helper = helpers[helperKey];
            totalDamage += helper.baseDamage * helper.level;
        });
        townData[town].progress += totalDamage
        if (townData[town].progress >= hpScale(townData[town].baseHp, townData[town].level)) {
            townData[town].level ++
            townData[town].progress = 0
        }
        document.getElementById(`${townData[town].name}Progress`).style.width = (townData[town].progress / hpScale(townData[town].baseHp, townData[town].level)) * 100 + "%"
        document.getElementById(`${townData[town].name}Tag`).innerText= `${townData[town].progress} / ${hpScale(townData[town].baseHp, townData[town].level)} Town is level ${townData[town].level}`
    };

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

