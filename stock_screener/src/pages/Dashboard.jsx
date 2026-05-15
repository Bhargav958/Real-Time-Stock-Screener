import React, {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import StockTable from '../components/StockTable'
import { getStockQuote } from '../services/StockAPI'

const Dashboard = () => {
    const [stk, setStk] = useState([]);
    const [loading, setLoading] = useState(true);

    const symbols =["AAPL","TSLA","MSFT","NVDA"];

    useEffect(()=>{
        fetchStock();
    },[]);

    const fetchStock = async()=>{
        try{
            const res= await Promise.all(
                symbols.map(async (symbol)=>{
                    const data = await getStockQuote(symbol);
                    return{
                        symbol,
                        price: data.c,
                        change: data.dp,
                    };
                })
            );
            setStk(res);
        } catch(err) {
            console.log(err)
        } finally{
            setLoading(false)
        }
    }
  return (
    <div>
        <Navbar />

        <div className='p-6'>
            {loading ? (
                <p className='text-white'>Loading stocks...</p>
            ) : (
                <StockTable stocks={stk} />
            )}
        </div>
    </div>
  )
}

export default Dashboard
