import { Rubik_Beastly } from "next/font/google";
import db from "../../../data/db";
import { ProductType, YarnType, PatternType } from "../../../lib/ProductType";
import {NextRequest, NextResponse} from 'next/server';

type Validator = string[];
type Sanitizer = (param:string|null, validator:Validator) => string[];

const validProducts:Validator = ["yarn", "patterns", "tools"];

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

const buildProductQuery = (type:string, id:number) => {
    let query = "";
    switch (type) {
        case 'yarn':
            query = `SELECT products.*, product_yarn.weight, product_yarn.fiber, product_yarn.color, product_yarn.yardage, product_yarn.gauge, product_yarn.hook, product_yarn.needle, product_yarn.texture, product_yarn.care FROM products LEFT JOIN product_yarn ON products.id=product_yarn.prod_id WHERE products.id=${id}`;
            break;
        case 'patterns':
            break;
        case 'tools':
            break;
        default:
    }

    return query;
};

const buildYarnQuery = (searchParams:URLSearchParams) => {
    const validFibers:Validator = ["wool", "cotton", "alpaca"];
    const validWeights:Validator = ["fingering", "sport", "dk", "worsted"];
    const validColors:Validator = ["black", "gray", "purple", "blue", "green", "yellow", "orange", "red", "white"];
    //const validSortBy:Validator = ["fiber", "weight", "color", "price"];
    //const validSortOrder:Validator = ["asc", "desc"];

    const fiber = sanitize(searchParams.get('fiber'), validFibers);
    const weight = sanitize(searchParams.get('weight'), validWeights);
    const color = sanitize(searchParams.get('color'), validColors);
    //const sortby = sanitize(searchParams.get('sortby'), validSortBy);
    //const sortorder = sanitize(searchParams.get('sortorder'), validSortOrder);

    let maxQuery = "SELECT COUNT(*) as maxRows, products.id FROM products";
    let rowQuery = "SELECT products.*, product_yarn.weight, product_yarn.fiber, product_yarn.color, product_yarn.yardage, product_yarn.gauge, product_yarn.hook, product_yarn.needle, product_yarn.texture, product_yarn.care FROM products LEFT JOIN product_yarn ON products.id=product_yarn.prod_id";
    
    //Build the WHERE clause
    if (fiber.length > 0 || weight.length > 0 || color.length > 0) {
        let whereClause = " WHERE ";
        let filters:string[] = [];
        if (fiber.length > 0) {
            let fiberClause:string[] = [];
            fiber.forEach(f => {
                fiberClause.push(`tags LIKE '%${f}%'`)
            });
            filters.push(`(${fiberClause.join(' OR ')})`);
        }
        if (weight.length > 0) {
            let weightClause:string[] = [];
            weight.forEach(w => {
                weightClause.push(`tags LIKE '%${w}%'`)
            });
            filters.push(`(${weightClause.join(' OR ')})`);
        }
        if (color.length > 0) {
            let colorClause:string[] = [];
            color.forEach(c => {
                colorClause.push(`tags LIKE '%${c}%'`)
            });
            filters.push(`(${colorClause.join(' OR ')})`);
        }
        whereClause += filters.join(' AND ');
        maxQuery += whereClause;
        rowQuery += whereClause;
    }

    return [rowQuery, maxQuery];
};

const buildPatternQuery = (searchParams:URLSearchParams) => {
    return ["", ""];
};

const buildToolQuery = (searchParams:URLSearchParams) => {
    return ["", ""];
};

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id') === null ? null : parseInt(searchParams.get('id') || "");
    const product = searchParams.get('product') === null ? ["yarn"] : sanitize(searchParams.get('product'), validProducts);
    const pageLimit = 15;
    let rowQuery = "";
    let maxQuery = "";
    let page = searchParams.get('page') === null ? 1 : parseInt(searchParams.get('page') || "1");
    let maxPages = 1;

    if (id !== null) {
        rowQuery = buildProductQuery(product[0], id);
    } else {
        switch (product[0]) {
            case 'yarn':
                [rowQuery, maxQuery] = buildYarnQuery(searchParams);
                break;
            case 'patterns':
                [rowQuery, maxQuery] = buildPatternQuery(searchParams);
                break;
            case 'tools':
                [rowQuery, maxQuery] = buildToolQuery(searchParams);
                break;
            default:
        }
    }

    if (maxQuery !== "") {
        const maxRows: number = await new Promise((resolve, reject) => {
            db.get(maxQuery, [], (err, row:{maxRows:number}) => {
                if (err) {
                    reject(0);
                } else {
                    resolve(row['maxRows']);
                }
            })
        });

        maxPages = Math.ceil(maxRows/pageLimit);
    }

    //Build the LIMIT clause
    page = page > maxPages ? 1 : page;
    rowQuery += ` LIMIT ${pageLimit} OFFSET ${pageLimit*(page-1)}`;

    try {
        const rows: ProductType[] = await new Promise((resolve, reject) => {
            db.all(rowQuery, (err, rows:ProductType[]) => {
                if (err) {
                    reject([]);
                } else {
                    resolve(rows);
                }
            });
        });

        return NextResponse.json({products: rows, meta:{page:page, maxPages: maxPages, pageLimit: pageLimit}}, {status: 200});
    } catch (e) {
        return NextResponse.json({products: [], meta:{page:1, maxPages: 1, pageLimit: pageLimit}}, {status: 200});
    }
}