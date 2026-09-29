import React, { useRef, useEffect, useState } from 'react';
import { MatchAnalysisResult, TermWeight } from '../types';
import { Rotate3d, Play, Pause, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { InlineMath } from './KatexMath';

interface Props {
  analysis: MatchAnalysisResult;
}

export const ThreeDVectorCanvas: React.FC<Props> = ({ analysis }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera transforms stored in refs for continuous 60fps render loop without triggering React re-renders
  const rotXRef = useRef<number>(0.45);
  const rotYRef = useRef<number>(0.65);
  const zoomRef = useRef<number>(1.1);
  const autoRotateRef = useRef<boolean>(true);
  const animStageRef = useRef<number>(0);
  const analysisRef = useRef<MatchAnalysisResult>(analysis);

  // UI state for button highlights and text labels
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [animStage, setAnimStage] = useState<number>(0);
  const [isPlayingAnim, setIsPlayingAnim] = useState<boolean>(false);

  // Dragging state
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync analysis ref when prop changes
  useEffect(() => {
    analysisRef.current = analysis;
  }, [analysis]);

  // Handle stage animation sequence
  useEffect(() => {
    if (!isPlayingAnim) return;

    let stage = 0;
    const interval = setInterval(() => {
      stage = (stage + 1) % 5;
      animStageRef.current = stage;
      setAnimStage(stage);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlayingAnim]);

  // Main 3D Canvas Render Loop - mounted once, driven purely by RAF and refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width * 0.7);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Auto rotation increment if enabled and not dragging (pure ref mutation, zero React re-renders)
      if (autoRotateRef.current && !isDragging.current) {
        rotYRef.current += 0.003;
      }

      const rotX = rotXRef.current;
      const rotY = rotYRef.current;
      const zoom = zoomRef.current;
      const currentAnalysis = analysisRef.current;
      const currentStage = animStageRef.current;

      // Projection matrix calculations
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspective division
        const distance = 480;
        const scale = (distance / (distance + z2)) * zoom;

        return {
          px: centerX + x1 * scale,
          py: centerY - y2 * scale,
          scale,
          zDepth: z2,
        };
      };

      // Draw 3D Coordinate Grid Floors
      const gridSize = 160;
      const gridStep = 40;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e2e8f0';

      // Draw Grid on X-Z plane (Floor)
      for (let i = -gridSize; i <= gridSize; i += gridStep) {
        const p1 = project(i, 0, -gridSize);
        const p2 = project(i, 0, gridSize);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        const p3 = project(-gridSize, 0, i);
        const p4 = project(gridSize, 0, i);
        ctx.beginPath();
        ctx.moveTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.stroke();
      }

      // Draw 3D Coordinate Axes (X: JD Weight, Y: Resume Weight, Z: IDF Importance)
      const origin = project(0, 0, 0);
      const axisLen = 190;

      // X Axis (JD Dimension - Indigo)
      const xAxis = project(axisLen, 0, 0);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(xAxis.px, xAxis.py);
      ctx.stroke();

      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('X: JD 特征维度', xAxis.px + 8, xAxis.py);

      // Y Axis (Resume Dimension - Emerald)
      const yAxis = project(0, axisLen, 0);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(yAxis.px, yAxis.py);
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Y: 简历 特征维度', yAxis.px + 8, yAxis.py - 6);

      // Z Axis (IDF Depth - Slate)
      const zAxis = project(0, 0, axisLen);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(zAxis.px, zAxis.py);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Z: IDF 稀缺度', zAxis.px + 6, zAxis.py + 10);

      // Calculate Major 3D Vector coordinates
      const jdVecLength = 150;
      const resumeVecLength = 150;
      const angleRad = (currentAnalysis.angleDegrees * Math.PI) / 180;

      // Projection for JD Vector (closer to X axis)
      const vJdX = jdVecLength * 0.95;
      const vJdY = jdVecLength * 0.15;
      const vJdZ = 30;
      const pJd = project(vJdX, vJdY, vJdZ);

      // Projection for Resume Vector (angled away by theta)
      const vResX = resumeVecLength * Math.cos(angleRad);
      const vResY = resumeVecLength * Math.sin(angleRad);
      const vResZ = 20;
      const pRes = project(vResX, vResY, vResZ);

      // Draw Main JD Vector Arrow (Indigo)
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(pJd.px, pJd.py);
      ctx.stroke();

      // JD Vector Arrowhead
      ctx.fillStyle = '#4338ca';
      ctx.beginPath();
      ctx.arc(pJd.px, pJd.py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('v_JD 职位需求向量', pJd.px + 8, pJd.py - 6);

      // Draw Main Resume Vector Arrow (Emerald)
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(pRes.px, pRes.py);
      ctx.stroke();

      // Resume Vector Arrowhead
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(pRes.px, pRes.py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('v_Resume 候选人向量', pRes.px + 8, pRes.py + 14);

      // Draw Angular Arc between JD and Resume vectors
      const arcPoints = 16;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();

      const arcRadius = 65;
      for (let i = 0; i <= arcPoints; i++) {
        const t = i / arcPoints;
        const currAngle = t * angleRad;
        const ax = arcRadius * Math.cos(currAngle);
        const ay = arcRadius * Math.sin(currAngle);
        const ap = project(ax, ay, 25);
        if (i === 0) ctx.moveTo(ap.px, ap.py);
        else ctx.lineTo(ap.px, ap.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular label badge
      const midAngle = angleRad / 2;
      const midP = project(arcRadius * 1.25 * Math.cos(midAngle), arcRadius * 1.25 * Math.sin(midAngle), 25);
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(
        `θ = ${currentAnalysis.angleDegrees}° (cos=${(currentAnalysis.sparseCosineScore / 100).toFixed(2)})`,
        midP.px - 20,
        midP.py - 8
      );

      // Render 3D Term Point Cloud
      const topTerms = currentAnalysis.termWeights.slice(0, 24);

      // Sort points by zDepth for correct painter's algorithm
      const projectedTerms = topTerms.map((tw: TermWeight) => {
        let x = tw.jdWeight * 28;
        let y = tw.resumeWeight * 28;
        let z = (tw.jdIdf - 1.0) * 45;

        // Apply Stage Animation transformations if active
        if (currentStage === 1) {
          x = tw.jdTf * 18;
          y = tw.resumeTf * 18;
          z = 0;
        } else if (currentStage === 2) {
          x = tw.jdWeight * 24;
          y = tw.resumeWeight * 24;
          z = tw.jdIdf * 35;
        } else if (currentStage === 3) {
          const len = Math.sqrt(x * x + y * y + z * z) || 1;
          x = (x / len) * 110;
          y = (y / len) * 110;
          z = (z / len) * 110;
        }

        const proj = project(x, y, z);
        return {
          tw,
          ...proj,
          rawX: x,
          rawY: y,
        };
      });

      projectedTerms.sort((a, b) => b.zDepth - a.zDepth);

      for (const item of projectedTerms) {
        const { tw, px, py, scale } = item;
        const radius = Math.max(3, Math.min(8, (tw.status === 'matched' ? 6 : 4.5) * scale));

        // Drop shadow / floor projection
        const floorP = project(item.rawX, 0, 0);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(floorP.px, floorP.py);
        ctx.stroke();

        // Node Glow
        ctx.save();
        ctx.shadowBlur = 8;
        if (tw.status === 'matched') {
          ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
          ctx.fillStyle = '#10b981';
        } else if (tw.status === 'missing') {
          ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
          ctx.fillStyle = '#ef4444';
        } else {
          ctx.shadowColor = 'rgba(14, 165, 233, 0.5)';
          ctx.fillStyle = '#0ea5e9';
        }

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Node Label
        ctx.fillStyle = tw.status === 'matched' ? '#065f46' : tw.status === 'missing' ? '#991b1b' : '#075985';
        ctx.font = `${Math.max(9, Math.round(11 * scale))}px sans-serif`;
        ctx.fillText(tw.term, px + radius + 4, py + 3);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run effect once on mount, loop safely without triggering re-render cascades

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    rotYRef.current += deltaX * 0.008;
    rotXRef.current = Math.max(-1.2, Math.min(1.2, rotXRef.current + deltaY * 0.008));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    zoomRef.current = Math.max(0.6, Math.min(2.2, zoomRef.current - e.deltaY * 0.001));
  };

  const toggleAutoRotate = () => {
    setAutoRotate(prev => {
      const next = !prev;
      autoRotateRef.current = next;
      return next;
    });
  };

  const handleZoomIn = () => {
    zoomRef.current = Math.min(2.0, zoomRef.current + 0.15);
  };

  const handleZoomOut = () => {
    zoomRef.current = Math.max(0.6, zoomRef.current - 0.15);
  };

  const handleResetCamera = () => {
    rotXRef.current = 0.45;
    rotYRef.current = 0.65;
    zoomRef.current = 1.1;
  };

  const stageDescriptions = [
    '【常态全景】：完整高维 TF-IDF 向量空间及特征词分布',
    '【演播阶段一】：原始分词词频 (Raw TF) 映射至正象限平面',
    '【演播阶段二】：逆文档频率 (IDF) 稀缺度加权拉伸核心技术词',
    '【演播阶段三】：L2 范数消除篇幅偏见，投影至单位超球面',
    '【演播阶段四】：求取内积夹角 θ，计算终极余弦相似度',
  ];

  return (
    <div className="space-y-4">
      {/* 3D Canvas Container */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Floating Controls Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs pointer-events-auto flex items-center gap-2">
            <Rotate3d className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>3D 高维向量空间演播器</span>
              <span className="text-[10px] text-emerald-700 font-mono font-normal">
                <InlineMath math="\mathbf{v}_{\text{JD}} \angle \mathbf{v}_{\text{Resume}}" />
              </span>
            </span>
            <span className="text-[10px] text-slate-400 border-l border-stone-200 pl-2">
              按住鼠标拖拽全景旋转 / 滚轮缩放
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Stage Animation Play Button */}
            <button
              onClick={() => setIsPlayingAnim(!isPlayingAnim)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isPlayingAnim
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPlayingAnim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlayingAnim ? '暂停平滑演播' : '3D 动态平滑演播'}
            </button>

            {/* Auto Rotate Toggle */}
            <button
              onClick={toggleAutoRotate}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
              }`}
              title="切换自动环绕旋转"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-slate-600 hover:bg-stone-100 cursor-pointer"
                title="放大"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-slate-600 hover:bg-stone-100 cursor-pointer"
                title="缩小"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset Camera */}
            <button
              onClick={handleResetCamera}
              className="px-2.5 py-1.5 bg-white text-slate-700 rounded-xl border border-stone-200 text-xs hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              复位视角
            </button>
          </div>
        </div>

        {/* Dynamic Stage Banner */}
        {isPlayingAnim && (
          <div className="absolute top-16 left-4 z-10 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{stageDescriptions[animStage]}</span>
          </div>
        )}

        {/* The 3D Canvas */}
        <canvas
          ref={canvasRef}
          width={960}
          height={520}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-[500px] cursor-grab active:cursor-grabbing block"
        />

        {/* Legend Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-stone-200/80 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span className="font-semibold text-slate-700">v_JD 职位需求特征向量</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span className="font-semibold text-slate-700">v_Resume 简历特征向量</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 inline-block rounded-sm" />
              <span className="font-semibold text-slate-700">空间夹角弧度 θ</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
              <span className="text-slate-600">双向命中技术词</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-xs" />
              <span className="text-slate-600">JD 独有缺失词</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-xs" />
              <span className="text-slate-600">简历盈余扩展词</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics & Geometric Explanation Slice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/90 rounded-xl border border-stone-200/80">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>1. 词频 (<InlineMath math="\text{TF}" />) 的物理拉伸力</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            一个技术词在 JD 或简历中每多出现一次，沿对应轴的坐标分量即增长，使得总向量朝该技能所在的高维超平面偏转。
          </p>
        </div>

        <div className="p-4 bg-white/90 rounded-xl border border-stone-200/80">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>2. 逆文档频率 (<InlineMath math="\text{IDF}" />) 稀缺增益</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Z轴表征语料稀缺度。越小众顶尖的硬技能（如 vLLM、Barra），其 IDF 乘子越大，对余弦相似度的决定性权重越高。
          </p>
        </div>

        <div className="p-4 bg-white/90 rounded-xl border border-stone-200/80">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>3. 单位超球面投影 (<InlineMath math="\|\hat{\mathbf{v}}\|_2 = 1.0" />)</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            通过 L2 范数除法，将两向量投射到半径为 1 的单位超球面上，纯粹度量两束激光方向的重合度，完全免疫字数长短。
          </p>
        </div>
      </div>
    </div>
  );
};
