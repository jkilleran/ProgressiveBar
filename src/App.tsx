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

// --- ESTILOS PARA 275px DE ANCHO CON MEJORAS ESTÉTICAS Y ANIMACIONES ---

// Estilos globales y fuentes para toda la app
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap');
  body {
    background: linear-gradient(135deg, #10141a 60%, #181d23 100%);
    color: #eafcff;
    font-family: 'Space Grotesk', 'Inter', 'Segoe UI', Arial, sans-serif;
    letter-spacing: 0.01em;
    transition: background 0.5s cubic-bezier(.4,2,.6,1), color 0.5s cubic-bezier(.4,2,.6,1);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Efecto glass global */
    background-attachment: fixed;
    background-size: cover;
  }
  ::selection {
    background: #00eaff55;
    color: #10141a;
  }
`;

// Contenedor principal de la app (mobile first)
const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  overflow-x: hidden;
  animation: fadeInBg 1.2s cubic-bezier(.4,2,.6,1);
  @keyframes fadeInBg {
    0% { filter: blur(8px) brightness(0.7); }
    100% { filter: blur(0) brightness(1); }
  }
`;

// Botón hamburguesa/X para mostrar/ocultar el menú de configuración (mobile first)
const MenuButton = styled.button`
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  margin: 0;
  z-index: 9999;
  background: rgba(0,234,255,0.18);
  color: #00eaff;
  border: none;
  border-radius: 0;
  padding: 0.3rem 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px 0 #00eaff33, 0 1px 0 #00eaff;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.08s, border 0.18s;
  opacity: 1;
  pointer-events: auto;
  backdrop-filter: blur(2.5px);
  outline: none; /* Elimina el outline amarillo por defecto */
  /* Forzar color cyan en el icono y texto */
  span, svg {
    color: #00eaff !important;
    fill: #00eaff !important;
    text-shadow: 0 1px 4px #00eaff44;
  }
  &:hover {
    background: #00eaff22;
    color: #fff;
    box-shadow: 0 4px 16px 0 #00eaffcc;
    border: 2px solid #00eaff;
    span, svg {
      color: #fff !important;
      fill: #fff !important;
    }
    transform: translateY(-2px) scale(1.08);
  }
  &:active {
    background: #00eaff;
    color: #10141a;
    box-shadow: 0 2px 8px 0 #00eaff33;
    border: 2px solid #00eaff;
    span, svg {
      color: #10141a !important;
      fill: #10141a !important;
    }
    transform: scale(0.97);
  }
  &:focus,
  &:focus-visible {
    outline: none;
    border: 2px solid #00eaff;
    box-shadow: 0 0 0 2.5px #00eaff77, 0 2px 12px 0 #00eaff44;
    background: #00eaff22;
  }
`;

// Menú de configuración (mobile first, apilado)
const Menu = styled.nav`
  width: 100vw;
  max-width: 100vw;
  background: linear-gradient(120deg, rgba(24,29,35,0.82) 80%, rgba(0,234,255,0.08) 100%);
  padding: 0.7rem 0.2rem 0.5rem 0.2rem;
  margin: 10px 0 12px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 0.7rem;
  box-shadow: 0 4px 24px 0 #00eaff33, 0 2px 8px 0 #000c;
  border-bottom: 2.5px solid #00eaff55;
  border-radius: 0;
  opacity: 1;
  pointer-events: auto;
  position: relative;
  z-index: 100;
  animation: menuFadeIn 0.7s cubic-bezier(.22,1.5,.56,1);
  backdrop-filter: blur(6px) saturate(1.2);
  transition: box-shadow 0.25s, background 0.25s, border 0.22s;
  @keyframes menuFadeIn {
    0% { opacity: 0; transform: translateY(-24px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

// Grupo de controles dentro del menú (mobile first)
const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.32rem;
  background: rgba(24,29,35,0.55);
  border-radius: 0;
  padding: 0.22rem 0.32rem 0.18rem 0.32rem;
  border: none;
  box-shadow: 0 1.5px 8px 0 #00eaff11 inset;
  position: relative;
  z-index: 101;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-bottom: 0.18rem;
  border-bottom: 2px solid #00eaff22;
  transition: box-shadow 0.22s, background 0.22s;
  &:hover {
    background: rgba(24,29,35,0.75);
    box-shadow: 0 2.5px 16px 0 #00eaff22 inset, 0 1.5px 8px 0 #00eaff22;
  }
  label {
    color: #b2eaff;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.05rem;
    letter-spacing: 0.01em;
  }
  /* Asegura que todos los inputs/selects/botones hijos no desborden */
  input, select, button {
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

// Sección para agregar progreso (mobile first)
const AddProcessSection = styled.section`
  margin: 12px 0 0.3rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  align-items: stretch;
  width: 100%;
  justify-content: center;
  background: rgba(24,29,35,0.55);
  border-radius: 0;
  box-shadow: 0 1.5px 8px 0 #00eaff11 inset;
  padding: 0.22rem 0.32rem 0.18rem 0.32rem;
  border-bottom: 2px solid #00eaff22;
  transition: box-shadow 0.22s, background 0.22s;
`;

// Input custom para meta y agregar progreso (mobile first)
const Input = styled.input`
  background: rgba(21, 24, 30, 0.85);
  backdrop-filter: blur(2.5px);
  border: 2px solid ${cyan};
  color: #fff;
  border-radius: 0;
  padding: 0.22rem 0.7rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  font-size: 1.05rem;
  font-family: 'Space Grotesk', 'Inter', Arial, sans-serif;
  box-shadow: 0 2px 12px 0 #00eaff22, 0 0.5px 0 #00eaff44;
  margin: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  outline: none;
  transition: border 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.25s cubic-bezier(.4,2,.6,1), color 0.18s;
  &::placeholder {
    color: #b2eaff;
    opacity: 1;
    font-size: 0.98rem;
    font-style: italic;
    letter-spacing: 0.01em;
    transition: color 0.18s;
  }
  &:hover {
    background: rgba(24, 29, 35, 0.95);
    box-shadow: 0 4px 16px 0 #00eaff33, 0 0.5px 0 #00eaff77;
    border-color: #00eaff;
  }
  &:focus {
    border: 2px solid #fff;
    box-shadow: 0 0 0 2.5px #00eaff66, 0 2px 12px 0 #00eaff44;
    background: rgba(24, 29, 35, 1);
    color: #fff;
  }
  animation: inputFadeIn 0.7s cubic-bezier(.22,1.5,.56,1);
  @keyframes inputFadeIn {
    0% { opacity: 0; filter: blur(4px); }
    100% { opacity: 1; filter: blur(0); }
  }
`;

// Select custom para tipo de meta e idioma (mobile first)
const Select = styled.select`
  background: rgba(21, 24, 30, 0.85);
  backdrop-filter: blur(2.5px);
  border: 2px solid ${cyan};
  color: #fff;
  border-radius: 0;
  padding: 0.22rem 0.7rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  font-size: 1.05rem;
  font-family: 'Space Grotesk', 'Inter', Arial, sans-serif;
  box-shadow: 0 2px 12px 0 #00eaff22, 0 0.5px 0 #00eaff44;
  margin: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  outline: none;
  transition: border 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.25s cubic-bezier(.4,2,.6,1), color 0.18s;
  border-radius: 0;
  &:hover {
    background: rgba(24, 29, 35, 0.95);
    box-shadow: 0 4px 16px 0 #00eaff33, 0 0.5px 0 #00eaff77;
    border-color: #00eaff;
  }
  &:focus {
    border: 2px solid #fff;
    box-shadow: 0 0 0 2.5px #00eaff66, 0 2px 12px 0 #00eaff44;
    background: rgba(24, 29, 35, 1);
    color: #fff;
  }
  animation: inputFadeIn 0.7s cubic-bezier(.22,1.5,.56,1);
`;

// Botón custom para agregar progreso y acciones (mobile first)
const Button = styled.button`
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #00eaff 60%, #00b3c6 100%);
  color: #10141a;
  border: none;
  border-radius: 0;
  padding: 0.18rem 0.5rem;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  height: 28px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 0 0 2px #00eaff99, 0 2px 6px 0 #00eaff22;
  margin: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.08s;
  &:hover {
    background: #0e1a1f;
    color: ${cyan};
    box-shadow: 0 0 0 2.5px #00eaff77, 0 2px 8px 0 #00eaff33;
    transform: scale(1.04) translateY(-1px);
  }
  &:active {
    background: #00eaff;
    color: #10141a;
    box-shadow: 0 0 0 2px #00eaff99, 0 1px 2px 0 #00eaff22;
    transform: scale(0.97);
  }
  .ripple {
    position: absolute;
    border-radius: 0;
    transform: scale(0);
    animation: ripple 0.7s cubic-bezier(.4,2,.6,1);
    background: rgba(0,234,255,0.25);
    pointer-events: none;
    left: 50%; top: 50%;
    width: 120%; height: 120%;
    opacity: 0.5;
  }
  @keyframes ripple {
    to {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;

// Panel principal centralizado y animado (mobile first)
const Main = styled.div<{ animate?: boolean; resetAnim?: boolean; completeAnim?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.38rem;
  background: rgba(24,29,35,0.82);
  backdrop-filter: blur(4px);
  border-radius: 0;
  box-shadow: 0 8px 32px 0 #00eaff33, 0 2px 8px 0 #000c;
  padding: 1.1rem 0.6rem 1.1rem 0.6rem;
  border: 1.5px solid ${border};
  opacity: ${({ animate }) => (animate ? 1 : 0)};
  margin: 14px 0 14px 0;
  animation: ${({ animate }) => animate ? 'mainBounceIn 1.1s cubic-bezier(.22,1.5,.56,1) both' : 'none'};
  transition: opacity 0.9s cubic-bezier(.4,2,.6,1), transform 0.9s cubic-bezier(.4,2,.6,1), box-shadow 0.7s cubic-bezier(.4,2,.6,1), background 0.3s;
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
  @keyframes addPulse {
    0% { box-shadow: 0 0 0 0 #00eaff00; }
    40% { box-shadow: 0 0 0 16px #00eaff44; }
    100% { box-shadow: 0 8px 40px 0 #00eaffcc; }
`;

// Título principal (mobile first)
const Title = styled.h1`
  color: ${cyan};
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  letter-spacing: 0.01em;
  text-align: center;
  word-break: break-word;
  hyphens: auto;
  width: 100%;
  padding: 0;
  margin: 10px 0 10px 0;
  text-shadow: 0 2px 8px #00eaff33;
  animation: fadeInTitle 0.7s cubic-bezier(.22,1.5,.56,1);
  @keyframes fadeInTitle {
    0% { opacity: 0; transform: translateY(-16px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

// Botón de reset (ícono, mobile first)
const ResetIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${cyan};
  cursor: pointer;
  padding: 0.18rem;
  margin: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border-radius: 0;
  transition: color 0.18s, transform 0.12s, background 0.18s;
  &:hover {
    color: #fff;
    background: #00eaff22;
    transform: scale(1.15);
  }
  &:active {
    color: ${cyan};
    background: #00eaff11;
    transform: scale(0.95);
  }
`;

// Diálogo de confirmación de reset (mobile first)
const ConfirmDialog = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  margin: 0;
  animation: fadeInDialog 0.5s cubic-bezier(.22,1.5,.56,1);
  @keyframes fadeInDialog {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
`;
const ConfirmBox = styled.div`
  background: linear-gradient(135deg, #181d23 80%, #10141a 100%);
  border: 1.5px solid ${cyan};
  padding: 0.7rem 0.7rem;
  box-shadow: 0 2px 12px 0 #00eaff44;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;
  margin: 0;
  animation: fadeInBox 0.7s cubic-bezier(.22,1.5,.56,1);
  @keyframes fadeInBox {
    0% { opacity: 0; transform: scale(0.95) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
const ConfirmActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.6rem;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
`;

// LightningOverlay y LightningSVG se ocultan completamente en pantallas de 150px
const LightningOverlay = styled.div`
  display: none !important;
`;
const LightningSVG = (props: any) => null;

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
          <ProgressBarWrapper>
            <SmokeProgressBar
              percent={percent}
              label={type === 'currency'
                ? `$${formatValue(current, type, i18n.language)} / $${formatValue(goal, type, i18n.language)}`
                : `${formatValue(current, type, i18n.language)} / ${formatValue(goal, type, i18n.language)}`}
              addAnim={addAnim}
            />
          </ProgressBarWrapper>
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

// Contenedor para la barra de progreso que evita desbordes (mobile first)
const ProgressBarWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24,29,35,0.55);
  border-radius: 0;
  box-shadow: 0 1.5px 8px 0 #00eaff11 inset;
  margin-bottom: 0.18rem;
  padding: 0.18rem 0.18rem 0.12rem 0.18rem;
  transition: box-shadow 0.22s, background 0.22s;
`;
