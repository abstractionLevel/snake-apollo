import { useEffect, useState } from "react";
import "./game.css";
import Square from "./square";
import Food from "./food";

const LEFT = 0;
const RIGHT =  500;
const TOP = 0;
const BOTTOM = 700;
const SQUARE_SIZE = 24;
const FOOD_SIZE = 12;

const Game = () => {

	const [positionFoodX, setPositionFoodX] = useState(100);
	const [positionFoodY, setPositionFoodY] = useState(0);
	const [keyUp, setKeyUp] = useState(false);
	const [keyDown, setKeyDown] = useState(false);
	const [keyLeft, setKeyLeft] = useState(false);
	const [keyRight, setKeyRight] = useState(false);
	const [countFood, setCountFood] = useState(0);

	const [squareList, setSquareList] = useState([
		{ x: LEFT, y: 20, playable: true, color: "red" },
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
		const playable = squareList.find(square=>square.playable);
		while (x === playable.x && y === playable.y) {
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
	};

	const moveSquare = (square) => {
		if (keyUp) square.y -= SQUARE_SIZE;
		if (keyDown) square.y += SQUARE_SIZE;
		if (keyLeft) square.x -= SQUARE_SIZE;
		if (keyRight) square.x += SQUARE_SIZE;
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
		console.log(square.x)
		return (
			square.x < TOP ||
			square.x + SQUARE_SIZE > RIGHT ||
			square.y < LEFT ||
			square.y + SQUARE_SIZE > BOTTOM
		);
	};

	const checkCollisionWithFood = (square) => {
		if (
			square.x + SQUARE_SIZE > positionFoodX &&
			square.x < positionFoodX + FOOD_SIZE &&
			square.y < positionFoodY + FOOD_SIZE &&
			square.y + SQUARE_SIZE > positionFoodY
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

	const checkPlayableSquareCillionWidthSquare = (square,squareListCpy) => {
		if (squareListCpy.length > 1) {
			for (let y = 0; y < squareListCpy.length; y++) {
				let squareNotPlayble = squareListCpy[y];
				if (!squareNotPlayble.playable) {
					if (square.x + SQUARE_SIZE > squareNotPlayble.x && square.x < squareNotPlayble.x + SQUARE_SIZE &&
						square.y < squareNotPlayble.y + SQUARE_SIZE && square.y + SQUARE_SIZE > squareNotPlayble.y) {
						gameOver();
						return true;
					}
				}
			}
		}
		return false;
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
						if(checkPlayableSquareCillionWidthSquare(square,squareListCpy)) return;
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyLeft, keyDown, keyRight, keyUp, squareList]);

	useEffect(() => {
		genenerateRandomPositionFood(0, 400);
	}, []);

	return (
		<>
			<div tabIndex={0} className="container-game">
				<Food
					positionX={positionFoodX}
					positionY={positionFoodY}
					size={FOOD_SIZE}
				/>
				{squareList &&
					squareList.length > 0 &&
					squareList.map((val) => (
						<Square
							positionX={val.x}
							positionY={val.y}
							size={SQUARE_SIZE}
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
