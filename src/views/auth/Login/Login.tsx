import { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import './CustomLogin.css';

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
    if (name == 'rememberMe') {
      setCredentials(prevState => ({
        ...prevState,
        [name]: !credentials.rememberMe
      }));
      return;
    }

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
    <main className='flex min-h-screen'>
      <div className="card min-h-screen w-7/12 h-full flex flex-col items-center justify-start p-10">
        <form onSubmit={handleSubmit} className='h-full w-2/3 flex flex-col justify-center mt-auto'>
          {/* <img className='w-2/3 mx-auto' src='/src/assets/Logo/arrendanet_full_logo.png'></img> */}
          <h1 className="text-4xl text-center font-bold text-navy my-0">¡Bienvenido de nuevo!</h1>
          <p className='text-center mb-4'>Inserta tus credenciales para acceder a tu cuenta</p>
          {errors.user && <Message severity="error" text={errors.user} />}
          <div className="mb-5 flex flex-col w-full">
            <FloatLabel>
              <InputText id="email" type='email' name='email' value={credentials.email} onChange={(e) => handleChange(e)} className={errors.email ? 'p-invalid' : 'w-full'} />
              <label style={{ fontSize: '16px' }} htmlFor="email">Correo electrónico</label>
            </FloatLabel>
            {errors.email && <Message severity="error" text={errors.email} className='mt-2' />}
          </div>
          <div className="flex flex-col w-full">
            <FloatLabel>
              <Password id="password" name='password' value={credentials.password} onChange={(e) => handleChange(e)} className={errors.password ? 'p-invalid' : 'w-full password-input-custom'} toggleMask panelClassName='hidden' />
              <label style={{ fontSize: '16px' }} htmlFor="password">Contraseña</label>
            </FloatLabel>
            {errors.password && <Message severity="error" text={errors.password} className='mt-2' />}
          </div>
          <div className="flex justify-between items-center w-full mt-3 mb-4">
            {/* <div className="flex align-items-center my-auto">
              <Checkbox id="rememberMe" name="rememberMe" value={false} onChange={handleChange} checked={credentials.rememberMe} />
              <label htmlFor="rememberMe" className="ml-2">Recordarme</label>
            </div> */}
            <Button className="text-navy font-Nunito font-bold text-sm ml-auto" label="¿Olvidaste tu contraseña?" link onClick={() => {
              navigate('/sign-up');
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }
            } />
          </div>
          <Button className='mx-auto flex w-1/2' label="Iniciar sesión" type='submit' />
        </form>
        <div className='mb-auto flex'>
          <p className='text-center flex items-center justify-center'>¿Aún no tienes cuenta? <Button className='text-navy' label="Regístrate" link onClick={() => {
            navigate('/sign-up');
            window.scrollTo({
              top: 0,
            });
          }
          } /></p>
        </div>
      </div>
      <section className='w-5/12 h-screen ml-auto'>
        <img className='w-full h-full object-cover rounded-l-3xl' src="/src/assets/images/login.jpg" alt="Cancún" />
      </section>
    </main>
  );
}

export default Login;
