/* three-bg.js — DNA Helix + Particle Field (v2, cinematic redesign) */
(function () {
  if (typeof THREE === 'undefined') return;

  const canvas   = document.getElementById('bg-canvas');
  const scene    = new THREE.Scene();
  scene.fog      = new THREE.FogExp2(0x020c18, 0.014);

  const camera   = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 600);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
  if ('toneMapping' in renderer) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }
  camera.position.set(0, 1, 22);

  /* ── Soft radial glow sprite texture (procedural, no external assets) ── */
  function makeGlowTexture() {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.22, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
    g.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }
  const glowTex = makeGlowTexture();

  /* ── Flowing "data pulse" strip texture for the helix strands ── */
  function makeFlowTexture(hex) {
    const w = 16, h = 256;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = hex;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0.00, 'rgba(255,255,255,0)');
    g.addColorStop(0.42, 'rgba(255,255,255,0)');
    g.addColorStop(0.50, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.58, 'rgba(255,255,255,0)');
    g.addColorStop(1.00, 'rgba(255,255,255,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 7);
    tex.needsUpdate = true;
    return tex;
  }

  /* ── Mouse tracking ── */
  const mouse  = { x: 0, y: 0 };
  const tMouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    tMouse.x = (e.clientX / innerWidth  - 0.5) * 2;
    tMouse.y = -(e.clientY / innerHeight - 0.5) * 2;
  });

  /* ── Ambient particle field ── */
  const PCOUNT = 260;
  const pPos  = new Float32Array(PCOUNT * 3);
  const pOrig = new Float32Array(PCOUNT * 3);
  for (let i = 0; i < PCOUNT; i++) {
    const x = (Math.random() - 0.5) * 74;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 40 - 6;
    pPos[i*3]=x; pPos[i*3+1]=y; pPos[i*3+2]=z;
    pOrig[i*3]=x; pOrig[i*3+1]=y; pOrig[i*3+2]=z;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.34, map: glowTex, color: 0x6fffc3,
    transparent: true, opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Faint neural connection lines (depth texture) ── */
  const conPts = [];
  for (let i = 0; i < 46; i++) {
    const x1 = (Math.random() - 0.5) * 60, y1 = (Math.random() - 0.5) * 40, z1 = (Math.random() - 0.5) * 30 - 10;
    conPts.push(new THREE.Vector3(x1, y1, z1),
                new THREE.Vector3(x1 + (Math.random()-0.5)*14, y1 + (Math.random()-0.5)*9, z1));
  }
  const conGeo = new THREE.BufferGeometry().setFromPoints(conPts);
  const conMat = new THREE.LineBasicMaterial({
    color: 0x1e9dff, transparent: true, opacity: 0.05,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.LineSegments(conGeo, conMat));

  /* ── DNA Double Helix — smooth glowing glass tubes ── */
  const dnaGroup = new THREE.Group();

  const N_PTS   = 140;
  const N_TURNS = 5;
  const RADIUS  = 2.6;
  const HEIGHT  = 24;
  const COL_A   = 0x00ff9c;   // strand 1
  const COL_B   = 0x22a6ff;   // strand 2

  const s1pts = [], s2pts = [];
  for (let i = 0; i <= N_PTS; i++) {
    const t = (i / N_PTS) * Math.PI * 2 * N_TURNS;
    const y = (i / N_PTS) * HEIGHT - HEIGHT / 2;
    s1pts.push(new THREE.Vector3(RADIUS * Math.cos(t),          y, RADIUS * Math.sin(t)));
    s2pts.push(new THREE.Vector3(RADIUS * Math.cos(t + Math.PI), y, RADIUS * Math.sin(t + Math.PI)));
  }

  function buildStrand(pts, color) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const group = new THREE.Group();

    /* soft outer halo (glow) */
    const haloGeo = new THREE.TubeGeometry(curve, 220, 0.16, 8, false);
    const haloMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.10,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    group.add(new THREE.Mesh(haloGeo, haloMat));

    /* bright core with animated flowing pulse */
    const coreGeo = new THREE.TubeGeometry(curve, 220, 0.045, 8, false);
    const flowTex = makeFlowTexture(`#${color.toString(16).padStart(6, '0')}`);
    const coreMat = new THREE.MeshBasicMaterial({
      color, map: flowTex, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    return { group, flowTex, haloMat };
  }

  const strand1 = buildStrand(s1pts, COL_A);
  const strand2 = buildStrand(s2pts, COL_B);
  dnaGroup.add(strand1.group, strand2.group);

  /* Nucleotide nodes + base-pair rungs */
  const nodeGeo  = new THREE.IcosahedronGeometry(0.1, 1);
  const nodeMat1 = new THREE.MeshBasicMaterial({ color: COL_A });
  const nodeMat2 = new THREE.MeshBasicMaterial({ color: COL_B });
  const rungMat  = new THREE.MeshBasicMaterial({
    color: 0x35e0c0, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, depthWrite: false
  });

  function connector(p1, p2, radius) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, 6, 1, true);
    const mesh = new THREE.Mesh(geo, rungMat);
    mesh.position.copy(p1).add(dir.clone().multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function nodeGlow(color, scale) {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    spr.scale.set(scale, scale, 1);
    return spr;
  }

  for (let i = 0; i <= N_PTS; i += 5) {
    const t = (i / N_PTS) * Math.PI * 2 * N_TURNS;
    const y = (i / N_PTS) * HEIGHT - HEIGHT / 2;
    const p1 = new THREE.Vector3(RADIUS * Math.cos(t),          y, RADIUS * Math.sin(t));
    const p2 = new THREE.Vector3(RADIUS * Math.cos(t + Math.PI), y, RADIUS * Math.sin(t + Math.PI));

    const n1 = new THREE.Mesh(nodeGeo, nodeMat1); n1.position.copy(p1);
    n1.add(nodeGlow(COL_A, 0.5));
    dnaGroup.add(n1);

    const n2 = new THREE.Mesh(nodeGeo, nodeMat2); n2.position.copy(p2);
    n2.add(nodeGlow(COL_B, 0.5));
    dnaGroup.add(n2);

    if (i % 10 === 0) dnaGroup.add(connector(p1, p2, 0.018));
  }

  /* Ambient glow sphere around helix (used for the hero "bloom" moment) */
  const glowGeo = new THREE.SphereGeometry(5.5, 20, 20);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00ff9c, transparent: true, opacity: 0.028,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  dnaGroup.add(new THREE.Mesh(glowGeo, glowMat));

  dnaGroup.position.set(9, 0, -5);
  scene.add(dnaGroup);

  /* ── Hero scroll-expand hook ──
     script.js calls window.setHeroDNAProgress(p) as the user scrolls
     through the hero; the helix zooms in, grows, recenters and glows
     brighter — becoming the "expanding" hero visual. */
  let heroProgress = 0;
  window.setHeroDNAProgress = function (p) {
    heroProgress = Math.max(0, Math.min(1, p));
  };
  const baseCamZ   = camera.position.z;    // 22
  const baseGroupX = dnaGroup.position.x;  // 9
  let dnaScale = 1;

  /* ── Clock ── */
  const clock = new THREE.Clock();

  /* ── Animate ── */
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* Smooth mouse */
    mouse.x += (tMouse.x - mouse.x) * 0.04;
    mouse.y += (tMouse.y - mouse.y) * 0.04;

    /* Rotate DNA slowly */
    dnaGroup.rotation.y = t * 0.17;
    dnaGroup.position.y = Math.sin(t * 0.28) * 0.6;

    /* Flowing data-pulse along each strand */
    strand1.flowTex.offset.y = -(t * 0.16) % 1;
    strand2.flowTex.offset.y = -(t * 0.16 + 0.4) % 1;

    /* Hero scroll-expand: zoom in, recenter, grow and glow more as the
       user scrolls through the hero section */
    const targetCamZ   = baseCamZ - heroProgress * 12.5;
    const targetGroupX = baseGroupX - heroProgress * baseGroupX;
    const targetScale  = 1 + heroProgress * 0.85;
    const targetGlow   = 0.028 + heroProgress * 0.16;

    camera.position.z   += (targetCamZ   - camera.position.z)   * 0.07;
    dnaGroup.position.x += (targetGroupX - dnaGroup.position.x) * 0.07;
    dnaScale             += (targetScale  - dnaScale)            * 0.07;
    dnaGroup.scale.setScalar(dnaScale);
    glowMat.opacity     += (targetGlow   - glowMat.opacity)     * 0.07;

    /* Gently float particles */
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < PCOUNT; i++) {
      pos[i*3+1] = pOrig[i*3+1] + Math.sin(t * 0.22 + i * 0.013) * 0.75;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    /* Camera parallax */
    camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  })();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
