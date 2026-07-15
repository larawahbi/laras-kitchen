import t from '../translations';

function Loading({ lang }) {
  const tr = t[lang];
  return (
    <div className="loading-screen">
      <svg width="220" viewBox="0 0 220 200" role="img" aria-label="Simmering pot">
        <style>{`
          @keyframes lk-rise1 { 0%{opacity:0;transform:translateY(6px)} 30%{opacity:.9} 100%{opacity:0;transform:translateY(-16px)} }
          @keyframes lk-rise2 { 0%{opacity:0;transform:translateY(6px)} 40%{opacity:.75} 100%{opacity:0;transform:translateY(-18px)} }
          @keyframes lk-rise3 { 0%{opacity:0;transform:translateY(6px)} 35%{opacity:.85} 100%{opacity:0;transform:translateY(-14px)} }
          .lks1{animation:lk-rise1 2.6s ease-in-out infinite}
          .lks2{animation:lk-rise2 2.6s ease-in-out .5s infinite}
          .lks3{animation:lk-rise3 2.6s ease-in-out 1s infinite}
          @keyframes lk-glow { 0%,100%{opacity:.35} 50%{opacity:.9} }
          .lkflame{animation:lk-glow 1.8s ease-in-out infinite}
        `}</style>
        <g stroke="#C4956A" strokeWidth="2" fill="none" strokeLinecap="round">
          <path className="lks1" d="M82 62 c-6 -8 6 -14 0 -22 c-5 -7 3 -12 0 -18"/>
          <path className="lks2" d="M110 58 c-6 -9 6 -15 0 -24 c-5 -8 3 -13 0 -20"/>
          <path className="lks3" d="M138 62 c-6 -8 6 -14 0 -22 c-5 -7 3 -12 0 -18"/>
        </g>
        <g stroke="#7D9B76" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="58" y1="82" x2="162" y2="82"/>
          <path d="M64 82 l8 46 a10 10 0 0 0 10 8 h56 a10 10 0 0 0 10 -8 l8 -46"/>
          <path d="M58 90 h-12 a7 7 0 0 0 0 14 h13"/>
          <path d="M162 90 h12 a7 7 0 0 1 0 14 h-13"/>
        </g>
        <g className="lkflame" stroke="#C4956A" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="82" y1="142" x2="82" y2="150"/>
          <line x1="110" y1="142" x2="110" y2="152"/>
          <line x1="138" y1="142" x2="138" y2="150"/>
        </g>
        <g stroke="#7D9B76" strokeWidth="1.5" fill="none" opacity="0.55">
          <path d="M40 172 l6 -6 l6 6 l-6 6 z M46 166 v-7 M46 178 v7 M40 172 h-7 M52 172 h7"/>
          <path d="M104 172 l6 -6 l6 6 l-6 6 z M110 166 v-7 M110 178 v7 M104 172 h-7 M116 172 h7"/>
          <path d="M168 172 l6 -6 l6 6 l-6 6 z M174 166 v-7 M174 178 v7 M168 172 h-7 M180 172 h7"/>
          <line x1="59" y1="172" x2="97" y2="172" strokeDasharray="3 4"/>
          <line x1="123" y1="172" x2="161" y2="172" strokeDasharray="3 4"/>
        </g>
      </svg>
      <p className="loading-phrase">{tr.loading}</p>
    </div>
  );
}

export default Loading;
