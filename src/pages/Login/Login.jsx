//Packages
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Files
import UserContext from "../../contexts/UserContext";
import api from "../../config/axiosApi";

//Images & Graphic Resources
import CrossedOutEye from '../../assets/icons/general/crossedOutEye.svg?react';
import OpenEye from '../../assets/icons/general/openEye.svg?react';

//Components
import LoginPets from "../../components/LoginPets";
import FormInput from "../../components/FormInput/FormInput";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import LoadSpinner from "../../components/LoadSpinner";

const signInGradient = "bg-[linear-gradient(transparent,var(--color-zinc-200))]";

export default function Login () {
	const [showPass, setShowPass] = useState(false);
	const [typePass, setTypePass] = useState("password");
	const [error, setError] = useState(false);
	const [internalError, setInternalError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [message, setMessage] = useState('Estamos sobrecargados.');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
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
			setName(apiData.user.name);
			setImage(apiData.user.image);

			//Success state.
			setSuccess(true);

			//Clean form.
			e.target.reset();

			//Go back.
			navigate(-1);
		} catch(error) {
			//Error handling.
			const res = error?.response;

			if (!res) {
				console.error("%cERROR|%c Couldn't send the request.", "color: rgb(255, 60, 0)")
				setInternalError(true);
				setMessage("No pudimos conectarnos al servidor.")
			} else {
				const resData = res?.data
				console.error(`%cAPI - ${res.status}|%c ${resData?.message}`, "color: rgb(255, 255, 0);");
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
			setTypePass("text");
		} else {
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
						<ErrorToast onClick={() => {setError(false); setInternalError(false)}} message={<> {message} {internalError && <><br/> Compruebe su conección o intente más tarde.</>}</>}/>
					}
					<h1 className="z-10 select-none font-quicksand font-semibold text-5xl text-gray-800 mb-[15%]">Bienvenido de nuevo.</h1>
					<FormInput placeholder="Usuario / e-mail" type="text" name="identifier" classes={"w-[60cqw] h-[9cqw]"}/>
					<div className="relative">
						<FormInput placeholder="Contraseña" type={typePass} name="password" classes={"w-[60cqw] h-[9cqw]"}/>
						<button type="button" className="h-1/3 absolute top-1/3 right-3" onClick={() => {setShowPass(!showPass)}}>{showPass?  <CrossedOutEye className="text-gray-600 h-full w-full"/> : <OpenEye className="text-gray-600 h-full w-full"/>}</button>
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
				</form>
				<div className="absolute z-0 h-full w-full bg-zinc-200 flex justify-center items-center">
					<LoadSpinner loading={loading}/>
				</div>
			</div>
		</div>
	)
}

/**
 * TAREAS:
 * 1. Cambiar el lenguaje formal de los errores a uno informal.
 */