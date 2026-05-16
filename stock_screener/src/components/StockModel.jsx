import React from "react";

const StockModal = ({ stock, onClose }) => {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-8 rounded-xl w-[400px] border border-zinc-700">
        <button
          onClick={onClose}
          className=" float-right text-zinc-400">
          ✕
        </button>

        <h2 className= "text-3xl text-white font-bold mb-6">{stock.symbol}</h2>
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
      </div>
    </div>
  );
};

export default StockModal;
