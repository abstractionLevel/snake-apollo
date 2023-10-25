import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import Game from './component/game';
import Info from './component/info';

function App() {
	return (
		<Container >
			<Row>
				<Col>
					<div>
						{/* <Info /> */}
					</div>
				</Col>
				<Col>
					<div>
						<Game />
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default App;
