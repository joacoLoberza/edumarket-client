import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import UserContext from "../../contexts/UserContext";
import useMediaQuery from "../../hooks/useMediaQuery";
import MobileNavbar from "../../components/MainNavbar/MobileNavbar";
import PCNavbar from "../../components/MainNavbar/PCNavbar";

export default function MainLayout () {
	const isMovile = useMediaQuery("(max-width: 768px)")
	const { image, name } = useContext(UserContext);

	return (
		<>
			{isMovile?
				<MobileNavbar image={image}/>:
				<PCNavbar image={image} name={name}/>
			}
			<main>
				<Outlet/>
			</main>
		</>
	)
}