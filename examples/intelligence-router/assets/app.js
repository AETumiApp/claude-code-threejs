/* INTELLIGENCE ROUTER - Three.js, tuong tac. (c) AETumi Corp.

   HE TOA DO
   Moi so do van tinh bang PIXEL cua khung 1920x1080 (x sang phai, y xuong).
   Camera PHOI CANH dat o khoang cach D sao cho mat phang z=0 anh xa DUNG
   1:1 ra 1920x1080. Moi diem co chieu sau z duoc "bu" bang w3(): no nam
   dung vi tri pixel cu khi nhin thang, va chi lo chieu sau khi xoay.
   => goc nhin mac dinh giong het ban phang cu, xoay thi thanh 3D that.

   TUONG TAC
   - Keo chuot / vuot ngang: xoay ca canh quanh router (co quan tinh).
   - Re chuot: canh nghieng nhe theo chuot, hat tranh con tro, re vao qua
     cau / the luat / router thi lan do sang len, cac lan khac diu xuong.
     Bam vao qua cau de ghim sang lan do.
   - Nhap dup: ve goc nhin mac dinh.
   - Bang dieu khien (nut banh rang): giao dien mau, mau tung lan, toc do,
     mat do hat, do sang, chieu sau, thu phong, tu xoay, nghieng bang...
     Luu vao localStorage.

   ?t=20 : dung hinh tai giay 20 (doi chieu voi video goc). */
import * as THREE from './three/three.module.js';

const W = 1920, H = 1080, CHU_KY = 48;
const FOV = 30;
const D = (H / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const w3 = (sx, sy, z, o) => { const k = (D - z) / D; o.x = (sx - W / 2) * k; o.y = (H / 2 - sy) * k; o.z = z; return o; };

/* ---------- quy dao do tu video (Fourier chu ky 48s) ---------- */
const QD = {
  astra: { x: [1340.87, 82.76, -7.12, 14.29, -6.88, 5.1, -2.89],  y: [363.7, -30.69, 26.74, -14.22, 2.06, -5.31, -2.61] },
  kimi:  { x: [1376.67, 81.56, -5.53, 15.71, -9.69, 7.48, -2.01], y: [466.66, -30.13, 23.31, -11.99, 0.87, -3.07, -2.25] },
  swarm: { x: [1403.56, 78.41, 2.75, 12.22, -11.39, 3.92, -2.78], y: [575.46, -28.36, 22.44, -11.24, -0.32, -2.57, -2.49] },
  cheap: { x: [1496.66, 75.13, 11.84, 12.8, -10.15, 6.03, -0.58], y: [683.92, -13.63, 11.52, -0.54, -1.4, 1.5, -0.08] },
};
function fourier(c, t) {
  let v = c[0];
  for (let h = 1; h <= 3; h++) { const a = 2 * Math.PI * h * t / CHU_KY; v += c[2*h-1] * Math.sin(a) + c[2*h] * Math.cos(a); }
  return v;
}
const ROUTER = { x: 880, y: 470 };

/* ---------- giao dien mau ----------
   luxe: DNA trang chu aetumi.app (nen #0c0b0e, xanh chanh #c9f73d, tim #a983ff,
   cyan #33e1ff) + vang kim cho chat sang. sakura: pastel Nhat. */
const THEMES = {
  luxe:     { ten: 'AETumi Luxe', bg: '#0c0b0e', the: '#15121c', ke: '#26222e', ray: '#221e2b', acc: '#c9f73d', acc2: '#a983ff',
              lan: ['#a983ff', '#33e1ff', '#ffc861', '#c9f73d'], dong: '#f2f0f6', khung: '#e9dcff', loi: '#f3e8ff', mu: '#8d5cff' },
  sakura:   { ten: 'Sakura Pastel', bg: '#15111a', the: '#1f1824', ke: '#342a38', ray: '#2e2533', acc: '#f6a8c0', acc2: '#a9d8b0',
              lan: ['#f6a8c0', '#9fd4c8', '#f3d98f', '#b3c7f0'], dong: '#fdf2f5', khung: '#ffd9e4', loi: '#ffe6ee', mu: '#e87aa0' },
  kintsugi: { ten: 'Kintsugi Gold', bg: '#0b0907', the: '#16120c', ke: '#2c2416', ray: '#282014', acc: '#e8c26a', acc2: '#f3e2b3',
              lan: ['#e8c26a', '#d49a4a', '#f5dfa0', '#fff4d6'], dong: '#fff4dc', khung: '#f0d59a', loi: '#ffe9b8', mu: '#b8862f' },
  midnight: { ten: 'Midnight', bg: '#0a0f19', the: '#0d1324', ke: '#212532', ray: '#1f253b', acc: '#ff6b40', acc2: '#6fe0b0',
              lan: ['#ff5c3d', '#4dcc94', '#f2b847', '#80b8e0'], dong: '#e0e8f5', khung: '#f6dcd6', loi: '#ffdcb8', mu: '#ff4d2e' },
  neon:     { ten: 'Cyber Neon', bg: '#07020f', the: '#120822', ke: '#2a1740', ray: '#25143a', acc: '#ff2bd6', acc2: '#22e6ff',
              lan: ['#ff2bd6', '#22e6ff', '#ffe14a', '#6b7bff'], dong: '#f3e6ff', khung: '#ffc9f5', loi: '#ffd6fb', mu: '#ff2bd6' },
  aurora:   { ten: 'Aurora', bg: '#050f16', the: '#0a1a24', ke: '#173040', ray: '#16303d', acc: '#7cf0d0', acc2: '#c29bff',
              lan: ['#b07cff', '#3fe0c5', '#b6f25c', '#ff79b8'], dong: '#d8fff6', khung: '#d9fff6', loi: '#c9fff0', mu: '#5a3dff' },
  ocean:    { ten: 'Ocean Deep', bg: '#020c17', the: '#071a2b', ke: '#0f2d44', ray: '#0e2a40', acc: '#3ec6ff', acc2: '#5ef0c8',
              lan: ['#3e7bff', '#2fd6e0', '#5ef0a8', '#b8e6ff'], dong: '#dff4ff', khung: '#cfeeff', loi: '#d9f3ff', mu: '#1e6bff' },
  mono:     { ten: 'Monochrome', bg: '#0a0a0c', the: '#131316', ke: '#26262b', ray: '#232327', acc: '#ffffff', acc2: '#bfc3cc',
              lan: ['#ffffff', '#c9ccd4', '#9ea3ad', '#737883'], dong: '#f0f0f0', khung: '#f0f0f0', loi: '#ffffff', mu: '#8a8f99' },
};

/* ---------- cai dat (luu lai) ---------- */
const MAC_DINH = { theme: 'luxe', lan: null, acc: null, acc2: null, speed: 1, density: 1, glow: 1, depth: 1, zoom: 1,
                   quality: 2, orbit: true, tilt: true, hud: true, paused: false };
const KHOA = 'ae-intelligence-router:v2';
let S = { ...MAC_DINH };
try { const l = JSON.parse(localStorage.getItem(KHOA) || 'null'); if (l && THEMES[l.theme]) S = { ...MAC_DINH, ...l }; } catch (e) {}
const luu = () => { try { localStorage.setItem(KHOA, JSON.stringify(S)); } catch (e) {} };

const hex = (h) => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const tron = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/* bon lan (z = chieu sau khi xoay) */
const LAN = [
  { k: 'astra', w0: 48, w1: 60,  rc: 12, rh: 40, n: 32,  arc: 1, z: 150 },
  { k: 'kimi',  w0: 52, w1: 70,  rc: 14, rh: 44, n: 48,  arc: 0, z: 50 },
  { k: 'swarm', w0: 58, w1: 86,  rc: 18, rh: 48, n: 130, arc: 0, z: -50 },
  { k: 'cheap', w0: 64, w1: 120, rc: 25, rh: 64, n: 210, arc: 0, z: -150 },
];

/* ---------- renderer / canh ---------- */
const man = document.getElementById('man');
const san = document.getElementById('san');
const cv = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: 'high-performance' });
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(FOV, W / H, 10, 20000);
cam.position.set(0, 0, D); cam.lookAt(0, 0, 0);
const Rw = w3(ROUTER.x, ROUTER.y, 0, new THREE.Vector3());
const truc = new THREE.Group(); truc.position.copy(Rw); scene.add(truc);   // xoay quanh router
const goc = new THREE.Group(); goc.position.set(-Rw.x, -Rw.y, 0); truc.add(goc);

const U = { uPx: { value: 1 }, uTime: { value: 0 }, uD: { value: D }, uGlow: { value: 1 } };

/* ---------- vat lieu ---------- */
const matHat = () => new THREE.ShaderMaterial({
  uniforms: { uPx: U.uPx, uD: U.uD, uGlow: U.uGlow, uMul: { value: 1 } },
  transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `
    attribute float aSize; attribute vec3 aColor; attribute float aAlpha; attribute float aHalo;
    uniform float uPx; uniform float uD; varying vec3 vC; varying float vA; varying float vH;
    void main(){ vC=aColor; vA=aAlpha; vH=aHalo;
      vec4 mv = modelViewMatrix*vec4(position,1.0);
      gl_Position = projectionMatrix*mv;
      gl_PointSize = max(1.0, aSize*uPx*(1.0+aHalo*2.2)*(uD/max(1.0,-mv.z))); }`,
  fragmentShader: `
    uniform float uGlow; uniform float uMul; varying vec3 vC; varying float vA; varying float vH;
    void main(){
      float d = length(gl_PointCoord-0.5)*2.0;
      float r = 1.0/(1.0+vH*2.2);
      float loi = 1.0 - smoothstep(r*0.55, r, d);
      float q = vH*0.5*uGlow*exp(-d*d*4.0);
      float a = vA*uMul*(loi + q);
      if(a<0.003) discard;
      gl_FragColor = vec4(vC, a);
    }`,
});
function nhomHat(n) {
  const g = new THREE.BufferGeometry();
  for (const [ten, k] of [['position', 3], ['aSize', 1], ['aColor', 3], ['aAlpha', 1], ['aHalo', 1]])
    g.setAttribute(ten, new THREE.BufferAttribute(new Float32Array(n * k), k));
  const p = new THREE.Points(g, matHat()); p.frustumCulled = false;
  return p;
}

/* quad luon quay mat ve camera */
const VS_BB = `uniform float uSX; uniform float uSY; varying vec2 vUv;
  void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(0.0,0.0,0.0,1.0); mv.xy += position.xy*vec2(uSX,uSY); gl_Position=projectionMatrix*mv; }`;
function quang(sx, sy, w, h, a, k) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uC: { value: new THREE.Vector3(1, 1, 1) }, uA: { value: a }, uK: { value: k }, uSX: { value: w }, uSY: { value: h }, uGlow: U.uGlow, uMul: { value: 1 } },
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: VS_BB,
    fragmentShader: `uniform vec3 uC; uniform float uA; uniform float uK; uniform float uGlow; uniform float uMul; varying vec2 vUv;
      void main(){ float d=length(vUv-0.5)*2.0; float a=uA*uGlow*uMul*exp(-d*d*uK)*(1.0-smoothstep(0.85,1.0,d)); gl_FragColor=vec4(uC,a);} `,
  });
  const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
  q.position.copy(w3(sx, sy, 0, new THREE.Vector3())); q.frustumCulled = false;
  goc.add(q); return q;
}

/* ---------- ONG: hai dai bang cheo nhau -> nhin nghieng van co khoi ---------- */
const SEG = 110;
const matOng = () => new THREE.ShaderMaterial({
  uniforms: { uTime: U.uTime, uGlow: U.uGlow, uC: { value: new THREE.Vector3(1, 1, 1) }, uA: { value: 0.33 }, uLen: { value: 600 }, uMul: { value: 1 } },
  transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: `attribute float aU; attribute float aD; attribute float aHW; attribute float aStrip;
    varying float vU; varying float vD; varying float vHW; varying float vS;
    void main(){ vU=aU; vD=aD; vHW=aHW; vS=aStrip; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
  fragmentShader: `uniform vec3 uC; uniform float uA; uniform float uTime; uniform float uLen; uniform float uGlow; uniform float uMul;
    varying float vU; varying float vD; varying float vHW; varying float vS;
    void main(){
      float v = vD/vHW;
      float than = 1.0 - smoothstep(0.62, 1.0, abs(v));
      float loi = exp(-v*v*5.0);
      float a = uA*uGlow*(0.8*than + 0.18*loi)*(vS>0.5 ? 0.55 : 1.0);
      float vach = 1.0 - smoothstep(0.55, 1.45, abs(vD));
      float dut = step(0.52, fract(vU*uLen/15.0 - uTime*1.05));
      a += (vS>0.5 ? 0.0 : 0.5)*vach*dut*smoothstep(0.03, 0.14, vU);
      a *= smoothstep(0.0, 0.17, vU) * (1.0 - smoothstep(0.90, 0.995, vU)) * uMul;
      float am = exp(-vU*8.0);
      vec3 c = mix(uC, vec3(1.0,0.9,0.8), am*0.35);
      gl_FragColor = vec4(c, a);
    }`,
});
const bez = (p, u, o) => {
  const m = 1 - u;
  o.x = m*m*m*p[0].x + 3*m*m*u*p[1].x + 3*m*u*u*p[2].x + u*u*u*p[3].x;
  o.y = m*m*m*p[0].y + 3*m*m*u*p[1].y + 3*m*u*u*p[2].y + u*u*u*p[3].y;
  return o;
};
const doRong = (L, u) => L.w0 + (L.w1 - L.w0) * (u * u * (3 - 2 * u));
const em = (u) => u * u * (3 - 2 * u);

for (const L of LAN) {
  const g = new THREE.BufferGeometry();
  const n = (SEG + 1) * 4;
  const aU = new Float32Array(n), aD = new Float32Array(n), aHW = new Float32Array(n), aS = new Float32Array(n);
  for (let s2 = 0; s2 < 2; s2++)
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG, hw = doRong(L, u) / 2;
      for (let s = 0; s < 2; s++) {
        const j = s2 * (SEG + 1) * 2 + i * 2 + s;
        aU[j] = u; aHW[j] = hw; aD[j] = (s ? 1 : -1) * hw * 1.18; aS[j] = s2;
      }
    }
  const idx = [];
  for (let s2 = 0; s2 < 2; s2++) {
    const o = s2 * (SEG + 1) * 2;
    for (let i = 0; i < SEG; i++) { const a = o + i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  g.setIndex(idx);
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
  g.setAttribute('aD', new THREE.BufferAttribute(aD, 1));
  g.setAttribute('aHW', new THREE.BufferAttribute(aHW, 1));
  g.setAttribute('aStrip', new THREE.BufferAttribute(aS, 1));
  L.ong = new THREE.Mesh(g, matOng()); L.ong.frustumCulled = false; goc.add(L.ong);
  L.p = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  L.tam = new Float32Array((SEG + 1) * 3);
  L.n1 = new Float32Array((SEG + 1) * 3); L.n2 = new Float32Array((SEG + 1) * 3); L.hw = new Float32Array(SEG + 1);
  L.cauW = new THREE.Vector3();
}

/* ---------- nguon ngau nhien co dinh ---------- */
const nn = (() => { let s = 20260922; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gauss = () => { let u = 0; while (!u) u = nn(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * nn()); };
const kep = (v, a) => Math.max(-a, Math.min(a, v));

/* hat trong ong (cap du 150% cho thanh truot mat do) */
for (const L of LAN) {
  const n = Math.round(L.n * 1.5);
  L.hat = nhomHat(n); L.hd = [];
  for (let i = 0; i < n; i++) {
    const to = L.k === 'cheap' && nn() < 0.12;
    L.hd.push({ u: nn(), sp: 0.085 + nn() * 0.06, v: kep(gauss() * 0.3, 1), v2: kep(gauss() * 0.3, 1),
                s: to ? 2.8 + nn() * 1.2 : 1.2 + nn() * 1.5, a: 0.45 + nn() * 0.5, halo: to ? 0.5 : 0, ox: 0, oy: 0 });
  }
  goc.add(L.hat);
}

/* qua cau */
const matCau = (L) => new THREE.ShaderMaterial({
  uniforms: { uTime: U.uTime, uGlow: U.uGlow, uC: { value: new THREE.Vector3(1, 1, 1) }, uRc: { value: L.rc }, uRh: { value: L.rh },
              uArc: { value: L.arc }, uSX: { value: L.rh * 2.6 }, uSY: { value: L.rh * 2.6 }, uHov: { value: 0 } },
  transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: VS_BB,
  fragmentShader: `uniform vec3 uC; uniform float uRc; uniform float uRh; uniform float uArc; uniform float uSX; uniform float uTime; uniform float uGlow; uniform float uHov;
    varying vec2 vUv;
    void main(){
      vec2 p = (vUv-0.5)*uSX; float d = length(p);
      float rc = uRc;
      vec3 col = vec3(0.0);
      col += uC*(0.12+0.10*uHov)*(1.0 - smoothstep(uRh*0.9, uRh, d));
      col += uC*(0.32+0.55*uHov)*uGlow*exp(-pow(d/(rc*1.55),2.0));
      if(d < rc+1.0){
        float r = clamp(d/rc,0.0,1.0);
        vec3 n = normalize(vec3(p/rc, sqrt(max(0.0,1.0-r*r))));
        vec3 L = normalize(vec3(-0.5,0.55,0.68));
        float df = max(dot(n,L),0.0);
        float sp = pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.0),14.0);
        vec3 c = uC*(0.20+0.78*df) + vec3(1.0)*(sp*0.55 + 0.04*n.z);
        col += c*(1.0 - smoothstep(rc-1.2, rc+0.6, d));
      }
      /* vong sang khi re chuot vao */
      col += uC*0.9*uHov*(1.0 - smoothstep(0.8, 1.8, abs(d-rc*2.0)));
      if(uArc > 0.5){
        float rr = rc*2.25;
        float vong = 1.0 - smoothstep(0.7, 1.6, abs(d-rr));
        float m = fract((atan(p.y,p.x) - uTime*1.1)/6.2831853);
        vong *= smoothstep(0.0,0.04,m)*(1.0-smoothstep(0.26,0.32,m));
        col += uC*1.1*vong;
      }
      gl_FragColor = vec4(col, 1.0);
    }`,
});
for (const L of LAN) {
  L.cau = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matCau(L)); L.cau.frustumCulled = false; goc.add(L.cau);
}

/* may hat quanh swarm */
const MAY_N = 570, may = nhomHat(MAY_N), mayD = [];
for (let i = 0; i < MAY_N; i++)
  mayD.push({ r: 14 + Math.abs(gauss()) * 24, g: nn() * 6.283, w: (0.15 + nn() * 0.35) * (nn() < 0.5 ? 1 : -1),
              e: 0.55 + nn() * 0.45, ph: nn() * 6.283, s: 1.0 + nn() * 1.4, a: 0.35 + nn() * 0.55, f: nn() * 6.283 });
goc.add(may);

/* router */
const qMu = quang(ROUTER.x, ROUTER.y, 330, 300, 0.17, 2.4);
const qTia = quang(ROUTER.x + 50, ROUTER.y + 2, 230, 80, 0.13, 3.2);
const qAm = quang(ROUTER.x, ROUTER.y, 110, 110, 0.32, 5.0);
const qLoi = quang(ROUTER.x, ROUTER.y, 18, 18, 0.95, 3.0);
const khung = new THREE.BufferGeometry();
khung.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24 * 3), 3));
const matKhung = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.62, depthTest: false });
const octa = new THREE.LineSegments(khung, matKhung); octa.frustumCulled = false; goc.add(octa);
const dinh = nhomHat(6); goc.add(dinh);

/* dong hat ben trai */
const DONG_N = 315, dong = nhomHat(DONG_N), dongD = [];
for (let i = 0; i < DONG_N; i++) {
  const lon = nn() < 0.4;
  dongD.push({ u: nn(), sp: 1 / (12 + nn() * 7), o: kep(gauss() * 0.5, 1.1), z: nn() * 2 - 1,
               s: lon ? 4.6 + nn() * 3.0 : 1.7 + nn() * 1.5, halo: lon ? 0.7 + nn() * 0.5 : 0,
               a: 0.55 + nn() * 0.45, q: nn() * 6.283, ox: 0, oy: 0 });
}
goc.add(dong);

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const DN = [
  { gia: 3000, dich: 108000, n: 36, mau: '--l2' },
  { gia: 1500, dich: 108000, n: 72, mau: '--l3' },
  { gia: 2500, dich: 105000, n: 42, mau: '--l1' },
];

/* ---------- ap giao dien mau ---------- */
let MAU = null;
function apMau() {
  const T = THEMES[S.theme] || THEMES.luxe;
  const lan = S.lan || T.lan, acc = S.acc || T.acc, acc2 = S.acc2 || T.acc2;
  MAU = { lan: lan.map(hex), dong: hex(T.dong), am: tron(hex(T.loi), [1, 0.85, 0.65], 0.4) };
  renderer.setClearColor(T.bg, 1);
  LAN.forEach((L, i) => {
    L.ong.material.uniforms.uC.value.set(...MAU.lan[i]);
    L.cau.material.uniforms.uC.value.set(...MAU.lan[i]);
    L.mh = tron(MAU.lan[i], [1, 1, 1], 0.45);
  });
  MAU.may = tron(MAU.lan[2], [1, 1, 1], 0.35);
  matKhung.color.set(T.khung);
  qMu.material.uniforms.uC.value.set(...hex(T.mu));
  qTia.material.uniforms.uC.value.set(...tron(hex(T.loi), [1, 1, 1], 0.1));
  qAm.material.uniforms.uC.value.set(...hex(T.loi));
  const r = document.documentElement.style;
  r.setProperty('--nen', T.bg); r.setProperty('--the', T.the); r.setProperty('--ke', T.ke); r.setProperty('--ray', T.ray);
  r.setProperty('--cam', acc); r.setProperty('--luc', acc2);
  lan.forEach((c, i) => r.setProperty('--l' + i, c));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', T.bg);
  DN.forEach((_, i) => { const c = $('o' + i); if (c) c._k = -1; });
}

/* ---------- trang thai tuong tac ---------- */
const chuot = { sx: -9999, sy: -9999, trong: false, nx: 0, ny: 0 };
const xoay = { yaw: 0, pitch: 0, vy: 0, vp: 0, keo: false, lx: 0, ly: 0, dich: 0, veGoc: false, tu: 0 };
const par = { y: 0, p: 0 };
const nong = [0, 0, 0, 0];
let nongRouter = 0, chon = -1, reLan = -1, reRouter = false, khoaLan = -1;

/* ---------- cap nhat canh ---------- */
const tmp = { x: 0, y: 0 }, V = new THREE.Vector3(), V2 = new THREE.Vector3();
const M = new THREE.Matrix4();
const sp = [0, 0];
function chieuNhanh(e, x, y, z, out) {
  const w = e[3]*x + e[7]*y + e[11]*z + e[15];
  out[0] = ((e[0]*x + e[4]*y + e[8]*z + e[12]) / w * 0.5 + 0.5) * W;
  out[1] = (0.5 - (e[1]*x + e[5]*y + e[9]*z + e[13]) / w * 0.5) * H;
}
const R_DAY = 120;
function day(h, x, y, z, e) {
  /* hat tranh con tro: tinh vi tri tren man hinh, day ra nguoc chuot, lo xo mem */
  let tx = 0, ty = 0;
  if (chuot.trong) {
    chieuNhanh(e, x, y, z, sp);
    const dx = sp[0] - chuot.sx, dy = sp[1] - chuot.sy, d = Math.hypot(dx, dy);
    if (d < R_DAY && d > 0.01) { const f = Math.pow(1 - d / R_DAY, 2) * 58; tx = dx / d * f; ty = dy / d * f; }
  }
  h.ox += (tx - h.ox) * 0.16; h.oy += (ty - h.oy) * 0.16;
  return (D - z) / D;
}
function vachHat(nhom, i, x, y, z, s, c, a, h) {
  const g = nhom.geometry.attributes;
  g.position.array[i*3] = x; g.position.array[i*3+1] = y; g.position.array[i*3+2] = z;
  g.aSize.array[i] = s; g.aAlpha.array[i] = a; g.aHalo.array[i] = h;
  g.aColor.array[i*3] = c[0]; g.aColor.array[i*3+1] = c[1]; g.aColor.array[i*3+2] = c[2];
}
function xongHat(nhom, n) {
  const g = nhom.geometry.attributes;
  g.position.needsUpdate = g.aSize.needsUpdate = g.aColor.needsUpdate = g.aAlpha.needsUpdate = g.aHalo.needsUpdate = true;
  nhom.geometry.setDrawRange(0, n);
}

function capNhatCanh(g, dt) {
  U.uTime.value = g;
  U.uGlow.value = S.glow;
  const tc = ((g % CHU_KY) + CHU_KY) % CHU_KY;
  const sau = S.depth;

  truc.updateMatrixWorld(true);
  M.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse).multiply(goc.matrixWorld);
  const e = M.elements;

  const coNong = Math.max(...nong);
  for (let li = 0; li < 4; li++) {
    const L = LAN[li];
    const ex = fourier(QD[L.k].x, tc), ey = fourier(QD[L.k].y, tc), dx = ex - ROUTER.x, ze = L.z * sau;
    L.p[0].x = ROUTER.x + 12; L.p[0].y = ROUTER.y;
    L.p[1].x = ROUTER.x + 0.40 * dx; L.p[1].y = ROUTER.y;
    L.p[2].x = ex - 0.45 * dx; L.p[2].y = ey;
    L.p[3].x = ex; L.p[3].y = ey;

    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG; bez(L.p, u, tmp);
      w3(tmp.x, tmp.y, ze * em(u), V);
      L.tam[i*3] = V.x; L.tam[i*3+1] = V.y; L.tam[i*3+2] = V.z;
      L.hw[i] = doRong(L, u) / 2 * (D - V.z) / D;
    }
    let dai = 0;
    for (let i = 0; i <= SEG; i++) {
      const a = Math.max(0, i - 1), b = Math.min(SEG, i + 1);
      let tx = L.tam[b*3] - L.tam[a*3], ty = L.tam[b*3+1] - L.tam[a*3+1], tz = L.tam[b*3+2] - L.tam[a*3+2];
      const tl = Math.hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
      let n1x = ty, n1y = -tx; const nl = Math.hypot(n1x, n1y) || 1; n1x /= nl; n1y /= nl;
      const n2x = -tz * n1y, n2y = tz * n1x, n2z = tx * n1y - ty * n1x;       /* n2 = t x n1 */
      L.n1[i*3] = n1x; L.n1[i*3+1] = n1y; L.n1[i*3+2] = 0;
      L.n2[i*3] = n2x; L.n2[i*3+1] = n2y; L.n2[i*3+2] = n2z;
      if (i) dai += Math.hypot(L.tam[i*3] - L.tam[i*3-3], L.tam[i*3+1] - L.tam[i*3-2]);
    }
    const pos = L.ong.geometry.attributes.position.array;
    for (let s2 = 0; s2 < 2; s2++) {
      const N = s2 ? L.n2 : L.n1, o = s2 * (SEG + 1) * 2;
      for (let i = 0; i <= SEG; i++) {
        const hw = L.hw[i] * 1.18;
        for (let s = 0; s < 2; s++) {
          const j = (o + i * 2 + s) * 3, sg = s ? 1 : -1;
          pos[j] = L.tam[i*3] + N[i*3] * hw * sg; pos[j+1] = L.tam[i*3+1] + N[i*3+1] * hw * sg; pos[j+2] = L.tam[i*3+2] + N[i*3+2] * hw * sg;
        }
      }
    }
    L.ong.geometry.attributes.position.needsUpdate = true;
    L.ong.material.uniforms.uLen.value = dai;
    const mul = 1 + 0.9 * nong[li] - 0.55 * coNong * (1 - nong[li]);
    L.ong.material.uniforms.uMul.value = mul;
    L.hat.material.uniforms.uMul.value = mul;

    const nDung = Math.round(L.n * S.density);
    for (let i = 0; i < nDung; i++) {
      const h = L.hd[i];
      h.u += h.sp * dt; if (h.u > 1) h.u -= 1;
      const u = 0.04 + h.u * 0.95, f = u * SEG, i0 = Math.floor(f), i1 = Math.min(SEG, i0 + 1), t = f - i0;
      const cx = L.tam[i0*3] + (L.tam[i1*3] - L.tam[i0*3]) * t, cy = L.tam[i0*3+1] + (L.tam[i1*3+1] - L.tam[i0*3+1]) * t, cz = L.tam[i0*3+2] + (L.tam[i1*3+2] - L.tam[i0*3+2]) * t;
      const hw = L.hw[i0];
      let x = cx + L.n1[i0*3] * hw * h.v + L.n2[i0*3] * hw * h.v2 * 0.8;
      let y = cy + L.n1[i0*3+1] * hw * h.v + L.n2[i0*3+1] * hw * h.v2 * 0.8;
      const z = cz + L.n2[i0*3+2] * hw * h.v2 * 0.8;
      const k = day(h, x, y, z, e); x += h.ox * k; y -= h.oy * k;
      const c = tron(L.mh, MAU.am, Math.exp(-u * 7));
      const mo = Math.min(1, u / 0.08) * Math.min(1, (1 - u) / 0.06 + 0.3);
      vachHat(L.hat, i, x, y, z, h.s, c, h.a * mo, h.halo);
    }
    xongHat(L.hat, nDung);

    w3(ex, ey, ze, L.cauW);
    L.cau.position.copy(L.cauW);
    L.cau.material.uniforms.uHov.value = nong[li];
    const sc = L.rh * 2.6 * (1 + 0.28 * nong[li]);
    L.cau.material.uniforms.uSX.value = sc; L.cau.material.uniforms.uSY.value = sc;
    L.cau.material.uniforms.uRc.value = L.rc * (1 + 0.28 * nong[li]);
  }

  /* may hat quanh swarm */
  const Sw = LAN[2].cauW, nMay = Math.round(380 * S.density), mulS = LAN[2].hat.material.uniforms.uMul.value;
  for (let i = 0; i < nMay; i++) {
    const m = mayD[i], a = m.g + g * m.w;
    vachHat(may, i, Sw.x + Math.cos(a) * m.r, Sw.y + Math.sin(a) * m.r * m.e, Sw.z + Math.sin(a + m.ph) * m.r * 0.8 * sau,
            m.s, MAU.may, m.a * (0.75 + 0.25 * Math.sin(g * 3 + m.f)) * mulS, 0);
  }
  xongHat(may, nMay);

  /* bat dien 3D that: xich dao nghieng 14 do */
  const quay = g * (2 * Math.PI / 18) + (octa.userData.them = (octa.userData.them || 0) + dt * 2.2 * nongRouter);
  const cx = Rw.x, cy = Rw.y, tren = [cx, cy + 115, 0], duoi = [cx, cy - 120, 0], xd = [];
  for (let k = 0; k < 4; k++) {
    const a = quay + k * Math.PI / 2, ex0 = 70 * Math.cos(a), ez0 = 70 * Math.sin(a);
    xd.push([cx + ex0, cy + 2 - ez0 * 0.2426, ez0 * 0.97]);
  }
  const E = [];
  for (let k = 0; k < 4; k++) E.push(tren, xd[k], duoi, xd[k], xd[k], xd[(k + 1) % 4]);
  const kp = khung.attributes.position.array;
  for (let i = 0; i < 24; i++) { kp[i*3] = E[i][0]; kp[i*3+1] = E[i][1]; kp[i*3+2] = E[i][2]; }
  khung.attributes.position.needsUpdate = true;
  matKhung.opacity = 0.62 + 0.3 * nongRouter;
  [tren, duoi, ...xd].forEach((p, i) => vachHat(dinh, i, p[0], p[1], p[2], 4.2, [1, 1, 1], 0.95, 0.4));
  xongHat(dinh, 6);
  qAm.material.uniforms.uMul.value = 1 + 0.9 * nongRouter;
  qMu.material.uniforms.uMul.value = 1 + 0.6 * nongRouter;
  qLoi.material.uniforms.uMul.value = 1 + 0.4 * nongRouter;

  /* dong hat ben trai */
  const nDong = Math.round(210 * S.density);
  for (let i = 0; i < nDong; i++) {
    const d = dongD[i];
    d.u += d.sp * dt; if (d.u > 1) d.u -= 1;
    const u = d.u, con = 1 - u;
    const sx = 335 + 540 * u;
    const yc = 468 + Math.pow(con, 0.7) * (46 * Math.sin(u * 6.2 - g * 0.5) + 18 * Math.sin(u * 13 + g * 0.3));
    const sy = yc + d.o * (132 * Math.pow(con, 0.8) + 6) + 4 * Math.sin(g * 1.3 + d.q);
    w3(sx, sy, d.z * 220 * con * sau, V);
    const k = day(d, V.x, V.y, V.z, e);
    const mo = Math.min(1, u / 0.06) * Math.min(1, (1 - u) / 0.07), co = 1 - 0.55 * u * u * u;
    vachHat(dong, i, V.x + d.ox * k, V.y - d.oy * k, V.z, d.s * co, MAU.dong, d.a * mo, d.halo * co);
  }
  xongHat(dong, nDong);
}

/* ---------- HUD ---------- */
const eOut = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
const tien = (n) => '$' + Math.round(n).toLocaleString('en-US');
const dat = (el, s) => { if (el._s !== s) { el._s = s; el.textContent = s; } };

const PHUT = 90;                                   /* "in 90 minutes" */
const BUOC = [
  ['0:00', 'Pick one expensive cognitive task', 'research · analysis · documents'],
  ['0:15', 'Break the job into three tasks', 'routine · parallel via Swarm · long context'],
  ['0:30', 'Connect Kimi K3 via API', 'set up Agent Swarm · test on real data'],
  ['0:45', 'Connect GPT-6 AETumi', 'dynamic reasoning effort · route hard cases'],
  ['1:00', 'Build the Intelligence Router', '4 rules · verify everything'],
  ['1:15', 'Find your first client', 'price the job humans are paid'],
];
const buocs = $('buocs'), dsCham = [], dsBuoc = [];
BUOC.forEach((b, i) => {
  const x = 30 + 190 * i;
  const c = document.createElement('div'); c.className = 'cham'; c.style.left = x + 'px'; c.innerHTML = '<b></b>';
  const t = document.createElement('div'); t.className = 'buoc'; t.style.left = x + 'px';
  t.innerHTML = `<span class="tg">${b[0]}</span><span class="td">${b[1]}</span><span class="ph">${b[2]}</span>`;
  buocs.append(c, t); dsCham.push(c); dsBuoc.push(t);
});
function veO(i, sang) {
  const c = $('o' + i), x = c.getContext('2d'), Dn = DN[i];
  if (c._k === sang) return; c._k = sang;
  const mau = getComputedStyle(document.documentElement).getPropertyValue(Dn.mau).trim() || '#fff';
  x.clearRect(0, 0, c.width, c.height);
  for (let j = 0; j < Dn.n; j++) {
    x.globalAlpha = j < sang ? 1 : 0.16; x.fillStyle = mau;
    x.fillRect(Math.round((j % 14) * 9.8), Math.floor(j / 14) * 5, 8, 3);
  }
}

const luat = [1, 2, 3, 4, 5].map((i) => $('l' + i));
const LUAT_LAN = [3, 2, 1, 0, -2];                 /* the luat -> lan (-2: tat ca) */
const nhanCau = [0, 1, 2, 3].map((i) => $('c' + i));
const LECH = [[42, -21], [47, -21], [56, -20], [61, -22]];
const goal = $('goal'), rt = $('rt'), rt2 = $('rt2'), hudPhang = $('hud-phang');
const pv = [0, 0], RouterMan = [ROUTER.x, ROUTER.y];
function chieu(v, out) { V2.copy(v).applyMatrix4(goc.matrixWorld).project(cam); out[0] = (V2.x * 0.5 + 0.5) * W; out[1] = (0.5 - V2.y * 0.5) * H; return out; }

function capNhatHud(tc) {
  const giay = Math.min(PHUT * 60, 33 + (PHUT * 60 / 48) * tc);
  const s = Math.floor(giay);
  dat($('dh'), `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);

  luat.forEach((el, i) => {
    const k = Math.max(0, Math.min(1, (tc - 0.25 - 0.2 * i) / 0.45));
    el.style.opacity = k; el.style.transform = `translateX(${(1 - k) * -14}px)`;
    el.classList.toggle('sang', LUAT_LAN[i] === -2 ? reLan === -3 : LUAT_LAN[i] === chon);
  });

  const e1 = eOut((tc - 0.6) / 2.8), r = 66 * e1, a = 500 * e1;
  dat($('cp1'), tien(r)); dat($('cp2'), tien(a));
  $('bp1').style.width = (330 * r / 500) + 'px'; $('bp2').style.width = (330 * a / 500) + 'px';
  dat($('tiet'), `router saves ${Math.round(87 * e1)}%`);

  const e2 = eOut((tc - 1.7) / 5.0);
  let tong = 0;
  DN.forEach((Dn, i) => {
    const v = Math.round(Dn.dich * e2), k = Math.floor(v / Dn.gia);
    tong += v; dat($('d' + i), tien(v)); dat($('k' + i), `${k} clients`); veO(i, k);
  });
  dat($('tong'), `${tien(tong)} / mo`);
  dat($('nam'), `≈ $${(tong * 12 / 1e6).toFixed(2)}M / year · one laptop · one $20 subscription`);

  const p = Math.min(1, giay / (PHUT * 60));
  $('rayfill').style.width = (1140 * p) + 'px'; $('vach').style.left = (30 + 1140 * p) + 'px';
  const dang = Math.min(5, Math.floor(giay / (PHUT * 10)));
  dsCham.forEach((c, i) => { const cn = 'cham' + (i < dang ? ' qua' : i === dang ? ' dang' : ''); if (c.className !== cn) c.className = cn; });
  dsBuoc.forEach((b, i) => { const cn = 'buoc' + (i === dang ? ' dang' : ''); if (b.className !== cn) b.className = cn; });

  /* nhan bam theo vi tri 3D da chieu */
  const coNong = Math.max(...nong);
  LAN.forEach((L, i) => {
    chieu(L.cauW, pv); L.man = [pv[0], pv[1]];
    const el = nhanCau[i];
    el.style.transform = `translate(${(pv[0] + LECH[i][0]).toFixed(1)}px,${(pv[1] + LECH[i][1]).toFixed(1)}px)`;
    el.style.opacity = (1 - 0.55 * coNong * (1 - nong[i])).toFixed(3);
    el.classList.toggle('sang', nong[i] > 0.5);
  });
  chieu(Rw, pv); RouterMan[0] = pv[0]; RouterMan[1] = pv[1];
  rt.style.transform = `translate(${pv[0].toFixed(1)}px,${(pv[1] + 101).toFixed(1)}px) translateX(-50%)`;
  rt2.style.transform = `translate(${pv[0].toFixed(1)}px,${(pv[1] + 120).toFixed(1)}px) translateX(-50%)`;
  w3(330 + 18 * Math.sin(2 * Math.PI * tc / CHU_KY + 0.4), 395 + 20 * Math.sin(2 * Math.PI * tc / CHU_KY - 1.2), 0, V);
  chieu(V, pv);
  goal.style.transform = `translate(${(pv[0] - 40).toFixed(1)}px,${(pv[1] - 15).toFixed(1)}px)`;

  /* nghieng nhe ca bang HUD theo goc xoay -> "layout xoay" ma chu van doc duoc */
  hudPhang.style.transform = S.tilt ? `perspective(3200px) rotateX(${kep(-truc.rotation.x * 0.12, 0.05).toFixed(4)}rad) rotateY(${kep(truc.rotation.y * 0.12, 0.09).toFixed(4)}rad)` : '';
}

/* ---------- vua khung ---------- */
let tyLe = 1, gocX = 0, gocY = 0;
function vuaKhung() {
  const w = man.clientWidth, h = man.clientHeight;
  tyLe = Math.min(w / W, h / H); gocX = (w - W * tyLe) / 2; gocY = (h - H * tyLe) / 2;
  san.style.transform = `translate(${gocX}px,${gocY}px) scale(${tyLe})`;
  cv.style.left = gocX + 'px'; cv.style.top = gocY + 'px';
  const dpr = Math.min(window.devicePixelRatio || 1, S.quality);
  renderer.setPixelRatio(dpr);
  renderer.setSize(Math.round(W * tyLe), Math.round(H * tyLe), true);
  U.uPx.value = tyLe * dpr;
}
window.addEventListener('resize', vuaKhung);

/* ---------- chuot / cham ---------- */
const conTro = $('con-tro'), goiY = $('goi-y');
const layToaDo = (ev) => { const r = man.getBoundingClientRect(); return [(ev.clientX - r.left - gocX) / tyLe, (ev.clientY - r.top - gocY) / tyLe, ev.clientX - r.left, ev.clientY - r.top]; };
const trongBang = (t) => !!(t && t.closest && t.closest('#dk, #nut-dk'));
let lanTuongTac = -1e9;
function danhDau() { lanTuongTac = performance.now(); goiY.classList.add('an'); }

man.addEventListener('pointermove', (ev) => {
  const [sx, sy, cx, cy] = layToaDo(ev);
  chuot.sx = sx; chuot.sy = sy; chuot.trong = !trongBang(ev.target);
  chuot.nx = kep((sx / W) * 2 - 1, 1); chuot.ny = kep((sy / H) * 2 - 1, 1);
  conTro.style.transform = `translate(${cx}px,${cy}px)`;
  conTro.classList.toggle('hien', chuot.trong);
  if (xoay.keo) {
    const dx = ev.clientX - xoay.lx, dy = ev.clientY - xoay.ly;
    xoay.lx = ev.clientX; xoay.ly = ev.clientY; xoay.dich += Math.abs(dx) + Math.abs(dy);
    xoay.vy = dx * 0.0030; xoay.vp = dy * 0.0024;
    xoay.yaw = kep(xoay.yaw + xoay.vy, 0.95); xoay.pitch = kep(xoay.pitch + xoay.vp, 0.5);
    danhDau();
  }
});
man.addEventListener('pointerleave', () => { chuot.trong = false; conTro.classList.remove('hien'); });
man.addEventListener('pointerdown', (ev) => {
  if (trongBang(ev.target) || ev.button > 0) return;
  xoay.keo = true; xoay.lx = ev.clientX; xoay.ly = ev.clientY; xoay.dich = 0; xoay.veGoc = false;
  man.classList.add('dang-keo');
  try { man.setPointerCapture(ev.pointerId); } catch (e) {}
});
const tha = (ev) => {
  if (!xoay.keo) return;
  xoay.keo = false; man.classList.remove('dang-keo');
  if (xoay.dich < 6 && !trongBang(ev.target)) bam(ev);
};
man.addEventListener('pointerup', tha); man.addEventListener('pointercancel', tha);
man.addEventListener('dblclick', (ev) => { if (!trongBang(ev.target)) { xoay.veGoc = true; danhDau(); } });

function bam(ev) {
  /* bam vao qua cau -> ghim sang lan do; bam cho khac -> bo ghim. Kem gon song lan toa */
  khoaLan = reLan >= 0 ? (khoaLan === reLan ? -1 : reLan) : -1;
  const [, , cx, cy] = layToaDo(ev);
  const gs = document.createElement('i'); gs.className = 'gon'; gs.style.left = cx + 'px'; gs.style.top = cy + 'px';
  man.appendChild(gs); setTimeout(() => gs.remove(), 900);
  danhDau();
}

let reLuat = null;
luat.forEach((el, i) => {
  el.addEventListener('pointerenter', () => { reLuat = LUAT_LAN[i]; });
  el.addEventListener('pointerleave', () => { reLuat = null; });
});

function doReChuot() {
  reLan = -1; reRouter = false;
  if (chuot.trong && !xoay.keo) {
    let tot = 1e9;
    LAN.forEach((L, i) => {
      if (!L.man) return;
      const d = Math.hypot(L.man[0] - chuot.sx, L.man[1] - chuot.sy);
      if (d < L.rc * 2.6 + 14 && d < tot) { tot = d; reLan = i; }
    });
    if (reLan < 0 && Math.hypot(RouterMan[0] - chuot.sx, RouterMan[1] - chuot.sy) < 95) reRouter = true;
  }
  if (reLuat !== null) { if (reLuat === -2) { reLan = -3; reRouter = true; } else reLan = reLuat; }
  chon = reLan >= 0 ? reLan : khoaLan;
  man.classList.toggle('tro-tay', reLan >= 0 || reRouter);
  for (let i = 0; i < 4; i++) nong[i] += ((chon === i ? 1 : 0) - nong[i]) * 0.12;
  nongRouter += ((reRouter ? 1 : 0) - nongRouter) * 0.1;
}

/* ---------- goc xoay moi khung ---------- */
function capNhatXoay(g) {
  if (!xoay.keo) {
    xoay.yaw = kep(xoay.yaw + xoay.vy, 0.95); xoay.pitch = kep(xoay.pitch + xoay.vp, 0.5);
    xoay.vy *= 0.93; xoay.vp *= 0.93;
    if (xoay.veGoc) {
      xoay.yaw *= 0.86; xoay.pitch *= 0.86; xoay.vy = xoay.vp = 0;
      if (Math.abs(xoay.yaw) + Math.abs(xoay.pitch) < 0.002) { xoay.yaw = xoay.pitch = 0; xoay.veGoc = false; }
    }
  }
  const muc = chuot.trong ? 1 : 0;
  par.y += (chuot.nx * 0.10 * muc - par.y) * 0.05;
  par.p += (chuot.ny * 0.07 * muc - par.p) * 0.05;
  const yen = performance.now() - lanTuongTac > 4000;
  const tu = (S.orbit && yen && !xoay.keo) ? 0.22 * Math.sin(g * 0.13) : 0;
  xoay.tu += (tu - xoay.tu) * 0.02;
  truc.rotation.y = xoay.yaw + par.y + xoay.tu;
  truc.rotation.x = xoay.pitch + par.p;
  cam.position.z = D / S.zoom;
  cam.updateMatrixWorld();
}

/* ---------- bang dieu khien ---------- */
const nutDk = $('nut-dk'), dk = $('dk');
nutDk.addEventListener('click', () => { const mo = dk.hidden; dk.hidden = !mo; nutDk.setAttribute('aria-expanded', String(mo)); danhDau(); });
$('dk-dong').addEventListener('click', () => { dk.hidden = true; nutDk.setAttribute('aria-expanded', 'false'); nutDk.focus(); });

const luoiTheme = $('dk-theme');
Object.entries(THEMES).forEach(([id, T]) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'mau-the'; b.dataset.id = id; b.style.background = T.bg;
  b.innerHTML = `<span class="cham4">${T.lan.map((c) => `<i style="background:${c}"></i>`).join('')}</span><span class="ten">${T.ten}</span>`;
  b.addEventListener('click', () => { S.theme = id; S.lan = null; S.acc = null; S.acc2 = null; luu(); apMau(); dongBoDk(); });
  luoiTheme.appendChild(b);
});
const oMau = [0, 1, 2, 3].map((i) => $('dk-l' + i));
oMau.forEach((o, i) => o.addEventListener('input', () => {
  const T = THEMES[S.theme]; S.lan = (S.lan || T.lan).slice(); S.lan[i] = o.value; luu(); apMau();
}));
$('dk-acc').addEventListener('input', (ev) => { S.acc = ev.target.value; luu(); apMau(); });
$('dk-acc2').addEventListener('input', (ev) => { S.acc2 = ev.target.value; luu(); apMau(); });

const TRUOT = { speed: (v) => v.toFixed(2) + '×', density: (v) => Math.round(v * 100) + '%', glow: (v) => Math.round(v * 100) + '%',
                depth: (v) => Math.round(v * 100) + '%', zoom: (v) => Math.round(v * 100) + '%' };
Object.keys(TRUOT).forEach((k) => {
  const o = $('dk-' + k), hien = $('dk-' + k + '-v');
  o.addEventListener('input', () => { S[k] = Number(o.value); hien.textContent = TRUOT[k](S[k]); luu(); });
});
['orbit', 'tilt', 'hud', 'paused'].forEach((k) => {
  $('dk-' + k).addEventListener('change', (ev) => { S[k] = ev.target.checked; luu(); apHien(); });
});
$('dk-quality').addEventListener('change', (ev) => { S.quality = Number(ev.target.value); luu(); vuaKhung(); });
$('dk-replay').addEventListener('click', () => { lech = g; danhDau(); });
$('dk-reset-view').addEventListener('click', () => { xoay.veGoc = true; danhDau(); });
$('dk-reset').addEventListener('click', () => { S = { ...MAC_DINH }; luu(); apMau(); apHien(); vuaKhung(); dongBoDk(); xoay.veGoc = true; });
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !dk.hidden) { dk.hidden = true; nutDk.focus(); } });

function apHien() {
  hudPhang.style.visibility = S.hud ? '' : 'hidden';
  $('nhan3d').style.visibility = S.hud ? '' : 'hidden';
}
function dongBoDk() {
  const T = THEMES[S.theme], lan = S.lan || T.lan;
  oMau.forEach((o, i) => { o.value = '#' + new THREE.Color(lan[i]).getHexString(); });
  $('dk-acc').value = '#' + new THREE.Color(S.acc || T.acc).getHexString();
  $('dk-acc2').value = '#' + new THREE.Color(S.acc2 || T.acc2).getHexString();
  Object.keys(TRUOT).forEach((k) => { $('dk-' + k).value = S[k]; $('dk-' + k + '-v').textContent = TRUOT[k](S[k]); });
  ['orbit', 'tilt', 'hud', 'paused'].forEach((k) => { $('dk-' + k).checked = !!S[k]; });
  $('dk-quality').value = String(S.quality);
  luoiTheme.querySelectorAll('.mau-the').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === S.theme)));
}

/* ---------- vong lap ---------- */
const qs = new URLSearchParams(location.search);
const dungTai = qs.has('t') ? Number(qs.get('t')) : null;
if (qs.has('theme') && THEMES[qs.get('theme')]) { S.theme = qs.get('theme'); S.lan = S.acc = S.acc2 = null; }
const itChuyenDong = matchMedia('(prefers-reduced-motion: reduce)').matches;
let thay = true;
new IntersectionObserver((en) => { thay = en[0].isIntersecting; }).observe(man);

let g = 0, lech = 0, tTruoc = 0, daAm = false;
apMau(); apHien(); vuaKhung(); dongBoDk();

function khungHinh(now) {
  requestAnimationFrame(khungHinh);
  if (qs.has('quay')) return;
  const dtThuc = Math.min(0.05, (now - (tTruoc || now)) / 1000); tTruoc = now;
  if (!thay) return;
  let dt = S.paused ? 0 : dtThuc * S.speed;
  if (dungTai !== null || itChuyenDong) {
    const T = dungTai !== null ? dungTai : 20;
    if (!daAm) { daAm = true; capNhatXoay(T); for (let k = 0; k < 400; k++) capNhatCanh(T - 20 + k * 0.05, 0.05); }
    g = T; dt = 0; lech = 0;
  } else g += dt;
  doReChuot();
  capNhatXoay(g);
  capNhatCanh(g, dt);
  capNhatHud((((g - lech) % CHU_KY) + CHU_KY) % CHU_KY);
  renderer.render(scene, cam);
}
requestAnimationFrame(khungHinh);
window.__san_sang = true;
/* che do quay preview: ?quay=1 -> dung vong lap, ve tung khung theo thoi gian chi dinh */
if (qs.has('quay')) {
  window.__veTai = (t, dtK) => { g = t; doReChuot(); capNhatXoay(t); capNhatCanh(t, dtK); capNhatHud(((t % CHU_KY) + CHU_KY) % CHU_KY); renderer.render(scene, cam); return true; };
}
window.__ir = { S, xoay, THEMES };
