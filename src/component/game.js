            import { useEffect, useState } from 'react';
            import './game.css';
            import Square from './square';
            import Food from './food';

            const Game = () => {

                const [positionSquareX, setPositionSquareX] = useState(10);
                const [positionSquareY, setPositionSquareY] = useState(0);
                const [positionFoodX,setPositionFoodX] = useState(100);
                const [positionFoodY,setPositionFoodY] = useState(0);
                const [keyUp, setKeyUp] = useState(false);
                const [keyDown, setKeyDown] = useState(false);
                const [keyLeft, setKeyLeft] = useState(false);
                const [keyRight, setKeyRight] = useState(false);
                const [hasEaten,setHasEaten] = useState(false);
                const [stopMove,setStopMove] = useState(false);
                const [squareSize,setSquareSize] = useState(24);
                const [foodSize,setFoodSize] = useState(12);


                console.log("posizione Square x ", positionSquareX  , " position square y " , positionSquareY);
                console.log("posizione di food x ", positionFoodX, " position food y ", positionFoodY)

                const squareIsCollidedWithFood = () => {
                    if(positionSquareX + squareSize > positionFoodX &&
                        positionSquareX  < positionFoodX + foodSize &&
                        positionSquareY < positionFoodY + foodSize &&
                        positionSquareY + squareSize > positionFoodY) {
                            setStopMove(true);
                        }
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
                    // setPositionFoodX(genenerateRandomValue(0,50));
                    // setPositionFoodY(0);
                },[])

                useEffect(() => {

                    if(stopMove) {
                        return () => clearInterval(intervalId && intervalId );
                    }
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
                }, [keyLeft, keyDown, keyRight, keyUp, setPositionSquareX, setPositionSquareY,stopMove])

                useEffect(()=>{
                    squareIsCollidedWithFood();
                },[positionFoodX,positionFoodY,positionSquareX,positionSquareY])

                return (
                    <>
                        <div tabIndex={0} className="container-game">
                            <Square positionX={positionSquareX} positionY={positionSquareY} size={squareSize} />
                            <Food positionX={positionFoodX} positionY={positionFoodY} size={foodSize}/>
                            
                        </div>
                        <button onClick={(A) => setKeyRight(true)} >start</button>
                    </>

                )
            }

            export default Game;