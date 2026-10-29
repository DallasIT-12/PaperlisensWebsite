'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    RoundedBox,
    Environment,
    ContactShadows,
    PerspectiveCamera,
    useTexture,
    Html
} from '@react-three/drei';
import * as THREE from 'three';

interface CigaretteBoxThreeProps {
    customImage?: string | null;
    openAmount?: number; // 0 to 1
    zoom?: number;
}

const BoxModel = ({ customImage, openAmount = 0, zoom = 1 }: CigaretteBoxThreeProps) => {
    // Priority: Uploaded image > User specified JPG > Default
    const imageUrl = customImage || '/KK_GAJAH_OLENG.JPG';
    const lidRef = useRef<THREE.Group>(null);
    const [isOpenInternal, setIsOpenInternal] = React.useState(false);

    // Load texture
    const texture = useTexture(imageUrl);
    texture.anisotropy = 16;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    // Dimensions
    const width = 1.4;
    const height = 1.8;
    const depth = 0.7;
    const bevel = 0.02;

    // Simplified and refined mapping for the specific Gajah Oleng layout
    // Coordinates are normalized (0 to 1)
    const getFaceMaterial = (repeatX: number, repeatY: number, offsetX: number, offsetY: number) => {
        const tex = texture.clone();
        tex.repeat.set(repeatX, repeatY);
        tex.offset.set(offsetX, offsetY);
        tex.needsUpdate = true;

        // UPGRADED: MeshPhysicalMaterial for premium response to light
        return new THREE.MeshPhysicalMaterial({
            map: tex,
            roughness: 0.35,
            metalness: 0.2,
            clearcoat: 0.8, // Add a gloss layer like premium packaging
            clearcoatRoughness: 0.1,
            sheen: 1, // Soft sheen for paper texture
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color('#ffffff')
        });
    };

    // Body Materials: Right (X+), Left (X-), Top (Y+), Bottom (Y-), Front (Z+), Back (Z-)
    const bodyMaterials = useMemo(() => [
        getFaceMaterial(0.12, 0.55, 0.68, 0.12),  // Right (Side Detail)
        getFaceMaterial(0.12, 0.55, 0.12, 0.12), // Left (Side Detail)
        new THREE.MeshPhysicalMaterial({ color: '#111', roughness: 0.8 }), // Top (Inner frame)
        getFaceMaterial(0.28, 0.12, 0.36, 0.02),  // Bottom
        getFaceMaterial(0.28, 0.55, 0.36, 0.14),  // Front (Logo & Rasa Nikmat)
        getFaceMaterial(0.28, 0.55, 0.82, 0.14),  // Back (Barcode & Peringatan)
    ], [texture]);

    // Lid Materials: Same order
    const lidMaterials = useMemo(() => [
        getFaceMaterial(0.12, 0.22, 0.68, 0.72),  // Right
        getFaceMaterial(0.12, 0.22, 0.12, 0.72), // Left
        getFaceMaterial(0.28, 0.12, 0.36, 0.86),  // Top (Gold Rumi Logo on Black)
        new THREE.MeshPhysicalMaterial({ color: '#111', roughness: 0.8 }), // Bottom (Inner)
        getFaceMaterial(0.28, 0.22, 0.36, 0.66),  // Front Lid
        getFaceMaterial(0.28, 0.22, 0.82, 0.66),  // Back Lid
    ], [texture]);

    const foilMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#d4d4d4',
        roughness: 0.1,
        metalness: 1, // Full metallic for foil
        clearcoat: 1,
    }), []);

    // Animation: Combine prop openAmount with click-toggle state
    const effectiveOpenAmount = Math.max(openAmount, isOpenInternal ? 1 : 0);

    useFrame((state, delta) => {
        if (lidRef.current) {
            const targetRotation = THREE.MathUtils.degToRad(effectiveOpenAmount * -110);
            lidRef.current.rotation.x = THREE.MathUtils.lerp(
                lidRef.current.rotation.x,
                targetRotation,
                0.1
            );
        }
    });

    return (
        <group scale={zoom} onClick={(e) => {
            e.stopPropagation();
            setIsOpenInternal(!isOpenInternal);
        }}>
            {/* Dynamic Highlight that follows mouse for premium shine */}
            <pointLight position={[2, 2, 2]} intensity={2} color="#ffffff" />

            {/* BASE BODY */}
            <group position={[0, -0.225, 0]}>
                <RoundedBox
                    args={[width, height * 0.75, depth]}
                    radius={bevel}
                    smoothness={4}
                    position={[0, -height * 0.125, 0]}
                    castShadow
                    receiveShadow
                >
                    {bodyMaterials.map((mat, i) => <primitive object={mat} key={i} attach={`material-${i}`} />)}
                </RoundedBox>

                {/* Inner Cigarettes / Foil - visible when open */}
                {effectiveOpenAmount > 0.05 && (
                    <group position={[0, height * 0.2, 0]}>
                        <RoundedBox args={[width * 0.9, height * 0.2, depth * 0.8]} radius={0.01}>
                            <meshPhysicalMaterial {...foilMaterial} />
                        </RoundedBox>
                        {/* Cigarette Tips (Simplified) */}
                        <group position={[0, 0.1, 0]}>
                            {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
                                <mesh key={i} position={[x, 0, 0]}>
                                    <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
                                    <meshPhysicalMaterial color="#f0f0f0" roughness={0.5} sheen={1} />
                                </mesh>
                            ))}
                        </group>
                    </group>
                )}
            </group>

            {/* LID (Rotating Part) */}
            <group
                ref={lidRef}
                position={[0, height * 0.45, -depth / 2]} // Pivot at the back-top hinge
            >
                <group position={[0, -height * 0.125, depth / 2]}>
                    <RoundedBox
                        args={[width, height * 0.25, depth]}
                        radius={bevel}
                        smoothness={4}
                        castShadow
                    >
                        {lidMaterials.map((mat, i) => <primitive object={mat} key={i} attach={`material-${i}`} />)}
                    </RoundedBox>
                </group>
            </group>
        </group>
    );
};

export default function CigaretteBoxThree({ customImage, openAmount = 0, zoom = 1, isStatic = false }: CigaretteBoxThreeProps & { isStatic?: boolean }) {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            style={{
                width: '100%',
                height: isStatic ? '450px' : '300px',
                cursor: hovered ? 'pointer' : 'grab'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={35} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <React.Suspense fallback={<Html center>Loading 3D...</Html>}>
                    <BoxModel customImage={customImage} openAmount={openAmount} zoom={zoom} />
                    <Environment preset="studio" />
                    <ContactShadows
                        position={[0, -1.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={2}
                    />
                </React.Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={8}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 4}
                />
            </Canvas>
        </div>
    );
}
