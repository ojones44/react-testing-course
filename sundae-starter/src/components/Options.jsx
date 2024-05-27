import axios from 'axios';
import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import ScoopOption from './ScoopOption';
import ToppingOption from './ToppingOption';
import AlertBanner from './AlertBanner';
import { useOrderDetails } from '../context/OrderDetails';
import { pricePerItem } from '../constants';
import { formatPrice } from '../utils';

const Options = ({ optionType }) => {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState('');
	const { totals } = useOrderDetails();

	useEffect(() => {
		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				const res = await axios.get(`http://localhost:3030/${optionType}`, {
					signal: abortController.signal,
				});
				setItems(res.data);
				setIsLoading(false);
			} catch (error) {
				if (error.name === 'AbortError' || error.name === 'CanceledError') {
					console.log('Request aborted');
				} else {
					console.error('Error fetching data:', error);
					setFetchError(`Error fetching data: ${error}`);
					setIsLoading(false);
				}
			}
		};
		fetchData();

		return () => abortController.abort();
	}, [optionType]);

	const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;
	const title = `${optionType[0].toUpperCase()}${optionType
		.slice(1)
		.toLowerCase()}`;
	const Info = (
		<>
			<h2>{title}</h2>
			<p>{formatPrice(pricePerItem[optionType])} each</p>
			<p>
				{title} total: {formatPrice(totals[optionType])}
			</p>
		</>
	);

	return (
		<>
			{isLoading ? (
				<h1>Loading tasty treats...</h1>
			) : fetchError ? (
				<AlertBanner msg={fetchError} />
			) : (
				<>
					{Info}
					<Row>
						{items.map((item) => (
							<ItemComponent
								key={item.name}
								name={item.name}
								image={item.imagePath}
							/>
						))}
					</Row>
				</>
			)}
		</>
	);
};
export default Options;
