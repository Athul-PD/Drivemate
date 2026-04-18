const Analytics = ({ transactions, workspace }: any) => {
  const totalIncome = transactions.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const transactionCount = transactions.length;

  // Calculate daily, weekly, monthly expenses
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

  const getDailyExpense = () => {
    return transactions
      .filter((t: any) => {
        if (t.type !== "expense") return false;
        const transDate = t.date ? new Date(t.date.seconds ? t.date.seconds * 1000 : t.date) : null;
        if (!transDate) return false;
        const transDay = new Date(transDate.getFullYear(), transDate.getMonth(), transDate.getDate());
        return transDay.getTime() === today.getTime();
      })
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  };

  const getWeeklyExpense = () => {
    return transactions
      .filter((t: any) => {
        if (t.type !== "expense") return false;
        const transDate = t.date ? new Date(t.date.seconds ? t.date.seconds * 1000 : t.date) : null;
        if (!transDate) return false;
        return transDate >= weekAgo && transDate <= now;
      })
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  };

  const getMonthlyExpense = () => {
    return transactions
      .filter((t: any) => {
        if (t.type !== "expense") return false;
        const transDate = t.date ? new Date(t.date.seconds ? t.date.seconds * 1000 : t.date) : null;
        if (!transDate) return false;
        return transDate >= monthAgo && transDate <= now;
      })
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  };

  const dailyExpense = getDailyExpense();
  const weeklyExpense = getWeeklyExpense();
  const monthlyExpense = getMonthlyExpense();

  return (
    <div className="w-full flex flex-col gap-3 md:gap-[15px] p-4 md:p-0">
      <div className="p-4 md:p-[18px] bg-slate-800 rounded-lg md:rounded-none">
        <h1 className="text-lg md:text-[24px] font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-xs md:text-sm">View your workspace financial analytics</p>
      </div>

      {/* Main Stats Cards */}
      <div className="px-4 md:px-[18px] grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {/* Total Income Card */}
        <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
          <p className="text-gray-400 text-xs md:text-sm mb-2">Total Income</p>
          <p className="text-green-400 text-base md:text-3xl font-bold">₹{totalIncome}</p>
        </div>

        {/* Total Expense Card */}
        <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
          <p className="text-gray-400 text-xs md:text-sm mb-2">Total Expense</p>
          <p className="text-red-400 text-base md:text-3xl font-bold">₹{totalExpense}</p>
        </div>

        {/* Balance Card */}
        <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
          <p className="text-gray-400 text-xs md:text-sm mb-2">Balance</p>
          <p className={`text-base md:text-3xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>₹{balance}</p>
        </div>

        {/* Transaction Count Card */}
        <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
          <p className="text-gray-400 text-xs md:text-sm mb-2">Total Transactions</p>
          <p className="text-purple-400 text-base md:text-3xl font-bold">{transactionCount}</p>
        </div>
      </div>

      {/* Period-wise Expense Section */}
      <div className="px-4 md:px-[18px]">
        <h2 className="text-sm md:text-lg font-bold text-white mb-3">Expense Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          {/* Daily Expense */}
          <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Daily Expense</p>
            <p className="text-orange-400 text-base md:text-2xl font-bold">₹{dailyExpense}</p>
            <p className="text-gray-500 text-xs mt-2">Today</p>
          </div>

          {/* Weekly Expense */}
          <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Weekly Expense</p>
            <p className="text-yellow-400 text-base md:text-2xl font-bold">₹{weeklyExpense}</p>
            <p className="text-gray-500 text-xs mt-2">Last 7 days</p>
          </div>

          {/* Monthly Expense */}
          <div className="bg-slate-800 p-3 md:p-6 rounded-lg border border-slate-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Monthly Expense</p>
            <p className="text-red-400 text-base md:text-2xl font-bold">₹{monthlyExpense}</p>
            <p className="text-gray-500 text-xs mt-2">This month</p>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="px-4 md:px-[18px] pb-4 md:pb-0">
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700 md:rounded-none md:border-none">
          <h2 className="text-sm md:text-lg font-bold text-white mb-4">Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Workspace</p>
              <p className="text-white font-semibold text-sm md:text-base truncate">{workspace?.name || 'Loading...'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Team Code</p>
              <p className="text-white font-semibold text-sm md:text-base font-mono">{workspace?.code || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Created Date</p>
              <p className="text-white font-semibold text-sm md:text-base">
                {workspace?.createdAt ? new Date(workspace.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
