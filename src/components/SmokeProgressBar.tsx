// SmokeProgressBar.tsx
// Componente de barra de progreso animada con efecto de humo
// ---------------------------------------------------------
// Props:
//   - percent: número (0-100), porcentaje de progreso a mostrar
//   - label: string, texto contextualizado a mostrar sobre la barra
// Características:
//   - Estilo cuadrado, minimalista, dark/cyan
//   - Animación de avance y efecto de humo moderno
//   - Totalmente responsivo
//   - Pensado para usarse en la UI principal de la app

import React from 'react';
import styled, { keyframes } from 'styled-components';

// Paleta de colores consistente con la app
const cyan = '#00eaff';
const dark = '#10141a';

// Contenedor principal de la barra
const Container = styled.div<{ addAnim?: boolean }>`
  width: 100%;
  max-width: 350px;
  height: 38px;
  background: ${dark};
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 2px 16px 0 #000a;
  border: 2.5px solid ${cyan};
  position: relative;
  transition: box-shadow 0.3s, border-color 0.3s;
  ${({ addAnim }) =>
    addAnim
      ? `
    animation: pulseBar 0.6s cubic-bezier(.4,2,.6,1);
    box-shadow: 0 0 0 6px #00eaff55, 0 2px 16px 0 #00eaff99;
    border-color: #00eaff;
  `
      : ''}
  @keyframes pulseBar {
    0% { box-shadow: 0 0 0 0 #00eaff00; border-color: ${cyan}; }
    30% { box-shadow: 0 0 0 12px #00eaff55; border-color: #fff; }
    60% { box-shadow: 0 0 0 6px #00eaff99; border-color: #00eaff; }
    100% { box-shadow: 0 2px 16px 0 #000a; border-color: ${cyan}; }
  }
  @media (max-width: 700px) {
    max-width: 98vw;
    width: 98vw;
    height: 28px;
  }
  @media (max-width: 400px) {
    max-width: 100vw;
    width: 100vw;
    height: 22px;
    min-width: 0;
  }
`;

// Animación de avance de la barra
const progressAnim = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// Barra de progreso animada
const Progress = styled.div<{ percent: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${cyan} 60%, #fff 100%);
  width: ${({ percent }) => percent}%;
  transition: width 0.7s cubic-bezier(.4,2,.6,1);
  position: absolute;
  left: 0; top: 0;
  z-index: 1;
  box-shadow: 0 0 24px 0 #00eaff55;
  animation: ${progressAnim} 1.1s cubic-bezier(.4,2,.6,1);
`;

// Efecto de humo animado sobre la barra
const Smoke = styled.div`
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
  background: repeating-linear-gradient(120deg, #fff2 0 2px, transparent 2px 8px);
  filter: blur(4px) brightness(1.2);
  opacity: 0.7;
  mix-blend-mode: lighten;
  animation: smokeMove 2.5s linear infinite alternate;
  @keyframes smokeMove {
    0% { background-position: 0 0; }
    100% { background-position: 40px 20px; }
  }
`;

// Etiqueta centrada sobre la barra
const Label = styled.div`
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.01em;
  z-index: 3;
  text-shadow: 0 2px 8px #000a;
  user-select: none;
  @media (max-width: 700px) {
    font-size: 0.95rem;
  }
  @media (max-width: 400px) {
    font-size: 0.82rem;
    padding: 0 0.1rem;
    max-width: 98vw;
    word-break: break-word;
  }
`;

// Componente exportado: barra de progreso animada con humo y etiqueta contextual
export function SmokeProgressBar({ percent, label, addAnim }: { percent: number; label: string; addAnim?: boolean }) {
  return (
    <Container addAnim={addAnim}>
      <Progress percent={percent} />
      <Smoke />
      <Label>{label}</Label>
    </Container>
  );
}
