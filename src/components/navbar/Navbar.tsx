
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '../../AuthContext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import "./CustomNavbar.css";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    
    const navigate = useNavigate();

    // Estructura para que se muestre de cierta forma
    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link font-Nunito text-md px-3 py-2 text-white hover:text-navy">
            <span className={item.icon} />
            <span className="mx-2 text-span">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    // Rutas para el navbar - ¿Vas a añadir alguna? Hazlo aquí.
    const privateItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            template: itemRenderer,
            command: () => navigate('/dashboard')

        },
        {
            label: 'Contratos',
            icon: 'pi pi-hammer',
            template: itemRenderer,
            command: () => navigate('/contratos')
        },
        {
            label: 'Edificios',
            icon: 'pi pi-building',
            template: itemRenderer,
            command: () => navigate('/edificios')
        },
        {
            label: 'Habitaciones',
            icon: 'pi pi-home',
            template: itemRenderer,
            command: () => navigate('/habitaciones')
        },
        {
            label: 'Pagos',
            icon: 'pi pi-receipt',
            template: itemRenderer,
            command: () => navigate('/pagos')
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            template: itemRenderer,
            command: () => navigate('/usuarios')
        },
        {
            label: 'Mantenimiento',
            icon: 'pi pi-wrench',
            template: itemRenderer,
            command: () => navigate('/')
        },
        {
            label: 'Chat',
            icon: 'pi pi-comments',
            template: itemRenderer,
            command: () => navigate('/')
        }
    ];

    const publicItems = [
        {
            label: 'Inicio',
            command: () => navigate('/'),
            template: itemRenderer
        },
        {
            label: 'Sobre nosotros',
            command: () => navigate('/sobre-nosotros'),
            template: itemRenderer

        },
        {
            label: 'Contacto',
            command: () => navigate('/contacto'),
            template: itemRenderer

        },
        {
            label: 'Legal',
            command: () => navigate('/legal'),
            template: itemRenderer

        }
    ]

    const start = 
    <div className='flex space-x-2 items-center justify-center h-12 mr-4 logo'>
        <img className='my-auto sm:hidden' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={35}/>
        <h1 className='font-Nunito font-extrabold text-3xl text-white hidden sm:block lg:block'>ArrendaNet</h1>
    </div>;

    // ! Esto cambiarlo por un login, sign up, log out
    const end = (
        <div className="flex align-items-center gap-2">
            {
                isAuthenticated ?
                    <>
                        <Button label="Log Out" onClick={logout} />
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                    </>
                    :
                    <>
                        <Button
                        label="Acceder" onClick={isAuthenticated ? () => navigate('/dashboard') : () => navigate('/login')} />
                    </>
            }
        </div>
    );
    console.log(isAuthenticated);
    
    return (
        <Menubar 
        model={isAuthenticated ? privateItems : publicItems} 
        start={start} end={end} />
    )
}