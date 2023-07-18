"use client";

import { useEffect, useState } from 'react';
import { ProductType } from '../../../lib/ProductType';
import Image from 'next/image';
import Link from 'next/link';

export default function Detail({ params }: {
    params: { productId: string }
}) {
    const [product, setProduct] = useState<ProductType|null>(null);
    const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

    useEffect(() => { getProduct(); }, []);

    const getProduct = async () => {
        //Sanitize the query value
        let productId = params.productId;
        if (Number.isNaN(Number.parseInt(productId!))) return;

        //Get product record
        const urlParams = new URLSearchParams();
        urlParams.append('id', String(productId));
        const url = `/api/product?${urlParams.toString()}`;
        const res = await fetch(url);
        const prod:ProductType = await res.json();

        if (prod === null) return;
        setProduct(prod);

        //Get related products
        const relatedParams = new URLSearchParams();
        relatedParams.append('fiber', prod.tags.join(','));
        relatedParams.append('weight', prod.tags.join(','));
        const relatedUrl = `/api/product?${relatedParams.toString()}`;
        const relatedRes = await fetch(relatedUrl);
        let relatedProds = await relatedRes.json();

        if (relatedProds.products.length > 0) {
            relatedProds = relatedProds.products.filter((p:ProductType) => p.id !== prod.id);
            setRelatedProducts(relatedProds);
        }

        return;
    }

    const USDollar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="w-full min-h-screen mb-10">
        <div className="w-11/12 mx-auto mt-8">
            {product === null &&
                (<div className="w-full h-max text-lg text-stone-100" data-testid="error">Sorry, but there is no product to show you.</div>)
            }
            {product !== null && (
                <div className="w-full flex flex-col lg:flex-row bg-stone-100 rounded-xl" data-testid="details">
                    <div className='w-full h-max lg:w-1/2 bg-stone-100 rounded-xl'>
                        <Image src={product.image} width={200} height={200} priority alt={`${product.manufacturer} ${product.model}`} className="w-full rounded-xl " />
                    </div>
                    <div className="w-full lg:w-1/2 p-4 text-center">
                        <div className="text-2xl font-black">{product.manufacturer} {product.model} - {USDollar.format(product.price)}</div>
                        <div className="text-lg font-bold">{product.color} - {product.weight}</div>
                        <div className="text-lg">{product.fiber}</div>
                        <div className="flex flex-col gap-4 my-2 justify-start text-left" dangerouslySetInnerHTML={{ __html: product.description}} />
                        
                    </div>
                </div>)
            }
            {product !== null && (
                <div className="w-full mt-10" data-testid="related">
                    <h2 className="text-stone-100">Consider these other options for your project:</h2>
                    <div className="grid grid-cols-2 grid-row-auto lg:grid-cols-4 xl:grid-cols-8 gap-2 mt-4">
                        {relatedProducts.map((prod:ProductType) => {
                            return (
                                <Link href={`/detail/${prod.id}`} className="bg-stone-100 border-2 rounded-lg" data-testid="related-tile">
                                <Image src={prod.image} width={200} height={200} alt={`${prod.manufacturer} ${prod.model}`} className="w-full h-max rounded-t-lg" />
                                <div className="p-4 text-center">
                                    <div className="font-black">{prod.manufacturer} {prod.model}</div>
                                    <div className="font-bold">{prod.color}</div>
                                    <div className="font-bold mt-2">{USDollar.format(prod.price)}</div>
                                </div>
                            </Link>
                            
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    </main>
  )
}