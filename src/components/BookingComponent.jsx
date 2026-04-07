import React, { useState } from 'react';
import './BookingComponent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const BookingComponent = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const loadRazorPay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const paynow = async () => {
        setLoading(true);
        const res = await loadRazorPay();
        
        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet connection.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order in Backend
            const response = await axios.post("http://localhost:3000/payment/create-order", {
                amount: 500 // Amount in INR
            });

            if (!response.data || !response.data.order) {
                throw new Error("Failed to create order on server.");
            }

            const { order } = response.data;

            // 2. Configure Razorpay Options with order_id
            const options = {
                key: "", // Your Razorpay Key ID
                amount: order.amount, // Amount in paise (matched with backend order)
                currency: "INR",
                name: "CarScout",
                description: "Premium Car Rental Payment",
                image: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
                order_id: order.id, // THE CRITICAL PART: order_id from backend
                handler: async function (response) {
                    //razorpay_order_id,
                    //razorpay_payment_id,
                    //razorpay_signature
                    alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
                    console.log("Payment details:", response);
                    response.amount = order.amount

                    const verifyPaymentres = await axios.post("http://localhost:3000/payment/verify-payment",response)
                    console.log(verifyPaymentres)
                    if(verifyPaymentres.status==200){
                        //navigate("order,history,booking..")
                        navigate("/order")
                    }
                    else if(verifyPaymentres == 400){
                        //navigate("order,histoort,booking...")
                        navigate("/order")
                    }

                    // TODO: Call your backend to verify the signature
                    // verifyPayment({
                    //     razorpay_order_id: response.razorpay_order_id,
                    //     razorpay_payment_id: response.razorpay_payment_id,
                    //     razorpay_signature: response.razorpay_signature
                    // });
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3b82f6",
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert(error.response?.data?.message || error.message || "Something went wrong during payment initiation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-container">
            <div className="booking-card">
                <div className="booking-header">
                    <h1>CAR BOOKING</h1>
                </div>

                <div className="booking-details">
                    <div className="detail-row">
                        <span className="label">Vehicle</span>
                        <span className="value">Tesla Model S</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Duration</span>
                        <span className="value">3 Days</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Insurance</span>
                        <span className="value">Professional Plus</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Platform Fee</span>
                        <span className="value">₹ 500.00</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Total Amount</span>
                        <span className="value total-value">₹ 500.00</span>
                    </div>
                </div>

                <button 
                    className="pay-button" 
                    onClick={paynow}
                    disabled={loading}
                >
                    {loading ? "Preparing Payment..." : "PAY NOW"}
                </button>

                <div className="security-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Secure 256-bit SSL encrypted payment
                </div>
            </div>
        </div>
    );
};
