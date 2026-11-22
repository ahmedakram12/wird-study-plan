
const APP_NAME="وِرد",TAGLINE="مذاكرتك بخطتك";
document.getElementById("brand").textContent=APP_NAME+" • "+TAGLINE;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const isoD=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const tm=t=>{const[a,b]=t.split(":");return +a*60+ +b};
const mt=m=>pad(m/60|0)+":"+pad(m%60);
const num=n=>Number(n).toLocaleString("ar-EG",{useGrouping:false});
const fT=m=>{const h=m/60|0;return num(h%12||12)+":"+num(m%60).padStart(2,"٠")+" "+(h>=12?"م":"ص")};
const fD=d=>new Date(d+"T00:00").toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long"});
const dur=m=>{const h=m/60|0,r=m%60;return((h?num(h)+" س ":"")+(r?num(r)+" د":"")).trim()||"٠"};
const days=d=>Math.round((new Date(d+"T00:00")-new Date(isoD(new Date())+"T00:00"))/864e5);
const when=d=>{const n=days(d);return n===0?"النهارده":n===1?"بكرة":n===2?"بعد يومين":"بعد "+num(n)+(n<11?" أيام":" يوم")};
const TYPES={exam:"امتحان",assignment:"تسليم",study:"مذاكرة"};
const LEN={exam:50,assignment:60,study:45};
const SIZES={s:["صغير",2],m:["متوسط",4],l:["كبير",8]};
const PH={
 exam:[["مراجعة الأفكار الأساسية","اقفل الكتاب كل شوية واحكي اللي فاكره بصوتك. التذكّر النشط أقوى بكتير من إعادة القراءة."],["حل أمثلة وأسئلة","حاول تحل قبل ما تبص على الحل، وعلّم على الغلطات عشان ترجعلها."],["اختبار ذاتي ومراجعة أخيرة","اختبر نفسك بوقت حقيقي من غير كتاب، وراجع نقط الضعف بس."]],
 assignment:[["فهم المطلوب وتجميع المصادر","اكتب المطلوب بكلماتك وقسّمه لخطوات صغيرة. الخطوة الواضحة أسهل في البدء."],["كتابة المسودة","ابدأ بمسودة مش لازم تبقى مثالية. التعديل أسهل من الصفحة البيضا."],["مراجعة وتسليم","سيب الشغل شوية وارجعله بعين جديدة، وراجع شروط التسليم قبل ما تبعت."]],
 study:[["قراءة المادة وتحديد الأفكار","حط لنفسك سؤالين قبل ما تقرا، وهتلاقي تركيزك أحسن."],["تلخيص بأسلوبك","لخّص من دماغك الأول وبعدين قارن بالكتاب. اللي بتكتبه بأسلوبك بيثبت."],["اختبر نفسك","اسأل نفسك أسئلة من غير ما تبص على الملخص، وأعد اللي نسيته."]]};
const TIPS=["نام كويس قبل الامتحان. النوم هو اللي بيثبّت المعلومات في الذاكرة، فمتسهرش عشان تذاكر.","ذاكر على جلسات قصيرة بينها راحة ٥ لـ ١٠ دقايق. تركيزك بيقل بعد حوالي ٥٠ دقيقة.","سيب الموبايل في أوضة تانية أو على وضع الطيران وقت الجلسة. مجرد وجوده قدامك بيشتت.","وزّع المذاكرة على أيام بدل ما تذاكر كله مرة واحدة. التكرار على فترات بيخلي المعلومة تفضل.","اشرح الدرس لحد (أو لنفسك قدام المراية) بكلام بسيط. لو معرفتش تشرحه يبقى لسه محتاج مراجعة.","ابدأ بالجزء الأصعب وانت لسه مركّز، وسيب الأسهل لآخر الجلسة.","اشرب مياه وكل حاجة خفيفة قبل الجلسة. الجوع والعطش بيقللوا التركيز.","اكتب أسئلة على كل جزء وانت بتذاكر، وبعد يوم جاوب عليها من غير ما تبص.","لو جلسة فاتتك، عادي جدًا. انقلها لوقت تاني وكمّل، المهم الاستمرار.","اتحرك ٥ دقايق في الاستراحة: اتمشى أو اتمطى، مش تتصفح السوشيال ميديا."];
let S;try{S=JSON.parse(localStorage.getItem("wird-plan"))}catch(e){}
S=S||{tasks:[],avail:[],sessions:[]};
const save=()=>{try{localStorage.setItem("wird-plan",JSON.stringify(S))}catch(e){}};
let ui={view:"today",draft:null,msg:"",ret:"",rs:null,ea:null,plan:null};
const uid=()=>Math.random().toString(36).slice(2,9);
const now=()=>{const d=new Date();return{d:isoD(d),m:d.getHours()*60+d.getMinutes()}};

/* theme */
const root=document.documentElement;
function theme(){let t;try{t=localStorage.getItem("theme")}catch(e){}
 const dark=t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
 if(t)root.dataset.theme=t;$("#theme").textContent=dark?"☀️ فاتح":"🌙 داكن";return dark}
$("#theme").onclick=()=>{const t=theme()?"light":"dark";try{localStorage.setItem("theme",t)}catch(e){}root.dataset.theme=t;theme()};
theme();

/* scheduling core */
const occ=(extra,ig)=>S.sessions.filter(s=>!ig.includes(s.id)).concat(extra||[]);
function free(extra,ig,maxDate){
 const n=now(),out=[];
 S.avail.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.s-b.s).forEach(a=>{
  if(a.date<n.d||(maxDate&&a.date>maxDate))return;
  let segs=[[a.s,a.e]];
  occ(extra,ig).filter(x=>x.date===a.date).forEach(x=>{segs=segs.flatMap(([s,e])=>x.e<=s||x.s>=e?[[s,e]]:[[s,x.s],[x.e,e]].filter(p=>p[1]>p[0]))});
  segs.forEach(([s,e])=>{if(a.date===n.d)s=Math.max(s,n.m);if(e>s)out.push({date:a.date,s,e})})});
 return out}
function fits(x,extra,ig){
 if(!x.date)return"اختار تاريخ الجلسة.";
 if(x.e<=x.s)return"وقت النهاية لازم يكون بعد البداية.";
 if(!S.avail.some(a=>a.date===x.date&&a.s<=x.s&&a.e>=x.e))return"الوقت ده برّه الأوقات الفاضية اللي اخترتها.";
 if(occ(extra,ig).some(o=>o.date===x.date&&o.s<x.e&&o.e>x.s))return"الوقت ده بيتعارض مع جلسة تانية.";
 return""}
function generate(d){
 const len=LEN[d.type];let need=Math.round(d.hours*60);const out=[];
 for(const seg of free([],[],d.deadline)){let c=seg.s;
  while(need>0&&seg.e-c>=20){let l=Math.min(len,seg.e-c,need);if(need-l>0&&need-l<20)l=Math.min(need,seg.e-c);
   out.push({id:uid(),date:seg.date,s:c,e:c+l,done:false});need-=l;c+=l+10}}
 const ph=PH[d.type];
 out.forEach((x,i)=>{const p=ph[Math.min(2,Math.floor(i*3/out.length))];x.step=p[0];x.tip=p[1]});
 return{sessions:out,short:need}}
const recalc=()=>{const d=ui.draft,p=ui.plan;p.short=Math.round(d.hours*60)-p.sessions.reduce((a,s)=>a+s.e-s.s,0)};

/* views */
const banner=()=>{const m=ui.msg;ui.msg="";return m?`<div class="nt w" role="status">${esc(m)}</div>`:""};
const nav=(back,label,next,txt,dis)=>`<div class="nav"><button data-a="${back}">السابق</button><span>${txt||""}</span><button class="nx" data-a="${next}" ${dis?"disabled":""}>${label}</button></div>`;
function sessRow(s,showDate){
 const t=S.tasks.find(t=>t.id===s.taskId)||{name:"",subject:""};
 const mine=S.sessions.filter(x=>x.taskId===s.taskId).sort((a,b)=>a.date.localeCompare(b.date)||a.s-b.s);
 return`<div class="card"><div class="task"><button class="ck ${s.done?"d":""}" data-a="done" data-id="${s.id}" aria-pressed="${s.done}" aria-label="${s.done?"إلغاء الإنجاز":"تحديد كمُنجَزة"}: ${esc(s.step)}">${s.done?"✓":""}</button>
 <div class="tm"><div class="tt ${s.done?"d":""}">${esc(t.subject)} — ${esc(s.step)}</div>
 <div class="mt">${esc(t.name)} · الجلسة ${num(mine.indexOf(s)+1)} من ${num(mine.length)} · ${showDate?fD(s.date)+" · ":""}${fT(s.s)}</div></div><span class="du">${dur(s.e-s.s)}</span></div>
 ${s.tip?`<div class="mt">💡 ${esc(s.tip)}</div>`:""}
 ${s.done?"":`<button class="lnk" data-a="rs" data-id="${s.id}">مقدرتش أذاكرها دلوقتي؟ نقترح وقت تاني</button>`}</div>`}
function vToday(){
 const n=now(),today=S.sessions.filter(s=>s.date===n.d).sort((a,b)=>a.s-b.s);
 const late=S.sessions.filter(s=>s.date<n.d&&!s.done);
 const dn=today.filter(s=>s.done).length,pc=today.length?Math.round(dn/today.length*100):0;
 const dl=S.tasks.filter(t=>t.deadline>=n.d).sort((a,b)=>a.deadline.localeCompare(b.deadline));
 const tip=TIPS[Math.floor(Date.now()/864e5)%TIPS.length];
 return banner()+`<div class="eyebrow">${fD(n.d)}</div><h2>خطة النهارده</h2>
 <div class="mu">${today.length?`أنجزت ${num(dn)} من ${num(today.length)}`:"مفيش جلسات النهارده"}</div>
 <div class="pr" role="progressbar" aria-label="تقدم اليوم" aria-valuenow="${pc}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pc}%"></span></div>
 ${today.map(s=>sessRow(s)).join("")}
 <button class="btn" data-a="new">+ أضف مهمة</button>
 ${late.length?`<div class="sec">جلسات محتاجة وقت جديد</div><p class="hint">مفيش مشكلة، الأيام بتتغير. اختار لها وقت جديد من أوقاتك الفاضية.</p>`+late.map(s=>sessRow(s,true)).join(""):""}
 <div class="sec">المواعيد الجاية</div>
 ${dl.length?dl.map(t=>`<div class="mt" style="font-size:13px;margin:6px 0">${TYPES[t.type]} ${esc(t.subject)} <b>•</b> ${when(t.deadline)}${t.short?`<div class="nt w">لسه ${dur(t.short)} من ${esc(t.name)} من غير وقت. تقدر تضيف وقت فاضي لما تحب.</div>`:""}</div>`).join(""):'<div class="mt">مفيش مواعيد جاية.</div>'}
 <div class="nt">💡 نصيحة النهارده: ${esc(tip)}</div>`}
function vForm(){
 const d=ui.draft;
 return banner()+`<p class="eyebrow">مهمة جديدة · ١ من ٣</p><h2>إيه المطلوب؟</h2><p class="hint">هنستخدم التفاصيل دي عشان نقترح خطة، وتقدر تعدّلها بعدين.</p>
 <label class="lb" for="f1">اسم المهمة</label><input id="f1" data-k="name" value="${esc(d.name)}" placeholder="مثال: امتحان إحصاء نصفي">
 <label class="lb" for="f2">اسم المادة</label><input id="f2" data-k="subject" value="${esc(d.subject)}" placeholder="اكتب اسم المادة">
 <div class="lb">نوع المهمة</div><div class="seg">${Object.keys(TYPES).map(k=>`<button class="${d.type===k?"on":""}" aria-pressed="${d.type===k}" data-a="ty" data-id="${k}">${TYPES[k]}</button>`).join("")}</div>
 <label class="lb" for="f3">الموعد</label><input id="f3" type="date" data-k="deadline" min="${now().d}" value="${d.deadline}">
 <div class="lb">حجم المهمة</div><div class="seg">${Object.keys(SIZES).map(k=>`<button class="${d.size===k?"on":""}" aria-pressed="${d.size===k}" data-a="sz" data-id="${k}">${SIZES[k][0]}</button>`).join("")}</div>
 <label class="lb" for="f4">أو حدد عدد ساعات المذاكرة التقريبي</label><input id="f4" type="number" min="0.5" step="0.5" data-k="hours" value="${d.hours}">
 <div class="nt">بعدها هتحدد الأوقات اللي فاضي فيها قبل الموعد.</div>`}
function vAvail(){
 const d=ui.draft,n=now(),max=d&&d.deadline,rs=ui.ret==="rs";
 const byDay={};S.avail.filter(a=>a.date>=n.d&&(!max||a.date<=max)).sort((a,b)=>a.s-b.s).forEach(a=>(byDay[a.date]=byDay[a.date]||[]).push(a));
 const ds=Object.keys(byDay).sort();
 return banner()+`<p class="eyebrow">${rs?"إضافة وقت فاضي":"مهمة جديدة · ٢ من ٣"}</p><h2>إمتى تقدر تذاكر؟</h2><p class="hint">اختار الأوقات الفاضية فعلًا${max?" لحد "+fD(max):""}. كل يوم ممكن يكون مختلف.</p>
 ${ds.map(k=>`<div class="card"><div class="row sp"><b>${fD(k)}</b><span class="mt">${dur(byDay[k].reduce((a,x)=>a+x.e-x.s,0))} متاحة</span></div>
 <div class="row" style="margin-top:8px">${byDay[k].map(a=>`<button class="chip ${ui.ea===a.id?"on":""}" data-a="ea" data-id="${a.id}" aria-label="تعديل فترة ${fT(a.s)} إلى ${fT(a.e)}">${fT(a.s)} – ${fT(a.e)}</button>`).join("")}</div>
 ${byDay[k].filter(a=>a.id===ui.ea).map(a=>`<div class="row" style="margin-top:8px"><input type="time" aria-label="من" data-av="${a.id}" data-p="s" value="${mt(a.s)}"><input type="time" aria-label="إلى" data-av="${a.id}" data-p="e" value="${mt(a.e)}"><button class="lnk" data-a="delAv" data-id="${a.id}">حذف</button></div>`).join("")}</div>`).join("")||'<div class="mt">لسه ما أضفتش أي وقت.</div>'}
 <div class="card"><b>+ أضف يومًا أو وقتًا</b><label class="lb" for="ad">اليوم</label><input id="ad" type="date" min="${n.d}" ${max?`max="${max}"`:""} value="${max&&n.d>max?max:n.d}">
 <div class="row"><div style="flex:1"><label class="lb" for="as">من</label><input id="as" type="time" value="16:00"></div><div style="flex:1"><label class="lb" for="ae">إلى</label><input id="ae" type="time" value="18:00"></div></div>
 <button class="sb" data-a="addAv">أضف الفترة دي</button></div>
 <div class="nt">الأوقات دي مش هتتكرر تلقائيًا كل أسبوع.</div>`}
function vReview(){
 const d=ui.draft,p=ui.plan;
 return banner()+`<p class="eyebrow">مهمة جديدة · ٣ من ٣</p><h2>اقتراح خطتك</h2><p class="hint">وزّعنا الجلسات على الأوقات اللي اخترتها. راجعها وعدّل اللي تحبه قبل الاعتماد.</p>
 <div class="nt">${TYPES[d.type]} ${esc(d.subject)} · ${esc(d.name)} · ${fD(d.deadline)}<br>${num(p.sessions.length)} جلسات · ${dur(p.sessions.reduce((a,s)=>a+s.e-s.s,0))} من ${dur(Math.round(d.hours*60))}</div>
 ${p.short>0?`<div class="nt w"><b>الأوقات اللي اخترتها مش كفاية.</b> ناقص ${dur(p.short)}. تحب:<div class="row" style="margin-top:8px"><button class="chip" data-a="addTime">أضيف وقت فاضي</button><button class="chip" data-a="editEst">أعدّل التقدير</button><button class="chip" data-a="accept">أعتمد خطة جزئية</button></div></div>`:""}
 ${p.sessions.map((s,i)=>`<div class="card"><div class="row sp"><b>جلسة ${num(i+1)}</b><button class="lnk" data-a="delS" data-id="${s.id}">حذف</button></div>
 <label class="lb" style="margin-top:4px" for="d${i}">اليوم</label><input id="d${i}" type="date" data-ps="${s.id}" data-p="date" min="${now().d}" max="${d.deadline}" value="${s.date}">
 <div class="row"><input type="time" aria-label="بداية الجلسة" data-ps="${s.id}" data-p="s" value="${mt(s.s)}"><input type="time" aria-label="نهاية الجلسة" data-ps="${s.id}" data-p="e" value="${mt(s.e)}"></div>
 <label class="lb" for="st${i}">المطلوب في الجلسة</label><input id="st${i}" data-ps="${s.id}" data-p="step" value="${esc(s.step)}">
 <div class="mt">${dur(s.e-s.s)} · ${fD(s.date)}</div><div class="mt">💡 ${esc(s.tip)}</div></div>`).join("")||'<div class="mt">مفيش جلسات مقترحة. أضف وقت فاضي.</div>'}
 <button class="sb" data-a="addTime">عدّل أوقاتك الفاضية</button>
 <div class="nt">💡 استرح ٥ لـ ١٠ دقايق بين الجلسات، وخلّي آخر ساعة قبل النوم للراحة مش للمذاكرة.</div>`}
function vRs(){
 const r=ui.rs,s=S.sessions.find(x=>x.id===r.sid),t=S.tasks.find(x=>x.id===s.taskId),c=r.c[r.i];
 return banner()+`<div class="eyebrow">متابعة الجلسة</div><h2>جلسة ما حصلتش؟</h2><p class="hint">لو يومك اتغير، نقترح وقت جديد من الأوقات اللي اخترتها.</p>
 <div class="card"><b>${esc(t.subject)} — ${esc(s.step)}</b><div class="mt">${fD(s.date)} · ${fT(s.s)} · ${dur(s.e-s.s)}</div></div>
 <div class="nt w">مفيش تغيير في خطتك لحد ما تأكد.</div>
 ${c?`<div class="card"><div class="mt">الموعد المقترح (من وقت فاضي اخترته):</div><b>${fD(c.date)} · ${fT(c.s)}–${fT(c.e)}</b></div>
 <div class="row">${r.c.length>1?'<button class="sb" style="flex:1" data-a="nextC">اقتراح تاني</button><button class="sb" style="flex:1" data-a="pickC">أختار بنفسي</button>':""}</div>
 ${r.pick?`<div class="row" style="margin-top:8px">${r.c.slice(0,10).map((x,i)=>`<button class="chip ${i===r.i?"on":""}" data-a="selC" data-id="${i}">${fD(x.date)} ${fT(x.s)}</button>`).join("")}</div>`:""}`
 :`<div class="nt w">مفيش وقت فاضي متبقي بيكفي الجلسة دي (${dur(s.e-s.s)}). تقدر تضيف وقت فاضي جديد وتجرب تاني.</div><button class="btn" data-a="avRs">أضف وقت فاضي</button>`}`}
function render(){
 const v=ui.view;$("#v").innerHTML={today:vToday,form:vForm,avail:vAvail,review:vReview,rs:vRs}[v]();
 const p=ui.plan;
 $("#nav").innerHTML=v==="form"?nav("home","التالي","toAvail","الخطوة ١ من ٣")
  :v==="avail"?nav(ui.ret==="rs"?"rs2":"back",ui.ret==="rs"?"جرّب تاني":"اقترح الخطة",ui.ret==="rs"?"rs2":"plan","")
  :v==="review"?nav("addTime","اعتمد الخطة","accept","",!(p.sessions.length&&p.short<=0))
  :v==="rs"?nav("home","أكّد النقل","confirmRs","",!ui.rs.c[ui.rs.i]):"";
 window.scrollTo(0,0)}

/* actions */
const go=(v,m)=>{ui.view=v;ui.msg=m||"";render()};
function candidates(sid){const s=S.sessions.find(x=>x.id===sid),d=s.e-s.s;
 return free([],[sid]).filter(f=>f.e-f.s>=d&&!(f.date===s.date&&f.s===s.s)).map(f=>({date:f.date,s:f.s,e:f.s+d}))}
const A={
 home:()=>{ui.draft=null;ui.ret="";go("today")},
 new:()=>{ui.draft={name:"",subject:"",type:"exam",deadline:"",size:"m",hours:4};ui.ret="";go("form")},
 ty:k=>{ui.draft.type=k;go("form")},
 sz:k=>{ui.draft.size=k;ui.draft.hours=SIZES[k][1];go("form")},
 toAvail:()=>{const d=ui.draft;
  if(!d.name.trim()||!d.subject.trim())return go("form","اكتب اسم المهمة والمادة الأول.");
  if(!d.deadline||d.deadline<now().d)return go("form","اختار موعد لسه ما فاتش.");
  if(!(+d.hours>=0.5))return go("form","قدّر حجم المهمة نص ساعة على الأقل.");
  d.hours=+d.hours;ui.ret="";go("avail")},
 back:()=>go("form"),
 ea:id=>{ui.ea=ui.ea===id?null:id;render()},
 addAv:()=>{const date=$("#ad").value,s=$("#as").value,e=$("#ae").value;
  if(!date||!s||!e)return go("avail","كمّل اليوم والوقت.");
  const a={id:uid(),date,s:tm(s),e:tm(e)};
  if(a.e<=a.s)return go("avail","وقت النهاية لازم يكون بعد البداية.");
  if(ui.draft&&date>ui.draft.deadline)return go("avail","اليوم ده بعد الموعد.");
  if(S.avail.some(x=>x.date===date&&x.s<a.e&&x.e>a.s))return go("avail","الفترة دي بتتداخل مع فترة تانية في نفس اليوم.");
  S.avail.push(a);save();go("avail")},
 delAv:id=>{const i=S.avail.findIndex(a=>a.id===id),a=S.avail[i];S.avail.splice(i,1);
  if(S.sessions.some(x=>x.date===a.date&&!x.done&&!S.avail.some(v=>v.date===x.date&&v.s<=x.s&&v.e>=x.e))){S.avail.splice(i,0,a);return go("avail","مينفعش تحذف فترة فيها جلسة مجدولة. انقل الجلسة الأول.")}
  ui.ea=null;save();go("avail")},
 plan:()=>{ui.plan=generate(ui.draft);go("review")},
 addTime:()=>{ui.ret="";go("avail")},
 editEst:()=>go("form","عدّل التقدير أو الموعد وكمّل."),
 delS:id=>{ui.plan.sessions=ui.plan.sessions.filter(s=>s.id!==id);recalc();go("review")},
 accept:()=>{const d=ui.draft,t={id:uid(),name:d.name.trim(),subject:d.subject.trim(),type:d.type,deadline:d.deadline,hours:d.hours,short:Math.max(0,ui.plan.short)};
  S.tasks.push(t);ui.plan.sessions.forEach(s=>S.sessions.push({...s,taskId:t.id}));save();ui.draft=null;go("today","تمت إضافة الخطة. تقدر تعدّلها أو تنقل أي جلسة وقت ما تحب.")},
 done:id=>{const s=S.sessions.find(s=>s.id===id);s.done=!s.done;save();go("today")},
 rs:id=>{ui.rs={sid:id,c:candidates(id),i:0,pick:false};go("rs")},
 rs2:()=>{ui.ret="";ui.rs.c=candidates(ui.rs.sid);ui.rs.i=0;go("rs")},
 avRs:()=>{ui.ret="rs";ui.draft=null;go("avail")},
 nextC:()=>{ui.rs.i=(ui.rs.i+1)%ui.rs.c.length;go("rs")},
 pickC:()=>{ui.rs.pick=!ui.rs.pick;go("rs")},
 selC:i=>{ui.rs.i=+i;go("rs")},
 confirmRs:()=>{const r=ui.rs,c=r.c[r.i],s=S.sessions.find(x=>x.id===r.sid);
  if(fits(c,[],[r.sid]))return A.rs2();
  Object.assign(s,{date:c.date,s:c.s,e:c.e});save();ui.rs=null;go("today","تم نقل الجلسة للموعد الجديد.")}
};
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(b&&!b.disabled)A[b.dataset.a](b.dataset.id)});
document.addEventListener("input",e=>{const t=e.target,k=t.dataset.k;if(k&&ui.draft){ui.draft[k]=t.value;if(k==="hours")ui.draft.size=""}
 if(t.dataset.ps&&t.dataset.p==="step")ui.plan.sessions.find(s=>s.id===t.dataset.ps).step=t.value});
document.addEventListener("change",e=>{const t=e.target;
 if(t.dataset.av){const a=S.avail.find(x=>x.id===t.dataset.av),old={...a};a[t.dataset.p]=tm(t.value);
  const bad=a.e<=a.s||S.avail.some(x=>x!==a&&x.date===a.date&&x.s<a.e&&x.e>a.s)||S.sessions.some(x=>x.date===a.date&&!x.done&&!S.avail.some(v=>v.date===x.date&&v.s<=x.s&&v.e>=x.e));
  if(bad){Object.assign(a,old);return go("avail","مش هينفع التعديل ده: فيه تداخل أو جلسة مجدولة جوّه الفترة.")}save();go("avail")}
 if(t.dataset.ps&&t.dataset.p!=="step"){const s=ui.plan.sessions.find(x=>x.id===t.dataset.ps),old={...s};
  s[t.dataset.p]=t.dataset.p==="date"?t.value:tm(t.value);
  const err=fits(s,ui.plan.sessions.filter(x=>x!==s),[]);
  if(err){Object.assign(s,old);return go("review",err)}recalc();go("review")}});
go("today");
