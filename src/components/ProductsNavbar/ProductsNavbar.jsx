import House from '../../assets/icons/general/thickHouse.svg?react';
import Cart from '../../assets/icons/general/thickCart.svg?react';
import Backpack from '../../assets/icons/general/thickBackpack.svg?react';
import Utils from '../../assets/icons/general/thickPencil.svg?react';
import User from '../../assets/icons/general/thickUser.svg?react';

export default function ProductsNavbar() {
	return (
		<nav className="flex self-center items-center gap-1 h-6">
			
			<button>
				<House className='w-6 h-6 text-white/60'/>
			</button>
			<div className='w-[1px] shrink-0 grow-0 h-full rounded-full bg-white/40'></div>
			<button>
				<Cart className='w-7 h-7 text-white/60'/>
			</button>
			<div className='w-[1px] shrink-0 grow-0 h-full rounded-full bg-white/40'></div>
			<button>
				<Backpack className='w-6 h-6 text-white/60'/>
			</button>
			<div className='w-[1px] shrink-0 grow-0 h-full rounded-full bg-white/40'></div>
			<button>
				<Utils className='w-5 h-5 text-white/60 rotate-45'/>
			</button>
			<div className='w-[1px] shrink-0 grow-0 h-full rounded-full bg-white/40'></div>
			<button onClick={() => {navigate('/profile')}}>
				<User className="w-6 h-6 text-white/60"/>
			</button>
		</nav>
	)
}