import { Col, Row, Form } from 'react-bootstrap';
import { useOrderDetails } from '../context/OrderDetails';

const ToppingOption = ({ name, image }) => {
	const { updateItemCount } = useOrderDetails();

	const handleChange = (e) => {
		updateItemCount(name, e.target.checked ? 1 : 0, 'toppings');
	};

	return (
		<Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
			<img
				style={{ width: '50%' }}
				src={`http://localhost:3030/${image}`}
				alt={`${name} topping`}
			/>
			<Form>
				<Form.Group
					controlId={`${name}-topping-checkbox`}
					as={Row}
					style={{ marginTop: '10px' }}
				>
					<Form.Check type='checkbox' label={name} onChange={handleChange} />
				</Form.Group>
			</Form>
		</Col>
	);
};
export default ToppingOption;
