import React, { useMemo, useState, useEffect } from "react";

export interface CreditScoreGaugeProps {
    score?: number | null;
    className?: string;
    size?: number;
}

interface ScoreRange {
    label: string;
    min: number;
    max: number;
    color: string;
    text: string;
    bg: string;
}

const RANGES: ScoreRange[] = [
    { label: "Very Poor", min: 300, max: 419, color: "#EF4444", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" },
    { label: "Poor", min: 420, max: 539, color: "#F97316", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/20" },
    { label: "Fair", min: 540, max: 659, color: "#F59E0B", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20" },
    { label: "Good", min: 660, max: 779, color: "#06B6D4", text: "text-cyan-700 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/20" },
    { label: "Excellent", min: 780, max: 900, color: "#10B981", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
];

const SCORE_MIN = 300;
const SCORE_MAX = 900;

function clampScore(score: number): number {
    if (Number.isNaN(score)) return SCORE_MIN;
    return Math.min(SCORE_MAX, Math.max(SCORE_MIN, score));
}

function getRange(score: number): ScoreRange {
    const clamped = clampScore(score);
    return (
        RANGES.find((r) => clamped >= r.min && clamped <= r.max) ?? RANGES[RANGES.length - 1]
    );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function donutSlice(
    cx: number,
    cy: number,
    innerR: number,
    outerR: number,
    startAngle: number,
    endAngle: number
) {
    const outerStart = polar(cx, cy, outerR, startAngle);
    const outerEnd = polar(cx, cy, outerR, endAngle);
    const innerStart = polar(cx, cy, innerR, endAngle);
    const innerEnd = polar(cx, cy, innerR, startAngle);
    const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;

    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        "Z",
    ].join(" ");
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
    score,
    className = "",
    size = 360,
}) => {
    const hasScore = score !== null && score !== undefined && (typeof score === "number" || typeof score === "string") && Number(score) >= SCORE_MIN;
    const clamped = clampScore(Number(score) || SCORE_MIN);
    const activeRange = getRange(clamped);

    const [displayScore, setDisplayScore] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(SCORE_MIN);

    useEffect(() => {
        if (!hasScore) {
            setAnimatedScore(SCORE_MIN);
            setDisplayScore(0);
            return;
        }

        // Trigger needle animation
        const needleTimer = setTimeout(() => {
            setAnimatedScore(clamped);
        }, 50);

        // Animate score count-up/transition
        const startScore = displayScore;
        const targetScore = clamped;

        let startTimestamp: number | null = null;
        const duration = 900;
        let animationFrameId: number;

        const countUp = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);

            // Cubic easeOut for smooth decelerating transition
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            // Interpolate from startScore to targetScore
            const currentVal = startScore + (targetScore - startScore) * easeOutProgress;
            setDisplayScore(Math.floor(currentVal));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(countUp);
            }
        };

        animationFrameId = requestAnimationFrame(countUp);

        return () => {
            clearTimeout(needleTimer);
            cancelAnimationFrame(animationFrameId);
        };
    }, [clamped, hasScore]);

    const width = size;
    const height = size * 0.66;

    const cx = width / 2;
    const cy = height * 0.92;
    const outerR = width * 0.44;
    const innerR = width * 0.28;
    const gap = 1.6; // degrees of white gap between segments

    const segments = useMemo(() => {
        const span = 180 / RANGES.length;
        return RANGES.map((range, i) => {
            const startAngle = 180 - i * span;
            const endAngle = 180 - (i + 1) * span;
            return {
                ...range,
                d: donutSlice(cx, cy, innerR, outerR, startAngle - gap / 2, endAngle + gap / 2),
                midAngle: (startAngle + endAngle) / 2,
            };
        });
    }, [cx, cy, innerR, outerR]);

    // Needle rotation: score 300 -> 180deg (left), score 900 -> 0deg (right)
    const targetAngle = 180 - ((animatedScore - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 180;
    const needleRotation = -targetAngle;

    const needleLength = innerR + (outerR - innerR) * 0.55;
    const tailLength = width * 0.05;
    const wideWidth = width * 0.022;
    const widePos = width * 0.06;

    const needlePath = [
        `M ${cx - tailLength} ${cy}`,
        `L ${cx + widePos} ${cy - wideWidth}`,
        `L ${cx + needleLength} ${cy}`,
        `L ${cx + widePos} ${cy + wideWidth}`,
        "Z",
    ].join(" ");

    const labelR = outerR + width * 0.16; // Pushed labels further out
    const padX = width * 0.22;            // Increased horizontal padding to prevent clipping of larger outer labels
    const padY = width * 0.12;            // Increased vertical padding for larger top labels
    const viewBoxWidth = width + padX * 2;
    const viewBoxHeight = height + padY + 12;
    const aspect = viewBoxHeight / viewBoxWidth;
    const renderHeight = size * aspect;

    return (
        <div className={`inline-flex flex-col items-center ${className}`}>
            <svg
                viewBox={`-${padX} -${padY} ${viewBoxWidth} ${viewBoxHeight}`}
                width={size}
                height={renderHeight}
                className="overflow-visible"
            >
                {/* Segments */}
                {segments.map((seg) => {
                    const isActive = hasScore && seg.label === activeRange.label;
                    return (
                        <path
                            key={seg.label}
                            d={seg.d}
                            fill={seg.color}
                        />
                    );
                })}

                {/* Segment labels */}
                {segments.map((seg) => {
                    const pos = polar(cx, cy, labelR, seg.midAngle);

                    // Push outer labels (Very Poor / Excellent) further to the sides and down slightly
                    if (seg.label === "Very Poor") {
                        pos.x -= width * 0.13;
                        pos.y += width * 0.04;
                    } else if (seg.label === "Excellent") {
                        pos.x += width * 0.13;
                        pos.y += width * 0.04;
                    }

                    const isActive = hasScore && seg.label === activeRange.label;
                    return (
                        <text
                            key={`label-${seg.label}`}
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="select-none"
                            style={{
                                fontSize: width * 0.08, // Increased from 0.06 to 0.08
                                fontWeight: isActive ? 800 : 600,
                                fill: isActive ? seg.color : "#94a3b8",
                                letterSpacing: "0.03em",
                                transition: "fill 0.4s ease, font-weight 0.4s ease",
                            }}
                        >
                            {seg.label.toUpperCase()}
                        </text>
                    );
                })}

                {/* Min / Max ticks */}
                <text
                    x={polar(cx, cy, outerR + width * 0.08, 182).x}
                    y={polar(cx, cy, outerR + width * 0.08, 182).y + 22} // Adjusted spacing for larger font
                    textAnchor="middle"
                    style={{ fontSize: width * 0.08, fill: "#94a3b8", fontWeight: 800 }} // Increased to 0.06 and bold (800)
                >
                    {SCORE_MIN}
                </text>
                <text
                    x={polar(cx, cy, outerR + width * 0.08, -2).x}
                    y={polar(cx, cy, outerR + width * 0.08, -2).y + 22} // Adjusted spacing for larger font
                    textAnchor="middle"
                    style={{ fontSize: width * 0.08, fill: "#94a3b8", fontWeight: 800 }} // Increased to 0.06 and bold (800)
                >
                    {SCORE_MAX}
                </text>

                {/* Needle group — rotated, animated on score change */}
                {hasScore && (
                    <g
                        style={{
                            transform: `rotate(${needleRotation}deg)`,
                            transformOrigin: `${cx}px ${cy}px`,
                            transition: "transform 0.8s cubic-bezier(0.34, 1.2, 0.4, 1)",
                        }}
                    >
                        <path d={needlePath} className="fill-slate-800 dark:fill-slate-200" />
                    </g>
                )}

                {/* Pivot cap */}
                <circle cx={cx} cy={cy} r={width * 0.045} className="fill-slate-800 dark:fill-slate-200" />
                <circle cx={cx} cy={cy} r={width * 0.02} className="fill-white dark:fill-slate-950" />
            </svg>

            {/* Score readout */}
            <div className="flex flex-col items-center -mt-2">
                <span
                    className="font-bold text-slate-800 dark:text-slate-100 tabular-nums leading-none"
                    style={{ fontSize: width * 0.13 }}
                >
                    {hasScore ? displayScore : "—"}
                </span>
                <span
                    className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${hasScore
                        ? `${activeRange.text} ${activeRange.bg}`
                        : "text-slate-400 bg-slate-100 dark:text-slate-500 dark:bg-slate-900"
                        }`}
                >
                    {hasScore ? activeRange.label : "Not Checked"}
                </span>
            </div>
        </div>
    );
};

export default CreditScoreGauge;

/**
 * Optional interactive demo — drag the slider to see the needle animate.
 * Safe to delete if you only need the gauge itself.
 */
export function CreditScoreGaugeDemo() {
    const [score, setScore] = useState(742);

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 w-full max-w-md flex flex-col items-center">
                <h2 className="text-slate-500 font-medium text-sm tracking-wide uppercase mb-6">
                    Your Credit Score
                </h2>

                <CreditScoreGauge score={score} size={340} />

                <div className="w-full mt-8">
                    <input
                        type="range"
                        min={SCORE_MIN}
                        max={SCORE_MAX}
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full accent-slate-800 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>{SCORE_MIN}</span>
                        <span>{SCORE_MAX}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}