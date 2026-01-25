import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- The Navigator
import { loginUser } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/BaseComponents/Button';
import Input from '../../components/BaseComponents/Input/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { checkSession } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, pass); // 1. Get Token
      await checkSession();         // 2. Update Context
      navigate('/');                // 3. Redirect to Dashboard
    } catch (err) {
      alert('Login failed! Check console.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ padding: '30px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔐 Login Required</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Input
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)} 
            type='email'
          />
          <Input
            label=''
            type='password'
            placeholder='Password'
            onChange={e => setPass(e.target.value)} 
          />
          <Button type='default' style={{marginLeft:'-2px' ,width:'100%'}} >Enter</Button>
        </form>
      </div>
    </div>
  );
}