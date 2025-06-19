import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Loader, XCircle } from 'lucide-react';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment, please wait...');
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (!reference) {
      setVerificationStatus('failed');
      setMessage('No transaction reference found.');
      return;
    }

    const verifyPayment = async () => {
      const alreadyProcessed = localStorage.getItem('last_processed_tx') === reference;
      if(alreadyProcessed) {
        setVerificationStatus('success');
        setMessage("This transaction has already been processed.");
        return;
      }

      try {
        // --- THIS IS THE CORRECTED LINE ---
        const response = await fetch(`https://healthhalo-payment-1.onrender.com/api/payment/verify?reference=${reference}`);
        const result = await response.json();

        if (result.status && result.data.status === 'success') {
          const verifiedAmount = result.data.amount / 100;
          setAmount(verifiedAmount);
          const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0');
          const newBalance = currentBalance + verifiedAmount;
          localStorage.setItem('walletBalance', newBalance.toString());

          const newTransaction = { id: reference, type: 'Wallet Top-up', amount: verifiedAmount, date: new Date().toISOString(), status: 'successful' };
          const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
          const updatedHistory = [newTransaction, ...history];
          localStorage.setItem('transactionHistory', JSON.stringify(updatedHistory));
          localStorage.setItem('last_processed_tx', reference);
          
          setVerificationStatus('success');
          setMessage(`Your payment of ₦${verifiedAmount.toLocaleString()} was successful.`);
        } else {
          throw new Error(result.data.gateway_response || 'Payment failed.');
        }
      } catch (error) {
        setVerificationStatus('failed');
        setMessage(`Verification failed. Please contact support. ${error instanceof Error ? error.message : ''}`);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const renderContent = () => {
    switch(verificationStatus) {
      case 'success': return { icon: <CheckCircle className="h-10 w-10 text-white" />, title: "Payment Successful!" };
      case 'failed': return { icon: <XCircle className="h-10 w-10 text-white" />, title: "Payment Failed" };
      default: return { icon: <Loader className="h-10 w-10 text-white animate-spin" />, title: "Verifying..." };
    }
  };
  const { icon, title } = renderContent();
  const bgColor = verificationStatus === 'success' ? 'from-emerald-500 to-teal-500' : verificationStatus === 'failed' ? 'from-red-500 to-pink-500' : 'from-slate-500 to-slate-600';

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center m-4 transform animate-fadeInUp">
        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r ${bgColor} mb-6 shadow-lg`}>{icon}</div>
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <p className="mt-4 text-lg text-slate-600 min-h-[56px]">{message}</p>
        <div className="mt-8"><Link to="/wallet" className="w-full inline-block bg-slate-800 text-white p-4 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-slate-700 group"><span className="flex items-center justify-center"><ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />Back to Wallet</span></Link></div>
      </div>
    </div>
  );
};

export default SuccessPage;