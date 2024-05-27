import SummaryForm from './SummaryForm';
import { useOrderDetails } from '../context/OrderDetails';
import { formatPrice } from '../utils';
import { Form } from 'react-bootstrap';
import { useState } from 'react';

const OrderSummary = ({ handlePhase }) => {
	const { totals, optionCounts, grandTotal } = useOrderDetails();
	const [toppingsChecked, setToppingsSchecked] = useState(false);

	const scoopsEntries = Object.entries(optionCounts.scoops);
	const toppingsEntries = Object.entries(optionCounts.toppings);

	const scoopsList = scoopsEntries.map(([scoop, amount]) => (
		<li key={scoop}>
			{amount} {scoop}
		</li>
	));

	let toppingsList = null;

	if (totals.toppings > 0) {
		toppingsList = toppingsEntries.map(([topping, checked]) => {
			if (checked) {
				return <li key={topping}>{topping}</li>;
			}
		});
	}

	return (
		<div>
			<h2>Order Summary</h2>

			<h4>Scoops: {formatPrice(totals.scoops)}</h4>
			<ul>{scoopsList}</ul>

			{totals.toppings === 0 ? (
				<p>No toppings selected</p>
			) : (
				<Form.Group controlId='show-hide-toppings'>
					<Form.Check
						type='checkbox'
						checked={toppingsChecked}
						onChange={(e) => setToppingsSchecked(e.target.checked)}
						label='Show topping options'
					/>
				</Form.Group>
			)}
			{toppingsChecked && (
				<>
					<h4>Toppings: {formatPrice(totals.toppings)}</h4>
					<ul>{toppingsList}</ul>
				</>
			)}

			<h2>Grand total: {formatPrice(grandTotal)}</h2>

			<SummaryForm handlePhase={handlePhase} />
		</div>
	);
};
export default OrderSummary;
