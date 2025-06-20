import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus, ShieldCheck, Info, X, Check } from "lucide-react";

// --- Types for our data ---
interface Circle {
  id: number;
  name: string;
  members_count: number;
  balance: number;
  contribution_amount: number;
  status: "healthy" | "low";
}

// --- Create Circle Modal Component ---
interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newCircleData: {
    name: string;
    contribution_amount: number;
  }) => void;
}
const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [contribution_amount, setContributionAmount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contribution_amount || parseFloat(contribution_amount) <= 0) {
      alert("Please fill out all fields with valid values.");
      return;
    }
    onCreate({ name, contribution_amount: parseFloat(contribution_amount) });
    setName("");
    setContributionAmount("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          Create a New Circle
        </h2>
        <p className="text-slate-500 mb-6">
          Start a new community for shared health security.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Circle Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-3 border-2 border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Adetola Family Fund"
            />
          </div>
          <div>
            <label
              htmlFor="contribution_amount"
              className="block text-sm font-medium text-slate-700"
            >
              Weekly Contribution (₦)
            </label>
            <input
              type="number"
              id="contribution_amount"
              value={contribution_amount}
              onChange={(e) => setContributionAmount(e.target.value)}
              required
              className="mt-1 block w-full p-3 border-2 border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 5000"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/40"
            >
              Create Circle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Join Circle Confirmation Modal ---
interface JoinCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  circle: Circle | null;
}
const JoinCircleModal: React.FC<JoinCircleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  circle,
}) => {
  const [agreed, setAgreed] = useState(false);
  if (!isOpen || !circle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full m-4 transform animate-[scaleUp_0.4s_ease-in-out_forwards]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Join "{circle.name}"
        </h2>
        <p className="text-slate-500 mb-6">
          Review the details below before joining.
        </p>
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Contribution Amount:</span>
            <span className="font-bold text-emerald-600">
              ₦{circle.contribution_amount.toLocaleString()} / week
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Current Members:</span>
            <span className="font-bold text-slate-800">
              {circle.members_count}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Current Pool Balance:</span>
            <span className="font-bold text-slate-800">
              ₦{circle.balance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-start space-x-3 p-3 bg-emerald-50/50 rounded-lg">
          <input
            type="checkbox"
            id="agree-withdraw"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-5 w-5 rounded mt-1 text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <label htmlFor="agree-withdraw" className="text-sm text-slate-600">
            I agree to allow HealthHalo to automatically deduct{" "}
            <span className="font-bold">
              ₦{circle.contribution_amount.toLocaleString()}
            </span>{" "}
            from my wallet weekly for this circle.
          </label>
        </div>
        <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onConfirm}
            disabled={!agreed}
            className="bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/40"
          >
            <Check /> Join Circle & Make First Contribution
          </button>
        </div>
      </div>
    </div>
  );
};

// --- The Main Layout Component ---
const CirclesLayout = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCircles = localStorage.getItem("healthHaloCircles");
    if (savedCircles) {
      setCircles(JSON.parse(savedCircles));
    } else {
      const mockCircles: Circle[] = [
        {
          id: 1,
          name: "Adetola Family Fund",
          members_count: 5,
          balance: 75000,
          contribution_amount: 5000,
          status: "healthy",
        },
        {
          id: 2,
          name: "Ikeja Coders Guild",
          members_count: 12,
          balance: 180000,
          contribution_amount: 2500,
          status: "healthy",
        },
        {
          id: 3,
          name: "Community Savings Pot",
          members_count: 8,
          balance: 45000,
          contribution_amount: 1000,
          status: "low",
        },
        {
          id: 4,
          name: "Campus Friends Health",
          members_count: 25,
          balance: 125000,
          contribution_amount: 1000,
          status: "healthy",
        },
      ];
      setCircles(mockCircles);
      localStorage.setItem("healthHaloCircles", JSON.stringify(mockCircles));
    }
  }, []);

  const handleCreateCircle = (newCircleData: {
    name: string;
    contribution_amount: number;
  }) => {
    const newCircle: Circle = {
      id: Date.now(),
      members_count: 1,
      balance: 0,
      status: "healthy",
      ...newCircleData,
    };
    const updatedCircles = [...circles, newCircle];
    setCircles(updatedCircles);
    localStorage.setItem("healthHaloCircles", JSON.stringify(updatedCircles));
    setIsCreateModalOpen(false);
  };

  const handleOpenJoinModal = (circle: Circle) => {
    setSelectedCircle(circle);
    setIsJoinModalOpen(true);
  };

  const handleConfirmJoin = () => {
    if (!selectedCircle) return;
    console.log(`Joining circle: ${selectedCircle.name}`);
    setIsJoinModalOpen(false);
    navigate(`/circles/${selectedCircle.id}`);
  };

  return (
    <div className="animate-fadeInUp">
      <CreateCircleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCircle}
      />
      <JoinCircleModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onConfirm={handleConfirmJoin}
        circle={selectedCircle}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Halo Circles
          </h1>
          <p className="text-slate-500 mt-1">
            Your trusted groups for community health insurance.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/40 transition-all"
        >
          <Plus size={20} /> Create a New Circle
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 mb-8">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center mb-2">
          <Info className="mr-2 text-emerald-600" />
          How Halo Circles Work
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Halo Circles allow you and a trusted group to pool small,
          regular contributions into a shared health wallet. This collective
          fund can then be used by any member to pay for medical claims,
          ensuring everyone is covered without large individual premiums.
        </p>
      </div>

      <div className="space-y-4">
        {circles.length > 0 ? (
          circles.map((circle) => (
            <div
              key={circle.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-800">
                    {circle.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1.5" />{" "}
                      {circle.members_count} Members
                    </span>
                    <span
                      className={`flex items-center font-semibold ${
                        circle.status === "healthy"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" /> Pool Status:
                      Healthy
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <p className="text-xs text-slate-500">Circle Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ₦{circle.balance.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Your Contribution</p>
                  <p className="font-semibold text-slate-700">
                    ₦{circle.contribution_amount.toLocaleString()} / week
                  </p>
                </div>
                <button
                  onClick={() => handleOpenJoinModal(circle)}
                  className="bg-slate-800 text-white py-2 px-5 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
                >
                  View & Join Circle
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <h3 className="text-xl font-semibold text-slate-700">
              No Circles Yet
            </h3>
            <p className="text-slate-500 mt-2">
              Create your first circle to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CirclesLayout;
