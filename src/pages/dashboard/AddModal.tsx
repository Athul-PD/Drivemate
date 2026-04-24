import { useState } from "react";
import { addDoc,collection,serverTimestamp } from 'firebase/firestore';
import { db } from "../../firebase-auth/firebase";
import { auth } from "../../firebase-auth/firebase";

interface AddModalProps {
  onClose: () => void;
  workspaceId: string | null;
}

const AddModal = ({onClose,workspaceId}: AddModalProps) => {

    const [title,setTitle] = useState("");
    const [type, setType] = useState("expense");
    const [amount,setAmount] = useState("");
    const [date,setDate] = useState("");
    const [description,setDescription] = useState("");

    const handleAdd = async() => {
        if( !amount || !date){
            alert('Please fill required fields')
            return
        }
        if (!auth.currentUser) {
            alert('You must be logged in to add a transaction')
            return
        }
        if (!workspaceId) {
            alert('No workspace found')
            return
        }

        try{
            await addDoc(collection(db,'transactions'),{
                title: title || 'General',
                type,
                amount: Number(amount),
                description,
                addedBy: auth.currentUser.email,
                date,
                workspaceId: workspaceId,
                createdAt: serverTimestamp()
            })
            alert('Transaction added successfully!')
            setTitle('');
            setType('expense');
            setAmount('');
            setDate('');
            setDescription('');
            onClose();
        }catch(err){
            console.error(err)
            alert('Failed to add transaction')
        }
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 md:p-0 z-50">

      <div className="bg-slate-900 text-white w-full max-w-[500px] rounded-xl p-5 md:p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base md:text-lg font-semibold">Add New Transaction</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-300 transition">✕</button>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="text-xs md:text-sm text-slate-400 block mb-2">Category</label>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 md:p-2.5 bg-slate-800 border border-slate-700 rounded text-xs md:text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Fuel">Fuel</option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Home">Home</option>
            <option value="General">General</option>
            <option value="Other">Other</option>
            <option value="Holidays">Holidays</option>
          </select>
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="text-xs md:text-sm text-slate-400 block mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 md:p-2.5 bg-slate-800 border border-slate-700 rounded text-xs md:text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-xs md:text-sm text-slate-400 block mb-2">Amount *</label>
          <input 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Enter amount"
            className="w-full p-2 md:p-2.5 bg-slate-800 border border-slate-700 rounded text-xs md:text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="text-xs md:text-sm text-slate-400 block mb-2">Date *</label>
          <input 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="w-full p-2 md:p-2.5 bg-slate-800 border border-slate-700 rounded text-xs md:text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-700 rounded text-xs md:text-sm font-medium transition"
          >
            Cancel
          </button>

          <button 
            onClick={handleAdd} 
            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded text-xs md:text-sm font-medium transition"
          >
            Add Transaction
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddModal
