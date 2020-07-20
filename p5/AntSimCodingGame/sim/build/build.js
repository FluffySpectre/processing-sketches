class Coordinate{constructor(t,e,i){this.radius=i,this.direction=0,this.position=createVector(t,e)}static withDeltas(t,e,i){let s=new Coordinate(0,0,t.radius);return s.position.x=t.position.x+e,s.position.y=t.position.y+i,s.direction=t.direction,s}copy(){let t=new Coordinate(this.position.x,this.position.y,this.radius);return t.direction=this.direction,t}get direction(){return this.directionVal}set direction(t){for(this.directionVal=t;this.directionVal<0;)this.directionVal+=360;for(;this.directionVal>359;)this.directionVal-=360;this.directionVal=Math.floor(this.directionVal)}static distance(t,e){let i=t.position.dist(e.position)-t.radius-e.radius;return i=Math.floor(i),i<0?0:i}static distanceSqr(t,e){let i=t.position.copy().sub(e.position).magSq();return i<0?0:i}static distanceMidPoints(t,e){let i=t.position.dist(e.position);return i=Math.floor(i),i}static distanceMidPointsSqr(t,e){let i=t.position.copy().sub(e.position).magSq();return i<0?0:i}static directionAngle(t,e){let i=p5.Vector.sub(e.position,t.position).heading();return i<0&&(i+=360),Math.floor(i)}static clampAngle(t){for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}}class AntHill extends Coordinate{constructor(t,e,i){super(t,e,i)}getState(){return{positionX:this.position.x,positionY:this.position.y,radius:this.radius}}}const canvasSize=800;let renderer,environment,playerCodeAvailable=!1,playerCodeValid=!0,simulationEnd=!1,simulationPlay=!0,simulationStep=!1,colonyNameUI,foodValueUI,deadAntsValueUI,killedBugsValueUI,pointsValue,showInfoMaxDuration=5,showInfoDuration=0,showInfoObject=null,showInfoPosition=null,objectInfoName,objectInfoValue;function playerCodeLoaded(t){playerCodeValid=!0;let e=PlayerInfo.fromObject(t);for(let t of e.castes){let e=t.speed+t.rotationSpeed+t.attack+t.load+t.range+t.viewRange+t.vitality;0!==e&&(console.error("Caste "+t.name+" abilities need to add up to zero! Got sum: "+e),playerCodeValid=!1)}playerCodeValid&&(SimSettings.displayDebugLabels=e.debug,environment=new Environment(e,0),playerCodeAvailable=!0,colonyNameUI.html(e.colonyName))}function playerCodeError(){playerCodeValid=!1}function onMessage(t){"playerCodeLoaded"===t.data.type?playerCodeLoaded(t.data.param):"playerCodeError"===t.data.type?playerCodeError():"simSpeedChanged"===t.data.type?onSimSpeedChanged(t.data.param):"pause"===t.data.type?simulationPlay=!1:"play"===t.data.type?simulationPlay=!0:"step"===t.data.type?(simulationPlay=!1,simulationStep=!0):"rendererChanged"===t.data.type&&onRendererChanged(t.data.param)}function onSimSpeedChanged(t){let e=[1,2,4,8,16];SimSettings.stepMultiplicator=t>=0&&t<e.length?e[t]:1}function onRendererChanged(t){0===t?renderer=new Renderer2D(canvasSize,canvasSize):1===t&&(renderer=new Renderer3D(canvasSize,canvasSize))}function setup(){frameRate(SimSettings.stepsPerSecond),renderer=new Renderer3D(canvasSize,canvasSize),angleMode(DEGREES),colonyNameUI=select("#colonyName"),foodValueUI=select("#foodValue"),deadAntsValueUI=select("#deadAntsValue"),killedBugsValueUI=select("#killedBugsValue"),pointsValue=select("#pointsValue"),window.addEventListener("message",onMessage,!1)}function draw(){if(playerCodeValid)if(playerCodeAvailable){if(simulationPlay||simulationStep){simulationStep=!1;for(let t=0;t<SimSettings.stepMultiplicator;t++)environment.currentRound<SimSettings.totalRounds?environment.step():simulationEnd=!0}if(handleSelection(),renderer){const t=environment.getState();objectInfoName&&(t.selectionState={selectedObjectPositionX:showInfoPosition.x,selectedObjectPositionY:showInfoPosition.y,selectedObjectName:objectInfoName,selectedObjectInfo:objectInfoValue}),renderer.render(t)}frameCount%SimSettings.stepsPerSecond==0&&(foodValueUI.html(environment.playerColony.statistics.collectedFood.toString()),deadAntsValueUI.html(environment.playerColony.statistics.totalDeadAnts.toString()),killedBugsValueUI.html(environment.playerColony.statistics.killedBugs.toString()),pointsValue.html(environment.playerColony.statistics.points.toString())),simulationEnd&&drawMessage("Simulation finished!","#fff")}else drawMessage("Loading...","#fff");else drawMessage("There are errors in your code. Please check the console.","#f00")}function handleSelection(){if(mouseX>=0&&mouseX<=width&&mouseY>=0&&mouseY<=height){let t=new Coordinate(mouseX,mouseY,0),e=15,i=null,s=Number.MAX_SAFE_INTEGER;for(let a of environment.sugarHills){let n=Coordinate.distance(t,a);a&&n<e&&n<s&&(s=n,i=a)}for(let a of environment.fruits){let n=Coordinate.distance(t,a);a&&n<e&&n<s&&(s=n,i=a)}if(i)showInfoDuration=showInfoMaxDuration,showInfoObject=i,showInfoPosition=i.position;else{for(let a=0;a<environment.bugs.insects.length;a++){let n=environment.bugs.insects[a],o=Coordinate.distance(t,n);n&&o<e&&o<s&&(s=o,i=n)}for(let a=0;a<environment.playerColony.insects.length;a++){let n=environment.playerColony.insects[a],o=Coordinate.distance(t,n);n&&o<e&&o<s&&(s=o,i=n)}i&&(showInfoDuration=showInfoMaxDuration,showInfoObject=i,showInfoPosition=i.position)}}if(objectInfoName=null,objectInfoValue=null,showInfoDuration>0)switch(showInfoDuration--,!0){case showInfoObject instanceof Sugar:objectInfoName="Sugar",objectInfoValue="Amount: "+showInfoObject.amount.toString();break;case showInfoObject instanceof Fruit:objectInfoName="Apple",objectInfoValue="Amount: "+showInfoObject.amount.toString();break;case showInfoObject instanceof BaseAnt:objectInfoName="Ant",objectInfoValue="Vitality: "+showInfoObject.vitality.toString();break;case showInfoObject instanceof Bug:objectInfoName="Bug",objectInfoValue="Vitality: "+showInfoObject.vitality.toString()}}function drawMessage(t,e){noStroke(),fill(20,180),rect(0,0,width,height),textSize(24),fill(e),text(t,width/2-textWidth(t)/2,height/2-12)}class Insect extends Coordinate{constructor(){super(0,0,0)}init(t,e){this.colony=t,this.colour="#222",this.casteIndex=0,this.remainingDistance=0,this.remainingRotation=0,this.target=null,this.reached=!1,this.traveledDistance=0,this.vitality=this.maxVitality,this.currentSpeed=this.colony.castesSpeed[this.casteIndex],this.carriedFruit=null,this.currentLoad=0,this.debugMessage=null,this.smelledMarker=[],this.colonyCount=0,this.casteCount=0,this.colony.antHill?(this.position=createVector(this.colony.antHill.position.x,this.colony.antHill.position.y),this.radius=5):(this.position=createVector(random(0,width),random(0,height)),this.radius=5),this.direction=random(0,359)}get target(){return this.targetVal}set target(t){this.target===t&&null!==t||(this.targetVal=t)}get currentLoad(){return this.currentLoadVal}set currentLoad(t){t=Math.floor(t),this.currentLoadVal=t>=0?t:0,this.currentSpeed=this.colony.castesSpeed[this.casteIndex],this.currentSpeed-=Math.floor(this.currentSpeed*this.currentLoad/this.colony.castesLoad[this.casteIndex]/2)}get maxLoad(){return this.colony.castesLoad[this.casteIndex]}get vitality(){return this.vitalityVal}set vitality(t){t=Math.floor(t),this.vitalityVal=t>=0?t:0}get maxSpeed(){return this.colony.castesSpeed[this.casteIndex]}get rotationSpeed(){return this.colony.castesRotationSpeed[this.casteIndex]}get range(){return this.colony.castesRange[this.casteIndex]}get viewRange(){return this.colony.castesViewRange[this.casteIndex]}get maxVitality(){return this.colony.castesVitality[this.casteIndex]}get attack(){return 0!==this.currentLoad?0:this.attackVal}set attack(t){t=Math.floor(t),this.attackVal=t>=0?t:0}get caste(){return this.colony.castes[this.casteIndex].name}get distanceToAntHill(){let t=Number.MAX_SAFE_INTEGER;if(this.colony.antHill){let e=Coordinate.distanceMidPoints(this,this.colony.antHill);e<t&&(t=e)}return t}get antsInViewRange(){return this.colonyCount}get antsFromSameCasteInViewRange(){return this.casteCount}get bugsInViewRange(){return this.bugCount}move(){if(0!==this.remainingRotation)Math.abs(this.remainingRotation)<this.rotationSpeed?(this.direction+=this.remainingRotation,this.remainingRotation=0):this.remainingRotation>=this.rotationSpeed?(this.direction+=this.rotationSpeed,this.remainingRotation=Coordinate.clampAngle(this.remainingRotation-this.rotationSpeed)):this.remainingRotation<=-this.rotationSpeed&&(this.direction-=this.rotationSpeed,this.remainingRotation=Coordinate.clampAngle(this.remainingRotation+this.rotationSpeed));else if(this.remainingDistance>0){if(!this.carriedFruit){let t=Math.min(this.remainingDistance,this.currentSpeed);this.remainingDistance-=t,this.traveledDistance+=t,this.position.x+=t*Math.cos(this.direction*Math.PI/180),this.position.y+=t*Math.sin(this.direction*Math.PI/180)}}else if(null!==this.target){let t=Coordinate.distanceMidPoints(this,this.target);if(this.reached=t<=5,!this.reached){let e=Coordinate.directionAngle(this,this.target);t<this.viewRange||this.carriedFruit?this.remainingDistance=t:(e+=random(-10,10),this.remainingDistance=this.viewRange),this.turnToDirection(e)}}if(this.position.x<0?(this.position.x=-this.position.x,this.direction>90&&this.direction<=180?this.direction=180-this.direction:this.direction>180&&this.direction<270&&(this.direction=540-this.direction)):this.position.x>width&&(this.position.x=width,this.direction>=0&&this.direction<90?this.direction=180-this.direction:this.direction>270&&this.direction<360&&(this.direction=540-this.direction)),this.position.y<0)this.position.y=-this.position.y,this.direction=360-this.direction;else{if(this.position.y<=height)return;if(this.position.y=height,this.direction<=0||this.direction>=180)return;this.direction=360-this.direction}}goForward(t){t&&NaN!==Number(t)||(t=Number.MAX_SAFE_INTEGER),this.remainingDistance=t}goToTarget(t){this.target=t}goAwayFromTarget(t,e){this.turnToDirection(Coordinate.directionAngle(this,t)+180),this.goForward(e)}goHome(){this.goToTarget(this.colony.antHill)}stop(){this.target=null,this.remainingDistance=0,this.remainingRotation=0}turnByDegrees(t){this.remainingRotation=Coordinate.clampAngle(t)}turnToTarget(t){t&&t&&(this.remainingRotation=Coordinate.clampAngle(Coordinate.directionAngle(this,t)-this.direction))}turnToDirection(t){this.remainingRotation=Coordinate.clampAngle(t-this.direction)}turnAround(){this.remainingRotation>0?this.remainingRotation=180:this.remainingRotation=-180}take(t){if(t instanceof Sugar){if(Coordinate.distanceMidPoints(this,t)<=5){let e=Math.min(this.maxLoad-this.currentLoad,t.amount);this.currentLoad+=e,t.amount-=e}}else if(t instanceof Fruit){if(this.carriedFruit===t)return;if(this.carriedFruit&&this.drop(),Coordinate.distanceMidPoints(this,t)>5)return;this.stop(),this.carriedFruit=t,t.carriers.push(this),this.currentLoad=this.maxLoad}}drop(){if(this.currentLoad=0,this.target=null,!this.carriedFruit)return;let t=this.carriedFruit.carriers.indexOf(this);t>-1&&this.carriedFruit.carriers.splice(t,1),this.carriedFruit=null}needsCarriers(t){return t.needsCarriers(this.colony)}attackTarget(t){this.target=t}setMarker(t,e){(!e||NaN===Number(e)||e<0)&&(e=0);let i=this.copy(),s=new Marker(i.position.x,i.position.y,e);s.information=t,this.colony.newMarker.push(s),this.smelledMarker.push(s)}think(t){this.debugMessage=t?t.length>100?t.substr(0,100):t:null}}class BaseAnt extends Insect{init(t,e){super.init(t,e);let i=-1,s="";if(e){s=this.determineCaste(e);for(let e=0;e<t.castes.length;e++){let a=t.castes[e];if(a.name===s){i=e,this.colour=a.color||this.colour;break}}}i>-1?this.casteIndex=i:(t.castes[0].name&&console.error("Caste not exists: "+s+". Using default instead."),this.casteIndex=0),this.isTired=!1,this.name=random(SimSettings.antNames),this.vitality=t.castesVitality[this.casteIndex],this.currentSpeed=t.castesSpeed[this.casteIndex],this.attack=t.castesAttack[this.casteIndex]}determineCaste(t){return""}waits(){}spotsSugar(t){}spotsFruit(t){}spotsBug(t){}spotsFriend(t){}smellsFriend(t){}sugarReached(t){}fruitReached(t){}becomesTired(){}underAttack(t){}hasDied(t){}tick(){}getState(){let t=TargetType.None;switch(!0){case this.target instanceof Sugar:t=TargetType.Sugar;break;case this.target instanceof Fruit:t=TargetType.Fruit;break;case this.target instanceof Bug:t=TargetType.Bug;break;case this.target instanceof AntHill:t=TargetType.Anthill;break;case this.target instanceof Marker:t=TargetType.Marker}return{casteIndex:this.casteIndex,positionX:this.position.x,positionY:this.position.y,radius:this.radius,direction:this.direction,colour:this.colour,targetPositionX:this.target?this.target.position.x:-1,targetPositionY:this.target?this.target.position.y:-1,targetType:t,vitality:this.vitality,load:this.currentLoad,loadType:!this.carriedFruit&&this.currentLoad<=0?LoadType.None:this.carriedFruit?LoadType.Fruit:LoadType.Sugar,viewRange:this.viewRange,debugMessage:this.debugMessage}}}class Bug extends Insect{init(t,e){super.init(t,e),this.radius=6,this.vitality=t.castesVitality[0],this.currentSpeed=t.castesSpeed[0],this.attack=t.castesAttack[0],this.colour="blue"}getState(){return{positionX:this.position.x,positionY:this.position.y,direction:this.direction,radius:this.radius,vitality:this.vitality,colour:this.colour}}}class CasteAbilityLevel{}class CasteAbilities{constructor(){this.offset=-1,this.abilities=[new CasteAbilityLevel,new CasteAbilityLevel,new CasteAbilityLevel,new CasteAbilityLevel],this.abilities[0].speed=2,this.abilities[0].rotationSpeed=4,this.abilities[0].load=4,this.abilities[0].range=1800,this.abilities[0].viewRange=20,this.abilities[0].vitality=50,this.abilities[0].attack=0,this.abilities[1].speed=3,this.abilities[1].rotationSpeed=8,this.abilities[1].load=5,this.abilities[1].range=2250,this.abilities[1].viewRange=40,this.abilities[1].vitality=100,this.abilities[1].attack=2,this.abilities[2].speed=4,this.abilities[2].rotationSpeed=16,this.abilities[2].load=7,this.abilities[2].range=3400,this.abilities[2].viewRange=80,this.abilities[2].vitality=175,this.abilities[2].attack=4,this.abilities[3].speed=5,this.abilities[3].rotationSpeed=24,this.abilities[3].load=10,this.abilities[3].range=4500,this.abilities[3].viewRange=120,this.abilities[3].vitality=250,this.abilities[3].attack=8}minIndex(){return this.offset}maxIndex(){return this.offset+this.abilities.length-1}get(t){return!Number.isSafeInteger(t)||t<this.offset||t>this.maxIndex()?(void 0!==t&&console.error("Caste ability level invalid! Got: "+t+". Allowed are: -1, 0, 1, 2"),this.abilities[0]):this.abilities[t-this.offset]}}class CasteInfo{constructor(){this.speed=0,this.rotationSpeed=0,this.load=0,this.range=0,this.viewRange=0,this.vitality=0,this.attack=0}static fromObject(t){let e=new CasteInfo;return e.name=t.name||"",e.color=t.color||null,e.speed=Number.isInteger(t.speed)?t.speed:0,e.rotationSpeed=Number.isInteger(t.rotationSpeed)?t.rotationSpeed:0,e.load=Number.isInteger(t.load)?t.load:0,e.range=Number.isInteger(t.range)?t.range:0,e.viewRange=Number.isInteger(t.viewRange)?t.viewRange:0,e.vitality=Number.isInteger(t.vitality)?t.vitality:0,e.attack=Number.isInteger(t.attack)?t.attack:0,e}getState(){return{name:this.name,color:this.color,speed:this.speed,rotationSpeed:this.rotationSpeed,load:this.load,range:this.range,viewRange:this.viewRange,vitality:this.vitality,attack:this.attack}}}class Colony{constructor(t){if(this.insectDelay=0,this.insects=[],this.starvedInsects=[],this.eatenInsects=[],this.insectDelay=0,this.statistics=new PlayerStatistics,this.marker=[],this.newMarker=[],t){this.playerInfo=t,this.insectClass="PlayerAnt",this.castes=t.castes,0===this.castes.length&&this.castes.push(new CasteInfo),this.antsInCaste=this.castes.map(t=>0),this.castesSpeed=new Array(this.castes.length),this.castesRotationSpeed=new Array(this.castes.length),this.castesLoad=new Array(this.castes.length),this.castesRange=new Array(this.castes.length),this.castesViewRange=new Array(this.castes.length),this.castesVitality=new Array(this.castes.length),this.castesAttack=new Array(this.castes.length);let e=0;for(let t of this.castes)this.castesSpeed[e]=SimSettings.casteAbilities.get(t.speed).speed,this.castesRotationSpeed[e]=SimSettings.casteAbilities.get(t.rotationSpeed).rotationSpeed,this.castesLoad[e]=SimSettings.casteAbilities.get(t.load).load,this.castesRange[e]=SimSettings.casteAbilities.get(t.range).range,this.castesViewRange[e]=SimSettings.casteAbilities.get(t.viewRange).viewRange,this.castesVitality[e]=SimSettings.casteAbilities.get(t.vitality).vitality,this.castesAttack[e]=SimSettings.casteAbilities.get(t.attack).attack,e++}else this.playerInfo=null,this.insectClass="Bug",this.castesSpeed=[SimSettings.bugSpeed],this.castesRotationSpeed=[SimSettings.bugRotationSpeed],this.castesRange=[Number.MAX_SAFE_INTEGER],this.castesViewRange=[0],this.castesLoad=[0],this.castesVitality=[SimSettings.bugVitality],this.castesAttack=[SimSettings.bugAttack],this.antsInCaste=[0]}newInsect(){let availableInsects=null;if(this.castes&&this.castes.length>0){availableInsects={};let t=0;for(let e of this.castes)availableInsects.hasOwnProperty(e.name)||(availableInsects[e.name]=this.antsInCaste[t]),t++}let ant=eval(`new ${this.insectClass}()`);ant.init(this,availableInsects),this.insects.push(ant),this.antsInCaste[ant.casteIndex]++}removeAnt(t){let e=this.insects.indexOf(t);e>-1&&this.insects.splice(e,1),this.antsInCaste[t.casteIndex]--}getState(){const t=[];for(let e of this.insects)t.push(e.getState());const e=[];for(let t of this.marker)e.push(t.getState());const i=[];for(let t of this.castes)i.push(t.getState());return{antStates:t,antHillState:this.antHill.getState(),markerStates:e,casteStates:i,colonyName:this.playerInfo.colonyName,playerName:this.playerInfo.name,starvedAnts:this.statistics.starvedAnts,eatenAnts:this.statistics.eatenAnts,collectedFood:this.statistics.collectedFood,killedBugs:this.statistics.killedBugs,points:this.statistics.points}}}class Environment{constructor(t,e){0!==e&&randomSeed(e),this.sugarHills=[],this.fruits=[],this.playerColony=new Colony(t),this.playerColony.antHill=new AntHill(width/2,height/2,SimSettings.antHillRadius),this.bugs=new Colony,this.sugarDelay=0,this.fruitDelay=0,this.bugDelay=0,this.currentRound=0}step(){this.currentRound++,this.removeSugar(),this.spawnSugar(),this.spawnFruit();for(let t=0;t<this.bugs.insects.length;t++){let e=this.bugs.insects[t],i=this.getAntsInBattleRange(e);if(i.length>0){let t=Math.floor(SimSettings.bugAttack/i.length);for(let s of i)s.vitality-=t,s.underAttack(e),s.vitality<=0&&s.colony.eatenInsects.push(s)}e.move(),0===e.remainingDistance&&(e.turnToDirection(random(0,360)),e.goForward(random(160,320)))}for(let t=0;t<this.playerColony.insects.length;t++){let e=this.playerColony.insects[t],i=this.getAntsInViewRange(e);e.colonyCount=i[0],e.casteCount=i[1];let s=i[2],a=this.getBugsInViewRange(e);e.bugCount=a[0];let n=a[1];if(e.move(),e.traveledDistance>e.range)e.vitality=0,this.playerColony.starvedInsects.push(e);else{if(e.traveledDistance>e.range/3&&!e.isTired&&(e.isTired=!0,e.becomesTired()),!n||e.target instanceof Bug||e.spotsBug(n),!s||e.target instanceof BaseAnt||e.spotsFriend(s),e.target instanceof Bug){let t=e.target;t.vitality>0?Coordinate.distance(e,e.target)<SimSettings.battleRange&&(t.vitality-=e.attack,t.vitality<=0&&(this.bugs.eatenInsects.push(t),this.playerColony.statistics.killedBugs++,e.stop())):e.target=null}e.reached&&this.antAndTarget(e),this.antAndSugar(e),e.carriedFruit||this.antAndFruit(e),this.antAndMarker(e),e.target||0!==e.remainingDistance||e.waits(),e.tick()}}this.removeAnts(),this.spawnAnt(),this.updateMarker(),this.moveFruitAndAnts(),this.removeFruit(),this.removeBugs(),this.healBugs(),this.spawnBug(),this.generateSimState()}generateSimState(){const t=new SimState;t.colonyState=this.playerColony.getState();for(let e of this.bugs.insects)t.bugStates.push(e.getState());for(let e of this.sugarHills)t.sugarStates.push(e.getState());for(let e of this.fruits)t.fruitStates.push(e.getState());this.currentSimState=t}getState(){return this.currentSimState}spawnAnt(){this.playerColony.insects.length<SimSettings.antLimit&&this.playerColony.insectDelay<0&&(this.playerColony.newInsect(),this.playerColony.insectDelay=SimSettings.antRespawnDelay),this.playerColony.insectDelay--}removeAnts(){let t=[];for(let e=0;e<this.playerColony.starvedInsects.length;e++){let i=this.playerColony.starvedInsects[e];i&&-1===t.indexOf(i)&&(t.push(i),this.playerColony.statistics.starvedAnts++,i.hasDied("starved"))}for(let e=0;e<this.playerColony.eatenInsects.length;e++){let i=this.playerColony.eatenInsects[e];i&&-1===t.indexOf(i)&&(t.push(i),this.playerColony.statistics.eatenAnts++,i.hasDied("eaten"))}for(let e of t)if(e){this.playerColony.removeAnt(e);for(let t of this.fruits){let i=t.carriers.indexOf(e);i>-1&&t.carriers.splice(i,1)}}this.playerColony.starvedInsects=[],this.playerColony.eatenInsects=[]}antAndTarget(t){if(t.target instanceof AntHill){if(t.carriedFruit)return;t.traveledDistance=0,t.target=null,t.smelledMarker=[],t.colony.statistics.collectedFood+=t.currentLoad,t.currentLoad=0,t.vitality=t.maxVitality,t.isTired=!1}else if(t.target instanceof Sugar){let e=t.target;if(t.target=null,e.amount<=0)return;t.sugarReached(e)}else if(t.target instanceof Fruit){let e=t.target;if(t.target=null,e.amount<=0)return;t.fruitReached(e)}else{if(t.target instanceof Insect)return;t.target=null}}antAndSugar(t){for(let e of this.sugarHills){let i=Coordinate.distance(t,e);t.target!==e&&i<=t.viewRange&&t.spotsSugar(e)}}antAndFruit(t){for(let e of this.fruits){let i=Coordinate.distance(t,e);t.target!==e&&i<=t.viewRange&&t.spotsFruit(e)}}antAndMarker(t){let e=this.getNearestMarker(t);e&&(t.smellsFriend(e),t.smelledMarker.push(e))}updateMarker(){let t=[];for(let e of this.playerColony.marker)e.isActive?e.update():t.push(e);for(let e of t){for(let t of this.playerColony.insects)if(t){let i=t.smelledMarker.indexOf(e);i>-1&&t.smelledMarker.splice(i,1)}this.playerColony.marker.splice(this.playerColony.marker.indexOf(e),1)}t=[];for(let t of this.playerColony.newMarker){let e=!1;for(let i of this.playerColony.marker)if(Coordinate.distanceMidPoints(i,t)<SimSettings.markerDistance){e=!0;break}e||this.playerColony.marker.push(t)}this.playerColony.newMarker=[]}moveFruitAndAnts(){for(let t of this.fruits){if(t.carriers.length<=0)continue;let e=0,i=0,s=0;for(let a of t.carriers)a.target!==t&&0===a.remainingRotation&&(e+=a.currentSpeed*Math.cos(a.direction*Math.PI/180),i+=a.currentSpeed*Math.sin(a.direction*Math.PI/180),s+=a.currentLoad);s=Math.min(Math.floor(0+s*SimSettings.fruitLoadMultiplier),t.amount),e=e*s/t.amount/t.carriers.length,i=i*s/t.amount/t.carriers.length;let a=Coordinate.withDeltas(t,e,i);t.position=a.position,t.direction=a.direction;for(let s of t.carriers){let t=Coordinate.withDeltas(s,e,i);s.position=t.position,s.direction=t.direction}}}spawnSugar(){if(this.sugarHills.length<SimSettings.sugarLimit&&this.sugarDelay<=0){this.sugarDelay=SimSettings.sugarRespawnDelay;let t=this.getRandomPoint(),e=random(SimSettings.minSugarAmount,SimSettings.maxSugarAmount);this.sugarHills.push(new Sugar(t.x,t.y,e))}this.sugarDelay--}removeSugar(){this.sugarHills=this.sugarHills.filter(t=>t&&t.amount>0)}spawnFruit(){if(this.fruits.length<SimSettings.fruitLimit&&this.fruitDelay<=0){this.fruitDelay=SimSettings.fruitRespawnDelay;let t=this.getRandomPoint(),e=random(SimSettings.minFruitAmount,SimSettings.maxFruitAmount);this.fruits.push(new Fruit(t.x,t.y,e))}this.fruitDelay--}removeFruit(){for(let t of this.fruits)if(Coordinate.distanceMidPoints(t,this.playerColony.antHill)<=5){this.playerColony.statistics.collectedFood+=t.amount,t.amount=0;for(let e of t.carriers)e&&(e.carriedFruit=null,e.currentLoad=0,e.remainingDistance=0,e.remainingRotation=0,e.goHome());t.carriers=[]}this.fruits=this.fruits.filter(t=>t&&t.amount>0)}spawnBug(){this.bugs.insects.length<SimSettings.bugLimit&&this.bugs.insectDelay<0&&(this.bugs.newInsect(),this.bugs.insectDelay=SimSettings.bugRespawnDelay),this.bugs.insectDelay--}healBugs(){if(this.currentRound%SimSettings.bugRegenerationDelay==0)for(let t of this.bugs.insects)t&&t.vitality<t.maxVitality&&(t.vitality+=SimSettings.bugRegenerationValue)}removeBugs(){for(let t=this.bugs.eatenInsects.length-1;t>=0;t--){let e=this.bugs.eatenInsects[t];if(e){let t=this.bugs.insects.indexOf(e);t>-1&&this.bugs.insects.splice(t,1)}}this.bugs.eatenInsects=[]}getBugsInViewRange(t){let e=0,i=null,s=Number.MAX_SAFE_INTEGER;for(let a of this.bugs.insects){if(a===t)continue;let n=Coordinate.distanceSqr(t,a);n<=t.viewRange*t.viewRange&&(n<s&&(s=n,i=a),e++)}return[e,i]}getAntsInViewRange(t){let e=0,i=0,s=null,a=Number.MAX_SAFE_INTEGER;for(let n of this.playerColony.insects){if(n===t)continue;let o=Coordinate.distanceSqr(t,n);o<=t.viewRange*t.viewRange&&(o<a&&(a=o,s=n),e++,n.casteIndex===t.casteIndex&&i++)}return[e,i,s]}getAntsInBattleRange(t){let e=[];for(let i of this.playerColony.insects){let s=i;s!==t&&(Coordinate.distanceSqr(t,s)<=SimSettings.battleRange*SimSettings.battleRange&&e.push(s))}return e}getNearestMarker(t){let e=null,i=Number.MAX_SAFE_INTEGER;for(let s of this.playerColony.marker){let a=Coordinate.distanceMidPoints(t,s);a-t.radius-s.radius<=0&&a<i&&-1===t.smelledMarker.indexOf(s)&&(i=a,e=s)}return e}getRandomPoint(){let t=createVector(random(20,width-20),random(20,height-20));for(;t.dist(this.playerColony.antHill.position)<25;)t=createVector(random(20,width-20),random(20,height-20));return t}}class Food extends Coordinate{constructor(t,e,i){super(t,e,0),this.amount=i}get amount(){return this.amountVal}set amount(t){this.amountVal=t,this.radius=Math.floor(Math.round(Math.sqrt(this.amount/Math.PI)*SimSettings.sugarRadiusMultiplier))}}class Fruit extends Food{constructor(t,e,i){super(t,e,i),this.carriers=[]}get amount(){return this.amountVal}set amount(t){this.amountVal=t,this.radius=Math.floor(SimSettings.fruitRadiusMultiplier*Math.sqrt(this.amount/Math.PI))}needsCarriers(t){let e=0;for(let i of this.carriers)i.colony===t&&(e+=i.currentLoad);return e*SimSettings.fruitLoadMultiplier<this.amount}getState(){return{positionX:this.position.x,positionY:this.position.y,amount:this.amount,radius:this.radius,carriers:this.carriers.length}}}class Marker extends Coordinate{constructor(t,e,i){super(t,e,0),this.age=0,this.maxAge=SimSettings.markerMaximumAge,i<0?i=0:(i>SimSettings.markerRangeMaximum&&(i=SimSettings.markerRangeMaximum),this.maxAge=this.maxAge*SimSettings.markerSizeMinimum/(SimSettings.markerSizeMinimum+i)),this.spread=i,this.update()}get isActive(){return this.age<this.maxAge}update(){this.age++,this.radius=SimSettings.markerSizeMinimum,this.radius+=this.spread*this.age/this.maxAge}getState(){return{positionX:this.position.x,positionY:this.position.y,radius:this.radius,direction:this.direction,age:this.age,maxAge:this.maxAge}}}class PlayerInfo{static fromObject(t){let e=new PlayerInfo;if(e.name=t.name,e.colonyName=t.colonyName,e.castes=[],Array.isArray(t.castes))for(let i of t.castes)e.castes.push(CasteInfo.fromObject(i));return e.debug=t.debug||!1,e}}class PlayerStatistics{constructor(){this.starvedAnts=0,this.eatenAnts=0,this.collectedFood=0,this.killedBugs=0}get points(){return Math.max(Math.floor(SimSettings.pointsForFood*this.collectedFood+SimSettings.pointsForStarvedAnts*this.starvedAnts+SimSettings.pointsForEatenAnts*this.eatenAnts+SimSettings.pointsForKilledBugs*this.killedBugs),0)}get totalDeadAnts(){return this.starvedAnts+this.eatenAnts}}class RandomNumber{static number(t,e){return random(t,e)}}class Renderer2D{constructor(t,e){createCanvas(t,e,P2D).style("display","block")}render(t){background(245,222,179),translate(-width/2,-height/2);for(const e of t.colonyState.antStates){if(push(),translate(e.positionX,e.positionY),e.debugMessage){fill(20),textSize(12);let t=textWidth(e.debugMessage);text(e.debugMessage,-t/2,-14)}SimSettings.displayDebugLabels&&(noStroke(),fill(20,15),ellipse(0,0,2*e.viewRange)),rotate(e.direction),noStroke(),fill(e.colour),rect(-3,-1.5,6,3),e.loadType===LoadType.Sugar&&(fill(250),rect(-2.5,-2.5,5,5)),pop()}for(const e of t.bugStates)push(),translate(e.positionX,e.positionY),rotate(e.direction),noStroke(),fill(e.colour),rect(-4,-2.5,8,5),pop();for(const e of t.sugarStates)push(),translate(e.positionX,e.positionY),stroke(100),fill(250),ellipse(0,0,2*e.radius),pop();for(const e of t.fruitStates){if(push(),translate(e.positionX,e.positionY),stroke(100),fill(10,230,10),ellipse(0,0,2*e.radius),SimSettings.displayDebugLabels&&e.carriers>0){fill(20),textSize(12);let t=textWidth(e.carriers.toString());text(e.carriers.toString(),-t/2,-14)}pop()}push(),translate(t.colonyState.antHillState.positionX,t.colonyState.antHillState.positionY),stroke(100),fill(222,184,135,255),ellipse(0,0,2*t.colonyState.antHillState.radius,2*t.colonyState.antHillState.radius),pop();for(const e of t.colonyState.markerStates)push(),translate(e.positionX,e.positionY),noStroke(),fill(240,240,10,map(e.age,0,e.maxAge,128,0)),ellipse(0,0,2*e.radius),pop();t.selectionState&&this.drawInfo(t.selectionState.selectedObjectName,t.selectionState.selectedObjectInfo,t.selectionState.selectedObjectPositionX,t.selectionState.selectedObjectPositionY),SimSettings.displayDebugLabels&&(fill(20),textSize(12),text("FPS: "+Math.floor(frameRate()),10,20),text("Round: "+environment.currentRound,10,36))}drawInfo(t,e,i,s){fill(20),textSize(12);let a=textWidth(t);text(t,i-a/2,s-32);let n=textWidth(e);text(e,i-n/2,s-16)}}class Renderer3D{constructor(t,e){createCanvas(t,e,WEBGL).style("display","block"),this.cam=createCamera(),this.cam.move(0,.75*-t,.05*t),this.cam.lookAt(0,0,0)}render(t){background(50,140,193),orbitControl(2,2,-.05),rotateX(90),translate(-width/2,-height/2),ambientLight(100),directionalLight(200,200,200,createVector(-45,90,0)),noStroke(),push(),translate(width/2,height/2,-.1),fill(245,222,179),plane(width,height),pop();for(const e of t.colonyState.antStates){if(push(),translate(e.positionX,e.positionY,1),e.debugMessage){fill(20),textSize(12);let t=textWidth(e.debugMessage);text(e.debugMessage,-t/2,-14)}SimSettings.displayDebugLabels&&(noStroke(),fill(20,15),ellipse(0,0,2*e.viewRange)),rotateZ(e.direction),noStroke(),fill(e.colour),box(6,3,2),e.loadType===LoadType.Sugar&&(translate(0,0,2.5),fill(250),box(3,3,3)),pop()}for(const e of t.bugStates)push(),translate(e.positionX,e.positionY,2),rotateZ(e.direction),noStroke(),fill(e.colour),box(8,5,4),pop();for(const e of t.sugarStates)push(),translate(e.positionX,e.positionY,e.radius/2),noStroke(),fill(250),rotateX(90),cone(e.radius,e.radius),pop();for(const e of t.fruitStates){if(push(),translate(e.positionX,e.positionY,e.radius),noStroke(),fill(10,230,10),sphere(e.radius),SimSettings.displayDebugLabels&&e.carriers>0){fill(20),textSize(12);let t=textWidth(e.carriers.toString());text(e.carriers.toString(),-t/2,-14)}pop()}push(),translate(t.colonyState.antHillState.positionX,t.colonyState.antHillState.positionY,t.colonyState.antHillState.radius/2),noStroke(),fill(222,184,135),rotateX(90),cylinder(t.colonyState.antHillState.radius,t.colonyState.antHillState.radius),pop();for(const e of t.colonyState.markerStates)push(),translate(e.positionX,e.positionY),noStroke(),fill(240,240,10,map(e.age,0,e.maxAge,128,0)),sphere(e.radius),pop()}}class SimSettings{static get markerSizeMaximum(){return this.markerSizeMinimum*this.markerMaximumAge}static get markerRangeMaximum(){return this.markerSizeMaximum-this.markerSizeMinimum}}var LoadType,TargetType;SimSettings.stepsPerSecond=30,SimSettings.stepMultiplicator=1,SimSettings.totalRounds=7300,SimSettings.antLimit=50,SimSettings.antHillRadius=25,SimSettings.displayDebugLabels=!1,SimSettings.sugarLimit=2,SimSettings.fruitLimit=2,SimSettings.bugLimit=5,SimSettings.minSugarAmount=500,SimSettings.maxSugarAmount=500,SimSettings.minFruitAmount=250,SimSettings.maxFruitAmount=250,SimSettings.sugarRadiusMultiplier=1,SimSettings.fruitLoadMultiplier=5,SimSettings.fruitRadiusMultiplier=1.25,SimSettings.pointsForFood=1,SimSettings.pointsForStarvedAnts=-5,SimSettings.pointsForEatenAnts=0,SimSettings.pointsForKilledBugs=150,SimSettings.antRespawnDelay=15,SimSettings.bugRespawnDelay=75,SimSettings.sugarRespawnDelay=150,SimSettings.fruitRespawnDelay=225,SimSettings.bugSpeed=2,SimSettings.bugRotationSpeed=5,SimSettings.bugVitality=1e3,SimSettings.bugAttack=50,SimSettings.bugRegenerationDelay=5,SimSettings.bugRegenerationValue=1,SimSettings.battleRange=10,SimSettings.casteAbilities=new CasteAbilities,SimSettings.antNames=["Anke","Matthias","Roland","Bernhard","Werner","Joachim","Gabi","Björn","Anja","Carsten","Benjamin","Timon","Yannik","Matthias LT","Jens","Dennis","Christine","Sebastian","Seddy","Tim","Manuel"],SimSettings.markerMaximumAge=150,SimSettings.markerSizeMinimum=20,SimSettings.markerDistance=13,function(t){t[t.None=0]="None",t[t.Sugar=1]="Sugar",t[t.Fruit=2]="Fruit"}(LoadType||(LoadType={})),function(t){t[t.None=0]="None",t[t.Anthill=1]="Anthill",t[t.Bug=2]="Bug",t[t.Sugar=3]="Sugar",t[t.Fruit=4]="Fruit",t[t.Marker=5]="Marker"}(TargetType||(TargetType={}));class SimState{constructor(){this.bugStates=[],this.sugarStates=[],this.fruitStates=[]}}class Sugar extends Food{constructor(t,e,i){super(t,e,i)}getState(){return{positionX:this.position.x,positionY:this.position.y,radius:this.radius,amount:this.amount}}}
