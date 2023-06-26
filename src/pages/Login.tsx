/* eslint-disable react/no-unescaped-entities */
import { useMutation } from '@apollo/client';
import { Form, Input, Button, notification, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/mutations/auth/loginMutation';
import React from 'react';

function Login() {
    const navigate = useNavigate();
    const [login] = useMutation(LOGIN_MUTATION);

    const handleLogin = async (values: any) => {
        try {
            const { data } = await login({
                variables: {
                    email: values.email,
                    password: values.password,
                },
            });

            const { user, token } = data.login;
            message.success(`Welcome ${user.name}!`);
            localStorage.setItem('authToken', token);
            navigate(`/profile/${user.id}`);
            // login({
            //     variables: {
            //         email: values.email,
            //         password: values.password,
            //     },
            // }).then((response) => {
            //     const { user, token } = response.data.login;
            //     message.success(`Welcome ${user.name}!`);
            //     localStorage.setItem('authToken', token);
            //     navigate(`/profile/${user.id}`);
            // });
        } catch (error) {
            notification.error({
                message: 'Login failed',
                description: error.message,
            });
        }
    };

    return (
        <Card title="Login">
            <Form onFinish={handleLogin}>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                <p>
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </Form>
        </Card>
    );
}

export default Login;
