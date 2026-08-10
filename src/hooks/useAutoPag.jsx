import { useEffect, useRef, useState } from "react";
import api from "../config/axiosApi";

export default function useAutoPag(url, dataKey, filters, errorHandling) {
	const [data, setData] = useState([]);
	const [load, setLoad] = useState(false);
	const refFilters = useRef(filters);
	refFilters.current = filters; //Make them always being updated whitout inject them in the dep. array of useEffect.
	const isFetching = useRef(false);
	const cursor = useRef('');
	const pageEnding = useRef(null);

	//This will check if the scroll is in the end.
	useEffect(() => {
		isFetching.current = false;
		setData([]);
		cursor.current = '';
		let currentRender = true; //This determines wether this function belongs to the current render and isn't from and old render.
		const observer  = new IntersectionObserver(async (entries) => {
			const report = entries[0];

			if (report.isIntersecting) {
				if (cursor.current === null || isFetching.current)
					return;
				
				isFetching.current = true;
				setLoad(true);

				try {
					//If the backend didn't returned null or isn't loading, call the endpoint.
					const response = await api.get(url, {
						params: {
							cursor: cursor.current,
							...refFilters.current,
						}
					});
					
					if (!currentRender)
						return;

					const resData = response.data;
					setData(prev => [...prev, ...resData[dataKey]]);
					cursor.current = resData.nextCursor;
					console.log(`%cAPI - ${response.status}|%c ${response?.data?.message}`, "color: rgb(255,255,0);")
				} catch (error) {
					const res = error?.response;

					if(!res) {
						console.error(`%cERROR|%c Couldn't send the request.`, "color: rgb(255, 60, 0)");
					} else {
						const data = res.data;
						console.error(`%cAPI - ${res.status}|%c ${data?.message}`, "color: rgb(255, 255, 0);");
						
						if (typeof errorHandling === 'function')
							await Promise.resolve(errorHandling());
					}
				} finally {
					if (currentRender) {
						isFetching.current = false;
						setLoad(false);
					}
				}
			}
		});
		
		if (pageEnding.current)
			observer.observe(pageEnding.current);

		return () => {
			if (pageEnding.current)
				observer.unobserve(pageEnding.current);

			currentRender = false; //Set this function as invalid for data or loading operations.
		}
	}, [JSON.stringify(filters)]);

	return ([ data, load, pageEnding ]);
}