import { Avatar } from "primereact/avatar"; 
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ScrollTop } from "primereact/scrolltop";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="bg-navy p-6 md:p-10 font-Nunito pb-4">
            <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <img className='my-auto' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={35}/>
                    <h1 className='font-Nunito font-extrabold text-2xl md:text-3xl text-white ml-3 hidden sm:block'>ArrendaNet</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                    <Button className="text-white font-Nunito font-bold w-full md:w-auto text-lg" label="Inicio" link onClick={() =>  {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}/>
                    <Button className="text-white font-Nunito font-bold text-lg w-full md:w-auto" label="Sobre Nosotros" link onClick={() =>  {
                        navigate('/sobre-nosotros');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}/>
                    <Button className="text-white font-Nunito font-bold text-lg w-full md:w-auto" label="Contacto" link onClick={() =>  {
                        navigate('/contacto');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}/>
                    <Button className="text-white font-Nunito font-bold text-lg w-full md:w-auto" label="Legal" link onClick={() =>  {
                        navigate('/legal');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}/>
                </div>
            </div>
            <Divider className="my-4"/>
            <div className="flex justify-center space-x-5 w-full md:w-1/3 mx-auto">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <Avatar icon="pi pi-facebook" size="large" shape="circle" className="bg-navy border-2 border-white text-white hover:bg-blue-500" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <Avatar icon="pi pi-instagram" size="large" shape="circle" className="bg-navy border-2 border-white text-white hover:bg-pink-500" />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    <Avatar icon="pi pi-youtube" size="large" shape="circle" className="bg-navy border-2 border-white text-white hover:bg-red-500" />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                    <Avatar icon="pi pi-whatsapp" size="large" shape="circle" className="bg-navy border-2 border-white text-white hover:bg-green-500" />
                </a>
            </div>
            <p className="text-white font-semibold text-center text-sm md:text-lg mt-4">© 2023 ArrendaNet. Todos los derechos reservados</p>
            <ScrollTop />
        </div>
    );
}
