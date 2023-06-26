/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Avatar, Card } from 'antd';

function ViewProfile({ currentUser }) {
    const formatUnixTimestamp = (unixTimestamp) => {
        const date = new Date(unixTimestamp);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${month}-${year}`;
    };

    return (
        <>
            {currentUser ? (
                <div>
                    <Card style={{ width: '100%', textAlign: 'center' }}>
                        <Avatar
                            size={128}
                            style={{ marginBottom: 16, borderRadius: '50%', border: '2px solid #000' }}
                            src={currentUser.profilePicture}
                        />
                        <h2>
                            {currentUser.name} ({currentUser.age} years old)
                        </h2>
                        {currentUser.workExperience.length > 0 ? (
                            <>
                                <h3>Work Experience</h3>
                                {currentUser.workExperience.map((work) => {
                                    return (
                                        <Card key={work.id} style={{ marginBottom: 16, textAlign: 'left' }}>
                                            <Avatar
                                                size={64}
                                                style={{
                                                    marginBottom: 16,
                                                    borderRadius: '50%',
                                                    border: '1px solid #000',
                                                }}
                                                src={work.companyLogo != '' ? work.companyLogo : null}
                                            />
                                            <h3>{work.company}</h3>
                                            <p>
                                                {formatUnixTimestamp(parseInt(work.startDate))} {' - '}
                                                {work.endDate != null
                                                    ? formatUnixTimestamp(parseInt(work.endDate))
                                                    : 'present'}
                                            </p>
                                            <p>{work.jobTitle}</p>
                                            <p>{work.description == null ? 'No Description' : work.description}</p>
                                        </Card>
                                    );
                                })}
                            </>
                        ) : (
                            <h3>No Work Experience</h3>
                        )}
                    </Card>
                </div>
            ) : (
                <h1>User Not Found</h1>
            )}
        </>
    );
}

export default ViewProfile;
