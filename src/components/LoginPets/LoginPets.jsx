//Packages
import { useEffect, useState, useRef } from "react";

//Files
import styles from './LoginPets.module.css';

//Custom Hooks
import useFollowEyes from "../../hooks/useFollowEyes.jsx";

function LoginPets({ state }) {
	const [ eyePos, setEyePos ] = useState({ pink: [0,0], blue: [0,0], red: [0,0], green: [0,0]});
	const [mount, setMount] = useState(true);
	const [internalError, setInternalError] = useState({
		pencil: state.internalError,
		crayon: state.internalError,
		rule: state.internalError,
		edum: state.internalError,
	})
	const pinkEye = useRef(null);
	const blueEye = useRef(null);
	const redEye = useRef(null);
	const greenEye = useRef(null);

	useEffect(() => { setInternalError({
		pencil: state.internalError,
		crayon: state.internalError,
		rule: state.internalError,
		edum: state.internalError,
	}) }, [state.internalError]);

	useFollowEyes([[pinkEye, "pink"], [blueEye, "blue"], [redEye, "red"], [greenEye, "green"]], setEyePos);
	
	return (
		<div className="@container/normal w-full h-screen relative">
			{/*Pencil*/}
			<div
				onAnimationEnd={() => { setInternalError(prev => ({ ...prev, pencil: false})) }}
				className={`
					${mount && styles['pencil-pet-entrace']}
					${state.error && styles['pencil-shake']}
					${state.internalError && styles['pencil-inter-err']}
					w-5/17 h-2/3 bg-pink-500 absolute top-full left-1/2 -translate-y-full origin-bottom
				`}
			>
				<div className="w-full h-13/14 bg-amber-500 absolute top-1/14">
					<div className="h-1/20 w-full bg-slate-400 flex flex-col gap-1">
						<div className="w-full h-[0.5cqh] bg-slate-500"></div>
						<div className="w-full h-[0.75cqh] bg-slate-500"></div>
					</div>
					<div className="flex h-[95%] justify-around">
						<div className="h-full w-[0.75cqw] bg-orange-600"></div>
						<div className="h-full w-[0.75cqw] bg-orange-600"></div>
						<div className="h-full w-[0.75cqw] bg-orange-600"></div>
					</div>
				</div>
				<div className="border-b-[15cqw] border-b-pink-500 border-r-[16cqw] border-x-transparent bg-transparent -translate-y-full">
					<div 
						ref={pinkEye} className={`overflow-hidden relative bg-white h-[7cqw] w-[7cqw] translate-y-[160%] translate-x-[60%] ${!internalError.pencil && "rounded-full"} flex justify-center items-center`}>
						<div style={{
							transform: `translate(${eyePos.pink[0]}px, ${eyePos.pink[1]}px)`
						}} className={`${state.internalError && styles['pencil-inter-err-eye']} pupil bg-black h-[4cqw] w-[4cqw] rounded-full`}></div>
					</div>
					<div className={`${(state.error || state.internalError ) && styles['pencil-mou']} bg-black h-[1cqw] w-[25cqw] absolute top-[350%] left-[6cqw] origin-right`}></div>
				</div>
			</div>

			{/*Purple Thing*/}
			<div className={`${styles['purple-pet-entrace']} w-1/6 h-3/5 bg-fuchsia-800 absolute top-full left-1/20 -translate-y-full`}>
				<div className="border-b-[10cqw] border-b-fuchsia-800 border-l-[calc((16.66cqw/4)*3)] border-r-[calc((16.66cqw/4))] border-x-transparent bg-transparent -translate-y-full"></div>
				<div className="h-full w-2/4 absolute top-full left-4/7 -translate-9/10 bg-fuchsia-700 rounded-full"></div>
			</div>

			{/*Edumarket*/}
			<div
				onAnimationEnd={() => {setInternalError(prev => ({...prev, edum: false}))}}
				className={`
					${mount && styles['marker-pet-entrace']}
					${state.internalError && styles['edum-inter-err']}
					w-1/5 h-3/8 bg-red-600 absolute top-full left-1/6 -translate-y-full`
				}
			>
				<div className=" w-full aspect-square bg-red-600 rounded-full -translate-y-1/2">
					<div ref={redEye} className={`overflow-hidden relative bg-white h-[7cqw] w-[7cqw] top-1/4 left-1/2 -translate-x-1/2 ${!internalError.edum && "rounded-full"} flex justify-center items-center`}>
						<div
 							style={!internalError.edum ?
								{
									transform: `translate(${eyePos.red[0]}px, ${eyePos.red[1]}px)`
								} : {}
							}
							className={`
								${internalError.edum && styles['edum-inter-err-eye']}
								pupil bg-black h-[4cqw] w-[4cqw] rounded-full
							`}
						></div>
					</div>
					<div className="bg-black h-[1cqw] w-[15cqw] absolute top-4/6 -left-[2cqw]"></div>
				</div>
				<div className="h-6/7 w-full py-5 overflow-hidden absolute top-1/7 left-0"><p className="w-0 h-0 absolute left-[calc(50%+1rem)] rotate-90 text-gray-200 text-4xl text-red-400 font-black font-roboto tracking-tighter whitespace-nowrap select-none">Edumarket</p></div>
			</div>

			{/*Crayon*/}
			<div 
				onAnimationEnd={() => {
					if (mount) 
						setMount(false);
					setInternalError(prev => ({...prev, crayon: false}));
				}} 
				className={`
					${mount && styles['crayon-pet-entrace']}
					${state.internalError && styles['crayon-inter-err']}
					w-2/7 h-5/9 bg-blue-500 absolute top-full left-2/5 -translate-y-3/4 origin-bottom`}
			>
				<div className="w-9/10 border-b-[18cqw] border-b-indigo-500 border-x-[10cqw] border-x-transparent bg-transparent absolute top-0 left-1/2 -translate-y-full -translate-x-1/2">
					<div ref={blueEye} className="overflow-hidden relative bg-white h-[7cqw] w-[7cqw] translate-y-[150%] rounded-full flex justify-center items-center">
						{internalError.crayon &&
							<p className="font-bold font-montserrat text-4xl">X</p>
						}
						<div
							style={{
								transform: `translate(${eyePos.blue[0]}px, ${eyePos.blue[1]}px)`
							}}
							className={`${internalError.crayon && "hidden absolute"} pupil bg-black h-[5cqw] w-[5cqw] rounded-full`}
						></div>
					</div>
					<div className="bg-black h-[1cqw] w-[18cqw] absolute top-[300%] -left-2/5"></div>
				</div>
				<div className="w-3/5 h-2/3 bg-blue-800 absolute top-full left-1/2 -translate-y-full -translate-x-1/2">
					<div className="w-full aspect-[3/2] rounded-full -translate-y-1/2 bg-blue-800"></div>
				</div>
			</div>

			{/*Rule*/}
			<div
				onAnimationEnd={() => {setInternalError(prev => ({...prev, rule: false}))}}
				className={`
					${mount && styles["rule-pet-entrace"]}
					${state.internalError && styles['rule-inter-err']}
					w-3/14 h-3/4 bg-lime-500 absolute top-full left-3/4 -translate-y-1/4`
				}
			>
				<div className="w-[200.5%] aspect-square bg-[conic-gradient(transparent_0deg_270deg,var(--color-lime-500)_270deg_360deg)] rounded-full -translate-y-1/2">
					<div 
						ref={greenEye} 
						className={`
							${state.error && styles['rule-eye']}
							overflow-hidden relative bg-white ${internalError.rule? "h-[3cqw] translate-y-[360%]" : "h-[6cqw] translate-y-[180%]"} w-[6cqw] translate-x-[70%] rounded-full flex justify-center items-center
						`}
					>
						<div
							style={{
								transform: `translate(${eyePos.green[0]}px, ${eyePos.green[1]}px)`
							}}
							className={`pupil bg-black ${internalError.rule? "h-[3cqw] translate-y-2" : "h-[4cqw] rounded-full"} w-[4cqw]`}></div>
					</div>
					<div className={`
						${state.internalError && styles['rule-mou-inter-err']}
						${state.error && styles['rule-mou']}
						bg-black h-[1cqw] w-[15cqw] absolute top-3/5 -left-1/20 ${!state.error && "origin-right"}
					`}></div>
				</div>
				<div className="h-[calc(100%+19cqw)] w-full py-5 overflow-hidden absolute -top-[19cqw] left-0"><p className="w-0 h-0 absolute left-19/20 rotate-90 text-gray-200 text-xl whitespace-nowrap select-none">0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20</p></div>
			</div>
		</div>
	)
}

export default LoginPets;