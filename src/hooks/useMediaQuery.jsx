import { useState, useEffect } from "react"

export default function useMediaQuery (query) {
	const [match, setMatch] = useState(() => window.matchMedia(query).matches);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);

		const event = e => setMatch(e.matches);
		mediaQueryList.addEventListener('change', event);
		return () => mediaQueryList.removeEventListener('change', event)
	}, [query]);

	return match
}