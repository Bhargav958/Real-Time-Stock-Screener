import {Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

const StockChart = ({ data }) => {
  if(!data || data.length===0){
    return (
      <div className='w-full h-48 md:h-64 mt-6 flex items-center justify-center text-sm text-zinc-400'>
        No chart data available
      </div>
    )
  }

  return (
    <div className='w-full h-48 md:h-64 mt-6'>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <XAxis dataKey="date" stroke="#a1a1aa" />
        <YAxis stroke="#a1a1aa" domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StockChart
