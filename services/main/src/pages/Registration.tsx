import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout/AuthLayout';
import { Card } from '@/components/molecules/Card/Card';
import { Button } from '@/components/atoms/Button/Button';
import { Input } from '@/components/atoms/Input/Input';
import { FormGroup } from '@/components/molecules/FormGroup/FormGroup';
import { Alert } from '@/components/molecules/Alert/Alert';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Local State
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.first, formData.last);
      navigate('/login?registered=true');
    } catch (err: any) {
      console.error("Registration Error:", err);
      const msg = err?.errors?.[0]?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card title="Create Account">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
            <FormGroup label="First Name" id="first">
              <Input 
                id="first"
                name="first" 
                value={formData.first} 
                onChange={handleChange} 
                required 
                placeholder="Jane"
              />
            </FormGroup>
            <FormGroup label="Last Name" id="last">
              <Input 
                id="last"
                name="last" 
                value={formData.last} 
                onChange={handleChange} 
                required 
                placeholder="Doe"
              />
            </FormGroup>
          </div>

          <FormGroup label="Email" id="email">
            <Input 
              id="email"
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="jane@example.com"
            />
          </FormGroup>

          <FormGroup label="Password" id="password">
            <Input 
              id="password"
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
            />
          </FormGroup>

          <div style={{ paddingTop: '1rem' }}>
              <Button style={{ width: '100%' }} isLoading={isLoading}>
                Sign Up
              </Button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', color: '#4b5563' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
              Log In
            </Link>
          </div>
        </form>
      </Card>
    </AuthLayout>
  );
};