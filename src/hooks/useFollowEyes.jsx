//Packages
import { useEffect } from 'react';

export default function useFollowEyes (items, callback, enabled) {
	let deps = undefined;
	if (enabled === undefined) {
		enabled = true;
		deps = [];
	}

	useEffect(() => {
		const calcEyePos = (e) => {
			let eyesPos = {};

			for (let eyeData of items) {
				const [eyeRef, identifier] = eyeData;
				
				if (!eyeRef.current) continue;

				const eyeDim = eyeRef.current.getBoundingClientRect();
				const pupilDim = eyeRef.current.querySelector('.pupil').getBoundingClientRect();

				const eyeScaleX = (eyeDim.width - pupilDim.width) / 2;
				const eyeScaleY = (eyeDim.height - pupilDim.height) / 2;

				const distanceX = e.clientX - (eyeDim.left + eyeDim.width / 2);
				const distanceY = e.clientY - (eyeDim.top + eyeDim.height / 2);

				const quadrantWidth = distanceX >= 0? window.innerWidth - (eyeDim.left + eyeDim.width/2) : eyeDim.left + eyeDim.width/2;
				const quadrantHeight = distanceY >= 0? window.innerHeight - (eyeDim.top + eyeDim.height/2) : eyeDim.top + eyeDim.height/2;

				const ratioX = distanceX / quadrantWidth;
				const ratioY = distanceY / quadrantHeight;

				const x = ratioX * eyeScaleX;
				const y = ratioY * eyeScaleY;

				eyesPos[identifier] = [x, y];
			}
			if (callback && typeof callback === "function")
				callback(eyesPos);
		}

		if (enabled === true) {
			window.addEventListener('mousemove', calcEyePos);
		} else {
			window.removeEventListener('mousedown', calcEyePos);
		}
		return () => window.removeEventListener('mousemove', calcEyePos);
	},deps)
}