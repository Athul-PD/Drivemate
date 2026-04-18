import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import AddModal from "./AddModal";

interface HomeProps {
  transactions: any[];
  workspaceId: string | null;
  workspace: any;
}

const Home = ({transactions,workspaceId,workspace}: HomeProps) => {

  const [add,setAdd] = useState(false);
  const [copied, setCopied] = useState(false);

  const addNewTransations = () => {
    setAdd(true)
  }

  const copyCode = async () => {
    if (!workspace?.code) return;
    try {
      await navigator.clipboard.writeText(workspace.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // ignore clipboard failures
    }
  }

  const totalIncome = transactions.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + t.amount,0)

  const totalExpense = transactions.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + t.amount,0)

  const balance = totalIncome - totalExpense

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date.seconds ? date.seconds * 1000 : date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="w-full flex flex-col gap-3 md:gap-[15px] p-4 md:p-0">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between p-3 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none gap-3 md:gap-0">
        <div className="flex flex-col gap-1.5 flex-1">
            <h1 className="text-lg md:text-[22px] font-black truncate">{workspace?.name || "Loading..."}</h1>
            <p className="text-xs md:text-[15px] font-bold flex items-center gap-2 flex-wrap">
              <span className="text-gray-500">Team code: </span>
              <span className="font-mono">{workspace?.code}</span>
              {workspace?.code ? (
                <button
                  type="button"
                  onClick={copyCode}
                  className="text-gray-400 hover:text-white transition"
                  title={copied ? "Copied" : "Copy code"}
                >
                  <FiCopy size={16} />
                </button>
              ) : null}
              {copied && <span className="text-xs text-emerald-300">Copied!</span>}
            </p>
        </div>
        <button onClick={addNewTransations} className="w-full md:w-auto flex items-center justify-center text-sm md:text-[16px] gap-2 bg-slate-900 hover:bg-slate-700 px-4 md:px-[15px] py-2 md:py-[8px] rounded-[8px] transition">
          <IoMdAdd size={20}/>
          <span>Add New</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 px-4 md:px-[18px] pb-4 md:pb-[15px] border-b-[0.5px] border-slate-700">
        <div className="card bg-emerald-700 hover:bg-emerald-600 rounded-[10px] flex-1 p-4">
            <p className="text-xs md:text-sm text-green-100">Total Income</p>
            <h2 className="text-base md:text-[20px] font-medium mt-2">₹{totalIncome}</h2>
        </div>
        <div className="card bg-rose-700 hover:bg-rose-600 rounded-[10px] flex-1 p-4">
            <p className="text-xs md:text-sm text-red-100">Total Expense</p>
            <h2 className="text-base md:text-[20px] font-medium mt-2">₹{totalExpense}</h2>
        </div>
        <div className="card bg-blue-800 hover:bg-blue-700 rounded-[10px] flex-1 p-4">
            <p className="text-xs md:text-sm text-blue-100">Total Balance</p>
            <h2 className="text-base md:text-[20px] font-medium mt-2">₹{balance}</h2>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="px-4 md:px-[18px] pb-4">
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg">
          <h2 className="text-base md:text-lg font-bold mb-4 text-white">Recent Transactions</h2>
          
          {transactions.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-white text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-slate-700">
                      <th className="pb-4 px-3 text-xs md:text-sm">Title</th>
                      <th className="pb-4 px-3 text-xs md:text-sm">Type</th>
                      <th className="pb-4 px-3 text-xs md:text-sm">Amount</th>
                      <th className="pb-4 px-3 text-xs md:text-sm">Added By</th>
                      <th className="pb-4 px-3 text-xs md:text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((t: any) => (
                      <tr key={t.id} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="py-3 px-3 text-xs md:text-sm">{t.title}</td>
                        <td className={`py-3 px-3 text-xs md:text-sm font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                          {t.type === "income" ? "Income" : "Expense"}
                        </td>
                        <td className="py-3 px-3 text-xs md:text-sm font-bold">₹{t.amount}</td>
                        <td className="py-3 px-3 text-xs md:text-sm text-gray-300">{t.addedBy?.split('@')[0]}</td>
                        <td className="py-3 px-3 text-xs md:text-sm text-gray-400">{formatDate(t.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-3">
                {transactions.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-400">Title</p>
                        <p className="text-sm font-semibold text-white">{t.title}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${t.type === "income" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p className="font-bold text-white">₹{t.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Added By</p>
                        <p className="text-gray-300">{t.addedBy?.split('@')[0]}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400">Date</p>
                        <p className="text-gray-300">{formatDate(t.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {add && <AddModal onClose={()=>setAdd(false)} workspaceId={workspaceId}/>}
    </div>
  )
}

export default Home
