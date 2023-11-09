import { useEffect, useState } from "react";
import "./game.css";
import Square from "./square";
import Food from "./food";

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
	const [squareList, setSquareList] = useState([
		{ x: 20, y: 20, playable: true, color: "red" },
	]);

	const handleKeyDown = (event) => {
		const directionMapping = {
			ArrowUp: "up",
			ArrowDown: "down",
			ArrowLeft: "left",
			ArrowRight: "right",
		};
		const direction = directionMapping[event.key];
		if (direction) {
			setKeyUp(direction === "up");
			setKeyDown(direction === "down");
			setKeyRight(direction === "right");
			setKeyLeft(direction === "left");
		}
	};

	const getRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	const genenerateRandomPositionFood = (min, max) => {
		let x = getRandomNumber(min, max);
		let y = getRandomNumber(min, max);
		while (x === positionSquareX && y === positionSquareY) {
			x = getRandomNumber(min, max);
			y = getRandomNumber(min, max);
		}
		setPositionFoodX(x);
		setPositionFoodY(y);
	};

	const gameOver = () => {
		setSquareList([{ x: 20, y: 20, playable: true, color: "red" }]);
		setKeyUp(false);
		setKeyDown(false);
		setKeyRight(false);
		setKeyLeft(false);
		setStopMove(true);
	};

	const moveSquare = (square) => {
		if (keyUp) square.y -= squareSize;
		if (keyDown) square.y += squareSize;
		if (keyLeft) square.x -= squareSize;
		if (keyRight) square.x += squareSize;
		return square;
	};

	const setSquaresPlaybleFalse = (squareList) => {
		return squareList.map((item) => ({
			...item,
			playable: false,
			color: "blue",
		}));
	};

	const checkBoundaries = (square) => {
		return (
			square.x < 0 ||
			square.x + squareSize > 500 ||
			square.y < 0 ||
			square.y + squareSize > 700
		);
	};

	const checkCollisionWithFood = (square) => {
		if (
			square.x + squareSize > positionFoodX &&
			square.x < positionFoodX + foodSize &&
			square.y < positionFoodY + foodSize &&
			square.y + squareSize > positionFoodY
		) {
			genenerateRandomPositionFood(0, 400);
			return true;
		}
		return false;

	};

	const updateLastPosition = (lastPositionPlayble, x, y) => {
		lastPositionPlayble.x = x;
		lastPositionPlayble.y = y;
	};

	const updateNotPlaybleSquarePosition = (lastPositionPlayble, square) => {
		let tempX = square.x;
		let tempY = square.y;
		square.x = lastPositionPlayble.x;
		square.y = lastPositionPlayble.y;
		lastPositionPlayble.x = tempX;
		lastPositionPlayble.y = tempY;
	}

	const addNewSquare = squareListCpy => {
		const playbleSquare = squareListCpy.find((val) => val.playable);
		return {
			x: playbleSquare.x,
			y: playbleSquare.y,
			playable: true,
			color: playbleSquare.color,
		};
	}

	useEffect(() => {
	
		let intervalId = setInterval(() => {
			const squareListCpy = [...squareList];
			let lastPositionPlayble = {};
			for (let i = 0; i < squareListCpy.length; i++) {
				const square = squareListCpy[i];
				if (square.playable && !checkCollisionWithFood(square)) {
					const isLost = checkBoundaries(square);
					if (isLost) {
						gameOver();
					} else {
						updateLastPosition(lastPositionPlayble, square.x, square.y);
						moveSquare(square);
						setSquareList(squareListCpy);
					}
				} else if (!square.playable && !checkCollisionWithFood(square)) {
					updateNotPlaybleSquarePosition(lastPositionPlayble, square)
				} else if (checkCollisionWithFood(square)) {
					const newSquareList = setSquaresPlaybleFalse(squareListCpy);
			        const newSquare = addNewSquare(squareListCpy)
					moveSquare(newSquare);
					setSquareList([newSquare, ...newSquareList]);
				}
			}
		}, 500);

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			clearInterval(intervalId);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [keyLeft, keyDown, keyRight, keyUp, , squareList, stopMove]);

	useEffect(() => {
		genenerateRandomPositionFood(0, 400);
	}, []);

	return (
		<>
			<div tabIndex={0} className="container-game">
				<Food
					positionX={positionFoodX}
					positionY={positionFoodY}
					size={foodSize}
				/>
				{squareList &&
					squareList.length > 0 &&
					squareList.map((val) => (
						<Square
							positionX={val.x}
							positionY={val.y}
							size={squareSize}
							color={val.color}
						/>
					))}
			</div>
			<div>
				<p>food: {countFood}</p>
			</div>
		</>
	);
};

export default Game;
