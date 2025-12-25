import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout/AuthLayout';
import { Card } from '@/components/molecules/Card/Card';
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Input } from '@/components/atoms/Input/Input';
import { Button } from '@/components/atoms/Button/Button';
import { Alert } from '@/components/molecules/Alert/Alert';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  

  // Redirect logic: Go back to where they tried to go, or Dashboard by default
  const from ="/dashboard";

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
      await login(email, password);
      
      // --- DEBUG LOG ---
      console.log("Login successful! Redirecting...");
      // ---------------
      
      // If successful, redirect
      navigate(from, { replace: true });
    } catch (err: any) {
      // --- ENHANCED DEBUG LOG ADDED HERE ---
      console.error("Login failed:", err);
      // Try to parse the actual Directus message from the error object
      const apiErrorMessage = err?.errors?.[0]?.message || 'Invalid email or password.';
      console.error("API Error Message:", apiErrorMessage);
      // -------------------------------------
      
      // Directus errors usually come in a specific format, but we'll keep it simple
      setError(apiErrorMessage); // Use the message from the API
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
