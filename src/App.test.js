import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './providers/auth';
import App from './App';

test('renders login page at /login', () => {
  render(
    <AuthProvider>
      <ConfigProvider>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </ConfigProvider>
    </AuthProvider>
  );
  expect(screen.getByRole('button', { name: /ورود/i })).toBeInTheDocument();
});
