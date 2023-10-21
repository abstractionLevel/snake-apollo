import { useEffect, useState } from "react"

const Food = (props) => {

    const [positionX,setPositionX] = useState(0);
    const [positionY,setPositionY] = useState(0);

    const style = {
        width: "12px",
        height: "12px",
        position: "absolute",
        left: `${positionX}px`,
        top: `${positionY}px`,
        backgroundColor: 'red',
    }

    useEffect(()=>{
        console.log("position x aggiornata ", props.positionX)
        setPositionX(props.positionX);
        setPositionY(props.positionY);
    },[props.positionX,props.positionY])

    return <div style={style}></div>
}

export default Food;