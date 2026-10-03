import React from 'react';import {Heart,Clock3,Settings,Trash2,Copy,Info,UserRound,Sparkles,MessageCircle,Code2,MapPin,GraduationCap,ArrowUpRight,Layers} from 'lucide-react';
export function Favorites({favorites,setSelected,setPage}){return <div className="page"><div className="page-title"><div><small>LOCAL</small><h1>Favorites</h1><p>Your saved tools live only in this browser.</p></div><Heart/></div><div className="tool-grid">{favorites.map(t=><button className="tool-card" key={t.id} onClick={()=>{setSelected(t);setPage('tool')}}><Heart size={17}/><div className="tool-main"><b>{t.name}</b><span>{t.description}</span></div></button>)}{!favorites.length&&<div className="empty"><Heart size={28}/>No favorites yet.</div>}</div></div>}
export function History({history,setSelected,setPage,clear}){return <div className="page"><div className="page-title"><div><small>LOCAL</small><h1>History</h1><p>Only tool names and timestamps are stored.</p></div><button className="icon-btn" onClick={clear}><Trash2/></button></div><div className="history-list">{history.map((h,i)=><button key={i} onClick={()=>{setSelected(h.tool);setPage('tool')}}><Clock3 size={16}/><span>{h.tool.name}</span><small>{new Date(h.time).toLocaleTimeString()}</small></button>)}{!history.length&&<div className="empty"><Clock3 size={28}/>No recent tools.</div>}</div></div>}
export function SettingsPage({profile,setProfile}){
 const [theme,setTheme]=React.useState(()=>{try{return localStorage.getItem('king-vandyz-theme-v2')||'brutal'}catch{return 'glass'}});
 const [reduced,setReduced]=React.useState(()=>{try{return localStorage.getItem('king-vandyz-reduced-motion')==='1'}catch{return false}});
 const applyTheme=v=>{setTheme(v);try{localStorage.setItem('king-vandyz-theme-v2',v)}catch{};document.documentElement.dataset.theme=v;window.dispatchEvent(new Event('kv-theme-change'))};
 const applyMotion=v=>{setReduced(v);try{localStorage.setItem('king-vandyz-reduced-motion',v?'1':'0')}catch{};document.documentElement.dataset.motion=v?'reduced':'full'};
 React.useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.dataset.motion=reduced?'reduced':'full'},[]);
 return <div className="settings-page page">
  <div className="page-title"><div><small>KING VANDYZ</small><h1>Settings</h1><p>Atur tampilan dan performa aplikasi dari satu tempat.</p></div><Settings/></div>
  <section className="settings-theme glass-panel"><div><small>THEME SYSTEM</small><h2>Ganti tema</h2><p>Pilihan tema tersimpan di perangkat ini dan tidak mengubah database, akun, credits, atau tools.</p></div>
   <div className="theme-picker">{[['glass','Glassmorphism'],['brutal','Neo Brutalism'],['city','Modern City'],['comic','Comic Style']].map(([id,label])=><button type="button" className={theme===id?'active':''} key={id} onClick={()=>applyTheme(id)}><span className={`theme-preview ${id}`}/><b>{label}</b><small>{theme===id?'AKTIF':'PILIH'}</small></button>)}</div>
  </section>
  <section className="settings-grid">
   <button type="button" className={`setting-card ${reduced?'active':''}`} onClick={()=>applyMotion(!reduced)}><b>⚡ Reduce Motion</b><span>{reduced?'Aktif — animasi berat dikurangi.':'Nonaktif — animasi penuh.'}</span><strong>{reduced?'ON':'OFF'}</strong></button>
   <div className="setting-card"><b>API Base</b><span>api.zyvor.my.id</span></div>
   <div className="setting-card"><b>Favorites</b><span>Stored locally only.</span></div>
   <div className="setting-card"><b>Static Banner</b><span>16:9 · admin customizable</span></div>
  </section>
  <div className="info-box"><Info size={18}/><span>Kalau HP terasa berat, aktifkan Reduce Motion. Tools dan fungsi API tetap sama.</span></div>
 </div>
}

export function AboutPage(){return <div className="page about-page">
  <section className="about-modern-hero">
    <div className="about-orbit orbit-one"/><div className="about-orbit orbit-two"/>
    <div className="about-hero-top"><span className="about-chip"><Sparkles size={13}/> CREATOR PROFILE</span><span className="about-code">KV / ABOUT</span></div>
    <div className="about-identity">
      <div className="about-avatar-xl"><span>LF</span></div>
      <div className="about-identity-copy"><small>LEONARDO FANDIZKIEL</small><h1>Building digital things<br/><em>with curiosity.</em></h1><p>Independent builder and student creating web experiences, API tools, and experimental digital projects under the VANDYZ identity.</p></div>
    </div>
    <div className="about-metrics"><div><b>VANDYZ</b><span>Project identity</span></div><div><b>API HUB</b><span>Current focus</span></div><div><b>2026</b><span>Active build era</span></div></div>
  </section>

  <section className="about-interface-grid">
    <article className="about-modern-panel about-story-panel"><div className="about-label"><Sparkles size={14}/> PROFILE</div><h2>From curiosity to projects.</h2><p>VANDYZ is a growing workspace for experimenting with interfaces, APIs, automation, and practical digital utilities. The goal is simple: build, test, learn, and keep improving.</p><p>This platform brings those experiments into one focused interface instead of scattering them across different projects.</p><div className="about-status-line"><span className="live-dot"/> BUILD STATUS <b>ACTIVE</b></div></article>
    <article className="about-modern-panel about-stack-panel"><div className="about-label"><Code2 size={14}/> CURRENT STACK</div><div className="about-stack"><span>WEB</span><span>APIs</span><span>UI / UX</span><span>TOOLS</span><span>EXPERIMENTS</span></div><div className="about-mini-row"><span>Workspace</span><b>KING VANDYZ</b></div><div className="about-mini-row"><span>API origin</span><b>ZYVOR</b></div></article>
  </section>

  <section className="about-project-panel">
    <div><div className="about-label"><Layers size={14}/> THE PROJECT</div><h2>KING VANDYZ</h2><p>An app-style API workspace for exploring downloaders, makers, utilities, AI tools, and other services through one consistent interface.</p></div>
    <div className="about-project-side"><span>01</span><b>EXPLORE</b><span>02</span><b>CREATE</b><span>03</span><b>ITERATE</b></div>
  </section>

  <section className="about-modern-facts">
    <div className="about-fact-modern"><MapPin/><small>LOCATION</small><b>Indonesia</b></div>
    <div className="about-fact-modern"><GraduationCap/><small>ROLE</small><b>Student · Builder</b></div>
    <div className="about-fact-modern"><Code2/><small>INTERESTS</small><b>Web · APIs · Digital Projects</b></div>
  </section>

  <section className="premium-card"><div className="premium-icon"><Sparkles/></div><div className="premium-copy"><small>VANDYZ PREMIUM</small><h2>AM Premium · Rp2.000</h2><p>Untuk pembelian AM Premium, hubungi VANDYZ melalui WhatsApp.</p></div><a className="btn premium-btn" href="https://wa.me/6283818597706?text=Halo%20VANDYZ%2C%20saya%20mau%20beli%20AM%20Premium%20Rp2.000." target="_blank" rel="noreferrer"><MessageCircle size={17}/> Contact VANDYZ</a></section>
  <section className="about-ending"><span>LEONARDO FANDIZKIEL · VANDYZ</span><p>Still learning. Still building. Still evolving.</p></section>
</div>}
