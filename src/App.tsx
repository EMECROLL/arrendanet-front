import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import './App.css';
import Ejemplo from './pages/Ejemplo/Ejemplo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<Ejemplo />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;
