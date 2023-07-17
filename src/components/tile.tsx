import React from 'react';
import Link from 'next/link';

interface TileProps {
    background: string;
    header: string;
    subheader?: string;
    url: string;
}

const Tile = (args: TileProps) => {
    return (
        <Link href={args.url} title={args.header} className={`
            ${args.background}
            w-full
            h-[100vw]
            bg-no-repeat
            bg-cover
            bg-center
            flex
            flex-col
            items-center
            justify-end
            mb-4
            pb-20
            md:w-[45vw]
            md:h-[45vw]
            md:mb-12
        `}>
            <h2 className="text-2xl text-stone-50 border-4 border-stone-200 py-4 px-6 mb-4 backdrop-blur">{args.header}</h2>
            {args.subheader && <h4 className="text-sm text-stone-200">{args.subheader}</h4>}
        </Link>
    );
};

export default Tile;