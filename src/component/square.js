import { useEffect, useState } from "react";

const Square = (props) => {

    const [positionX, setPositionX] = useState(0);
    const [positionY,setPositionY] =  useState(0);

    useEffect(()=>{
        setPositionX(props.positionX);
        setPositionY(props.positionY);
    },[props.positionX,props.positionY])

    const squareStyle = {
        width: '32px',
        height: '32px',
        backgroundColor: 'blue',
        position: 'absolute',
        top: `${positionY}px`,
        left: `${positionX}px`,
    }
    return <div style={squareStyle}></div>
}

export default Square;