// App.tsx
// Componente principal de la aplicación ProgressiveBar
// -----------------------------------------------------
// - Permite llevar el progreso de una meta configurable (en currency o elementos)
// - Barra de progreso animada (SmokeProgressBar)
// - UI dark, color cyan, minimalista, cuadrada, responsiva y con animaciones modernas
// - Menú de configuración oculto (meta, tipo, idioma)
// - Internacionalización (i18n) con react-i18next
// - Controles de reset con confirmación
// - Código comentado y organizado para facilitar comprensión por IA y desarrolladores

import './i18n'; // Configuración de internacionalización
import { useTranslation } from 'react-i18next';
import { SmokeProgressBar } from './components/SmokeProgressBar'; // Barra de progreso custom animada
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useRef, useState, useEffect } from 'react';

// Paleta de colores principal (dark/cyan)
const cyan = '#00eaff';
const dark = '#10141a';
const card = '#181d23';
const border = '#222b36';

// Constantes para breakpoints y paddings
const PADDING_DESKTOP = 124;
const PADDING_TABLET = 32;
const PADDING_MOBILE = 4;
const BREAKPOINT_TABLET = 700;
const BREAKPOINT_MOBILE = 400;

// Estilos globales y fuentes para toda la app
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap');
  body {
    background: ${dark};
    color: #fff;
    font-family: 'Space Grotesk', 'Inter', 'Segoe UI', Arial, sans-serif;
    letter-spacing: 0.01em;
    transition: background 0.5s cubic-bezier(.4,2,.6,1), color 0.5s cubic-bezier(.4,2,.6,1);
  }
`;

// Contenedor principal de la app (pantalla completa, centrado)
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${dark};
  width: 100vw;
  box-sizing: border-box;
  padding-left: ${PADDING_DESKTOP}px;
  padding-right: ${PADDING_DESKTOP}px;
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    padding-left: ${PADDING_TABLET}px;
    padding-right: ${PADDING_TABLET}px;
    min-height: 100dvh;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    padding-left: ${PADDING_MOBILE}px;
    padding-right: ${PADDING_MOBILE}px;
    min-height: 100dvh;
    width: 100vw;
    overflow-x: hidden;
  }
`;

// Botón hamburguesa/X para mostrar/ocultar el menú de configuración
const MenuButton = styled.button`
  position: fixed;
  top: 2.2rem;
  left: 2.2rem;
  z-index: 9999;
  background: ${cyan};
  color: #10141a;
  border: none;
  border-radius: 0;
  padding: 0.7rem 0.9rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px 0 #00eaff55, 0 1.5px 0 #00eaff;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.08s;
  opacity: 1;
  pointer-events: auto;
  &:hover {
    background: #0e1a1f;
    color: ${cyan};
    box-shadow: 0 6px 24px 0 #00eaff99;
    transform: translateY(-2px) scale(1.04);
  }
  &:active {
    background: #00eaff;
    color: #10141a;
    box-shadow: 0 2px 8px 0 #00eaff33;
    transform: scale(0.97);
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    top: 1.1rem;
    left: 1.1rem;
    width: 40px;
    height: 40px;
    padding: 0.5rem 0.6rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    top: 0.5rem;
    left: 0.5rem;
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
    padding: 0.3rem 0.3rem;
  }
`;

// Menú de configuración (meta, tipo, idioma)
const Menu = styled.nav`
  width: 100vw;
  max-width: 100vw;
  background: transparent;
  padding: 1.5rem 0 1rem 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  box-shadow: none;
  border-bottom: none;
  border-radius: 0;
  margin-bottom: 2.5rem;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
  transition: opacity 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
  position: relative;
  z-index: 100;
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    padding: 1.2rem 0 0.7rem 0;
    width: 98vw;
    max-width: 98vw;
    margin-bottom: 1.2rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    gap: 0.5rem;
    padding: 0.7rem 0 0.3rem 0;
    width: 100vw;
    max-width: 100vw;
    margin-bottom: 0.5rem;
  }
`;

// Grupo de controles dentro del menú
const MenuGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${dark};
  border-radius: 0;
  padding: 0.3rem 0.7rem;
  border: 1.5px solid ${border};
  box-shadow: 0 2px 8px 0 #0003;
  position: relative;
  z-index: 101;
  animation: menuGroupFadeIn 0.7s cubic-bezier(.22,1.5,.56,1);
  @keyframes menuGroupFadeIn {
    0% {
      opacity: 0;
      transform: translateY(-32px) scale(0.95);
      box-shadow: 0 0 0 0 #0000;
    }
    60% {
      opacity: 0.7;
      transform: translateY(12px) scale(1.03);
      box-shadow: 0 4px 20px 0 #0005;
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      box-shadow: 0 2px 8px 0 #0003;
    }
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 98vw;
    max-width: 98vw;
    justify-content: center;
    padding: 0.5rem 0.5rem;
    font-size: 0.98rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    width: 99vw;
    max-width: 99vw;
    padding: 0.3rem 0.1rem;
    font-size: 0.92rem;
  }
`;

// Sección para agregar progreso
const AddProcessSection = styled.section`
  margin: 2rem 0 1rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    flex-direction: column;
    gap: 0.7rem;
    width: 100%;
    align-items: stretch;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    gap: 0.3rem;
    margin: 1rem 0 0.5rem 0;
  }
`;

// Input custom para meta y agregar progreso
const Input = styled.input`
  background: #15181e;
  border: 1.5px solid ${cyan};
  color: #fff;
  border-radius: 0;
  padding: 0.7rem 1.2rem;
  width: 120px;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px 0 #0004;
  transition: border 0.2s, box-shadow 0.2s;
  &::placeholder {
    color: #b2c2cc;
    opacity: 1;
  }
  &:focus {
    border: 1.5px solid #fff;
    outline: none;
    box-shadow: 0 0 0 2px #00eaff44;
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    font-size: 0.95rem;
    padding: 0.4rem 0.4rem;
    min-width: 0;
  }
`;

// Select custom para tipo de meta e idioma
const Select = styled.select`
  background: #15181e;
  border: 1.5px solid ${cyan};
  color: #fff;
  border-radius: 0;
  padding: 0.7rem 1.2rem;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px 0 #0004;
  transition: border 0.2s, box-shadow 0.2s;
  &:focus {
    border: 1.5px solid #fff;
    outline: none;
    box-shadow: 0 0 0 2px #00eaff44;
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.6rem 0.8rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    font-size: 0.95rem;
    padding: 0.4rem 0.4rem;
    min-width: 0;
  }
`;

// Botón custom para agregar progreso y acciones
const Button = styled.button`
  position: relative;
  overflow: hidden;
  background: ${cyan};
  color: #10141a;
  border: none;
  border-radius: 0;
  padding: 0.4rem 1.1rem;
  min-width: 0;
  height: 32px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 0 0 2px #00eaff99, 0 2px 12px 0 #00eaff22;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.08s;
  &:hover {
    background: #0e1a1f;
    color: ${cyan};
    box-shadow: 0 0 0 4px #00eaff77, 0 4px 24px 0 #00eaff33;
    transform: scale(1.09) translateY(-2px);
  }
  &:active {
    background: #00eaff;
    color: #10141a;
    box-shadow: 0 0 0 1px #00eaff99, 0 1px 4px 0 #00eaff22;
    transform: scale(0.97);
  }
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.7s cubic-bezier(.4,2,.6,1);
    background: rgba(0,234,255,0.35);
    pointer-events: none;
  }
  @keyframes ripple {
    to {
      transform: scale(2.8);
      opacity: 0;
    }
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    height: 36px;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    font-size: 0.92rem;
    padding: 0.3rem 0.4rem;
    height: 32px;
    min-width: 0;
  }
`;

// Botón de reset (ícono)
const ResetIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${cyan};
  cursor: pointer;
  padding: 0.3rem;
  margin-top: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: color 0.18s, transform 0.12s;
  &:hover {
    color: #fff;
    transform: scale(1.15);
  }
  &:active {
    color: ${cyan};
    transform: scale(0.95);
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    font-size: 1.5rem;
    margin-top: 1.2rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    font-size: 1.1rem;
    margin-top: 0.7rem;
    padding: 0.1rem;
  }
`;

// Diálogo de confirmación de reset
const ConfirmDialog = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    align-items: flex-end;
    padding-bottom: 1.5rem;
  }
`;
const ConfirmBox = styled.div`
  background: ${card};
  border: 2px solid ${cyan};
  padding: 2rem 2.5rem;
  box-shadow: 0 2px 24px 0 #000a;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  animation: confirmFadeIn 0.7s cubic-bezier(.22,1.5,.56,1);
  @keyframes confirmFadeIn {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(30px);
      box-shadow: 0 0 0 0 #0000;
    }
    60% {
      opacity: 0.7;
      transform: scale(1.08) translateY(-8px);
      box-shadow: 0 8px 32px 0 #00eaff55;
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
      box-shadow: 0 2px 24px 0 #00eaffcc;
    }
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    padding: 1.2rem 0.7rem;
    min-width: 80vw;
    max-width: 98vw;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    padding: 0.7rem 0.2rem;
    min-width: 98vw;
    max-width: 100vw;
  }
`;
const ConfirmActions = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    gap: 0.5rem;
    margin-top: 0.7rem;
  }
`;

// Título principal
const Title = styled.h1`
  color: ${cyan};
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2.2rem;
  letter-spacing: 0.02em;
  text-align: center;
  word-break: break-word;
  hyphens: auto;
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
    padding: 0 0.5rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    font-size: 1.05rem;
    margin-bottom: 0.7rem;
    padding: 0 0.1rem;
  }
`;

// Panel principal centralizado y animado (reset, complete, add)
const Main = styled.div<{ animate?: boolean; resetAnim?: boolean; completeAnim?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
    ${({ animate }) => (animate ? '' : ' scale(0.98) translateY(60px)')}
    ${({ resetAnim }) => (resetAnim ? ' scale(1.03) rotate(-2deg)' : '')}
    ${({ completeAnim }) => (completeAnim ? ' scale(1.12) !important;' : '')};
  width: 100vw;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${card};
  border-radius: 0;
  box-shadow: 0 8px 40px 0 #000c;
  padding: 2.5rem 2rem 2rem 2rem;
  border: 1.5px solid ${border};
  opacity: ${({ animate }) => (animate ? 1 : 0)};
  transition: opacity 0.9s cubic-bezier(.4,2,.6,1), transform 0.9s cubic-bezier(.4,2,.6,1), box-shadow 0.7s cubic-bezier(.4,2,.6,1);
  animation: ${({ animate }) => animate ? 'mainBounceIn 1.1s cubic-bezier(.22,1.5,.56,1) both' : 'none'};
  z-index: 10;
  word-break: break-word;
  hyphens: auto;
  @keyframes mainBounceIn {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85) translateY(80px); }
    60% { opacity: 1; transform: translate(-50%, -50%) scale(1.08) translateY(-10px); }
    80% { transform: translate(-50%, -50%) scale(0.98) translateY(4px); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1) translateY(0); }
  }
  &.reset-anim {
    animation: shakeReset 0.55s cubic-bezier(.22,1.5,.56,1);
  }
  &.complete-anim {
    animation: completePulse 0.85s cubic-bezier(.22,1.5,.56,1);
    box-shadow: 0 0 0 0 #00eaff00, 0 0 0 0 #00eaff00, 0 8px 40px 0 #00eaffcc;
    border-color: ${border};
  }
  @keyframes completePulse {
    0% {
      box-shadow: 0 0 0 0 #00eaff00, 0 0 0 0 #00eaff00, 0 8px 40px 0 #00eaffcc;
      border-color: ${border};
    }
    20% {
      box-shadow: 0 0 0 0 #00eaff00, 0 0 32px 16px #00eaffcc, 0 8px 40px 0 #00eaffcc;
      border-color: ${border};
    }
    40% {
      box-shadow: 0 0 0 0 #00eaff00, 0 0 64px 32px #00eaffcc, 0 8px 40px 0 #00eaffcc;
      border-color: ${border};
    }
    60% {
      box-shadow: 0 0 0 0 #00eaff00, 0 0 48px 24px #00eaffcc, 0 8px 40px 0 #00eaffcc;
      border-color: ${border};
    }
    100% {
      box-shadow: 0 0 0 0 #00eaff00, 0 0 0 0 #00eaff00, 0 8px 40px 0 #00eaffcc;
      border-color: ${border};
    }
  }
  &.add-anim {
    animation: addPulse 0.6s cubic-bezier(.22,1.5,.56,1);
  }
  @keyframes shakeReset {
    0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
    20% { transform: translate(-50%, -50%) scale(1.04) rotate(-5deg); }
    40% { transform: translate(-50%, -50%) scale(0.98) rotate(4deg); }
    60% { transform: translate(-50%, -50%) scale(1.05) rotate(-3deg); }
    80% { transform: translate(-50%, -50%) scale(0.97) rotate(2deg); }
    100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  }
  @keyframes completePulse {
    0% { box-shadow: 0 0 0 0 #00eaff00; }
    30% { box-shadow: 0 0 0 24px #00eaff55; }
    60% { box-shadow: 0 0 0 12px #00eaff99; }
    100% { box-shadow: 0 8px 40px 0 #00eaffcc; }
  }
  @keyframes addPulse {
    0% { box-shadow: 0 0 0 0 #00eaff00; }
    40% { box-shadow: 0 0 0 16px #00eaff44; }
    100% { box-shadow: 0 8px 40px 0 #00eaffcc; }
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 99vw;
    max-width: 99vw;
    min-height: 80dvh;
    padding: 1.2rem 0.2rem 1.2rem 0.2rem;
    font-size: 0.98rem;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    position: static;
    top: unset;
    left: unset;
    transform: none;
    width: 98vw;
    max-width: 100vw;
    min-height: unset;
    padding: 0.7rem 0.05rem 0.7rem 0.05rem;
    font-size: 0.91rem;
    box-sizing: border-box;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }
`;

// Overlay de relámpagos animados en toda la pantalla
const LightningOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 2000;
  overflow: hidden;
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: 100vw;
    height: 100dvh;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }
`;

// Componente SVG de rayo animado individual
const LightningSVG = styled.svg<{ delay: number; left: string; top: string; scale: number }>`
  position: absolute;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  width: ${({ scale }) => 80 * scale}px;
  height: ${({ scale }) => 160 * scale}px;
  opacity: 0;
  filter: drop-shadow(0 0 32px #00eaffcc) drop-shadow(0 0 12px #fff8);
  animation: lightningFlash 0.7s cubic-bezier(.22,1.5,.56,1);
  animation-delay: ${({ delay }) => delay}s;
  @keyframes lightningFlash {
    0% { opacity: 0; transform: scale(0.9); filter: drop-shadow(0 0 0 #00eaff00); }
    10% { opacity: 1; transform: scale(1.08); filter: drop-shadow(0 0 32px #00eaffcc) drop-shadow(0 0 32px #fff); }
    30% { opacity: 1; transform: scale(1); }
    60% { opacity: 0.7; }
    100% { opacity: 0; transform: scale(0.95); }
  }
  @media (max-width: ${BREAKPOINT_TABLET}px) {
    width: ${({ scale }) => 60 * scale}px;
    height: ${({ scale }) => 120 * scale}px;
  }
  @media (max-width: ${BREAKPOINT_MOBILE}px) {
    width: ${({ scale }) => 60 * scale}px;
    height: ${({ scale }) => 110 * scale}px;
    left: ${({ left }) => left};
    top: ${({ top }) => top};
  }
`;

// Utilidad para formatear valores
const formatValue = (val: number, type: 'currency' | 'elements', lang: string) =>
  type === 'currency'
    ? val.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : val;

// Componente principal de la app
function App() {
  const { t, i18n } = useTranslation();
  // Forzar idioma por defecto a inglés al cargar la app
  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, []);
  const [goal, setGoal] = useState(100);
  const [current, setCurrent] = useState(0);
  const [type, setType] = useState<'currency' | 'elements'>('currency');
  const [addValue, setAddValue] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetAnim, setResetAnim] = useState(false);
  const [completeAnim, setCompleteAnim] = useState(false);
  const [addAnim, setAddAnim] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Animación de entrada del panel principal
  useEffect(() => { setTimeout(() => setMainVisible(true), 200); }, []);

  // Animación al completar meta
  useEffect(() => {
    if (current >= goal && goal > 0) {
      setCompleteAnim(true);
      if (mainRef.current) {
        mainRef.current.classList.remove('complete-anim');
        void mainRef.current.offsetWidth;
        mainRef.current.classList.add('complete-anim');
      }
      setTimeout(() => setCompleteAnim(false), 1100);
    }
  }, [current, goal]);

  // Animación al agregar progreso
  useEffect(() => {
    if (addAnim) {
      const timeout = setTimeout(() => setAddAnim(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [addAnim]);

  // Porcentaje de progreso (0-100)
  const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  // Ripple y agregar progreso
  const handleAddProcess = (e?: React.MouseEvent) => {
    if (e && buttonRef.current) {
      const btn = buttonRef.current;
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      circle.className = 'ripple';
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - radius}px`;
      btn.appendChild(circle);
      circle.addEventListener('animationend', () => circle.remove());
    }
    if (addValue > 0) {
      setCurrent(prev => type === 'currency'
        ? Math.min(goal, parseFloat((prev + addValue).toFixed(2)))
        : Math.min(goal, prev + addValue)
      );
      setAddValue(0);
      setAddAnim(true);
      setTimeout(() => setAddAnim(false), 400);
    }
  };

  // Reset con animación
  const handleReset = () => {
    setResetAnim(true);
    setTimeout(() => {
      setCurrent(0);
      setShowConfirm(false);
      setResetAnim(false);
    }, 500);
  };

  // Render principal
  return (
    <ThemeProvider theme={{}}>
      <GlobalStyle />
      <Container>
        {/* Botón hamburguesa/X para mostrar menú de configuración */}
        <MenuButton onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')}>
          {/* Icono hamburguesa/X animado */}
          <span style={{ fontSize: 28 }}>{menuOpen ? '✖' : '☰'}</span>
        </MenuButton>
        {/* Menú de configuración: meta, tipo, idioma */}
        <Menu style={{ display: menuOpen ? 'flex' : 'none' }}>
          <MenuGroup>
            <label>{t('goal')}:</label>
            {/* Input para definir la meta */}
            <Input
              type="number"
              value={goal === 0 ? '' : goal}
              min={1}
              onChange={e => setGoal(Number(e.target.value))}
              onFocus={() => { if (goal === 0) setGoal(NaN); }}
              onBlur={e => { if (e.target.value === '' || isNaN(Number(e.target.value))) setGoal(1); }}
            />
          </MenuGroup>
          <MenuGroup>
            <label>{t('changeType')}:</label>
            {/* Select para cambiar el tipo de meta */}
            <Select value={type} onChange={e => setType(e.target.value as 'currency' | 'elements')}>
              <option value="currency">{t('type_currency')}</option>
              <option value="elements">{t('type_elements')}</option>
            </Select>
          </MenuGroup>
          <MenuGroup>
            <label>{t('language')}:</label>
            {/* Select para cambiar el idioma */}
            <Select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </Select>
          </MenuGroup>
        </Menu>
        {/* Panel principal: título, barra de progreso, controles de avance y reset */}
        <Main
          ref={mainRef}
          animate={mainVisible}
          resetAnim={resetAnim}
          completeAnim={completeAnim}
          className={resetAnim ? 'reset-anim' : addAnim ? 'add-anim' : completeAnim ? 'complete-anim' : ''}
        >
          {/* Efecto de rayo al completar meta (ahora reemplazado por overlay global) */}
          {/* {completeAnim && (
            <LightningEffect viewBox="0 0 60 100">
              <polyline
                points="30,5 20,55 35,55 25,95 50,40 35,40 45,5"
                fill="none"
                stroke="#00eaff"
                strokeWidth="7"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="drop-shadow(0 0 16px #00eaffcc)"
              />
            </LightningEffect>
          )} */}
          <Title>{t('title')}</Title>
          {/* Barra de progreso animada y contextualizada */}
          <SmokeProgressBar
            percent={percent}
            label={type === 'currency'
              ? `$${formatValue(current, type, i18n.language)} / $${formatValue(goal, type, i18n.language)}`
              : `${formatValue(current, type, i18n.language)} / ${formatValue(goal, type, i18n.language)}`}
            addAnim={addAnim}
          />
          {/* Sección para agregar progreso */}
          <AddProcessSection>
            {/* Input para agregar progreso */}
            <Input
              type="number"
              value={addValue === 0 ? '' : addValue}
              min={type === 'currency' ? 0.01 : 1}
              step={type === 'currency' ? '0.01' : '1'}
              max={goal - current}
              onChange={e => setAddValue(Number(e.target.value))}
              placeholder={type === 'currency' ? '' : t('setCurrent')}
              onFocus={() => { if (addValue === 0) setAddValue(NaN); }}
              onBlur={e => { if (e.target.value === '' || isNaN(Number(e.target.value))) setAddValue(0); }}
            />
            {/* Botón para agregar progreso */}
            <Button ref={buttonRef} onClick={handleAddProcess}>{t('addProcess')}</Button>
          </AddProcessSection>
          {/* Botón de reset con confirmación */}
          <ResetIconButton title={t('resetProgress') ?? 'Reset'} onClick={() => setShowConfirm(true)}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 4a10 10 0 1 1-7.07 2.93" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="4 4 4 10 10 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ResetIconButton>
          {/* Diálogo de confirmación para resetear progreso */}
          {showConfirm && (
            <ConfirmDialog>
              <ConfirmBox>
                <span style={{color: cyan, fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.7rem'}}>{t('confirmReset') ?? '¿Seguro que deseas reiniciar el progreso?'}</span>
                <ConfirmActions>
                  {/* Botón para confirmar reset */}
                  <Button onClick={handleReset}>{t('yes') ?? 'Sí'}</Button>
                  {/* Botón para cancelar reset */}
                  <Button onClick={() => setShowConfirm(false)} style={{background: '#222b36', color: cyan}}>{t('no') ?? 'No'}</Button>
                </ConfirmActions>
              </ConfirmBox>
            </ConfirmDialog>
          )}
        </Main>
        {/* Overlay de relámpagos en toda la pantalla al completar meta */}
        {completeAnim && (
          <LightningOverlay>
            {/* Rayos en posiciones y delays aleatorios para efecto impactante */}
            <LightningSVG viewBox="0 0 60 120" delay={0} left="10%" top="8%" scale={1.1}>
              <polyline points="30,5 20,55 35,55 25,115 50,40 35,40 45,5" fill="none" stroke="#00eaff" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" filter="drop-shadow(0 0 16px #00eaffcc)" />
            </LightningSVG>
            <LightningSVG viewBox="0 0 60 120" delay={0.15} left="70%" top="18%" scale={0.8}>
              <polyline points="30,5 20,55 35,55 25,115 50,40 35,40 45,5" fill="none" stroke="#00eaff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" filter="drop-shadow(0 0 16px #00eaffcc)" />
            </LightningSVG>
            <LightningSVG viewBox="0 0 60 120" delay={0.25} left="40%" top="60%" scale={1.2}>
              <polyline points="30,5 20,55 35,55 25,115 50,40 35,40 45,5" fill="none" stroke="#00eaff" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" filter="drop-shadow(0 0 16px #00eaffcc)" />
            </LightningSVG>
            <LightningSVG viewBox="0 0 60 120" delay={0.35} left="80%" top="70%" scale={0.7}>
              <polyline points="30,5 20,55 35,55 25,115 50,40 35,40 45,5" fill="none" stroke="#00eaff" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" filter="drop-shadow(0 0 16px #00eaffcc)" />
            </LightningSVG>
            <LightningSVG viewBox="0 0 60 120" delay={0.18} left="20%" top="75%" scale={0.9}>
              <polyline points="30,5 20,55 35,55 25,115 50,40 35,40 45,5" fill="none" stroke="#00eaff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" filter="drop-shadow(0 0 16px #00eaffcc)" />
            </LightningSVG>
          </LightningOverlay>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
