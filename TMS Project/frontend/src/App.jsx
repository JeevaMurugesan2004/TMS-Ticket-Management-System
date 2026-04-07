import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComplaintRaising from './pages/ComplaintRaising';
import ComplaintList from './pages/ComplaintList';
import ReportScreen from './pages/ReportScreen';
import MasterLayout from './components/MasterLayout';
import DepartmentScreen from './pages/master/DepartmentScreen';
import ProgrammeScreen from './pages/master/ProgrammeScreen';
import BlockScreen from './pages/master/BlockScreen';
import RoomScreen from './pages/master/RoomScreen';
import RoleScreen from './pages/master/RoleScreen';
import UserScreen from './pages/master/UserScreen';
import './index.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/raise-complaint" element={<PrivateRoute><ComplaintRaising /></PrivateRoute>} />
            <Route path="/complaints" element={<PrivateRoute><ComplaintList /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportScreen /></PrivateRoute>} />

            <Route path="/master/*" element={<PrivateRoute><MasterLayout /></PrivateRoute>}>
                <Route path="department" element={<DepartmentScreen />} />
                <Route path="programme" element={<ProgrammeScreen />} />
                <Route path="block" element={<BlockScreen />} />
                <Route path="room" element={<RoomScreen />} />
                <Route path="role" element={<RoleScreen />} />
                <Route path="user" element={<UserScreen />} />
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
