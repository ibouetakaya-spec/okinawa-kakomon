import { useState, useMemo } from "react";

const SCHOOLS = [
  "那覇市立首里中学校","那覇市立小禄中学校","那覇市立銘苅中学校",
  "浦添市立浦添中学校","浦添市立港川中学校","沖縄市立コザ中学校",
  "沖縄市立美里中学校","宜野湾市立大山中学校","宜野湾市立普天間中学校",
  "豊見城市立豊見城中学校","名護市立名護中学校","うるま市立具志川中学校",
  "糸満市立糸満中学校","南城市立大里中学校","読谷村立読谷中学校",
];
const SUBJECTS = ["国語","数学","英語","理科","社会"];
const GRADES = ["1年生","2年生","3年生"];
const YEARS = ["2024年度","2023年度","2022年度","2021年度","2020年度"];
const TERMS = ["1学期中間","1学期期末","2学期中間","2学期期末","3学期期末"];

function generateExams() {
  const exams = []; let id = 1;
  YEARS.forEach(year => SCHOOLS.slice(0,8).forEach(school =>
    GRADES.forEach(grade => SUBJECTS.forEach(subject => {
      TERMS.slice(0, Math.floor(Math.random()*3)+2).forEach(term => {
        exams.push({ id:id++, year, school, grade, subject, term,
          pages: Math.floor(Math.random()*4)+2,
          problems: Math.floor(Math.random()*20)+10,
          hasAnswer: Math.random()>0.3 });
      });
    }))));
  return exams;
}
const ALL_EXAMS = generateExams();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 広告枠コンポーネント
// 本番では中身を Google AdSense の <ins> タグに置き換えます
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function AdBanner({ size = "leaderboard", label }) {
  const h = size === "rectangle" ? 250 : size === "inline" ? 90 : 90;
  const desc = size === "rectangle" ? "336×280 レクタングル" : size === "inline" ? "320×100 インライン" : "728×90 リーダーボード";
  return (
    <div style={{ width:"100%", height:h, background:"linear-gradient(135deg,#f8fafc,#f1f5f9)", border:"1.5px dashed #cbd5e1", borderRadius:12, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", margin:"8px 0" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,#e0f2fe,transparent 50%),radial-gradient(circle at 80% 50%,#f0fdf4,transparent 50%)", opacity:0.7 }} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        <div style={{ display:"inline-block", background:"#e2e8f0", color:"#64748b", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, letterSpacing:"0.1em", marginBottom:6 }}>{label || "広告"}</div>
        <div style={{ color:"#94a3b8", fontSize:12 }}>{desc}</div>
        <div style={{ color:"#cbd5e1", fontSize:10, marginTop:4 }}>← Google AdSense コードをここに設置 →</div>
      </div>
    </div>
  );
}

function AdGuideModal({ onClose }) {
  const steps = [
    { icon:"🌐", title:"サイトを公開する", desc:"Vercel・Netlify等にデプロイし独自ドメインを取得（例: okinawa-kakomon.com）" },
    { icon:"📝", title:"AdSense に申請", desc:"adsense.google.com でアカウント作成・サイト審査を申請する" },
    { icon:"⏳", title:"審査を待つ", desc:"数日〜数週間。コンテンツ量が多いほど審査が通りやすい" },
    { icon:"💻", title:"広告コードを貼る", desc:"承認後に発行される <ins> タグを AdBanner コンポーネントと置き換える" },
    { icon:"💰", title:"収益発生！", desc:"クリック・表示ごとに収益。月1万PVで1,000〜3,000円が目安" },
  ];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:20, padding:28, width:"100%", maxWidth:500, boxShadow:"0 20px 60px rgba(0,0,0,0.3)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:18, color:"#0f172a" }}>💰 AdSense 設置ガイド</h2>
          <button onClick={onClose} style={{ background:"#f1f5f9", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {steps.map((s,i) => (
            <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", background:"#f8fafc", borderRadius:12, padding:"12px 16px" }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#0f172a", marginBottom:2 }}>STEP {i+1}：{s.title}</div>
                <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:12, padding:"12px 16px" }}>
          <p style={{ margin:0, fontSize:12, color:"#92400e" }}>💡 <strong>収益の目安：</strong>教育系サイトのCPM（1000表示あたり）は約100〜300円。月1万PVで1,000〜3,000円程度が期待できます。</p>
        </div>
      </div>
    </div>
  );
}

const SubjectIcon = ({ subject }) => {
  const icons = { 国語:"📖", 数学:"📐", 英語:"🌍", 理科:"🔬", 社会:"🗺️" };
  return <span>{icons[subject]||"📄"}</span>;
};

export default function App() {
  const [filters, setFilters] = useState({ year:"", school:"", grade:"", subject:"", keyword:"" });
  const [selectedExam, setSelectedExam] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showAdGuide, setShowAdGuide] = useState(false);

  const setFilter = (key,val) => setFilters(f => ({ ...f, [key]: f[key]===val ? "" : val }));

  const filtered = useMemo(() => ALL_EXAMS.filter(e => {
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
    国語:{ bg:"#fef3c7", accent:"#d97706" }, 数学:{ bg:"#dbeafe", accent:"#2563eb" },
    英語:{ bg:"#d1fae5", accent:"#059669" }, 理科:{ bg:"#ede9fe", accent:"#7c3aed" }, 社会:{ bg:"#fee2e2", accent:"#dc2626" },
  };

  // 5件おきに広告を挿入
  const resultsWithAds = useMemo(() => {
    const items = filtered.slice(0,50);
    const out = [];
    items.forEach((exam,i) => {
      out.push({ type:"exam", data:exam });
      if ((i+1)%5===0 && i<items.length-1) out.push({ type:"ad", id:`ad-${i}` });
    });
    return out;
  }, [filtered]);

  return (
    <div style={{ minHeight:"100vh", background:"#f0f9ff", fontFamily:"'Noto Sans JP', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#06b6d4 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:60, background:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23f0f9ff' d='M0,30 C360,60 720,0 1080,30 C1260,45 1350,40 1440,30 L1440,60 L0,60 Z'/%3E%3C/svg%3E\") no-repeat bottom", backgroundSize:"cover" }} />
        <div style={{ padding:"32px 24px 64px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:36 }}>🌊</span>
                <div>
                  <h1 style={{ color:"white", fontSize:22, fontWeight:800, margin:0, letterSpacing:"0.05em" }}>沖縄県中学校 過去問検索</h1>
                  <p style={{ color:"#bae6fd", fontSize:12, margin:"4px 0 0" }}>Okinawa Junior High School Past Exam Search</p>
                </div>
              </div>
              <button onClick={()=>setShowAdGuide(true)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:10, padding:"6px 14px", color:"white", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                💰 AdSense設置ガイド
              </button>
            </div>
            <div style={{ position:"relative", marginTop:16 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>🔍</span>
              <input type="text" placeholder="学校名・教科・試験名で検索..." value={filters.keyword}
                onChange={e=>setFilters(f=>({...f,keyword:e.target.value}))}
                style={{ width:"100%", boxSizing:"border-box", padding:"12px 16px 12px 44px", borderRadius:12, border:"none", fontSize:15, background:"white", boxShadow:"0 4px 20px rgba(0,0,0,0.15)", outline:"none" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"16px 16px 40px" }}>

        {/* ① 広告枠：ヘッダー直下（表示回数最多） */}
        <AdBanner size="leaderboard" label="広告 ①  ヘッダー下 — 表示回数が最も多い枠" />

        {/* フィルター */}
        <div style={{ background:"white", borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginTop:8 }}>
          <FilterSection label="📅 年度" items={YEARS} active={filters.year} onToggle={v=>setFilter("year",v)} color="#0369a1" />
          <FilterSection label="🏫 学年" items={GRADES} active={filters.grade} onToggle={v=>setFilter("grade",v)} color="#0891b2" />
          <FilterSection label="📚 教科" items={SUBJECTS} active={filters.subject} onToggle={v=>setFilter("subject",v)} color="#0e7490" />
          <FilterSection label="🏛️ 学校" items={SCHOOLS} active={filters.school} onToggle={v=>setFilter("school",v)} color="#155e75" scroll />
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <p style={{ color:"#0369a1", fontWeight:700, fontSize:14, margin:0 }}>{filtered.length} 件の過去問が見つかりました</p>
          {Object.values(filters).some(Boolean) && (
            <button onClick={()=>setFilters({year:"",school:"",grade:"",subject:"",keyword:""})} style={{ background:"none", border:"1px solid #cbd5e1", borderRadius:8, padding:"4px 12px", fontSize:12, cursor:"pointer", color:"#64748b" }}>フィルターをリセット</button>
          )}
        </div>

        {/* 結果 + ② 広告枠：リスト中間 */}
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:60, color:"#94a3b8" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌊</div>
            <p style={{ fontSize:16 }}>該当する過去問が見つかりませんでした</p>
          </div>
        ) : (
          <div style={{ display:"grid", gap:10 }}>
            {resultsWithAds.map(item => {
              if (item.type==="ad") return (
                <div key={item.id}>
                  {/* ② 広告枠：リスト中間（スクロール中に自然に表示） */}
                  <AdBanner size="inline" label="広告 ②  リスト中間 — スクロール中に自然に表示" />
                </div>
              );
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
                    <SubjectIcon subject={exam.subject} />
                    <span style={{ fontSize:9, color:colors.accent, fontWeight:700, marginTop:2 }}>{exam.subject}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#0f172a", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{exam.school}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <Chip text={exam.year} color="#64748b" />
                      <Chip text={exam.grade} color="#0369a1" />
                      <Chip text={exam.term} color="#0891b2" />
                      {exam.hasAnswer && <Chip text="解答あり" color="#059669" />}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0, alignItems:"center" }}>
                    <button onClick={e=>{e.stopPropagation();toggleFav(exam.id);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, padding:4 }}>
                      {isFav?"⭐":"☆"}
                    </button>
                    <button onClick={e=>{e.stopPropagation();setSelectedExam(exam);}} style={{ background:colors.accent, color:"white", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
                      表示
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length>50 && <p style={{ textAlign:"center", color:"#94a3b8", fontSize:13, padding:16 }}>他 {filtered.length-50} 件 — フィルターを絞り込んでください</p>}
          </div>
        )}

        {/* ③ 広告枠：フッター上（レクタングル） */}
        <div style={{ marginTop:24 }}>
          <AdBanner size="rectangle" label="広告 ③  フッター上 — 滞在時間が長いユーザーに表示" />
        </div>
      </div>

      {/* 詳細モーダル */}
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
            {/* ④ 広告枠：モーダル内（ダウンロード直前・高クリック率） */}
            <AdBanner size="inline" label="広告 ④  モーダル内 — ダウンロード直前・高クリック率" />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button style={{ flex:1, padding:12, borderRadius:12, border:"none", background:"linear-gradient(135deg,#0369a1,#06b6d4)", color:"white", fontWeight:700, fontSize:15, cursor:"pointer" }}>📥 ダウンロード</button>
              {selectedExam.hasAnswer && (
                <button style={{ flex:1, padding:12, borderRadius:12, border:"2px solid #059669", background:"white", color:"#059669", fontWeight:700, fontSize:15, cursor:"pointer" }}>✅ 解答を見る</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAdGuide && <AdGuideModal onClose={()=>setShowAdGuide(false)} />}
    </div>
  );
}

function Chip({ text, color }) {
  return <span style={{ background:color+"18", color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{text}</span>;
}

function FilterSection({ label, items, active, onToggle, color, scroll }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
      <div style={{ display:"flex", gap:6, flexWrap:scroll?"nowrap":"wrap", overflowX:scroll?"auto":"visible", paddingBottom:scroll?4:0 }}>
        {items.map(item => (
          <button key={item} onClick={()=>onToggle(item)} style={{ padding:"5px 12px", borderRadius:20, border:active===item?`2px solid ${color}`:"2px solid #e2e8f0", background:active===item?color:"white", color:active===item?"white":"#475569", fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
