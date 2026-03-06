
import { useState, useMemo } from “react”;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// データ定義
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SCHOOLS = [
“那覇市立首里中学校”,“那覇市立小禄中学校”,“那覇市立銘苅中学校”,
“浦添市立浦添中学校”,“浦添市立港川中学校”,“沖縄市立コザ中学校”,
“沖縄市立美里中学校”,“宜野湾市立大山中学校”,“宜野湾市立普天間中学校”,
“豊見城市立豊見城中学校”,“名護市立名護中学校”,“うるま市立具志川中学校”,
“糸満市立糸満中学校”,“南城市立大里中学校”,“読谷村立読谷中学校”,
];
const SUBJECTS = [“国語”,“数学”,“英語”,“理科”,“社会”];
const GRADES = [“1年生”,“2年生”,“3年生”];
const YEARS = [“2024年度”,“2023年度”,“2022年度”,“2021年度”,“2020年度”];
const TERMS = [“1学期中間”,“1学期期末”,“2学期中間”,“2学期期末”,“3学期期末”];
const ADMIN_PASSWORD = “okinawa2024”;

function generateExams() {
const exams = []; let id = 1;
YEARS.forEach(year => SCHOOLS.slice(0,8).forEach(school =>
GRADES.forEach(grade => SUBJECTS.forEach(subject => {
TERMS.slice(0, Math.floor(Math.random()*3)+2).forEach(term => {
exams.push({ id:id++, year, school, grade, subject, term,
pages: Math.floor(Math.random()*4)+2,
problems: Math.floor(Math.random()*20)+10,
hasAnswer: Math.random()>0.3,
status: “公開” });
});
}))));
return exams;
}

const SEED_EXAMS = generateExams();

const SEED_POSTS = [
{ id: 1, user: “保護者A”, school: “那覇市立首里中学校”, subject: “数学”, year: “2024年度”, term: “1学期中間”, date: “2026-03-01”, status: “承認待ち” },
{ id: 2, user: “中学生B”, school: “浦添市立港川中学校”, subject: “英語”, year: “2023年度”, term: “2学期期末”, date: “2026-03-02”, status: “承認待ち” },
{ id: 3, user: “塾講師C”, school: “沖縄市立美里中学校”, subject: “理科”, year: “2024年度”, term: “1学期期末”, date: “2026-03-03”, status: “承認済み” },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 広告枠コンポーネント
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AdBanner({ size = “leaderboard”, label }) {
const h = size === “rectangle” ? 250 : 90;
const desc = size === “rectangle” ? “336×280 レクタングル” : “320×100 インライン”;
return (
<div style={{ width:“100%”, height:h, background:“linear-gradient(135deg,#f8fafc,#f1f5f9)”, border:“1.5px dashed #cbd5e1”, borderRadius:12, display:“flex”, flexDirection:“column”, alignItems:“center”, justifyContent:“center”, position:“relative”, overflow:“hidden”, margin:“8px 0” }}>
<div style={{ position:“absolute”, inset:0, backgroundImage:“radial-gradient(circle at 20% 50%,#e0f2fe,transparent 50%),radial-gradient(circle at 80% 50%,#f0fdf4,transparent 50%)”, opacity:0.7 }} />
<div style={{ position:“relative”, zIndex:1, textAlign:“center” }}>
<div style={{ display:“inline-block”, background:”#e2e8f0”, color:”#64748b”, fontSize:10, fontWeight:700, padding:“2px 8px”, borderRadius:4, letterSpacing:“0.1em”, marginBottom:6 }}>{label || “広告”}</div>
<div style={{ color:”#94a3b8”, fontSize:12 }}>{desc}</div>
<div style={{ color:”#cbd5e1”, fontSize:10, marginTop:4 }}>← Google AdSense コードをここに設置 →</div>
</div>
</div>
);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// メインアプリ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
// ページルーティング（hash based）
const [page, setPage] = useState(() => window.location.hash === “#admin” ? “admin” : “home”);

// hashの変化を監視
useState(() => {
const handler = () => setPage(window.location.hash === “#admin” ? “admin” : “home”);
window.addEventListener(“hashchange”, handler);
return () => window.removeEventListener(“hashchange”, handler);
});

if (page === “admin”) return <AdminApp onExit={() => { window.location.hash = “”; setPage(“home”); }} />;
return <HomeApp />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ホーム（過去問検索）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function HomeApp() {
const [filters, setFilters] = useState({ year:””, school:””, grade:””, subject:””, keyword:”” });
const [selectedExam, setSelectedExam] = useState(null);
const [favorites, setFavorites] = useState(new Set());

const setFilter = (key, val) => setFilters(f => ({ …f, [key]: f[key]===val ? “” : val }));

const filtered = useMemo(() => SEED_EXAMS.filter(e => {
if (filters.year && e.year!==filters.year) return false;
if (filters.school && e.school!==filters.school) return false;
if (filters.grade && e.grade!==filters.grade) return false;
if (filters.subject && e.subject!==filters.subject) return false;
if (filters.keyword) {
const kw = filters.keyword.toLowerCase();
if (!e.school.includes(kw) && !e.subject.includes(kw) && !e.term.includes(kw)) return false;
}
return true;
}), [filters]);

const toggleFav = (id) => setFavorites(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

const subjectColors = {
国語:{ bg:”#fef3c7”, accent:”#d97706” }, 数学:{ bg:”#dbeafe”, accent:”#2563eb” },
英語:{ bg:”#d1fae5”, accent:”#059669” }, 理科:{ bg:”#ede9fe”, accent:”#7c3aed” }, 社会:{ bg:”#fee2e2”, accent:”#dc2626” },
};

const resultsWithAds = useMemo(() => {
const items = filtered.slice(0,50);
const out = [];
items.forEach((exam,i) => {
out.push({ type:“exam”, data:exam });
if ((i+1)%5===0 && i<items.length-1) out.push({ type:“ad”, id:`ad-${i}` });
});
return out;
}, [filtered]);

return (
<div style={{ minHeight:“100vh”, background:”#f0f9ff”, fontFamily:”‘Noto Sans JP’, sans-serif” }}>
{/* Header */}
<div style={{ background:“linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#06b6d4 100%)”, position:“relative”, overflow:“hidden” }}>
<div style={{ position:“absolute”, bottom:0, left:0, right:0, height:60, background:“url("data:image/svg+xml,%3Csvg xmlns=‘http://www.w3.org/2000/svg’ viewBox=‘0 0 1440 60’%3E%3Cpath fill=’%23f0f9ff’ d=‘M0,30 C360,60 720,0 1080,30 C1260,45 1350,40 1440,30 L1440,60 L0,60 Z’/%3E%3C/svg%3E") no-repeat bottom”, backgroundSize:“cover” }} />
<div style={{ padding:“32px 24px 64px”, position:“relative”, zIndex:1 }}>
<div style={{ maxWidth:900, margin:“0 auto” }}>
<div style={{ display:“flex”, alignItems:“center”, justifyContent:“space-between”, marginBottom:8 }}>
<div style={{ display:“flex”, alignItems:“center”, gap:12 }}>
<span style={{ fontSize:36 }}>🌊</span>
<div>
<h1 style={{ color:“white”, fontSize:22, fontWeight:800, margin:0, letterSpacing:“0.05em” }}>沖縄県中学校 過去問検索</h1>
<p style={{ color:”#bae6fd”, fontSize:12, margin:“4px 0 0” }}>Okinawa Junior High School Past Exam Search</p>
</div>
</div>
<a href=”#admin” style={{ background:“rgba(255,255,255,0.1)”, border:“1px solid rgba(255,255,255,0.2)”, borderRadius:8, padding:“5px 12px”, color:“rgba(255,255,255,0.5)”, fontSize:10, textDecoration:“none” }}>管理</a>
</div>
<div style={{ position:“relative”, marginTop:16 }}>
<span style={{ position:“absolute”, left:14, top:“50%”, transform:“translateY(-50%)”, fontSize:18 }}>🔍</span>
<input type=“text” placeholder=“学校名・教科・試験名で検索…” value={filters.keyword}
onChange={e=>setFilters(f=>({…f,keyword:e.target.value}))}
style={{ width:“100%”, boxSizing:“border-box”, padding:“12px 16px 12px 44px”, borderRadius:12, border:“none”, fontSize:15, background:“white”, boxShadow:“0 4px 20px rgba(0,0,0,0.15)”, outline:“none” }} />
</div>
</div>
</div>
</div>

```
  <div style={{ maxWidth:900, margin:"0 auto", padding:"16px 16px 40px" }}>
    <AdBanner size="leaderboard" label="広告 ①" />

    <div style={{ background:"white", borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginTop:8 }}>
      <FilterSection label="📅 年度" items={YEARS} active={filters.year} onToggle={v=>setFilter("year",v)} color="#0369a1" />
      <FilterSection label="🏫 学年" items={GRADES} active={filters.grade} onToggle={v=>setFilter("grade",v)} color="#0891b2" />
      <FilterSection label="📚 教科" items={SUBJECTS} active={filters.subject} onToggle={v=>setFilter("subject",v)} color="#0e7490" />
      <FilterSection label="🏛️ 学校" items={SCHOOLS} active={filters.school} onToggle={v=>setFilter("school",v)} color="#155e75" scroll />
    </div>

    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
      <p style={{ color:"#0369a1", fontWeight:700, fontSize:14, margin:0 }}>{filtered.length} 件の過去問が見つかりました</p>
      {Object.values(filters).some(Boolean) && (
        <button onClick={()=>setFilters({year:"",school:"",grade:"",subject:"",keyword:""})} style={{ background:"none", border:"1px solid #cbd5e1", borderRadius:8, padding:"4px 12px", fontSize:12, cursor:"pointer", color:"#64748b" }}>リセット</button>
      )}
    </div>

    {filtered.length===0 ? (
      <div style={{ textAlign:"center", padding:60, color:"#94a3b8" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🌊</div>
        <p>該当する過去問が見つかりませんでした</p>
      </div>
    ) : (
      <div style={{ display:"grid", gap:10 }}>
        {resultsWithAds.map(item => {
          if (item.type==="ad") return <div key={item.id}><AdBanner size="inline" label="広告 ②" /></div>;
          const exam = item.data;
          const colors = subjectColors[exam.subject] || { bg:"#f1f5f9", accent:"#64748b" };
          const isFav = favorites.has(exam.id);
          return (
            <div key={exam.id} onClick={()=>setSelectedExam(exam)}
              style={{ background:"white", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", cursor:"pointer", border:"1.5px solid transparent", transition:"all 0.15s", display:"flex", alignItems:"center", gap:12 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=colors.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}
            >
              <div style={{ width:48, height:48, borderRadius:10, background:colors.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span>{"📖📐🌍🔬🗺️".split("")[SUBJECTS.indexOf(exam.subject)]}</span>
                <span style={{ fontSize:9, color:colors.accent, fontWeight:700, marginTop:2 }}>{exam.subject}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#0f172a", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{exam.school}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[exam.year, exam.grade, exam.term].map(t=><Chip key={t} text={t} color="#64748b" />)}
                  {exam.hasAnswer && <Chip text="解答あり" color="#059669" />}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
                <button onClick={e=>{e.stopPropagation();toggleFav(exam.id);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, padding:4 }}>{isFav?"⭐":"☆"}</button>
                <button onClick={e=>{e.stopPropagation();setSelectedExam(exam);}} style={{ background:colors.accent, color:"white", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>表示</button>
              </div>
            </div>
          );
        })}
        {filtered.length>50 && <p style={{ textAlign:"center", color:"#94a3b8", fontSize:13, padding:16 }}>他 {filtered.length-50} 件</p>}
      </div>
    )}
    <div style={{ marginTop:24 }}><AdBanner size="rectangle" label="広告 ③" /></div>
  </div>

  {selectedExam && (
    <div onClick={()=>setSelectedExam(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:20, padding:28, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:"0 0 6px", fontSize:18, color:"#0f172a" }}>過去問詳細</h2>
            <p style={{ margin:0, color:"#64748b", fontSize:13 }}>{selectedExam.school}</p>
          </div>
          <button onClick={()=>setSelectedExam(null)} style={{ background:"#f1f5f9", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[["📅 年度",selectedExam.year],["🏫 学年",selectedExam.grade],["📚 教科",selectedExam.subject],["📝 試験",selectedExam.term],["📄 ページ数",`${selectedExam.pages}ページ`],["❓ 問題数",`${selectedExam.problems}問`]].map(([label,val])=>(
            <div key={label} style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:"#94a3b8", marginBottom:3 }}>{label}</div>
              <div style={{ fontWeight:700, color:"#0f172a", fontSize:15 }}>{val}</div>
            </div>
          ))}
        </div>
        <AdBanner size="inline" label="広告 ④" />
        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <button style={{ flex:1, padding:12, borderRadius:12, border:"none", background:"linear-gradient(135deg,#0369a1,#06b6d4)", color:"white", fontWeight:700, fontSize:15, cursor:"pointer" }}>📥 ダウンロード</button>
          {selectedExam.hasAnswer && <button style={{ flex:1, padding:12, borderRadius:12, border:"2px solid #059669", background:"white", color:"#059669", fontWeight:700, fontSize:15, cursor:"pointer" }}>✅ 解答を見る</button>}
        </div>
      </div>
    </div>
  )}
</div>
```

);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 管理画面
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AdminApp({ onExit }) {
const [authed, setAuthed] = useState(false);
const [pw, setPw] = useState(””);
const [pwError, setPwError] = useState(false);
const [tab, setTab] = useState(“dashboard”);
const [exams, setExams] = useState(SEED_EXAMS.slice(0, 8));
const [posts, setPosts] = useState(SEED_POSTS);
const [showAdd, setShowAdd] = useState(false);
const [newExam, setNewExam] = useState({ year:“2024年度”, school:””, grade:“1年生”, subject:“数学”, term:“1学期中間”, pages:2, problems:15, hasAnswer:false, status:“公開” });

const handleLogin = () => { if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); } else setPwError(true); };
const deleteExam = (id) => setExams(e=>e.filter(x=>x.id!==id));
const toggleStatus = (id) => setExams(e=>e.map(x=>x.id===id?{…x,status:x.status===“公開”?“非公開”:“公開”}:x));
const approvePost = (id) => setPosts(p=>p.map(x=>x.id===id?{…x,status:“承認済み”}:x));
const rejectPost = (id) => setPosts(p=>p.filter(x=>x.id!==id));
const addExam = () => { setExams(e=>[…e,{…newExam,id:Date.now()}]); setShowAdd(false); };

if (!authed) return (
<div style={{ minHeight:“100vh”, background:”#0a0f1a”, display:“flex”, alignItems:“center”, justifyContent:“center”, fontFamily:”‘Noto Sans JP’, sans-serif” }}>
<div style={{ background:”#0f1623”, border:“1px solid #1e2d42”, borderRadius:20, padding:40, width:“100%”, maxWidth:360, boxShadow:“0 20px 60px rgba(0,0,0,0.5)” }}>
<div style={{ textAlign:“center”, marginBottom:32 }}>
<div style={{ fontSize:36, marginBottom:12 }}>🔐</div>
<div style={{ fontSize:18, fontWeight:800, color:”#f1f5f9” }}>管理者ログイン</div>
<div style={{ fontSize:12, color:”#4a6080”, marginTop:6 }}>沖縄過去問 Admin Panel</div>
</div>
<div style={{ marginBottom:16 }}>
<div style={{ fontSize:12, color:”#4a6080”, marginBottom:6 }}>パスワード</div>
<input type=“password” value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key===“Enter”&&handleLogin()} placeholder=“パスワードを入力”
style={{ width:“100%”, boxSizing:“border-box”, background:”#1a2540”, border:`1px solid ${pwError?"#ef4444":"#1e2d42"}`, borderRadius:10, padding:“10px 14px”, color:”#e2e8f0”, fontSize:14, outline:“none” }} />
{pwError && <div style={{ fontSize:12, color:”#ef4444”, marginTop:6 }}>パスワードが違います</div>}
</div>
<button onClick={handleLogin} style={{ width:“100%”, background:“linear-gradient(135deg,#0369a1,#38bdf8)”, color:“white”, border:“none”, borderRadius:10, padding:12, fontSize:15, fontWeight:700, cursor:“pointer” }}>ログイン</button>
<button onClick={onExit} style={{ width:“100%”, background:“none”, border:“none”, color:”#4a6080”, fontSize:12, cursor:“pointer”, marginTop:12 }}>← サイトに戻る</button>
<div style={{ textAlign:“center”, marginTop:8, fontSize:11, color:”#1e2d42” }}>デモ用パスワード: okinawa2024</div>
</div>
</div>
);

return (
<div style={{ minHeight:“100vh”, background:”#0a0f1a”, fontFamily:”‘Noto Sans JP’, sans-serif”, color:”#e2e8f0”, display:“flex” }}>
{/* Sidebar */}
<div style={{ width:220, background:”#0f1623”, borderRight:“1px solid #1e2d42”, flexShrink:0, display:“flex”, flexDirection:“column” }}>
<div style={{ padding:“24px 20px 16px”, borderBottom:“1px solid #1e2d42” }}>
<div style={{ fontSize:11, color:”#4a6080”, letterSpacing:“0.15em”, marginBottom:4 }}>ADMIN PANEL</div>
<div style={{ fontSize:16, fontWeight:800, color:”#38bdf8” }}>沖縄過去問</div>
</div>
<nav style={{ padding:“12px 0”, flex:1 }}>
{[
{ id:“dashboard”, icon:“📊”, label:“ダッシュボード” },
{ id:“exams”, icon:“📝”, label:“過去問管理” },
{ id:“posts”, icon:“📬”, label:“投稿承認” },
{ id:“ads”, icon:“💰”, label:“広告管理” },
].map(item => (
<button key={item.id} onClick={()=>setTab(item.id)} style={{
width:“100%”, textAlign:“left”, padding:“10px 20px”,
background: tab===item.id ? “linear-gradient(90deg,#1e3a5f,transparent)” : “none”,
border:“none”, borderLeft: tab===item.id ? “3px solid #38bdf8” : “3px solid transparent”,
color: tab===item.id ? “#38bdf8” : “#64748b”, cursor:“pointer”,
fontSize:13, fontWeight: tab===item.id ? 700 : 400,
display:“flex”, alignItems:“center”, gap:10,
}}>
<span>{item.icon}</span>{item.label}
</button>
))}
</nav>
<div style={{ padding:“0 16px 16px”, display:“flex”, flexDirection:“column”, gap:8 }}>
<button onClick={onExit} style={{ padding:“8px”, background:“none”, border:“1px solid #1e2d42”, borderRadius:8, color:”#38bdf8”, cursor:“pointer”, fontSize:12 }}>← サイトに戻る</button>
<button onClick={()=>setAuthed(false)} style={{ padding:“8px”, background:“none”, border:“1px solid #1e2d42”, borderRadius:8, color:”#4a6080”, cursor:“pointer”, fontSize:12 }}>ログアウト</button>
</div>
</div>

```
  {/* Content */}
  <div style={{ flex:1, padding:24, overflowY:"auto" }}>

    {tab==="dashboard" && (
      <div>
        <h1 style={{ fontSize:20, fontWeight:800, marginBottom:20, color:"#f1f5f9" }}>ダッシュボード</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginBottom:24 }}>
          {[
            { label:"今日のPV", value:"342", icon:"👁", color:"#38bdf8" },
            { label:"今月のPV", value:"8,420", icon:"📈", color:"#34d399" },
            { label:"累計ユーザー", value:"1,205", icon:"👥", color:"#a78bfa" },
            { label:"今月の広告収益", value:"¥2,840", icon:"💴", color:"#fbbf24" },
          ].map(s=>(
            <div key={s.label} style={{ background:"#0f1623", border:"1px solid #1e2d42", borderRadius:12, padding:"16px 20px" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#4a6080", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0f1623", border:"1px solid #1e2d42", borderRadius:12, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#94a3b8", marginBottom:12 }}>📊 サマリー</div>
          {[
            ["総過去問数", `${exams.length}件`],
            ["承認待ち投稿", `${posts.filter(p=>p.status==="承認待ち").length}件`],
            ["公開中の過去問", `${exams.filter(e=>e.status==="公開").length}件`],
            ["今月の広告クリック", "284回"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1e2d42", fontSize:13 }}>
              <span style={{ color:"#64748b" }}>{k}</span>
              <span style={{ color:"#e2e8f0", fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {tab==="exams" && (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h1 style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", margin:0 }}>過去問管理</h1>
          <button onClick={()=>setShowAdd(true)} style={{ background:"#38bdf8", color:"#0a0f1a", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>＋ 新規追加</button>
        </div>
        {showAdd && (
          <div style={{ background:"#0f1623", border:"1px solid #38bdf8", borderRadius:12, padding:20, marginBottom:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#38bdf8", marginBottom:16 }}>新規過去問を追加</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["学校名","school"],["年度","year"],["学年","grade"],["教科","subject"],["試験","term"],["ページ数","pages"]].map(([label,key])=>(
                <div key={key}>
                  <div style={{ fontSize:11, color:"#4a6080", marginBottom:4 }}>{label}</div>
                  <input value={newExam[key]} onChange={e=>setNewExam(n=>({...n,[key]:e.target.value}))}
                    style={{ width:"100%", boxSizing:"border-box", background:"#1a2540", border:"1px solid #1e2d42", borderRadius:6, padding:"6px 10px", color:"#e2e8f0", fontSize:13, outline:"none" }} />
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={addExam} style={{ background:"#38bdf8", color:"#0a0f1a", border:"none", borderRadius:8, padding:"8px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>追加する</button>
              <button onClick={()=>setShowAdd(false)} style={{ background:"none", border:"1px solid #1e2d42", borderRadius:8, padding:"8px 20px", fontSize:13, color:"#64748b", cursor:"pointer" }}>キャンセル</button>
            </div>
          </div>
        )}
        <div style={{ display:"grid", gap:8 }}>
          {exams.map(exam=>(
            <div key={exam.id} style={{ background:"#0f1623", border:"1px solid #1e2d42", borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#f1f5f9", marginBottom:4 }}>{exam.school}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[exam.year, exam.grade, exam.subject, exam.term].map(t=>(
                    <span key={t} style={{ background:"#1a2540", color:"#64748b", borderRadius:4, padding:"2px 8px", fontSize:11 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <button onClick={()=>toggleStatus(exam.id)} style={{ background:exam.status==="公開"?"#064e3b":"#1a2540", color:exam.status==="公開"?"#34d399":"#64748b", border:"none", borderRadius:6, padding:"4px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>{exam.status}</button>
                <button onClick={()=>deleteExam(exam.id)} style={{ background:"#2d1515", color:"#ef4444", border:"none", borderRadius:6, padding:"4px 12px", fontSize:12, cursor:"pointer" }}>削除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {tab==="posts" && (
      <div>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:20 }}>ユーザー投稿の承認</h1>
        <div style={{ display:"grid", gap:10 }}>
          {posts.map(post=>(
            <div key={post.id} style={{ background:"#0f1623", border:`1px solid ${post.status==="承認待ち"?"#854d0e":"#1e2d42"}`, borderRadius:10, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#f1f5f9", marginBottom:6 }}>{post.school} — {post.subject} {post.year} {post.term}</div>
                  <div style={{ fontSize:12, color:"#4a6080" }}>投稿者：{post.user}　{post.date}</div>
                </div>
                <span style={{ background:post.status==="承認待ち"?"#451a03":"#064e3b", color:post.status==="承認待ち"?"#fbbf24":"#34d399", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{post.status}</span>
              </div>
              {post.status==="承認待ち" && (
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button onClick={()=>approvePost(post.id)} style={{ background:"#064e3b", color:"#34d399", border:"none", borderRadius:6, padding:"6px 16px", fontSize:12, cursor:"pointer", fontWeight:600 }}>✓ 承認</button>
                  <button onClick={()=>rejectPost(post.id)} style={{ background:"#2d1515", color:"#ef4444", border:"none", borderRadius:6, padding:"6px 16px", fontSize:12, cursor:"pointer" }}>✕ 却下</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {tab==="ads" && (
      <div>
        <h1 style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:20 }}>広告管理</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginBottom:24 }}>
          {[
            { label:"今月の収益", value:"¥2,840", color:"#fbbf24" },
            { label:"クリック数", value:"284", color:"#38bdf8" },
            { label:"表示回数", value:"23,680", color:"#34d399" },
            { label:"有効広告枠", value:"4枠", color:"#a78bfa" },
          ].map(s=>(
            <div key={s.label} style={{ background:"#0f1623", border:"1px solid #1e2d42", borderRadius:12, padding:"16px 20px" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#4a6080", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0f1623", border:"1px solid #1e2d42", borderRadius:12, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#94a3b8", marginBottom:16 }}>広告枠ステータス</div>
          {[
            { name:"① ヘッダー下", size:"728×90", clicks:98, revenue:"¥980" },
            { name:"② リスト中間", size:"320×100", clicks:72, revenue:"¥720" },
            { name:"③ フッター上", size:"336×280", clicks:64, revenue:"¥840" },
            { name:"④ モーダル内", size:"320×100", clicks:50, revenue:"¥300" },
          ].map(ad=>(
            <div key={ad.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #1e2d42", fontSize:13 }}>
              <div>
                <div style={{ fontWeight:600, color:"#e2e8f0" }}>{ad.name}</div>
                <div style={{ fontSize:11, color:"#4a6080" }}>{ad.size}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"#fbbf24", fontWeight:700 }}>{ad.revenue}</div>
                <div style={{ fontSize:11, color:"#4a6080" }}>クリック {ad.clicks}回</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
```

);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 共通コンポーネント
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Chip({ text, color }) {
return <span style={{ background:color+“18”, color, borderRadius:6, padding:“2px 8px”, fontSize:11, fontWeight:600, whiteSpace:“nowrap” }}>{text}</span>;
}

function FilterSection({ label, items, active, onToggle, color, scroll }) {
return (
<div style={{ marginBottom:12 }}>
<div style={{ fontSize:11, fontWeight:700, color:”#94a3b8”, marginBottom:6, textTransform:“uppercase”, letterSpacing:“0.08em” }}>{label}</div>
<div style={{ display:“flex”, gap:6, flexWrap:scroll?“nowrap”:“wrap”, overflowX:scroll?“auto”:“visible”, paddingBottom:scroll?4:0 }}>
{items.map(item=>(
<button key={item} onClick={()=>onToggle(item)} style={{ padding:“5px 12px”, borderRadius:20, border:active===item?`2px solid ${color}`:“2px solid #e2e8f0”, background:active===item?color:“white”, color:active===item?“white”:”#475569”, fontSize:12, fontWeight:600, cursor:“pointer”, whiteSpace:“nowrap”, transition:“all 0.15s”, flexShrink:0 }}>
{item}
</button>
))}
</div>
</div>
);
}
