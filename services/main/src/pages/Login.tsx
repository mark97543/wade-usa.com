import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/templates/AuthLayout/AuthLayout';
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
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log("📝 [Login Page] Submitting Form...");
    console.log("   -> Email:", email);
    
    try {
      await login(email, password);
      console.log("🚀 [Login Page] Login Resolved! Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("💥 [Login Page] Error Caught:", err);
      const apiErrorMessage = err?.errors?.[0]?.message || 'Invalid email or password.';
      setError(apiErrorMessage);
    }
  };

  return (
    <AuthLayout>
      <Card title="Wade-USA Portal">
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit}>
          <FormGroup label="Email Address" id="email">
            <Input 
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@wade-usa.com" autoFocus
            />
          </FormGroup>
          <FormGroup label="Password" id="password">
            <Input 
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
            />
          </FormGroup>
          <Button style={{ width: '100%', marginTop: '1rem' }} isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
};