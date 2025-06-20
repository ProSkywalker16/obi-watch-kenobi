import React, { useState } from 'react';
import { Menu, Grid, Database, BookOpen, Settings, Home, BotIcon } from 'lucide-react';

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const menuItems = [
		{ name: 'Home', icon: <Home />, link: '/' },
		{ name: 'Dashboard', icon: <Grid />, link: '/dashboard' },
		{ name: 'Chatbot', icon: <BotIcon />, link: '/chatbot' },
		{ name: 'Settings', icon: <Settings />, link: '/settings' },
	];

	return (
		<div
			className={`fixed top-6 left-6 h-[90vh] bg-[#0c0b20] text-white transition-all duration-300 
      ${isOpen ? 'w-60 p-2' : 'w-20 p-2'} 
      rounded-2xl shadow-2xl shadow-black flex flex-col items-center`}
		>


			<button
				className="text-white mb-6 w-full flex justify-center items-center text-2xl"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Menu />
			</button>
			{/* Logo (only when expanded) */}
			{isOpen && (
				<img
					src="/logo.jpg"
					alt="Logo"
					className={`mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
				/>
			)}
			<div className="mt-16 flex flex-col gap-4 w-full">
				{menuItems.map((item, index) => (
					<a
						href={item.link}
						key={index}
						className={`flex items-center w-full transition-all duration-300 text-lg font-semibold 
              ${isOpen ? 'justify-start gap-4 pl-2' : 'justify-center'}`}
					>
						<span className="w-10 h-10 flex items-center justify-center text-2xl">
							{item.icon}
						</span>
						<span
							className={`
                transition-all duration-300 whitespace-nowrap overflow-hidden
                ${isOpen ? 'max-w-[200px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}
              `}
						>
							{item.name}
						</span>
					</a>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
