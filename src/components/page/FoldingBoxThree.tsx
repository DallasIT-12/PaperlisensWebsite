'use client';

import React, { useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    ContactShadows,
    PerspectiveCamera,
    Html,
    RoundedBox
} from '@react-three/drei';
import * as THREE from 'three';

interface FoldingBoxThreeProps {
    foldAmount?: number;
    lidOpenAmount?: number;
    zoom?: number;
}

const FoldingBoxModel = ({ foldAmount = 0, lidOpenAmount = 0, zoom = 1 }: FoldingBoxThreeProps) => {
    // 1. Industrial Dimensions (mm) -> 3D Units (Scale 0.05)
    // 1mm = 0.05 units. (Box: 55 x 85 x 22 mm)
    const scale = 0.05;
    const w = 55 * scale;    // 2.75
    const h = 85 * scale;    // 4.25
    const d = 22 * scale;    // 1.1
    const t = 0.5 * scale;   // 0.025 (Thickness)
    const rad = 1 * scale;   // 0.05 (Corner Radius)

    // 2. Load and Calibrate Texture
    const texture = useLoader(THREE.TextureLoader, '/KK_GAJAH_OLENG.jpg');
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Helper to create calibrated materials
    const createMat = (offset: [number, number], repeat: [number, number], color = '#ffffff') => {
        const tex = texture.clone();
        tex.offset.set(offset[0], offset[1]);
        tex.repeat.set(repeat[0], repeat[1]);
        tex.needsUpdate = true;
        return new THREE.MeshStandardMaterial({
            map: tex,
            color,
            roughness: 0.3,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
    };

    // 3. Specific UV Offsets (Gajah Oleng Calibration)
    const mats = useMemo(() => {
        // Front Face: [0.55, 0.22], scale: [0.18, 0.44] (Gajah Logo)
        const frontFace = createMat([0.55, 0.22], [0.18, 0.44]);

        // Back Face: [0.26, 0.22], scale: [0.18, 0.44] (Barcode/Warning)
        const backFace = createMat([0.26, 0.22], [0.18, 0.44]);

        // Top Lid: [0.45, 0.05], scale: [0.10, 0.17] (Gold Rumi Logo)
        const topFace = createMat([0.45, 0.05], [0.10, 0.17]);

        const sideFace = new THREE.MeshStandardMaterial({ color: '#E5E5E5', roughness: 0.4, side: THREE.DoubleSide });

        return {
            front: [sideFace, sideFace, sideFace, sideFace, frontFace, sideFace], // Index 4 is +Z
            back: [sideFace, sideFace, sideFace, sideFace, sideFace, backFace],  // Index 5 is -Z
            top: [sideFace, sideFace, topFace, sideFace, sideFace, sideFace],   // Index 2 is +Y
            side: [sideFace, sideFace, sideFace, sideFace, sideFace, sideFace],
        };
    }, [texture]);

    // 4. Hierarchical Hinges
    // Fold angle: 0 to 90
    const fAngle = (Math.PI / 2) * foldAmount;

    // Lid open: Fold 90 then swing 110 (Total 200)
    const lidFold = (Math.PI / 2) * foldAmount;
    const lidOpen = (110 * Math.PI / 180) * lidOpenAmount;
    const lidTotal = -(lidFold + (foldAmount === 1 ? lidOpen : 0));

    // Ref Coordinate: Rusuk Belakang at Z = -11 (scaled -0.55)
    const zBack = -d / 2;

    return (
        <group scale={zoom}>
            {/* BACK PANEL (ROOT ANCHOR at [0,0,0]) 
                We place the mesh itself at [0, 0, zBack] 
            */}
            <RoundedBox args={[w, h, t]} radius={rad} smoothness={4} position={[0, 0, zBack]}>
                {mats.back.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
            </RoundedBox>

            {/* BOTTOM FLAP: Child of Back. Hinge at y: -42.5, z: -11 */}
            <group position={[0, -h / 2, zBack]} rotation={[-fAngle, 0, 0]}>
                <RoundedBox args={[w, d, t]} radius={rad} smoothness={4} position={[0, -d / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    {mats.side.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
                </RoundedBox>

                {/* FRONT PANEL: Child of Bottom. Hinge at its outer edge [0, -d, 0] */}
                <group position={[0, -d, 0]} rotation={[-fAngle, 0, 0]}>
                    <RoundedBox args={[w, h, t]} radius={rad} smoothness={4} position={[0, -h / 2, 0]} rotation={[Math.PI, 0, 0]}>
                        {mats.front.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
                    </RoundedBox>
                </group>
            </group>

            {/* SIDE PANELS: Children of Back. Hinges at x: +/- 27.5, z: -11 */}
            <group position={[-w / 2, 0, zBack]} rotation={[0, -fAngle, 0]}>
                <RoundedBox args={[d, h, t]} radius={rad} smoothness={4} position={[-d / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    {mats.side.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
                </RoundedBox>
            </group>

            <group position={[w / 2, 0, zBack]} rotation={[0, fAngle, 0]}>
                <RoundedBox args={[d, h, t]} radius={rad} smoothness={4} position={[d / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    {mats.side.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
                </RoundedBox>
            </group>

            {/* LID (TUTUP ATAS): Child of Back. Hinge at y: 42.5, z: -11 */}
            <group position={[0, h / 2, zBack]} rotation={[lidTotal, 0, 0]}>
                <RoundedBox args={[w, d, t]} radius={rad} smoothness={4} position={[0, d / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    {mats.top.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
                </RoundedBox>
            </group>
        </group>
    );
};

export default function FoldingBoxThree() {
    const [fold, setFold] = useState(0);
    const [open, setOpen] = useState(0);

    return (
        <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto p-12 bg-[#020202] rounded-[3.5rem] border border-white/5 shadow-2xll shadow-white/5 transition-all duration-700">
            <div className="relative w-full h-[600px] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-inner">
                <div className="absolute top-12 left-12 z-10 flex flex-col gap-3">
                    <div className="px-5 py-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 w-fit">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Gajah Oleng V4.0</span>
                    </div>
                    <h2 className="text-white text-5xl font-black tracking-tighter uppercase leading-[0.8] mb-2 tracking-[-0.05em]">Industrial<br /><span className="text-white/20">Die-Cut</span></h2>
                </div>

                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={24} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={3} color="#fff" />
                    <spotLight position={[0, 15, 0]} intensity={5} angle={0.4} penumbra={1} castShadow />

                    <React.Suspense fallback={<Html center className="text-white font-mono text-[10px] tracking-widest opacity-20 uppercase animate-pulse">Rendering Die-Cut...</Html>}>
                        <FoldingBoxModel
                            foldAmount={fold}
                            lidOpenAmount={open}
                            zoom={1.2}
                        />
                        <Environment preset="night" />
                        <ContactShadows position={[0, -2.5, 0]} opacity={0.8} scale={20} blur={5} far={5} />
                    </React.Suspense>

                    <OrbitControls enablePan={false} />
                </Canvas>
            </div>

            {/* Premium Control Center */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/[0.02] p-12 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
                <div className="space-y-6">
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em]">Fold Progress</label>
                        <span className="text-6xl font-black text-white tracking-tighter italic tabular-nums">{Math.round(fold * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.0001"
                        value={fold}
                        onChange={(e) => setFold(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:accent-indigo-500 transition-all focus:outline-none"
                    />
                </div>

                <div className={`space-y-6 transition-all duration-1000 ${fold < 0.999 ? 'opacity-5 grayscale blur-3xl scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                    <div className="flex justify-between items-baseline mb-2">
                        <label className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em]">Flip-Top Open</label>
                        <span className="text-6xl font-black text-white tracking-tighter italic tabular-nums">{Math.round(open * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.0001"
                        value={open}
                        disabled={fold < 0.999}
                        onChange={(e) => setOpen(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-500 transition-all focus:outline-none"
                    />
                </div>
            </div>

            <div className="text-center px-12">
                <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.8em] leading-relaxed">
                    Industrial Specification: 55 x 85 x 22 mm &bull; RoundedBox Precision &bull; Gajah Oleng Die-Cut
                </p>
            </div>
        </div>
    );
}
