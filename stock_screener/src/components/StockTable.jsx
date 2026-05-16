const StockTable = ({stocks, onSelect}) => {
  if (!stocks || !stocks.length) {
    return (
      <div className='overflow-x-auto rounded-xl border border-zinc-800'>
        <p className="text-white">No stocks found</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl border border-zinc-800'>
        <table className='w-full border-collapse text-left'>
            <thead>
                <tr className='bg-zinc-800 text-zinc-200'>
                    <th className='p-4'>Symbol</th>
                    <th className='p-4'>Price</th>
                    <th className='p-4'>Change %</th>
                </tr>
            </thead>
            <tbody>
                {[...stocks]
                    .sort((a,b)=>b.price-a.price)
                    .map((stk)=>(
                    <tr key={stk.symbol}
                        className={`cursor-pointer hover:scale-105 transition border-b border-zinc-800 transition-all duration-500 ${stk.price > stk.prevPrice ? "bg-red-900/20" : ""} hover:bg-zinc-800/40`}
                        onClick={() => onSelect(stk)}
                    >
                        <td className='p-4 font-semibold text-white'> 
                            {stk.symbol}
                        </td>
                        <td className='p-4 text-white'>
                            {stk.price == null ? '-' : `$${stk.price.toFixed(2)}`}
                        </td>
                        <td className={`p-4 font-medium ${stk.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stk.change == null ? '-' : `${stk.change > 0 ? "↑ " : "↓ " } ${stk.change.toFixed(2)}%`}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      
    </div>
  )
}

export default StockTable
