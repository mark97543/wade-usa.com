import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- The Navigator
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/BaseComponents/Button';
import Input from '../../components/BaseComponents/Input/Input';
import { CONFIG } from '../../config/layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, pass); // 1. Get Token
      //console.log("Successfull Log In")
      navigate(CONFIG.DASH_PAGE);// Redirect to Dashboard Change this if you have dashboard page later on <-------------------------------
    } catch (err) {
      alert('Login failed! Check console.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection:'column' ,justifyContent: 'center', marginTop: '50px',  textAlign:'center'}}>
      <div style={{ padding: '30px', border: '1px solid var(--secondary-color)', borderRadius: '8px', width:'350px', marginLeft:'auto', marginRight:'auto' }}>
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
      <a href='/register' style={{marginTop:'20px'}}>Not A Member? Register Here.</a>
      <p style={{width:'350px', marginLeft:'auto', marginRight:'auto'}}>If you Registered and cannot log in. It is because you have not been autherized yet. Contact The Amazing Mr. Wade to expadite. </p>
    </div>
  );
}