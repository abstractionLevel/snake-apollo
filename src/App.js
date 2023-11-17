import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import Game from './component/game';
import Info from './component/info';

function App() {
	return (
		<Container >
			<Game />
			<br/>
			<Info />
		</Container>
	);
}

export default App;
