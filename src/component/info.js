import './info.css';
import { useSelector } from 'react-redux';

const Info = () => {

    const food = useSelector(state=>state.data.food);
    const position = useSelector(state=>state.data.position);

    return (
        <div className="container-info">
            FOOD: {food}
            <div></div>
            POSITION: x: {position.x}  y: {position.y}
        </div>
    )
}

export default Info;