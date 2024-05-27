import { Button, Spinner } from 'react-bootstrap';
import { useOrderDetails } from '../context/OrderDetails';
import axios from 'axios';
import AlertBanner from './AlertBanner';

import { useEffect, useState } from 'react';

const OrderComplete = ({ handlePhase }) => {
	const { resetOrder } = useOrderDetails();
	const [isLoading, setIsLoading] = useState(true);
	const [orderNumber, setOrderNumber] = useState(null);
	const [fetchError, setFetchError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchOrderNumber = async () => {
			try {
				const res = await axios.post('http://localhost:3030/order', {
					signal: abortController.signal,
				});

				setOrderNumber(res.data.orderNumber);
			} catch (error) {
				if (error.name === 'AbortError' || error.name === 'CanceledError') {
					console.log('Request aborted');
				} else {
					setFetchError(`Server error occurred: ${error.message}`);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrderNumber();

		return () => abortController.abort();
	}, []);

	const handleRestart = () => {
		resetOrder();
		handlePhase();
	};

	if (isLoading)
		return (
			<div style={{ display: 'flex' }}>
				<h1>Loading...</h1>
				<Spinner animation='border' />
			</div>
		);

	if (fetchError)
		return (
			<>
				<AlertBanner msg={fetchError} />
				<Button variant='primary' onClick={handleRestart}>
					Create new order
				</Button>
			</>
		);

	if (orderNumber) {
		return (
			<>
				<h1>Thank you!</h1>
				<h2>Your order number is {orderNumber}</h2>
				<p>Even though you will not have any sundae...</p>
				<Button variant='primary' onClick={handleRestart}>
					Create new order
				</Button>
			</>
		);
	}

	return <div>An unexpected error occured</div>;
};
export default OrderComplete;
