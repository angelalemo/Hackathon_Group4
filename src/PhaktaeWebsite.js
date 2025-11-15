import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function PhaktaeWebsite() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const vegetables = [
    { name: 'คะน้า', image: '🥬' },
    { name: 'ผักกาดขาว', image: '🥬' },
    { name: 'หัวหอม', image: '🧅' },
    { name: 'มะเขือเทศ', image: '🍅' },
    { name: 'พริกชี้ฟ้า', image: '🌶️' },
    { name: 'แตงกวา', image: '🥒' },
    { name: 'ต้นหอม', image: '🌿' },
    { name: 'หัวไชเท้า', image: '🥕' },
    { name: 'ตะไคร้', image: '🌾' },
    { name: 'คะน้า', image: '🥬' },
    { name: 'ผักบุ้ง', image: '🥬' },
    { name: 'หัวไชเท้า', image: '🥕' },
    { name: 'ผักกาดหอม', image: '🥬' }
  ];

  const slides = Array(20).fill(0);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold text-green-600">Phaktae</h1>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <nav className="flex items-center gap-4">
                <button className="px-4 py-2 text-gray-700 hover:text-green-600">หมวดหมู่</button>
                <button className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-green-600">
                  ชนิดผัก <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-green-600">
                  จังหวัด <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-green-600">
                  อำเภอ <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:border-green-600">
                  ตำบล <ChevronDown className="w-4 h-4" />
                </button>
              </nav>
              <div className="flex items-center gap-4 ml-6">
                <button className="text-gray-700 hover:text-green-600">สมัครสมาชิก</button>
                <button className="text-gray-700 hover:text-green-600">เข้าสู่ระบบ</button>
                <button className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">TH</button>
                <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 rounded">EN</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-b from-blue-100 to-green-50 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop" 
            alt="Tea field with farmers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide 
                  ? 'w-8 bg-green-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="border-4 border-green-600 rounded-3xl p-8 relative">
          <h2 className="text-3xl font-bold text-green-700 mb-8">ผักทั้งหมด</h2>
          <div className="absolute top-0 left-8 w-16 h-16 opacity-10">
            <div className="text-6xl">🌿</div>
          </div>
          <div className="absolute bottom-0 right-8 w-16 h-16 opacity-10">
            <div className="text-6xl">🌿</div>
          </div>
          <div className="grid grid-cols-7 gap-6">
            {vegetables.map((veg, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full border-4 border-green-600 bg-white flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-md">
                  {veg.image}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                  {veg.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}