import {useState} from 'react'

const SearchBar = ({ onSearch }) => {
  const [symbol, setSymbol] = useState("");
  const suggestions = ["AAPL","TSLA","MSFT","NVDA","META","AMZN","GOOGL","NFLX","AMD","INTC"];
  
  const handleSymbol=(e)=>{
    e.preventDefault();
    if(!symbol.trim())return
    onSearch(symbol.toUpperCase());
    setSymbol("");
  }

  const filtered=suggestions.filter(s=>s.includes(symbol.toUpperCase())).slice(0,5);

  return (
    <form onSubmit={handleSymbol} className='relative flex flex-col md:flex-row gap-4 mb-6'>
      <input type="text" value={symbol} placeholder='Search stock' onChange={(e)=>setSymbol(e.target.value)} 
        className='flex-1 bg-zinc-800 text-white px-4 py-3 rounded-lg outline-none'
      />  
      {
        symbol && filtered.length>0 && (
          <div className='absolute top-14 left-0 w-full bg-zinc-800 rounded-lg border border-zinc-700 z-50'>
            {filtered.map((s)=>(
              <div key={s} onClick={()=>{setSymbol(s);onSearch(s);setSymbol("");}} className='p-3 text-white hover:bg-zinc-700 cursor-pointer'>{s}</div>
            ))}
          </div>
        )
      }
      <button className='bg-green-500 px-6 py-3 rounded-lg text-white'>Search</button>
    </form>
  )
}

export default SearchBar
