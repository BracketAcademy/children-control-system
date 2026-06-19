import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import { JalaliLocaleListener } from 'antd-jalali'
import fa_IR from 'antd/locale/fa_IR'
import { AuthProvider } from './providers/auth';

const APP_FONT_FAMILY =
  "IRANSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        direction="rtl"
        locale={fa_IR}
        theme={{
          token: {
            fontFamily: APP_FONT_FAMILY,
          },
        }}
      >
        <JalaliLocaleListener />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
