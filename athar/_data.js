/* ============================================================
   Athar — shared demo content pack + illustrative tenant data
   ------------------------------------------------------------
   One source of truth for every demo screen. This mirrors the real
   product's architecture: the control library, tier rules and
   instrument mappings are DATA, not application logic. In the built
   product these arrive as a versioned content pack (KSA-BANK v2026.3)
   loaded through a migration; here they are a JS object.

   Nakhla Bank is fictional. Every record is invented.
   ============================================================ */

var ATHAR = (function(){

  /* ---- Tier rules: weights and boundaries. Tenant-configurable. ---- */
  var ATTRS = [
    {k:'cf',  w:2, l:'Customer-facing',
     q:'Will anyone outside the bank interact with it, or receive an output from it?',
     h:'Customers, applicants or the public — directly, or through a channel like the app or a branch.'},
    {k:'dec', w:3, l:'Decides about a person',
     q:'Does it make a decision about a person, or materially inform one?',
     h:'Credit, pricing, eligibility, hiring, fraud blocking — anything a person could be adversely affected by.'},
    {k:'saf', w:3, l:'Safety relevant',
     q:'Is it relevant to physical safety or security?',
     h:'Anything touching premises security, physical access, or where a failure could cause harm.'},
    {k:'pd',  w:2, l:'Personal data',
     q:'Does it process personal data?',
     h:'Any data relating to an identified or identifiable person, including staff.'},
    {k:'xb',  w:2, l:'Processing outside KSA',
     q:'Does any processing happen outside the Kingdom?',
     h:'Includes vendor inference endpoints, support access, and model training abroad.'},
    {k:'gen', w:1, l:'Generative or agentic',
     q:'Is it generative or agentic?',
     h:'Produces text, images or code, or takes actions on its own initiative.'},
    {k:'ven', w:1, l:'Third-party model',
     q:'Is the model supplied by a third party, or embedded in software you bought?',
     h:'Includes AI features inside SaaS the bank already licenses.'}
  ];

  var BOUNDS = [
    {min:9, n:'Critical', c:'var(--t4)'},
    {min:6, n:'High',     c:'var(--t3)'},
    {min:3, n:'Elevated', c:'var(--t2)'},
    {min:0, n:'Limited',  c:'var(--t1)'}
  ];

  /* ---- Control library. Stable IDs, never renumbered. ---- */
  var CTRL = [
    {id:'CTL-M08-001', t:'Named business owner recorded in the register',            i:'SDAIA AI Adoption Framework',   f:function(){return true}},
    {id:'CTL-M08-004', t:'Purpose, scope and intended use documented',               i:'SDAIA AI Adoption Framework',   f:function(){return true}},
    {id:'CTL-M08-058', t:'Periodic review at a defined interval',                    i:'SDAIA AI Adoption Framework',   f:function(){return true}},
    {id:'CTL-M08-052', t:'AI incident response plan with a named responder',         i:'NCA ECC-2:2024',                f:function(s){return s.sc>=3}},
    {id:'CTL-M08-011', t:'PDPL lawful basis recorded per data category',             i:'PDPL + Implementing Regulations', f:function(s){return s.pd}},
    {id:'CTL-M08-014', t:'Data protection impact assessment completed and signed',   i:'PDPL Implementing Regulations', f:function(s){return s.pd && s.sc>=6}},
    {id:'CTL-M08-018', t:'Cross-border transfer assessment and documented basis',    i:'Transfer Regulation, Sept 2024', f:function(s){return s.xb}},
    {id:'CTL-M08-022', t:'Human review before an automated decision takes effect',   i:'SDAIA AI Ethics Principles',    f:function(s){return s.dec}},
    {id:'CTL-M08-027', t:'Disclosure to the individual that AI is in use',           i:'SDAIA AI Ethics Principles',    f:function(s){return s.cf}},
    {id:'CTL-M08-035', t:'Recourse path for an adversely affected individual',       i:'SDAIA AI Ethics Principles',    f:function(s){return s.dec && s.cf}},
    {id:'CTL-M08-041', t:'Output grounding and human review for generative use',     i:'SDAIA GenAI Guidelines',  g:true, f:function(s){return s.gen}},
    {id:'CTL-M08-044', t:'Vendor due diligence, exit plan and concentration check',  i:'SAMA outsourcing rules',        f:function(s){return s.ven}},
    {id:'CTL-M08-031', t:'Explainability record proportionate to tier',              i:'SDAIA AI Adoption Framework',   f:function(s){return s.sc>=6}},
    {id:'CTL-M08-047', t:'Independent pre-deployment review by second line',         i:'NCA ECC-2:2024',                f:function(s){return s.sc>=6}},
    {id:'CTL-M08-061', t:'Safety case and fail-safe behaviour documented',           i:'Sector regulator',              f:function(s){return s.saf}}
  ];

  /* Controls that block deployment until evidenced. */
  var GATING = ['CTL-M08-047','CTL-M08-018','CTL-M08-061'];

  /* ---- Regulatory instruments. Edition, who it binds, verification. ---- */
  var INSTRUMENTS = [
    {k:'aiaf', name:'AI Adoption Framework', body:'SDAIA', ver:'September 2024',
     binds:'Public and private sector', status:'Framework · non-binding', bind:false,
     verOn:'12 Aug 2026', by:'R. Kerr',
     areas:[
       {n:'Governance and accountability', c:['CTL-M08-001','CTL-M08-004']},
       {n:'Risk management and tiering',   c:['CTL-M08-047','CTL-M08-031']},
       {n:'Transparency and disclosure',   c:['CTL-M08-027']},
       {n:'Human oversight',               c:['CTL-M08-022','CTL-M08-035']},
       {n:'Data governance',               c:['CTL-M08-011']},
       {n:'Monitoring and review',         c:['CTL-M08-058']},
       {n:'Incident management',           c:['CTL-M08-052']},
       {n:'Third-party and supply chain',  c:['CTL-M08-044']}
     ]},
    {k:'pdpl', name:'Personal Data Protection Law', body:'SDAIA', ver:'incl. Implementing Regulations',
     binds:'Private sector — binding', status:'Binding', bind:true,
     verOn:'12 Aug 2026', by:'R. Kerr',
     areas:[
       {n:'Lawful basis for processing',       c:['CTL-M08-011']},
       {n:'Records of processing',             c:['CTL-M08-004']},
       {n:'Impact assessment where required',  c:['CTL-M08-014']},
       {n:'Transfer outside the Kingdom',      c:['CTL-M08-018']},
       {n:'Data subject rights and recourse',  c:['CTL-M08-035']},
       {n:'Breach notification readiness',     c:['CTL-M08-052']}
     ]},
    {k:'ecc', name:'ECC-2:2024', body:'NCA', ver:'supersedes ECC-1:2018',
     binds:'In-scope national organisations', status:'Binding', bind:true,
     verOn:'12 Aug 2026', by:'R. Kerr',
     areas:[
       {n:'Cybersecurity governance',        c:['CTL-M08-001']},
       {n:'Cybersecurity defence',           c:['CTL-M08-047']},
       {n:'Cybersecurity resilience',        c:['CTL-M08-052']},
       {n:'Third-party and cloud computing', c:['CTL-M08-044']}
     ]},
    {k:'sama', name:'Cyber Security Framework', body:'SAMA', ver:'incl. outsourcing rules',
     binds:'Banking, finance, fintech', status:'Binding', bind:true,
     verOn:'12 Aug 2026', by:'R. Kerr',
     areas:[
       {n:'Leadership and governance',      c:['CTL-M08-001','CTL-M08-004']},
       {n:'Risk management and compliance', c:['CTL-M08-047','CTL-M08-031']},
       {n:'Operations and technology',      c:['CTL-M08-022','CTL-M08-052']},
       {n:'Third-party management',         c:['CTL-M08-044']}
     ]},
    {k:'xfer', name:'Transfer of Personal Data Outside the Kingdom', body:'SDAIA', ver:'September 2024',
     binds:'Private sector — binding', status:'Binding', bind:true,
     verOn:'12 Aug 2026', by:'R. Kerr',
     areas:[
       {n:'Documented transfer basis',        c:['CTL-M08-018']},
       {n:'Risk assessment where required',   c:['CTL-M08-014']},
       {n:'Purpose limitation on transfer',   c:['CTL-M08-004']}
     ]}
  ];

  /* ---- Illustrative tenant: Nakhla Bank (fictional) ---- */
  function A(cf,dec,saf,pd,xb,gen,ven){
    return {cf:!!cf,dec:!!dec,saf:!!saf,pd:!!pd,xb:!!xb,gen:!!gen,ven:!!ven};
  }
  var RAW = [
    {id:'AIS-0041',n:'Retail credit decisioning',            fn:'Retail Banking',    own:'H. Al-Qahtani', st:'live', a:A(1,1,0,1,0,0,0), cov:92,  rev:'2027-01-14', od:false},
    {id:'AIS-0043',n:'SME credit scoring, revised model',    fn:'Corporate Banking', own:'N. Baeshen',    st:'rev',  a:A(1,1,0,1,1,0,0), cov:48,  rev:'2026-09-30', od:false},
    {id:'AIS-0044',n:'AML transaction monitoring',           fn:'Financial Crime',   own:'S. Al-Dosari',  st:'live', a:A(0,1,0,1,0,0,1), cov:88,  rev:'2026-11-02', od:false},
    {id:'AIS-0047',n:'Customer service assistant, Arabic',   fn:'Contact Centre',    own:'R. Al-Otaibi',  st:'live', a:A(1,0,0,1,1,1,1), cov:71,  rev:'2026-08-12', od:true},
    {id:'AIS-0049',n:'Card fraud scoring, vendor supplied',  fn:'Cards',             own:'S. Al-Dosari',  st:'live', a:A(1,1,0,1,1,0,1), cov:83,  rev:'2026-12-08', od:false},
    {id:'AIS-0052',n:'Voice biometric authentication',       fn:'Channels',          own:'M. Faqih',      st:'live', a:A(1,1,0,1,0,0,1), cov:79,  rev:'2027-02-20', od:false},
    {id:'AIS-0055',n:'CV screening assistant',               fn:'Human Resources',   own:'A. Zahrani',    st:'rev',  a:A(0,1,0,1,1,1,1), cov:35,  rev:'2026-09-15', od:false},
    {id:'AIS-0058',n:'Collections propensity',               fn:'Collections',       own:'H. Al-Qahtani', st:'live', a:A(1,0,0,1,0,0,0), cov:90,  rev:'2026-10-19', od:false},
    {id:'AIS-0061',n:'Trade finance document extraction',    fn:'Trade Finance',     own:'K. Al-Harbi',   st:'live', a:A(0,0,0,1,0,1,1), cov:76,  rev:'2026-07-28', od:true},
    {id:'AIS-0063',n:'Microsoft 365 Copilot, enterprise-wide',fn:'Group Technology', own:'M. Faqih',      st:'live', a:A(0,0,0,1,1,1,1), cov:52,  rev:'2026-09-05', od:false},
    {id:'AIS-0066',n:'Next-best-offer engine',               fn:'Marketing',         own:'L. Nassar',     st:'live', a:A(1,0,0,1,0,0,0), cov:81,  rev:'2026-11-24', od:false},
    {id:'AIS-0069',n:'Internal policy knowledge assistant',  fn:'Group Technology',  own:'R. Al-Otaibi',  st:'live', a:A(0,0,0,0,0,1,1), cov:94,  rev:'2027-03-11', od:false},
    {id:'AIS-0072',n:'Branch footfall forecasting',          fn:'Distribution',      own:'K. Al-Harbi',   st:'live', a:A(0,0,0,0,0,0,0), cov:100, rev:'2027-04-02', od:false},
    {id:'AIS-0074',n:'Branch queue safety monitoring',       fn:'Physical Security', own:'A. Zahrani',    st:'rev',  a:A(1,0,1,1,0,0,1), cov:29,  rev:'2026-10-01', od:false},
    {id:'AIS-0077',n:'Chatbot intent routing, legacy',       fn:'Contact Centre',    own:'R. Al-Otaibi',  st:'ret',  a:A(1,0,0,1,0,0,0), cov:100, rev:'—',          od:false}
  ];

  /* ---- Derivation ---- */
  function score(a){ return ATTRS.reduce(function(x,at){ return x + (a[at.k] ? at.w : 0); }, 0); }
  function tierOf(sc){ for(var i=0;i<BOUNDS.length;i++){ if(sc>=BOUNDS[i].min) return BOUNDS[i]; } }
  function ctx(d){ var o={sc:d.sc}; ATTRS.forEach(function(a){ o[a.k]=d.a[a.k]; }); return o; }
  function controlsFor(d){ var c=ctx(d); return CTRL.filter(function(x){ return x.f(c); }); }

  /* Stable string hash — so which controls are evidenced is deterministic
     across page loads and across screens, but not simply "the first N in
     library order". Without this every system shows the same control as its
     gap, which reads as an artefact rather than an estate. */
  function hash(s){
    var h = 2166136261;
    for (var i=0; i<s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function systems(){
    return RAW.map(function(r){
      var d = Object.assign({}, r);
      d.sc = score(d.a);
      d.tier = tierOf(d.sc);
      d.app = controlsFor(d).map(function(c){ return c.id; });

      var target = Math.round(d.app.length * d.cov / 100);
      var ranked = d.app.slice().sort(function(a,b){ return hash(d.id+a) - hash(d.id+b); });
      var evidenced = {};
      ranked.slice(0, target).forEach(function(id){ evidenced[id] = true; });

      d.met = {};
      d.app.forEach(function(id){ d.met[id] = !!evidenced[id]; });
      return d;
    });
  }

  return {
    ATTRS:ATTRS, BOUNDS:BOUNDS, CTRL:CTRL, GATING:GATING, INSTRUMENTS:INSTRUMENTS,
    score:score, tierOf:tierOf, ctx:ctx, controlsFor:controlsFor, systems:systems,
    title:function(id){ var c=CTRL.filter(function(x){return x.id===id})[0]; return c?c.t:id; },
    pack:'KSA-BANK v2026.3'
  };
})();
