import { render, screen } from '../test-utils/test-utils';
import userEvent from '@testing-library/user-event';

// component imports
import Options from '../components/Options';
import OrderEntry from '../components/OrderEntry';
import { expect } from 'vitest';

describe('test subtotals for scoops and toppings sections', () => {
	test('update scoop subtotal when scoops change', async () => {
		const user = userEvent.setup();
		render(<Options optionType='scoops' />);

		// make sure total starts out at $0.00
		// used findBy because my component renders asynchronously becuase of an isLoading state
		const scoopsSubtotal = await screen.findByText('Scoops total: $', {
			exact: false,
		});

		// to have text content doesn't mean this will be the ONLy text. It just needs to include. So like using str.includes('some text')
		expect(scoopsSubtotal).toHaveTextContent('0.00');

		// get vanilla scoops and check it starts at 0
		// scoops are rendered asynchronously because pics and data are from server. So using find
		const vanillaScoop = await screen.findByRole('spinbutton', {
			name: 'Vanilla',
		});

		// increment scoops by 1
		await user.clear(vanillaScoop);
		await user.type(vanillaScoop, '1');
		expect(scoopsSubtotal).toHaveTextContent('2.00');

		const chocolateScoop = await screen.findByRole('spinbutton', {
			name: 'Chocolate',
		});

		// need to clear first because type will 'append' whatever is already in the input box
		await user.clear(chocolateScoop);
		await user.type(chocolateScoop, '2');

		// check subtotal now equals $6.00
		expect(scoopsSubtotal).toHaveTextContent('6.00');
	});

	test('update topping subtotal when toppings change', async () => {
		const user = userEvent.setup();
		render(<Options optionType='toppings' />);

		// using find because this components renders asynchronously due to an isLoading state
		const toppingsSubtotal = await screen.findByText('Toppings total: $', {
			exact: false,
		});

		expect(toppingsSubtotal).toHaveTextContent('0.00');

		const cherriesCheckbox = await screen.findByRole('checkbox', {
			name: /cherries/i,
		});
		const mochiCheckbox = await screen.findByRole('checkbox', {
			name: /mochi/i,
		});

		expect(cherriesCheckbox).not.toBeChecked();
		await user.click(cherriesCheckbox);
		expect(cherriesCheckbox).toBeChecked();
		expect(toppingsSubtotal).toHaveTextContent('1.50');

		expect(mochiCheckbox).not.toBeChecked();
		await user.click(mochiCheckbox);
		expect(mochiCheckbox).toBeChecked();
		expect(toppingsSubtotal).toHaveTextContent('3.00');

		await user.click(mochiCheckbox);
		expect(mochiCheckbox).not.toBeChecked();
		expect(toppingsSubtotal).toHaveTextContent('1.50');
	});
});

describe('grand total', () => {
	test('grand total starts at $0.00', () => {
		// destructure unmount from the render function
		const { unmount } = render(<OrderEntry />);

		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});
		expect(grandTotal).toHaveTextContent('0.00');

		// call the unmount function
		// used because we're unmounting manually to account for any unfinished network requests elsewhere in component
		unmount();
	});

	test('grand total updates correctly if topping added first', async () => {
		const user = userEvent.setup();
		render(<OrderEntry />);

		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});

		const cherriesTopping = await screen.findByRole('checkbox', {
			name: /cherries/i,
		});

		await user.click(cherriesTopping);
		expect(grandTotal).toHaveTextContent('1.50');
	});
	test('grand total updates correctly if scoop added first', async () => {
		const user = userEvent.setup();
		render(<OrderEntry />);

		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});

		const vanillaScoop = await screen.findByRole('spinbutton', {
			name: /vanilla/i,
		});

		await user.clear(vanillaScoop);
		await user.type(vanillaScoop, '3');
		expect(grandTotal).toHaveTextContent('6.00');
	});

	test('grand total updates correctly if item is removed', async () => {
		const user = userEvent.setup();
		render(<OrderEntry />);

		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});

		const vanillaScoop = await screen.findByRole('spinbutton', {
			name: /vanilla/i,
		});

		await user.clear(vanillaScoop);
		await user.type(vanillaScoop, '3');
		expect(grandTotal).toHaveTextContent('6.00');

		await user.clear(vanillaScoop);
		await user.type(vanillaScoop, '1');
		expect(grandTotal).toHaveTextContent('2.00');
	});
});
