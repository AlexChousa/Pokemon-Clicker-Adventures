//Declaraciones generales
const pokeball = document.getElementById("pokeball");
const scoreTag = document.getElementById("treat_tag");
const notificationDiv = document.getElementById("trophyNotification")

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
const achievement0 =  document.getElementById("achievement-sprite-0");
const achievement1 =  document.getElementById("achievement-sprite-1");

//Declaraciones botones
const palletTownBtn = document.getElementById("pallet-town-button");

//SETUP

let playerData = {
    treats: 0,
    tpc: 100,
    tps: 0,
    tpsX: 1,
    tpcX: 1,
    bonusAchievment: 1.00,
}

let totalTreats = playerData.treats
let treatsPerClick = playerData.tpc
let treatsPerSecond = playerData.tps
let tpsMultiplier = playerData.tpsX
let tpcMultiplier = playerData.tpcX
let isAchievementsShowing = false;
let achievementBonus = playerData.bonusAchievment



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
    checkHiredHelpers("palletTown")
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
        },
        trophyCount: 0,
        trophies: [
            // ACHIEVEMENT 0
            {
            name: "Getting Started",
            text: "You've got your first township",
            quantity: 1,
            id: 0,
            bonus: 0.05,
            step: 0,
            unlocked: false,
            imgLink: "Resources/TrophyIcons/PalletTown/palletTownTrophy1.png"
            },
            // ACHIEVEMENT 1
            {
            name: "Pallet Town Visitor",
            text: "Raise Pallet Town's level to 10",
            quantity: 10,
            id: 1,
            bonus: 0.05,
            step: 1,
            unlocked: false,
            imgLink: "Resources/TrophyIcons/PalletTown/palletTownTrophy1.png"
            },
        ]
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
        checkAchievements(obj.name)
        return
    }
    obj.progress += calculateTPC()
 
    const totalHp = hpScale(obj.baseHp, (obj.level - 1))
    if (obj.progress >= totalHp && obj.bought === true){
        obj.level += 1
        obj.progress = 0
        progressBar.style.width = 0 + "%"
        tag.innerText = `${obj.progress} / ${hpScale(obj.baseHp, (obj.level - 1))} Town is level ${obj.level}`
        checkAchievements(obj.name);
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
        tag.innerText = `0 / ${obj.baseHp} Route is level ${obj.level}`
        return
    }
    obj.progress += calculateTPC()
 
    const totalHp = hpScale(obj.baseHp, (obj.level - 1))
    if (obj.progress >= totalHp && obj.bought === true){
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

    const checkHiredHelpers = (town) => {
        const helpers = townData[town].helpers;
        for (const helperName of Object.keys(helpers)) {
            if (helpers[helperName].hired) {calculateTotalDamage(town)}
        }
        return
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
const checkAchievements = (str) => {
    if (townData[str].trophies[townData[str].trophyCount].quantity === townData[str].level) {
        townData[str].trophies[townData[str].unlocked] = true
        showNotification(townData[str].trophies[townData[str].trophyCount])
        townData[str].trophyCount ++
    }
}

  const showNotification = async (obj) => {
    console.log(`src="${obj.imgLink}`)
    notificationDiv.innerHTML += `
    <div class="trophy-window">
        <div class="trophy-img-div"><img class="trophy-img" src="${obj.imgLink}"></div>
            <div>
                <h2 class="trophy-title">${obj.name}</h2>
                <p class="trophy-text">${obj.text}</p>
            </div>
    </div>
    `
    setTimeout(() => {
        notificationDiv.innerHTML = "" 
    }, 10000)
}

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

