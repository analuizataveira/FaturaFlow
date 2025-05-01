/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as HALO from 'vanta/dist/vanta.halo.min';

export default function VantaHalo() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any;
    if (vantaRef.current) {
      effect = HALO({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0x30834, // Cor fixa (azul escuro)
        baseColor: 0x1a59,       // Cor fixa (azul médio)
        size: 1,
      });
    }

    return () => {
      if (effect) effect.destroy?.();
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  );
}