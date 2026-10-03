import { KNOWN_TOOLS } from '../data/catalog.js';

export async function getCatalog(){
  const local={ok:true,source:'local-catalog',tools:KNOWN_TOOLS,count:KNOWN_TOOLS.length};
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    const r=await fetch('/api/catalog',{cache:'no-store',signal:controller.signal});
    clearTimeout(timer);
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data?.tools)&&data.tools.length)return data;
    }
  }catch{}
  return local;
}


export async function uploadVideo(file){
  if(!(typeof File!=='undefined' && file instanceof File))throw new Error('Video file tidak valid.');
  const form=new FormData();
  form.append('file',file,file.name||'video.mp4');
  const r=await fetch('/api/upload-video',{method:'POST',body:form,headers:{Accept:'application/json'}});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||!data?.url)throw new Error(data?.error||'Gagal membuat URL video sementara.');
  return data.url;
}

export async function callTool(tool,params={}){
  if(tool.local)throw new Error('Local tools are disabled.');
  const defs=(tool.params||[]).map(p=>typeof p==='string'?{name:p,in:tool.method==='GET'?'query':'body'}:p);
  if(tool.autoUpload && params.url && !defs.some(p=>p.name==='url')) defs.push({name:'url',in:tool.method==='GET'?'query':'body'});
  const qs=new URLSearchParams(); const body={};
  for(const p of defs){const v=params[p.name];if(v===undefined||v===null||v==='')continue;if(p.in==='query'||p.in==='path')qs.set(p.name,String(v));else body[p.name]=v;}
  const path=tool.endpoint+(qs.toString()?`?${qs}`:'');
  const init={method:tool.method||'GET',headers:{Accept:'application/json, text/plain, */*'}};
  const hasFile=Object.values(params).some(v=>typeof File!=='undefined' && v instanceof File);
  if(!['GET','HEAD'].includes(init.method)){
    if(hasFile){
      const form=new FormData();
      for(const [k,v] of Object.entries(body)) form.append(k,v instanceof File?v:String(v));
      init.body=form;
    }else{
      init.headers['Content-Type']='application/json';
      init.body=JSON.stringify(body);
    }
  }
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),55000);
  init.signal=controller.signal;
  let r;
  try{r=await fetch(`/api/proxy?path=${encodeURIComponent(path)}`,init)}catch(e){
    if(e?.name==='AbortError')throw new Error('Zyyvor terlalu lama merespons. Coba video lebih pendek atau ulangi lagi.');
    throw e;
  }finally{clearTimeout(timer)}
  const ct=r.headers.get('content-type')||''; const buf=await r.arrayBuffer();
  if(!r.ok){let msg=`Request failed (${r.status})`;try{const t=new TextDecoder().decode(buf);const j=JSON.parse(t);msg=j.error||j.message||j.msg||j.detail||msg}catch{};throw new Error(msg)}
  if(/^image\//.test(ct)||/^video\//.test(ct)||/^audio\//.test(ct))return {kind:ct.split('/')[0],url:URL.createObjectURL(new Blob([buf],{type:ct})),contentType:ct};
  const text=new TextDecoder().decode(buf);try{return {kind:'json',data:JSON.parse(text)}}catch{return {kind:'text',data:text}}
}
