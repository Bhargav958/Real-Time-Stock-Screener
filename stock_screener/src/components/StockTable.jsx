import LoadingSkeleton from "./LoadingSkeleton";

const StockTable = ({stocks, addPortfolio, loading, error, retryLoad, onSelect, watchlist, toggleWatchlist}) => {
  if(loading){
    return(
      <LoadingSkeleton />
    );
  }

  if(error){
    return(
      <div className='p-6'>
        <p className='text-red-400 mb-4'>{error}</p>
        <button onClick={retryLoad} className='bg-zinc-700 px-4 py-2 rounded text-white'>Retry</button>
        </div>
    );
  }

  if (!stocks || !stocks.length) {
    return (
      <div className='overflow-x-auto rounded-xl border border-zinc-800'>
        <p className="text-white">No stocks found</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl border border-zinc-800'>
        <table className='min-w-[500px] w-full border-collapse text-left'>
            <thead>
                <tr className='bg-zinc-800 text-zinc-200'>
                    <th className='p-2 md:p-4'>Fav</th>
                    <th className='p-2 md:p-4'>Symbol</th>
                    <th className='p-2 md:p-4'>Price</th>
                    <th className='p-2 md:p-4'>Change %</th>
                    <th className='p-2 md:p-4'>Portfolio</th>
                </tr>
            </thead>
            <tbody>
                {[...stocks]
                    .sort((a,b)=>{
                        const aFav = watchlist.includes(a.symbol)
                        const bFav = watchlist.includes(b.symbol)

                        if(aFav && !bFav)return -1;
                        if(!aFav && bFav)return 1;
                        return b.price-a.price
                    })
                    .map((stk)=>(
                    <tr key={stk.symbol}
                        className={`cursor-pointer border-b border-zinc-800 transition-all duration-500 ${stk.price < stk.prevPrice ? "bg-red-900/20" : ""}`}
                        onClick={() => onSelect(stk)}
                    >
                        <td className='p-2 md:p-4'>
                            <button onClick={(e)=>{e.stopPropagation(); toggleWatchlist(stk.symbol)}} className="text-xl">
                                {
                                    watchlist.includes(stk.symbol) ? "⭐" : "☆"
                                }
                            </button>
                        </td>
                        <td className='p-2 md:p-4 font-semibold text-white'> 
                            {stk.symbol}
                        </td>
                        <td className='p-2 md:p-4 text-white'>
                            {stk.price == null ? '-' : `$${stk.price.toFixed(2)}`}
                        </td>
                        <td className={`p-2 md:p-4 font-medium ${stk.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stk.change == null ? '-' : `${stk.change > 0 ? "↑ " : "↓ " } ${stk.change.toFixed(2)}%`}
                        </td>
                        <td className="p-2 md:p-4">
                            <button onClick={(e)=>{e.stopPropagation(); addPortfolio(stk.symbol);}} className="bg-blue-500 px-3 py-1 rounded text-white">+</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      
    </div>
  )
}

export default StockTable
