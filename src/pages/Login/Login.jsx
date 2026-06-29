import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import styles from './Login.module.css';
import api from "../../config/axiosApi";
import eye from '../../assets/icons/login/eye.png';
import eyeCrossedOut from '../../assets/icons/login/eyeCrossedOut.png';
import cornerLines from '../../assets/images/login/cornerLines.png'
import LoginPets from "../../components/LoginPets"

const signInGradient = "bg-[linear-gradient(transparent,var(--color-zinc-200))]";

export default function Login () {
	const [showPass, setShowPass] = useState(false);
	const [passIcon, setPassIcon] = useState(eye);
	const [typePass, setTypePass] = useState("password");
	const [error, setError] = useState(false);
	const [internalError, setInternalError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState('Estamos sobrecargados.');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const { setName, setImage } = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError(false);
		setInternalError(false);
		setMessage('');

		const data = new FormData(e.target);

		const identifier = data.get('identifier');
		const password = data.get('password');

		if (!identifier.trim() || !password.trim()) {
			setError(true);
			setMessage('Complete todo el formulario para iniciar sesión.');
			return;
		}

		try {
			setLoading(true);
			
			//Request API
			const res = await api.post('/user/login', {
				identifier,
				password,
			});
			const apiData = res.data;

			console.log(`%cAPI - ${res.status}|%c ${apiData.message}`, "color: rgb(255,255,0")

			//Save data in the context.
			setName(apiData.name);
			setImage(apiData.image);

			//Success state.
			setSuccess(true);

			//Clean form.
			e.target.reset();

			//Go back.
			navigate(location.state?.from || -1);
		} catch(error) {
			//Error handling.
			const res = error?.response;

			if (!res) {
				console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
				setInternalError(true);
				setMessage("No pudimos conectarnos al servidor.")
			} else {
				const resData = res?.data
				console.error(`%cAPI - ${res.status}|%c${resData?.message}`, "color: rgb(255, 255, 0);");
				if (resData?.type === 'Overloaded') {
					setInternalError(true);
					setMessage('Estamos sobrecargados de solicitudes.')
				} else if (resData?.origin == 'server') {
					if (resData?.type === 'ResourceNotFound') {
						setError(true);
						setMessage('Usuario o e-mail incorrectos.');
					}
					if (resData?.type === 'PermissionDenied') {
						setError(true);
						setMessage('Tu cuenta tiene que estar verificada para inciar sesión.')
					}
					if (resData?.type === 'InvalidCredentials') {
						setError(true);
						setMessage('Contraseña incorrecta.')
					}
				} else {
					setInternalError(true);
					setMessage('Algo salio mal.')
				}
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (showPass) {
			setPassIcon(eyeCrossedOut);
			setTypePass("text");
		} else {
			setPassIcon(eye);
			setTypePass("password")
		}
	}, [showPass])
	return (
		<div className="h-screen flex">
			<div className="basis-1/2 shrink-1 grow-1 overflow-hidden">
				<LoginPets state={{error, internalError, success}}/>
			</div>
			<div className="flex relative basis-1/2 shrink-1 grow-1 overflow-hidden shadow-[-20px_0px_20px_-5px_rgba(120,120,120,0.3)]">
				<form onSubmit={handleSubmit} className={`z-10 absolute w-full h-full bg-gray-100 p-20 flex flex-col gap-7 justify-center items-center @container/normal transition-translate duration-500 ease-out ${loading && "-translate-y-[120%]"}`}>
					{(error || internalError) &&
						<div 
							onClick={() => {setError(false); setInternalError(false)}}
							className={`${styles['toast-entrace']} z-10 shadow-[-8px_8px_12px_var(--color-gray-400)] max-w-1/3 flex absolute bottom-5 right-5 cursor-pointer bg-slate-200 rounded-sm`}
						>
							<div className="flex flex-col gap-[10%] items-center justify-center p-1 bg-slate-50 w-5 rounded-l-sm">
								<div className="w-2 h-2 rounded-full bg-[var(--brand-green)]"></div>
								<div className="w-2 h-2 rounded-full bg-[var(--brand-cyan)]"></div>
								<div className="w-2 h-2 rounded-full bg-[var(--brand-yellow)]"></div>
							</div>
							<p className="m-3 text-xs text-red-400 font-montserrat font-medium">
								{message}
								{internalError && <><br/> Compruebe su conección o intente más tarde.</>}
							</p>
						</div>
					}
					<h1 className="z-10 select-none font-quicksand font-semibold text-5xl text-gray-800 mb-[15%]">Bienvenido de nuevo.</h1>
					<FormInput placeholder="Usuario / e-mail" type="text" name="identifier"/>
					<div className="relative">
						<FormInput placeholder="Contraseña" type={typePass} name="password"/>
						<button type="button" className="h-1/3 absolute top-1/3 right-3" onClick={() => {setShowPass(!showPass)}}><img src={passIcon} className="h-full"/></button>
					</div>
					<div className={`absolute bottom-0 h-2/10 w-full flex justify-center`}>
						<button type="submit" disabled={loading} className="z-10 peer text-gray-400 text-2xl translate-y-1/4 font-roboto font-bold tracking-wide flex flex-col items-center gap-20 hover:translate-y-0 hover:gap-5 hover:text-stone-400 transition-all duration-1500 ease-out">
							Ingresar
							<svg width="40" height="40" fill="none" viewBox="0 0 24 24">
								<path d="M12 2v18m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
						<div className={`z-0 top-0 absolute w-full h-full ${signInGradient} transition-opacity duration-1500 ease-out opacity-0 peer-hover:opacity-100`}></div>
					</div>
					<img src={cornerLines} className="select-none absolute -top-2 right-0 w-1/2 aspect-square z-0"/>
				</form>
				<div className="absolute z-0 h-full w-full bg-zinc-200 flex justify-center items-center">
					<div className="relative w-1/10 aspect-square @container/normal">
						<div className={`${loading && styles['elSequare']} absolute bg-[conic-gradient(from_0deg,var(--brand-green)_0deg_270deg,transparent_270deg_360deg)] w-3/10 aspect-square top-0 left-0 origin-[170%_170%]`}></div>
						<div className={`${loading && styles['pacman']} absolute bg-[conic-gradient(from_315deg,var(--brand-yellow)_0deg_260deg,transparent_260deg_360deg)] rounded-full aspect-square w-3/10 top-0 right-0`}></div>
						<div className={`${loading && styles['triangParent']} absolute bottom-0 right-0 origin-[-70%_-70%]`}><div className={`${loading && styles['triangle']} border-b-[30cqw] border-b-[var(--brand-cyan)] border-x-[15cqw] border-x-transparent`}></div></div>
						<div className={`${loading && styles['arch']} absolute w-4/10 aspect-square border-[12cqw] border-[var(--color-rose-600)] border-r-transparent border-t-transparent rounded-full bottom-0 left-0`}></div> 
					</div>
				</div>
			</div>
		</div>
	)
}

function FormInput({placeholder, type, name}) {
	return <input
		type={type}
		name={name}
		placeholder={placeholder}
		className="w-[60cqw] h-[9cqw] bg-slate-200 rounded-full 2xl py-1 px-4 placeholder-slate-400 shadow-[4px_5px_10px_-5px_rgba(120,120,120,0.3)_inset] focus:outline-none text-zinc-500 "/>
}