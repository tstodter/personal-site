const wrapLettersInSpans = (element) => {
  const html = element.innerHTML;
  const parts = html.split('<br>');
  element.innerHTML = '';

  parts.forEach((part, index) => {
    [...part].forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'letter';
      element.appendChild(span);
    });
    
    if (index < parts.length - 1) {
      element.appendChild(document.createElement('br'));
    }
  });
};

// Hardcoded glitch parameters based on your preferred settings
const glitchFrequencyMultiplier = 2.9;
const glitchCountMax = 1;
const glitchDurationMultiplier = 0.6;
let nextGlitchTimeout;

const triggerGlitch = (letters) => {
  // Pick 1-3 random letters to glitch simultaneously
  const numGlitches = Math.floor(Math.random() * glitchCountMax) + 1;
  const availableLetters = [...letters];
  
  for (let i = 0; i < numGlitches && availableLetters.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const randomLetter = availableLetters.splice(randomIndex, 1)[0];
    
    // Choose random glitch variant
    const glitchTypes = ['glitch', 'glitch-2', 'glitch-3'];
    const randomGlitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
    
    randomLetter.classList.add(randomGlitch);
    
    // Use hardcoded duration multiplier
    const baseDuration = randomGlitch === 'glitch-3' ? 400 : 
                       randomGlitch === 'glitch' ? 600 : 800;
    const adjustedDuration = baseDuration * glitchDurationMultiplier;
    
    // Update animation duration
    randomLetter.style.animationDuration = `${adjustedDuration}ms`;
    
    setTimeout(() => {
      randomLetter.classList.remove(randomGlitch);
      randomLetter.style.animationDuration = '';
    }, adjustedDuration);
  }
};

const scheduleNextGlitch = (letters) => {
  const baseDelay = Math.random() * 640 + 160;
  const adjustedDelay = baseDelay * glitchFrequencyMultiplier;
  
  nextGlitchTimeout = setTimeout(() => {
    triggerGlitch(letters);
    scheduleNextGlitch(letters);
  }, adjustedDelay);
};

export const startGlitchAnimation = () => {
  const nameHeader = document.getElementById('nameHeader');
  if (!nameHeader) {
    console.error('Name header element not found');
    return;
  }
  
  // Check if letters are already wrapped to prevent duplication
  if (nameHeader.querySelector('.letter')) {
    console.log('Letters already wrapped, skipping...');
    return;
  }
  
  wrapLettersInSpans(nameHeader);
  
  const letters = nameHeader.querySelectorAll('.letter');
  if (letters.length === 0) {
    console.error('No letter elements found');
    return;
  }
  
  // Start first glitch after 400ms
  setTimeout(() => {
    triggerGlitch(letters);
    scheduleNextGlitch(letters);
  }, 400);
};