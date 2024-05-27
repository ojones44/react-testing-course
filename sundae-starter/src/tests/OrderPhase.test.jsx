import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { logRoles } from '@testing-library/react';

import App from '../App';
import { expect } from 'vitest';

test('order phases for happy path', async () => {
	const user = userEvent.setup();
	// render App
	const { unmount } = render(<App />);

	// add scoops and toppings
	const vanillaScoop = await screen.findByRole('spinbutton', {
		name: /vanilla/i,
	});
	const cherriesTopping = await screen.findByRole('checkbox', {
		name: /cherries/i,
	});

	expect(vanillaScoop).toHaveDisplayValue('0');
	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1');
	expect(vanillaScoop).toHaveDisplayValue('1');
	await user.click(cherriesTopping);

	// find and click the 'Review Order' button
	const reviewOrderBtn = screen.getByRole('button', { name: 'Review Order' });
	await user.click(reviewOrderBtn);

	// check summary info based on order
	const scoopsEl = screen.getByText('Scoops: $', { exact: false });
	expect(scoopsEl).toHaveTextContent('2.00');

	// check that toppins are not shown initially
	expect(
		screen.queryByText('Toppings: $', { exact: false })
	).not.toBeInTheDocument();

	// click chekcbox to show the toppings
	const toppingsCheckbox = screen.getByRole('checkbox', {
		name: /show topping options/i,
	});

	await user.click(toppingsCheckbox);

	// check toppings are shown
	const toppingsEl = screen.getByText('Toppings: $', { exact: false });
	expect(toppingsEl).toBeInTheDocument();
	expect(toppingsEl).toHaveTextContent('1.50');

	expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
	expect(screen.getByText('Cherries')).toBeInTheDocument();

	// accept T's & C's and click confirm
	const termsCheckbox = screen.getByRole('checkbox', {
		name: /terms and conditions/i,
	});
	const confirmOrderBtn = screen.getByRole('button', {
		name: /confirm order/i,
	});

	expect(confirmOrderBtn).toBeDisabled();
	await user.click(termsCheckbox);
	expect(confirmOrderBtn).not.toBeDisabled();
	await user.click(confirmOrderBtn);

	// await confirmation and check if loading display renders

	const loadingEl = screen.getByRole('heading', { name: /loading/i });
	expect(loadingEl).toBeInTheDocument();

	// confirm order number is correct on confirmation page
	const orderNumberEl = await screen.findByRole('heading', {
		name: /order number/i,
	});

	expect(orderNumberEl).toHaveTextContent('123456789');

	// click "New Order" button on confirmation page
	const newOrderBtn = screen.getByRole('button', { name: /create new order/i });
	await user.click(newOrderBtn);

	// check that you are back on the order entry page
	const orderEntryHeading = screen.getByRole('heading', {
		name: /design your sundae/i,
	});
	expect(orderEntryHeading).toBeInTheDocument();

	// check that scoops and toppings are reset
	const totals = await screen.findAllByText('total: $', { exact: false });
	totals.forEach((total) => expect(total).toHaveTextContent('0.00'));

	const allScoops = await screen.findAllByRole('spinbutton');
	allScoops.forEach((scoop) => expect(scoop).toHaveDisplayValue('0'));

	const allToppings = await screen.findAllByRole('checkbox');
	allToppings.forEach((topping) => expect(topping).not.toBeChecked());

	// trigger cleanup function to abort network calls
	unmount();
});

test('check that no toppings message displays if no toppings selected', async () => {
	const user = userEvent.setup();
	// render App
	const { unmount } = render(<App />);

	const reviewOrderBtn = screen.getByRole('button', { name: 'Review Order' });
	const vanillaScoop = await screen.findByRole('spinbutton', {
		name: /vanilla/i,
	});

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1');
	await user.click(reviewOrderBtn);

	const toppingsEl = screen.queryByText('Toppings: $', { exact: false });
	expect(toppingsEl).not.toBeInTheDocument();

	expect(screen.getByText('No toppings selected')).toBeInTheDocument();

	unmount();
});
