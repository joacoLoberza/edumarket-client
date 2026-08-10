import { useEffect, useState, useRef} from "react";

export default function DinamTitle({next = true, interval = 250, titles = ['NotTitleAvilable'], classes = '', onTitleChange}) {
	const [text, setText] = useState('');
	const currenTxt = useRef(-1);

	useEffect(() => {
		let currentRender = true;

		if (titles.length - 1 > currenTxt.current) {
			currenTxt.current += 1;
		} else {
			currenTxt.current = 0;
		}

		const currentTitle = titles[currenTxt.current];

		//Callback event when title changes.
		if (onTitleChange)
			onTitleChange(currentTitle);

		setText('');
		const typeWrite = async () => {
			for (let char of currentTitle) {
				if (!currentRender) return;
					
				setText(prev => prev + char);
				await new Promise(resolve => setTimeout(resolve, interval));
			}
		}
		typeWrite();

		return () => {
			currentRender = false;
		};
	}, [next]);

	return (
		<h1 className={classes} aria-hidden={true}>{text}</h1>
	)
}