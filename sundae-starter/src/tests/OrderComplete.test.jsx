import { render, screen } from '../test-utils/test-utils';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';

import OrderComplete from '../components/OrderComplete';
import { test } from 'vitest';

test('error to be displayed on server error', async () => {
	server.resetHandlers(
		http.post('http://localhost:3030/order', () => {
			return new HttpResponse(null, { status: 500 });
		})
	);

	render(<OrderComplete handlePhase={() => vi.fn()} />);

	const error = await screen.findByRole('alert');

	expect(error).toBeInTheDocument();
	expect(error).toHaveTextContent(/Server error occurred/i);
});
