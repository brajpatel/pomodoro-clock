function App() {
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false)
    const [onBreak, setOnBreak] = React.useState(false)
    const [alarmAudio, setAlarmAudio] = React.useState(new Audio('./audio/alarm.mp3'))

    const playAlarm = () => {
        alarmAudio.currentTime = 0;
        alarmAudio.play();
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        return (
            (minutes < 10 ? '0' + minutes : minutes) +
            ':' +
            (seconds < 10 ? '0' + seconds : seconds)
        )
    };

    const changeTime = (amount, type) => {
        if(type === 'break') {
            if(breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime(prev => prev + amount)
        }
        if(type === 'session') {
            if(sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime(prev => prev + amount)
            if(!timerOn) {
                setDisplayTime(sessionTime + amount)
            }
        }
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime()
                if(date > nextDate) {
                    setDisplayTime(prev => {
                        if(prev <= 0 && !onBreakVariable) {
                            playAlarm();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        }
                        else if(prev <= 0 && onBreakVariable) {
                            playAlarm();
                            onBreakVariable = false;
                            setOnBreak(false)
                            return sessionTime;
                        }
                        return prev - 1
                    })
                    nextDate += second
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval)
        }

        if(timerOn) {
            clearInterval(localStorage.getItem('interval-id'))
        }
        setTimerOn(!timerOn)
    }

    const resetTime = () => {
        setBreakTime(5 * 60)
        setSessionTime(25 * 60)
        setDisplayTime(25 * 60)
    }

    return (
        <div>
            <h1>Pomodoro Clock<i class="fa-solid fa-stopwatch"></i></h1>

            <div className="settings-container">
                <Length
                    id="break-length"
                    title={"Break Length"}
                    changeTime={changeTime}
                    type={"break"}
                    time={breakTime}
                    formatTime={formatTime}
                />

                <Length
                    id="session-length"
                    title={"Session Length"}
                    changeTime={changeTime}
                    type={"session"}
                    time={sessionTime}
                    formatTime={formatTime}
                />
            </div>

            <div className="time-display">
                <h2 id="timer-label" className="timer-label">{onBreak ? 'Break' : 'Session'}</h2>

                <h2 id="time-left" className="time-left">{formatTime(displayTime)}</h2>

                <button id="start_stop" className="start-stop" onClick={controlTime}>
                    {timerOn ? (<i class="fa-solid fa-pause"></i>) : (<i class="fa-solid fa-play"></i>)}
                </button>

                <button id="reset" className="reset" onClick={resetTime}>
                    <i class="fa-solid fa-rotate"></i>
                </button>
            </div>

        </div>
    );
};

function Length({ title, changeTime, type, time, formatTime }) {
    return (
        <div className="length-container">
            <h2>{title}</h2>
            <button className="decrement" onClick={() => changeTime(-60, type)}>
                <i class="fa-solid fa-circle-arrow-down"></i>
            </button>
            <h3>{formatTime(time)}</h3>
            <button className="increment" onClick={() => changeTime(60, type)}>
                <i class="fa-solid fa-circle-arrow-up"></i>
            </button>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));