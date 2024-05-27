import { render, screen } from '../test-utils/test-utils';
import userEvent from '@testing-library/user-event';

import ScoopOption from '../components/ScoopOption';

test('check that error is handled for text input inside spinbuttons', async () => {
	const user = userEvent.setup();
	render(<ScoopOption name='Vanilla' image='/images/vanilla.png' />);

	const vanillaScoop = await screen.findByRole('spinbutton', {
		name: /vanilla/i,
	});

	expect(vanillaScoop).not.toHaveClass('invalid');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '5');

	expect(vanillaScoop).toHaveClass('is-invalid');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1.5');

	expect(vanillaScoop).toHaveClass('is-invalid');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '-2');

	expect(vanillaScoop).toHaveClass('is-invalid');

	await user.clear(vanillaScoop);
	await user.type(vanillaScoop, '1');

	expect(vanillaScoop).not.toHaveClass('is-invalid');
});
