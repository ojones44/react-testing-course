import { createContext, useContext, useState } from 'react';
import { pricePerItem } from '../constants';

const OrderDetails = createContext();

// create custom hook to check whether we are in a provider
export function useOrderDetails() {
	const contextValue = useContext(OrderDetails);

	// check if the value is truthy or falsy
	if (!contextValue) {
		throw new Error(
			'useOrderDetails must be called from within OrderDetailsProvider'
		);
	}

	return contextValue;
}

// store order details, such as number of scoops and toppings, and what kind
export function OrderDetailsProvider({ props, children }) {
	const initalState = {
		scoops: {}, // example: { Vanilla: 2 }
		toppings: {},
	};

	const [optionCounts, setOptionCounts] = useState(initalState);

	const updateItemCount = (itemName, newItemCount, optionType) => {
		const newOptionCounts = { ...optionCounts };
		newOptionCounts[optionType][itemName] = newItemCount;
		setOptionCounts(newOptionCounts);
	};

	const resetOrder = () => {
		setOptionCounts(initalState);
	};

	const calcTotal = (optionType) => {
		const counts = Object.values(optionCounts[optionType]);
		const total = counts.reduce((acc, item) => acc + item, 0);

		return total * pricePerItem[optionType];
	};

	const totals = {
		scoops: calcTotal('scoops'),
		toppings: calcTotal('toppings'),
	};

	const grandTotal = totals.scoops + totals.toppings;

	const value = {
		optionCounts,
		totals,
		grandTotal,
		updateItemCount,
		resetOrder,
	};

	return (
		<OrderDetails.Provider value={value} {...props}>
			{children}
		</OrderDetails.Provider>
	);
}
