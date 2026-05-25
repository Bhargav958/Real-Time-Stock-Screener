import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";

const Portfolio = ({portfolio=[], stocks=[], removePortfolio, editPortfolio}) => {
    const total = portfolio.reduce((sum,item)=>{
        const stock = stocks.find(s=>s.symbol===item.symbol);
        if(!stock)
            return sum;
        return sum + stock.price * item.shares;
    },0);

    const chartData = portfolio.map(item=>{
        const stock=stocks.find(s=>s.symbol===item.symbol);
        return{
            name: item.symbol,
            value: stock? stock.price*item.shares: 0
        };
    });

    return (
        <div className='bg-zinc-800 p-5 rounded-xl mb-6'>
            <h2 className='text-white text-xl font-bold mb-4'>Portfolio</h2>
            <p className='text-green-400 text-lg mb-4'>Total: ${total.toFixed(2)}</p>
            {
                chartData.length>0 && <div className="h-64 mb-6">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius="80" label>{
                                chartData.map((_,i)=>(
                                    <Cell key={i} />
                                ))}</Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            }
            {
                portfolio.length===0 ?(<p className='text-zinc-400 text-center py-6'>📊 No holdings yet<br/>Add stocks to track performance</p>):(
                      portfolio.map(item=>{
                        const stock = stocks.find(s=>s.symbol===item.symbol);
                        return(
                            <div key={item.symbol} className='py-3 border-b border-zinc-700 text-white' >
                                <div className="flex justify-between items-center">
                                    <span>{item.symbol}</span>
                                    <span className="ml-4">{item.shares} shares</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={()=>editPortfolio(item.symbol)} className="text-blue-400 hover:text-blue-300">✎</button>
                                    <button onClick={()=>removePortfolio(item.symbol)} className="text-red-400 hover:text-red-300">✕</button>
                                </div>
                                <div>
                                    <span>Buy: ${item.buyPrice}</span>
                                    <span>Current: ${stock? stock.price.toFixed(2): "0"}</span>
                                </div>    
                                    {/* <span>${stock ? (stock.price * item.shares).toFixed(2) : "0"}</span> */}
                                {
                                    stock && <div className={`mt-2 font-medium ${
                                        ((stock.price-item.buyPrice)*item.shares)>=0? "text-green-400":"text-red-400"
                                    }`}>
                                        Profit: ${((stock.price-item.buyPrice)*item.shares).toFixed(2)}
                                    </div>
                                }
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default Portfolio;