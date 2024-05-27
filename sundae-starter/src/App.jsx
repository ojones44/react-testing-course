import { useState } from 'react';

import OrderEntry from './components/OrderEntry';
import OrderSummary from './components/OrderSummary';
import OrderComplete from './components/OrderComplete';

import { Container } from 'react-bootstrap';
import { OrderDetailsProvider } from './context/OrderDetails';

function App() {
	const [orderPhase, setOrderPhase] = useState('inProgress');

	const OrderPhaseComponent =
		orderPhase === 'inProgress' ? (
			<OrderEntry handlePhase={() => setOrderPhase('review')} />
		) : orderPhase === 'review' ? (
			<OrderSummary handlePhase={() => setOrderPhase('complete')} />
		) : orderPhase === 'complete' ? (
			<OrderComplete handlePhase={() => setOrderPhase('inProgress')} />
		) : (
			<h1>An error occured</h1>
		);

	return (
		<div>
			<Container>
				<OrderDetailsProvider>{OrderPhaseComponent}</OrderDetailsProvider>
			</Container>
		</div>
	);
}

export default App;
