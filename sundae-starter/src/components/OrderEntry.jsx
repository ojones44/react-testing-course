import Options from './Options';
import { useOrderDetails } from '../context/OrderDetails';
import { formatPrice } from '../utils';
import { Button } from 'react-bootstrap';

const OrderEntry = ({ handlePhase }) => {
	const sections = ['scoops', 'toppings'];
	const { grandTotal, totals } = useOrderDetails();

	return (
		<>
			<header style={{ textAlign: 'center' }}>
				<h1>Design your sundae!</h1>
			</header>
			<section>
				{sections.map((section) => {
					return <Options key={section} optionType={section} />;
				})}
			</section>
			<h2>Grand total: {formatPrice(grandTotal)}</h2>
			<Button
				disabled={totals.scoops === 0}
				variant='primary'
				onClick={handlePhase}
			>
				Review Order
			</Button>
		</>
	);
};
export default OrderEntry;
