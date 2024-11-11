import { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
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
    
    const newErrors = {};
    if (!credentials.email) newErrors.email = 'Email is required';
    if (!credentials.password) newErrors.password = 'Password is required';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await login(credentials);
      if (!response.success) {
        setErrors({ ...newErrors, user: 'Error con el usuario o contraseña' });
      } else {
        setCredentials({ email: '', password: '', rememberMe: false });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ user: 'Ocurrió un error inesperado. Intente de nuevo.' });
    }
  };
  

  return (
    <div className="card min-h-screen w-full h-full flex flex-col items-center justify-start mt-40">
      <form onSubmit={handleSubmit} className='w-3/12 h-full'>
        {/* <h2>Login</h2> */}
        <div className='text-center'>
            <h2 className='text-7xl text-navy font-sans font-bold mb-4'>ArrendaNet</h2>
            <p className='text-lg text-gray-500'>TU PROPIEDAD, NUESTRA TECNOLOGÍA</p>
        </div>
        {/* <img src='/src/assets/Logo/arrendanet_full_logo.png' className='w-full pl-5'></img> */}

        {errors.user && <Message severity="error" text={errors.user} />}
        <div className="field flex flex-col">
          <label htmlFor="email">Email</label>
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
          <label htmlFor="password">Password</label>
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
