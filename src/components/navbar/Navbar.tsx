
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
        <a className="flex align-items-center p-menuitem-link font-Nunito text-lg px-3 py-2">
            <span className={item.icon} />
            <span className="mx-2 text-span">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    // Rutas para el navbar - ¿Vas a añadir alguna? Hazlo aquí.
    const privateItems = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: '/'

        },
        {
            label: 'Features',
            icon: 'pi pi-star'
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'Core',
                    icon: 'pi pi-bolt',
                    shortcut: '⌘+S',
                    template: itemRenderer
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server',
                    shortcut: '⌘+B',
                    template: itemRenderer
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil',
                    shortcut: '⌘+U',
                    template: itemRenderer
                },
                {
                    separator: true
                },
                {
                    label: 'Templates',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Apollo',
                            icon: 'pi pi-palette',
                            badge: 2,
                            template: itemRenderer
                        },
                        {
                            label: 'Ultima',
                            icon: 'pi pi-palette',
                            badge: 3,
                            template: itemRenderer
                        }
                    ]
                }
            ]
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            badge: 3,
            template: itemRenderer
        }
    ];

    const publicItems = [
        {
            label: 'Inicio',
            url: '/',
            template: itemRenderer
        },
        {
            label: 'Sobre nosotros',
            url: '/sobre-nosotros',
            template: itemRenderer

        },
        {
            label: 'Ayuda',
            url: '/ayuda',
            template: itemRenderer

        },
        {
            label: 'Legal',
            url: '/legal',
            template: itemRenderer

        }
    ]

    const start = <div className='flex space-x-2 items-center mx-2 h-12 logo'>
        <img className='my-auto' alt="logo" src="/src/assets/Logo/logo_arrendanet_blanco.svg" width={35}/>
        <h1 className='font-Nunito font-extrabold text-3xl mt-auto text-white sm:hidden lg:block'>ArrendaNet</h1>
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
                        <Button className='px-4 py-2 text-lg font-semibold mx-3 border-2 border-white p-button' label="Acceder" onClick={() => navigate('/login')} />
                        {/* <Button label="Sign Up" onClick={()=> navigate('/sign-up')}/> */}
                    </>
            }
        </div>
    );

    return (
        <Menubar className='grid grid-cols-3 my-auto rounded-none bg-navy' model={isAuthenticated ? privateItems : publicItems} start={start} end={end} />
    )
}
