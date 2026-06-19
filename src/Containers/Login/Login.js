import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/auth';
import { login as loginApi } from '../../api/auth';

const { Title } = Typography;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const { username, password } = values;
      const response = await loginApi(username, password);
      if (response.token) {
        login(response.token);
        navigate('/');
      } else {
        setError('توکن دریافت نشد.');
      }
    } catch (err) {
      setError('نام کاربری یا رمز عبور نامعتبر است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          ورود به سامانه
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}
        <Form layout="vertical" onFinish={onFinish} dir="rtl">
          <Form.Item
            label="نام کاربری"
            name="username"
            rules={[{ required: true, message: 'لطفاً نام کاربری را وارد کنید' }]}
          >
            <Input placeholder="نام کاربری را وارد کنید" disabled={loading} />
          </Form.Item>
          <Form.Item
            label="رمز عبور"
            name="password"
            rules={[{ required: true, message: 'لطفاً رمز عبور را وارد کنید' }]}
          >
            <Input.Password placeholder="رمز عبور را وارد کنید" disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              ورود
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;