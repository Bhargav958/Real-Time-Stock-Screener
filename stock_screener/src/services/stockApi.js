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