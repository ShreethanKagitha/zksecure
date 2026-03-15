const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// Colors
css = css.replace(/#000000/g, '#050505');
css = css.replace(/#00d2ff/g, '#dc2626');
css = css.replace(/#b026ff/g, '#991b1b');
css = css.replace(/#00ffff/g, '#ff4d4d');
css = css.replace(/rgba\(0, 210, 255,/g, 'rgba(220, 38, 38,');
css = css.replace(/rgba\(176, 38, 255,/g, 'rgba(153, 27, 27,');
css = css.replace(/#a5f3fc/g, '#ffb3b3');
css = css.replace(/#d8b4fe/g, '#dc2626');
css = css.replace(/#00e5ff/g, '#ef4444');
css = css.replace(/#d97efe/g, '#b91c1c');
css = css.replace(/rgba\(9, 9, 11, 0\.6\)/g, 'rgba(15, 5, 5, 0.6)'); // adjust dark background
css = css.replace(/rgba\(0, 102, 255, 0\.8\)/g, 'rgba(139, 0, 0, 0.6)');

// Text Glow (from cyan to red)
css = css.replace(/text-shadow: 0 0 30px rgba\(220, 38, 38, 0\.2\);/g, 'text-shadow: 0 0 30px rgba(220, 38, 38, 0.4);');

// Glass card replacement 
// using string replace to be safe
css = css.replace('.glass-card {\n  background: var(--card-bg);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border: 1px solid var(--glass-border);\n  border-radius: 20px;\n  padding: 3rem;\n  box-shadow: \n    0 20px 50px rgba(0, 0, 0, 0.5),\n    inset 0 1px 1px rgba(255, 255, 255, 0.05);\n  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);\n}', 
`.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    inset 0 0 20px rgba(220, 38, 38, 0.02);
  position: relative;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  border-radius: 20px 20px 0 0;
}`);

// Glass card hover
css = css.replace('.glass-card:hover {\n  background: rgba(20, 20, 20, 0.8);\n  border-color: rgba(220, 38, 38, 0.4);\n  transform: translateY(-4px);\n  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(153, 27, 27, 0.15);\n}', 
`.glass-card:hover {
  background: rgba(20, 10, 10, 0.8);
  border-color: var(--primary-glow);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px var(--primary-glow);
}`);

// Noise overlay and ambient glow
css = css.replace(`.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://grainy-gradients.vercel.app/noise.svg');
  opacity: 0.05;
  pointer-events: none;
  z-index: 10;
}`, 
`.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://grainy-gradients.vercel.app/noise.svg');
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 10;
}

.ambient-hero-glow {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 60vw;
  height: 60vh;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
  animation: pulseGlow 8s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  0% { opacity: 0.6; transform: translateX(-50%) scale(0.9); }
  100% { opacity: 1; transform: translateX(-50%) scale(1.1); }
}`);

// Buttons
css = css.replace(`.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3), 0 0 25px rgba(153, 27, 27, 0.2), inset 0 1px 0 rgba(255,255,255,0.3);
  border-color: rgba(255, 255, 255, 0.3);
  filter: brightness(1.1);
}`, 
`.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4), 0 0 25px rgba(153, 27, 27, 0.3), inset 0 1px 0 rgba(255,255,255,0.3);
  border-color: rgba(255, 255, 255, 0.3);
  filter: brightness(1.1);
}`);

fs.writeFileSync('src/index.css', css);

let heroParams = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Change specific color matches
heroParams = heroParams.replace(/rgba\(0, 210, 255,/g, 'rgba(220, 38, 38,');
heroParams = heroParams.replace(/rgba\(14, 165, 233, 0\.1\)/g, 'rgba(153, 27, 27, 0.1)'); // lock box
heroParams = heroParams.replace(/rgba\(163, 230, 53, 0\.1\)/g, 'rgba(255, 77, 77, 0.1)'); // globe box
heroParams = heroParams.replace(/'#f59e0b'/g, "'#ff4d4d'"); // other colors

// Add ambient glow to the first section
heroParams = heroParams.replace(`<section className="text-center animate-in" style={{ padding: '6rem 0 4rem 0' }}>`, 
`<section className="text-center animate-in" style={{ padding: '6rem 0 4rem 0', position: 'relative' }}>
        <div className="ambient-hero-glow"></div>`);

fs.writeFileSync('src/components/Hero.tsx', heroParams);

console.log('Update Complete');
