const Portfolio = ({portfolio=[], stocks=[]}) => {
    const total = portfolio.reduce((sum,item)=>{
        const stock = stocks.find(s=>s.symbol===item.symbol);
        if(!stock)
            return sum;
        return sum + stock.price * item.shares;
    },0);
    return (
        <div className='bg-zinc-800 p-5 rounded-xl mb-6'>
            <h2 className='text-white text-xl font-bold mb-4'>Portfolio</h2>
            <p className='text-green-400 text-lg mb-4'>Total: ${total.toFixed(2)}</p>
            {
                portfolio.length===0 ?(<p className='text-zinc-400'>No holdings</p>):(
                      portfolio.map(item=>{
                        const stock = stocks.find(s=>s.symbol===item.symbol);
                        return(
                            <div key={item.symbol} className='flex justify-between py-2 border-b border-zinc-700 text-white' >
                                <span>{item.symbol}</span>
                                <span>{item.shares} shares</span>
                                <span>${stock ? (stock.price * item.shares).toFixed(2) : "0"}</span>
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default Portfolio;