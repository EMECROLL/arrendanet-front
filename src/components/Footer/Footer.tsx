import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from 'react-router-dom';


export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="bg-navy p-10 font-Nunito">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <img className='my-auto' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={35}/>
                    <h1 className='font-Nunito font-extrabold text-3xl mb-auto text-white sm:hidden lg:block'>ArrendaNet</h1>
                </div>
                <div className="flex items-center">
                    <Button className="text-white font-Nunito font-bold text-lg" label="Inicio" link onClick={() =>  navigate('/')}/>
                    <Button className="text-white font-Nunito font-bold text-lg" label="Sobre Nosotros" link onClick={() =>  navigate('/sobre-nosotros')}/>
                    <Button className="text-white font-Nunito font-bold text-lg" label="Contacto" link onClick={() =>  navigate('/contacto')}/>
                    <Button className="text-white font-Nunito font-bold text-lg" label="Legal" link onClick={() =>  navigate('/legal')}/>
                </div>
            </div>
            <Divider/>
            <div className="flex justify-center space-x-5 w-1/3 mx-auto">
                <Avatar icon="pi pi-facebook" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
                <Avatar icon="pi pi-instagram" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
                <Avatar icon="pi pi-youtube" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
                <Avatar icon="pi pi-whatsapp" size="large" shape="circle" className="bg-navy border-2 border-white text-white" />
            </div>
            <p className="text-white font-semibold text-lg text-center">©. Todos los derechos reservados</p>
        </div>
    )
}
