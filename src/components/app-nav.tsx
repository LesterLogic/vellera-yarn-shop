'use client';
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';



const AppNav: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navDestinations = [
        {"label":"Yarn", "url":"/product/yarn"},
        {"label":"Patterns", "url":"/product/patterns"},
        {"label":"Tools", "url":"/product/tools"},
        {"label":"Learning Center", "url":"/"},
    ];

    const toggleDropdown = (state?: boolean) => {
        if (state !== undefined) {
            setIsOpen(state);
        } else {
            setIsOpen(!isOpen);
        }
    }

    interface NavItemProps {
        url: string;
        content: string;
    }

    const MobileNavItem: React.FC<NavItemProps> = ({url, content}) => {
        return (
            <li className="px-4 py-2 hover:bg-stone-950"><Link href={url} title={`Go to ${content}`} onClick={() => { toggleDropdown(false)}}>{content}</Link></li>
        );
    }

    const NavItem: React.FC<NavItemProps> = ({url, content}) => {
        return (
            <li className="hover:underline mr-4"><Link href={url} title={`Go to ${content}`}>{content}</Link></li>
        )
    }

    return (
        <>
            <nav className="text-white lg:hidden relative w-4/12">
                <i className="fal fa-bars text-white" onClick={() => { toggleDropdown()}}></i>
                {isOpen && (
                <ul className="border-4 border-stone-200 bg-stone-800 text-stone-200 absolute top-1 left-5">
                    {navDestinations.map(dest => {
                        return <MobileNavItem url={dest.url} content={dest.label} key={`global-nav-${dest.label}`} />
                    })}
                </ul>
                )}
            </nav>
            <nav className="w-4/12 text-white hidden lg:block pl-4">
                <ul className="flex flex-row justify-start">
                    {navDestinations.map(dest => {
                        return <NavItem url={dest.url} content={dest.label} key={`global-nav-${dest.label}`} />
                    })}
                </ul>
            </nav>
        </>
    );
};

export default AppNav;