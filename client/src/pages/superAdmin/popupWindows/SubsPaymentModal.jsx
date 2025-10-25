import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const SubsPaymentModal = ({ isOpen, onClose, orgData }) => {
  const modalRef = useRef();
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  console.log(orgData);

  const [dataPlan, setDataPlan] = useState([]);
  const [planCycle, setPlanCycle] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllPlans = async () => {
    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllPlanDetails`
      );
      setDataPlan(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPlanCycleData = async () => {
    console.log("plan data called");

    try {
      const { data } = await axios.get(
        `https://crm-generalize.dentalguru.software/api/getAllPlanDetailsByPlanId/${selectedPlan?.plan_id}`
      );
      setPlanCycle(data);
      if (data.length > 0) setSelectedCycle(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlanCycleData();
  }, [selectedPlan]);

  console.log(planCycle);
  console.log(selectedPlan);

  useEffect(() => {
    getAllPlans();
  }, []);

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "save10" && selectedCycle) {
      setDiscountAmount(Math.round(selectedCycle.price * 0.1));
    } else {
      setDiscountAmount(0);
    }
  };

  const basePayable =
    (selectedCycle?.price || 0) -
    (selectedCycle?.discount || 0) -
    discountAmount;

  const gst = basePayable * 0.18;
  const grandTotal = basePayable + gst;

  const updateOrgSubs = async (subId) => {
    try {
      const res = await axios.put(
        `https://crm-generalize.dentalguru.software/api/updateCompanySubscription/${user?.staff_org_id}/${subId}`
      );
      toast.success("subscription updated successfully");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentGateway = async () => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load Razorpay SDK. Check your internet.");
        return;
      }

      const { data } = await axios.post(
        "https://crm-generalize.dentalguru.software/api/createRazorTransaction",
        { amount: grandTotal }
      );

      const options = {
        key: "rzp_live_zd0kTsmlrWoRXp",
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: orgData.company_name || "Demo Company",
        description: `Plan Purchase - ${selectedPlan?.plan_name} (${selectedCycle?.cycle_name})`,
        image:
          "https://res.cloudinary.com/antrix/image/upload/v1757663128/CRM/CRMGuruLogo_wwarjf.png",

        handler: async function (response) {
          const verifyRes = await axios.post(
            "https://crm-generalize.dentalguru.software/api/verifyRazorPayment",
            {
              ...response,
              trans_email: orgData?.email_id,
              trans_amount: grandTotal,
              sub_pricing_id: selectedCycle?.pricing_id,
              duration_days: selectedCycle?.duration_days,
            }
          );

          if (verifyRes.data.success) {
            toast.success("✅ Payment verified & subscription activated!");
            updateOrgSubs(verifyRes.data.subscription_id);
          } else {
            toast.error("❌ Payment verification failed");
          }
        },

        prefill: {
          name: orgData.company_name,
          email: orgData.email_id,
          contact: orgData.mobile_no,
        },
        notes: {
          plan: selectedPlan?.plan_name,
          cycle: selectedCycle?.cycle_name,
        },
        theme: {
          color: "#0abdc6",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      toast.error("Error initiating payment");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-2 max-h-[95%] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <div className="flex justify-end">
              <button onClick={() => onClose()}>X</button>
            </div>
            <h2 className="text-xl font-semibold mb-6">
              Renew Subscription Plan
            </h2>
            <div className="space-y-2 mb-2">
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">
                  Select Plan
                </label>
                <select
                  value={selectedPlan?.plan_id || ""}
                  onChange={(e) =>
                    setSelectedPlan(
                      dataPlan.find(
                        (c) => c.plan_id === parseInt(e.target.value)
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-700 focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">--select--</option>
                  {dataPlan?.slice(1).map((cycle) => {
                    return (
                      <option key={cycle.plan_id} value={cycle.plan_id}>
                        <span className="capitalize">
                          {cycle.plan_name?.toUpperCase()}
                        </span>
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-1 text-sm font-medium">
                  Select Duration
                </label>
                <select
                  value={selectedCycle?.pricing_id || ""}
                  onChange={(e) =>
                    setSelectedCycle(
                      planCycle.find(
                        (c) => c.pricing_id === parseInt(e.target.value)
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-700 focus:ring-2 focus:ring-cyan-400"
                >
                  {planCycle.map((cycle) => {
                    const label = cycle.cycle_name?.includes("_")
                      ? cycle.cycle_name.replace("_", " ")
                      : cycle.cycle_name;

                    const formattedLabel =
                      label.charAt(0).toUpperCase() + label.slice(1);

                    const mainPrice = Number(cycle.price).toFixed(2);
                    const monthlyPrice = (
                      cycle.price / cycle.duration_in_months
                    ).toFixed(2);

                    return (
                      <option key={cycle.pricing_id} value={cycle.pricing_id}>
                        {formattedLabel} — ₹{mainPrice}{" "}
                        <span className="text-green-400">
                          ({`₹${monthlyPrice}/month`})
                        </span>
                      </option>
                    );
                  })}
                </select>
              </div>
              {selectedCycle && (
                <div className="space-y-3 mb-6 bg-gray-200 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between text-gray-700">
                    <span>Base Price</span>
                    <span>₹{Number(selectedCycle.price).toFixed(2)}</span>
                  </div>

                  {selectedCycle.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>
                        - ₹{Number(selectedCycle.discount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon</span>
                      <span>- ₹{Number(discountAmount).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold border-t border-gray-600 pt-3">
                    <span>Subtotal</span>
                    <span>₹{Number(basePayable).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-yellow-600">
                    <span>+ GST (18%)</span>
                    <span>₹{Number(gst).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xl font-bold border-t border-gray-600 pt-3 text-cyan-600">
                    <span>Grand Total</span>
                    <span>₹{Number(grandTotal).toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handlePaymentGateway}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 
    hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg 
    shadow-lg transition transform hover:scale-[1.02] 
    disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubsPaymentModal;
