import axios from 'axios';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const BASE_URL = "https://finnhub.io/api/v1";

export const getStockQuote = async(symbol)=>{
    try{
        const res = await axios.get(
            `${BASE_URL}/quote`,
            {
                params:{
                    symbol,
                    token: API_KEY,
                },
            }
        );
        return res.data;
    } catch (err){
        console.log(err);
        throw err;
    }
};

export const getHistoricalData = async(symbol)=>{
    const quote = await getStockQuote(symbol);
    const current = Number(quote.c);
    const now = Math.floor(Date.now()/1000);

    return {
        c: [current * 0.96, current * 0.98, current, current * 1.02, current],
        t: [now - (4*86400), now - (3*86400), now - (2*86400), now - 86400, now],
    };
};
