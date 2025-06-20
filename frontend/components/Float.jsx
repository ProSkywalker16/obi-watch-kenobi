import { Bot, MessageSquareMore } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import React from 'react'

const Float = () => {
  return (
    <div className="fixed bottom-10 right-4 z-50">
      <NavLink to='/chatbot'>
      <button className="bg-[rgb(70,38,157)] hover:bg-[#9d94ff] text-white p-4 rounded-full shadow-lg transition duration-300">
        <MessageSquareMore className="w-6 h-6" />
      </button>
      </NavLink>
    </div>
  )
}

export default Float
