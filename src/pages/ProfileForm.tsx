/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import UploadImage from './UploadImage';
import ExperienceForm from './ExperienceForm';
import localForage from 'localforage';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_MUTATION } from '../graphql/mutations/users/updateUser';
import { GET_USER_QUERY } from '../graphql/query/users/getUser';
import { CREATE_EXPERIENCE_MUTATION } from '../graphql/mutations/users/experiences/createExperience';
import { UPDATE_EXPERIENCE_MUTATION } from '../graphql/mutations/users/experiences/updateExperience';
import { DELETE_EXPERIENCE_MUTATION } from '../graphql/mutations/users/experiences/deleteExperience';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

interface JobExperience {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    description: string;
}

function ProfileForm() {
    const { id } = useParams();
    const parsedId = id ? parseInt(id, 10) : undefined;
    const [form] = Form.useForm();
    const [experiences, setExperiences] = useState<JobExperience[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
    const [submittedValues, setSubmittedValues] = useState<any>(null);
    const navigate = useNavigate();

    const { data } = useQuery(GET_USER_QUERY, { variables: { id: parsedId } });
    const currentUser = data?.getUser;

    useEffect(() => {
        if (currentUser) {
            form.setFieldsValue({
                name: currentUser.name,
                age: currentUser.age,
                profilePicture: currentUser.profilePicture,
            });
            setExperiences(currentUser.workExperience);
            setImageUrl(currentUser.profilePicture);
        }
    }, [currentUser]);

    const [updateUser] = useMutation(UPDATE_USER_MUTATION, {});
    const [createExperience] = useMutation(CREATE_EXPERIENCE_MUTATION, {});
    const [updateExperience] = useMutation(UPDATE_EXPERIENCE_MUTATION, {});
    const [deleteExperience] = useMutation(DELETE_EXPERIENCE_MUTATION, {});

    const submitData = (formData, currentUser) => {
        const currentExperienceIds = currentUser.workExperience?.map((experience) => experience.id);
        const newExperiences = formData.experiences;

        currentUser.workExperience?.map((experience) => {
            if (!newExperiences.map((experience) => experience.id).includes(experience.id)) {
                try {
                    deleteExperience({
                        variables: {
                            id: experience.id,
                        },
                    });
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                }
            }
        });
        newExperiences?.map((experience) => {
            if (!currentExperienceIds.includes(experience.id)) {
                createExperience({
                    variables: {
                        userId: parsedId,
                        company: experience.company,
                        companyLogo: experience.companyLogo,
                        jobTitle: experience.jobTitle,
                        startDate: experience.startDate,
                        endDate: experience.endDate,
                        description: experience.description,
                    },
                });
            } else {
                updateExperience({
                    variables: {
                        id: experience.id,
                        userId: parsedId,
                        company: experience.company,
                        companyLogo: experience.companyLogo,
                        jobTitle: experience.jobTitle,
                        startDate: experience.startDate,
                        endDate: experience.endDate,
                        description: experience.description,
                    },
                });
            }
        });

        updateUser({
            variables: {
                id: parsedId,
                name: formData.name,
                profilePicture: formData.profilePicture,
                age: formData.age,
            },
        });
        navigate(`/profile/${currentUser.id}`);
    };

    const onFinish = async (values: any) => {
        const formData = {
            ...values,
            experiences: experiences,
        };
        if (isOnline) {
            submitData(formData, currentUser);
        } else {
            formData.experiences.map((experience) => {
                experience.startDate = new Date(experience.startDate).toISOString();
                experience.endDate = new Date(experience.endDate).toISOString() ?? '';
            });
            localForage.setItem('offlineFormData', formData);
            localForage.setItem('offlineCurrentUser', currentUser);
            form.resetFields();
        }
        setSubmittedValues(formData);
    };

    const onFinishFailed = (errorInfo: any) => {
        // eslint-disable-next-line no-console
        console.log('Failed:', errorInfo);
    };

    const submitFormDataWhenBackOnline = (formData, currentUser) => {
        setSubmittedValues(formData);
        submitData(formData, currentUser);
    };
    const handleNetworkChange = () => {
        setIsOnline(navigator.onLine);
        if (navigator.onLine) {
            localForage.getItem('offlineFormData').then((formData) => {
                if (formData) {
                    localForage.getItem('offlineCurrentUser').then((currentUser) => {
                        if (currentUser) {
                            submitFormDataWhenBackOnline(formData, currentUser);
                            localForage.removeItem('offlineFormData');
                            localForage.removeItem('offlineCurrentUser');
                        }
                    }, console.error);
                }
            });
        }
    };

    useEffect(() => {
        window.addEventListener('online', handleNetworkChange);
        window.addEventListener('offline', handleNetworkChange);

        return () => {
            window.removeEventListener('online', handleNetworkChange);
            window.removeEventListener('offline', handleNetworkChange);
        };
    }, []);

    const updateExperiences = (newExperiences: JobExperience[]) => {
        setExperiences(newExperiences);
    };

    const handleImageUpload = (imageUrl) => {
        setImageUrl(imageUrl);
        form.setFieldsValue({ profilePicture: imageUrl });
    };

    const handleCancel = () => {
        navigate(`/profile/${currentUser.id}`);
    };

    return (
        <>
            <h1>Edit Profile</h1>
            <Form
                form={form}
                name="profile_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600, textAlign: 'left', marginTop: '16px' }}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Missing name',
                        },
                    ]}
                >
                    <Input placeholder="Please input your name" />
                </Form.Item>
                <Form.Item
                    name="age"
                    label="Age"
                    rules={[
                        {
                            required: true,
                            message: 'Missing age',
                        },
                    ]}
                >
                    <InputNumber min={1} max={70} defaultValue={18} />
                </Form.Item>
                <Form.Item name="profilePicture" label="Profile Picture">
                    <UploadImage
                        handleImageUpload={handleImageUpload}
                        disabled={false}
                        uploadDestinationUrl={'upload-profile-picture'}
                        uploadedImage={(currentUser && currentUser.profilePicture) ?? ''}
                    />
                </Form.Item>
                <Form.Item name="experiences">
                    <ExperienceForm
                        updateExperiences={updateExperiences}
                        prevExperiencesData={(currentUser && currentUser.workExperience) ?? []}
                    />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button onClick={handleCancel} style={{ marginLeft: '16px' }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProfileForm;
