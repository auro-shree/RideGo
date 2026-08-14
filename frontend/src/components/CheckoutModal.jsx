import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Smartphone, Building, Wallet, Calendar, MapPin, User, FileText, Check } from 'lucide-react';
import { createBooking } from '../services/api';

export default function CheckoutModal({ vehicle, bookingDates, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [riderInfo, setRiderInfo] = useState({
    name: 'Rohan Kumar',
    phone: '+91 98765 43210',
    email: 'rohan.kumar@email.com',
    licenseNumber: 'KA01 20201234567',
    agreeTerms: true
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Calculate Days & Amount
  const rentalDays = 2; // Default 2 days for preview calculation
  const pricePerDay = vehicle.pricePerDay || 799;
  const rentTotal = pricePerDay * rentalDays;
  const securityDeposit = vehicle.securityDeposit || 2000;
  const taxesAndFees = 288;
  const discount = 200;
  const grandTotal = rentTotal + securityDeposit + taxesAndFees - discount;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRiderInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId: vehicle.id,
        pickupLocation: bookingDates?.pickupLocation || 'Koramangala, Bengaluru',
        returnLocation: bookingDates?.returnLocation || 'Koramangala, Bengaluru',
        pickupTime: bookingDates?.pickupTime || '2025-05-20T10:00',
        returnTime: bookingDates?.returnTime || '2025-05-22T10:00',
        totalAmount: grandTotal,
        paymentMethod: paymentMethod,
        riderName: riderInfo.name,
        riderPhone: riderInfo.phone,
        riderEmail: riderInfo.email,
        licenseNumber: riderInfo.licenseNumber
      };

      const result = await createBooking(payload);
      setConfirmedBooking(result);
      setStep(4);
    } catch (err) {
      console.error('Booking failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px', padding: 0 }}>
        {/* Header Bar */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAFAFA'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#0F172A' }}>RideGo Checkout</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Book your ride in 4 easy steps</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Multi-step Progress Bar */}
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { num: 1, label: 'Select Bike' },
              { num: 2, label: 'Booking Details' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Confirmation' }
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', zIndex: 2 }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step >= s.num ? '#FFB800' : '#E2E8F0',
                  color: step >= s.num ? '#000' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: step === s.num ? 700 : 500,
                  color: step === s.num ? '#0F172A' : '#64748B'
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body Steps */}
        <div style={{ padding: '1.25rem' }}>
          {step === 1 && (
            <div>
              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                {/* Bike Summary */}
                <div className="card" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.model} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
                  />
                  <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>{vehicle.brand} {vehicle.model}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.5rem 0' }}>
                    {vehicle.engineCC > 0 ? `${vehicle.engineCC}cc` : 'EV'} • {vehicle.fuelType} • {vehicle.transmission}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    ₹{pricePerDay} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748B' }}>/day</span>
                  </div>
                </div>

                {/* Rental Details & Breakup */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '1rem' }}>Rental Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Pickup Location:</span>
                      <strong style={{ color: '#0F172A' }}>Koramangala, Bengaluru</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Pickup Date & Time:</span>
                      <strong style={{ color: '#0F172A' }}>20 May 2025, 10:00 AM</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Return Date & Time:</span>
                      <strong style={{ color: '#0F172A' }}>22 May 2025, 10:00 AM</strong>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>₹{pricePerDay} × 2 days</span>
                      <span>₹{rentTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Refundable Security Deposit</span>
                      <span>₹{securityDeposit}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Taxes & Convenience Fees</span>
                      <span>₹{taxesAndFees}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                      <span>Promo Discount (WELCOME100)</span>
                      <span>-₹{discount}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                      <span>Total Amount</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button onClick={() => setStep(2)} className="btn btn-primary">Continue to Rider Details</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1.25rem' }}>Rider & License Information</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={riderInfo.name} 
                    onChange={handleInputChange} 
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={riderInfo.phone} 
                    onChange={handleInputChange} 
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={riderInfo.email} 
                    onChange={handleInputChange} 
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Driving License Number</label>
                  <input 
                    type="text" 
                    name="licenseNumber" 
                    value={riderInfo.licenseNumber} 
                    onChange={handleInputChange} 
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ margin: '1.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    name="agreeTerms" 
                    checked={riderInfo.agreeTerms} 
                    onChange={handleInputChange}
                    style={{ accentColor: '#FFB800', width: '16px', height: '16px' }}
                  />
                  I confirm I hold a valid original driving license and agree to RideGo Terms & Safety Policy.
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!riderInfo.agreeTerms || !riderInfo.name}
                  className="btn btn-primary"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1.25rem' }}>Select Payment Method</h4>
              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                {[
                  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone, desc: 'Pay instantly via any UPI app' },
                  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay accepted' },
                  { id: 'netbanking', name: 'Net Banking', icon: Building, desc: 'All major Indian banks supported' },
                  { id: 'wallet', name: 'Wallets', icon: Wallet, desc: 'Paytm, PhonePe, Mobikwik' }
                ].map(m => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <div 
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        border: `2px solid ${isSelected ? '#FFB800' : '#E2E8F0'}`,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(255, 184, 0, 0.05)' : '#FFFFFF',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <Icon size={20} color={isSelected ? '#D97706' : '#64748B'} />
                        <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{m.name}</strong>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '2rem' }}>{m.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="card" style={{ padding: '1rem', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <ShieldCheck size={28} color="#059669" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <strong>256-Bit SSL Encrypted Secure Payment</strong>
                  <div>Your financial information is encrypted and processed via secure PCI-DSS gateway.</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
                <button 
                  onClick={handlePayment} 
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                >
                  {isSubmitting ? 'Processing Payment...' : `Pay ₹${grandTotal}`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle size={40} />
              </div>

              <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
              <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
                Booking Ref: <strong style={{ color: '#0F172A' }}>{confirmedBooking?.bookingId || 'BK8923'}</strong>
              </p>

              <div className="card" style={{ padding: '1.5rem', textAlign: 'left', backgroundColor: '#F8FAFC', marginBottom: '1.5rem' }}>
                <div className="grid-2" style={{ fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Vehicle:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{vehicle.brand} {vehicle.model}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Rider Name:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{riderInfo.name}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Pickup Point:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>Koramangala, Bengaluru</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Total Paid:</span>
                    <div style={{ fontWeight: 700, color: '#059669' }}>₹{grandTotal}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={onSuccess} className="btn btn-primary">
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
