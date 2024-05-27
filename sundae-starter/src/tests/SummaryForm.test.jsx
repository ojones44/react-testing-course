// test library imports
import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

// component imports
import SummaryForm from '../components/SummaryForm';

describe('checkbox and button flow', () => {
	test('should render checkbox and button', () => {
		render(<SummaryForm />);

		const btnElement = screen.getByRole('button', { name: /confirm/i });
		const checkboxElement = screen.getByRole('checkbox', { name: /terms/i });

		expect(btnElement).toBeInTheDocument();
		expect(checkboxElement).toBeInTheDocument();
	});

	test('checkbox and button functionality', async () => {
		render(<SummaryForm />);

		const user = userEvent.setup();
		const btnElement = screen.getByRole('button', { name: /confirm/i });
		const checkboxElement = screen.getByRole('checkbox', { name: /terms/i });

		expect(btnElement).toBeDisabled();
		expect(checkboxElement).not.toBeChecked();
		await user.click(checkboxElement);
		expect(checkboxElement).toBeChecked();
		expect(btnElement).toBeEnabled();
		await user.click(checkboxElement);
		expect(checkboxElement).not.toBeChecked();
		expect(btnElement).toBeDisabled();
	});
});

test('popover responds to hover', async () => {
	const user = userEvent.setup();
	render(<SummaryForm />);

	const nullPopover = screen.queryByText(
		/no ice cream will actually be delivered/i
	);
	expect(nullPopover).not.toBeInTheDocument();

	const termsAndConditions = screen.getByText(/terms and conditions/i);
	await user.hover(termsAndConditions);
	const shownPopover = screen.getByText(
		/no ice cream will actually be delivered/i
	);
	expect(shownPopover).toBeInTheDocument();

	await user.unhover(termsAndConditions);
	expect(shownPopover).not.toBeInTheDocument();
});
