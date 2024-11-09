import { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Checkbox } from 'primereact/checkbox';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ 
      email: '', 
      password: '',
      rememberMe: false
    });
  const [errors, setErrors] = useState({ user: '', email: '', password: '', rememberMe: false });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));

    setErrors(prevState => ({
      ...prevState,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { user: '', email: '', password: '', rememberMe: false };
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    }
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    const response = await login(credentials);

    if(!response.success){
      newErrors.user = 'Error con el usuario o contraseña';
      setErrors(newErrors);
    }else{
      setCredentials({ email: '', password: '', rememberMe: false });
      navigate('/dashboard')
    }
  };

  return (
    <div className="card min-h-screen w-full h-full flex flex-col items-center justify-start mt-5">
      <form onSubmit={handleSubmit} className='w-3/12 h-full'>
        <h2>Login</h2>
        <h2 className='text-center'>ARRENDA NET</h2>
        <p className='text-center'>TU PROPIEDAD, NUESTRA TECNOLOGÍA</p>
        <img src='/src/assets/Logo/arrendanet_full_logo.png'></img>

        {errors.user && <Message severity="error" text={errors.user} />}
        <div className="field flex flex-col">
          <label htmlFor="email" className="p-sr-only">Email</label>
          <InputText
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className={errors.email ? 'p-invalid' : ''}
          />
          {errors.email && <Message severity="error" text={errors.email} className='mt-2'/>}
        </div>
        <div className="field flex flex-col">
          <label htmlFor="password" className="p-sr-only">Password</label>
          <InputText
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            className={errors.password ? 'p-invalid' : ''}
          />
          {errors.password && <Message severity="error" text={errors.password} className='mt-2'/>}
        </div>      
        <Button type="submit" label="Log In" className='w-full'/>
      </form>
    </div>
  );
}

export default Login;
