//Packages
import { useState, useRef, useEffect } from "react";

//Hooks
import useFollowEyes from "../../hooks/useFollowEyes";

export default function EndingPet () {
	const endingEye = useRef(null);
	const endingPet = useRef(null);
	const [enableEye, setEnableEye] = useState(false);
	const [eyePos, setEyePos] = useState({
		"endingEye": [0,0],
	});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const report = entries[0];
      setEnableEye(report.isIntersecting);
    });
    if (endingPet.current)
      observer.observe(endingPet.current);
  },[])

	useFollowEyes([[endingEye, "endingEye"]], setEyePos, enableEye);
	
	return (
		<div className="flex flex-col justify-center items-center gap-8 mt-8 font-montserrat font-black text-xl text-zinc-400 select-none">
			Parece que llegaste al final...
			<div ref={endingPet} className="relative h-30 w-40 rounded-t-full bg-red-600 flex justify-center items-start">
				<div ref={endingEye} className="overflow-hidden bg-white rounded-full aspect-square w-15 absolute top-12 flex items-center justify-center">
					<div style={{"transform": `translate(${eyePos.endingEye[0]}px, ${eyePos.endingEye[1]}px)`}} className="pupil rounded-full w-8 aspect-square bg-black"></div>
				</div>
			</div>
		</div>
	)
}