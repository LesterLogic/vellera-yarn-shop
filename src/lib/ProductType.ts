export type ProductType = {
    "id": number;
    "manufacturer": string;
    "model": string;
    "price": number;
    "tags": string;
    "description": string;
    "image": string;
    "shipping_weight": number;
    "shipping_width": number;
    "shipping_height": number;
    "shipping_depth": number;
    "available": number;
}

export type YarnType = ProductType & {
    "weight": string;
    "fiber": string;
    "color": string;
    "yardage":  string;
    "gauge": string;
    "hook": string;
    "needle": string;
    "texture": string;
    "care": string;
}

export type PatternType = ProductType & {
    "craft": string;
    "weight": string;
    "gauge": string;
    "needle": string;
    "yardage": string;
}