import React from 'react'
import CARD_2 from "../../assets/images/card2.jpeg"
import { LuTrendingDown } from "react-icons/lu"

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left Section */}
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>SpendWise</h2>
        {children}
      </div>

      {/* Right Section */}
      <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
        {/* Purple div behind the StatsInfoCard */}
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5 z-10' />

        {/* Other shapes */}
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10 z-10' />
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5 z-10' />

        {/* StatsInfoCard in front */}
        <div className='grid grid-cols-1 z-30 relative'>
          <StatsInfoCard
            icon={<LuTrendingDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-primary"
          />
        </div>

        {/* Background image */}
        <img
          src={CARD_2}
          className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15 z-10'
          alt=""
        />
      </div>
    </div>
  )
}

export default AuthLayout

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-200/50">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
        <span className='text-[20px]'>${value}</span>
      </div>
    </div>
  )
}
