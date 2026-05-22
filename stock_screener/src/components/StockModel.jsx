import { useEffect, useState } from "react";
import StockChart from "./StockChart";
import { getHistoricalData, getStockNews } from "../services/stockApi";

const StockModal = ({ stock, onClose }) => {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [timeframe, setTimeframe] = useState("1M");
  const [news, setNews] = useState([]);

  useEffect(()=>{
    if (!stock) return;
    let isMounted = true;

    const loadChart = async()=>{
      if (isMounted) {
        setChartData([]);
        setChartLoading(true);
        setChartError(null);
      }

      try{
        const data = await getHistoricalData(stock.symbol, timeframe);
        if(data?.s !== "ok" || !Array.isArray(data.c) || !Array.isArray(data.t)){
          if (isMounted) {
            setChartData([]);
            setChartError("No chart data available for this symbol");
            setChartLoading(false);
          }
          return;
        }
        const formated = data.c
          .map((price,i)=>({
            price: Number(price),
            date: new Date(data.t[i]*1000).toLocaleDateString("en-us", {month:"short", day:"numeric"})
          }))
          .filter((point)=>Number.isFinite(point.price) && point.date !== "Invalid Date");

        const newsData = await getStockNews(stock.symbol);
        if (isMounted) {
          setChartData(formated);
          setChartError(formated.length ? null : "No chart data available for this symbol");
          setChartLoading(false);

          setNews(newsData.slice(0,3));
        }
      }catch(err){
        console.log(err);
        if (isMounted) {
          setChartData([]);
          setChartError("Failed to load chart data");
          setChartLoading(false);
        }
      }
    };

    loadChart();

    return () => {
      isMounted = false;
    };
  },[stock, timeframe]);

  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-900 p-5 md:p-8 rounded-xl w-[95%] max-w-[600px] max-h-[90vh] overflow-y-auto border border-zinc-700">
        <button
          onClick={onClose}
          className=" float-right text-zinc-400">
          ✕
        </button>

        <h2 className= "text-2xl md:text-3xl text-white font-bold mb-6">{stock.symbol}</h2>
        <div className="text-white space-y-4">
          <p>
            Price:
            <span className="ml-2 font-semibold">${stock.price?.toFixed(2)}</span>
          </p>

          <p>
            Change:
            <span className={`ml-2 ${stock.change > 0 ? "text-green-400" : "text-red-400"}`}>{stock.change?.toFixed(2)}%</span>
          </p>
        </div>
        {chartLoading ? (
          <div className='w-full h-48 md:h-64 mt-6 flex items-center justify-center text-sm text-zinc-400'>
            Loading chart...
          </div>
        ) : chartError ? (
          <div className='w-full h-48 md:h-64 mt-6 flex items-center justify-center text-sm text-zinc-400'>
            {chartError}
          </div>
        ) : (
          <div className="flex-col gap-2 mt-6 mb-4">
            {
            ["1D","1W","1M","1Y"]
              .map((t) => (
                <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 rounded ${timeframe===t ?"bg-green-500":"bg-zinc-700"} text-white`}>{t}</button>
            ))}

            <StockChart data={chartData} />

            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Latest News</h3>
              {
                news.length === 0 ? (
                  <p className="text-zinc-400">No news available</p>
                ) : (
                  news.map((article) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block mb-4 p-3 rounded bg-zinc-800 hover:bg-zinc-700"
                    >
                      <p className="text-white font-medium">{article.headline}</p>
                      <p className="text-sm text-zinc-400 mt-1">{article.source}</p>
                    </a>
                  ))
                )
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockModal;
