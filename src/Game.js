import "./Game.css";
import React, { useState, useEffect } from "react";
import Boss from "./Boss";
import Enemy from "./Enemy";
import DefenseNet from "./DefenseNet"
import Shooter from "./Shooter";
import NewGame from "./NewGame";
import linesLevel1 from "./phrases/phrases_level1.txt";
import linesLevel2 from "./phrases/phrases_level2.txt";
import linesLevel3 from "./phrases/phrases_level3.txt";
import linesLevel4 from "./phrases/phrases_level4.txt";
import linesLevel5 from "./phrases/phrases_level5.txt";
import linesLevel6 from "./phrases/phrases_level6.txt";

export default function Game() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [gameStarted, setGameStarted] = useState(false);
  const [enemies, setEnemies] = useState([]);
  const maxHeight = 60; // Set your desired maximum height
  const [bossX, setBossX] = useState();
  const [bossY, setBossY] = useState(10);
  const [isGuessed, setIsGuessed] = useState([false,false,false,false,false,false,false,false,false,false,
    false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]); // if character A->Z is guessed
  const [hiddenPhrase, setHiddenPhrase] = useState("");
  const [phrasesLevel1, setPhrasesLevel1] = useState([]);
  const [phrasesLevel2, setPhrasesLevel2] = useState([]);
  const [phrasesLevel3, setPhrasesLevel3] = useState([]);
  const [phrasesLevel4, setPhrasesLevel4] = useState([]);
  const [phrasesLevel5, setPhrasesLevel5] = useState([]);
  const [phrasesLevel6, setPhrasesLevel6] = useState([]);
  const [answerPhrase, setAnswerPhrase] = useState("");

  
  function handleClickNewGame(event){
    event.preventDefault(); // Prevent the default behavior of the click event
    console.log(phrasesLevel1.length);
    setAnswerPhrase(phrasesLevel1[Math.floor(Math.random() * phrasesLevel1.length)]);
    setGameStarted(true);
    setEnemies([]);
  }

  function handleClickParent(event, type, text){
    event.preventDefault(); // Prevent the default behavior of the click event
    console.log(type+","+text);
    
    if(type==='Alien'){      
      var isGuessedTmp = isGuessed;      
      isGuessedTmp[characters.indexOf(text)]=true; 
      setIsGuessed(isGuessedTmp);
    }
  }

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


  useEffect(() => {    
    if (gameStarted) {
    // Interval for generating a new enemy every 2 seconds
    const generateEnemyInterval = setInterval(() => {
    const x = Math.floor(Math.random() * 90);   
    const typePool = ['Alien','Alien','Alien','Alien','Bomb','Desitined Card','Alien','Alien','Alien','Alien','Alien','Alien','Alien','Bonus'];
    const text = characters.charAt(Math.floor(Math.random() * characters.length));
    const type = typePool.at(Math.floor(Math.random() * typePool.length));
      setBossX(x);
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { key: prevEnemies.length, x: x, y: 10, type: type, text: type==='Alien'? text : null, handleClick: handleClickParent}
      ]);
    }, 500);

    // Interval for updating the position of existing enemies every 16 milliseconds
    const updatePositionInterval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => ({
          ...enemy,
          y: enemy.y + 0.3,
        }))
      );
    }, 24);

    // Clear the intervals when the component is unmounted
    return () => {
      clearInterval(generateEnemyInterval);
      clearInterval(updatePositionInterval);
    };
  }
  }, [gameStarted]);

  // Filter out enemies that exceed the maximum height
  const visibleEnemies = enemies.filter((enemy) => enemy.y <= maxHeight);

  

  return (
    <>
      <NewGame handleClick={handleClickNewGame}/>
      <Boss x={bossX} y={bossY}/>
      {visibleEnemies.map((enemy) => (
        <Enemy key={enemy.key} index={enemy.key} x={enemy.x} y={enemy.y} type={enemy.type} text={enemy.text} handleClick={enemy.handleClick}/>
      ))}
      <DefenseNet y={maxHeight}/>
      <Shooter/>
      {answerPhrase}
    </>
  );
};
