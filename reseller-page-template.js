import React from 'react';
import { ArrowLeft, Wallet, History, Send, Gift } from 'lucide-react';

const ResellerPage = () => {
  return (
    <div className="min-h-screen bg-[#1a237e] text-white">
      {/* Header Section */}
      <div className="p-4 flex items-center">
        <ArrowLeft className="h-6 w-6" />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">vala jone</h1>
          <p className="text-sm">+383 45 400 800</p>
        </div>
        <Gift className="h-6 w-6 ml-auto" />
      </div>

      {/* Tabs - Using similar style as original app */}
      <div className="flex justify-center space-x-8 mt-4">
        <div className="pb-2 border-b-2 border-white">
          <span className="text-lg">Reseller Mode</span>
        </div>
      </div>

      {/* Reseller Balance Display - Similar to data usage circle */}
      <div className="flex justify-center mt-8">
        <div className="relative w-48 h-48 rounded-full border-4 border-pink-500 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm">Reseller Balance</div>
            <div className="text-3xl font-bold">350.00€</div>
            <div className="text-xs mt-1">RESELLER_ACCOUNT</div>
          </div>
        </div>
      </div>

      {/* Active Status - Similar to package display */}
      <div className="text-center mt-6">
        <p className="text-lg">Your Reseller Status: Active</p>
      </div>

      {/* Main Actions */}
      <div className="p-4 mt-4">
        <div className="bg-white rounded-lg p-4 text-[#1a237e]">
          <div className="grid gap-4">
            {/* R-Topup Options */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-3">
                <Wallet className="h-5 w-5 mr-2" />
                <span className="font-semibold">R-Topup Options</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className="bg-[#1a237e] text-white py-2 px-3 rounded text-sm"
                  >
                    {amount}€
                  </button>
                ))}
              </div>
            </div>

            {/* Sell Options */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-3">
                <Send className="h-5 w-5 mr-2" />
                <span className="font-semibold">Sell Services</span>
              </div>
              <div className="grid gap-2">
                <button className="bg-[#1a237e] text-white py-2 px-4 rounded text-left flex items-center">
                  <span>Local packages</span>
                </button>
                <button className="bg-[#1a237e] text-white py-2 px-4 rounded text-left flex items-center">
                  <span>Internet Packages Additional</span>
                </button>
                <button className="bg-[#1a237e] text-white py-2 px-4 rounded text-left flex items-center">
                  <span>Regional Packages</span>
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <div className="flex items-center mb-3">
                <History className="h-5 w-5 mr-2" />
                <span className="font-semibold">Transaction History</span>
              </div>
              <button className="w-full bg-[#1a237e] text-white py-2 px-4 rounded">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Matching existing app */}
      <div className="fixed bottom-0 left-0 right-0 bg-white text-[#1a237e] py-2">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="h-6 w-6 mx-auto">🏠</div>
            <span className="text-xs">Home</span>
          </div>
          <div className="text-center">
            <div className="h-6 w-6 mx-auto">📦</div>
            <span className="text-xs">Packages</span>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-white rounded-full border-4 border-pink-500 flex items-center justify-center -mt-6">
              <img src="/api/placeholder/48/48" alt="Vala Logo" className="h-8 w-8" />
            </div>
          </div>
          <div className="text-center">
            <div className="h-6 w-6 mx-auto">👤</div>
            <span className="text-xs">Account</span>
          </div>
          <div className="text-center">
            <div className="h-6 w-6 mx-auto">☰</div>
            <span className="text-xs">Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerPage;
