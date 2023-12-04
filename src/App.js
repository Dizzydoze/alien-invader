import "./css/App.css";
import Login from "./Login";
import Game from "./Game";
import coffee from "./images/buyMeACoffee.png";
import RecordList from "./Record";
import { useEffect, useState } from "react";
import User from "./User";
import Welcome from "./WelcomePage";
import "./css/WelcomePage.css";
import "./css/WelcomePage.css";
import Xeno from "./images/Xenomorph-back0.jpg";
import MagicWords from "./MagicWords";
import alienImg from "./images/slime.png";
import bomb from "./images/bomb.png";
import bonus from "./images/bonus.png";
import destiny from "./images/question_mark.png"

function App() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("Anonymous");
  // Win, Lose, or Playing for gaming control
  const [endGameCondition, setEndGameCondition] = useState("");
  // Score now
  const [score, setScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [start, setStart] = useState(false);
  const [answerPhrase, setAnswerPhrase] = useState("");
  const [hiddenPhrase, setHiddenPhrase] = useState(""); // Unrevealed magic words to be guessed

  if (!userId) {
    return <Login onLogin={setUserId} />;
  } else {
    if (!start) {
      return <Welcome setStart={setStart} />;
    }
    return userId ? (
      <div className="App">
        <img className="Xeno-back" src={Xeno} alt="Xenomorph" />
        <div className="col1">
          <div className="magicWords">
            <MagicWords
              answerPhrase={answerPhrase}
              hiddenPhrase={hiddenPhrase}
            />
          </div>
          <div className="sideBar">
            <p>How to play:</p>
            <p style={{fontSize:"1rem"}}>Click Start button to play. You can play until you lose(or die).</p>
            <br/>
            <img src={alienImg} style={{width:"4vh",height:"4vh",float:"left"}}/><p style={{fontSize:"xx-large"}}>:Cute Enemy</p>
            <img src={bomb} style={{width:"4vh",height:"4vh",float:"left", clear: "left"}}/><p style={{fontSize:"xx-large"}}>:Minus two chances</p>
            <img src={bonus} style={{width:"4vh",height:"4vh",float:"left", clear: "left"}}/><p style={{fontSize:"xx-large"}}>:Add two chances</p>
            <img src={destiny} style={{width:"4vh",height:"4vh",float:"left", clear: "left"}}/><p style={{fontSize:"xx-large"}}>:Who knows</p>
          </div>
        </div>

        <div className="col2">
          <div className="title">
            <p>Alien Invader</p>
          </div>
          <div className="game">
            <Game
              endGameCondition={endGameCondition}
              setEndGameCondition={setEndGameCondition}
              score={score}
              setScore={setScore}
              setSaved={setSaved}
              answerPhrase={answerPhrase}
              setAnswerPhrase={setAnswerPhrase}
              hiddenPhrase={hiddenPhrase}
              setHiddenPhrase={setHiddenPhrase}
            />
          </div>
        </div>

        <div className="col3">
          <div className="playerInput">
            <User
              userId={userId}
              userName={userName}
              setUserName={setUserName}
            />
          </div>

          <div className="gameRecords">
            <RecordList
              end={endGameCondition}
              userId={userId}
              userName={userName}
              score={score}
              saved={saved}
              setSaved={setSaved}
            />
          </div>
        </div>

        <footer>
          <p style={{ display: "inline-block" }}>
            Copyright YJ, Marshall, Vincent
          </p>
          <a href="https://www.buymeacoffee.com/redjackfred">
            <img src={coffee} alt="coffee" />
          </a>
        </footer>
      </div>
    ) : (
      <Login onLogin={setUserId}/>
    );
  }
}

export default App;
