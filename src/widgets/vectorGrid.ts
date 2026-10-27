import {
  allVectors,
  canonicalVectors,
  dot,
  formatVec,
  type GF,
  gf,
  isZero,
  normalize,
  planeThroughOrigin,
  span1,
  type Vec,
  vecKey,
} from '../math/projective';
import { h, selectControl } from './ui';

const QS = [2, 3, 4, 5];

type Mode = 'line' | 'plane' | 'both' | 'all';
const MODES: { mode: Mode; label: string }[] = [
  { mode: 'both', label: 'Line and plane' },
  { mode: 'line', label: 'Line only' },
  { mode: 'plane', label: 'Plane only' },
  { mode: 'all', label: 'Every line' },
];

/** "x + 2z = 0", with the field's labels. */
export function equationText(F: GF, n: Vec): string {
  const terms = n.flatMap((c, i) => (c === 0 ? [] : [`${c === 1 ? '' : F.label(c)}${'xyz'[i]}`]));
  return `${terms.join(' + ')} = 0`;
}

type Kind = 'plain' | 'origin' | 'line' | 'plane' | 'both';

interface Look {
  kind: Kind;
  /** Hue for the "every line" mode, 0 … 1. */
  hue?: number;
}

/**
 * `<div data-widget="vector-grid" data-q="3">`: the q³ vectors of GF(q)³ as
 * a 3D grid (three.js, loaded only here), with one line through the origin
 * (the q multiples of a vector) and one plane through the origin (the q²
 * solutions of ax + by + cz = 0) highlighted. Drag to turn it. A text
 * description below lists the same vectors for readers without the picture.
 */
export function mount(el: HTMLElement): void {
  let q = QS.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : 3;
  let lineIdx = 1;
  let planeIdx = 0;
  let mode: Mode = 'both';

  const controls = h('div', { class: 'controls' });
  const modes = h('div', { class: 'controls vg-modes', attrs: { role: 'group', 'aria-label': 'What to highlight' } });
  const stage = h('div', { class: 'vg-stage' });
  const status = h('p', { class: 'vg-status', text: 'Loading the 3D view…' });
  stage.append(status);
  const legend = h('p', { class: 'ff-legend vg-legend' });
  const desc = h('div', { class: 'ff-info vg-desc', attrs: { 'aria-live': 'polite' } });

  // Filled in once three.js has loaded.
  let paint: ((looks: Look[], F: GF) => void) | null = null;
  let rebuild: ((F: GF) => void) | null = null;

  const looks = (F: GF): Look[] => {
    const vecs = allVectors(F);
    const lineSet = new Set(span1(F, canonicalVectors(F)[lineIdx]).map(vecKey));
    const planeSet = new Set(planeThroughOrigin(F, canonicalVectors(F)[planeIdx]).map(vecKey));
    const canon = canonicalVectors(F).map(vecKey);
    return vecs.map((u) => {
      if (isZero(u)) return { kind: 'origin' };
      if (mode === 'all') return { kind: 'plain', hue: canon.indexOf(vecKey(normalize(F, u))) / canon.length };
      const inL = (mode === 'line' || mode === 'both') && lineSet.has(vecKey(u));
      const inP = (mode === 'plane' || mode === 'both') && planeSet.has(vecKey(u));
      return { kind: inL && inP ? 'both' : inL ? 'line' : inP ? 'plane' : 'plain' };
    });
  };

  const describe = (F: GF) => {
    const dirs = canonicalVectors(F);
    const u = dirs[lineIdx];
    const n = dirs[planeIdx];
    const line = span1(F, u);
    const plane = planeThroughOrigin(F, n);
    const v = q * q + q + 1;
    const paras: HTMLElement[] = [
      h('p', {
        text:
          `GF(${q})³ has ${q}³ = ${q ** 3} vectors: the grid points (x, y, z) with each coordinate one of ` +
          `${F.elements.map(F.label).join(', ')}. The origin (0, 0, 0) is the corner where the axes start.`,
      }),
    ];
    if (mode === 'all') {
      paras.push(
        h('p', {
          text:
            `Each color is one line through the origin. There are ${v} of them, each with ${q - 1} nonzero ` +
            `vector${q > 2 ? 's' : ''}, and together they use every one of the ${q ** 3 - 1} nonzero vectors exactly once: ` +
            `${v} × ${q - 1} = ${q ** 3 - 1}.`,
        }),
      );
    } else {
      if (mode !== 'plane') {
        paras.push(
          h('p', {
            text:
              `The line through 0 and ${formatVec(F, u)} (red) holds its ${q} multiples s·${formatVec(F, u)}: ` +
              `${line.map((w) => formatVec(F, w)).join(', ')}.`,
          }),
        );
      }
      if (mode !== 'line') {
        paras.push(
          h('p', {
            text:
              `The plane ${equationText(F, n)} (blue) holds ${q * q} vectors: ` +
              `${plane.map((w) => formatVec(F, w)).join(', ')}.`,
          }),
        );
      }
      if (mode === 'both') {
        const inside = dot(F, n, u) === 0;
        paras.push(
          h('p', {
            text: inside
              ? `The line lies inside the plane (orange): ${equationText(F, n).replace(' = 0', '')} is 0 at ${formatVec(F, u)}, so it is 0 at every multiple.`
              : `The line meets the plane only at the origin: a line and a plane through 0 share either just 0 or the whole line.`,
          }),
        );
      }
    }
    desc.replaceChildren(...paras);
    legend.textContent =
      mode === 'all'
        ? 'Drag to turn the grid. The largest dot is the origin. Each color is one line through the origin.'
        : 'Drag to turn the grid. The largest dot is the origin. Red: the line. Blue: the plane. Orange: in both.';
  };

  const render = () => {
    const F = gf(q);
    describe(F);
    paint?.(looks(F), F);
  };

  const build = () => {
    const F = gf(q);
    const dirs = canonicalVectors(F);
    lineIdx = Math.min(lineIdx, dirs.length - 1);
    planeIdx = Math.min(planeIdx, dirs.length - 1);
    controls.replaceChildren(
      selectControl(
        'q =',
        QS.map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (val) => {
          q = Number(val);
          build();
        },
        'vg-q',
      ).wrap,
      selectControl(
        'line through 0 and',
        dirs.map((u, i) => ({ value: String(i), label: formatVec(F, u) })),
        String(lineIdx),
        (val) => {
          lineIdx = Number(val);
          render();
        },
        'vg-line',
      ).wrap,
      selectControl(
        'plane',
        dirs.map((n, i) => ({ value: String(i), label: equationText(F, n) })),
        String(planeIdx),
        (val) => {
          planeIdx = Number(val);
          render();
        },
        'vg-plane',
      ).wrap,
    );
    modes.replaceChildren(
      ...MODES.map(({ mode: m, label }) => {
        const b = h('button', { class: 'ff-button vg-mode', text: label, attrs: { type: 'button', 'data-mode': m } });
        b.setAttribute('aria-pressed', String(m === mode));
        b.addEventListener('click', () => {
          mode = m;
          modes.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.mode === mode)));
          render();
        });
        return b;
      }),
    );
    rebuild?.(F);
    render();
  };

  el.classList.add('widget', 'ff-widget', 'vector-grid');
  el.replaceChildren(controls, modes, stage, legend, desc);
  build();

  start(stage, status, el).then(
    (api) => {
      if (!api) return;
      paint = api.paint;
      rebuild = api.rebuild;
      rebuild(gf(q));
      render();
      el.dataset.three = 'ready';
    },
    () => {
      status.textContent = 'The 3D view could not load. The description below lists the same vectors.';
      el.dataset.three = 'failed';
    },
  );
}

interface SceneApi {
  rebuild(F: GF): void;
  paint(looks: Look[], F: GF): void;
}

/** Load three.js and set up the scene; resolves to null when WebGL is unavailable. */
async function start(stage: HTMLElement, status: HTMLElement, root: HTMLElement): Promise<SceneApi | null> {
  const THREE = await import('three');
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

  const probe = document.createElement('canvas');
  if (!probe.getContext('webgl2') && !probe.getContext('webgl')) {
    status.textContent = 'This browser cannot draw the 3D view (it needs WebGL). The description below lists the same vectors.';
    root.dataset.three = 'no-webgl';
    return null;
  }
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'vg-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'A 3D grid of the vectors of GF(q)³; the description below lists the highlighted vectors.');
  status.remove();
  stage.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim() || '#888';
  let group = new THREE.Group();
  scene.add(group);
  let mesh: InstanceType<typeof THREE.InstancedMesh> | null = null;
  let lastLooks: Look[] = [];
  let lastField: GF | null = null;

  const draw = () => renderer.render(scene, camera);
  controls.addEventListener('change', draw);

  // Math (x, y, z) with z up becomes three.js (x, z, −y), since three.js puts y up.
  const place = (u: readonly number[], off: number) => new THREE.Vector3(u[0] - off, u[2] - off, -(u[1] - off));

  const label = (text: string, color: string, scale: number) => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.font = '600 40px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 34);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sprite.scale.set(scale, scale / 2, 1);
    return sprite;
  };

  const rebuild = (F: GF) => {
    scene.remove(group);
    group.traverse((o) => {
      const m = o as unknown as { geometry?: { dispose(): void }; material?: { dispose(): void; map?: { dispose(): void } } };
      m.geometry?.dispose();
      m.material?.map?.dispose();
      m.material?.dispose();
    });
    group = new THREE.Group();
    scene.add(group);
    const off = (F.q - 1) / 2;
    const vecs = allVectors(F);
    const geom = new THREE.SphereGeometry(F.q > 3 ? 0.085 : 0.11, 20, 14);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    mesh = new THREE.InstancedMesh(geom, mat, vecs.length);
    group.add(mesh);

    const fg = css('--muted');
    const axisMat = new THREE.LineBasicMaterial({ color: new THREE.Color(fg) });
    const len = F.q - 0.4;
    const o: Vec = [0, 0, 0];
    (['x', 'y', 'z'] as const).forEach((name, i) => {
      const end: Vec = [0, 0, 0];
      end[i] = len;
      const geo = new THREE.BufferGeometry().setFromPoints([place(o, off), place(end, off)]);
      group.add(new THREE.Line(geo, axisMat));
      const tip: Vec = [0, 0, 0];
      tip[i] = len + 0.35;
      const s = label(name, css('--fg'), 0.75);
      s.position.copy(place(tip, off));
      group.add(s);
      for (const c of F.elements.slice(1)) {
        const at: Vec = [0, 0, 0];
        at[i] = c;
        const t = label(F.label(c), fg, 0.6);
        const pos = place(at, off);
        // Nudge tick labels off the axis.
        pos.add(i === 2 ? new THREE.Vector3(-0.28, 0, 0.28) : new THREE.Vector3(0, -0.28, 0));
        t.position.copy(pos);
        group.add(t);
      }
    });

    const d = 1.15 * F.q + 1.1;
    camera.position.set(d * 0.78, d * 0.62, d * 0.95);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  const paint = (looks: Look[], F: GF) => {
    lastLooks = looks;
    lastField = F;
    if (!mesh) return;
    const off = (F.q - 1) / 2;
    const vecs = allVectors(F);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    const palette: Record<Kind, string> = {
      plain: css('--point'),
      origin: css('--fg'),
      line: css('--member'),
      plane: css('--accent'),
      both: css('--hot'),
    };
    vecs.forEach((u, i) => {
      const look = looks[i];
      const big = look.kind !== 'plain' || look.hue !== undefined;
      const s = look.kind === 'origin' ? 1.5 : big ? 1.35 : 0.75;
      m.makeScale(s, s, s);
      m.setPosition(place(u, off));
      mesh!.setMatrixAt(i, m);
      if (look.hue !== undefined) color.setHSL(look.hue, 0.75, 0.52);
      else color.set(palette[look.kind]);
      mesh!.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    draw();
  };

  const resize = () => {
    const w = stage.clientWidth || 320;
    const hgt = Math.round(Math.min(Math.max(w * 0.8, 260), 420));
    renderer.setSize(w, hgt);
    camera.aspect = w / hgt;
    camera.updateProjectionMatrix();
    draw();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Recolor when the reader's color scheme changes.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (lastField) {
      rebuild(lastField);
      paint(lastLooks, lastField);
    }
  });

  // Turn slowly until the reader takes over, unless they prefer less motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let spinning = true;
    controls.addEventListener('start', () => (spinning = false));
    const tick = () => {
      if (!spinning) return;
      const box = stage.getBoundingClientRect();
      if (root.isConnected && box.bottom > 0 && box.top < window.innerHeight) {
        const p = camera.position;
        const angle = 0.004;
        const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        p.set(x, p.y, z);
        camera.lookAt(0, 0, 0);
        draw();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  return { rebuild, paint };
}
