import { Col, Form, Row } from 'react-bootstrap';
import { useOrderDetails } from '../context/OrderDetails';
import { useState } from 'react';

const ScoopOption = ({ name, image }) => {
	const { updateItemCount } = useOrderDetails();
	const [invalidInput, setInvalidInput] = useState(false);

	const handleChange = (e) => {
		const value = parseFloat(e.target.value);

		const isInvalidInput =
			isNaN(value) || value < 0 || value > 3 || value % 1 !== 0;

		setInvalidInput(isInvalidInput);
		updateItemCount(name, isInvalidInput ? 0 : value, 'scoops');
	};

	return (
		<Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
			<img
				style={{ width: '50%' }}
				src={`http://localhost:3030/${image}`}
				alt={`${name} scoop`}
			/>
			<div className='mb-3'>
				<Form.Group
					controlId={`${name}-count`}
					as={Row}
					style={{ marginTop: '10px' }}
				>
					<Form.Label column xs='6' style={{ textAlign: 'right' }}>
						{name}
					</Form.Label>
					<Col xs='5' style={{ textAlign: 'left' }}>
						<Form.Control
							type='number'
							defaultValue={0}
							min={0}
							max={3}
							onChange={handleChange}
							isInvalid={invalidInput}
						/>
					</Col>
				</Form.Group>
			</div>
		</Col>
	);
};
export default ScoopOption;
