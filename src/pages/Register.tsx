import { useMutation } from '@apollo/client';
import { Form, Input, Button, notification, Card, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { REGISTER_MUTATION } from '../graphql/mutations/auth/registerMutation';
import React from 'react';

function Register() {
    const navigate = useNavigate();
    const [register] = useMutation(REGISTER_MUTATION);

    const handleRegister = async (values: any) => {
        try {
            const { data } = await register({
                variables: {
                    email: values.email,
                    password: values.password,
                    name: values.name,
                    age: values.age,
                },
            });
            const { user } = data.register;
            message.success(`Account successfully created!`);
            navigate(`/login`);
        } catch (error) {
            notification.error({
                message: 'Register failed',
                description: error.message,
            });
        }
    };

    return (
        <Card title="Register">
            <Form onFinish={handleRegister}>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="age" label="Age" rules={[{ required: true }]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <p>
                        Already have an account? <a href="/login">Click here to Login</a>
                    </p>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Register;
