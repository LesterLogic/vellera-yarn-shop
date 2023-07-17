import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppNav from './app-nav'

const AppHeader: React.FC = () => {
    return (
        <div className="p-2 w-full flex justify-between items-center flex-row my-4">
            <AppNav />
            <div className="w-4/12 flex flex-row justify-center">
                <Link href="/" aria-pressed="false" id="header-logo" title="Vellera Yarns">
                    <Image
                        src="/images/logo-white.webp"
                        alt="Vellera Yarns"
                        width={106}
                        height={100}
                        priority={true}
                    />
                </Link>
            </div>
            <div className="w-4/12 flex flex-row justify-end pr-4">
                <Link href="/" title="My Account"><i className="fal fa-user text-white"></i></Link>
                <Link href="/" title="Shopping Cart" className="pl-4"><i className="fal fa-shopping-cart text-white"></i></Link>
            </div>
        </div>
    );
};

export default AppHeader;