import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { IoColorPaletteOutline } from "react-icons/io5";
import { NavLink } from 'react-router';


const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl: 'https://static.poder360.com.br/2019/04/foto-oficial-Bolsonaro-774x644.png'
};
const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Histórico', href: '/history' },
];
const userNavigation = [
    { name: 'Criar Usuário', href: '/createuser' },
    { name: 'Sign out', href: '/login' },
];

const themes = ["light", "dark", "dracula", "corporate", "retro", "valentine", "halloween", "lofi", "black", "winter"];

type NavBarProps = {
    page: string;  
}

export default function NavBar (navbarProps: NavBarProps) {
    const [theme, setTheme] = useState('light');
    const currentPage = navbarProps.page;

  
    const toggleTheme = (selectedTheme: string) => {
        setTheme(selectedTheme);
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    return (
        <div className="min-h-full ">
            <Disclosure as="nav" className="mb-4 bg-gray-600 bg-opacity-10">
                <div className="w-full px-4 sm:px-5 lg:px-5">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center">
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            className={`${item.name == currentPage ? 'bg-gray-700 bg-opacity-55 text-white' : 'hover:bg-gray-900 hover:bg-opacity-20 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium`}
                                            to={item.href}
                                            end
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:inline-flex">
                            <details className="dropdown">
                                <summary className="block text-sm cursor-pointer"><IoColorPaletteOutline size={40} /></summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-35 p-2">
                                    {themes.map((themeOption) => (
                                        <li key={themeOption}>
                                            <button
                                                onClick={() => toggleTheme(themeOption)}
                                                className={`block w-full text-left px-2 py-1 rounded ${theme === themeOption ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                            >
                                                {themeOption}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                            <div className="ml-4 flex items-center md:ml-6">
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                                        </MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {item.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </Disclosure >
        </div >
    );
}