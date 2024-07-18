// DepartmentList.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import DepartmentList from './DepartmentList'; // Replace with the actual path
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
const mockStore = require('../../../../../../tests/mocks/mockStore').default;


describe('DepartmentList component', () => {
//   it('renders loading state', () => {
//     const store = mockStore({ department: { loading: true } });
//     render(<DepartmentList store={store} />);

//     expect(screen.getByText(/loading/i)).toBeInTheDocument();
//   });

  it('renders empty departments list', () => {
    const store = mockStore({ department: { AllDepartments: [] } });

    function renderWithContext(element) {
        render(
          <BrowserRouter>
            <Provider store={store}>{element}</Provider>
          </BrowserRouter>
        );
      }
    renderWithContext(<DepartmentList />);

    expect(screen.getByText(/no departments found/i)).toBeInTheDocument();
  });

//   it('renders list of departments', () => {
//     const departments = [
//       { department: 'department1', description: 'description1' },
//       { department: 'department2', description: 'description2' },
//     ];
//     const store = mockStore({ department: { AllDepartments: departments } });
//     render(<DepartmentList store={store} />);

//     const departmentRows = screen.getAllByRole('row');
//     expect(departmentRows.length).toBe(departments.length + 1); // +1 for header row

//     const departmentNames = departmentRows.slice(1).map((row) =>
//       row.querySelector('td').textContent
//     );
//     expect(departmentNames).toEqual(departments.map((d) => d.department));
//   });
});
