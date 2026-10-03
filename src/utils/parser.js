const URL_RE=/https?:\/\/[^\s"'<>]+/i;
const CODE_KEYS=/^(code|javascript|js|python|python3|java|kotlin|php|curl|axios|node|nodejs|example|examples|snippet|snippets|requestCode)$/i;
export function flatten(v){if(v==null)return '';if(typeof v==='string')return v;if(typeof v==='number'||typeof v==='boolean')return String(v);return ''}
export function isCodeKey(k){return CODE_KEYS.test(String(k))}
export function unwrap(obj){
  if(!obj||typeof obj!=='object') return obj;
  if(obj.result!==undefined && obj.result!==null && typeof obj.result==='object') return obj.result;
  if(obj.data!==undefined && obj.data!==null && typeof obj.data==='object') return obj.data;
  return obj;
}
export function findMedia(obj,kind){
  obj=unwrap(obj);
  if(!obj)return null;
  if(typeof obj==='string')return kind==='text'?obj:(URL_RE.test(obj)?obj:null);
  if(Array.isArray(obj)){for(const x of obj){const r=findMedia(x,kind);if(r)return r;}return null;}
  if(typeof obj==='object'){
    const preferred=kind==='image'?['image','imageUrl','image_url','thumbnail','thumb','cover','qr','qrUrl']:
      kind==='video'?['video','videoUrl','video_url','play','download','downloadUrl']:
      kind==='audio'?['audio','audioUrl','audio_url','audioPreview','audio_preview','preview_url','previewUrl','preview','music','download','downloadUrl']:['download','downloadUrl','url','link'];
    for(const k of preferred)if(!isCodeKey(k)&&obj[k]&&typeof obj[k]==='string'&&URL_RE.test(obj[k]))return obj[k];
    for(const [k,v] of Object.entries(obj)){if(isCodeKey(k))continue;const r=findMedia(v,kind);if(r)return r;}
  }
  return null;
}
export function pickText(obj){
  obj=unwrap(obj);
  if(typeof obj==='string')return obj;
  if(!obj)return '';
  const keys=['text','message','quote','content','answer','title','description'];
  for(const k of keys)if(!isCodeKey(k)&&typeof obj[k]==='string'&&obj[k].trim())return obj[k];
  if(Array.isArray(obj)&&obj.length)return pickText(obj[0]);
  return '';
}
export function extractItems(obj){
  obj=unwrap(obj);
  if(Array.isArray(obj))return obj;
  if(obj&&typeof obj==='object'){for(const k of ['results','items','tracks','videos','images','songs','tracks','data','result'])if(Array.isArray(obj[k]))return obj[k];}
  return [];
}
export function cleanObject(obj){
  if(Array.isArray(obj)) return obj.map(cleanObject);
  if(obj&&typeof obj==='object') return Object.fromEntries(Object.entries(obj).filter(([k])=>!isCodeKey(k)).map(([k,v])=>[k,cleanObject(v)]));
  return obj;
}

export function pickAIText(obj){
  const walk=(v,depth=0)=>{
    if(depth>6||v==null)return '';
    if(typeof v==='string') return v.trim();
    if(Array.isArray(v)){
      for(const x of v){const r=walk(x,depth+1);if(r)return r;}
      return '';
    }
    if(typeof v!=='object')return '';
    const direct=['reply','response','output','answer','text','content','message'];
    for(const k of direct){const v2=obj[k];if(typeof v2==='string'&&v2.trim())return v2.trim();}
    if(obj.message&&typeof obj.message==='object'){const r=walk(obj.message,depth+1);if(r)return r;}
    if(obj.choices){const r=walk(obj.choices,depth+1);if(r)return r;}
    if(obj.data){const r=walk(obj.data,depth+1);if(r)return r;}
    if(obj.result){const r=walk(obj.result,depth+1);if(r)return r;}
    return '';
  };
  return walk(obj);
}
