// KING VANDYZ — Zyvor catalog. Field definitions are tailored per tool so the UI is usable.
const p=(name,required=false,extra={})=>({name,required,in:'query',type:'string',...extra});
const img=(name,required=false)=>p(name,required,{format:'uri'});
const num=(name,required=false)=>p(name,required,{type:'number'});
const choices=(name,values,required=true)=>p(name,required,{enum:values});
const text=(name,endpoint,description,params=[],extra={})=>({id:endpoint.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,''),name,description,category:'maker',endpoint,method:'GET',params,required:params.filter(x=>x.required).map(x=>x.name),responseType:'json',free:true,ui:'maker',...extra});
const ranks=['Warrior','Elite','Master','Grandmaster','Epic','Legend','Mythic','Glory','imo'];
const lobbies=Array.from({length:30},(_,i)=>String(i+1));
const maker=[
 text('Saldo DANA','/api/maker/saldo-dana','Buat mockup saldo DANA.',[num('saldo',true)],{responseType:'image',ui:'image'}),
 text('Saldo GoPay','/api/maker/saldo-gopay','Buat mockup saldo GoPay.',[num('saldo',true)],{responseType:'image',ui:'image'}),
 text('Saldo OVO','/api/maker/saldo-ovo','Buat mockup saldo OVO.',[num('saldo',true)],{responseType:'image',ui:'image'}),
 text('Sertifikat NASA','/api/maker/sertifikat-nasa','Buat desain sertifikat bertema NASA.',[p('nama',true)],{responseType:'image',ui:'image'}),
 text('Text Video','/api/maker/textvideo','Buat video teks dari isi yang kamu masukkan.',[p('text',true),p('username'),p('title'),p('duration')],{responseType:'video',ui:'video'}),
 text('TTQC','/api/maker/ttqc','Buat kartu chat bergaya TikTok quote.',[p('username',true),p('text',true),p('reply'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Two Buttons','/api/maker/twobuttons','Buat desain dengan dua tombol.',[p('title',true),p('button1',true),p('button2',true),p('subtitle'),img('image')],{responseType:'image',ui:'image'}),
 text('Post IG','/api/maker/post-ig','Buat mockup posting Instagram.',[p('username',true),p('caption',true),num('likes'),num('comments'),img('avatar'),img('image')],{responseType:'image',ui:'image'}),
 text('Profile JSON','/api/maker/profilejson','Buat kartu profil dari data profil.',[p('name',true),p('username',true),p('bio'),num('followers'),num('following'),num('posts'),img('avatar')],{responseType:'image',ui:'image'}),
 text('QCWA','/api/maker/qcwa','Buat kartu quote chat WhatsApp.',[p('name',true),p('message',true),p('reply'),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Quote Card','/api/maker/quotecard','Buat kartu quote.',[p('text',true),p('author'),p('title'),choices('background',['1','2','3','4','5','6','7','8'])],{responseType:'image',ui:'image'}),
 text('Quotes Anime','/api/maker/quotes-anime','Buat quote card anime.',[p('text',true),p('username'),choices('background',['1','2','3','4','5','6','7','8']),img('avatar')],{responseType:'image',ui:'image'}),
 text('Resize','/api/maker/resize','Ubah ukuran gambar dari URL publik.',[img('url',true),num('width',true),num('height',true)],{responseType:'image',ui:'image'}),
 text('IQC Dark','/api/maker/iqc-dark','Buat kartu IQC tema dark.',[p('text',true),p('author',true)],{responseType:'image',ui:'image'}),
 text('IQC Pink','/api/maker/iqc-pink','Buat kartu IQC tema pink.',[p('text',true),p('author',true)],{responseType:'image',ui:'image'}),
 {...text('IQC','/api/maker/iqc','Buat kartu IQC.',[p('text',true),p('author',true)],{responseType:'image',ui:'image'}),method:'POST'},
 text('Jarvis Meme','/api/maker/jarvis-meme','Buat meme Jarvis.',[p('text',true),p('username'),img('image')],{responseType:'image',ui:'image'}),
 text('Motivasi','/api/maker/motivasi','Buat kartu motivasi.',[p('text',true),p('author'),choices('background',['1','2','3','4','5','6','7','8'])],{responseType:'image',ui:'image'}),
 text('Nulis','/api/maker/nulis','Buat gambar tulisan tangan.',[p('text',true),p('name'),choices('background',['1','2','3','4','5'])],{responseType:'image',ui:'image'}),
 text('Fake IG Profile','/api/maker/fakeigprofile','Mockup profil Instagram.',[p('name',true),p('username',true),p('bio'),num('followers'),num('following'),num('posts'),img('avatar'),img('cover')],{responseType:'image',ui:'image'}),
 text('Fake IG Profile V2','/api/maker/fakeigprofilev2','Mockup profil Instagram versi 2.',[p('name',true),p('username',true),p('bio'),num('followers'),num('following'),num('posts'),img('avatar'),img('cover')],{responseType:'image',ui:'image'}),
 text('Fake Note','/api/maker/fakenote','Mockup note/status singkat.',[p('username',true),p('text',true),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Notification','/api/maker/fakenotif','Mockup notifikasi.',[p('app',true),p('title',true),p('message',true),p('time'),img('icon')],{responseType:'image',ui:'image'}),
 text('Fake WhatsApp Notification','/api/maker/fakenotifwa','Mockup notifikasi WhatsApp.',[p('name',true),p('message',true),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('IG Story','/api/maker/igstory','Mockup Instagram Story.',[p('username',true),p('text'),img('image',true),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Call Android','/api/maker/fakecall-andro','Mockup panggilan masuk Android.',[p('name',true),p('number'),p('status'),p('duration'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Call iOS','/api/maker/fakecall-ios','Mockup panggilan masuk iOS.',[p('name',true),p('number'),p('status'),p('duration'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Chat','/api/maker/fakech','Mockup percakapan chat.',[p('name',true),p('message',true),p('reply'),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Developer','/api/maker/fakedev','Mockup profil developer.',[p('name',true),p('username',true),p('bio'),p('github'),num('followers'),num('following'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Group Chat','/api/maker/fakegc','Mockup grup chat.',[p('group',true),p('name',true),p('message',true),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Instagram','/api/maker/fakeig','Mockup screenshot Instagram.',[p('username',true),p('name'),p('caption'),num('likes'),num('comments'),img('avatar'),img('image')],{responseType:'image',ui:'image'}),
 text('Fake FF Profile','/api/maker/fake-profile-ff','Mockup profil/lobby Free Fire.',[p('username',true),choices('lobby',lobbies,true)],{responseType:'image',ui:'image'}),
 text('Fake Telegram','/api/maker/fake-tele','Mockup chat Telegram.',[p('name',true),p('username'),p('message',true),p('time'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Tweet','/api/maker/fake-tweet','Mockup postingan tweet.',[p('name',true),p('username',true),p('text',true),num('likes'),num('retweets'),num('replies'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake BCA','/api/maker/fakebca','Mockup dashboard mobile banking BCA.',[p('name',true),p('account'),num('balance',true),p('accountNumber'),p('date'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Fake Board','/api/maker/fakeboard','Mockup board/profil.',[p('name',true),p('username'),p('title'),p('text'),img('avatar'),img('image')],{responseType:'image',ui:'image'}),
 text('Fake Book','/api/maker/fakebook','Mockup buku/post.',[p('name',true),p('title',true),p('text'),img('cover'),img('avatar')],{responseType:'image',ui:'image'}),
 text('Bounty','/api/maker/bounty','Buat kartu bounty.',[p('name',true),p('title',true),p('description'),num('reward'),p('status'),img('image')],{responseType:'image',ui:'image'}),
 text('E-KTP','/api/maker/ektp','Mockup kartu identitas untuk desain/demo.',[p('name',true),p('nik'),p('birthPlace'),p('birthDate'),p('gender'),p('address'),p('religion'),p('maritalStatus'),p('occupation')],{responseType:'image',ui:'image'}),
 text('Fake ML Affinity','/api/maker/fake-afinitas-ml','Mockup affinity Mobile Legends.',[p('name',true),p('partner'),choices('level',['1','2','3','4','5','6','7','8','9','10']),img('avatar'),img('partnerAvatar')],{responseType:'image',ui:'image'}),
 text('Fake FF','/api/maker/fake-ff','Mockup profil/lobby Free Fire.',[p('username',true),choices('lobby',lobbies,true)],{responseType:'image',ui:'image'}),
 text('Fake ML','/api/maker/fake-ml','Mockup profil Mobile Legends.',[p('username',true),choices('rank',ranks,true),choices('border',['1','2','3','4','5'],true)],{responseType:'image',ui:'image'}),
 text('Fake Nokia','/api/maker/fake-nokia','Mockup layar Nokia.',[p('name',true),p('message',true),p('number'),p('time'),img('avatar')],{responseType:'image',ui:'image'})
];
const fun=[
 {id:'anime-quotes',name:'Anime Quotes',description:'Get an anime quote.',category:'fun',endpoint:'/api/fun/anime-quotes',method:'GET',params:[],required:[],responseType:'json',free:true,ui:'quote'},
 {id:'philosopher-quotes',name:'Philosopher Quotes',description:'Get a philosopher quote.',category:'fun',endpoint:'/api/fun/philosopher-quotes',method:'GET',params:[],required:[],responseType:'json',free:true,ui:'quote'},
 {id:'tikboost',name:'TikBoost',description:'TikTok utility endpoint.',category:'fun',endpoint:'/api/fun/tikboost',method:'GET',params:[p('url',true,{format:'uri'})],required:['url'],responseType:'json',free:true,ui:'generic'},
 {id:'tiktokview',name:'TikTok View',description:'TikTok view utility endpoint.',category:'fun',endpoint:'/api/fun/tiktokview',method:'GET',params:[p('url',true,{format:'uri'})],required:['url'],responseType:'json',free:true,ui:'generic'},
 {id:'tiktokviewstatus',name:'TikTok View Status',description:'Check TikTok view task status.',category:'fun',endpoint:'/api/fun/tiktokviewstatus',method:'GET',params:[p('id',true)],required:['id'],responseType:'json',free:true,ui:'generic'},
 {id:'reach-ch',name:'React Channel',description:'Kirim reaksi emoji otomatis ke postingan WhatsApp Channel melalui Zyvor.',category:'fun',endpoint:'/api/fun/reach-ch',method:'GET',params:[p('url',true,{format:'uri',description:'URL postingan WhatsApp Channel yang ingin diberi reaksi.'}),p('emoji',false,{description:'Emoji bebas. Bisa satu emoji atau beberapa emoji dipisahkan koma, contoh: ❤️,🌹,😛.'})],required:['url'],responseType:'json',free:true,ui:'react-channel'}
];

const anime=[
  {
    id:'anime-animeav1',
    name:'AnimeAV1',
    description:'Streaming & katalog anime: home, search, detail, jadwal, dan episode.',
    category:'anime',
    endpoint:'/api/anime/animeav1',
    method:'GET',
    params:[
      p('action',true,{enum:['home','search','catalog','schedule','detail','stream']}),
      p('query',false,{description:'Untuk action search — isi judul anime yang ingin dicari.'}),
      p('slug',false,{description:'Untuk action detail/stream — isi slug anime dari hasil pencarian.'}),
      p('episode',false,{description:'Untuk action stream — isi nomor episode.'}),
      p('page',false,{description:'Nomor halaman katalog jika tersedia.'}),
      p('order',false,{description:'Urutan hasil katalog jika endpoint mendukungnya.'})
    ],
    required:['action'],
    responseType:'json',
    free:true,
    ui:'anime',
    guide:{
      eyebrow:'ANIME STREAMING & CATALOG',
      title:'Cara memakai AnimeAV1',
      intro:'Pilih action sesuai kebutuhan. Field tambahan hanya diisi jika diperlukan oleh action tersebut.',
      steps:[
        'Home — tampilkan data/home anime.',
        'Search — isi Query dengan judul anime yang dicari.',
        'Detail — isi Slug dari item anime yang ditemukan.',
        'Stream — isi Slug dan Episode untuk meminta data episode.',
        'Catalog / Schedule — gunakan Page atau Order bila ingin mengatur hasil.'
      ],
      tip:'Mulai dari Search untuk menemukan slug, lalu gunakan Detail atau Stream.'
    }
  }
];

const hdvideo=[
{id:'hdvideo-ai-upscale-video',name:'AI Upscale Video',description:'Upscale video sampai 4K menggunakan layanan HD Video Zyvor.',category:'hd-video',endpoint:'/api/hdvidio/ai-upscale-video',method:'GET',params:[{name:'video',required:true,in:'body',type:'file',accept:'video/*',description:'Pilih video dari galeri. Web akan mengunggahnya sementara agar Zyvor menerima direct URL secara otomatis.'}],required:['video'],responseType:'video',free:true,ui:'hdvideo',autoUpload:true,guide:{eyebrow:'AI UPSCALE',title:'Pilih video dari galeri',intro:'Nggak perlu mencari URL sendiri. Pilih video dari HP, lalu web akan membuat direct URL sementara untuk dikirim ke Zyvor.',steps:['Tekan Pilih Video dan ambil video dari galeri/file manager.','Web mengunggah file ke penyimpanan sementara dan mendapatkan direct URL.','URL tersebut otomatis dikirim ke endpoint AI Upscale Zyvor.','Tunggu sampai hasil upscale selesai lalu download hasilnya.'],tip:'Video perlu diunggah ke URL publik sementara karena endpoint AI Upscale Zyvor menggunakan parameter URL.'}},
{id:'hdvideo-tohd',name:'To HD Video',description:'Enhance video dengan FPS, resolusi, quality, enhance, denoise, dan stabilize.',category:'hd-video',endpoint:'/api/hdvidio/tohd',method:'POST',params:[{name:'video',required:true,in:'body',type:'file',accept:'video/*',description:'Pilih file video langsung dari galeri/file manager.'},num('fps',false,{in:'body',description:'FPS output, contoh 30.'}),choices('resolution',['720p','1080p','1440p','2160p'],false),num('quality',false,{in:'body',description:'Kualitas output, contoh 90.'}),choices('enhance',['yes','no'],false),choices('denoise',['yes','no'],false),choices('stabilize',['yes','no'],false),choices('format',['mp4','webm'],false)],required:['video'],responseType:'video',free:true,ui:'hdvideo',guide:{eyebrow:'TO HD',title:'Upload video dari perangkat',intro:'Tool ini meminta file video langsung, bukan URL.',steps:['Tekan Pilih File dan pilih video dari galeri/file manager.','Atur FPS, resolution, quality, enhance, denoise, dan stabilize bila perlu.','Pilih format output.','Tekan RUN TOOL dan tunggu hasilnya.'],tip:'Gunakan video pendek dulu untuk pengujian supaya proses lebih cepat.'}},
{id:'hdvideo-wink-hd-video',name:'Wink HD Video',description:'Enhance/upscale video menggunakan endpoint Wink HD Video Zyvor.',category:'hd-video',endpoint:'/api/hdvidio/wink-hd-video',method:'POST',params:[{name:'video',required:true,in:'body',type:'file',accept:'video/*',description:'Pilih video dari galeri. Web akan mengunggahnya sementara dan otomatis mengirim direct URL ke Zyvor.'}],required:['video'],responseType:'video',free:true,ui:'hdvideo',autoUpload:true,guide:{eyebrow:'WINK HD VIDEO',title:'Pilih video dari galeri',intro:'Cukup pilih file video dari HP. Web menangani URL sementara secara otomatis.',steps:['Tekan Pilih Video dan pilih video dari galeri/file manager.','Web membuat direct URL sementara dari file tersebut.','URL otomatis dikirim ke endpoint Wink HD Video Zyvor.','Tunggu hasil enhancement/upscale lalu download hasilnya.'],tip:'Jangan masukkan link TikTok/Instagram/YouTube halaman biasa. Pilih file videonya langsung.'}}
];
const stalker=[
{id:'stalker-tiktok',name:'TikTok Stalker',description:'Get TikTok user profile with automatic session management.',category:'stalker',endpoint:'/api/stalker/tiktok',method:'GET',params:[p('username',true,{description:'Username TikTok tanpa @.'})],required:['username'],responseType:'json',free:true,ui:'stalker'},
{id:'stalker-whatsapp',name:'WhatsApp Stalker',description:'Stalk informasi WhatsApp Channel & WhatsApp Group melalui link.',category:'stalker',endpoint:'/api/stalker/whatsapp',method:'GET',params:[p('url',true,{format:'uri',description:'Link WhatsApp Channel atau WhatsApp Group yang ingin diperiksa.'})],required:['url'],responseType:'json',free:true,ui:'stalker'},
{id:'stalker-x',name:'X / Twitter Stalker',description:'Ambil detail tweet X/Twitter lengkap dengan reply, media, dan entities.',category:'stalker',endpoint:'/api/stalker/x',method:'GET',params:[p('url',true,{format:'uri',description:'Link tweet/post X yang ingin diperiksa.'})],required:['url'],responseType:'json',free:true,ui:'stalker'},
{id:'stalker-youtube',name:'YouTube Stalker',description:'Get detailed YouTube channel profile info including latest videos.',category:'stalker',endpoint:'/api/stalker/youtube',method:'GET',params:[p('url',true,{format:'uri',description:'Link channel YouTube yang ingin diperiksa.'})],required:['url'],responseType:'json',free:true,ui:'stalker'},
{id:'stalker-instagram',name:'Instagram Stalker',description:'Stalker & analitik profil Instagram lengkap.',category:'stalker',endpoint:'/api/stalker/instagram',method:'GET',params:[p('username',true,{description:'Username Instagram tanpa @.'})],required:['username'],responseType:'json',free:true,ui:'stalker'}
];

const developerExtras=[
  {
    id:'tools-web2apk',
    name:'Web to APK',
    description:'Konversi website menjadi aplikasi Android melalui Zyyvor.',
    category:'developer',
    endpoint:'/api/tools/web2apk',
    method:'GET',
    params:[
      p('url',true,{format:'uri',description:'URL website lengkap, contoh: https://example.com'}),
      p('appName',true,{description:'Nama aplikasi Android yang akan dibuat.'}),
      img('icon',true),
      p('packageName',false,{description:'Package ID Android, contoh: com.vandyz.app'})
    ],
    required:['url','appName','icon'],
    responseType:'json',
    free:true,
    ui:'web2apk',
    guide:{
      eyebrow:'ANDROID APP BUILDER',
      title:'Cara membuat APK dari website',
      intro:'Isi 3 field wajib lalu jalankan. Package Name bersifat opsional dan bisa dibiarkan kosong jika layanan membuatnya otomatis.',
      steps:[
        'URL — masukkan alamat website lengkap dan pastikan bisa dibuka.',
        'App Name — masukkan nama yang ingin tampil di Android.',
        'Icon — masukkan URL gambar icon yang bisa diakses publik.',
        'Package Name — opsional, gunakan format seperti com.vandyz.app.',
        'Tekan RUN TOOL dan tunggu sampai API mengembalikan hasil/link APK.'
      ],
      tip:'Gunakan URL HTTPS dan icon PNG/JPG publik agar proses lebih mudah diproses.'
    }
  }
];

const bypass=['bypasslink','bypasslinkv2','bypasslinkv3','modjall','move2link'].map(x=>({id:`bypass-${x}`,name:x==='move2link'?'Move2Link':x==='modjall'?'ModJall':x==='bypasslink'?'Bypass Link':x==='bypasslinkv2'?'Bypass Link V2':'Bypass Link V3',description:'Bypass shortlink/safelink service.',category:'bypass',endpoint:`/api/bypass/${x}`,method:'GET',params:[p('url',true,{format:'uri'})],required:['url'],responseType:'json',free:true,ui:'bypass'}));
const downloader=['9xbuddy','allinone','allinonev2','allinonev3','spotify','terabox','tiktok','tiktokio','tiktokv2','tiktokv3','pinterest'].map(x=>({id:`downloader-${x}`,name:x==='9xbuddy'?'9xbuddy':x==='allinone'?'All-in-One':x==='allinonev2'?'All-in-One V2':x==='allinonev3'?'All-in-One V3':x==='spotify'?'Spotify':x==='terabox'?'TeraBox':x==='tiktokio'?'TikTok IO':x==='tiktokv2'?'TikTok V2':x==='tiktokv3'?'TikTok V3':x==='pinterest'?'Pinterest':'TikTok',description:'Media downloader — masukkan URL sumber.',category:'download',endpoint:`/api/downloader/${x}`,method:'GET',params:[p('url',true,{format:'uri'})],required:['url'],responseType:'json',free:true,ui:'downloader'}));
const ai=[{id:'ai-chat',name:'VANNDY AI',description:'AI chat endpoint dengan percakapan berkelanjutan.',category:'ai',endpoint:'/api/ai/aichatting',method:'POST',params:[p('text',true,{in:'body',description:'Pesan yang ingin dikirim. Riwayat percakapan dikelola oleh aplikasi.'})],required:['text'],responseType:'json',free:true,ui:'ai'}];
const developer=[{id:'qr',name:'QR Generator',description:'Generate a QR code.',category:'developer',endpoint:'/api/developer/qr',method:'GET',params:[p('text',true)],required:['text'],responseType:'image',free:true,ui:'qr'}];
const search=[{id:'pinterest-search',name:'Pinterest Search',description:'Search Pinterest.',category:'search',endpoint:'/api/search/pinterest',method:'GET',params:[p('query',true)],required:['query'],responseType:'json',free:true,ui:'search'},{id:'spotify-search',name:'Spotify Search',description:'Search Spotify.',category:'search',endpoint:'/api/search/spotify',method:'GET',params:[p('query',true)],required:['query'],responseType:'json',free:true,ui:'search'}];
export const KNOWN_TOOLS=[...maker,...fun,...anime,...hdvideo,...stalker,...developerExtras,...bypass,...downloader,...ai,...developer,...search];
export const LOCAL_TOOLS=[];
