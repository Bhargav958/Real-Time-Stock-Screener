const LoadingSkeleton = () => {
  return (
    <div className='border border-zinc-800 rounded-xl overflow-hidden'>
      {
        Array(5).fill(0).map((_,i)=>(
          <div key={i} className='flex justify-between p-4 border border-zinc-800 animate-pulse'>
            <div className='h-5 w-16 bg-zinc-700 rounded'></div>
            <div className='h-5 w-20 bg-zinc-700 rounded'></div>
            <div className='h-5 w-12 bg-zinc-700 rounded'></div>
          </div>
        ))
      }
    </div>
  )
}

export default LoadingSkeleton
