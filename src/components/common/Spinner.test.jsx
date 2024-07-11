import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Spinner from './Spinner';

test('renders Spinner component', () => {
  const { container } = render(<Spinner />);
  const loaderDiv = container.querySelector('.custom-loader');
  
  expect(loaderDiv).toBeInTheDocument();
});
