import {useCallback, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import StockTable from '../components/StockTable'
import SearchBar from '../components/SearchBar'
import StockModel from '../components/StockModel'
import Watchlist from '../components/Watchlist'
import Portfolio from '../components/Portfolio'
import { getStockQuote } from '../services/stockApi'

const defaultStocks =["AAPL","TSLA","MSFT","NVDA"];

const getSavedArray = (key) => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved || saved === "undefined") return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn(`Ignoring invalid ${key} in localStorage`, err);
        localStorage.removeItem(key);
        return [];
    }
};

const Dashboard = () => {
    const [stk, setStk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastupd, setLastupd] = useState(null);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [watchlist,  setWatchlist] = useState(()=>{
        return getSavedArray("watchlist");
    });
    const [portfolio, setPortfolio] = useState(()=>{
        return getSavedArray("portfolio");
    });
    const [alerts, setAlerts]=useState(()=>{
        const saved=localStorage.getItem("alerts");
        return saved? JSON.parse(saved):[];
    })

    const fetchStock = useCallback(async(symbol)=>{
        const data = await getStockQuote(symbol);
        return{
            symbol,
            price: data.c,
            prevPrice: data.c,
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
            alert.forEach(alert=>{
                const stock=upd.find(s=>s.symbol===alert.symbol);
                if(stock&& stock.price>= alert.price){window.alert(`🔔 ${alert.symbol} crossed  $${alert.price}`)}
            })
        } catch(err) {
            console.log(err);
            setError("Failed to load stocks");
            setLoading(false);
        }
    }, [stk, alerts])

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

    useEffect(()=>{ //for portfolio
        localStorage.setItem("portfolio", JSON.stringify(portfolio));
    },[portfolio]);

    useEffect(()=>{ //for portfolio
        localStorage.setItem("alerts", JSON.stringify(alerts));
    },[alerts]);

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

    const addPortfolio = (symbol) => {
        const shares = Number(prompt("Enter shares: "));
        const buyPrice = Number(prompt("Average buy price: "));
        if (!shares || !buyPrice) return;

        setPortfolio(prev => [...prev, { symbol, shares, buyPrice }]);
    }

    const removePortfolio = (symbol) => {
        setPortfolio(prev=>prev.filter(item=>item.symbol!==symbol));
    }

    const editPortfolio = (symbol) => {
        const shares = Number(prompt("Enter shares: "));
        const buyPrice = Number(prompt("Average buy price: "));
        if (!shares || !buyPrice) return;

        setPortfolio(prev=>prev.map(item=>item.symbol===symbol? {...item, shares, buyPrice} : item))
    }

    const addAlert=(symbol)=>{
        const price=Number(prompt("Alert price:"))
        if(!price)return;
        setAlerts(prev=>([...prev,{symbol,price}]));
    }

    const watchStocks = stk.filter(s=>watchlist.includes(s.symbol));

    const filteredStocks =
        stk.filter(stock=>{
        if(filter==="FAV")
            return watchlist.includes(stock.symbol);

        if(filter==="GAINERS")
            return stock.change > 0;
        
        if(filter==="LOSERS")
            return stock.change < 0;
        
        if(filter==="PRICE")
            return stock.price > 100;
        return true;
    });

  return (
    <div>
        <Navbar />

        <div className='p-4 md:p-6'>
            <Portfolio portfolio={portfolio} stocks={stk} removePortfolio={removePortfolio} editPortfolio={editPortfolio} />
            <SearchBar onSearch={handleSearch} /> 
            <p className='text-zinc-400 mb-4 text-sm'>Updated: <span className='font-medium text-white ml-2'>{lastupd || "Never"}</span></p>
            <Watchlist stocks={watchStocks} onSelect={setSelected} toggleWatchlist={toggleWatchlist}/>
            <div className='flex gap-3 mb-6 flex-wrap'>
                <button onClick={()=>setFilter("ALL")}className={`px-4 py-2 rounded ${filter==="ALL"?"bg-green-500":"bg-zinc-800"} text-white`}>All</button>
                <button onClick={()=>setFilter("FAV")}className={`px-4 py-2 rounded ${filter==="FAV"?"bg-green-500":"bg-zinc-800"} text-white`}>⭐ Favorites</button>
                <button onClick={()=>setFilter("GAINERS")} className={`px-4 py-2 rounded ${filter==="GAINERS"?"bg-green-500":"bg-zinc-800"} text-white`}>📈 Gainers</button>
                <button onClick={()=>setFilter("LOSERS")} className={`px-4 py-2 rounded ${filter==="LOSERS"?"bg-green-500":"bg-zinc-800"} text-white`}>📉 Losers</button>
                <button onClick={()=>setFilter("PRICE")} className={`px-4 py-2 rounded ${filter==="PRICE"?"bg-green-500":"bg-zinc-800"} text-white`}>💰 Price {'>'}100</button>
            </div>
            <StockTable stocks={filteredStocks} addAlert={addAlert} addPortfolio={addPortfolio} loading={loading} error={error} retryLoad={retryLoad} onSelect={setSelected} watchlist={watchlist} toggleWatchlist={toggleWatchlist}/>
            <StockModel stock={selected} onClose={()=>setSelected(null)}/>
            
        </div>
    </div>
  )
}

export default Dashboard
