import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Ajusta la ruta si es necesario
import AppRouter from './AppRouter';
import Navbar from './components/navbar/Navbar';

function App() {

 
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <AppRouter/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
