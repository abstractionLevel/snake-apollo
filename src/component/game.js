import { useEffect, useState } from 'react';
import './game.css';
import Square from './square';
import Food from './food';

const Game = () => {

    const [positionSquareX, setPositionSquareX] = useState(10);
    const [positionSquareY, setPositionSquareY] = useState(0);
    const [positionFoodX, setPositionFoodX] = useState(100);
    const [positionFoodY, setPositionFoodY] = useState(0);
    const [keyUp, setKeyUp] = useState(false);
    const [keyDown, setKeyDown] = useState(false);
    const [keyLeft, setKeyLeft] = useState(false);
    const [keyRight, setKeyRight] = useState(false);
    const [stopMove, setStopMove] = useState(false);
    const [squareSize, setSquareSize] = useState(24);
    const [foodSize, setFoodSize] = useState(12);
    const [countFood, setCountFood] = useState(0);
    const [squareList, setSquareList] = useState([{ x: 20, y: 20, playable: true, color: "red" }]);

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

    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const genenerateRandomPositionFood = (min, max) => {
        let x = getRandomNumber(min, max);
        let y = getRandomNumber(min, max);
        while (x === positionSquareX && y === positionSquareY) {
            x = getRandomNumber(min, max);
            y = getRandomNumber(min, max);
        }
        setPositionFoodX(x);
        setPositionFoodY(y);
    }

    const gameOver = () => {
        setSquareList([{ x: 20, y: 20, playable: true, color: "red" }]);
        setKeyUp(false);
        setKeyDown(false);
        setKeyRight(false);
        setKeyLeft(false);
    }

    useEffect(() => {
        if (stopMove) {
            return () => clearInterval(intervalId && intervalId);
        }
        const intervalId = setInterval(() => {
            const squareListCpy = [...squareList];
            let squareIsCollidedWithFood = false;
            let lastPositionPlayble = {};
            for (let i = 0; i < squareListCpy.length; i++) {
                const square = squareListCpy[i];
                const playbleSquare = squareListCpy.filter(val => val.playable);
                if (square.x + squareSize > positionFoodX && square.x < positionFoodX + foodSize && square.y < positionFoodY + foodSize && square.y + squareSize > positionFoodY) {
                    squareIsCollidedWithFood = true;
                    genenerateRandomPositionFood(0, 400);
                }
                if (square.playable && !squareIsCollidedWithFood) {
                    const isLost = square.x < 0 || square.x + squareSize > 500 || square.y < 0 || square.y + squareSize > 700;
                    if(isLost) {
                        gameOver();
                    } else {
                        lastPositionPlayble.x = square.x;
                        lastPositionPlayble.y = square.y;
                        if (keyDown) {
                            square.y = square.y + squareSize;
                        } else if (keyLeft) {
                            square.x = square.x - squareSize;
                        } else if (keyUp) {
                            square.y = square.y - squareSize;
                        } else if (keyRight) {
                            square.x = square.x + squareSize;
                        }
                        setSquareList(squareListCpy);
                    }
                    

                } else if (!square.playable && !squareIsCollidedWithFood) {
                    let posX = square.x;
                    let posY = square.y;
                    square.x = lastPositionPlayble.x;
                    square.y = lastPositionPlayble.y;
                    lastPositionPlayble.x = posX;
                    lastPositionPlayble.y = posY;
                } else if (squareIsCollidedWithFood) {
                    let newSquare = {}
                    const playbleSquare = squareListCpy.filter(val => val.playable);
                    const newSquareList = squareListCpy.map(item => ({
                        ...item,
                        playable: false,
                        color: "blue"
                    }));
                    if (keyDown) {
                        newSquare = { x: playbleSquare[0].x, y: playbleSquare[0].y + squareSize, playable: true, color: playbleSquare[0].color };
                    } else if (keyLeft) {
                        newSquare = { x: playbleSquare[0].x - squareSize, y: playbleSquare[0].y, playable: true, color: playbleSquare[0].color };
                    } else if (keyUp) {
                        newSquare = { x: playbleSquare[0].x, y: playbleSquare[0].y - squareSize, playable: true, color: playbleSquare[0].color };
                    } else if (keyRight) {
                        newSquare = { x: playbleSquare[0].x + squareSize, y: playbleSquare[0].y, playable: true, color: playbleSquare[0].color };
                    }
                    setSquareList([newSquare, ...newSquareList]);
                }
            }
        }, 500);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyLeft, keyDown, keyRight, keyUp, , squareList, stopMove])

    useEffect(() => {
        genenerateRandomPositionFood(0, 400);
    }, []);

    return (
        <>
            <div tabIndex={0} className="container-game">
                <Food positionX={positionFoodX} positionY={positionFoodY} size={foodSize} />
                {(squareList && squareList.length > 0) &&
                    squareList.map(val => (
                        <Square positionX={val.x} positionY={val.y} size={squareSize} color={val.color} />

                    )
                    )}
            </div>
            <div>
                <p>food: {countFood}</p>
            </div>
        </>

    )
}

export default Game;