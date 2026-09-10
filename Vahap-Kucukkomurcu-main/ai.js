/* ai.js — Claude AI Analysis Integration
 *
 * SETUP (optional — works in demo mode without a key):
 *   1. Get an API key from https://console.anthropic.com
 *   2. Replace the empty string below with your key
 *   3. Set DEMO_MODE to false
 *
 * ⚠  The key will be visible in source. Fine for personal portfolios
 *    behind a low-spend limit. For production, use a backend proxy.
 */

const AI_CFG = {
  apiKey:    '',          // ← paste your Anthropic API key here
  model:     'claude-sonnet-4-6',
  demoMode:  true         // ← set false when you have a key
};

/* ── Demo responses ──────────────────────────────────────────── */
const SKILL_DEMOS = {
  'Python': `<div class="ah">// Primary Use Cases</div>
<p>Python is Vahap's core scripting language, running across every domain in his research portfolio:</p>
<ul>
  <li><code>BioPython</code> — Genomic parsing, ortholog mapping, database query wrappers for the C.elegans browser</li>
  <li><code>pandas + matplotlib</code> — Experimental data wrangling and publication-ready visualization</li>
  <li><code>scikit-learn</code> — ML pipeline construction: data splitting, ANN training, model evaluation</li>
  <li><code>numpy</code> — Numerical computing underlying all scientific computation</li>
</ul>
<div class="ah">// GA Implementation</div>
<p>In the FDM optimization project, Vahap built a Genetic Algorithm from scratch in Python — including tournament selection, single-point crossover, and adaptive mutation — interfaced with a <code>scikit-learn</code> MLPRegressor as the fitness evaluator. This hybrid <code>GA-ANN</code> architecture is a real research-grade pattern used in manufacturing process control.</p>
<div class="ah">// Proficiency Level</div>
<p>Advanced. Comfortable with OOP design, scientific computing stack, custom algorithm implementation, and integrating bioinformatics libraries into research workflows.</p>`,

  'MATLAB': `<div class="ah">// Role in Research</div>
<p>MATLAB serves as Vahap's parallel implementation environment, complementing Python for numerical and engineering analysis:</p>
<ul>
  <li>Neural network training using the Deep Learning Toolbox</li>
  <li>Taguchi ANOVA analysis and S/N ratio computation</li>
  <li>Signal processing for ECG filter characterization</li>
  <li>Matrix operations and optimization algorithm prototyping</li>
</ul>
<div class="ah">// GA-ANN in MATLAB</div>
<p>The FDM optimization project required full implementation in both Python and MATLAB — Vahap built parallel <code>GA</code> + <code>feedforwardnet</code> pipelines, producing identical results in both environments. This validates reproducibility across platforms — an important quality in engineering research.</p>`,

  'AutoDock Vina': `<div class="ah">// What AutoDock Vina Does</div>
<p>AutoDock Vina is an open-source molecular docking engine that predicts the preferred binding orientation and free energy of a small molecule (ligand) inside a protein's active site. Lower binding affinity = stronger predicted binding = better drug candidate.</p>
<div class="ah">// Vahap's Application — DPP-4 Screening</div>
<p>Vahap used AutoDock Vina to virtually screen natural compounds from the SANC database against the <strong>DPP-4 enzyme</strong> (Dipeptidyl Peptidase-4), a validated anti-diabetic drug target. The pipeline:</p>
<ul>
  <li>Receptor prepared in <code>UCSF Chimera</code> (hydrogens, charges, grid box around active site residues Arg125, Glu205, Tyr662)</li>
  <li>Batch docking of top SANC candidates via Vina's exhaustiveness search</li>
  <li>Poses ranked by <code>binding affinity (kcal/mol)</code> — lower = stronger</li>
  <li>Top compounds inspected in <code>BIOVIA Discovery Studio</code> for interaction quality</li>
</ul>
<div class="ah">// Technical Note</div>
<p>Vina uses the BFGS local optimizer with a scoring function balancing hydrophobic, H-bond, and torsional entropy terms. It's ~100× faster than AutoDock 4 — making it ideal for screening compound libraries.</p>`,

  'BIOVIA Discovery Studio': `<div class="ah">// Role in Drug Discovery Workflow</div>
<p>BIOVIA Discovery Studio Visualizer is the post-docking analysis tool Vahap uses to understand <em>why</em> a compound binds — not just how strongly.</p>
<div class="ah">// 2D/3D Interaction Analysis</div>
<p>After AutoDock Vina produces docked poses, Vahap imports them into BIOVIA DS to generate:</p>
<ul>
  <li><strong>3D view</strong> — Protein surface/ribbon with ligand in binding cavity, colored by interaction type</li>
  <li><strong>2D interaction map</strong> — Schematic showing H-bonds (green dashed), hydrophobic contacts (grey arcs), pi-stacking</li>
  <li><strong>Residue labeling</strong> — Which amino acids (Arg125, Glu205...) form contacts and their bond distances</li>
</ul>
<div class="ah">// Research Impact</div>
<p>These 2D/3D maps are the standard output format for virtual screening papers — Vahap's lab reports matched the layout of published DPP-4 studies, demonstrating professional-grade analysis workflow.</p>`,

  'Artificial Neural Networks': `<div class="ah">// Architecture in FDM Project</div>
<p>Vahap trained a feedforward Artificial Neural Network as a <strong>surrogate model</strong> for FDM 3D printing — replacing expensive physical experiments with a fast mathematical approximation.</p>
<div class="ah">// Training Data: Taguchi L27</div>
<p>The ANN was trained on 27 experimental runs (Taguchi L27 orthogonal array), where each run varied parameters like:</p>
<ul>
  <li>Layer thickness, infill density, print temperature, print speed</li>
</ul>
<p>Outputs: surface roughness (Ra) and tensile strength — the two quality metrics being optimized.</p>
<div class="ah">// Role in GA-ANN Pipeline</div>
<p>Once trained, the ANN acted as the <code>fitness function</code> for the Genetic Algorithm. Instead of physically printing each GA-proposed parameter set (impossible at scale), the GA queries the ANN in milliseconds. This is a real industrial technique used in smart manufacturing research.</p>`,

  'Genetic Algorithm': `<div class="ah">// How It Works</div>
<p>A Genetic Algorithm (GA) is an evolutionary optimization method inspired by natural selection. Vahap implemented one from scratch for the FDM 3D printing optimization project.</p>
<div class="ah">// The GA Pipeline</div>
<ul>
  <li><strong>Population</strong> — Random candidate process parameter sets (chromosomes)</li>
  <li><strong>Fitness</strong> — Each candidate is evaluated by the trained ANN surrogate model</li>
  <li><strong>Selection</strong> — Best-performing candidates are chosen for reproduction (tournament/roulette)</li>
  <li><strong>Crossover</strong> — Parent parameter sets are recombined to create offspring</li>
  <li><strong>Mutation</strong> — Random small perturbations prevent premature convergence</li>
  <li><strong>Iteration</strong> — Repeats for N generations until convergence</li>
</ul>
<div class="ah">// Result</div>
<p>The GA-ANN system identified optimal FDM parameters that minimized surface roughness and maximized tensile strength — outperforming the best single Taguchi run by finding combinations outside the original experimental grid.</p>`,

  'LTspice': `<div class="ah">// Role in ECG Project</div>
<p>LTspice is the industry-standard free SPICE circuit simulator. Vahap used it to design and validate his ECG analog front-end before physical lab construction.</p>
<div class="ah">// What Was Simulated</div>
<ul>
  <li><strong>Instrumentation Amplifier</strong> — 3-op-amp topology using <code>TL082</code>, with CMRR analysis</li>
  <li><strong>Bandpass Filter</strong> — Active Sallen-Key topology, passband 0.5–150 Hz (ECG-standard)</li>
  <li><strong>Right-Leg Drive</strong> — Feedback circuit for common-mode noise cancellation</li>
  <li><strong>AC sweep</strong> — Frequency response and phase plots to verify filter characteristics</li>
  <li><strong>Transient analysis</strong> — Time-domain ECG waveform simulation</li>
</ul>
<div class="ah">// Simulation → Hardware</div>
<p>LTspice results were compared against real oscilloscope measurements on the physical circuit. Agreement between simulation and hardware validated the design methodology — a core biomedical engineering competency.</p>`,

  'Taguchi DOE': `<div class="ah">// Design of Experiments</div>
<p>The Taguchi method is a structured experimental design framework for systematically studying the effects of multiple process parameters with the minimum number of experiments.</p>
<div class="ah">// L27 Orthogonal Array</div>
<p>Vahap used the <code>L27</code> array — 27 experimental runs that cover 3 levels of each parameter in a balanced, orthogonal manner. This is far more efficient than full factorial design (which would require 3^4 = 81 runs for 4 three-level factors).</p>
<div class="ah">// Analysis</div>
<ul>
  <li><strong>S/N ratio</strong> — Signal-to-Noise ratio quantifies robustness. "Smaller is better" for surface roughness, "larger is better" for tensile strength</li>
  <li><strong>ANOVA</strong> — Analysis of Variance identifies which parameters most significantly affect the output</li>
  <li><strong>Main effects plots</strong> — Visual ranking of optimal parameter levels</li>
</ul>
<p>The Taguchi data then becomes the training set for the ANN surrogate model — making DOE a crucial foundation for the entire GA-ANN pipeline.</p>`
};

const PROJECT_DEMOS = {
  'C.Elegans Strain Ortholog Browser': `<div class="ah">// Project Overview</div>
<p>An interactive web application for researchers studying <em>Caenorhabditis elegans</em> as a model organism. The tool lets users browse strain-specific gene lists and immediately look up their human orthologs — bridging worm genetics with human disease research.</p>
<div class="ah">// Technical Architecture</div>
<ul>
  <li><strong>Frontend</strong> — Pure JavaScript with dynamic DOM rendering, no framework overhead</li>
  <li><strong>Data pipeline</strong> — <code>BioPython</code> used to parse WormBase gene annotation files and build the ortholog mapping JSON dataset</li>
  <li><strong>Deployment</strong> — Static site on GitHub Pages, fully client-side (no server required)</li>
  <li><strong>Linking</strong> — Each gene links to WormBase, UniProt, and NCBI Gene entries</li>
</ul>
<div class="ah">// Scientific Context</div>
<p>C. elegans is a powerful model for studying human diseases because ~35% of C. elegans genes have human orthologs, including disease-relevant genes. Tools like this accelerate the translation from worm phenotype studies to human biology insights.</p>`,

  'ECG Analog Front-End Circuit': `<div class="ah">// What is an ECG Front-End?</div>
<p>A cardiac ECG signal is tiny (0.1–5 mV) and buried in noise — mains interference (50/60 Hz), muscle artifacts, and electrode drift. The analog front-end (AFE) conditions this raw bio-signal into something an ADC can digitize reliably.</p>
<div class="ah">// Vahap's Circuit Design</div>
<ul>
  <li><strong>Stage 1 — Instrumentation Amplifier</strong> — 3-op-amp topology using <code>TL082</code> dual J-FET op-amp. High differential gain (≈1000×), extremely high CMRR to reject 50 Hz interference picked up symmetrically on both leads</li>
  <li><strong>Stage 2 — Sallen-Key Bandpass Filter</strong> — Active filter passing 0.5–150 Hz (the diagnostic ECG frequency band per AHA/IEC standards), attenuating low-frequency baseline wander and high-frequency EMI</li>
  <li><strong>Stage 3 — Right-Leg Drive</strong> — Feedback loop that drives the patient's right leg to cancel common-mode interference, greatly improving signal quality</li>
</ul>
<div class="ah">// Validation</div>
<p>LTspice AC sweep confirmed filter frequency response. Physical build verified with oscilloscope — waveform morphology matched simulation. This end-to-end hardware validation is the gold standard in biomedical instrumentation coursework.</p>`,

  'DPP-4 Inhibitor Virtual Screening': `<div class="ah">// The Drug Target: DPP-4</div>
<p>Dipeptidyl Peptidase-4 (DPP-4) is a serine protease that degrades incretin hormones (GLP-1, GIP), reducing their ability to stimulate insulin secretion. Inhibiting DPP-4 is a validated type 2 diabetes treatment strategy — commercial gliptins (sitagliptin, saxagliptin) work this way.</p>
<div class="ah">// Screening Pipeline</div>
<ul>
  <li><strong>Compound library</strong> — SANC (South African Natural Compounds) database of phytochemicals</li>
  <li><strong>Receptor prep</strong> — DPP-4 crystal structure (PDB) processed in <code>UCSF Chimera</code>: hydrogens added, charges assigned, grid box defined around active site (Ser630, Arg125, Tyr662 catalytic triad)</li>
  <li><strong>Docking</strong> — <code>AutoDock Vina</code> batch screening, exhaustiveness = 8, 9 poses per compound</li>
  <li><strong>Ranking</strong> — Top candidates by binding affinity (kcal/mol); reference: sitagliptin ≈ −9.0 kcal/mol</li>
  <li><strong>Interaction analysis</strong> — Best poses imported into <code>BIOVIA Discovery Studio</code> for 2D/3D H-bond and hydrophobic contact mapping</li>
</ul>
<div class="ah">// Research Significance</div>
<p>This project demonstrates a complete computational drug discovery workflow — the same pipeline used in early-stage pharmaceutical research to pre-screen millions of compounds before expensive wet lab assays.</p>`,

  'GA-ANN FDM 3D Print Optimizer': `<div class="ah">// The Optimization Problem</div>
<p>FDM 3D printing quality depends on process parameters (layer thickness, infill, temperature, speed) in a non-linear, interacting way. Finding the global optimum experimentally would require hundreds of prints. Vahap's GA-ANN hybrid solves this computationally.</p>
<div class="ah">// Three-Stage Pipeline</div>
<ul>
  <li><strong>Stage 1 — Taguchi L27 DOE</strong> — 27 structured physical experiments covering all factor levels in a balanced orthogonal array. ANOVA identifies which parameters matter most</li>
  <li><strong>Stage 2 — ANN Surrogate Model</strong> — A feedforward neural network is trained on the 27-run dataset to learn the mapping: <code>parameters → quality metrics</code>. The trained ANN can predict outputs in microseconds</li>
  <li><strong>Stage 3 — Genetic Algorithm Search</strong> — The GA uses the ANN as its fitness function, evolving a population of candidate parameter sets over generations to find the global optimum — exploring the entire continuous parameter space, not just the 27 Taguchi points</li>
</ul>
<div class="ah">// Implementation</div>
<p>Full implementation in both <code>Python</code> (scikit-learn ANN + custom GA) and <code>MATLAB</code> (Neural Network Toolbox + GA Toolbox). Both implementations validated against each other. Output: optimal process parameter set with predicted surface roughness and tensile strength values.</p>`
};

const DEFAULT_DEMO = `<div class="ah">// Demo Mode Active</div>
<p>Add your Anthropic API key to <code>ai.js</code> under <code>AI_CFG.apiKey</code> and set <code>demoMode: false</code> to generate live AI analysis for any project or skill card.</p>
<div class="ah">// What AI Analysis Covers</div>
<ul>
  <li>Deep technical methodology breakdown</li>
  <li>Scientific/engineering context and significance</li>
  <li>Cross-project skill connections</li>
  <li>Proficiency depth assessment</li>
</ul>`;

/* ── Modal controller ─────────────────────────────────────────── */
(function () {
  const modal    = document.getElementById('aiModal');
  const overlay  = document.getElementById('aiOverlay');
  const closeBtn = document.getElementById('aiClose');
  const subject  = document.getElementById('aiSubject');
  const loading  = document.getElementById('aiLoading');
  const result   = document.getElementById('aiResult');
  const demoTag  = document.getElementById('aiDemoTag');

  if (!modal) return;

  /* Show / hide demo tag */
  if (!AI_CFG.demoMode) demoTag.style.display = 'none';

  function open(subText) {
    subject.textContent = subText;
    loading.style.display = 'flex';
    result.className = 'ai-result';
    result.innerHTML = '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function show(html) {
    loading.style.display = 'none';
    result.innerHTML = html;
    result.className = 'ai-result show';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* Skill cards */
  document.querySelectorAll('.sk-ai').forEach(btn => {
    btn.addEventListener('click', async e => {
      const card  = e.target.closest('.skill-card');
      const skill = card?.dataset.skill;
      const ctx   = card?.dataset.ctx;
      if (!skill) return;

      open('> Analyzing skill: ' + skill);
      await delay(AI_CFG.demoMode ? 1100 : 0);

      if (AI_CFG.demoMode) {
        show(SKILL_DEMOS[skill] || DEFAULT_DEMO);
        return;
      }
      await callClaude(buildSkillPrompt(skill, ctx));
    });
  });

  /* Project cards */
  document.querySelectorAll('.pj-ai').forEach(btn => {
    btn.addEventListener('click', async e => {
      const card = e.target.closest('.project-card');
      const proj = card?.dataset.proj;
      const tech = card?.dataset.tech;
      const desc = card?.dataset.desc;
      if (!proj) return;

      open('> Analyzing project: ' + proj);
      await delay(AI_CFG.demoMode ? 1100 : 0);

      if (AI_CFG.demoMode) {
        show(PROJECT_DEMOS[proj] || DEFAULT_DEMO);
        return;
      }
      await callClaude(buildProjectPrompt(proj, tech, desc));
    });
  });

  /* ── Prompt builders ── */
  function buildSkillPrompt(skill, ctx) {
    return `You are writing a technical analysis for the portfolio of Vahap Kucukkomurcu, a Biomedical Engineering student at Abdullah Gül University specializing in bioinformatics.

Analyze his skill in "${skill}", which he uses for: ${ctx}

Format response using ONLY these HTML tags:
- <div class="ah">// TITLE</div> for section headers
- <p>text</p> for paragraphs  
- <ul><li>item</li></ul> for lists
- <code>term</code> for technical terms

Max 280 words. 3 sections. Be specific to Vahap's actual use cases. No preamble.`;
  }

  function buildProjectPrompt(proj, tech, desc) {
    return `You are writing a technical deep-dive for the portfolio of Vahap Kucukkomurcu, Biomedical Engineering student at Abdullah Gül University.

Project: "${proj}"
Description: ${desc}
Technologies: ${tech}

Format response using ONLY these HTML tags:
- <div class="ah">// TITLE</div> for section headers
- <p>text</p> for paragraphs
- <ul><li>item</li></ul> for lists
- <code>term</code> for technical terms

Max 320 words. 3 sections covering: technical overview, methodology, and significance. No preamble.`;
  }

  /* ── Claude API call ── */
  async function callClaude(prompt) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_CFG.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: AI_CFG.model,
          max_tokens: 700,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const text = data.content?.[0]?.text || 'No response.';
      show(text);

    } catch (err) {
      show(`<div class="ah">// Connection Error</div><p>Could not reach AI endpoint. Verify your API key in <code>ai.js</code>.</p><p>Error: <code>${err.message}</code></p>`);
    }
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
})();
