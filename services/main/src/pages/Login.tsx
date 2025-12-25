import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout/AuthLayout';
import { Card } from '@/components/molecules/Card/Card';
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { Alert } from '@/components/molecules/Alert/Alert';
import { ROLES } from '@/lib/directus';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const location = useLocation();

  // Redirect logic: Go back to where they tried to go, or Dashboard by default
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- DEBUG LOGS ADDED HERE ---
    console.log("--- Login Attempt ---");
    console.log("State Email:", email);
    console.log("State Password:", password?.replace(/./g, '*'));
    console.log("Redirect target:", from);
    // -----------------------------

    
  try {
    // 1. Capture the user returned by login
    const loggedInUser = await login(email, password);

    // 2. Check Role and Redirect accordingly
    if (loggedInUser.role === ROLES.PENDING) {
      navigate('/pending'); // Send Pending users here
    } else {
      navigate('/dashboard'); // Send everyone else here
    }

  } catch (err) {
    setError('Invalid email or password');
  }
};

  return (
    <AuthLayout>
      <Card title="Wade-USA Portal">
        {error && <Alert type="error" message={error} />}
        
        <form onSubmit={handleSubmit}>
          <FormGroup label="Email Address" id="email">
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@wade-usa.com" 
              autoFocus
            />
          </FormGroup>

          <FormGroup label="Password" id="password">
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
            />
          </FormGroup>

          <Button 
            style={{ width: '100%', marginTop: '1rem' }} 
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
};// Force update for deployment
