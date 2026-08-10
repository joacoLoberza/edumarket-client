import { useNavigate } from "react-router-dom"

export default function MobileNavbar ({image}) {
	const navigate = useNavigate();

	return (
		<nav>
			{image?
				<button className="w-5 h-5" onClick={() => {navigate('/profile')}}><img src={image}/></button>:
				<>
					<button className="w-5 h-5" onClick={() => {navigate('/login')}}><img/></button>
					<button className="w-5 h-5" onClick={() => {navigate('/register')}}><img/></button>
				</>
			}
			<hr/>
			<button className="w-5 h-5" onClick={() => {navigate('/')}}><img/></button> 
			<button className="w-5 h-5" onClick={() => {navigate('/cart')}}><img/></button>
			<button className="w-5 h-5" onClick={() => {navigate('/lists')}}><img/></button>
			<button className="w-5 h-5" onClick={() => {navigate('/products')}}><img/></button>
		</nav>
	)
}