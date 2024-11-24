import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from 'react-router-dom';
import { FloatLabel } from "primereact/floatlabel";
import { Message } from "primereact/message";
import { useState } from "react";

function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ user: '', email: '', password: '', rememberMe: false });
    const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = () => {

  }

  const handleSubmit = () => {
    // Aquí se manejaría la lógica de registro, como validaciones y envío al backend
    navigate('/');
  };

  return (
    <main className='flex min-h-screen'>
       <section className='w-5/12 h-screen ml-auto'>
        <img className='w-full h-full object-cover rounded-l-3xl' src="/src/assets/images/login.jpg" alt="Cancún" />
      </section>
      <div className="card min-h-screen w-7/12 h-full flex flex-col items-center justify-start p-10">
        <form onSubmit={handleSubmit} className='h-full w-2/3 flex flex-col justify-center mt-auto'>
          {/* <img className='w-2/3 mx-auto' src='/src/assets/Logo/arrendanet_full_logo.png'></img> */}
          <h1 className="text-4xl text-center font-bold text-navy my-0">¡Bienvenido de nuevo!</h1>
          <p className='text-center mb-4'>Inserta tus credenciales para acceder a tu cuenta</p>
          {/* {errors.user && <Message severity="error" text={errors.user} />} */}
          <div className="mb-5 flex flex-col w-full">
            <FloatLabel>
              <InputText id="email" type='email' value="" onChange={handleChange} className={errors.email ? 'p-invalid' : 'w-full'} />
              <label style={{ fontSize: '16px' }} htmlFor="email">Correo electrónico</label>
            </FloatLabel>
            {errors.email && <Message severity="error" text={errors.email} className='mt-2' />}
          </div>
          <div className="flex flex-col w-full">
            <FloatLabel>
              <InputText id="password" type='email' value={credentials.password} onChange={handleChange} className={errors.password ? 'p-invalid' : 'w-full'} />
              <label style={{ fontSize: '16px' }} htmlFor="password">Contraseña</label>
            </FloatLabel>
            {errors.password && <Message severity="error" text={errors.password} className='mt-2' />}
          </div>
          <div className="flex flex-col justify-end w-full">
            <Button className="text-navy font-Nunito font-bold text-sm ml-auto mb-4" label="¿Olvidaste tu contraseña?" link onClick={() => {
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
        <div className='mb-auto'>
          <p className='text-center flex items-center justify-center'>¿Aún no tienes cuenta? <Button className='text-navy' label="Regístrate" link onClick={() => {
            navigate('/sign-up');
            window.scrollTo({
              top: 0,
            });
          }
          } /></p>
        </div>
      </div>
    </main>
  )
}

export default SignUp