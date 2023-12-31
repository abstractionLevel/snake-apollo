import './info.css';
import { useSelector } from 'react-redux';

const Info = () => {

    const food = useSelector(state=>state.data.food);
    const position = useSelector(state=>state.data.position);

    return (
        <div className="container-info">
           <span >FOOD: {food}</span> 
            <div></div>
            <span>POSITION: x: {position.x}  y: {position.y}</span>
        </div>
    )
}

export default Info;