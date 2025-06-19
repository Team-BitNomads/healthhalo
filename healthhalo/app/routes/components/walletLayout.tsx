import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowRight } from 'lucide-react';

// Define the same transaction type here
interface Transaction {
    id: string;
    type: 'Wallet Top-up' | 'Premium Payment' | 'Co-pay';
    amount: number;
    date: string;
    status: 'successful' | 'pending' | 'failed';
}

const WalletLayout = () => {
  const [balance, setBalance] = useState<number>(0);
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // --- THIS IS THE NEW, ROBUST DATA-LOADING FUNCTION ---
  const loadWalletData = () => {
    console.log("Reloading wallet data...");
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    
    const savedHistory = localStorage.getItem('transactionHistory');
    if (savedHistory) {
      setTransactions(JSON.parse(savedHistory));
    }
  };

  useEffect(() => {
    // Load data when the component first mounts
    loadWalletData();

    // --- THIS IS THE FIX ---
    // Add an event listener that re-loads data whenever the browser window comes into focus.
    // This is the most reliable way to catch changes after navigating back from another tab/page.
    window.addEventListener('focus', loadWalletData);

    // CRITICAL: Clean up the event listener when the component unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener('focus', loadWalletData);
    };
  }, []); // The empty dependency array [] ensures this setup runs only once.


  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return alert("Please enter a valid amount.");
    setIsLoading(true);
    try {
        const response = await fetch('https://healthhalo-payment-1.onrender.com/api/payment/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'sodiqadetola08@gmail.com', amount: parseFloat(topUpAmount) })
        });
        const result = await response.json();
        if (result.status === true && result.data?.authorization_url) {
            window.location.href = result.data.authorization_url;
        } else {
            throw new Error(result.message || 'Failed to get authorization URL.');
        }
    } catch (error) {
        alert(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-10"><h1 className="text-4xl font-bold text-slate-800 tracking-tight">Health Wallet</h1><p className="text-slate-500 mt-2 text-lg">Manage your funds for premiums and health services.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl shadow-2xl"><div className="flex items-center justify-between"><p className="text-lg opacity-80">Current Balance</p><Wallet className="h-8 w-8 opacity-80" /></div><p className="text-5xl font-bold mt-2">₦ {balance.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60"><h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4"><PlusCircle className="mr-2 text-emerald-600" /> Top Up Your Wallet</h3><form onSubmit={handleTopUp} className="flex flex-col md:flex-row items-center gap-4"><div className="relative w-full"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span><input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="e.g., 5000" className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"/></div><button type="submit" disabled={isLoading} className="w-full md:w-auto flex items-center justify-center bg-slate-800 text-white py-3.5 px-6 rounded-lg font-semibold whitespace-nowrap hover:bg-slate-700 transition-colors disabled:bg-slate-400">{isLoading ? 'Processing...' : 'Proceed to Pay'}{!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}</button></form></div>
        </div>
        
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 border-b pb-3">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">{tx.type}</p>
                    <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-bold ${tx.type === 'Wallet Top-up' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'Wallet Top-up' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;