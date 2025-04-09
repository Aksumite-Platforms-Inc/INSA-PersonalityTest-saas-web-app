import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { saveToken } from '../utils/authUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    // Mocking API response
    const fakeResponse = {
      token: 'fake-jwt-token', // You get this from your backend
      role: 'admin', // The role could be admin, branch_admin, employee
    };

    // Save the token in localStorage
    saveToken(fakeResponse.token);

    // Redirect based on role
    if (fakeResponse.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (fakeResponse.role === 'branch_admin') {
      navigate('/branch-admin-dashboard');
    } else if (fakeResponse.role === 'employee') {
      navigate('/employee-dashboard');
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
