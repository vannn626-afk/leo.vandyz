import React from 'react';
import {Copy,Download,ExternalLink,Image as ImageIcon,Music,Video,Check,CheckCircle2,AlertTriangle} from 'lucide-react';
import {findMedia,pickText,extractItems,cleanObject,unwrap,isCodeKey} from '../utils/parser';
const pretty=k=>String(k).replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const asUrl=v=>typeof v==='string'&&/^(https?:\/\/|data:image\/|data:video\/|data:audio\/)/i.test(v)?v:null;
function SafeMedia({kind,url}){const [bad,setBad]=React.useState(false);if(!url||bad)return <div className="media-fallback"><b>Media tidak bisa dipreview</b><a href={url||'#'} target="_blank" rel="noreferrer">Buka hasil media</a></div>;const fail=()=>setBad(true);if(kind==='image')return <img className="media-preview" src={url} alt="API result" onError={fail}/>;if(kind==='video')return <video className="media-preview" controls src={url} onError={fail}/>;return <audio className="audio" controls src={url} onError={fail}/>;}

const isApiFailure=(data)=>data&&typeof data==='object'&&(data.status===false||data.status==='offline'||data.success===false||data.error||data.code>=400);
function StalkerResult({result}){
 const [raw,setRaw]=React.useState(false);
 const data=result?.data??result;
 const urls=[]; const rows=[];
 const walk=(v,path='')=>{
   if(v==null)return;
   if(typeof v==='string'||typeof v==='number'||typeof v==='boolean'){
     const str=String(v); const u=asUrl(str); if(u)urls.push(u); else if(str.trim() && !isCodeKey(path.split('.').pop()||''))rows.push([path||'result',str]);
     return;
   }
   if(Array.isArray(v)){v.forEach((x,i)=>walk(x,`${path}[${i+1}]`));return;}
   if(typeof v==='object')Object.entries(v).forEach(([k,x])=>{if(isCodeKey(k)||['timestamp','attribution'].includes(k))return;walk(x,path?`${path}.${k}`:k)});
 };
 walk(data);
 const unique=[...new Set(urls)].slice(0,30);
 const media=unique.filter(u=>/\.(png|jpe?g|gif|webp|mp4|webm|mov)(\?|$)/i.test(u));
 return <div className="result-panel"><div className="success-label"><CheckCircle2 size={17}/> SUCCESS</div><div className="result-head"><span>ZYVOR STALKER RESULT</span></div>
   {rows.length>0&&<div className="structured-result">{rows.slice(0,50).map(([k,v],i)=><div className="data-row" key={i}><span>{pretty(k)}</span><b>{v}</b></div>)}</div>}
   {media.length>0&&<div className="items-grid" style={{marginTop:12}}>{media.map((u,i)=><div className="item-card" key={u}><SafeMedia kind={/\.(mp4|webm|mov)(\?|$)/i.test(u)?'video':'image'} url={u}/><a href={u} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Open media</a></div>)}</div>}
   {unique.filter(u=>!media.includes(u)).length>0&&<div className="url-results">{unique.filter(u=>!media.includes(u)).map(u=><div className="url-row" key={u}><a href={u} target="_blank" rel="noreferrer">{u}</a><a className="url-open" href={u} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Open</a></div>)}</div>}
   {!rows.length&&!unique.length&&<div className="quote-result">Zyvor mengembalikan data kosong.</div>}
   <button className="raw-toggle" onClick={()=>setRaw(x=>!x)}>{raw?'Hide raw response':'View raw response'}</button>{raw&&<pre className="dev-response">{JSON.stringify(data,null,2)}</pre>}
 </div>;
}

function ReactChannelResult({data}){
 const failed=isApiFailure(data);
 const message=failed?(data?.message||data?.error||'Zyvor mengembalikan status error.'):((data&&typeof data==='object'&&(data.message||data.msg))||'Reaksi berhasil dikirim oleh Zyvor.');
 return <div className={`result-panel ${failed?'result-error':''}`}><div className={failed?'error-result-label':'success-label'}>{failed?<><AlertTriangle size={17}/> ERROR</>:<><CheckCircle2 size={17}/> SUCCESS</>} <span>REACT CHANNEL</span></div><div className="quote-result">{message}</div><details className="response-details"><summary>View raw response</summary><pre className="dev-response">{JSON.stringify(data,null,2)}</pre></details></div>;
}

function BypassResult({url,copy}){const [copied,setCopied]=React.useState(false);const doCopy=async()=>{await copy(url);setCopied(true);setTimeout(()=>setCopied(false),1200)};return <div className="result-panel bypass-result"><div className="success-label"><CheckCircle2 size={17}/> DESTINATION FOUND</div><div className="bypass-result-box"><small>LINK TUJUAN</small><div className="bypass-url">{url}</div><div className="bypass-actions"><button className="btn primary" onClick={doCopy}><Copy size={15}/> {copied?'COPIED':'SALIN LINK'}</button><a className="btn ghost" href={url} target="_blank" rel="noreferrer"><ExternalLink size={15}/> BUKA LINK</a></div></div></div>}

export default function ResponseView({result}){
 const [copied,setCopied]=React.useState(false),[raw,setRaw]=React.useState(false); if(!result)return null;
 const copy=async(text)=>{await navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1200)};
 const download=(url,name)=>{const a=document.createElement('a');a.href=url;a.download=name;a.target='_blank';a.rel='noreferrer';a.click()};
 if(result.kind==='image'||result.kind==='video'||result.kind==='audio'){const C=result.kind==='image'?ImageIcon:result.kind==='video'?Video:Music;return <div className="result-panel"><div className="success-label"><CheckCircle2 size={17}/> SUCCESS</div><div className="result-head"><span><C size={16}/> {result.kind.toUpperCase()} READY</span></div><SafeMedia kind={result.kind} url={result.url}/><button className="btn primary" onClick={()=>download(result.url,`vanndy-${result.kind}`)}><Download size={16}/> DOWNLOAD {result.kind.toUpperCase()}</button></div>}
 const data=result.data??result;
 if(result.tool?.ui==='stalker')return <StalkerResult result={result}/>;
 if(result.tool?.ui==='react-channel')return <ReactChannelResult data={data}/>;
 if(result.tool?.ui==='bypass'){
   const inputUrl=String(result.inputValues?.url||'').trim();
   const normalized=u=>{try{return new URL(u).href.replace(/\/$/,'')}catch{return String(u).replace(/\/$/,'')}};
   const sameInput=u=>inputUrl&&normalized(u)===normalized(inputUrl);
   const preferred=/^(destination|destinationUrl|destination_url|target|targetUrl|target_url|final|finalUrl|final_url|redirect|redirectUrl|redirect_url|resolved|resolvedUrl|resolved_url|href|link)$/i;
   const link=(()=>{
     let found=null;
     const seen=new Set();
     const walk=(v,depth=0,prefer=false)=>{
       if(found||depth>8||v==null)return;
       if(typeof v==='string'){
         if(/^https?:\/\//i.test(v)&&!sameInput(v)){if(prefer||!found)found=v;}
         return;
       }
       if(Array.isArray(v)){for(const x of v)walk(x,depth+1,prefer);return;}
       if(typeof v==='object'){
         for(const [k,x] of Object.entries(v)){
           if(['code','javascript','js','python','java','curl','status','message','success'].includes(k.toLowerCase()))continue;
           const key=String(k);
           if(preferred.test(key))walk(x,depth+1,true);
           else walk(x,depth+1,prefer);
           if(found)return;
         }
       }
     };
     walk(data);
     return found;
   })();
   if(link)return <BypassResult url={link} copy={copy}/>;
   return <div className="result-panel result-error"><div className="error-result-label"><AlertTriangle size={17}/> BYPASS RESULT</div><div className="quote-result">API tidak mengembalikan link tujuan yang berbeda dari URL input.</div><button className="raw-toggle" onClick={()=>setRaw(x=>!x)}>{raw?'Hide raw response':'View raw response'}</button>{raw&&<pre className="dev-response">{JSON.stringify(data,null,2)}</pre>}</div>;
 }
 if(isApiFailure(data)) return <div className="result-panel result-error"><div className="error-result-label"><AlertTriangle size={17}/> ENDPOINT RESPONSE</div><div className="quote-result">{data.message||data.error||`Endpoint returned ${data.status}.`}</div><button className="raw-toggle" onClick={()=>setRaw(x=>!x)}>{raw?'Hide raw response':'View raw response'}</button>{raw&&<pre className="dev-response">{JSON.stringify(data,null,2)}</pre>}</div>;
 const payload=unwrap(data); const image=findMedia(payload,'image'),video=findMedia(payload,'video'),audio=findMedia(payload,'audio'),text=pickText(payload),items=extractItems(payload);
 const urls=[]; const walk=v=>{if(!v)return;if(typeof v==='string'){const u=asUrl(v);if(u)urls.push(u);return}if(Array.isArray(v))v.forEach(walk);else if(typeof v==='object')Object.entries(v).forEach(([k,x])=>{if(!isCodeKey(k))walk(x)});};walk(payload);
 const useful=[...new Set(urls)]; const cleaned=cleanObject(payload);
 const rows=cleaned&&typeof cleaned==='object'&&!Array.isArray(cleaned)?Object.entries(cleaned).filter(([k,v])=>!['status','timestamp','attribution','message'].includes(k)&&!isCodeKey(k)&&typeof v!=='object'&&v!==null&&v!==''):[];
 return <div className="result-panel"><div className="success-label"><CheckCircle2 size={17}/> SUCCESS</div><div className="result-head"><span>RESULT READY</span><div className="result-actions">{(text||useful[0])&&<button onClick={()=>copy(text||useful[0])}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy'}</button>}</div></div>{image&&<><SafeMedia kind="image" url={image}/><button className="btn primary" onClick={()=>download(image,'vanndy-image')}><Download size={16}/> DOWNLOAD IMAGE</button></>}{video&&<><SafeMedia kind="video" url={video}/><button className="btn primary" onClick={()=>download(video,'vanndy-video')}><Download size={16}/> DOWNLOAD VIDEO</button></>}{audio&&<><SafeMedia kind="audio" url={audio}/><button className="btn primary" onClick={()=>download(audio,'vanndy-audio')}><Download size={16}/> DOWNLOAD AUDIO</button></>}{text&&<div className="quote-result">{text}</div>}{items.length>0&&<div className="items-grid">{items.slice(0,24).map((x,i)=><div className="item-card" key={i}><b>{x?.title||x?.name||x?.artist||`Result ${i+1}`}</b><span>{x?.description||x?.author||x?.artist||''}</span>{(x?.url||x?.link)&&<a href={x.url||x.link} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Open</a>}</div>)}</div>}{!image&&!video&&!audio&&!text&&!items.length&&useful.length>0&&<div className="url-results">{useful.slice(0,10).map(u=><div key={u} className="url-row"><a href={u} target="_blank" rel="noreferrer">{u}</a><button onClick={()=>copy(u)}><Copy size={14}/> Copy</button><a className="url-open" href={u} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Open</a></div>)}</div>}{!image&&!video&&!audio&&!text&&!items.length&&!useful.length&&<div className="structured-result">{rows.length?rows.map(([k,v])=><div className="data-row" key={k}><span>{pretty(k)}</span><b>{String(v)}</b></div>):<div className="quote-result">{typeof cleaned==='object'?JSON.stringify(cleaned,null,2):String(cleaned)}</div>}</div>}<button className="raw-toggle" onClick={()=>setRaw(x=>!x)}>{raw?'Hide raw response':'View raw response'}</button>{raw&&<pre className="dev-response">{JSON.stringify(data,null,2)}</pre>}</div>
}
