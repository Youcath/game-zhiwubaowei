import { _decorator, CCInteger, Color, Component, Graphics, Node, Vec2 } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

export interface IRadarSeries {
  values: number[];
  lineWidth?: number;
  lineColor?: Color;
  fillColor?: Color;
  joinColor?: Color;
}

const defaultStyle = {
  lineWidth: 5,
  lineColor: new Color(0, 0, 255, 255),
  fillColor: new Color(120, 120, 180, 100),
  joinColor: new Color(255, 255, 255, 255),
};

@ccclass('RadarChart')
@executeInEditMode(true)
export class RadarChart extends Component {
  @property(Node)
  target: Node | null = null;

  @property
  axisLength = 200;

  @property
  axes = 6;

  @property
  axisScales = 3;

  @property
  drawAxes = true;

  @property
  gridLineWidth = 4;

  @property
  innerGridLineWidth = 4;

  @property(Color)
  gridLineColor = Color.GRAY.clone();

  @property(Color)
  gridFillColor = new Color(100, 100, 100, 100);

  @property([String])
  dataValuesStrings: string[] = ['0.8,0.5,0.6,0.5,0.8,0.6', '0.5,0.9,0.5,0.8,0.5,0.9'];

  @property([CCInteger])
  dataLineWidths: number[] = [5, 5];

  @property([Color])
  dataLineColors: Color[] = [Color.BLUE.clone(), Color.RED.clone()];

  @property([Color])
  dataFillColors: Color[] = [new Color(120, 120, 180, 100), new Color(180, 120, 120, 100)];

  @property([Color])
  dataJoinColors: Color[] = [];

  @property
  drawDataJoin = true;

  graphics: Graphics | null = null;
  keepUpdating = false;
  angles: number[] | null = null;

  private _curDatas: IRadarSeries[] = [];
  private curTweenRes: (() => void) | null = null;

  get curDatas(): IRadarSeries[] {
    return this._curDatas;
  }

  onLoad(): void {
    this.init();
    this.drawWithProperties();
  }

  update(): void {
    if (this.keepUpdating && this._curDatas.length > 0) {
      this.draw(this._curDatas);
    }
  }

  init(): void {
    const t = this.target ?? this.node;
    this.graphics = t.getComponent(Graphics) ?? t.addComponent(Graphics);
    this.graphics.lineJoin = Graphics.LineJoin.ROUND;
    this.graphics.lineCap = Graphics.LineCap.ROUND;
  }

  drawWithProperties(): void {
    const t: IRadarSeries[] = [];
    const e = this.dataValuesStrings;
    for (let r = 0; r < e.length; r++) {
      t.push({
        values: this.processValuesString(e[r]),
        lineWidth: this.dataLineWidths[r] ?? defaultStyle.lineWidth,
        lineColor: (this.dataLineColors[r] ?? defaultStyle.lineColor).clone(),
        fillColor: (this.dataFillColors[r] ?? defaultStyle.fillColor).clone(),
        joinColor: (this.dataJoinColors[r] ?? defaultStyle.joinColor).clone(),
      });
    }
    this.draw(t);
  }

  processValuesString(str: string): number[] {
    return str.split(',').map((x) => {
      const n = parseFloat(x);
      return Number.isNaN(n) ? 0 : n;
    });
  }

  drawBase(): void {
    if (!this.graphics) return;
    const t = this.graphics;
    t.lineWidth = this.gridLineWidth;
    t.strokeColor = this.gridLineColor;
    t.fillColor = this.gridFillColor;
    const ax = Math.max(3, Math.floor(this.axes));
    const e = (this.angles = []);
    const o = 360 / ax;
    for (let i = 0; i < ax; i++) e.push(o * i);
    const rings: Vec2[][] = [];
    const a = this.axisLength;
    const r = Math.max(1, Math.floor(this.axisScales));
    const step = a / r;
    for (let i = 0; i < r; i++) {
      const ring: Vec2[] = [];
      const l = a - step * i;
      for (let u = 0; u < this.angles!.length; u++) {
        const h = (Math.PI / 180) * this.angles![u];
        ring.push(new Vec2(l * Math.cos(h), l * Math.sin(h)));
      }
      rings.push(ring);
    }
    const outer = rings[0];
    if (this.drawAxes) {
      for (let i = 0; i < outer.length; i++) {
        t.moveTo(0, 0);
        t.lineTo(outer[i].x, outer[i].y);
      }
    }
    t.moveTo(outer[0].x, outer[0].y);
    for (let i = 1; i < outer.length; i++) t.lineTo(outer[i].x, outer[i].y);
    t.close();
    t.fill();
    t.stroke();
    if (rings.length > 1) {
      t.lineWidth = this.innerGridLineWidth;
      for (let i = 1; i < rings.length; i++) {
        const m = rings[i];
        t.moveTo(m[0].x, m[0].y);
        for (let u = 1; u < m.length; u++) t.lineTo(m[u].x, m[u].y);
        t.close();
      }
      t.stroke();
    }
  }

  draw(data: IRadarSeries | IRadarSeries[]): void {
    if (!this.graphics) return;
    const g = this.graphics;
    g.clear();
    this.drawBase();
    const list = Array.isArray(data) ? data : [data];
    this._curDatas = list.map((s) => ({
      values: s.values.slice(),
      lineWidth: s.lineWidth,
      lineColor: (s.lineColor ?? defaultStyle.lineColor).clone(),
      fillColor: (s.fillColor ?? defaultStyle.fillColor).clone(),
      joinColor: (s.joinColor ?? defaultStyle.joinColor).clone(),
    }));
    this.resizeCurDatasValues(0);
    const ax = Math.max(3, Math.floor(this.axes));
    const alen = this.axisLength;
    const angs = this.angles!;
    for (let r = 0; r < this._curDatas.length; r++) {
      const s = this._curDatas[r];
      g.strokeColor = s.lineColor!;
      g.fillColor = s.fillColor!;
      g.lineWidth = s.lineWidth ?? defaultStyle.lineWidth;
      const pts: Vec2[] = [];
      for (let l = 0; l < ax; l++) {
        const u = Math.min(1, s.values[l] > 1 ? 1 : s.values[l]) * alen;
        const h = (Math.PI / 180) * angs[l];
        pts.push(new Vec2(u * Math.cos(h), u * Math.sin(h)));
      }
      g.moveTo(pts[0].x, pts[0].y);
      for (let l = 1; l < pts.length; l++) g.lineTo(pts[l].x, pts[l].y);
      g.close();
      g.fill();
      g.stroke();
      if (this.drawDataJoin) {
        for (let l = 0; l < pts.length; l++) {
          const d = pts[l];
          g.strokeColor = s.lineColor!;
          g.circle(d.x, d.y, 2);
          g.stroke();
          g.strokeColor = s.joinColor!;
          g.circle(d.x, d.y, 0.65);
          g.stroke();
        }
      }
    }
  }

  to(duration: number, data: IRadarSeries | IRadarSeries[]): Promise<void> {
    return new Promise((resolve) => {
      this.unscheduleAllCallbacks();
      this.curTweenRes?.();
      this.curTweenRes = resolve;
      const targets = Array.isArray(data) ? data : [data];
      this.keepUpdating = true;
      const starts = this._curDatas.map((d) => ({
        values: d.values.slice(),
        lw: d.lineWidth ?? defaultStyle.lineWidth,
        lc: d.lineColor!.clone(),
        fc: d.fillColor!.clone(),
        jc: d.joinColor!.clone(),
      }));
      const tmpL = new Color();
      const tmpF = new Color();
      const tmpJ = new Color();
      let elapsed = 0;
      const tick = (dt: number) => {
        elapsed += dt;
        const p = Math.min(1, elapsed / duration);
        for (let r = 0; r < targets.length; r++) {
          const cur = this._curDatas[r];
          const tgt = targets[r];
          const st = starts[r];
          if (!cur || !tgt || !st) continue;
          for (let l = 0; l < cur.values.length; l++) {
            const end = tgt.values[l] > 1 ? 1 : tgt.values[l];
            cur.values[l] = st.values[l] + (end - st.values[l]) * p;
          }
          cur.lineWidth = st.lw + ((tgt.lineWidth ?? st.lw) - st.lw) * p;
          Color.lerp(tmpL, st.lc, tgt.lineColor ?? st.lc, p);
          cur.lineColor!.set(tmpL);
          Color.lerp(tmpF, st.fc, tgt.fillColor ?? st.fc, p);
          cur.fillColor!.set(tmpF);
          Color.lerp(tmpJ, st.jc, tgt.joinColor ?? st.jc, p);
          cur.joinColor!.set(tmpJ);
        }
        if (p >= 1) {
          this.unschedule(tick);
          this.keepUpdating = false;
          this.curTweenRes?.();
          this.curTweenRes = null;
          resolve();
        }
      };
      this.schedule(tick, 0);
    });
  }

  resizeCurDatasValues(t = 0): void {
    const ax = Math.max(3, Math.floor(this.axes));
    for (const row of this._curDatas) {
      while (row.values.length < ax) row.values.push(t);
    }
  }
}
