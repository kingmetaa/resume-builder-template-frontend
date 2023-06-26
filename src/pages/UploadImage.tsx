import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { RcFile } from 'antd/lib/upload';
import axios from 'axios';
import localforage from 'localforage';
import { useParams } from 'react-router-dom';

type UploadImageProps = {
    handleImageUpload: (imageUrl: string) => void;
    disabled: boolean;
    uploadDestinationUrl: string;
    uploadedImage: string;
};

interface OfflineFormData {
    image: RcFile;
    userId: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
    handleImageUpload,
    disabled,
    uploadDestinationUrl,
    uploadedImage,
}) => {
    const [loading, setLoading] = useState(false);
    const [defaultImage, setDefaultImage] = useState('');
    const backendUrl = 'http://localhost:8000';

    useEffect(() => {
        if (uploadedImage != '') {
            const getImage = async () => {
                const imageUrl = uploadedImage;
                const response = await axios.get(imageUrl, { responseType: 'blob' });
                const blobUrl = URL.createObjectURL(response.data);
                setDefaultImage(blobUrl);
            };
            getImage();
        }
    }, [uploadedImage]);

    const getImageUrl = (filename) => {
        return `${backendUrl}/images/${filename}`;
    };

    const getImage = async (filename: string) => {
        const imageUrl = getImageUrl(filename);
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(response.data);
        setDefaultImage(blobUrl);
        handleImageUpload(imageUrl);
    };

    // Handle file upload
    const handleUpload = async (file: RcFile) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        //need to change userId to dynamic
        formData.append('userId', '1');

        try {
            if (navigator.onLine) {
                const response = await fetch(`${backendUrl}/${uploadDestinationUrl}`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                getImage(data.data.filename);
                message.success('File uploaded successfully');
            } else {
                // User is offline, store the form data for later upload
                const offlineFormData = {
                    image: file,
                    //need to change userId to dynamic
                    userId: '1',
                };
                await localforage.setItem('offlineFormDataImage', offlineFormData);
                message.success('You are on offline mode now. File will be uploaded when you are online');
            }
        } catch (error) {
            console.error(error);
            message.error('File upload failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const uploadOfflineFormData = async () => {
            // Check if there is any offline form data
            const offlineFormData = await localforage.getItem<OfflineFormData>('offlineFormDataImage');
            if (offlineFormData) {
                // Upload the stored form data
                await handleUpload(offlineFormData.image);
                await localforage.removeItem('offlineFormDataImage');
            }
        };
        window.addEventListener('online', uploadOfflineFormData);
        return () => {
            window.removeEventListener('online', uploadOfflineFormData);
        };
    }, []);

    // Configure the Upload component
    const uploadProps = {
        name: 'image',
        showUploadList: false,
        beforeUpload: (file: RcFile) => {
            // Allow only image files
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
                return false;
            }
            return true;
        },
        onChange: (info: any) => {
            if (info.file.status === 'uploading') {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
                setLoading(false);
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                setLoading(false);
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        customRequest: async (options: any) => {
            // Call the handleUpload function to handle the file upload
            try {
                await handleUpload(options.file);
                options.onSuccess(null, {} as any);
            } catch (error) {
                options.onError(error);
            }
        },
    };

    return (
        <Upload {...(uploadProps as any)} disabled={disabled}>
            {defaultImage ? (
                <img src={defaultImage} alt="uploaded" style={{ maxWidth: '128px' }} />
            ) : (
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            )}
        </Upload>
    );
};

export default UploadImage;
