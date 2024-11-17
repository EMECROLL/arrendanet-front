
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '../../AuthContext';
import { Button } from 'primereact/button';
// import { useNavigate } from 'react-router-dom';
import "./CustomNavbar.css";
import { Roles } from '../../common/enums/enums';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { isAuthenticated, logout, userRole } = useAuth();
    
    const navigate = useNavigate();

    // Estructura para que se muestre de cierta forma
    const itemRenderer = (item) => {
        const isActive = location.pathname === item.commandPath;
        const activeClass = isActive ? 'active-menu-item' : '';

        return (
            <a 
                className={`flex align-items-center p-menuitem-link font-Nunito text-md px-3 py-2 text-white hover:text-navy ${activeClass}`}
                onClick={item.command}
            >
                <span className={item.icon} />
                <span className={item.icon? "ml-2 text-span" : "text-span"}>{item.label}</span>
                {item.badge && <Badge className="ml-auto" value={item.badge} />}
                {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
            </a>
        );
    };
    
    // Rutas para el navbar - ¿Vas a añadir alguna? Hazlo aquí.
    const privateItems = [
        {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            template: itemRenderer,
            commandPath: '/dashboard',
            command: () => navigate('/dashboard'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]

        },
        {
            label: 'Edificios',
            icon: 'pi pi-building',
            template: itemRenderer,
            commandPath: '/edificios',
            command: () => navigate('/edificios'),
            authorizedRoles: [Roles.ADMINISTRADOR]
            // authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO]
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            template: itemRenderer,
            commandPath: '/usuarios',
            command: () => navigate('/usuarios'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]
        },
        {
            label: 'Habitaciones',
            icon: 'pi pi-home',
            template: itemRenderer,
            commandPath: '/habitaciones',
            command: () => navigate('/habitaciones'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]
        },
        {
            label: 'Contratos',
            icon: 'pi pi-hammer',
            template: itemRenderer,
            commandPath: '/contratos',
            command: () => navigate('/contratos'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO]

        },
        {
            label: 'Consultar Contratos',
            icon: 'pi pi-hammer',
            template: itemRenderer,
            commandPath: '/consultar-contratos',
            command: () => navigate('/consultar-contratos'),
            authorizedRoles: [Roles.INQUILINO]
            // authorizedRoles: [Roles.ADMINISTRADOR, Roles.INQUILINO]

        },
        {
            label: 'Pagos',
            icon: 'pi pi-receipt',
            template: itemRenderer,
            commandPath: '/pagos',
            command: () => navigate('/pagos'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO]
        },
        {
            label: 'Consultar Pagos',
            icon: 'pi pi-receipt',
            template: itemRenderer,
            commandPath: '/consultar-pagos',
            command: () => navigate('/consultar-pagos'),
            authorizedRoles: [Roles.INQUILINO]
            // authorizedRoles: [Roles.ADMINISTRADOR, Roles.INQUILINO]
        },
        {
            label: 'Mantenimientos',
            icon: 'pi pi-wrench',
            template: itemRenderer,
            commandPath: '/mantenimientos',
            command: () => navigate('/mantenimientos'),
            authorizedRoles: [Roles.ADMINISTRADOR, Roles.ENCARGADO]
        },
        {
            label: 'Solicitar Mantenimiento',
            icon: 'pi pi-wrench',
            template: itemRenderer,
            commandPath: '/solicitar-mantenimiento',
            command: () => navigate('/solicitar-mantenimiento'),
            authorizedRoles: [Roles.INQUILINO]
            // authorizedRoles: [Roles.ADMINISTRADOR,Roles.INQUILINO]
        },
        {
            label: 'Chat',
            icon: 'pi pi-comments',
            template: itemRenderer,
            commandPath: '/chat',
            command: () => navigate('/chat'),
            // authorizedRoles: [Roles.ADMINISTRADOR, Roles.ENCARGADO, Roles.INQUILINO]
            authorizedRoles: [] // Descomentar si quieren el chat
        }
    ];

    const publicItems = [
        {
            label: 'Inicio',
            commandPath: '/',
            command: () => navigate('/'),
            template: itemRenderer
        },
        {
            label: 'Sobre nosotros',
            commandPath: '/sobre-nosotros',
            command: () => navigate('/sobre-nosotros'),
            template: itemRenderer

        },
        {
            label: 'Contacto',
            commandPath: '/contacto',
            command: () => navigate('/contacto'),
            template: itemRenderer

        },
        {
            label: 'Legal',
            commandPath: '/legal',
            command: () => navigate('/legal'),
            template: itemRenderer
        },
        {
            label: 'Acceder',
            commandPath: '/login',
            command: () => navigate('/login'),
            template: itemRenderer,
            className: 'block md:hidden'
        }
    ]

    const start = 
    <div className='flex space-x-2 items-center justify-center h-12 mr-4 logo cursor-pointer' onClick={isAuthenticated ? (userRole == "Inquilino" ? () => navigate('/consultar-contratos') : () => navigate('/dashboard')): () => navigate('/') }>
        <img className='my-auto hidden lg:block' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={35}/>
        <h1 className='font-Nunito font-extrabold text-3xl text-white hidden sm:block'>ArrendaNet</h1>
    </div>;

    const end = (
        <div className="flex align-items-center gap-2">
            {
                isAuthenticated ?
                    <>
                        <Button label="Log Out" onClick={logout} />
                        {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
                    </>
                    :
                    <>
                        <div className='flex gap-2 justify-center items-center cursor-pointer' onClick={() => navigate('/')}>
                            <h1 className='font-Nunito font-extrabold text-xl text-white block md:hidden my-auto'>ArrendaNet</h1>
                            <img className='my-auto block md:hidden' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={30}/>
                        </div>
                        <Button className='hidden md:block'
                        label="Acceder" onClick={isAuthenticated ? () => navigate('/dashboard') : () => navigate('/login')} />
                    </>
            }
        </div>
    );
    
    return (
        <Menubar 
        id='top-page'
        className='border-none'
        model={isAuthenticated ? privateItems.filter(item=> item.authorizedRoles.includes(userRole)) : publicItems} 
        start={start} end={end} />
    )
}
