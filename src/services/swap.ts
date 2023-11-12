// import request from "@/utils/request.ts";


export const getTokenList = () => {
    return fetch('https://tokens.coingecko.com/uniswap/all.json').then(res => res.json());
}