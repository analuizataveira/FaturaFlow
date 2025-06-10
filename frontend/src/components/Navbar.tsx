import { Disclosure } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { IoColorPaletteOutline } from "react-icons/io5";
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router-dom';

const navigation = [
    { name: 'Menu', href: '/menu' },
    { name: 'Histórico', href: '/history' },
    { name: 'Lista', href: '/invoicesform'}
];

const themes = ["light", "dark", "dracula", "corporate", "retro", "valentine", "halloween", "lofi", "black", "winter"];

export default function NavBar() {
    const [theme, setTheme] = useState('light');

    const navigate = useNavigate();

     const toggleTheme = (selectedTheme: string) => {
        setTheme(selectedTheme);
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem("session"); // Remove a sessão
        navigate("/login"); // Redireciona para login
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
                                            className={({ isActive }) =>
                                                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                                }`
                                            }
                                            to={item.href}
                                            end
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:inline-flex items-center space-x-4">
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
                            
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 transition-colors duration-200"
                                title="Sair"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </Disclosure >
        </div >
    );
}