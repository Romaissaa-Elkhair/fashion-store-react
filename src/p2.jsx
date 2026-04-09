import { useState, useEffect, useRef, useMemo } from "react";

/* ─────────────────────────────────────────────
   التنسيقات (STYLES)
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#D4A843;--gold2:#F0C96A;--gold-dim:#8A6A20;
  --sky:#4FACDE;--mint:#3EC8A0;--rose:#E05C6E;--amber:#F28C38;
  --sidebar-w:268px;
  --t-bg:#0A0C16;--t-surface:#11142A;--t-card:#161930;--t-card2:#1C1F38;
  --t-border:#232640;--t-border2:#2C3058;
  --t-text:#EEECf8;--t-muted:#888DAB;--t-muted2:#555A7A;
  --t-sidebar:#0D0F20;--t-topbar:#0A0C16;--t-input:#0A0C16;
  --t-page-bg:#0A0C16;--t-scrolltrack:#11142A;
}
[data-theme="light"]{
  --t-bg:#EEF0FB;--t-surface:#FFFFFF;--t-card:#FFFFFF;--t-card2:#E8ECFF;
  --t-border:#CDD2EE;--t-border2:#B0B8E0;
  --t-text:#14163A;--t-muted:#606590;--t-muted2:#9098B8;
  --t-sidebar:#F8F9FF;--t-topbar:#FFFFFF;--t-input:#EEF0FB;
  --t-page-bg:#EEF0FB;--t-scrolltrack:#E0E4F8;
}
html{scroll-behavior:smooth}
body{font-family:'Cairo',sans-serif;direction:rtl;background:var(--t-bg);color:var(--t-text);min-height:100vh;overflow-x:hidden;transition:background .35s,color .35s}

/* SCROLLBAR */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--t-border2);border-radius:10px}

/* ANIMATIONS */
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,.45)}50%{box-shadow:0 0 0 12px rgba(212,168,67,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes gradShimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes notif{0%{opacity:0;transform:translateX(50%) translateY(-28px) scale(.93)}12%{opacity:1;transform:translateX(50%) translateY(0) scale(1)}85%{opacity:1;transform:translateX(50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(50%) translateY(-18px) scale(.96)}}

/* GRADIENT TEXT */
.gt-gold{background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 40%,var(--amber) 80%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 5s linear infinite}

/* THEME TOGGLE */
.theme-toggle{width:48px;height:27px;border-radius:100px;border:none;cursor:pointer;position:relative;padding:0;transition:background .3s;flex-shrink:0;outline:none}
.theme-toggle.dark-mode{background:linear-gradient(135deg,#1C1F38,#2C3058);border:1.5px solid #3A3F68}
.theme-toggle.light-mode{background:linear-gradient(135deg,var(--gold2),var(--gold))}
.theme-toggle-thumb{position:absolute;top:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:right .3s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.theme-toggle.dark-mode .theme-toggle-thumb{right:3px}
.theme-toggle.light-mode .theme-toggle-thumb{right:24px;background:#1a1000}
.theme-toggle-label{font-size:11px;color:var(--t-muted);white-space:nowrap;font-weight:600}

/* LOGIN */
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--t-bg);position:relative;overflow:hidden;transition:background .35s}
.login-bg-orb{position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none}
.login-card{background:var(--t-card);border:1px solid var(--t-border2);border-radius:28px;padding:52px 48px;width:448px;max-width:95vw;position:relative;z-index:1;animation:scaleIn .5s cubic-bezier(.34,1.2,.64,1);box-shadow:0 40px 100px rgba(0,0,0,.4),0 0 0 1px rgba(212,168,67,.1),inset 0 1px 0 rgba(255,255,255,.04);transition:background .35s,border-color .35s}
.login-logo-ring{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--sky));display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 18px;box-shadow:0 8px 32px rgba(212,168,67,.4);animation:pulse 2.5s ease infinite}
.login-title{font-family:'Amiri',serif;font-size:30px;font-weight:700;text-align:center;margin-bottom:6px;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 40%,var(--amber) 80%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 4s linear infinite}
.login-sub{text-align:center;font-size:13px;color:var(--t-muted);margin-bottom:8px;line-height:1.5}
.login-login-theme-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:26px;padding:10px 16px;background:rgba(255,255,255,.03);border-radius:12px;border:1px solid var(--t-border)}
.login-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--t-muted);margin-bottom:8px;display:block;font-weight:700}
.login-input-wrap{position:relative;margin-bottom:18px}
.login-input{width:100%;padding:14px 18px;background:var(--t-input);border:1.5px solid var(--t-border);border-radius:12px;color:var(--t-text);font-size:14px;font-family:'Cairo',sans-serif;outline:none;transition:border-color .25s,box-shadow .25s,background .35s}
.login-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,168,67,.18)}
.login-input::placeholder{color:var(--t-muted2)}
.login-eye{position:absolute;left:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--t-muted);font-size:16px;padding:4px}
.login-btn{width:100%;padding:15px;background:linear-gradient(110deg,var(--gold),var(--amber),var(--gold));background-size:200% auto;border:none;border-radius:12px;color:#1a1000;font-size:14px;font-weight:700;font-family:'Cairo',sans-serif;cursor:pointer;letter-spacing:.4px;transition:transform .2s,box-shadow .2s,background-position .4s;margin-top:8px}
.login-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(212,168,67,.5);background-position:right center}
.login-error{background:rgba(224,92,110,.1);border:1px solid rgba(224,92,110,.3);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--rose);text-align:center;margin-top:12px}
.login-hint{text-align:center;font-size:12px;color:var(--t-muted2);margin-top:20px;padding-top:18px;border-top:1px solid var(--t-border)}
.login-hint strong{color:var(--gold);font-weight:700}

/* APP LAYOUT */
.app-layout{display:flex;height:100vh;overflow:hidden;direction:rtl}

/* SIDEBAR */
.sidebar{width:var(--sidebar-w);flex-shrink:0;background:var(--t-sidebar);border-left:1px solid var(--t-border);display:flex;flex-direction:column;overflow:hidden;position:relative;transition:background .35s,border-color .35s;box-shadow:-4px 0 30px rgba(0,0,0,.15)}
.sidebar-logo{padding:22px 18px 18px;border-bottom:1px solid var(--t-border);display:flex;align-items:center;gap:12px}
.sidebar-logo-icon{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--amber));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 6px 22px rgba(212,168,67,.38)}
.sidebar-logo-text{font-family:'Amiri',serif;font-size:17px;font-weight:700;line-height:1.1;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-logo-sub{font-size:10px;color:var(--t-muted);letter-spacing:1px;text-transform:uppercase;margin-top:3px}
.sidebar-nav{flex:1;overflow-y:auto;padding:12px 10px}
.nav-section-title{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--t-muted2);padding:14px 14px 6px;font-weight:700}
.nav-item{display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:12px;font-size:13px;font-weight:500;color:var(--t-muted);cursor:pointer;transition:all .22s;margin-bottom:3px;border:1px solid transparent}
.nav-item:hover{background:var(--t-card2);color:var(--t-text)}
.nav-item.active{background:linear-gradient(135deg,rgba(212,168,67,.15),rgba(212,168,67,.05));color:var(--gold);border-color:rgba(212,168,67,.28);font-weight:600}
.nav-badge{margin-right:auto;background:linear-gradient(135deg,var(--gold),var(--amber));color:#1a1000;font-size:10px;font-weight:800;padding:2px 9px;border-radius:100px}
.sidebar-user{padding:14px 16px;border-top:1px solid var(--t-border);display:flex;align-items:center;gap:11px;background:rgba(0,0,0,.08)}
.user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--sky),var(--mint));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.logout-btn{margin-right:auto;background:none;border:none;color:var(--t-muted2);cursor:pointer;font-size:16px;padding:7px;border-radius:9px;transition:all .2s}
.logout-btn:hover{color:var(--rose);background:rgba(224,92,110,.1)}

/* MAIN */
.main-content{flex:1;overflow-y:auto;display:flex;flex-direction:column;background:var(--t-page-bg);transition:background .35s}

/* TOPBAR */
.topbar{padding:14px 28px;display:flex;align-items:center;justify-content:space-between;background:var(--t-topbar);border-bottom:1px solid var(--t-border);position:sticky;top:0;z-index:10;backdrop-filter:blur(20px);box-shadow:0 2px 20px rgba(0,0,0,.08)}
.page-title{font-family:'Amiri',serif;font-size:22px;font-weight:700;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 45%,var(--amber) 90%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 5s linear infinite}
.topbar-right{display:flex;align-items:center;gap:10px}
.topbar-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;transition:all .22s;border:none;font-family:'Cairo',sans-serif}
.btn-primary{background:linear-gradient(135deg,var(--gold),var(--amber));color:#1a1000}
.btn-ghost{background:var(--t-card2);color:var(--t-muted);border:1px solid var(--t-border)}
.btn-danger{background:rgba(224,92,110,.1);color:var(--rose);border:1px solid rgba(224,92,110,.28)}

/* PAGE */
.page-content{padding:26px 28px;animation:fadeSlideUp .4s ease}

/* KPI */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.kpi-card{border-radius:20px;padding:22px;position:relative;overflow:hidden;border:1px solid var(--t-border);background:var(--t-card);transition:transform .28s}
.kpi-card:hover{transform:translateY(-5px)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px}
.kpi-icon-wrap{width:48px;height:48px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
.kpi-val{font-family:'Amiri',serif;font-size:40px;font-weight:700;line-height:1;margin-bottom:5px;color:var(--t-text)}
.kpi-label{font-size:12px;color:var(--t-muted);font-weight:500}
.kpi-trend{display:flex;align-items:center;gap:4px;font-size:11px;margin-top:14px;font-weight:600}
.trend-up{color:var(--mint)}
.trend-dn{color:var(--rose)}

/* CHARTS */
.charts-row{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;margin-bottom:24px}
.chart-card{background:var(--t-card);border:1px solid var(--t-border);border-radius:20px;padding:24px;position:relative}
.chart-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.chart-title{font-size:13px;font-weight:700;background:linear-gradient(110deg,var(--sky),var(--mint));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* BARS */
.bars{display:flex;align-items:flex-end;gap:7px;height:124px;direction:ltr}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%;justify-content:flex-end}
.bar-rect{width:100%;border-radius:6px 6px 0 0;cursor:pointer;transition:opacity .2s}
.bar-mlabel{font-size:8.5px;color:var(--t-muted)}

/* DONUT */
.donut-container{display:flex;flex-direction:column;align-items:center;gap:18px}
.donut-rel{position:relative;width:134px;height:134px}
.donut-svg{transform:rotate(-90deg)}
.donut-center-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.donut-big{font-family:'Amiri',serif;font-size:28px;font-weight:700;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.donut-legend{width:100%;display:flex;flex-direction:column;gap:9px}
.legend-row{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--t-muted)}
.legend-sq{width:10px;height:10px;border-radius:3px}
.legend-pct{margin-right:auto;font-size:12px;font-weight:700;color:var(--t-text)}

/* SECTION CARD */
.section-card{background:var(--t-card);border:1px solid var(--t-border);border-radius:20px;overflow:hidden;margin-bottom:24px}
.section-head{padding:18px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--t-border);background:linear-gradient(135deg,rgba(212,168,67,.05),rgba(79,172,222,.03))}
.section-title-text{font-size:14px;font-weight:700;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* SEARCH */
.search-box{display:flex;align-items:center;gap:8px;background:var(--t-input);border:1.5px solid var(--t-border);border-radius:12px;padding:10px 15px;width:300px;transition:border-color .25s}
.search-box input{background:none;border:none;outline:none;font-size:13px;color:var(--t-text);flex:1;font-family:'Cairo',sans-serif}

/* TABLE */
.data-table{width:100%;border-collapse:collapse;text-align:right}
.data-table th{font-size:11px;text-transform:uppercase;font-weight:700;color:var(--t-muted);padding:13px 20px;border-bottom:1px solid var(--t-border);background:rgba(0,0,0,.04)}
.data-table td{padding:15px 20px;font-size:13px;color:var(--t-text);border-bottom:1px solid var(--t-border)}
.data-table tbody tr:hover td{background:rgba(212,168,67,.05)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:600;border:1px solid}
.badge-penal{background:rgba(224,92,110,.12);color:var(--rose);border-color:rgba(224,92,110,.3)}
.badge-civil{background:rgba(79,172,222,.12);color:var(--sky);border-color:rgba(79,172,222,.3)}
.badge-familial{background:rgba(62,200,160,.12);color:var(--mint);border-color:rgba(62,200,160,.3)}
.badge-commercial{background:rgba(212,168,67,.12);color:var(--gold);border-color:rgba(212,168,67,.3)}
.badge-encours{background:rgba(79,172,222,.1);color:var(--sky);border-color:rgba(79,172,222,.25)}
.badge-reporte{background:rgba(242,140,56,.1);color:var(--amber);border-color:rgba(242,140,56,.25)}
.badge-cloture{background:rgba(62,200,160,.1);color:var(--mint);border-color:rgba(62,200,160,.25)}

/* ACTIONS */
.action-btns{display:flex;gap:6px}
.act-btn{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;border:1px solid var(--t-border);background:var(--t-card2);color:var(--t-muted)}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:fadeIn .2s ease}
.modal-box{background:var(--t-card);border:1px solid var(--t-border2);border-radius:24px;width:560px;max-width:100%;max-height:90vh;overflow-y:auto;padding:36px;animation:scaleIn .25s cubic-bezier(.34,1.2,.64,1);direction:rtl}
.modal-title{font-family:'Amiri',serif;font-size:23px;font-weight:700;margin-bottom:28px;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 45%,var(--amber) 90%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-group{display:flex;flex-direction:column;gap:7px}
.form-group.full{grid-column:1/-1}
.form-label{font-size:11px;color:var(--t-muted);font-weight:700}
.form-input,.form-select,.form-textarea{background:var(--t-input);border:1.5px solid var(--t-border);border-radius:11px;padding:12px 14px;color:var(--t-text);font-size:13px;font-family:'Cairo',sans-serif;outline:none;width:100%}
.modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:26px;padding-top:22px;border-top:1px solid var(--t-border)}

/* TIMELINE */
.timeline-track{position:relative;padding-right:40px}
.timeline-track::before{content:'';position:absolute;right:14px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--gold),rgba(212,168,67,.06))}
.tl-item{position:relative;margin-bottom:22px;animation:slideIn .35s ease}
.tl-node{position:absolute;right:-34px;top:3px;width:18px;height:18px;border-radius:50%;border:2.5px solid;background:var(--t-bg);display:flex;align-items:center;justify-content:center;font-size:8px}
.tl-node.done{border-color:var(--gold);background:var(--gold);color:#1a1000}
.tl-date{font-size:10px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:3px;font-weight:700}
.tl-event{font-size:14px;color:var(--t-text);font-weight:700}

/* TOAST */
.toast{position:fixed;top:28px;left:50%;transform:translateX(-50%);z-index:99999;padding:13px 26px;border-radius:100px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:10px;animation:notif 3.2s cubic-bezier(.34,1.2,.64,1) forwards;box-shadow:0 12px 50px rgba(0,0,0,.45)}
.toast.success{background:rgba(62,200,160,.22);border:1.5px solid rgba(62,200,160,.5);color:#25f0be}

@media(max-width:900px){
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .charts-row{grid-template-columns:1fr}
  .sidebar{position:fixed;right:0;top:0;bottom:0;z-index:100;transform:translateX(100%)}
  .sidebar.open{transform:translateX(0)}
}
`;

/* ─────────────────────────────────────────────
   DATA (بيانات عربية)
───────────────────────────────────────────── */
const INITIAL_DOSSIERS = [
  { id: "جنائي-2024-0089", justiciable: "يوسف بنعلي", type: "جنائي", statut: "قيد المعالجة", juge: "الأستاذ العلمي", date: "12/01/2024", objet: "نزاع تجاري ناتج عن عدم سداد الديون", audience: "22/05/2024", priorite: "عالية" },
  { id: "مدني-2024-0214", justiciable: "شركة ورزازات العقارية", type: "مدني", statut: "مؤجل", juge: "الأستاذة بناني", date: "05/02/2024", objet: "نزاع عقاري — بقعة أرضية رقم 4421", audience: "18/06/2024", priorite: "عادية" },
  { id: "أسري-2024-0031", justiciable: "أمل الراشدي", type: "أسري", statut: "مغلق", juge: "الأستاذ طاهري", date: "20/01/2024", objet: "طلب حضانة الأطفال بعد الطلاق", audience: "—", priorite: "عالية" },
  { id: "تجاري-2024-0056", justiciable: "أطلس استيراد ش.م.م", type: "تجاري", statut: "قيد المعالجة", juge: "الأستاذة بناني", date: "08/03/2024", objet: "منازعة في براءة اختراع صناعية", audience: "30/05/2024", priorite: "عادية" },
];

const USERS = [
  { username: "admin", password: "Justice2024!", role: "مدير النظام", name: "المسؤول القضائي" },
];

const TYPES = ["جنائي", "مدني", "أسري", "تجاري"];
const STATUTS = ["قيد المعالجة", "مؤجل", "مغلق"];
const JUGES = ["الأستاذ العلمي", "الأستاذة بناني", "الأستاذ طاهري", "الأستاذة الفاسي"];
const PRIORITES = ["عالية", "عادية", "منخفضة"];

const TL_TEMPLATES = {
  "قيد المعالجة": [
    { date: "يوم +0", event: "إيداع الملف", note: "تسجيل الملف وتعيين الرقم الترتيبي", status: "done" },
    { date: "يوم +16", event: "الجلسة الأولى", note: "مثول الأطراف أمام المحكمة", status: "done" },
    { date: "يوم +45", event: "البحث والتحقيق", note: "جمع الوثائق والخبرات التقنية", status: "active" },
    { date: "قيد البرمجة", event: "المرافعة", note: "في انتظار تحديد تاريخ الجلسة", status: "pending" },
  ],
  "مغلق": [
    { date: "يوم +0", event: "إيداع الملف", note: "التسجيل الأولي", status: "done" },
    { date: "يوم +90", event: "صدور الحكم", note: "تبليغ القرار النهائي للأطراف", status: "done" },
  ],
};

/* helpers */
const colorOf = (type) => ({ "جنائي":"badge-penal", "مدني":"badge-civil", "أسري":"badge-familial", "تجاري":"badge-commercial" }[type] || "badge-civil");
const statOf = (s) => ({ "قيد المعالجة":"badge-encours", "مؤجل":"badge-reporte", "مغلق":"badge-cloture" }[s] || "badge-encours");
const judgeColors = ["#4FACDE","#3EC8A0","#D4A843","#E05C6E"];

/* ─────────────────────────────────────────────
   COMPONENTS (مكونات الواجهة)
───────────────────────────────────────────── */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}><span>{type === "success" ? "✓" : "ℹ"}</span>{msg}</div>;
}

function DonutChart({ data, total }) {
  const size = 130, r = 48, cx = 65, cy = 65, circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="donut-container">
      <div className="donut-rel">
        <svg width={size} height={size} className="donut-svg">
          {data.map((d, i) => {
            const pct = d.val / total, offset = circ * (1 - cum), dash = circ * pct;
            cum += pct;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={16} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} />;
          })}
        </svg>
        <div className="donut-center-text">
          <span className="donut-big">{total}</span>
          <span style={{ fontSize: 9, color: "var(--t-muted)" }}>الإجمالي</span>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-row">
            <span className="legend-sq" style={{ background: d.color }} />
            <span>{d.label}</span>
            <span className="legend-pct">{d.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const BAR_DATA = [
    { m: "يناير", v: 68 }, { m: "فبراير", v: 82 }, { m: "مارس", v: 74 }, { m: "أبريل", v: 95 },
    { m: "ماي", v: 88 }, { m: "يونيو", v: 103 }, { m: "يوليوز", v: 91 }, { m: "غشت", v: 77 },
  ];
  const maxBar = Math.max(...BAR_DATA.map(d => d.v));
  return (
    <div className="bars">
      {BAR_DATA.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-rect" style={{ height: `${(d.v / maxBar) * 110}px`, background: i === 5 ? "var(--gold)" : "var(--t-border2)" }} />
          <span className="bar-mlabel">{d.m}</span>
        </div>
      ))}
    </div>
  );
}

function TimelineModal({ dossier, onClose }) {
  const events = TL_TEMPLATES[dossier.statut] || TL_TEMPLATES["قيد المعالجة"];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">📋 الجدول الزمني للملف</div>
        <div className="timeline-track">
          {events.map((e, i) => (
            <div key={i} className="tl-item">
              <div className={`tl-node ${e.status}`}>{e.status === "done" ? "✓" : ""}</div>
              <div className="tl-date">{e.date}</div>
              <div className="tl-event">{e.event}</div>
              <div style={{ fontSize: 12, color: "var(--t-muted)" }}>{e.note}</div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="topbar-btn btn-ghost" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function DossierModal({ dossier, onSave, onClose }) {
  const [form, setForm] = useState(dossier || { id: "", justiciable: "", type: "مدني", statut: "قيد المعالجة", juge: JUGES[0], date: "2024/04/26", objet: "", audience: "قيد البرمجة", priorite: "عادية" });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{dossier ? "✏️ تعديل ملف" : "➕ ملف جديد"}</div>
        <div className="form-grid">
          <div className="form-group full"><label className="form-label">رقم الملف *</label><input className="form-input" value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!dossier} /></div>
          <div className="form-group full"><label className="form-label">المتقاضي *</label><input className="form-input" value={form.justiciable} onChange={e => setForm({...form, justiciable: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">النوع</label><select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="form-group"><label className="form-label">الحالة</label><select className="form-select" value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}>{STATUTS.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group full"><label className="form-label">موضوع النزاع</label><textarea className="form-textarea" value={form.objet} onChange={e => setForm({...form, objet: e.target.value})} /></div>
        </div>
        <div className="modal-footer">
          <button className="topbar-btn btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="topbar-btn btn-primary" onClick={() => onSave(form)}>حفظ البيانات</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGES (الصفحات)
───────────────────────────────────────────── */
function DashboardPage({ dossiers }) {
  const total = dossiers.length;
  const c1 = useCounter(total);
  const donutData = TYPES.map(t => ({ label: t, val: dossiers.filter(d => d.type === t).length, color: judgeColors[TYPES.indexOf(t)] })).filter(d => d.val > 0);

  return (
    <div className="page-content">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-accent" style={{ background: "var(--sky)" }} /><div className="kpi-val">{c1}</div><div className="kpi-label">إجمالي الملفات</div></div>
        <div className="kpi-card"><div className="kpi-accent" style={{ background: "var(--mint)" }} /><div className="kpi-val">{dossiers.filter(d => d.statut === "مغلق").length}</div><div className="kpi-label">ملفات مغلقة</div></div>
        <div className="kpi-card"><div className="kpi-accent" style={{ background: "var(--amber)" }} /><div className="kpi-val">{dossiers.filter(d => d.statut === "مؤجل").length}</div><div className="kpi-label">ملفات مؤجلة</div></div>
        <div className="kpi-card"><div className="kpi-accent" style={{ background: "var(--gold)" }} /><div className="kpi-val">{dossiers.filter(d => d.priorite === "عالية").length}</div><div className="kpi-label">أولوية عالية</div></div>
      </div>
      <div className="charts-row">
        <div className="chart-card"><div className="chart-title">التطور الشهري للملفات</div><BarChart /></div>
        <div className="chart-card"><div className="chart-title">التوزيع حسب النوع</div><DonutChart data={donutData} total={total} /></div>
      </div>
    </div>
  );
}

function DossiersPage({ dossiers, onAdd, onDelete, onView, onEdit }) {
  const [search, setSearch] = useState("");
  const filtered = dossiers.filter(d => d.id.includes(search) || d.justiciable.includes(search));

  return (
    <div className="page-content">
      <div className="section-card">
        <div className="section-head">
          <div className="search-box"><span>🔍</span><input placeholder="بحث برقم الملف أو الاسم..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button className="topbar-btn btn-primary" onClick={onAdd}>➕ إضافة ملف</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr><th>رقم الملف</th><th>المتقاضي</th><th>النوع</th><th>الحالة</th><th>القاضي</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td style={{ color: "var(--gold)", fontWeight: 700 }}>{d.id}</td>
                  <td>{d.justiciable}</td>
                  <td><span className={`badge ${colorOf(d.type)}`}>{d.type}</span></td>
                  <td><span className={`badge ${statOf(d.statut)}`}>{d.statut}</span></td>
                  <td>{d.juge}</td>
                  <td>
                    <div className="action-btns">
                      <button className="act-btn" onClick={() => onView(d)}>📋</button>
                      <button className="act-btn" onClick={() => onEdit(d)}>✏️</button>
                      <button className="act-btn" style={{ color: "var(--rose)" }} onClick={() => onDelete(d)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP (التطبيق الرئيسي)
───────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [dossiers, setDossiers] = useState(INITIAL_DOSSIERS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const el = document.createElement("style"); el.textContent = CSS; document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [theme]);

  if (!user) return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-ring">⚖️</div>
        <div className="login-title">بوابة العدالة</div>
        <div className="login-sub">لوحة التحليل القضائي — دخول آمن</div>
        <button className="login-btn" onClick={() => { setUser(USERS[0]); setToast({ msg: "مرحباً بك في النظام", type: "success" }); }}>دخول بصفتي مدير النظام</button>
        <div className="login-hint">نظام تجريبي للإدارة القضائية الذكية</div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-icon">⚖️</div><div><div className="sidebar-logo-text">بوابة العدالة</div></div></div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}><span>📊</span> لوحة القيادة</div>
          <div className={`nav-item ${page === "dossiers" ? "active" : ""}`} onClick={() => setPage("dossiers")}><span>📁</span> إدارة الملفات <span className="nav-badge">{dossiers.length}</span></div>
          <div className="nav-item" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><span>🌓</span> {theme === "dark" ? "الوضع المضيء" : "الوضع الليلي"}</div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">م</div>
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>{user.name}</div><div style={{ fontSize: 10, color: "var(--gold)" }}>{user.role}</div></div>
          <button className="logout-btn" onClick={() => setUser(null)}>⏏</button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="page-title">{page === "dashboard" ? "الإحصائيات العامة" : "لائحة الملفات القضائية"}</div>
          <div className="topbar-right">
            <button className="topbar-btn btn-primary" onClick={() => setModal("add")}>➕ إضافة ملف جديد</button>
          </div>
        </header>

        {page === "dashboard" ? <DashboardPage dossiers={dossiers} /> : <DossiersPage dossiers={dossiers} onAdd={() => setModal("add")} onDelete={(d) => setDossiers(dossiers.filter(x => x.id !== d.id))} onView={(d) => { setSelected(d); setModal("view"); }} onEdit={(d) => { setSelected(d); setModal("edit"); }} />}
      </div>

      {modal === "view" && <TimelineModal dossier={selected} onClose={() => setModal(null)} />}
      {(modal === "add" || modal === "edit") && <DossierModal dossier={selected} onClose={() => { setModal(null); setSelected(null); }} onSave={(d) => { 
        if(modal === "edit") setDossiers(dossiers.map(x => x.id === d.id ? d : x));
        else setDossiers([d, ...dossiers]);
        setModal(null); setSelected(null); setToast({ msg: "تم حفظ البيانات بنجاح", type: "success" });
      }} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}