/* three-bg.js — DNA Helix + Particle Field */
(function () {
  if (typeof THREE === 'undefined') return;

  const canvas   = document.getElementById('bg-canvas');
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 600);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  camera.position.set(0, 1, 22);

  /* ── Mouse tracking ── */
  const mouse   = { x: 0, y: 0 };
  const tMouse  = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    tMouse.x = (e.clientX / innerWidth  - 0.5) * 2;
    tMouse.y = -(e.clientY / innerHeight - 0.5) * 2;
  });

  /* ── Ambient particle field ── */
  const PCOUNT = 280;
  const pPos = new Float32Array(PCOUNT * 3);
  const pOrig = new Float32Array(PCOUNT * 3);
  for (let i = 0; i < PCOUNT; i++) {
    const x = (Math.random() - 0.5) * 72;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 38 - 6;
    pPos[i*3]=x; pPos[i*3+1]=y; pPos[i*3+2]=z;
    pOrig[i*3]=x; pOrig[i*3+1]=y; pOrig[i*3+2]=z;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.065, color: 0x00ff88,
    transparent: true, opacity: 0.38,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Neural connection lines ── */
  const conPts = [];
  for (let i = 0; i < 55; i++) {
    const x1 = (Math.random() - 0.5) * 60, y1 = (Math.random() - 0.5) * 40, z1 = (Math.random() - 0.5) * 30 - 10;
    conPts.push(new THREE.Vector3(x1, y1, z1),
                new THREE.Vector3(x1 + (Math.random()-0.5)*14, y1 + (Math.random()-0.5)*9, z1));
  }
  const conGeo = new THREE.BufferGeometry().setFromPoints(conPts);
  const conMat = new THREE.LineBasicMaterial({
    color: 0x00ff88, transparent: true, opacity: 0.045,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.LineSegments(conGeo, conMat));

  /* ── DNA Double Helix ── */
  const dnaGroup = new THREE.Group();

  const N_PTS   = 130;   // points per strand
  const N_TURNS = 5;
  const RADIUS  = 2.6;
  const HEIGHT  = 24;

  const s1pts = [], s2pts = [];
  for (let i = 0; i <= N_PTS; i++) {
    const t = (i / N_PTS) * Math.PI * 2 * N_TURNS;
    const y = (i / N_PTS) * HEIGHT - HEIGHT / 2;
    s1pts.push(new THREE.Vector3(RADIUS * Math.cos(t),      y, RADIUS * Math.sin(t)));
    s2pts.push(new THREE.Vector3(RADIUS * Math.cos(t+Math.PI), y, RADIUS * Math.sin(t+Math.PI)));
  }

  /* Strand backbone lines */
  const addLine = (pts, color, opacity) => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
    return new THREE.Line(geo, mat);
  };
  dnaGroup.add(addLine(s1pts, 0x00ff88, 0.80));
  dnaGroup.add(addLine(s2pts, 0x0099ee, 0.60));

  /* Strand glow (wider pass) */
  dnaGroup.add(addLine(s1pts, 0x00ff88, 0.18));
  dnaGroup.add(addLine(s2pts, 0x00ccff, 0.14));

  /* Nucleotide nodes + base pair rungs */
  const nodeGeo   = new THREE.SphereGeometry(0.11, 8, 8);
  const nodeMat1  = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
  const nodeMat2  = new THREE.MeshBasicMaterial({ color: 0x00aaff });
  const rungPts   = [];

  for (let i = 0; i <= N_PTS; i += 5) {
    const t = (i / N_PTS) * Math.PI * 2 * N_TURNS;
    const y = (i / N_PTS) * HEIGHT - HEIGHT / 2;
    const x1 = RADIUS * Math.cos(t),        z1 = RADIUS * Math.sin(t);
    const x2 = RADIUS * Math.cos(t+Math.PI), z2 = RADIUS * Math.sin(t+Math.PI);

    const n1 = new THREE.Mesh(nodeGeo, nodeMat1);
    n1.position.set(x1, y, z1);
    dnaGroup.add(n1);

    const n2 = new THREE.Mesh(nodeGeo, nodeMat2);
    n2.position.set(x2, y, z2);
    dnaGroup.add(n2);

    if (i % 10 === 0) {
      rungPts.push(new THREE.Vector3(x1,y,z1), new THREE.Vector3(x2,y,z2));
    }
  }

  /* Rungs */
  const rGeo = new THREE.BufferGeometry().setFromPoints(rungPts);
  const rMat = new THREE.LineBasicMaterial({
    color: 0x00ff88, transparent: true, opacity: 0.22,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  dnaGroup.add(new THREE.LineSegments(rGeo, rMat));

  /* Ambient glow sphere around helix */
  const glowGeo = new THREE.SphereGeometry(5, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00ff88, transparent: true, opacity: 0.025,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  dnaGroup.add(new THREE.Mesh(glowGeo, glowMat));

  dnaGroup.position.set(9, 0, -5);
  scene.add(dnaGroup);

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
