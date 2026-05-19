import {useCallback, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import StockTable from '../components/StockTable'
import SearchBar from '../components/SearchBar'
import StockModal from '../components/StockModel'
import StockChart from '../components/StockChart'
import Watchlist from '../components/Watchlist'
import { getStockQuote } from '../services/stockApi'

const defaultStocks =["AAPL","TSLA","MSFT","NVDA"];

const Dashboard = () => {
    const [stk, setStk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastupd, setLastupd] = useState(null);
    const [selected, setSelected] = useState(null);
    const [watchlist,  setWatchlist] = useState(()=>{
        const saved = localStorage.getItem("watchlist");
        return saved? JSON.parse(saved) : [];
    });

    const fetchStock = useCallback(async(symbol)=>{
        const data = await getStockQuote(symbol);
        return{
            symbol,
            price: data.c,
            prevPrice:
                stk.find(s=>s.symbol===symbol)?.price || data.c,
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
                        prevPrice: s.price,
                        change: data.dp
                    }
                })
            )
            setStk(upd);
            setLastupd(new Date().toLocaleTimeString());
        } catch(err) {
            console.log(err);
            setError("Failed to load stocks");
            setLoading(false);
        }
    }, [stk])

    const retryLoad=()=>{
        setLoading(true);
        setError(null);

        Promise.all(defaultStocks.map(fetchStock))
            .then((res)=>{
                setStk(res.filter(s=>s.price!=null));
                setLoading(false);
            })
            .catch(()=>{
                setError("Failed to load stocks");
                setLoading(false);
            })
    }

    useEffect(()=>{
        setError(null);
        let isMounted = true;

        Promise.all(defaultStocks.map(fetchStock))
            .then((res)=>{
                if (isMounted) {
                    setStk(res.filter(s=>s.price!=null));
                    setLoading(false);
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

    useEffect(()=>{
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    },[watchlist]);

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

    const toggleWatchlist= (symbol)=>{
        const exist = watchlist.includes(symbol);

        if(exist){
            setWatchlist(
                watchlist.filter(s=>s!==symbol)
            )
        } else{
            setWatchlist([...watchlist, symbol]);
        }
    }

    const watchStocks= stk.filter(s=>watchlist.includes(s.symbol));

  return (
    <div>
        <Navbar />

        <div className='p-6'>
            <SearchBar onSearch={handleSearch} />
            <p className='text-zinc-400 mb-4 text-sm'>Updated: <span className='font-medium text-white ml-2'>{lastupd || "Never"}</span></p>
            <Watchlist stocks={watchStocks} onSelect={setSelected} toggleWatchlist={toggleWatchlist}/>
            <StockTable stocks={stk} loading={loading} error={error} retryLoad={retryLoad} onSelect={setSelected} watchlist={watchlist} toggleWatchlist={toggleWatchlist}/>
            <StockModal stock={selected} onClose={()=>setSelected(null)}/>
            
        </div>
    </div>
  )
}

export default Dashboard
