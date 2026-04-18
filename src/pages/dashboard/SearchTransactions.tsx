import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase-auth/firebase";
import { MdDelete } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";

const SearchTransactions = ({ transactions }: any) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const formatDate = (date: any) => {
    if (!date) return "";
    const dateObj = new Date(date.seconds ? date.seconds * 1000 : date);
    return dateObj.toISOString().split("T")[0];
  };

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

  // Filter transactions by selected date
  const filteredTransactions = selectedDate
    ? transactions.filter((t: any) => formatDate(t.date) === selectedDate)
    : [];

  const totalFilteredIncome = filteredTransactions
    .filter((t: any) => t.type === "income")
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter((t: any) => t.type === "expense")
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const filteredBalance = totalFilteredIncome - totalFilteredExpense;

  return (
    <div className="w-full flex flex-col gap-3 md:gap-[15px] p-4 md:p-0">
      {/* Header */}
      <div className="p-4 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none">
        <h1 className="text-lg md:text-[24px] font-bold text-white flex items-center gap-2">
          <FiCalendar size={24} /> Search by Date
        </h1>
        <p className="text-gray-400 text-xs md:text-sm">Select a date to view all transactions for that day</p>
      </div>

      {/* Date Picker Section */}
      <div className="px-4 md:px-[18px]">
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <label className="text-sm md:text-base font-semibold text-white block mb-3">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-1/3 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4 md:px-[18px]">
        {selectedDate ? (
          <>
            {/* Stats for Selected Date */}
            {filteredTransactions.length > 0 && (
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                <div className="bg-slate-800 p-3 md:p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">Income</p>
                  <p className="text-green-400 font-bold text-base md:text-lg">₹{totalFilteredIncome}</p>
                </div>
                <div className="bg-slate-800 p-3 md:p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">Expense</p>
                  <p className="text-red-400 font-bold text-base md:text-lg">₹{totalFilteredExpense}</p>
                </div>
                <div className="bg-slate-800 p-3 md:p-4 rounded-lg border border-slate-700">
                  <p className="text-gray-400 text-xs md:text-sm mb-1">Net</p>
                  <p className={`font-bold text-base md:text-lg ${filteredBalance >= 0 ? "text-blue-400" : "text-red-400"}`}>
                    ₹{filteredBalance}
                  </p>
                </div>
              </div>
            )}

            {/* Transactions List */}
            {filteredTransactions.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto bg-slate-800 rounded-lg p-4 md:p-5">
                  <table className="w-full text-left text-white text-sm">
                    <thead className="bg-slate-800 border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-4">Who</th>
                        <th className="px-4 py-4">Type</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Category</th>
                        <th className="px-4 py-4">Time</th>
                        <th className="px-4 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction: any) => (
                        <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-700">
                          <td className="px-4 py-4 text-sm font-medium">
                            {transaction.addedBy?.split("@")[0] || "Unknown"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                transaction.type === "income"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-red-900 text-red-300"
                              }`}
                            >
                              {transaction.type === "income" ? "Income" : "Expense"}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold">₹{transaction.amount}</td>
                          <td className="px-4 py-4 text-sm">{transaction.title || "N/A"}</td>
                          <td className="px-4 py-4 text-xs text-gray-400">
                            {transaction.date
                              ? new Date(transaction.date.seconds ? transaction.date.seconds * 1000 : transaction.date).toLocaleTimeString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              disabled={deleting === transaction.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded text-xs font-medium transition"
                              title="Delete transaction"
                            >
                              <MdDelete size={16} />
                              {deleting === transaction.id ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Card View */}
                <div className="lg:hidden flex flex-col gap-3">
                  {filteredTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">Added by</p>
                          <p className="text-sm font-medium text-white">
                            {transaction.addedBy?.split("@")[0] || "Unknown"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${
                            transaction.type === "income"
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Amount</p>
                          <p className="text-lg font-bold text-white">₹{transaction.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Category</p>
                          <p className="text-sm text-white">{transaction.title || "N/A"}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Time</p>
                        <p className="text-xs text-gray-300">
                          {transaction.date
                            ? new Date(transaction.date.seconds ? transaction.date.seconds * 1000 : transaction.date).toLocaleTimeString()
                            : "N/A"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deleting === transaction.id}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded text-sm font-medium transition"
                        title="Delete transaction"
                      >
                        <MdDelete size={16} />
                        {deleting === transaction.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-400 bg-slate-800 rounded-lg p-4">
                <p>No transactions found for this date</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-400 bg-slate-800 rounded-lg p-6">
            <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Select a date to view transactions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTransactions;
