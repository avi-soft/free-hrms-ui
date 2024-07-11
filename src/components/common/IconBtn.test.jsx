import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IconBtn from './IconBtn';

describe('IconBtn component', () => {
  test('renders button with text', () => {
    render(<IconBtn text="Click Me" />);

    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
  });

  test('button click triggers onClick handler', () => {
    const onClickMock = jest.fn();
    render(<IconBtn text="Click Me" onclick={onClickMock} />);

    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('renders button with children', () => {
    render(
      <IconBtn text="Click Me">
        <span>Icon</span>
      </IconBtn>
    );

    const button = screen.getByText('Click Me');
    const icon = screen.getByText('Icon');
    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  test('button is disabled when disabled prop is true', () => {
    render(<IconBtn text="Click Me" disabled />);

    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
  });

  test('button has correct classes when outline prop is true', () => {
    render(<IconBtn text="Click Me" outline />);

    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('text-yellow-50 bg-slate-950 border-[1px] border-yellow-50');
  });

  test('button has correct classes when color prop is 0', () => {
    render(<IconBtn text="Click Me" color={0} />);

    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('bg-slate-900 text-white');
  });

  test('button has custom width when customWidth prop is provided', () => {
    render(<IconBtn text="Click Me" customWidth="w-32" />);

    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('w-32');
  });
});
