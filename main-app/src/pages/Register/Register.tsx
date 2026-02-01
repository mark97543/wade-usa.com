/**
 * Registration Page for new User. 
 */

import { useState, useEffect } from 'react'
import Input from '../../components/BaseComponents/Input/Input'
import style from './Register.module.css'
import Button from '../../components/BaseComponents/Button'
import { authService } from '../../services/authService'
import { useNavigate } from 'react-router-dom'


function Register() {
    const [message, setMessage]=useState('')
    const [firstName, setFirstName]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]= useState("")
    const [checkPass, setCheckPass]=useState("")
    const [buttonD, setButtonD]=useState(true)
    const [loading, setLoading]=useState(false)
    const navigate = useNavigate();

    const handleRegister = async ()=>{
        setLoading(true);
        setMessage('');

        try{
            await authService.register(email, password, firstName);
            setMessage('Account Created! Redirecting to Login ... ');
            setTimeout(()=>{
                navigate('/login')
            },2000)
        }catch(err:any){
            setMessage(err.message || 'Registration failed. Try again.');
        }finally{
            setLoading(false)
            setMessage('')
        }
    }

    useEffect(()=>{
        if (password === checkPass){
            setMessage('')
        }else{
            setMessage('Passwords Do Not Match!')
            return
        }

        if(firstName!=='' && email!=='' && password!=='' && checkPass!==''){
            setButtonD(false)
        }else{
            setButtonD(true)
        }

    },[password, checkPass, email, firstName]);

  


  return (
    <div className={style.REGISTER_WRAPPER}>
        <div className={style.REGISTER_BOX}>
            <h2 style={{textAlign:'center'}}>🔑 Wade Registration</h2>
            <Input
                placeholder='Username'
                value={firstName}
                onChange={e=>setFirstName(e.target.value)}
            />
            <Input
                placeholder='Email'
                type='email'
                value={email}
                onChange={e=>setEmail(e.target.value)}
            />
            <Input
                placeholder='Password'
                type='password'
                value={password}
                onChange={e=>setPassword(e.target.value)}
            />
            <Input
                placeholder='Re-type Passsword'
                type='password'
                value={checkPass}
                onChange={e=>setCheckPass(e.target.value)}
            />

            <Button type='default' style={{width:'100%', margin:'0px'}} disabled={buttonD} loading={loading} onClick={handleRegister}>Register</Button>

            {message? <p>{message}</p>:null}
        </div>
    </div>
  )
}

export default Register