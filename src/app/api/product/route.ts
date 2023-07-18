import products from "./data.js";
import { ProductType } from "../../../lib/ProductType";
import {NextRequest, NextResponse} from 'next/server';

type Validator = string[];
type Sanitizer = (param:string|null, validator:Validator) => string[];

const validProducts:Validator = ["yarn", "patterns", "tools"];
const validFibers:Validator = ["wool", "cotton", "alpaca"];
const validWeights:Validator = ["fingering", "sport", "dk", "worsted"];
const validColors:Validator = ["black", "gray", "purple", "blue", "green", "yellow", "orange", "red", "white"];
const validSortBy:Validator = ["fiber", "weight", "color", "price"];
const validSortOrder:Validator = ["asc", "desc"];

const sanitize: Sanitizer = (param, validator) => {
    let retval:string[] = [];

    if (param === null) {
        return retval;
    } else {
        validator.forEach((value) => {
            param.includes(value) ? retval.push(value) : null;
        });
    }

    return retval;
}


//Normally the functionality for this request would be in a database and that call would be made here however,
//for the sake of this project, since I am using a static data set, I'm simulating the filter and sort operations.
export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id') === null ? null : parseInt(searchParams.get('id') || "");
    const product = searchParams.get('product') === null ? ["yarn"] : sanitize(searchParams.get('product'), validProducts);
    const fiber = sanitize(searchParams.get('fiber'), validFibers);
    const weight = sanitize(searchParams.get('weight'), validWeights);
    const color = sanitize(searchParams.get('color'), validColors);
    const sortby = sanitize(searchParams.get('sortby'), validSortBy);
    const sortorder = sanitize(searchParams.get('sortorder'), validSortOrder);
    let page = searchParams.get('page') === null ? 1 : parseInt(searchParams.get('page') || "1");

    let returnProducts:ProductType[] = [];

    //If an ID was supplied, fetch that product and return it
    if (id !== null) {
        for (let x=0; x<products.length; x++) {
            if (products[x].id === id) {
                return NextResponse.json(products[x], {status: 200});
            }
        }

        return NextResponse.json(null, {status: 404});
    }

    //Step 1: Filter the results based on the selected fiber, weight, and color.
    //Find the intersection of each set of the selected filters and the product tags
    const tags = [product, fiber, weight, color];
    returnProducts = products.filter(prod => {
        if (product.length > 0) {
           let productsect = product.filter(tag => prod.tags.includes(tag));
           if (productsect.length === 0) return false;
        }
        if (fiber.length > 0) {
            let fibersect = fiber.filter(tag => prod.tags.includes(tag));
            if (fibersect.length === 0) return false;
        }
        if (weight.length > 0) {
            let weightsect = weight.filter(tag => prod.tags.includes(tag));
            if (weightsect.length === 0) return false;
        }
        if (color.length > 0) {
            let colorsect = color.filter(tag => prod.tags.includes(tag));
            if (colorsect.length === 0) return false;
        }
        return true;
    });

    //Step 2: Sort the results.
    //sortby should only contain 1 value, if any, but in case more than one show up, use the first
    const sortField = sortby.length > 0 ? sortby[0] : 'weight';
    returnProducts.sort((a:ProductType, b:ProductType) => {
        if (a[sortField as keyof ProductType] < b[sortField as keyof ProductType]) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });

    //Step 3: If sortorder is 'desc' then we reverse the returnProduct array
    if (sortorder.length > 0 && sortorder[0] === "desc") {
        returnProducts.reverse();
    }

    //Step 4: Return only the subset of results that correspond to the page.
    //If the page number is out of range, negative, return the first page
    //Default page length is 15
    const pageLimit = 15;
    const maxPages = Math.ceil(returnProducts.length/pageLimit);
    let start = 0;
    let end = 0;
    if (page > maxPages || page < 1) {
        start = 1;
        page = 1;
    }

    start = (page - 1) * pageLimit
    end = start + pageLimit;
    return NextResponse.json({products: returnProducts.slice(start, end), meta:{page:page, maxPages: maxPages, pageLimit: pageLimit, sortBy: sortby, sortOrder: sortorder}}, {status: 200});
}