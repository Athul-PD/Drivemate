import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase-auth/firebase";
import { MdDelete } from "react-icons/md";

const Transactions = ({ transactions }: any) => {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (transactionId: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    setDeleting(transactionId);
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date.seconds ? date.seconds * 1000 : date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="w-full flex flex-col gap-[15px] p-4 md:p-0">
      <div className="p-4 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none">
        <h1 className="text-xl md:text-[24px] font-bold text-white">Transactions</h1>
        <p className="text-gray-400 text-xs md:text-sm">View and manage all your workspace transactions</p>
      </div>

      <div className="p-4 md:p-[18px] flex flex-col">
        {transactions && transactions.length > 0 ? (
          <>
            {/* Desktop Table View (lg and above) */}
            <div className="hidden lg:block overflow-x-auto bg-slate-800 rounded-lg p-4 md:p-5">
              <table className="w-full text-left text-white text-sm">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-4">Who</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Description</th>
                    <th className="px-4 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction: any) => (
                    <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="px-4 py-4 text-sm font-medium">{transaction.addedBy?.split('@')[0] || 'Unknown'}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          transaction.type === 'income' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold">₹{transaction.amount}</td>
                      <td className="px-4 py-4 text-sm">{formatDate(transaction.date)}</td>
                      <td className="px-4 py-4 text-sm text-gray-300">{transaction.title || transaction.description || 'N/A'}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deleting === transaction.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded text-xs font-medium transition"
                          title="Delete transaction"
                        >
                          <MdDelete size={16} />
                          {deleting === transaction.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="lg:hidden flex flex-col gap-3">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Added by</p>
                      <p className="text-sm font-medium text-white">{transaction.addedBy?.split('@')[0] || 'Unknown'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${
                      transaction.type === 'income' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Amount</p>
                      <p className="text-lg font-bold text-white">₹{transaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm text-white">{formatDate(transaction.date)}</p>
                    </div>
                  </div>

                  {(transaction.title || transaction.description) && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Category/Description</p>
                      <p className="text-sm text-gray-200">{transaction.title || transaction.description || 'N/A'}</p>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deleting === transaction.id}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded text-sm font-medium transition"
                    title="Delete transaction"
                  >
                    <MdDelete size={16} />
                    {deleting === transaction.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
