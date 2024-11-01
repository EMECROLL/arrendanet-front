import { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Checkbox } from 'primereact/checkbox';

function Login() {
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

  const handleSubmit = (e) => {
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

    const response = login(credentials);
    if(!response.success){
      newErrors.user = 'Error con el usuario o contraseña';
      setErrors(newErrors);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {errors.user && <Message severity="error" text={errors.user} />}
        <div className="field">
          <label htmlFor="email" className="p-sr-only">Email</label>
          <InputText
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className={errors.email ? 'p-invalid' : ''}
          />
          {errors.email && <Message severity="error" text={errors.email} />}
        </div>
        <div className="field">
          <label htmlFor="password" className="p-sr-only">Password</label>
          <InputText
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            className={errors.password ? 'p-invalid' : ''}
          />
          {errors.password && <Message severity="error" text={errors.password} />}
        </div>
        <div className="field">
          <Checkbox
            onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
            checked={credentials.rememberMe}
          />
          <label htmlFor="ingredient1" className="ml-2">Recordar</label>
        </div>
       
        <Button type="submit" label="Log In" />
      </form>
    </div>
  );
}

export default Login;
