'use client';

import {motion, useInView, useReducedMotion, type Variants} from 'framer-motion';
import {useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';

type VisualState = 'messy' | 'transitioning' | 'clear';
const ease = [0.65, 0, 0.35, 1] as const;
const scribbles = [
  'M126 223C73 194 111 118 174 159S252 240 191 247 99 192 146 127s120 18 91 85-132 58-123-16 93-101 136-27-1 111-142 89-151 5 108-98 151-42 17 101 81 124 4-42 98-103 80-136-39',
  'M111 185c26-68 105-66 138-18s-4 105-67 85-91-92-32-123 139 45 92 105-148 67-141-5 80-111 146-55 22 73-80 130-130 65-1-105 97-120 126-18-17 77-116 102-140 42',
  'M137 255c-55-31-45-117 18-139s132 42 101 99-131 76-151 17 72-128 131-83 7 139-70 126-106-100-39-143 140 5 123 87-118 99-145 36 48-138 124-122 35 126-50 150',
  'M96 213c7-82 105-119 161-58s-12 135-86 112-95-119-20-151 147 51 100 123-159 69-154-15 101-140 161-65-25 144-118 132-54-127 38-140 137 111 70 155-76 10-151-71-101-138',
  'M119 151c55-53 147-6 139 72s-114 88-149 24 38-139 108-105 61 134-20 146-139-62-91-125 133-50 139 28-98 141-155 73 5-149 89-157 111 53-36 153-123 95',
  'M100 240c-17-73 54-139 125-111s71 128 2 156-149-40-111-105 145-72 159 7-80 137-150 91-42-146 47-158 139 94 91 150-78 42-150-19-107-115 111-74 143-3',
  'M144 119c68-25 136 43 111 111s-127 73-156 0 58-140 122-104 45 145-39 160-129-76-70-139 130-27 123 57-126 116-157 46 48-143 122-128 44 120-38 158',
  'M91 177c39-70 139-72 178-4s-28 135-105 115-109-112-35-157 159 24 124 111-164 82-165-5 112-151 172-54-43 158-143 132-37-135 72-147 150 64 19 158-88 50-159-54-77-141',
];
const flowLines = ['M112 191C139 137 204 119 263 153','M103 211C142 159 207 147 274 180','M105 234C151 190 214 182 273 207','M118 255C163 226 218 218 263 233','M141 272C177 255 218 250 248 255'];
const stageVariants: Variants = {messy:{rotate:-2,y:5},transitioning:{rotate:-.7,y:2},clear:{rotate:0,y:0}};
const scribbleVariants: Variants = {messy:{opacity:.9,scale:1.03,rotate:-2},transitioning:{opacity:.42,scale:.99,rotate:0},clear:{opacity:.012,scale:.92,rotate:1}};
const flowVariants: Variants = {messy:{opacity:0,pathLength:.08},transitioning:{opacity:.58,pathLength:.55},clear:{opacity:1,pathLength:1}};

function FloatingAnnotation({className,children}:{className:string;children:ReactNode}) {
  return <motion.span className={`ctc-annotation ${className}`} variants={{messy:{opacity:.78,y:0},transitioning:{opacity:.45,y:-2},clear:{opacity:className.includes('clear-note')?1:.16,y:-5}}}>{children}</motion.span>;
}

export function ChaosToClarityVisual() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root,{once:true,amount:.35});
  const reducedMotion = useReducedMotion();
  const [visualState,setVisualState] = useState<VisualState>(reducedMotion?'clear':'messy');
  useEffect(()=>{
    if(reducedMotion){setVisualState('clear');return;}
    if(!inView)return;
    let timer:ReturnType<typeof setTimeout>; let cancelled=false;
    const cycle=()=>{setVisualState('transitioning');timer=setTimeout(()=>{if(cancelled)return;setVisualState('clear');timer=setTimeout(()=>{if(cancelled)return;setVisualState('transitioning');timer=setTimeout(()=>{if(cancelled)return;setVisualState('messy');timer=setTimeout(cycle,2000)},4800)},2000)},4800)};
    timer=setTimeout(cycle,650);return()=>{cancelled=true;clearTimeout(timer)};
  },[inView,reducedMotion]);
  const moveLight=(event:React.PointerEvent<HTMLDivElement>)=>{if(reducedMotion||event.pointerType==='touch'||!root.current)return;const box=root.current.getBoundingClientRect();root.current.style.setProperty('--light-x',`${event.clientX-box.left}px`);root.current.style.setProperty('--light-y',`${event.clientY-box.top}px`)};
  const duration=reducedMotion?0:visualState==='transitioning'?4.8:.8;
  const transition={duration,ease};
  return <motion.div ref={root} className="ctc" data-state={visualState} initial={false} animate={visualState} onPointerMove={moveLight} style={{'--light-x':'68%','--light-y':'32%'} as CSSProperties} aria-label="A tangled mind slowly resolving into a clear, calm flow">
    <div className="ctc-copy"><span>From scattered to sorted.</span><small>Turn noise into a clear next move.</small></div>
    <motion.div className="ctc-stage" initial={false} animate={visualState}>
      <motion.div className="ctc-cursor-light" aria-hidden="true" variants={{messy:{opacity:.08},transitioning:{opacity:.18},clear:{opacity:.3}}} transition={transition}/>
      <motion.div className="ctc-sun" aria-hidden="true" variants={{messy:{opacity:.08,scale:.72},transitioning:{opacity:.34,scale:.9},clear:{opacity:.72,scale:1}}} transition={transition}/>
      <motion.svg className="ctc-person" viewBox="0 0 380 480" role="img" aria-labelledby="ctc-title ctc-description" variants={stageVariants} transition={transition} style={{x:'-50%'}}>
        <title id="ctc-title">Chaos becoming clarity</title><desc id="ctc-description">A minimal human silhouette whose tangled scribble head resolves into five calm flowing lines.</desc>
        <defs><linearGradient id="ctc-shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34302c"/><stop offset="1" stopColor="#201e1b"/></linearGradient></defs>
        <ellipse cx="190" cy="446" rx="112" ry="14" fill="#24211e" opacity=".07"/><path d="M74 451c8-90 43-137 116-137s108 47 116 137Z" fill="url(#ctc-shirt)"/><path d="M146 327c14 18 29 26 44 26s30-8 44-26l18 17c-15 31-36 47-62 47s-47-16-62-47Z" fill="#fff9ee" opacity=".94"/><path d="M173 282h34v54c-5 9-11 13-17 13s-12-4-17-13Z" fill="#d5a27f"/><path d="M133 221c0-62 24-100 57-100s57 38 57 100-25 92-57 92-57-30-57-92Z" fill="#ddb08d"/><path d="M145 263c20 17 69 17 90 0" fill="none" stroke="#b98268" strokeWidth="1.5" strokeLinecap="round" opacity=".35"/>
        <motion.g className="ctc-scribbles" variants={scribbleVariants} transition={transition} style={{transformOrigin:'190px 200px'}}>{scribbles.map((d,index)=><motion.path key={d} d={d} custom={index} fill="none" stroke="#24211e" strokeWidth={index%3===0?2.5:1.8} strokeLinecap="round" strokeLinejoin="round" variants={{messy:{pathLength:1,x:0,y:0},transitioning:{pathLength:.46,x:(index-3.5)*1.5,y:(index%2?1:-1)*3},clear:{pathLength:.01,x:(index-3.5)*3,y:(index%2?1:-1)*6}}} transition={{duration,ease,delay:reducedMotion?0:index*.025}}/>)}</motion.g>
        <motion.g className="ctc-flow-lines">{flowLines.map((d,index)=><motion.path key={d} d={d} fill="none" stroke={index===2?'#d9a62f':'#24211e'} strokeWidth={index===2?3:2.1} strokeLinecap="round" variants={flowVariants} transition={{duration,ease,delay:reducedMotion?0:index*.08}}/>)}</motion.g>
      </motion.svg>
      <FloatingAnnotation className="messy-note">Too many tabs open.</FloatingAnnotation><FloatingAnnotation className="clear-note">One clear next step.</FloatingAnnotation>
      <motion.div className="ctc-meter" aria-hidden="true" variants={{messy:{rotate:-28,opacity:.5},transitioning:{rotate:-8,opacity:.75},clear:{rotate:0,opacity:1}}} transition={transition}><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="16"/><motion.circle className="ctc-meter-progress" cx="21" cy="21" r="16" variants={{messy:{pathLength:.18},transitioning:{pathLength:.58},clear:{pathLength:1}}} transition={transition}/></svg><span>clarity</span></motion.div>
      <motion.span className="ctc-handwritten" variants={{messy:{opacity:.35,rotate:-5},transitioning:{opacity:.58,rotate:-3},clear:{opacity:.86,rotate:-2}}} transition={transition}>make space for what matters</motion.span>
    </motion.div>
  </motion.div>;
}
