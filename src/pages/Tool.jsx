import React from 'react';
import {ArrowLeft,Loader2,Send,Heart,Code2,ChevronDown,CheckCircle2,Trash2,Info,ListChecks,Lightbulb} from 'lucide-react';
import {callTool,uploadVideo} from '../services/api';
import ResponseView from '../components/ResponseView';
import {pickAIText} from '../utils/parser';
import {consumeTool} from '../services/platform';

const pretty=(name)=>String(name).replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const isLong=(p)=>['message','prompt','text','description','body','content','caption','bio','subtitle','address'].includes(p.name?.toLowerCase());

function Field({p,value,onChange,tool}){
  const label=tool?.autoUpload&&p.type==='file'?'Pilih Video':pretty(p.name);
  const aiModels=(tool?.category==='ai'&&p.name?.toLowerCase()==='model'&&tool?.modelOptions?.length)?tool.modelOptions:null;
  if(aiModels?.length)return <label>{label}{p.required&&<i>*</i>}<select value={value||''} onChange={e=>onChange(e.target.value)}><option value="">Select model</option>{aiModels.map(x=><option key={x} value={x}>{x}</option>)}</select><small className="field-help">Models exposed by Zyyvor.</small></label>;
  if(p.enum?.length)return <label>{label}{p.required&&<i>*</i>}<select value={value||''} onChange={e=>onChange(e.target.value)}><option value="">Select {label}</option>{p.enum.map(x=><option key={x} value={x}>{x}</option>)}</select>{p.description&&<small className="field-help">{p.description}</small>}</label>;
  if(isLong(p))return <label>{label}{p.required&&<i>*</i>}<textarea value={value||''} onChange={e=>onChange(e.target.value)} placeholder={p.description||`Enter ${label.toLowerCase()}`}/>{p.description&&<small className="field-help">{p.description}</small>}</label>;
  const n=String(p.name||'').toLowerCase();
  if(p.type==='file')return <label>{label}{p.required&&<i>*</i>}<input type="file" accept={p.accept||'*/*'} onChange={e=>onChange(e.target.files?.[0]||null)}/>{value?.name&&<small className="field-help file-name">{value.name}</small>}{p.description&&<small className="field-help">{p.description}</small>}</label>;
  const inputType=p.type==='number'?'number':(p.format==='uri'||n==='url'||n.endsWith('url')?'url':'text');
  return <label>{label}{p.required&&<i>*</i>}{p.type==='file'&&tool?.autoUpload&&<small className="field-help">Pilih video dari galeri — URL akan dibuat otomatis.</small>}<input type={inputType} inputMode={p.type==='number'?'numeric':undefined} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={inputType==='url'?'Paste URL here':`Enter ${label.toLowerCase()}`}/>{n==='emoji'&&<><div className="emoji-row">{['👍','❤️','🔥','😂','😮','🎉'].map(x=><button type="button" key={x} onClick={()=>onChange(value?`${value},${x}`:x)}>{x}</button>)}</div><small className="field-help">Bebas emoji. Untuk beberapa emoji, pisahkan dengan koma, contoh: ❤️,🌹,😛.</small></>}{p.description&&<small className="field-help">{p.description}</small>}</label>;
}

function codeFor(tool,values){
  const params=(tool.params||[]).map(p=>typeof p==='string'?{name:p,in:tool.method==='GET'?'query':'body'}:p);
  const q=params.filter(p=>p.in==='query'||p.in==='path').reduce((o,p)=>{o[p.name]=values[p.name]||`<${p.name}>`;return o},{});
  const b=params.filter(p=>p.in!=='query'&&p.in!=='path').reduce((o,p)=>{o[p.name]=values[p.name]||`<${p.name}>`;return o},{});
  const base='https://api.zyvor.my.id'+tool.endpoint;
  const query=new URLSearchParams(q).toString();
  const url=base+(query?`?${query}`:'');
  const json=JSON.stringify(Object.keys(b).length?b:values,null,2);
  const curl=tool.method==='GET'?`curl '${url}'`:`curl -X ${tool.method} '${base}' \\\n  -H 'Content-Type: application/json' \\\n  -d '${JSON.stringify(Object.keys(b).length?b:values)}'`;
  const py=tool.method==='GET'?`import requests\n\nr = requests.get(${JSON.stringify(url)})\nprint(r.json())`:`import requests\n\nr = requests.${tool.method.toLowerCase()}(${JSON.stringify(base)}, json=${json})\nprint(r.json())`;
  const js=tool.method==='GET'?`const response = await fetch(${JSON.stringify(url)});\nconst data = await response.json();\nconsole.log(data);`:`const response = await fetch(${JSON.stringify(base)}, {\n  method: '${tool.method}',\n  headers: {'Content-Type': 'application/json'},\n  body: JSON.stringify(${json})\n});\nconst data = await response.json();\nconsole.log(data);`;
  const java=`HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create(${JSON.stringify(url)}))\n    .${tool.method==='GET'?'GET()':`method("${tool.method}", HttpRequest.BodyPublishers.ofString(${JSON.stringify(Object.keys(b).length?JSON.stringify(b):JSON.stringify(values))}))`}\n    .header("Content-Type", "application/json")\n    .build();\nHttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());`;
  return {curl,python:py,javascript:js,java};
}

function CodeExamples({tool,values}){
  const [open,setOpen]=React.useState(false);const [tab,setTab]=React.useState('curl');
  const code=codeFor(tool,values);return <div className="code-box"><button className="code-toggle" onClick={()=>setOpen(v=>!v)}><span><Code2 size={16}/> Code examples — {tool.method} {tool.endpoint}</span><ChevronDown size={16} className={open?'rot':''}/></button>{open&&<div className="code-content"><div className="code-tabs">{['curl','python','javascript','java'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x==='javascript'?'JavaScript':x.toUpperCase()}</button>)}</div><pre>{code[tab]}</pre></div>}</div>;
}


function AIChatResult({messages,onClear,loading,error}){
  const bottomRef=React.useRef(null);
  React.useEffect(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),[messages,loading]);
  const copy=(t)=>{try{navigator.clipboard?.writeText(String(t||''))}catch{}};
  const safeMessages=Array.isArray(messages)?messages.filter(m=>m&&typeof m==='object'&&(m.role==='user'||m.role==='assistant')).map(m=>({role:m.role,text:typeof m.text==='string'?m.text:String(m.text??'')})):[];
  return <div className="result-panel ai-result chat-result"><div className={error?'error-result-label':'success-label'}>{error?<><span>⚠️ ERROR</span></>:<><CheckCircle2 size={17}/> KING VANDYZ AI</>} <button className="raw-toggle" onClick={onClear}><Trash2 size={14}/> CLEAR</button></div>{error&&<div className="quote-result ai-error-text">{String(error)}</div>}<div className="chat-thread">{safeMessages.map((m,i)=><div className={`chat-bubble ${m.role}`} key={`${m.role}-${i}`}><div className="chat-role">{m.role==='user'?'YOU':'KING VANDYZ'}</div><div className="chat-text">{m.text}</div>{m.role==='assistant'&&<button className="chat-copy" onClick={()=>copy(m.text)}>COPY</button>}</div>)}{loading&&<div className="chat-bubble assistant"><div className="chat-role">KING VANDYZ</div><div className="typing"><i></i><i></i><i></i></div></div>}<div ref={bottomRef}/></div></div>;
}

function PlayableQuiz({result}){
  const [idx,setIdx]=React.useState(0);const [score,setScore]=React.useState(0);const [done,setDone]=React.useState(false);
  const raw=result?.data??result;const arr=React.useMemo(()=>{const candidates=[];const walk=v=>{if(Array.isArray(v))v.forEach(x=>{if(x&&typeof x==='object'&&(x.question||x.pertanyaan))candidates.push(x);else walk(x)});else if(v&&typeof v==='object')Object.values(v).forEach(walk)};walk(raw);return candidates.slice(0,20)},[raw]);
  if(!arr.length)return null;const q=arr[idx];const options=q.options||q.choices||q.choicesList||q.answers||q.jawaban||[];const correct=q.answer??q.correctAnswer??q.correct??q.jawabanBenar;
  if(done)return <div className="game-panel"><b>GAME SELESAI 🎮</b><strong>{score} / {arr.length}</strong><button className="btn primary" onClick={()=>{setIdx(0);setScore(0);setDone(false)}}>MAIN LAGI</button></div>;
  const pick=(o)=>{const ok=String(o).trim().toLowerCase()===String(correct).trim().toLowerCase()||(o?.value&&String(o.value).toLowerCase()===String(correct).toLowerCase());if(ok)setScore(s=>s+1);if(idx+1>=arr.length)setDone(true);else setIdx(i=>i+1)};
  return <div className="game-panel"><small>PLAYABLE QUIZ · {idx+1}/{arr.length}</small><h3>{q.question||q.pertanyaan}</h3><div className="game-options">{options.map((o,i)=>{const label=typeof o==='string'?o:(o?.text||o?.label||o?.answer||o?.value||`Option ${i+1}`);return <button key={i} onClick={()=>pick(o)}>{label}</button>})}</div></div>;
}


function InstructionCard({guide,tool}){
  if(!guide)return null;
  return <section className={`instruction-card ${tool.ui==='web2apk'?'instruction-app':''}`}>
    <div className="instruction-head">
      <div className="instruction-icon"><Info size={17}/></div>
      <div><small>{guide.eyebrow||'QUICK GUIDE'}</small><h2>{guide.title}</h2><p>{guide.intro}</p></div>
    </div>
    <div className="instruction-steps">
      {guide.steps?.map((step,i)=><div className="instruction-step" key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{step}</p></div>)}
    </div>
    {guide.tip&&<div className="instruction-tip"><Lightbulb size={16}/><div><b>TIP</b><span>{guide.tip}</span></div></div>}
  </section>
}

export default function Tool({tool,setPage,onUsed,favorite,toggleFavorite}){
  const params=(tool.params||[]).map(p=>typeof p==='string'?{name:p,required:(tool.required||[]).includes(p),type:'string'}:p);
  const isAI=tool.category==='ai'&&tool.endpoint==='/api/ai/aichatting';
  const [values,setValues]=React.useState(Object.fromEntries(params.map(p=>[p.name,p.name==='emoji'?'👍':p.name==='model'?(tool.modelOptions?.[0]||'gpt-5.6-luna'):''])));
  const [loading,setLoading]=React.useState(false),[result,setResult]=React.useState(null),[error,setError]=React.useState('');
  const chatKey='vanndy-ai-chat-v4';
  const sanitizeMessages=(raw)=>{if(!Array.isArray(raw))return [];return raw.filter(m=>m&&typeof m==='object'&&(m.role==='user'||m.role==='assistant')&&m.text!=null).map(m=>{let text='';try{text=typeof m.text==='string'?m.text:JSON.stringify(m.text)}catch{text=String(m.text??'')}return {role:m.role,text:String(text||'').slice(0,8000)}}).filter(m=>m.text.trim()).slice(-20)};
  const [messages,setMessages]=React.useState(()=>{try{return sanitizeMessages(JSON.parse(localStorage.getItem(chatKey)||'[]'))}catch{return []}});
  React.useEffect(()=>{try{localStorage.setItem(chatKey,JSON.stringify(sanitizeMessages(messages)))}catch{}},[messages]);
  const clearChat=()=>{setMessages([]);setResult(null);setError('');try{localStorage.removeItem(chatKey)}catch{}};
  const submit=async()=>{
    setError('');
    for(const p of params.filter(x=>x.required))if((p.type==='file' ? !values[p.name] : !String(values[p.name]||'').trim())){setError(`${pretty(p.name)} is required.`);return}
    const started=performance.now();
    setLoading(true);
    try{
      if(tool.enabled===false){throw new Error('Tool sedang dinonaktifkan.')}
      if(tool.maintenance){throw new Error('Tool sedang dalam maintenance.')}
      if(!profile){throw new Error('Session expired. Login untuk menggunakan tools.')}
      const cost=Number(tool.credits_cost ?? tool.cost ?? 10);
      await consumeTool(tool.id,cost);
      let callValues={...values};
      if(isAI){
        const userText=String(values.text||'').trim();
        if(!userText){setError('Tulis pesan dulu.');return;}
        const recent=sanitizeMessages(messages).slice(-8).map(m=>`${m.role==='user'?'User':'Assistant'}: ${m.text}`).join('\n');
        callValues.text=recent?`Conversation so far:\n${recent}\n\nUser: ${userText}\nAssistant:`:userText;
        let out;
        try{out=await callTool(tool,callValues)}catch(firstError){
          // One clean retry without the accumulated conversation. This prevents a growing prompt from breaking the second/third message.
          const retryValues={...callValues,text:userText};
          try{out=await callTool(tool,retryValues)}catch{throw firstError}
        }
        const data=out?.data??out;
        const ok=!(data&&typeof data==='object'&&(data.status===false||data.success===false||Number(data.code)>=400));
        if(ok){
          const answer=String(pickAIText(data)||'AI returned an empty response.');
          setResult(null);
          setMessages(prev=>sanitizeMessages([...prev,{role:'user',text:userText},{role:'assistant',text:answer}]));
          setValues(v=>({...v,text:''}));
          onUsed?.(tool,{ok:true,duration:Math.round(performance.now()-started)});
        }else{
          const msg=String((data&&typeof data==='object'&&(data.message||data.error||data.msg||data.detail))||'Zyvor returned an error.');
          setError(msg);
          onUsed?.(tool,{ok:false,duration:Math.round(performance.now()-started),message:msg});
        }
      }else{
        if(tool.autoUpload){
          const file=callValues.video;
          const url=await uploadVideo(file);
          callValues={url};
        }
        const out=await callTool(tool,callValues);
        setResult({...out,tool,inputValues:callValues});
        const data=out?.data??out;
        const ok=!(data&&typeof data==='object'&&(data.status===false||data.success===false||Number(data.code)>=400));
        onUsed?.(tool,{ok,duration:Math.round(performance.now()-started),message:ok?'Success':'Zyvor returned an error'});
      }
    }catch(e){
      const msg=e?.message||'Zyyvor request failed.';
      setError(msg);
      onUsed?.(tool,{ok:false,duration:Math.round(performance.now()-started),message:msg});
    }finally{setLoading(false)}
  };
  return <div className="page tool-page"><button className="back-btn" onClick={()=>setPage('tools')}><ArrowLeft size={16}/> Back to Tools</button><div className="tool-title"><div><small>{tool.category.toUpperCase()}</small><h1>{tool.name}</h1><p>{tool.description}</p></div><div className="tool-title-actions"><button className={favorite?'icon-btn favorite active':'icon-btn favorite'} onClick={toggleFavorite}><Heart size={17} fill={favorite?'currentColor':'none'}/></button><span className="method">{tool.method}</span></div></div><InstructionCard guide={tool.guide} tool={tool}/><div className="workspace"><div className="form-panel">{params.length?params.map(p=><Field key={p.name} p={p} tool={tool} value={values[p.name]} onChange={v=>setValues(x=>({...x,[p.name]:v}))}/>):<div className="no-input">No input required — ready to run.</div>}<button className="btn primary full" disabled={loading} onClick={submit}>{loading?<><Loader2 className="spin" size={17}/> THINKING...</>:<><Send size={16}/> {tool.ui==='web2apk'?'CREATE APK':tool.ui==='anime'?'RUN ANIME':tool.ui==='whatsapp'?'SEND REACTION':isAI?'SEND MESSAGE':'RUN TOOL'}</>}</button></div><CodeExamples tool={tool} values={values}/>{error&&<div className="error-box">{error}<button onClick={submit}>Retry</button></div>}{loading&&<div className="loading-panel"><div className="loader-ring"/><b>{isAI?'KING VANDYZ IS TYPING…':'WAITING FOR ZYYVOR'}</b><span>{isAI?'Generating a real chat reply…':'Retry-safe request path active…'}</span></div>}{isAI&&messages.length>0&&<AIChatResult messages={messages} onClear={clearChat} loading={loading} error={error}/>} {!isAI&&result&&<PlayableQuiz result={result}/>} {!isAI&&result&&<ResponseView result={result}/>}</div></div>;
}
