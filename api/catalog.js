import { KNOWN_TOOLS } from '../src/data/catalog.js';
export default async function handler(req,res){
  res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify({ok:true,source:'KING-VANDYZ curated Zyvor migration catalog',upstream:process.env.API_BASE_URL||'https://api.zyvor.my.id',count:KNOWN_TOOLS.length,tools:KNOWN_TOOLS}));
}
