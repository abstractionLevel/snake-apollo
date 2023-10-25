import { useEffect, useState } from "react"

const Food = (props) => {

    const [positionX,setPositionX] = useState(0);
    const [positionY,setPositionY] = useState(0);

    const style = {
        width:  `${props.size}px`,
        height: `${props.size}px`,
        position: "absolute",
        left: `${positionX}px`,
        top: `${positionY}px`,
        backgroundColor: 'red',
    }

    useEffect(()=>{
        setPositionX(props.positionX);
        setPositionY(props.positionY);
    },[props.positionX,props.positionY])

    return <div style={style}></div>
}

export default Food;