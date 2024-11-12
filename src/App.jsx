import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

  const [length,setLength]= useState({
    break: 5,
    session: 25
  })

  const [count, setCount] = useState({
    minutes: length.session,
    seconds: 0,
  });

  const [active, setActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const audioRef = useRef()

  let redClass;


  count.minutes < 1 ? redClass = "red": redClass= "";


  function handleTimerStart() {
    setActive(true);
  }

  function handleTimerPause(){
    setActive(false)
  }

  function handlreTimerReset(){
    setLength({
      break:5,
      session:25
    })
    setCount((prev)=>({
      ...prev,
      seconds:0
    }))
    setActive(false)
    setIsBreak(false)
  }

  function sessiontimer() {
    if (count.minutes === 0 && count.seconds === 0) {
      setIsBreak((prev) => !prev);
      setCount({
        minutes: isBreak ? length.session : length.break,
        seconds: 0,
      });
      return;
    }

    if (count.seconds === 0) {
      setCount((prev) => ({
        minutes: prev.minutes - 1,
        seconds: 59,
      }));
    } else {
      setCount((prev) => ({
        ...prev,
        seconds: prev.seconds - 1,
      }));
    }
  }



  useEffect(() => {
    if (!active) return; 

    const interval = setInterval(sessiontimer, 1000);

    return () => clearInterval(interval); 
  }, [active, count]);


  function sessionChange(type, action) {
    setLength((prev) => {
      const value = prev[type];
      if (action === 'minus') {
        if (value > 1) {
          return { ...prev, [type]: value - 1 };
        }
      } else if (action === 'plus') {
        return { ...prev, [type]: value + 1 };
      }
      return prev;
    });
  }




  useEffect(()=>{
    setCount((prev)=>({
      ...prev,
      minutes:length.session
    }))
  },[length.session])


  useEffect(()=>{
    audioRef.current.play()
  },[isBreak])


  

  if(isBreak){
    redClass = "red"
  }


  return <>
    <div className="container">
      <h1>25 + 5  Clock</h1>
        <div className="session-types">
          <div id="break" className='box'>
            <h1 id='break-label'>Break  Length</h1>
            <div>
              <button onClick={()=>{sessionChange("break","minus")}} className="button">
                <ion-icon  name="arrow-down-outline"></ion-icon>
              </button>
              <h1 id='break-length'>{length.break}</h1>
              <button className="button">
                <ion-icon onClick={()=>{sessionChange("break","plus")}} name="arrow-up-outline"></ion-icon>
              </button>
            </div>
          </div>
          <div id="session" className='box'>
            <h1 id='session-label'>Session length</h1>
            <div>
            <button onClick={()=>{sessionChange("session","minus")}} className="button">
              <ion-icon name="arrow-down-outline"></ion-icon>
            </button>
              <h1 id='session-length'>{length.session}</h1>
              <button onClick={()=>{sessionChange("session","plus")}} className="button">
                <ion-icon name="arrow-up-outline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
        <div className="timer-container">
          <h1 className={redClass}  id ="timer-label">{isBreak ? "Break":"Session"}</h1>
          <h1 className={redClass} id="time-left">{`${String(count.minutes).padStart(2, '0')}:${String(count.seconds).padStart(2, '0')}`}</h1>
          <audio ref={audioRef} src="/BeepSound.wav"></audio>
        </div>
        <div className="control-btns">
          <div id="play" onClick={handleTimerStart} className='button controls'><ion-icon name="caret-forward-outline"></ion-icon></div>
          <div onClick={handleTimerPause} id="stop" className='button controls'><ion-icon name="pause-sharp"></ion-icon></div>
          <div onClick={handlreTimerReset} id="reset" className='button controls'><ion-icon name="refresh-sharp"></ion-icon></div>
        </div>
    </div>
  </>
}

export default App;
