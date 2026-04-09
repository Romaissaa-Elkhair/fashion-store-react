import { useState, useEffect, useRef, useMemo } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

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
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--t-bg);color:var(--t-text);min-height:100vh;overflow-x:hidden;transition:background .35s,color .35s}

/* SCROLLBAR */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--t-border2);border-radius:10px}

/* ANIMATIONS */
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,.45)}50%{box-shadow:0 0 0 12px rgba(212,168,67,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes gradShimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
@keyframes notif{0%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(.93)}12%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}85%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}100%{opacity:0;transform:translateX(-50%) translateY(-18px) scale(.96)}}
@keyframes borderGlow{0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,.2)}50%{box-shadow:0 0 20px 2px rgba(212,168,67,.12)}}

/* GRADIENT TEXT */
.gt-gold{background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 40%,var(--amber) 80%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 5s linear infinite}
.gt-sky{background:linear-gradient(110deg,var(--sky),var(--mint));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gt-rose{background:linear-gradient(110deg,var(--rose),var(--amber));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* THEME TOGGLE */
.theme-toggle{width:48px;height:27px;border-radius:100px;border:none;cursor:pointer;position:relative;padding:0;transition:background .3s;flex-shrink:0;outline:none}
.theme-toggle.dark-mode{background:linear-gradient(135deg,#1C1F38,#2C3058);border:1.5px solid #3A3F68}
.theme-toggle.light-mode{background:linear-gradient(135deg,var(--gold2),var(--gold))}
.theme-toggle-thumb{position:absolute;top:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:left .3s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.theme-toggle.dark-mode .theme-toggle-thumb{left:3px}
.theme-toggle.light-mode .theme-toggle-thumb{left:24px;background:#1a1000}
.theme-toggle-label{font-size:11px;color:var(--t-muted);white-space:nowrap;font-weight:600}

/* LOGIN */
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--t-bg);position:relative;overflow:hidden;transition:background .35s}
.login-bg-orb{position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none}
.login-card{background:var(--t-card);border:1px solid var(--t-border2);border-radius:28px;padding:52px 48px;width:448px;max-width:95vw;position:relative;z-index:1;animation:scaleIn .5s cubic-bezier(.34,1.2,.64,1);box-shadow:0 40px 100px rgba(0,0,0,.4),0 0 0 1px rgba(212,168,67,.1),inset 0 1px 0 rgba(255,255,255,.04);transition:background .35s,border-color .35s}
.login-logo-ring{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--sky));display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 18px;box-shadow:0 8px 32px rgba(212,168,67,.4);animation:pulse 2.5s ease infinite}
.login-title{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;text-align:center;margin-bottom:6px;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 40%,var(--amber) 80%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 4s linear infinite}
.login-sub{text-align:center;font-size:13px;color:var(--t-muted);margin-bottom:8px;line-height:1.5}
.login-login-theme-row{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:26px;padding:10px 16px;background:rgba(255,255,255,.03);border-radius:12px;border:1px solid var(--t-border)}
.login-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--t-muted);margin-bottom:8px;display:block;font-weight:700}
.login-input-wrap{position:relative;margin-bottom:18px}
.login-input{width:100%;padding:14px 18px;background:var(--t-input);border:1.5px solid var(--t-border);border-radius:12px;color:var(--t-text);font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border-color .25s,box-shadow .25s,background .35s}
.login-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,168,67,.18)}
.login-input::placeholder{color:var(--t-muted2)}
.login-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--t-muted);font-size:16px;padding:4px}
.login-btn{width:100%;padding:15px;background:linear-gradient(110deg,var(--gold),var(--amber),var(--gold));background-size:200% auto;border:none;border-radius:12px;color:#1a1000;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;letter-spacing:.4px;transition:transform .2s,box-shadow .2s,background-position .4s;margin-top:8px}
.login-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(212,168,67,.5);background-position:right center}
.login-btn:active{transform:translateY(0)}
.login-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.login-error{background:rgba(224,92,110,.1);border:1px solid rgba(224,92,110,.3);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--rose);text-align:center;margin-top:12px;animation:fadeIn .3s ease}
.login-hint{text-align:center;font-size:12px;color:var(--t-muted2);margin-top:20px;padding-top:18px;border-top:1px solid var(--t-border)}
.login-hint strong{color:var(--gold);font-weight:700}
.login-orb-spin{position:absolute;width:300px;height:300px;border:1px solid rgba(212,168,67,.05);border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);animation:spin 25s linear infinite}
.login-orb-spin2{position:absolute;width:180px;height:180px;border:1px solid rgba(79,172,222,.06);border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);animation:spin 15s linear infinite reverse}

/* APP LAYOUT */
.app-layout{display:flex;height:100vh;overflow:hidden}

/* SIDEBAR */
.sidebar{width:var(--sidebar-w);flex-shrink:0;background:var(--t-sidebar);border-right:1px solid var(--t-border);display:flex;flex-direction:column;overflow:hidden;position:relative;transition:background .35s,border-color .35s;box-shadow:4px 0 30px rgba(0,0,0,.15)}
.sidebar::after{content:'';position:absolute;top:20%;right:0;height:60%;width:1px;background:linear-gradient(to bottom,transparent,rgba(212,168,67,.3),transparent)}
.sidebar-logo{padding:22px 18px 18px;border-bottom:1px solid var(--t-border);display:flex;align-items:center;gap:12px}
.sidebar-logo-icon{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--gold),var(--amber));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 6px 22px rgba(212,168,67,.38)}
.sidebar-logo-text{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;line-height:1.1;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-logo-sub{font-size:10px;color:var(--t-muted);letter-spacing:1px;text-transform:uppercase;margin-top:3px}
.sidebar-nav{flex:1;overflow-y:auto;padding:12px 10px}
.nav-section-title{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--t-muted2);padding:14px 14px 6px;font-weight:700}
.nav-item{display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:12px;font-size:13px;font-weight:500;color:var(--t-muted);cursor:pointer;transition:all .22s;margin-bottom:3px;border:1px solid transparent}
.nav-item:hover{background:var(--t-card2);color:var(--t-text);border-color:var(--t-border)}
.nav-item.active{background:linear-gradient(135deg,rgba(212,168,67,.15),rgba(212,168,67,.05));color:var(--gold);border-color:rgba(212,168,67,.28);font-weight:600;box-shadow:inset 0 0 0 0 transparent}
.nav-item.active .nav-icon{filter:drop-shadow(0 0 8px rgba(212,168,67,.7))}
.nav-icon{font-size:16px;width:22px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:linear-gradient(135deg,var(--gold),var(--amber));color:#1a1000;font-size:10px;font-weight:800;padding:2px 9px;border-radius:100px;box-shadow:0 3px 10px rgba(212,168,67,.35)}
.sidebar-user{padding:14px 16px;border-top:1px solid var(--t-border);display:flex;align-items:center;gap:11px;background:rgba(0,0,0,.08)}
.user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--sky),var(--mint));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 3px 12px rgba(79,172,222,.3)}
.user-name{font-size:13px;font-weight:700;color:var(--t-text)}
.user-role{font-size:10px;color:var(--gold);letter-spacing:.6px;font-weight:600;text-transform:uppercase}
.logout-btn{margin-left:auto;background:none;border:none;color:var(--t-muted2);cursor:pointer;font-size:16px;padding:7px;border-radius:9px;transition:all .2s}
.logout-btn:hover{color:var(--rose);background:rgba(224,92,110,.1)}

/* MAIN */
.main-content{flex:1;overflow-y:auto;display:flex;flex-direction:column;background:var(--t-page-bg);transition:background .35s}

/* TOPBAR */
.topbar{padding:14px 28px;display:flex;align-items:center;justify-content:space-between;background:var(--t-topbar);border-bottom:1px solid var(--t-border);position:sticky;top:0;z-index:10;backdrop-filter:blur(20px);transition:background .35s,border-color .35s;box-shadow:0 2px 20px rgba(0,0,0,.08)}
.page-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 45%,var(--amber) 90%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 5s linear infinite}
.page-sub{font-size:11.5px;color:var(--t-muted);margin-top:3px;font-weight:400}
.topbar-right{display:flex;align-items:center;gap:10px}
.topbar-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;transition:all .22s;border:none;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:.2px}
.btn-primary{background:linear-gradient(135deg,var(--gold),var(--amber));color:#1a1000;box-shadow:0 4px 18px rgba(212,168,67,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(212,168,67,.45)}
.btn-ghost{background:var(--t-card2);color:var(--t-muted);border:1px solid var(--t-border)}
.btn-ghost:hover{background:var(--t-card);color:var(--t-text);border-color:var(--t-border2)}
.btn-danger{background:rgba(224,92,110,.1);color:var(--rose);border:1px solid rgba(224,92,110,.28)}
.btn-danger:hover{background:rgba(224,92,110,.2)}

/* PAGE */
.page-content{padding:26px 28px;animation:fadeSlideUp .4s ease}

/* KPI */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}}
.kpi-card{border-radius:20px;padding:22px;position:relative;overflow:hidden;cursor:default;transition:transform .28s,box-shadow .28s,background .35s;border:1px solid var(--t-border);background:var(--t-card)}
.kpi-card::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 60%);border-radius:20px;pointer-events:none}
.kpi-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.25)}
.kpi-card.light{background:var(--t-card2)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:20px 20px 0 0}
.kpi-icon-wrap{width:48px;height:48px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px}
.kpi-val{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;line-height:1;margin-bottom:5px;color:var(--t-text)}
.kpi-label{font-size:12px;color:var(--t-muted);font-weight:500;letter-spacing:.3px}
.kpi-trend{display:flex;align-items:center;gap:4px;font-size:11px;margin-top:14px;font-weight:600}
.trend-up{color:var(--mint)}
.trend-dn{color:var(--rose)}

/* CHARTS */
.charts-row{display:grid;grid-template-columns:1.6fr 1fr;gap:16px;margin-bottom:24px}
@media(max-width:900px){.charts-row{grid-template-columns:1fr}}
.chart-card{background:var(--t-card);border:1px solid var(--t-border);border-radius:20px;padding:24px;transition:background .35s,border-color .35s;position:relative;overflow:hidden}
.chart-card.light-card{background:var(--t-card2)}
.chart-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px}
.chart-title{font-size:13px;font-weight:700;letter-spacing:.2px;background:linear-gradient(110deg,var(--sky),var(--mint));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.chart-sub{font-size:11px;color:var(--t-muted);margin-top:3px}

/* BARS */
.bars{display:flex;align-items:flex-end;gap:7px;height:124px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%;justify-content:flex-end}
.bar-rect{width:100%;border-radius:6px 6px 0 0;cursor:pointer;transition:opacity .2s,transform .2s;min-height:4px}
.bar-rect:hover{opacity:.78;transform:scaleY(1.07);transform-origin:bottom}
.bar-mlabel{font-size:8.5px;color:var(--t-muted);letter-spacing:.2px}

/* DONUT */
.donut-container{display:flex;flex-direction:column;align-items:center;gap:18px}
.donut-rel{position:relative;width:134px;height:134px}
.donut-svg{transform:rotate(-90deg)}
.donut-center-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.donut-big{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;line-height:1;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.donut-tiny{font-size:9px;color:var(--t-muted);letter-spacing:1.2px;text-transform:uppercase;margin-top:3px}
.donut-legend{width:100%;display:flex;flex-direction:column;gap:9px}
.legend-row{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--t-muted);cursor:default;font-weight:500}
.legend-sq{width:10px;height:10px;border-radius:3px;flex-shrink:0}
.legend-pct{margin-left:auto;font-size:12px;font-weight:700;color:var(--t-text)}

/* SECTION CARD */
.section-card{background:var(--t-card);border:1px solid var(--t-border);border-radius:20px;overflow:hidden;margin-bottom:24px;transition:background .35s,border-color .35s}
.section-card.light-section{background:var(--t-card2)}
.section-head{padding:18px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--t-border);flex-wrap:wrap;gap:12px;background:linear-gradient(135deg,rgba(212,168,67,.05),rgba(79,172,222,.03))}
.section-title-text{font-size:14px;font-weight:700;background:linear-gradient(110deg,var(--gold2),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* SEARCH */
.search-box{display:flex;align-items:center;gap:8px;background:var(--t-input);border:1.5px solid var(--t-border);border-radius:12px;padding:10px 15px;width:300px;max-width:100%;transition:border-color .25s,box-shadow .25s,background .35s}
.search-box:focus-within{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,168,67,.15)}
.search-box input{background:none;border:none;outline:none;font-size:13px;color:var(--t-text);flex:1;font-family:'Plus Jakarta Sans',sans-serif}
.search-box input::placeholder{color:var(--t-muted2)}
.search-icon-i{font-size:14px;color:var(--t-muted)}

/* TABLE */
.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--t-muted);padding:13px 20px;text-align:left;border-bottom:1px solid var(--t-border);background:rgba(0,0,0,.04);white-space:nowrap}
.data-table td{padding:15px 20px;font-size:13px;color:var(--t-text);border-bottom:1px solid var(--t-border);transition:background .15s;vertical-align:middle}
.data-table tr:last-child td{border-bottom:none}
.data-table tbody tr:hover td{background:rgba(212,168,67,.05)}
.tr-anim{animation:slideIn .3s ease}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:600;border:1px solid;letter-spacing:.2px}
.badge-penal{background:rgba(224,92,110,.12);color:var(--rose);border-color:rgba(224,92,110,.3)}
.badge-civil{background:rgba(79,172,222,.12);color:var(--sky);border-color:rgba(79,172,222,.3)}
.badge-familial{background:rgba(62,200,160,.12);color:var(--mint);border-color:rgba(62,200,160,.3)}
.badge-commercial{background:rgba(212,168,67,.12);color:var(--gold);border-color:rgba(212,168,67,.3)}
.badge-encours{background:rgba(79,172,222,.1);color:var(--sky);border-color:rgba(79,172,222,.25)}
.badge-reporte{background:rgba(242,140,56,.1);color:var(--amber);border-color:rgba(242,140,56,.25)}
.badge-cloture{background:rgba(62,200,160,.1);color:var(--mint);border-color:rgba(62,200,160,.25)}

/* ACTIONS */
.action-btns{display:flex;gap:6px}
.act-btn{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;border:1px solid var(--t-border);transition:all .2s;background:var(--t-card2);color:var(--t-muted)}
.act-btn:hover.view-btn{background:rgba(79,172,222,.15);color:var(--sky);border-color:rgba(79,172,222,.3)}
.act-btn:hover.del-btn{background:rgba(224,92,110,.15);color:var(--rose);border-color:rgba(224,92,110,.3)}

.empty-state{padding:70px 20px;text-align:center;color:var(--t-muted)}
.empty-icon{font-size:48px;margin-bottom:16px;opacity:.35}
.empty-text{font-size:14px;font-weight:500}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:fadeIn .2s ease}
.modal-box{background:var(--t-card);border:1px solid var(--t-border2);border-radius:24px;width:560px;max-width:100%;max-height:90vh;overflow-y:auto;padding:36px;animation:scaleIn .25s cubic-bezier(.34,1.2,.64,1);box-shadow:0 30px 90px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.04);transition:background .35s}
.modal-title{font-family:'Playfair Display',serif;font-size:23px;font-weight:700;margin-bottom:28px;display:flex;align-items:center;gap:10px;background:linear-gradient(110deg,var(--gold2) 0%,var(--gold) 45%,var(--amber) 90%,var(--gold2) 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShimmer 4s linear infinite}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-group{display:flex;flex-direction:column;gap:7px}
.form-group.full{grid-column:1/-1}
.form-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--t-muted);font-weight:700}
.form-input,.form-select,.form-textarea{background:var(--t-input);border:1.5px solid var(--t-border);border-radius:11px;padding:12px 14px;color:var(--t-text);font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:border-color .25s,box-shadow .25s,background .35s;width:100%}
.form-textarea{resize:vertical;min-height:80px}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,168,67,.15)}
.form-input::placeholder{color:var(--t-muted2)}
.form-select option{background:var(--t-card);color:var(--t-text)}
.modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:26px;padding-top:22px;border-top:1px solid var(--t-border)}

/* TIMELINE */
.timeline-modal{width:640px}
.tl-header{background:linear-gradient(135deg,rgba(212,168,67,.08),rgba(79,172,222,.07));border:1px solid var(--t-border2);border-radius:16px;padding:20px;margin-bottom:24px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
.tl-field{display:flex;flex-direction:column;gap:4px}
.tl-field-label{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:var(--t-muted);font-weight:700}
.tl-field-val{font-size:14px;color:var(--t-text);font-weight:600}
.timeline-track{position:relative;padding-left:40px}
.timeline-track::before{content:'';position:absolute;left:14px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--gold),rgba(212,168,67,.06))}
.tl-item{position:relative;margin-bottom:22px;animation:slideIn .35s ease}
.tl-node{position:absolute;left:-34px;top:3px;width:18px;height:18px;border-radius:50%;border:2.5px solid;background:var(--t-bg);display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800}
.tl-node.done{border-color:var(--gold);background:var(--gold);color:#1a1000}
.tl-node.active{border-color:var(--sky);animation:pulse 2s infinite}
.tl-node.pending{border-color:var(--t-border2)}
.tl-date{font-size:10px;letter-spacing:1.2px;color:var(--gold-dim);text-transform:uppercase;margin-bottom:3px;font-weight:700}
.tl-event{font-size:14px;color:var(--t-text);font-weight:700}
.tl-note{font-size:12px;color:var(--t-muted);margin-top:3px;line-height:1.5}

/* STATS */
.stat-full-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
@media(max-width:800px){.stat-full-grid{grid-template-columns:1fr}}
.big-chart-card{background:var(--t-card);border:1px solid var(--t-border);border-radius:20px;padding:24px;transition:background .35s,border-color .35s}
.big-chart-card.lc{background:var(--t-card2)}
.judge-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--t-border)}
.judge-row:last-child{border:none}
.judge-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.judge-name{font-size:13px;color:var(--t-text);font-weight:700}
.judge-count{font-size:11px;color:var(--t-muted)}
.judge-pct{margin-left:auto;font-size:12px;font-weight:700;color:var(--gold)}
.progress-item{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.progress-name{font-size:12px;color:var(--t-muted);min-width:80px;font-weight:500}
.progress-track{flex:1;height:7px;background:var(--t-border);border-radius:100px;overflow:hidden}
.progress-fill{height:100%;border-radius:100px;transition:width .9s cubic-bezier(.34,1.2,.64,1)}
.progress-count{font-size:12px;font-weight:700;color:var(--t-text);min-width:28px;text-align:right}

/* TOAST */
.toast{position:fixed;top:28px;left:50%;transform:translateX(-50%);z-index:99999;padding:13px 26px 13px 16px;border-radius:100px;font-size:13px;font-weight:700;display:flex;align-items:center;gap:10px;animation:notif 3.2s cubic-bezier(.34,1.2,.64,1) forwards;box-shadow:0 12px 50px rgba(0,0,0,.45),0 2px 0 rgba(255,255,255,.06) inset;white-space:nowrap;backdrop-filter:blur(18px);letter-spacing:.2px}
.toast-icon{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0}
.toast.success{background:rgba(62,200,160,.22);border:1.5px solid rgba(62,200,160,.5);color:#25f0be}
.toast.success .toast-icon{background:rgba(62,200,160,.3);color:#25f0be}
.toast.error{background:rgba(224,92,110,.22);border:1.5px solid rgba(224,92,110,.5);color:#ff7a8a}
.toast.error .toast-icon{background:rgba(224,92,110,.3);color:#ff7a8a}
.toast.info{background:rgba(79,172,222,.22);border:1.5px solid rgba(79,172,222,.5);color:#7dd4f8}
.toast.info .toast-icon{background:rgba(79,172,222,.3);color:#7dd4f8}

/* MOBILE */
.hamburger{display:none;background:var(--t-card2);border:1px solid var(--t-border);border-radius:9px;padding:8px;cursor:pointer;color:var(--t-text);font-size:18px}
@media(max-width:700px){
  .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s}
  .sidebar.open{transform:translateX(0)}
  .main-content{width:100%}
  .kpi-grid{grid-template-columns:1fr 1fr}
  .topbar{padding:12px 16px}
  .page-content{padding:16px}
  .charts-row{grid-template-columns:1fr}
  .hamburger{display:flex}
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const INITIAL_DOSSIERS = [
  { id: "PEN-2024-0089", justiciable: "Benali Youssef", type: "Penal", statut: "En cours", juge: "M. Alami", date: "12/01/2024", objet: "Litige commercial suite à non-paiement de créances", audience: "22/05/2024", priorite: "Haute" },
  { id: "CIV-2024-0214", justiciable: "Ouarzazate SCI", type: "Civil", statut: "Reporté", juge: "Mme. Bennani", date: "05/02/2024", objet: "Litige foncier — parcelle cadastrale #4421", audience: "18/06/2024", priorite: "Normale" },
  { id: "FAM-2024-0031", justiciable: "Rachidi Amal", type: "Familial", statut: "Clôturé", juge: "M. Tahiri", date: "20/01/2024", objet: "Demande de garde d'enfants suite à divorce", audience: "—", priorite: "Haute" },
  { id: "COM-2024-0056", justiciable: "Atlas Import SARL", type: "Commercial", statut: "En cours", juge: "Mme. Bennani", date: "08/03/2024", objet: "Contestation de brevet industriel", audience: "30/05/2024", priorite: "Normale" },
  { id: "PEN-2024-0102", justiciable: "Moussaoui Karim", type: "Penal", statut: "En cours", juge: "M. Alami", date: "15/03/2024", objet: "Affaire de fraude documentaire", audience: "10/06/2024", priorite: "Haute" },
  { id: "CIV-2024-0301", justiciable: "Doukkali Fatima", type: "Civil", statut: "Clôturé", juge: "M. Tahiri", date: "02/04/2024", objet: "Recours contre décision administrative", audience: "—", priorite: "Basse" },
  { id: "FAM-2024-0078", justiciable: "Tazi Mohammed", type: "Familial", statut: "Reporté", juge: "Mme. El Fassi", date: "10/04/2024", objet: "Pension alimentaire — révision montant", audience: "25/06/2024", priorite: "Normale" },
  { id: "COM-2024-0099", justiciable: "Maroc Tech SA", type: "Commercial", statut: "En cours", juge: "Mme. El Fassi", date: "18/04/2024", objet: "Résiliation abusive de contrat de service", audience: "15/07/2024", priorite: "Haute" },
];

const USERS = [
  { username: "admin", password: "Justice2024!", role: "Administrateur", name: "Responsable Juridiction" },
  { username: "greffier1", password: "Greffe@2024", role: "Greffier", name: "M. Hassan Karimi" },
  { username: "juge.alami", password: "Juge#Alami", role: "Magistrat", name: "M. Alami" },
];

const TYPES = ["Penal", "Civil", "Familial", "Commercial"];
const STATUTS = ["En cours", "Reporté", "Clôturé"];
const JUGES = ["M. Alami", "Mme. Bennani", "M. Tahiri", "Mme. El Fassi"];
const PRIORITES = ["Haute", "Normale", "Basse"];

const TL_TEMPLATES = {
  "En cours": [
    { date: "J+0", event: "Dépôt du dossier", note: "Enregistrement et attribution du numéro", status: "done" },
    { date: "J+16", event: "Première audience", note: "Comparution des parties", status: "done" },
    { date: "J+45", event: "Instruction en cours", note: "Collecte des pièces et expertises", status: "active" },
    { date: "À planifier", event: "Plaidoiries", note: "Date en attente de fixation", status: "pending" },
    { date: "À planifier", event: "Jugement", note: "Délibération du tribunal", status: "pending" },
  ],
  "Reporté": [
    { date: "J+0", event: "Dépôt du dossier", note: "Enregistrement validé", status: "done" },
    { date: "J+20", event: "Première audience", note: "Présence des parties", status: "done" },
    { date: "J+38", event: "Report accordé", note: "Demande de la défense — délai supplémentaire", status: "done" },
    { date: "Prochainement", event: "Reprise d'audience", note: "En attente de nouvelle date", status: "active" },
  ],
  "Clôturé": [
    { date: "J+0", event: "Dépôt du dossier", note: "Enregistrement initial", status: "done" },
    { date: "J+18", event: "Première audience", note: "Ouverture des débats", status: "done" },
    { date: "J+42", event: "Deuxième audience", note: "Présentation des preuves et témoins", status: "done" },
    { date: "J+75", event: "Plaidoiries", note: "Réquisitoire et plaidoiries des avocats", status: "done" },
    { date: "J+90", event: "Jugement rendu", note: "Décision définitive notifiée aux parties", status: "done" },
  ],
};

/* helpers */
const colorOf = (type) => ({ Penal:"badge-penal", Civil:"badge-civil", Familial:"badge-familial", Commercial:"badge-commercial" }[type] || "badge-civil");
const statOf = (s) => ({ "En cours":"badge-encours", "Reporté":"badge-reporte", "Clôturé":"badge-cloture" }[s] || "badge-encours");
const judgeColors = ["#4FACDE","#3EC8A0","#D4A843","#E05C6E","#F28C38","#A78BFA"];

/* ─────────────────────────────────────────────
   COUNTER HOOK
───────────────────────────────────────────── */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  const icons = { success: "✓", error: "✗", info: "ℹ" };
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────── */
function DonutChart({ data, total }) {
  const size = 130, r = 48, cx = 65, cy = 65;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="donut-container">
      <div className="donut-rel">
        <svg width={size} height={size} className="donut-svg">
          {data.map((d, i) => {
            const pct = d.val / total;
            const offset = circ * (1 - cum);
            const dash = circ * pct;
            cum += pct;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={16} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} strokeLinecap="butt" />;
          })}
        </svg>
        <div className="donut-center-text">
          <span className="donut-big">{total}</span>
          <span className="donut-tiny">Total</span>
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

/* ─────────────────────────────────────────────
   BAR CHART
───────────────────────────────────────────── */
const BAR_DATA = [
  { m: "Jan", v: 68 }, { m: "Fév", v: 82 }, { m: "Mar", v: 74 }, { m: "Avr", v: 95 },
  { m: "Mai", v: 88 }, { m: "Jun", v: 103 }, { m: "Juil", v: 91 }, { m: "Aoû", v: 77 },
  { m: "Sep", v: 115 }, { m: "Oct", v: 98 }, { m: "Nov", v: 126 }, { m: "Déc", v: 112 },
];
const maxBar = Math.max(...BAR_DATA.map(d => d.v));

function BarChart() {
  return (
    <div className="bars">
      {BAR_DATA.map((d, i) => (
        <div key={i} className="bar-col">
          <div className="bar-rect" title={`${d.m}: ${d.v} dossiers`}
            style={{ height: `${(d.v / maxBar) * 110}px`, background: i === 10 ? "linear-gradient(to top,#D4A843,#F0C96A)" : `rgba(79,172,222,${0.35 + (d.v / maxBar) * 0.65})` }} />
          <span className="bar-mlabel">{d.m}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE MODAL
───────────────────────────────────────────── */
function TimelineModal({ dossier, onClose }) {
  const events = TL_TEMPLATES[dossier.statut] || TL_TEMPLATES["En cours"];
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box timeline-modal">
        <div className="modal-title">📋 Chronologie du dossier</div>
        <div className="tl-header">
          {[
            ["Numéro", dossier.id],
            ["Justiciable", dossier.justiciable],
            ["Type", dossier.type],
            ["Juge", dossier.juge],
            ["Statut", dossier.statut],
            ["Déposé le", dossier.date],
          ].map(([l, v]) => (
            <div key={l} className="tl-field">
              <span className="tl-field-label">{l}</span>
              <span className="tl-field-val">{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Objet : <span style={{ color: "var(--white)" }}>{dossier.objet}</span></div>
        <div style={{ marginBottom: 20 }} />
        <div className="timeline-track">
          {events.map((e, i) => (
            <div key={i} className="tl-item">
              <div className={`tl-node ${e.status}`}>{e.status === "done" ? "✓" : ""}</div>
              <div className="tl-date">{e.date}</div>
              <div className="tl-event">{e.event}</div>
              <div className="tl-note">{e.note}</div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="topbar-btn btn-ghost" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADD/EDIT MODAL
───────────────────────────────────────────── */
function DossierModal({ dossier, onSave, onClose }) {
  const [form, setForm] = useState(dossier || {
    id: "", justiciable: "", type: "Civil", statut: "En cours",
    juge: JUGES[0], date: new Date().toLocaleDateString("fr-FR"),
    objet: "", audience: "À planifier", priorite: "Normale",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isEdit = !!dossier;

  const handleSave = () => {
    if (!form.id.trim() || !form.justiciable.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">{isEdit ? "✏️ Modifier le dossier" : "➕ Nouveau dossier"}</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Numéro de dossier *</label>
            <input className="form-input" placeholder="ex: CIV-2024-0001" value={form.id} onChange={e => set("id", e.target.value)} disabled={isEdit} />
          </div>
          <div className="form-group">
            <label className="form-label">Date de dépôt</label>
            <input className="form-input" placeholder="JJ/MM/AAAA" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Justiciable *</label>
            <input className="form-input" placeholder="Nom complet ou raison sociale" value={form.justiciable} onChange={e => set("justiciable", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type d'affaire</label>
            <select className="form-select" value={form.type} onChange={e => set("type", e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select className="form-select" value={form.statut} onChange={e => set("statut", e.target.value)}>
              {STATUTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Juge responsable</label>
            <select className="form-select" value={form.juge} onChange={e => set("juge", e.target.value)}>
              {JUGES.map(j => <option key={j}>{j}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priorité</label>
            <select className="form-select" value={form.priorite} onChange={e => set("priorite", e.target.value)}>
              {PRIORITES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Prochaine audience</label>
            <input className="form-input" placeholder="JJ/MM/AAAA ou À planifier" value={form.audience} onChange={e => set("audience", e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Objet du litige</label>
            <textarea className="form-textarea" placeholder="Décrivez brièvement l'objet de l'affaire..." value={form.objet} onChange={e => set("objet", e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="topbar-btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="topbar-btn btn-primary" onClick={handleSave}>{isEdit ? "Enregistrer" : "Créer le dossier"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONFIRM DELETE MODAL
───────────────────────────────────────────── */
function ConfirmModal({ dossier, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div className="modal-title" style={{ color: "var(--rose)" }}>🗑️ Supprimer le dossier</div>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
          Vous êtes sur le point de supprimer le dossier <strong style={{ color: "var(--white)" }}>{dossier.id}</strong> — {dossier.justiciable}.<br />
          Cette action est <strong style={{ color: "var(--rose)" }}>irréversible</strong>.
        </p>
        <div className="modal-footer">
          <button className="topbar-btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="topbar-btn btn-danger" onClick={onConfirm}>Confirmer la suppression</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */
function LoginPage({ onLogin, theme, toggleTheme }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!creds.username || !creds.password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === creds.username && u.password === creds.password);
      if (user) { onLogin(user); }
      else { setError("Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe."); setLoading(false); }
    }, 900);
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(212,168,67,.07),transparent 70%)", top: "-100px", left: "-100px" }} />
      <div className="login-bg-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(79,172,222,.06),transparent 70%)", bottom: "-80px", right: "-80px" }} />
      <div className="login-orb-spin" />
      <div className="login-card">
        <div className="login-logo-ring">⚖️</div>
        <div className="login-title">Justice Insight</div>
        <div className="login-sub">Tableau de Bord Analytique — Accès Sécurisé</div>
        {/* Theme toggle on login */}
        <div className="login-login-theme-row">
          <span className="theme-toggle-label">{theme === "dark" ? "🌙 Mode sombre" : "☀️ Mode clair"}</span>
          <button className={`theme-toggle ${theme === "dark" ? "dark-mode" : "light-mode"}`} onClick={toggleTheme}>
            <span className="theme-toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>
        <label className="login-label">Identifiant</label>
        <div className="login-input-wrap">
          <input className="login-input" placeholder="Nom d'utilisateur" value={creds.username}
            onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <label className="login-label">Mot de passe</label>
        <div className="login-input-wrap">
          <input className="login-input" type={showPw ? "text" : "password"}
            placeholder="••••••••••" value={creds.password}
            onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ paddingRight: 44 }} />
          <button className="login-eye" onClick={() => setShowPw(v => !v)}>{showPw ? "🙈" : "👁️"}</button>
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Vérification..." : "Connexion"}
        </button>
        {error && <div className="login-error">{error}</div>}
        <div className="login-hint">
          Démo : <strong>admin</strong> / <strong>Justice2024!</strong>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────── */
function DashboardPage({ dossiers }) {
  const total = dossiers.length;
  const encours = dossiers.filter(d => d.statut === "En cours").length;
  const reporte = dossiers.filter(d => d.statut === "Reporté").length;
  const cloture = dossiers.filter(d => d.statut === "Clôturé").length;

  const c1 = useCounter(total);
  const c2 = useCounter(encours);
  const c3 = useCounter(reporte);
  const c4 = useCounter(cloture);

  const donutData = [
    { label: "Pénal", val: dossiers.filter(d => d.type === "Penal").length, color: "#E05C6E" },
    { label: "Civil", val: dossiers.filter(d => d.type === "Civil").length, color: "#4FACDE" },
    { label: "Familial", val: dossiers.filter(d => d.type === "Familial").length, color: "#3EC8A0" },
    { label: "Commercial", val: dossiers.filter(d => d.type === "Commercial").length, color: "#D4A843" },
  ].filter(d => d.val > 0);

  const judgeStats = JUGES.map((j, i) => ({
    name: j, count: dossiers.filter(d => d.juge === j).length, color: judgeColors[i],
  })).sort((a, b) => b.count - a.count);

  const maxJudge = Math.max(...judgeStats.map(j => j.count)) || 1;

  return (
    <div className="page-content">
      <div className="kpi-grid">
        {[
          { val: c1, label: "Total dossiers", icon: "📁", accent: "#4FACDE", card: "dark", trend: "+12%", up: true },
          { val: c2, label: "En cours", icon: "⚖️", accent: "#4FACDE", card: "light", trend: "+5%", up: true },
          { val: c3, label: "Reportés", icon: "🕐", accent: "#F28C38", card: "dark", trend: "-8%", up: false },
          { val: c4, label: "Clôturés", icon: "✓", accent: "#3EC8A0", card: "light", trend: "+18%", up: true },
        ].map((k, i) => (
          <div key={i} className={`kpi-card ${k.card}`}>
            <div className="kpi-accent" style={{ background: k.accent }} />
            <div className="kpi-icon-wrap" style={{ background: `${k.accent}18` }}>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-label">{k.label}</div>
            <div className={`kpi-trend ${k.up ? "trend-up" : "trend-dn"}`}>
              {k.up ? "↑" : "↓"} {k.trend} vs mois dernier
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Évolution mensuelle 2024</div><div className="chart-sub">Nombre de dossiers traités par mois</div></div>
          </div>
          <BarChart />
        </div>
        <div className="chart-card light-card">
          <div className="chart-header">
            <div><div className="chart-title" style={{ color: "var(--light-text)" }}>Répartition par type</div></div>
          </div>
          <DonutChart data={donutData} total={total} />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header"><div className="chart-title">Charge par magistrat</div></div>
          <div>
            {judgeStats.map((j, i) => (
              <div key={i} className="judge-row">
                <div className="judge-avatar" style={{ background: j.color }}>{j.name.split(" ").pop()[0]}</div>
                <div>
                  <div className="judge-name">{j.name}</div>
                  <div className="judge-count">{j.count} dossier{j.count > 1 ? "s" : ""}</div>
                </div>
                <div style={{ flex: 1, margin: "0 16px" }}>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${(j.count / maxJudge) * 100}%`, background: j.color }} /></div>
                </div>
                <span className="judge-pct">{total ? Math.round((j.count / total) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card light-card">
          <div className="chart-header"><div className="chart-title" style={{ color: "var(--light-text)" }}>Répartition par statut</div></div>
          <div style={{ marginTop: 16 }}>
            {[
              { label: "En cours", val: encours, color: "#4FACDE" },
              { label: "Reportés", val: reporte, color: "#F28C38" },
              { label: "Clôturés", val: cloture, color: "#3EC8A0" },
            ].map((s, i) => (
              <div key={i} className="progress-item" style={{ marginBottom: 16 }}>
                <span className="progress-name" style={{ color: "var(--light-muted)", minWidth: 80 }}>{s.label}</span>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${total ? (s.val / total) * 100 : 0}%`, background: s.color }} /></div>
                <span className="progress-count" style={{ color: "var(--light-text)" }}>{s.val}</span>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: "16px", background: "rgba(212,168,67,.08)", borderRadius: 12, border: "1px solid rgba(212,168,67,.15)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Taux de résolution</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: "#D4A843", marginTop: 4 }}>
                {total ? Math.round((cloture / total) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DOSSIERS PAGE
───────────────────────────────────────────── */
function DossiersPage({ dossiers, onAdd, onDelete, onView, onEdit }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterJuge, setFilterJuge] = useState("Tous");

  const filtered = useMemo(() => {
    let list = dossiers;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.justiciable.toLowerCase().includes(q) ||
        d.objet.toLowerCase().includes(q)
      );
    }
    if (filterType !== "Tous") list = list.filter(d => d.type === filterType);
    if (filterStatut !== "Tous") list = list.filter(d => d.statut === filterStatut);
    if (filterJuge !== "Tous") list = list.filter(d => d.juge === filterJuge);
    return list;
  }, [dossiers, search, filterType, filterStatut, filterJuge]);

  return (
    <div className="page-content">
      <div className="section-card">
        <div className="section-head">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="section-title-text">Gestion des dossiers</span>
            <span style={{ fontSize: 11, background: "rgba(79,172,222,.12)", color: "var(--sky)", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(79,172,222,.2)" }}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-box">
              <span className="search-icon-i">🔍</span>
              <input placeholder="Chercher par numéro, nom, objet…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>}
            </div>
            <button className="topbar-btn btn-primary" onClick={onAdd}>➕ Nouveau dossier</button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: "12px 22px", display: "flex", gap: 10, flexWrap: "wrap", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,.08)" }}>
          {["Tous", ...TYPES].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, border: "1px solid", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all .2s",
                background: filterType === t ? "rgba(212,168,67,.12)" : "transparent",
                borderColor: filterType === t ? "rgba(212,168,67,.4)" : "var(--border2)",
                color: filterType === t ? "var(--gold)" : "var(--muted)" }}>
              {t}
            </button>
          ))}
          <div style={{ width: 1, background: "var(--border2)", margin: "0 4px" }} />
          {["Tous", ...STATUTS].map(s => (
            <button key={s} onClick={() => setFilterStatut(s)}
              style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, border: "1px solid", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all .2s",
                background: filterStatut === s ? "rgba(79,172,222,.1)" : "transparent",
                borderColor: filterStatut === s ? "rgba(79,172,222,.35)" : "var(--border2)",
                color: filterStatut === s ? "var(--sky)" : "var(--muted)" }}>
              {s}
            </button>
          ))}
          <div style={{ width: 1, background: "var(--border2)", margin: "0 4px" }} />
          <select value={filterJuge} onChange={e => setFilterJuge(e.target.value)}
            style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--muted)", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="Tous">Tous les juges</option>
            {JUGES.map(j => <option key={j}>{j}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">Aucun dossier ne correspond à vos critères.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Dossier</th>
                  <th>Justiciable</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Juge</th>
                  <th>Audience</th>
                  <th>Priorité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="tr-anim">
                    <td><span style={{ fontFamily: "'Playfair Display',serif", color: "var(--gold)", fontSize: 13 }}>{d.id}</span></td>
                    <td><div style={{ fontWeight: 500 }}>{d.justiciable}</div><div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{d.date}</div></td>
                    <td><span className={`badge ${colorOf(d.type)}`}>{d.type}</span></td>
                    <td><span className={`badge ${statOf(d.statut)}`}>{d.statut}</span></td>
                    <td style={{ fontSize: 12 }}>{d.juge}</td>
                    <td style={{ fontSize: 12, color: d.audience === "—" || d.audience === "À planifier" ? "var(--muted)" : "var(--white)" }}>{d.audience}</td>
                    <td>
                      <span style={{ fontSize: 11, color: d.priorite === "Haute" ? "var(--rose)" : d.priorite === "Normale" ? "var(--sky)" : "var(--muted)" }}>
                        {d.priorite === "Haute" ? "🔴" : d.priorite === "Normale" ? "🔵" : "⚪"} {d.priorite}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="act-btn view-btn" title="Voir timeline" onClick={() => onView(d)}>📋</button>
                        <button className="act-btn view-btn" title="Modifier" onClick={() => onEdit(d)}>✏️</button>
                        <button className="act-btn del-btn" title="Supprimer" onClick={() => onDelete(d)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App1() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [dossiers, setDossiers] = useState(INITIAL_DOSSIERS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type, key: Date.now() });
  };

  if (!user) return <LoginPage onLogin={u => { setUser(u); showToast(`Bienvenue, ${u.name} !`, "info"); }} theme={theme} toggleTheme={toggleTheme} />;

  const handleAdd = (form) => {
    if (dossiers.find(d => d.id === form.id)) { showToast("Ce numéro de dossier existe déjà.", "error"); return; }
    setDossiers(prev => [form, ...prev]);
    setModal(null);
    showToast(`Dossier ${form.id} créé avec succès.`, "success");
  };

  const handleEdit = (form) => {
    setDossiers(prev => prev.map(d => d.id === form.id ? form : d));
    setModal(null);
    showToast(`Dossier ${form.id} mis à jour.`, "info");
  };

  const handleDelete = () => {
    setDossiers(prev => prev.filter(d => d.id !== selected.id));
    showToast(`Dossier ${selected.id} supprimé.`, "error");
    setModal(null);
    setSelected(null);
  };

  const NAV = [
    { id: "dashboard", icon: "📊", label: "Tableau de bord" },
    { id: "dossiers", icon: "📁", label: "Dossiers", badge: dossiers.filter(d => d.statut === "En cours").length },
    { id: "stats", icon: "📈", label: "Statistiques" },
  ];

  /* STATS PAGE */
  const StatsPage = () => {
    const haute = dossiers.filter(d => d.priorite === "Haute").length;
    const byMonth = BAR_DATA.map(b => ({ ...b, encours: Math.round(b.v * 0.45), cloture: Math.round(b.v * 0.4) }));
    return (
      <div className="page-content">
        <div className="stat-full-grid">
          <div className="big-chart-card">
            <div className="chart-header"><div className="chart-title">Flux mensuel détaillé</div></div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              {[{ label: "Total", color: "#4FACDE" }, { label: "En cours", color: "#D4A843" }, { label: "Clôturés", color: "#3EC8A0" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
              {byMonth.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", display: "flex", gap: 2, justifyContent: "center", alignItems: "flex-end" }}>
                    <div style={{ width: "30%", height: `${(d.encours / maxBar) * 130}px`, background: "#D4A843", borderRadius: "3px 3px 0 0" }} />
                    <div style={{ width: "30%", height: `${(d.v / maxBar) * 130}px`, background: "#4FACDE88", borderRadius: "3px 3px 0 0" }} />
                    <div style={{ width: "30%", height: `${(d.cloture / maxBar) * 130}px`, background: "#3EC8A0", borderRadius: "3px 3px 0 0" }} />
                  </div>
                  <span style={{ fontSize: 8, color: "var(--muted)" }}>{d.m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="big-chart-card lc">
            <div className="chart-header"><div className="chart-title" style={{ color: "var(--light-text)" }}>Indicateurs clés</div></div>
            {[
              { label: "Dossiers à haute priorité", val: haute, total: dossiers.length, color: "#E05C6E" },
              { label: "Taux de clôture", val: dossiers.filter(d => d.statut === "Clôturé").length, total: dossiers.length, color: "#3EC8A0", pct: true },
              { label: "Audiences planifiées", val: dossiers.filter(d => d.audience && d.audience !== "—" && d.audience !== "À planifier").length, total: dossiers.length, color: "#4FACDE" },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--light-muted)" }}>
                  <span>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 600 }}>
                    {item.pct ? `${item.total ? Math.round((item.val / item.total) * 100) : 0}%` : item.val}
                  </span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${item.total ? (item.val / item.total) * 100 : 0}%`, background: item.color }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card light-section">
          <div className="section-head">
            <span className="section-title-text">Vue d'ensemble par type d'affaire</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>Type</th><th>Total</th><th>En cours</th><th>Reportés</th><th>Clôturés</th><th>Part</th></tr></thead>
              <tbody>
                {TYPES.map(t => {
                  const group = dossiers.filter(d => d.type === t);
                  const pct = dossiers.length ? Math.round((group.length / dossiers.length) * 100) : 0;
                  return (
                    <tr key={t}>
                      <td><span className={`badge ${colorOf(t)}`}>{t}</span></td>
                      <td>{group.length}</td>
                      <td>{group.filter(d => d.statut === "En cours").length}</td>
                      <td>{group.filter(d => d.statut === "Reporté").length}</td>
                      <td>{group.filter(d => d.statut === "Clôturé").length}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-track" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: { Penal:"#E05C6E", Civil:"#4FACDE", Familial:"#3EC8A0", Commercial:"#D4A843" }[t] }} />
                          </div>
                          <span style={{ fontSize: 11, color: "var(--light-muted)" }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const pageTitles = {
    dashboard: { title: "Tableau de bord", sub: `Bonjour, ${user.name} · ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}` },
    dossiers: { title: "Gestion des dossiers", sub: `${dossiers.length} dossiers · ${dossiers.filter(d => d.statut === "En cours").length} en cours` },
    stats: { title: "Statistiques & Analyses", sub: "Vue d'ensemble de l'activité juridictionnelle" },
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚖️</div>
          <div>
            <div className="sidebar-logo-text">Justice Insight</div>
            <div className="sidebar-logo-sub">Analytique Judiciaire</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {NAV.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => { setPage(n.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
            </div>
          ))}
          <div className="nav-section-title" style={{ marginTop: 12 }}>Accès rapide</div>
          <div className="nav-item" onClick={() => { setModal("add"); setPage("dossiers"); }}>
            <span className="nav-icon">➕</span>Nouveau dossier
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user.name.split(" ").pop()[0]}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button className="logout-btn" title="Déconnexion" onClick={() => setUser(null)}>⏏</button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(v => !v)}>☰</button>
            <div className="page-title-area">
              <div className="page-title">{pageTitles[page]?.title}</div>
              <div className="page-sub">{pageTitles[page]?.sub}</div>
            </div>
          </div>
          <div className="topbar-right">
            {page === "dossiers" && (
              <button className="topbar-btn btn-primary" onClick={() => { setSelected(null); setModal("add"); }}>
                ➕ Nouveau dossier
              </button>
            )}
            {/* Theme toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--t-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                {theme === "dark" ? "🌙" : "☀️"}
              </span>
              <button className={`theme-toggle ${theme === "dark" ? "dark-mode" : "light-mode"}`} onClick={toggleTheme} title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}>
                <span className="theme-toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</span>
              </button>
            </div>
            <button className="topbar-btn btn-ghost" onClick={() => setUser(null)}>⏏ Déconnexion</button>
          </div>
        </header>

        {page === "dashboard" && <DashboardPage dossiers={dossiers} />}
        {page === "dossiers" && (
          <DossiersPage
            dossiers={dossiers}
            onAdd={() => { setSelected(null); setModal("add"); }}
            onDelete={d => { setSelected(d); setModal("delete"); }}
            onView={d => { setSelected(d); setModal("timeline"); }}
            onEdit={d => { setSelected(d); setModal("edit"); }}
          />
        )}
        {page === "stats" && <StatsPage />}
      </div>

      {/* Modals */}
      {modal === "add" && <DossierModal onSave={handleAdd} onClose={() => setModal(null)} />}
      {modal === "edit" && selected && <DossierModal dossier={selected} onSave={handleEdit} onClose={() => setModal(null)} />}
      {modal === "delete" && selected && <ConfirmModal dossier={selected} onConfirm={handleDelete} onClose={() => { setModal(null); setSelected(null); }} />}
      {modal === "timeline" && selected && <TimelineModal dossier={selected} onClose={() => { setModal(null); setSelected(null); }} />}

      {/* Toast */}
      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
