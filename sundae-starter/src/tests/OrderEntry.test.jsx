import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

import { render, screen } from '../test-utils/test-utils';
import OrderEntry from '../components/OrderEntry';
import { expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

test('handles error for scoops and toppings options', async () => {
	// reset handlers method can take handlers as arguments, which then ovveride anything with those specified endpoints.

	// in this test, we are essentially overriding the handlers that are already overriding the actualt axios request, in order to turn that response into an error.
	server.resetHandlers(
		http.get('http://localhost:3030/scoops', () => {
			return new HttpResponse(null, { status: 500 });
		}),
		http.get('http://localhost:3030/toppings', () => {
			return new HttpResponse(null, { status: 500 });
		})
	);

	render(<OrderEntry handlePhase={() => vi.fn()} />);

	const alerts = await screen.findAllByText(/error fetching data/i);

	expect(alerts).toHaveLength(2);
});

test('order button disabled if no scoops selected', async () => {
	const user = userEvent.setup();
	render(<OrderEntry handlePhase={vi.fn()} />);

	// find and expect button to be initally disabled
	const reviewOrderBtn = screen.getByRole('button', { name: 'Review Order' });
	expect(reviewOrderBtn).toBeInTheDocument();
	expect(reviewOrderBtn).toBeDisabled();

	const vanillaScoop = await screen.findByRole('spinbutton', {
		name: /vanilla/i,
	});

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1');

	expect(reviewOrderBtn).toBeEnabled();

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '0');

	expect(reviewOrderBtn).toBeDisabled();
});

test('check that error grand total does not update with invalid inputs', async () => {
	const user = userEvent.setup();
	render(<OrderEntry handlePhase={vi.fn()} />);

	const vanillaScoop = await screen.findByRole('spinbutton', {
		name: /vanilla/i,
	});
	const grandTotal = screen.getByText('Grand total: $', { exact: false });

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1.5');

	expect(vanillaScoop).toHaveDisplayValue('1.5');
	expect(grandTotal).not.toHaveTextContent('NaN');
	expect(grandTotal).toHaveTextContent('0.00');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1');

	expect(vanillaScoop).toHaveDisplayValue('1');
	expect(grandTotal).toHaveTextContent('2.00');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '20');

	expect(vanillaScoop).toHaveDisplayValue('20');
	expect(grandTotal).not.toHaveTextContent('NaN');
	expect(grandTotal).toHaveTextContent('0.00');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '0');

	expect(grandTotal).not.toHaveTextContent('NaN');
	expect(grandTotal).toHaveTextContent('0.00');
});
