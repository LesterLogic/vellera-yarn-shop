"use client";

import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import Pagination from './components/Pagination';
import { ProductType } from '../../lib/ProductType';
import Image from 'next/image';

export default function Product() {
    const [showProducts, setShowProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxPages, setMaxPages] = useState<number>(1);
    const [fiberFilters, setFiberFilters] = useState<string[]>([]);
    const [colorFilters, setColorFilters] = useState<string[]>([]);
    const [weightFilters, setWeightFilters] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"price"|"fiber"|"color"|"weight">("price");
    const [sortOrder, setSortOrder] = useState<"asc"|"desc">("asc");

    const fiberFilterVals = ["wool", "cotton", "alpaca"];
    const colorFilterVals = ["black", "gray", "purple", "blue", "green", "yellow", "orange", "red", "white"];
    const weightFilterVals = ["fingering", "sport", "dk", "worsted"];

    useEffect(() => { getProducts(); }, [fiberFilters, colorFilters, weightFilters, currentPage]);

    const getProducts = async () => {
        const params = new URLSearchParams();
        if (fiberFilters.length > 0) params.append("fiber", fiberFilters.join(','));
        if (colorFilters.length > 0) params.append("color", colorFilters.join(','));
        if (weightFilters.length > 0) params.append("weight", weightFilters.join(','));
        params.append('page', String(currentPage));
        params.append("sortby", sortBy);
        params.append('sortorder', sortOrder);

        const url = `/api/product?${params.toString()}`;

        const res = await fetch(url);
        const products = await res.json();
        setShowProducts(products.products);
        setCurrentPage(products.meta.page);
        setMaxPages(products.meta.maxPages);
    }

    const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="w-full mb-10">
        <div className="w-full flex flex-row justify-around items-start flex-nowrap gap-x-4 mb-4">
            <Filter label="Fiber" options={fiberFilterVals} action={setFiberFilters} />
            <Filter label="Color" options={colorFilterVals} action={setColorFilters} />
            <Filter label="Weight" options={weightFilterVals} action={setWeightFilters} />
        </div>
        <div className="
            grid
            grid-cols-1
            grid-rows-auto
            gap-8
            w-11/12
            mx-auto
            mt-8
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            ">
            {showProducts.length === 0 &&
                (<div className="text-lg text-stone-100">Sorry, but there are no products that match your search.</div>)
            }
            {showProducts.length > 0 && showProducts.map((prod:ProductType) => {
                return (
                    <div className="w-full h-max bg-stone-100 border-2 rounded-lg">
                        <Image src={prod.image} width={200} height={200} alt={`${prod.manufacturer} ${prod.model}`} className="w-full h-max rounded-t-lg" />
                        <div className="p-4 text-center">
                            <div className="font-black">{prod.manufacturer} {prod.model}</div>
                            <div className="font-bold">{prod.color}</div>
                            <div className="">{prod.weight}</div>
                            <div className="">{prod.fiber}</div>
                            <div className="font-black text-xl mt-2">{USDollar.format(prod.price)}</div>
                        </div>
                    </div>
                )
            })
            }
        </div>
        <Pagination current={currentPage} max={maxPages} action={setCurrentPage} />
    </main>
  )
}