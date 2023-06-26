/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Card, Space, Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import UploadImage from './UploadImage';
import moment from 'moment';

const { TextArea } = Input;

interface JobExperience {
    company: string;
    companyLogo?: string;
    jobTitle: string;
    startDate: string;
    endDate: string | undefined;
    description: string;
    currentlyWorking?: boolean;
}

const ExperienceForm = ({ updateExperiences, prevExperiencesData }) => {
    const [experiences, setExperiences] = useState<JobExperience[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [enableEndDate, setEnableEndDate] = useState(true);

    const [form] = Form.useForm();

    useEffect(() => {
        if (prevExperiencesData) {
            // console.log(prevExperiencesData, 'prevExperiencesData');
            prevExperiencesData.forEach((experience, index) => {
                form.setFieldsValue({
                    experiences: {
                        [index]: {
                            company: experience.company,
                            jobTitle: experience.jobTitle,
                            startDate: moment.unix(experience.startDate / 1000),
                            endDate: experience.endDate ? moment.unix(experience.endDate / 1000) : undefined,
                            description: experience.description,
                            currentlyWorking: experience.endDate == null,
                        },
                    },
                });
            });
            setExperiences(prevExperiencesData);
            setActiveIndex(-1);
        }
    }, [prevExperiencesData]);

    const onFinish = (values: any) => {
        // console.log('Received values of form:', values);
        const updatedExperiences = [...experiences];
        updatedExperiences[activeIndex] = values.experiences[activeIndex];
        updatedExperiences[activeIndex].companyLogo =
            updatedExperiences[activeIndex].companyLogo === undefined ||
            updatedExperiences[activeIndex].companyLogo !== imageUrl
                ? imageUrl
                : updatedExperiences[activeIndex].companyLogo;
        updatedExperiences[activeIndex].currentlyWorking = !enableEndDate;
        setExperiences(updatedExperiences);
        setActiveIndex(-1);
        updateExperiences(updatedExperiences);
    };

    const handleImageUpload = (imgUrl) => {
        setImageUrl(imgUrl);
    };

    const handleSetIndex = (index) => {
        setActiveIndex(index);
    };

    const addExperience = () => {
        if (experiences.length > 0) {
            const lastExperience = experiences[experiences.length - 1];
            if (!lastExperience.company || !lastExperience.jobTitle || !lastExperience.startDate) {
                return;
            }
        }
        setEnableEndDate(true);
        setExperiences([
            ...experiences,
            { company: '', jobTitle: '', startDate: '', endDate: '', description: '', currentlyWorking: false },
        ]);
        const expLength = experiences.length;
        setActiveIndex(expLength >= 1 ? expLength : 0);
    };

    const removeExperience = (index: number) => {
        const newExperiences = [...experiences];
        newExperiences.splice(index, 1);
        setExperiences(newExperiences);
        updateExperiences(newExperiences);
    };

    const onChangeCheckbox = (e, index) => {
        if (e.target.checked) {
            form.resetFields([['experiences', index, 'endDate']]);
        }
        setEnableEndDate(!e.target.checked);
        const updatedExperiences = [...experiences];
        updatedExperiences[index].currentlyWorking = e.target.checked;
        setExperiences(updatedExperiences);
    };

    const handleSubmitPreventDefault = (event) => {
        event.preventDefault();
        form.submit();
    };

    return (
        <Form
            name="job-experience-form"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ textAlign: 'center', width: '100%' }}
        >
            {experiences.map((experience, index) => (
                <Space key={index} align="baseline">
                    <Card key={index} style={{ textAlign: 'center' }}>
                        <Form.Item
                            name={['experiences', index, 'company']}
                            label="Company"
                            rules={[{ required: true, message: 'Missing Company name' }]}
                            help={
                                form.isFieldTouched(['experiences', index, 'company']) &&
                                form.getFieldError(['experiences', index, 'company'])
                            }
                        >
                            <Input placeholder="Enter company name" disabled={activeIndex == index ? false : true} />
                        </Form.Item>
                        <Form.Item name={['experiences', index, 'companyLogo']} label="Company Logo">
                            <UploadImage
                                handleImageUpload={handleImageUpload}
                                disabled={activeIndex == index ? false : true}
                                uploadDestinationUrl={'upload-company-logo'}
                                uploadedImage={experiences[index]?.companyLogo ?? ''}
                            />
                        </Form.Item>
                        <Form.Item
                            name={['experiences', index, 'jobTitle']}
                            label="Job Title"
                            rules={[{ required: true, message: 'Missing Job Title' }]}
                            help={
                                form.isFieldTouched(['experiences', index, 'jobTitle']) &&
                                form.getFieldError(['experiences', index, 'jobTitle'])
                            }
                        >
                            <Input placeholder="Enter job title" disabled={activeIndex == index ? false : true} />
                        </Form.Item>
                        <Form.Item
                            name={['experiences', index, 'startDate']}
                            label="Start Date"
                            rules={[{ required: true }]}
                            help={
                                form.isFieldTouched(['experiences', index, 'startDate']) &&
                                form.getFieldError(['experiences', index, 'startDate'])
                            }
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Select start date"
                                disabled={activeIndex == index ? false : true}
                                disabledDate={(current) =>
                                    current && current.valueOf() > moment().startOf('day').valueOf()
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name={['experiences', index, 'endDate']}
                            label="End Date"
                            rules={[
                                {
                                    required: !form.getFieldValue(['experiences', index, 'currentlyWorking']),
                                    message: 'Please select an end date',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = moment(
                                            getFieldValue(['experiences', index, 'startDate']).format('YYYY-MM-DD')
                                        );
                                        if (!startDate || !value) {
                                            return Promise.resolve();
                                        }
                                        const endDate = moment(value.format('YYYY-MM-DD'));
                                        if (endDate.isSameOrAfter(startDate)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('End date must be greater than start date'));
                                    },
                                }),
                            ]}
                            dependencies={['experiences', index, 'currentlyWorking']}
                            help={
                                form.isFieldTouched(['experiences', index, 'endDate']) &&
                                form.getFieldError(['experiences', index, 'endDate'])
                            }
                        >
                            <DatePicker
                                id={`experiences_${index}_endDate`}
                                style={{ width: '100%' }}
                                placeholder="Select end date"
                                // disabled={
                                //     activeIndex == index && !experiences[index].currentlyWorking
                                //         ? false
                                //         : activeIndex == index && experiences[index].currentlyWorking
                                //         ? true
                                //         : activeIndex == index
                                //         ? false
                                //         : true
                                // }
                                disabled={
                                    activeIndex !== index ||
                                    form.getFieldValue(['experiences', index, 'currentlyWorking'])
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name={['experiences', index, 'currentlyWorking']}
                            label="Currently Working"
                            valuePropName="checked"
                            help={
                                form.isFieldTouched(['experiences', index, 'currentlyWorking']) &&
                                form.getFieldError(['experiences', index, 'currentlyWorking'])
                            }
                        >
                            <Checkbox
                                id={`experiences_${index}_currentlyWorking`}
                                onChange={(e) => onChangeCheckbox(e, activeIndex)}
                                disabled={activeIndex == index ? false : true}
                            ></Checkbox>
                        </Form.Item>

                        <Form.Item name={['experiences', index, 'description']} label="Description">
                            <TextArea
                                placeholder="Enter job description"
                                disabled={activeIndex == index ? false : true}
                            />
                        </Form.Item>
                        <Button
                            id={`experiences_${index}_save`}
                            type="primary"
                            htmlType="submit"
                            onClick={handleSubmitPreventDefault}
                            style={{ display: activeIndex == index ? 'block' : 'none', margin: '0 auto' }}
                        >
                            Save
                        </Button>

                        <Button
                            name="edit"
                            type="primary"
                            onClick={() => handleSetIndex(index)}
                            style={{ display: activeIndex == index ? 'none' : 'block', margin: '0 auto' }}
                        >
                            Edit
                        </Button>
                    </Card>
                    <MinusCircleOutlined onClick={() => removeExperience(index)} />
                </Space>
            ))}
            <Form.Item>
                <Button
                    type="dashed"
                    onClick={addExperience}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: '16px' }}
                >
                    Add experiences
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ExperienceForm;
