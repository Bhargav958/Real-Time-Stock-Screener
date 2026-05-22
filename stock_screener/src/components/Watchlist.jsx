const Watchlist = ({stocks, onSelect, toggleWatchlist}) => {
  if(!stocks.length)return null;
  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold text-white mb-4'>⭐ Watchlist</h2>
      <table className='w-full border border-zinc-800 rounded-xl'>
        <tbody>
          {
            stocks.map(stk=>(
              <tr key={stk.symbol} onClick={()=>onSelect(stk)} className='border-b border-zinc-800 hover:bg-zinc-800 cursor-pointer'>
                <td className='p-4'>
                  <button onClick={(e)=>{e.stopPropagation(); toggleWatchlist(stk.symbol);}}>⭐</button>
                </td>
                <td className='p-4 text-white'>
                  {stk.symbol}
                </td>
                <td className='p-4 text-white'>
                  ${stk.price?.toFixed(2)}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Watchlist
