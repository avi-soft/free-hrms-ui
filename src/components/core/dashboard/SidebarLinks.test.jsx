import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidebarLink from './SidebarLink';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

describe('SidebarLink Component', () => {
    const link = {
        icon: 'VscHome',
        label: 'Home',
        children: [
            {
                key: '1',
                icon: 'VscSettings',
                label: 'Settings',
                url: '/settings'
            }
        ]
    };

    test('renders link with icon and label', () => {
        render(
            <Provider store={store}>
            <BrowserRouter>
                <SidebarLink link={link} />
            </BrowserRouter>
            </Provider>
        );

        const icon = screen.getByText(link.icon);
        const label = screen.getByText(link.label);

        expect(icon).toBeInTheDocument();
        expect(label).toBeInTheDocument();
    });

    test('renders children when clicked', () => {
        render(
            <Provider store={store}>
            <BrowserRouter>
                <SidebarLink link={link} />
            </BrowserRouter>
            </Provider>

        );

        const chevron = screen.getByTestId('chevron-icon');
        fireEvent.click(chevron);

        const childLabel = screen.getByText(link.children[0].label);
        expect(childLabel).toBeInTheDocument();
    });

    test('navigates to child link when clicked', () => {
        render(
            <Provider store={store}>
            <BrowserRouter>
                <SidebarLink link={link} />
            </BrowserRouter>
            </Provider>
        );

        const chevron = screen.getByTestId('chevron-icon');
        fireEvent.click(chevron);

        const childLink = screen.getByText(link.children[0].label);
        fireEvent.click(childLink);

        // Assert navigation
        expect(window.location.pathname).toBe(link.children[0].url);
    });
});
