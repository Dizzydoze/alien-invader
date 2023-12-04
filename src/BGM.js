import './css/BGM.css';
import React, { useState, useEffect } from "react";
import bgmLever1 from './musics/Allegretto.mp3';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


const useAudio = url => {
  const [audio] = useState(new Audio(bgmLever1));
  const [playing, setPlaying] = useState(true);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const BGM = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div className="bgm">
      <Button variant="contained" color="primary" onClick={toggle}>{playing ? "Pause" : "BGM"}</Button>
    </div>
  );
};

export default BGM;