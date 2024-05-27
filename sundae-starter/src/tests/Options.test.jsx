import { render, screen } from '../test-utils/test-utils';

import Options from '../components/Options';
import { expect } from 'vitest';

describe('option component testing', () => {
	test('displays image for each scoop option from server', async () => {
		render(<Options optionType='scoops' />);

		// find images
		const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
		expect(scoopImages).toHaveLength(2);

		// confirm alt text of images
		const altText = scoopImages.map((el) => el.alt);
		expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop']);
	});

	test('displays image for each topping option from server', async () => {
		render(<Options optionType='toppings' />);

		// find images
		const toppingImages = await screen.findAllByRole('img', {
			name: /topping$/i,
		});
		expect(toppingImages).toHaveLength(3);

		// confirm alt text of images
		const altText = toppingImages.map((el) => el.alt);
		expect(altText).toEqual([
			'Mochi topping',
			'Cherries topping',
			'Hot fudge topping',
		]);
	});
});
