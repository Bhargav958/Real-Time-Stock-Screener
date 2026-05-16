import {useState} from 'react'

const SearchBar = ({ onSearch }) => {
  const [symbol, setSymbol] = useState("");
  
  const handleSymbol=(e)=>{
    e.preventDefault();
    if(!symbol.trim())return
    onSearch(symbol.toUpperCase());
    setSymbol("");
  }

  return (
    <form onSubmit={handleSymbol} className='flex gap-4 mb-6'>
      <input type="text" value={symbol} placeholder='Search stock' onChange={(e)=>setSymbol(e.target.value)} 
        className='flex-1 bg-zinc-800 text-white px-4 py-3 rounded-lg outline-none'
      />

      <button className='bg-green-500 px-6 rounded-lg text-white'>Search</button>
    </form>
  )
}

export default SearchBar
