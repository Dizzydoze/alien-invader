import "./css/Game.css";
import React, { useState, useEffect, useSound } from "react";
import Boss from "./Boss";
import Enemy from "./Enemy";
import DefenseNet from "./DefenseNet";
import Shooter from "./Shooter";
import NewGame from "./NewGame";
import MagicWords from "./MagicWords";
import Chances from "./Chances";
import BGM from "./BGM";
import Lose from "./Lose";
import linesLevel1 from "./phrases/phrases_level1.txt";
import linesLevel2 from "./phrases/phrases_level2.txt";
import linesLevel3 from "./phrases/phrases_level3.txt";
import linesLevel4 from "./phrases/phrases_level4.txt";
import linesLevel5 from "./phrases/phrases_level5.txt";
import linesLevel6 from "./phrases/phrases_level6.txt";
import generateEnemies from "./generateEnemies";
import Bullets from "./Bullets";

const EndGameCondition = {
  Win: "win",
  Lose: "lose",
  Playing: "playing",
};

function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

export default function Game({answerPhrase, setAnswerPhrase, hiddenPhrase, setHiddenPhrase, endGameCondition, setEndGameCondition, score, setScore, setSaved}) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // For easy look up
  const [gameStarted, setGameStarted] = useState(false); // It'll be true after the game is started in order to controll when to generate enemies
  const [enemies, setEnemies] = useState([]); // Our lovely enemies
  const maxHeight = 60; // Set your desired maximum height
  const [bossX, setBossX] = useState(); // Boss x position
  const [bossY, setBossY] = useState(10); // Boss y position
  const [isGuessed, setIsGuessed] = useState(Array(26).fill(false)); // if character A->Z is guessed
  
  // Phrases arrays for each level
  const [phrasesLevel1, setPhrasesLevel1] = useState([]); 
  const [phrasesLevel2, setPhrasesLevel2] = useState([]);
  const [phrasesLevel3, setPhrasesLevel3] = useState([]);
  const [phrasesLevel4, setPhrasesLevel4] = useState([]);
  const [phrasesLevel5, setPhrasesLevel5] = useState([]);
  const [phrasesLevel6, setPhrasesLevel6] = useState([]);
  // Level state to control difficulty of the game. Default: level 1
  const [level, setLevel] = useState(1);  // Magic words to defeat enemies
  
  // Chances left
  const [chancesLeft, setChancesLeft] = useState(10);   
  // Time limit for one round of play
  const timeLimit = 1000 * 120; // 2 mins
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  let generateEnemyInterval; // I need to declaire it here for not getting asynchronous bugs from states

  // Function for end game condition check
  function endGameCheck() {
    if (chancesLeft > 0) {
      if (hiddenPhrase !== "" && hiddenPhrase === answerPhrase) {
        return EndGameCondition.Win;
      } else if (timeLeft <= 0) {
        return EndGameCondition.Lose;
      } else {
        return EndGameCondition.Playing;
      }
    } else {
      return EndGameCondition.Lose;
    }
  }

  // Event handler for clicking on NewGame component
  function handleClickNewGame(event) {
    event.preventDefault(); // Prevent the default behavior of the click event
    let randomIndex = Math.floor(Math.random() * phrasesLevel1.length);
    setAnswerPhrase(phrasesLevel1[randomIndex]);    
    setGameStarted(true);    
    setIsGuessed(Array(26).fill(false));  
    setHiddenPhrase("");
    setChancesLeft(10);
    setTimeLeft(timeLimit);
    setSaved(false);
    setScore(0);    
    setEnemies(generateEnemies(handleClickParent));
  }

  

  // Event handler for clicking on Enemy components
  function handleClickParent(event, type, text, index) {
    event.preventDefault(); // Prevent the default behavior of the click event
 
    switch (type) {
      // If click on a Alien, then update isGuessed and chancesLeft depending on which enemy got hit
      case "Alien":
        setIsGuessed((prevIsGuessed) => {
          const updatedIsGuessed = [...prevIsGuessed];
          updatedIsGuessed[characters.indexOf(text)] = true;
          return updatedIsGuessed;
        });
        setChancesLeft((prevChancesLeft) => {
          // Ensure chances are only decreased if the character is not in the answerPhrase
          if (answerPhrase.toUpperCase().indexOf(text.toUpperCase()) === -1) {         
            return prevChancesLeft - 1;
          }
          return prevChancesLeft;
        });
        break;
      case "Bonus":
        setChancesLeft((prevChancesLeft) => {
          return prevChancesLeft + 1;
        });
        break;
      case "Bomb":
        setChancesLeft((prevChancesLeft) => {
          return prevChancesLeft - 2;
        });
        break;
      case "Desitined Card":
        //To be implemented
        const randomDraw = Math.floor(Math.random() * 5);
        switch (randomDraw) {
          case 0: // Increase 2 chances
            setChancesLeft((prevChancesLeft) => {
              return prevChancesLeft + 2;
            });
            break;
          case 1: // Reduce 2 chances
            setChancesLeft((prevChancesLeft) => {
              return prevChancesLeft - 2;
            });
            break;
          case 2: //Increase 10 seconds
            setTimeLeft((prevTimeLeft) => {
              let updatedTimeLeft = prevTimeLeft;
              updatedTimeLeft += 10000;
              return updatedTimeLeft;
            });
            break;
          case 3: //Decrease 10 seconds
            setTimeLeft((prevTimeLeft) => {
              let updatedTimeLeft = prevTimeLeft;
              updatedTimeLeft -= 10000;
              return updatedTimeLeft;
            });
            break;
          case 4: //Increase 3000 scores
            setScore((prevScore) => {
              return prevScore + 3000;
            });
            break;
        }
        break;
    }

    // Disappear after clicking
    setEnemies((prevEnemies) => {
      const updatedEnemies = [...prevEnemies];
      updatedEnemies[index].x = -100;
      updatedEnemies[index].y = 10;
      return updatedEnemies;
    });
  }
  

  // Use useEffect to update hiddenPhrase after isGuessed is updated
  useEffect(() => {
    let hiddenPhraseTmp = "";
    for (let i = 0; i < answerPhrase.length; i++) {
      if (
        isGuessed[characters.indexOf(answerPhrase[i].toUpperCase())] === true ||
        !isLetter(answerPhrase[i])
      ) {
        hiddenPhraseTmp += answerPhrase[i];
      } else {
        hiddenPhraseTmp += "*";
      }
    }
    setHiddenPhrase(hiddenPhraseTmp);
  }, [isGuessed, answerPhrase]);

  // Check end game condition after setting hiddenPhrase everytime
  useEffect(() => {
    const endTmp = endGameCheck(hiddenPhrase, answerPhrase);
    if (endTmp !== endGameCondition) {
      setEndGameCondition(endTmp);
    }
  }, [isGuessed, hiddenPhrase, timeLeft]);

  //Get phrases from file based on levels (easy:1->hard:6)
  useEffect(() => {
    fetch(linesLevel1)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel1(phrasesArray);
      });
    fetch(linesLevel2)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel2(phrasesArray);
      });
    fetch(linesLevel3)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel3(phrasesArray);
      });
    fetch(linesLevel4)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel4(phrasesArray);
      });
    fetch(linesLevel5)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel5(phrasesArray);
      });
    fetch(linesLevel6)
      .then((response) => response.text())
      .then((data) => {
        const phrasesArray = data.split("\n");
        setPhrasesLevel6(phrasesArray);
      });
  }, []);

  // Interval for generating a new enemy every 0.3 seconds
  useEffect(() => {
    if (gameStarted) {
      generateEnemyInterval = setInterval(() => {
        // Set x position of the Boss randomly
        const x = Math.floor(Math.random() * 90); 
        setBossX(x);
        // Spawn enemies which are in the space yet(Not already been spawned).
        let randomIndex = Math.floor(Math.random() * enemies.length);
        while (enemies[randomIndex].x >= 0) {
          randomIndex = Math.floor(Math.random() * enemies.length);
        }
        setEnemies((prevEnemies) => {
          const updatedEnemies = [...prevEnemies];
          updatedEnemies[randomIndex].x = x;
          return updatedEnemies;
        });
      }, 300);

      // Interval for updating the timeLeft in every 100 milliseconds
      const updateTimeInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          let updatedTimeLeft = prevTimeLeft;
          updatedTimeLeft -= 1000;
          return updatedTimeLeft;
        });
      }, 1000);

      // Interval for updating the position of existing enemies every 36 milliseconds
      const updatePositionInterval = setInterval(() => {
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            x: enemy.y >= maxHeight ? -100 : enemy.x,
            y:
              enemy.y >= maxHeight
                ? 10
                : enemy.x >= 0
                ? enemy.y + 0.3
                : enemy.y
          }))
        );
      }, 36);

      // Clear the intervals when the component is unmounted
      return () => {
        clearInterval(generateEnemyInterval);
        clearInterval(updatePositionInterval);
        clearInterval(updateTimeInterval);
      };
    }
  }, [gameStarted]);

  // End the game after losing or winning
  useEffect(() => {
    if (gameStarted) {
      if (endGameCondition === EndGameCondition.Lose) {
        setGameStarted(false);
        setEnemies(generateEnemies(handleClickParent));
        setScore((prevScore) => {          
          return prevScore + timeLeft/100 + chancesLeft*10;
        });
      } else if (endGameCondition === EndGameCondition.Win) {
        let randomIndex;
        switch (level) {
          case 1:
            randomIndex = Math.floor(Math.random() * phrasesLevel2.length);
            setAnswerPhrase(phrasesLevel2[randomIndex]);
            setLevel(2);
            break;
          case 2:
            randomIndex = Math.floor(Math.random() * phrasesLevel3.length);
            setAnswerPhrase(phrasesLevel3[randomIndex]);
            setLevel(3);
            break;
          case 3:
            randomIndex = Math.floor(Math.random() * phrasesLevel4.length);
            setAnswerPhrase(phrasesLevel4[randomIndex]);
            setLevel(4);
            break;
          case 4:
            randomIndex = Math.floor(Math.random() * phrasesLevel5.length);
            setAnswerPhrase(phrasesLevel5[randomIndex]);
            setLevel(5);
            break;
          case 5:
            randomIndex = Math.floor(Math.random() * phrasesLevel6.length);
            setAnswerPhrase(phrasesLevel6[randomIndex]);
            setLevel(6);
            break;
          case 6:
            randomIndex = Math.floor(Math.random() * phrasesLevel6.length);
            setAnswerPhrase(phrasesLevel6[randomIndex]);
            setLevel(6);
            break;
        }
        setScore((prevScore) => {
          return prevScore + level * chancesLeft*chancesLeft * 100 + timeLeft /50;
        });
        setGameStarted(true);
        setEnemies(generateEnemies(handleClickParent));
        setIsGuessed(Array(26).fill(false));
        setHiddenPhrase("");
        setChancesLeft(10);
        setTimeLeft(timeLimit);
        console.log("Level:" + level);
      }
    }
  }, [endGameCondition]);
 

  // If the player loses the game, it'll show <Lose> only. Otherwise, it'll show all the other components when player is playing.
  return (
    <>
      <div className="up">
        <BGM />
      </div>      
      {endGameCondition === EndGameCondition.Lose ? (
        <Lose />
      ) : (
        <>

          <Boss x={bossX} y={bossY} />
          {enemies.map((enemy) => (
            <Enemy
              key={enemy.key}
              index={enemy.key}
              x={enemy.x}
              y={enemy.y}
              type={enemy.type}
              text={enemy.text}
              handleClick={handleClickParent}
            />
          ))}
          <DefenseNet y={maxHeight} />
          <div className="down">           
            <Chances leftChance={chancesLeft} />
            {/* <Bullets /> */}
            <Shooter score={score} time={timeLeft}/>
          </div>
        </>
      )}
      {
        gameStarted ? null :
        <div className="newgame-container">
          <NewGame handleClick={handleClickNewGame} />
        </div>
      }
    </>
  );
}
