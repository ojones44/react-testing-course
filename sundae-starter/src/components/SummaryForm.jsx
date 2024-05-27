import { Form, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react';

const SummaryForm = ({ handlePhase }) => {
	const [tcChecked, setTcChecked] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		handlePhase('complete');
	};

	const popover = (
		<Popover id='popover-basic'>
			<Popover.Body>No ice cream will actually be delivered</Popover.Body>
		</Popover>
	);

	const checkboxLabel = (
		<span>
			I agree to
			<OverlayTrigger placement='right' overlay={popover}>
				<span style={{ color: 'blue', cursor: 'pointer' }}>
					Terms and Conditions
				</span>
			</OverlayTrigger>
		</span>
	);

	return (
		<Form>
			<Form.Group controlId='terms-and-conditions'>
				<Form.Check
					type='checkbox'
					checked={tcChecked}
					onChange={(e) => setTcChecked(e.target.checked)}
					label={checkboxLabel}
				/>
			</Form.Group>
			<Button
				variant='primary'
				type='submit'
				disabled={!tcChecked}
				onClick={handleSubmit}
			>
				Confirm order
			</Button>
		</Form>
	);
};

export default SummaryForm;
