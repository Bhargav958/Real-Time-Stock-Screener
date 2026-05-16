import {useCallback, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import StockTable from '../components/StockTable'
import SearchBar from '../components/SearchBar'
import { getStockQuote } from '../services/stockApi'

const defaultStocks =["AAPL","TSLA","MSFT","NVDA"];

const Dashboard = () => {
    const [stk, setStk] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [lastupd, setLastupd] = useState(null);

    const fetchStock = useCallback(async(symbol)=>{
        const data = await getStockQuote(symbol);
        return{
            symbol,
            price: data.c,
            change: data.dp,
        };
    }, []);

    const refreshStocks = useCallback(async()=>{
        try{
            // const symbols = stk.map(s=>s.symbol)
            const upd = await Promise.all(
                stk.map(async(s)=>{
                    const data=await getStockQuote(s.symbol)
                    return{
                        symbol: s.symbol,
                        price: data.c,
                        change: data.dp
                    }
                })
            )
            setStk(upd);
            setLastupd(new Date().toLocaleTimeString());
        } catch(err) {
            console.log(err);
        }
    }, [stk])

    useEffect(()=>{
        let isMounted = true;

        Promise.all(defaultStocks.map(fetchStock))
            .then((res)=>{
                if (isMounted) {
                    setStk(res.filter(s=>s.price!=null));
                }
            })
            .catch((err)=>{
                console.error("Failed to load default stocks", err);
            });

        return ()=>{
            isMounted = false;
        }
    },[fetchStock]);

    useEffect(()=>{
        if(!stk.length)return;
        //for auto refesh
        const intervel = setInterval(()=>{
            refreshStocks();
        },10000);
        return ()=>{
            clearInterval(intervel);
        }
    },[stk.length, refreshStocks])

    const handleSearch= async (symbol)=>{
        try{
            const st = await fetchStock(symbol);
            const exist = stk.some((e)=>e.symbol === symbol)
            if(exist)return;
            setStk((prev)=>[st, ...prev,]);
        } catch(err){
            console.error("Failed to search stock", err);
            alert("stock not found");
        }
    };

  return (
    <div>
        <Navbar />

        <div className='p-6'>
            <SearchBar onSearch={handleSearch} />
            <p className='text-zinc-400 mb-4'>Updated: {lastupd || "Never"}</p>
            <StockTable stocks={stk}/>
        </div>
    </div>
  )
}

export default Dashboard
