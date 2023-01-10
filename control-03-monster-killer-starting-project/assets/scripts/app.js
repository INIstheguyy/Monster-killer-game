const ATTACK_VALUE = 12;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 12;
const LOG_EVENT_PLAYER_ATTACK = "ATTACK"
const LOG_EVENT_PLAYER_STRONG_ATTACK = "STRONG_ATTACK"
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK"
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL"
const LOG_EVENT_GAME_OVER = "GAME_OVER"


const enteredValue =  prompt("Enter maximum health for You and the Monster",'100')

let chosenMaxLife = parseInt(enteredValue);
let battleLog = []

if(chosenMaxLife <= 0 ||isNaN(chosenMaxLife)){
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;


adjustHealthBars(chosenMaxLife);
function writeToLog(ev, val, MonsterHealth, PlayerHealth) {
  let logEntry = {
    event : ev,
    value : val,
    target : 'MONSTER',
    finalMonsterHealth : MonsterHealth,
    finalPlayerHealth : PlayerHealth
  }
  if (ev === LOG_EVENT_PLAYER_ATTACK){
    logEntry.target = 'MONSTER'
  }else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
    logEntry = {
      event : ev,
      value : val,
      target : 'MONSTER',
      finalMonsterHealth : MonsterHealth,
      finalPlayerHealth : PlayerHealth
    };
    battleLog.push(logEntry);
  }else if (ev === LOG_EVENT_MONSTER_ATTACK){
    logEntry = {
      event : ev,
      value : val,
      target : 'PLAYER',
      finalMonsterHealth : MonsterHealth,
      finalPlayerHealth : PlayerHealth
    };
    battleLog.push(logEntry);
  }else if (ev === LOG_EVENT_PLAYER_HEAL){
    logEntry = {
      event : ev,
      value : val,
      target : 'PLAYER',
      finalMonsterHealth : MonsterHealth,
      finalPlayerHealth : PlayerHealth
    };
    battleLog.push(logEntry);
  }else if (ev === LOG_EVENT_GAME_OVER){
    logEntry = {
      event : ev,
      value : val,
      finalMonsterHealth : MonsterHealth,
      finalPlayerHealth : PlayerHealth
    };
    battleLog.push(logEntry);
  }
}
function reset(){
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}
function endRound(){
  const initialPlayerHealth = currentPlayerHealth
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);
  if(currentPlayerHealth <= 0 && hasBonusLife){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth
    setPlayerHealth(initialPlayerHealth);
  }
  if(currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!!!')
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!!!')
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("It's a draw!!!")
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if(
    currentMonsterHealth <= 0 || currentPlayerHealth <= 0
  ){
    reset();
  }
}
function attackMonster(mode){
  let maxDamage;
  let logEvent;
  if(mode === "ATTACK"){
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  }
  else if(mode === "STRONG_ATTACK"){
    maxDamage = MONSTER_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound()
}

function attackHandler() {
  attackMonster("ATTACK");
}
function strongAttackHandler(){
  attackMonster("STRONG_ATTACK");
}
function healPlayerHandler(){
  let healvalue;
  if(currentPlayerHealth >= chosenMaxLife -HEAL_VALUE){
    alert("max health!")
    healvalue = chosenMaxLife - currentPlayerHealth;
  }else{
    healvalue = HEAL_VALUE
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += healvalue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healvalue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler(){
  console.log(battleLog)
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);