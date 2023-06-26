/* eslint-disable react/prop-types */
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ProfileForm from './pages/ProfileForm';
import Register from './pages/Register';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
    const isAuthenticated = localStorage.getItem('authToken') !== null;

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

function App() {
    const { t } = useTranslation();
    return (
        <div>
            <Routes>
                <Route index element={<Login />} />
                <Route path="*" element={<Navigate to={'/login'} replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/profile/:id/edit" element={<ProfileForm />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
