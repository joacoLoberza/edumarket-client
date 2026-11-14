import styles from './SchoolsStages.module.css';
import { useState, useEffect } from 'react';

export default function SchoolsStages({ curntStage }) {
	return (
		<div className="relative overflow-hidden w-2/7 shadow-[inset_30px_0px_20px_-20px_rgba(120,120,120,0.5)] flex flex-col justify-evenly">
				<SvgStepConnectorTop className="absolute top-0 right-10 w-[calc((100%*4/7)+32px+16px-40px)] h-[calc((100%-144px)/3-12px)] pointer-events-none" />
				<div className="flex justify-end items-center gap-4">
					<div className={`rounded-full h-18 aspect-square bg-amber-500 flex items-center justify-center font-roboto font-black text-3xl text-amber-800 outline-offset-4 
						${curntStage === 0 && styles["stage-number-enter"]}
						${curntStage === 1 && styles["stage-number-exit"]}
					`}>1</div>
					<p className={`font-black font-montserrat text-3xl text-end text-zinc-300 w-4/7 shrink-0
						${curntStage === 0 && styles["stage-title-enter-right"]}
						${curntStage === 1 && styles["stage-title-exit-right"]}
					`}>ENCONTRÁ LA ESCUELA</p> 
				</div>
				<SvgStepConnectorMiddle className="absolute pl-[calc(100%*3/7-32px-16px)] pr-[calc(100%*4/7-32px-16px)] h-[calc((100%-144px)/3-12px-4px)] translate-y-[2px]" />
				<div className="flex justify-start items-center gap-4">
					<p className={`font-black font-montserrat text-3xl text-start bg-clip-text bg-linear-to-r from-zinc-400 from-[1%] to-[20%] to-zinc-300 text-transparent w-3/7 shrink-0
						${curntStage === 1 && styles["stage-title-enter-left"]}
						${curntStage === 0 && styles["stage-title-exit-left"]}
					`}>ELEGÍ LA LISTA</p>
					<div className={`rounded-full h-18 aspect-square bg-lime-500 flex items-center justify-center font-roboto font-black text-3xl text-lime-800 outline-offset-4
						${curntStage === 1 && styles["stage-number-enter"]}
						${curntStage === 0 && styles["stage-number-exit"]}
					`}>2</div>
				</div>
				<SvgStepConnectorBottom className="absolute bottom-0 left-12 w-[calc((100%*3/7)+52px-48px)] h-[calc((100%-144px)/3-4px)] pointer-events-none" />
		</div>
	)
}

function SvgStepConnectorTop({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none" 
      fill="none"
    >
      <path
        d="M 100 0 C 80 15, 60 30, 30 50 C 10 65, 0 80, 0 100"
        className="stroke-zinc-400"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SvgStepConnectorMiddle({ className }) {
  return (
    <svg 
      className={`w-full [aspect-ratio:unset] ${className}`} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none" 
      fill="none"
    >
      <path
        d="M 0 0 C 0 50, 100 50, 100 100"
        className="stroke-zinc-400"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function SvgStepConnectorBottom({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none" 
      fill="none"
    >
      <path
        d="M 100 0 C 100 40, 30 70, 0 100"
        className="stroke-zinc-400"
        strokeWidth="4"
        strokeDasharray="10 8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}