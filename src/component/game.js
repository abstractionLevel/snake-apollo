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
    const [isCollidedWidhFood, setIsCollidedWidthFood] = useState(false);
    const [countFood, setCountFood] = useState(0);
    const [squareList, setSquareList] = useState([{ x: 20, y: 20, playable: true }]);

    const squareIsCollidedWithFood = () => {
        
        squareList.forEach(el=>{
            if(el.playable) {
                if (el.x + squareSize > positionFoodX &&
                    el.x < positionFoodX + foodSize &&
                    el.y < positionFoodY + foodSize &&
                    el.y + squareSize > positionFoodY) {
                    setIsCollidedWidthFood(true)
                    setCountFood(prev => prev + 1);
                    addSquare();
                }
            }
        })
       
    }

    const updatePositionBodySquare = (x, y) => {
        console.log(squareList.length)

        if (squareList.length > 0) {
            const newList = squareList.map(val => {
                return { ...val, x: val.x + x, y: val.y + y }
            })
        }
    }

    const addSquare = () => {
        const lastSquare = squareList[squareList.length - 1];
       console.log("ultimo square ", lastSquare.x)
        setSquareList(prev => {
            return [...prev,{x:lastSquare.x,y:lastSquare.y,playable:false}]
        });
      
    }
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

    useEffect(() => {
        if (isCollidedWidhFood) {
            genenerateRandomPositionFood(110, 200);
            setIsCollidedWidthFood(false);

        }
    }, [isCollidedWidhFood]);

    useEffect(() => {

        if (stopMove) {
            return () => clearInterval(intervalId && intervalId);
        }
        const intervalId = setInterval(() => {
            if (keyDown) {
                setSquareList(prevElementi => {
                    return prevElementi.map(el => {
                        if(el.playable) {
                            return  el.y < 666 ? { ...el, y: el.y + 10 } : { ...el, y: el.y };
                        }
                        
                    });
                });
            } else if (keyLeft) {
                setSquareList(prevElementi => {
                    return prevElementi.map(el => {
                        if(el.playable) {
                            return el.x  > 0 ? { ...el, x: el.x - 10 } : { ...el, x: el.x };
                        }
                        
                    });
                });
            } else if (keyUp) {
                setSquareList(prevElementi => {
                    return prevElementi.map(el => {
                        if(el.playable) {
                            return el.y  > 0 ? { ...el, y: el.y - 10 } : { ...el, y: el.y };
                        }
                        
                    });
                });
            } else if (keyRight) {
                setSquareList(prevElementi => {
                    return prevElementi.map(el => {
                        if(el.playable) {
                            return el.x < 466 ? { ...el, x: el.x + 10 } : { ...el, x: el.x };
                        }
                        
                    });
                });
            }

        }, 500);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyLeft, keyDown, keyRight, keyUp, setPositionSquareX, setPositionSquareY, stopMove])

    useEffect(() => {
        squareIsCollidedWithFood();
    }, [positionFoodX, positionFoodY, squareList]);

    useEffect(() => {
        genenerateRandomPositionFood(0, 400);
    }, []);

    return (
        <>
            <div tabIndex={0} className="container-game">
                <Food positionX={positionFoodX} positionY={positionFoodY} size={foodSize} />
                {squareList &&
                    squareList.map(val => (
                        <Square positionX={val.x} positionY={val.y} size={squareSize} />

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