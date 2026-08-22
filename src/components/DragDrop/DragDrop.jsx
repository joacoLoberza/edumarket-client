import { useState, useEffect } from "react";
import styles from "./DragDrop.module.css";

export default function DragDrop ({ children, callback, normalAddStyles = "", dragAddStyles = ""}) {
	const defaults = 'relative bg-slate-100 rounded-2xl outline-slate-300 outline outline-4 border-solid border-4 border-white';
	const [style, setStyle] = useState(`${defaults} ${normalAddStyles}`);
	useEffect(() => {
		setStyle(`${defaults} ${normalAddStyles}`)
	}, [normalAddStyles])

	const fileEnter = (e) => {
		e.preventDefault();
		setStyle(`${defaults} ${normalAddStyles} ${styles["dragDropEnter"]} bg-red-500 ${dragAddStyles}`);
	}

	const fileLeave = (e) => {
		e.preventDefault();
		setStyle(`${defaults} ${normalAddStyles}`);
	}

	const fileDrop = (e) => {
		e.preventDefault();
		setStyle(`${defaults} ${normalAddStyles}`);
		
		callback(e.dataTransfer.files);
	}

	return (
		<div className={style}>
			<div className='absolute w-full h-full' onDragOver={(e) => {e.preventDefault();}} onDrop={fileDrop} onDragLeave={fileLeave} onDragEnter={fileEnter}>
			</div>
			{ children }
		</div>
	)
}