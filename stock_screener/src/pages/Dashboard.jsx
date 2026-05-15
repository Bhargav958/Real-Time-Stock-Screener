import React, {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import StockTable from '../components/StockTable'
import SearchBar from '../components/SearchBar'
import { getStockQuote } from '../services/stockApi'

const Dashboard = () => {
    const [stk, setStk] = useState([]);
    // const [loading, setLoading] = useState(true);

    const defaultStocks =["AAPL","TSLA","MSFT","NVDA"];

    useEffect(()=>{
        loadDefaultStock();
    },[]);

    const loadDefaultStock = async()=>{
        try {
            const res = await Promise.all(
                defaultStocks.map(fetchStock)
            );
            setStk(res);
        } catch (err) {
            console.error("Failed to load default stocks", err);
        }
    }
    
    const fetchStock = async(symbol)=>{
        const data = await getStockQuote(symbol);
        return{
            symbol,
            price: data.c,
            change: data.dp,
        };
    }

    const handleSearch= async (symbol)=>{
        try{
            const st = await fetchStock(symbol);
            const exist = stk.some((e)=>e.symbol === symbol)
            if(exist)return;
            setStk((prev)=>[st, ...prev,]);
        } catch(err){
            alert("stock not found");
        }
    };

  return (
    <div>
        <Navbar />

        <div className='p-6'>
            <SearchBar onSearch={handleSearch} />
            <StockTable stocks={stk}/>
        </div>
    </div>
  )
}

export default Dashboard
