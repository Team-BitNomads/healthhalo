import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Wallet,
  PlusCircle,
  ArrowRight,
  ArrowDownCircle,
  Shield,
  X,
  Loader,
} from "lucide-react";

const API_BASE_URL = "https://healthhalo.onrender.com"; // Your live backend URL
const PAYMENT_SERVER_URL = "https://healthhalo-payment.onrender.com"; // Your live payment server

// --- Type to match the API's transaction object ---
interface ApiTransaction {
  id: number;
  amount: string;
  transaction_type: "topup" | "withdrawal" ;
  timestamp: string;
  description: string;
}

// --- Withdrawal Modal Props ---
interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  amount: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}
// --- Withdrawal Modal ---
const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  amount,
  password,
  setPassword,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
          onClick={onClose}
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Confirm Withdrawal</h2>
        <p className="mb-4 text-slate-600">
          You are about to withdraw <span className="font-semibold">₦{parseFloat(amount || "0").toLocaleString()}</span> from your wallet.
        </p>
        <label className="block mb-2 text-sm font-medium text-slate-600">
          Enter your password to confirm:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md mb-4"
          disabled={isLoading}
        />
        <button
          onClick={onConfirm}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : null}
          {isLoading ? "Processing..." : "Confirm Withdrawal"}
        </button>
      </div>
    </div>
  );
};

const WalletLayout = () => {
  // --- STATE MANAGEMENT ---
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Top-up State
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  // Withdrawal State
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // --- DATA FETCHING ---
  const fetchWalletData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication Error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/wallet/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const walletData = response.data.wallet;
      setBalance(parseFloat(walletData.balance));
      // Sort transactions by newest first
      setTransactions(
        walletData.transactions.sort(
          (a: ApiTransaction, b: ApiTransaction) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
      setError(null);
    } catch (err) {
      console.error("Failed to fetch wallet data:", err);
      setError("Could not load wallet information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    // Add event listener to refetch data on window focus
    window.addEventListener("focus", fetchWalletData);
    return () => {
      window.removeEventListener("focus", fetchWalletData);
    };
  }, []); // Empty array ensures this runs only on mount and on focus

  // --- HANDLER FUNCTIONS ---
  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || parseFloat(topUpAmount) <= 0)
      return alert("Please enter a valid amount.");
    setIsTopUpLoading(true);
    try {
      const response = await fetch(
        `${PAYMENT_SERVER_URL}/api/payment/initialize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "sodiqadetola08@gmail.com",
            amount: parseFloat(topUpAmount),
          }),
        }
      );
      const result = await response.json();
      if (result.status === true && result.data?.authorization_url) {
        window.location.href = result.data.authorization_url;
      } else {
        throw new Error(result.message || "Failed to get authorization URL.");
      }
    } catch (error) {
      alert(
        `Payment initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsTopUpLoading(false);
    }
  };

  const handleInitiateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0)
      return alert("Please enter a valid amount to withdraw.");
    if (amount > balance)
      return alert("Withdrawal amount cannot exceed your current balance.");
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdrawal = async () => {
    if (!withdrawPassword)
      return alert("Please enter your password to confirm.");
    setIsWithdrawing(true);
    const token = localStorage.getItem("access_token");

    try {
      // --- THIS IS THE REAL API CALL ---
      await axios.post(
        `${API_BASE_URL}/api/wallet/`,
        {
          amount: parseFloat(withdrawalAmount),
          transaction_type: "withdrawal",
          description: "User withdrawal",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Withdrawal successful!");
      // Refresh all data from the backend
      fetchWalletData();
    } catch (err) {
      console.error("Withdrawal failed:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "An unknown error occurred.";
      alert(`Withdrawal Failed: ${errorMessage}`);
    } finally {
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
      setWithdrawalAmount("");
      setWithdrawPassword("");
    }
  };

  // Helper to format transaction type for display
  const formatTransactionType = (type: string) => {
    if (type === "topup") return "Wallet Top-up";
    if (type === "withdrawal") return "Withdrawal";
    return "Payment";
  };

  if (isLoading)
    return <div className="text-center p-10">Loading Your Wallet...</div>;
  if (error)
    return <div className="text-red-500 p-10 text-center">{error}</div>;

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
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Health Wallet
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Manage your funds for premiums and health services.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-lg opacity-80">Current Balance</p>
              <Wallet className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-5xl font-bold mt-2">
              ₦ {balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4">
              <PlusCircle className="mr-2 text-emerald-600" /> Top Up Your
              Wallet
            </h3>
            <form
              onSubmit={handleTopUp}
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                  ₦
                </span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={isTopUpLoading}
                className="w-full md:w-auto flex items-center justify-center bg-slate-800 text-white py-3.5 px-6 rounded-lg font-semibold whitespace-nowrap hover:bg-slate-700 transition-colors disabled:bg-slate-400"
              >
                {isTopUpLoading ? "Processing..." : "Proceed to Pay"}
                {!isTopUpLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-4">
              <ArrowDownCircle className="mr-2 text-red-600" /> Withdraw Funds
            </h3>
            <form onSubmit={handleInitiateWithdrawal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Amount to Withdraw
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="e.g., 1000"
                    className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Bank
                  </label>
                  <select className="mt-1 w-full p-2 border border-slate-300 rounded-md">
                    <option>Select Bank</option>
                    <option>Access Bank</option>
                    <option>GTBank</option>
                    <option>Kuda Bank</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="0123456789"
                  className="mt-1 w-full p-2 border border-slate-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 border-b pb-3">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">
                      {formatTransactionType(tx.transaction_type)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      tx.transaction_type === "topup"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {tx.transaction_type === "topup" ? "+" : "-"} ₦
                    {parseFloat(tx.amount).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No transactions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLayout;
