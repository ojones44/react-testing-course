import { render, screen } from '@testing-library/react';

import AlertBanner from '../components/AlertBanner';
import { expect } from 'vitest';

test('alert banner renders message', () => {
	render(<AlertBanner msg='testing alert banner' />);

	const alert = screen.getByRole('alert');

	expect(alert).toHaveTextContent('testing alert banner');
});
