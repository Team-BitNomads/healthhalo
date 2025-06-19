import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowRight, ArrowDownCircle, Shield, X, Loader } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// --- UPDATED: Add 'Withdrawal' to the transaction type ---
interface Transaction {
    id: string;
    type: 'Wallet Top-up' | 'Premium Payment' | 'Co-pay' | 'Withdrawal';
    amount: number;
    date: string;
    status: 'successful' | 'pending' | 'failed';
}

// --- NEW: A reusable modal component for withdrawal confirmation ---
interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    amount: string;
    password: string;
    setPassword: (password: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, onConfirm, isLoading, amount, password, setPassword }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100"><X className="h-5 w-5 text-slate-500"/></button>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-5 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 text-center">Confirm Withdrawal</h2>
                <p className="mt-2 text-center text-slate-500">
                    You are about to withdraw <span className="font-bold text-slate-800">₦{parseFloat(amount).toLocaleString()}</span>. Please enter your password to authorize this transaction.
                </p>
                <div className="mt-6 space-y-4">
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button onClick={onConfirm} disabled={isLoading || !password} className="w-full flex items-center justify-center bg-red-600 text-white p-3.5 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300">
                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : `Withdraw ₦${parseFloat(amount).toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};


const WalletLayout = () => {
  const [balance, setBalance] = useState<number>(0);
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // --- NEW STATE for Withdrawal ---
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const location = useLocation();

  const loadWalletData = () => {
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) setBalance(parseFloat(savedBalance));
    
    const savedHistory = localStorage.getItem('transactionHistory');
    if (savedHistory) setTransactions(JSON.parse(savedHistory));
  };

  useEffect(() => {
    loadWalletData();
    window.addEventListener('focus', loadWalletData);
    return () => { window.removeEventListener('focus', loadWalletData); };
  }, [location]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return alert("Please enter a valid amount.");
    setIsTopUpLoading(true);
    try {
        const response = await fetch('https://healthhalo-payment.onrender.com/api/payment/initialize', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'sodiqadetola08@gmail.com', amount: parseFloat(topUpAmount) })
        });
        const result = await response.json();
        if (result.status === true && result.data?.authorization_url) {
            window.location.href = result.data.authorization_url;
        } else { throw new Error(result.message || 'Failed to get authorization URL.'); }
    } catch (error) {
        alert(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsTopUpLoading(false);
    }
  };

  // --- NEW HANDLERS for Withdrawal ---
  const handleInitiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount to withdraw.");
    if (amount > balance) return alert("Withdrawal amount cannot exceed your current balance.");
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    if (!withdrawPassword) return alert("Please enter your password to confirm.");
    setIsWithdrawing(true);
    
    // Simulate API call and confirmation
    setTimeout(() => {
      // 1. Calculate new balance
      const amount = parseFloat(withdrawalAmount);
      const newBalance = balance - amount;
      
      // 2. Create new transaction record
      const newTransaction: Transaction = {
        id: `WTH-${Date.now()}`,
        type: 'Withdrawal',
        amount: amount,
        date: new Date().toISOString(),
        status: 'successful'
      };

      // 3. Update localStorage
      localStorage.setItem('walletBalance', newBalance.toString());
      const updatedHistory = [newTransaction, ...transactions];
      localStorage.setItem('transactionHistory', JSON.stringify(updatedHistory));

      // 4. Update state and reset forms
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
      setWithdrawalAmount('');
      setWithdrawPassword('');
      loadWalletData(); // Reload all data to ensure UI consistency
      alert("Withdrawal successful!");
    }, 2000);
  };

  return (
    <div className="animate-fadeInUp">
      <WithdrawalModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleConfirmWithdrawal}
        isLoading={isWithdrawing}
        amount={withdrawalAmount}
        password={withdrawPassword}
        setPassword={setWithdrawPassword}
      />
      <div className="mb-10"><h1 className="text-4xl font-bold text-slate-800 tracking-tight">Health Wallet</h1><p className="text-slate-500 mt-2 text-lg">Manage your funds for premiums and health services.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl shadow-2xl"><div className="flex items-center justify-between"><p className="text-lg opacity-80">Current Balance</p><Wallet className="h-8 w-8 opacity-80" /></div><p className="text-5xl font-bold mt-2">₦ {balance.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60"><h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4"><PlusCircle className="mr-2 text-emerald-600" /> Top Up Your Wallet</h3><form onSubmit={handleTopUp} className="flex flex-col md:flex-row items-center gap-4"><div className="relative w-full"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span><input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="e.g., 5000" className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"/></div><button type="submit" disabled={isTopUpLoading} className="w-full md:w-auto flex items-center justify-center bg-slate-800 text-white py-3.5 px-6 rounded-lg font-semibold whitespace-nowrap hover:bg-slate-700 transition-colors disabled:bg-slate-400">{isTopUpLoading ? 'Processing...' : 'Proceed to Pay'}{!isTopUpLoading && <ArrowRight className="ml-2 h-5 w-5" />}</button></form></div>
          
          {/* --- NEW WITHDRAWAL CARD --- */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4"><ArrowDownCircle className="mr-2 text-red-600" /> Withdraw Funds</h3>
            <form onSubmit={handleInitiateWithdrawal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600">Amount to Withdraw</label>
                        <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} placeholder="e.g., 1000" className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600">Bank</label>
                        <select className="mt-1 w-full p-2 border border-slate-300 rounded-md"><option>Select Bank</option><option>Access Bank</option><option>GTBank</option><option>Kuda Bank</option></select>
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium text-slate-600">Account Number</label>
                    <input type="text" placeholder="0123456789" className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">Withdraw</button>
                </div>
            </form>
          </div>
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