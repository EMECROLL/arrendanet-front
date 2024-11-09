import './assets/themes/tailwind/tailwind-light/theme.scss' //personalized theme css
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Ajusta la ruta si es necesario
import AppRouter from './AppRouter';
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer/Footer';

function App() {

 
  return (
      <BrowserRouter>
        <AuthProvider>
          <Navbar/>
          <div className='min-h-screen h-full'>
          <AppRouter/>
          </div>
          <Footer/>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
