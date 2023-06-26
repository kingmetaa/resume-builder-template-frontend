/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import React from 'react';
import { GET_USER_QUERY } from '../graphql/query/users/getUser';
import { useQuery } from '@apollo/client';
import ViewProfile from './ViewProfile';
import { Button, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

function Profile() {
    const { id } = useParams();
    const parsedId = id ? parseInt(id, 10) : undefined;
    const { data, refetch } = useQuery(GET_USER_QUERY, { variables: { id: parsedId } });
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setUser(data.getUser);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, []);

    const handleEditClick = () => {
        navigate(`/profile/${id}/edit`, { replace: true });
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate(`/login`, { replace: true });
    };

    return (
        <Card style={{ textAlign: 'center' }}>
            <ViewProfile currentUser={user} />
            {user ? (
                <>
                    <Button style={{ marginTop: '16px' }} onClick={handleEditClick}>
                        Edit
                    </Button>
                    <Button style={{ marginTop: '16px' }} onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : null}
        </Card>
    );
}

export default Profile;
