import { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';
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
    <main className="flex min-h-screen">
      <div className="card min-h-screen flex flex-col items-center justify-start p-10 w-full sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col justify-center mt-auto">
          <h1 className="text-3xl sm:text-4xl text-center font-bold text-navy my-0">¡Bienvenido de nuevo!</h1>
          <p className="text-center mb-4">Inserta tus credenciales para acceder a tu cuenta</p>
          {errors.user && <Message severity="error" text={errors.user} />}
          
          <div className="mb-5 flex flex-col w-full">
            <FloatLabel>
              <InputText 
                id="email" 
                type="email" 
                name="email" 
                value={credentials.email} 
                onChange={(e) => handleChange(e)} 
                className={errors.email ? 'p-invalid w-full' : 'w-full'} 
              />
              <label style={{ fontSize: '16px' }} htmlFor="email">Correo electrónico</label>
            </FloatLabel>
            {errors.email && <Message severity="error" text={errors.email} className="mt-2" />}
          </div>
          
          <div className="flex flex-col w-full">
            <FloatLabel className='w-full'>
              <Password 
                id="password" 
                name="password" 
                value={credentials.password} 
                onChange={(e) => handleChange(e)} 
                className={errors.password ? 'p-invalid w-full' : 'w-full password-input-custom'} 
                toggleMask 
                panelClassName="hidden" 
              />
              <label style={{ fontSize: '16px' }} htmlFor="password">Contraseña</label>
            </FloatLabel>
            {errors.password && <Message severity="error" text={errors.password} className="mt-2" />}
          </div>

          {/* <div className="flex justify-between items-center w-full mt-3 mb-4">
            <Button 
              className="text-navy font-Nunito font-bold text-sm ml-auto" 
              label="¿Olvidaste tu contraseña?" 
              link 
              onClick={() => {
                navigate('/sign-up');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div> */}
          
          <Button className="mx-auto flex  sm:w-2/4 md:w-4/12 mt-10" label="Iniciar sesión" type="submit" />
          {/* <div className="mb-auto flex justify-center">
            <p className="text-center flex items-center justify-center">
              ¿Aún no tienes cuenta? 
              <Button 
                className="text-navy" 
                label="Regístrate" 
                link 
                onClick={() => {
                  navigate('/sign-up');
                  window.scrollTo({ top: 0 });
                }} 
              />
            </p>
        </div> */}
        </form>

        
      </div>
      
      <section className="hidden xl:block w-full sm:w-5/12 h-screen ml-auto">
        <img 
          className="w-full h-full object-cover rounded-l-3xl" 
          src="/src/assets/images/login.jpg" 
          alt="Cancún" 
        />
      </section>
    </main>
  );
}

export default Login;
