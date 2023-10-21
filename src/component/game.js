import { useEffect, useState } from 'react';
import './game.css';
import Square from './square';
import Food from './food';

const Game = () => {

    const [positionSquareX, setPositionSquareX] = useState(10);
    const [positionSquareY, setPositionSquareY] = useState(60);
    const [positionFoodX,setPositionFoodX] = useState(0);
    const [positionFoodY,setPositionFoodY] = useState(0);
    const [keyUp, setKeyUp] = useState(false);
    const [keyDown, setKeyDown] = useState(false);
    const [keyLeft, setKeyLeft] = useState(false);
    const [keyRight, setKeyRight] = useState(false);

    const handleKeyDown = (event) => {
        const directionMapping = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right'
        }
        const direction = directionMapping[event.key];

        if (direction) {
            setKeyUp(direction === 'up');
            setKeyDown(direction === 'down');
            setKeyRight(direction === 'right');
            setKeyLeft(direction === 'left');
        }
    };

    const getRandomNumber = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const genenerateRandomValue = (min,max) => {
        let value = getRandomNumber(min,max);
        while (value===positionSquareX) {
            value = getRandomNumber(min,max)
        }
        return value;
    }

    useEffect(()=>{
        setPositionFoodX(genenerateRandomValue(0,470));
        setPositionFoodY(670);
    },[])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (keyDown) {
                setPositionSquareY(prevY =>  prevY <= 666 ? prevY + 10 : prevY)
            } else if (keyLeft) {
                setPositionSquareX(prevX =>  prevX > 0 ? prevX - 10 : prevX);
            } else if (keyUp) {
                setPositionSquareY(prevY => prevY >  0 ?  prevY - 10 : prevY);
            } else if (keyRight) {
                setPositionSquareX(prevX => prevX <= 466 ? prevX + 10 : prevX);

            }

        }, 500)

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyLeft, keyDown, keyRight, keyUp, setPositionSquareX, setPositionSquareY])

    return (
        <>
            <div tabIndex={0} className="container-game">
                <Square positionX={positionSquareX} positionY={670} />
                <Food positionX={positionFoodX} positionY={688}/>
            </div>
            <button onClick={() => setKeyRight(true)} >start</button>
        </>

    )
}

export default Game;