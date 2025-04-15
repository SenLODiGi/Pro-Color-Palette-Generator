let particlesConfig = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#000000' },
      shape: { type: 'circle' },
      opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: '#000000', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  };
  
  particlesJS('particles-js', particlesConfig);
  
  function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    body.classList.toggle('light', !isDark);
  
    particlesConfig.particles.color.value = isDark ? '#ffffff' : '#000000';
    particlesConfig.particles.line_linked.color = isDark ? '#ffffff' : '#000000';
    particlesJS('particles-js', particlesConfig);
  }
  
  function showToast(message) {
    const toastEl = document.querySelector('.toast');
    toastEl.querySelector('.toast-body').textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
  
  function subscribe() {
    const email = document.getElementById('subscribe-email').value;
    if (email) {
      showToast('Thank you for subscribing!');
      document.getElementById('subscribe-email').value = '';
    } else {
      showToast('Please enter a valid email address.');
    }
  }
  
  function isValidHex(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  }
  
  function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  
  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
  }
  
  function rgbToHSL(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  
  function hslToRGB(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }
  
  function generateRandomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
  
  function generateShades(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const shades = [];
    for (let i = 0.8; i >= 0.2; i -= 0.2) {
      const newR = Math.min(255, Math.round(r * i));
      const newG = Math.min(255, Math.round(g * i));
      const newB = Math.min(255, Math.round(b * i));
      shades.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    return shades;
  }
  
  function applyHarmony(baseColor, mode) {
    const { r, g, b } = hexToRGB(baseColor);
    const { h, s, l } = rgbToHSL(r, g, b);
    const colors = [baseColor];
  
    if (mode === 'complementary') {
      const compH = (h + 180) % 360;
      const { r: r1, g: g1, b: b1 } = hslToRGB(compH, s, l);
      colors.push(rgbToHex(r1, g1, b1));
      colors.push(generateRandomHex());
      colors.push(generateRandomHex());
      colors.push(generateRandomHex());
    } else if (mode === 'analogous') {
      const angles = [-30, 30, -60, 60];
      angles.forEach(angle => {
        const newH = (h + angle + 360) % 360;
        const { r: r1, g: g1, b: b1 } = hslToRGB(newH, s, l);
        colors.push(rgbToHex(r1, g1, b1));
      });
    } else if (mode === 'triadic') {
      const angles = [120, 240];
      angles.forEach(angle => {
        const newH = (h + angle) % 360;
        const { r: r1, g: g1, b: b1 } = hslToRGB(newH, s, l);
        colors.push(rgbToHex(r1, g1, b1));
      });
      colors.push(generateRandomHex());
      colors.push(generateRandomHex());
    }
    return colors.slice(0, 5);
  }
  
  function simulateProtanopia(r, g, b) {
    return {
      r: 0.56667 * r + 0.43333 * g,
      g: 0.55833 * r + 0.44167 * g,
      b: b
    };
  }
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Color copied to clipboard!');
    });
  }
  
  function createColorBox(color, isColorBlind = false) {
    const col = document.createElement('div');
    col.className = 'col fade-in';
  
    const card = document.createElement('div');
    card.className = 'color-box';
    card.style.backgroundColor = color;
  
    const cardBody = document.createElement('div');
    cardBody.className = 'p-3 text-center color-card';
  
    const colorText = document.createElement('h6');
    colorText.className = 'mb-3';
    colorText.textContent = color.toUpperCase();
  
    const shades = generateShades(color);
    const shadeContainer = document.createElement('div');
    shadeContainer.className = 'mb-3';
    shades.forEach(shade => {
      const shadeDiv = document.createElement('div');
      shadeDiv.style.backgroundColor = shade;
      shadeDiv.className = 'w-100 h-4 mb-1 rounded';
      shadeContainer.appendChild(shadeDiv);
    });
  
    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-sm btn-ash';
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(color);
  
    cardBody.appendChild(colorText);
    cardBody.appendChild(shadeContainer);
    cardBody.appendChild(copyButton);
    card.appendChild(cardBody);
    col.appendChild(card);
    return col;
  }
  
  function generatePalette() {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
    const harmonyMode = document.getElementById('harmony-mode').value;
  
    let colors = [];
    for (let i = 1; i <= 5; i++) {
      const color = document.getElementById(`color${i}`).value.trim();
      if (!isValidHex(color)) {
        showToast(`Color ${i} is not a valid hex code!`);
        return;
      }
      colors.push(color);
    }
  
    if (harmonyMode !== 'none') {
      colors = applyHarmony(colors[0], harmonyMode);
      for (let i = 1; i <= 5; i++) {
        document.getElementById(`color${i}`).value = colors[i - 1];
      }
    }
  
    colors.forEach(color => {
      palette.appendChild(createColorBox(color));
    });
  }
  
  function generateRandomPalette() {
    for (let i = 1; i <= 5; i++) {
      document.getElementById(`color${i}`).value = generateRandomHex();
    }
    generatePalette();
  }
  
  async function extractColorsFromImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pixels = [];
    for (let i = 0; i < imageData.length; i += 4) {
      pixels.push({
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2]
      });
    }
  
    const sampledPixels = pixels.filter(() => Math.random() < 0.1);
  
    const model = await tf.loadLayersModel('https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/4', { fromTFHub: true });
  
    const imgTensor = tf.browser.fromPixels(canvas).resizeBilinear([224, 224]).toFloat();
    const normalized = imgTensor.div(255.0).expandDims();
  
    const features = model.predict(normalized);
    const featureArray = await features.array();
  
    const k = 5;
    const centroids = sampledPixels.slice(0, k).map(p => ({ r: p.r, g: p.g, b: p.b }));
    let clusters = new Array(sampledPixels.length).fill(0);
  
    for (let iter = 0; iter < 10; iter++) {
      clusters = sampledPixels.map(pixel => {
        let minDist = Infinity, cluster = 0;
        centroids.forEach((centroid, i) => {
          const dist = Math.sqrt(
            (pixel.r - centroid.r) ** 2 +
            (pixel.g - centroid.g) ** 2 +
            (pixel.b - centroid.b) ** 2
          );
          if (dist < minDist) {
            minDist = dist;
            cluster = i;
          }
        });
        return cluster;
      });
  
      centroids.forEach((centroid, i) => {
        const clusterPixels = sampledPixels.filter((_, idx) => clusters[idx] === i);
        if (clusterPixels.length > 0) {
          const avg = clusterPixels.reduce(
            (acc, p) => ({
              r: acc.r + p.r / clusterPixels.length,
              g: acc.g + p.g / clusterPixels.length,
              b: acc.b + p.b / clusterPixels.length
            }),
            { r: 0, g: 0, b: 0 }
          );
          centroid.r = Math.round(avg.r);
          centroid.g = Math.round(avg.g);
          centroid.b = Math.round(avg.b);
        }
      });
    }
  
    return centroids.map(c => rgbToHex(c.r, c.g, c.b));
  }
  
  function exportToPNG() {
    const colors = [];
    for (let i = 1; i <= 5; i++) {
      colors.push(document.getElementById(`color${i}`).value.trim());
    }
  
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 100;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
  
    const stripWidth = canvas.width / colors.length;
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * stripWidth, 0, stripWidth, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(color.toUpperCase(), index * stripWidth + stripWidth / 2, canvas.height - 10);
    });
  
    try {
      const link = document.createElement('a');
      link.download = 'color-palette.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Palette exported as PNG!');
    } catch (error) {
      showToast('Failed to export PNG: ' + error.message);
    } finally {
      document.body.removeChild(canvas);
    }
  }
  
  function exportToJSON() {
    const colors = [];
    for (let i = 1; i <= 5; i++) {
      colors.push(document.getElementById(`color${i}`).value.trim());
    }
    const json = JSON.stringify({ palette: colors }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    showToast('Palette exported as JSON!');
  }
  
  function simulateColorBlindness() {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
  
    for (let i = 1; i <= 5; i++) {
      const color = document.getElementById(`color${i}`).value.trim();
      const { r, g, b } = hexToRGB(color);
      const { r: rBlind, g: gBlind, b: bBlind } = simulateProtanopia(r, g, b);
      const blindColor = rgbToHex(Math.round(rBlind), Math.round(gBlind), Math.round(bBlind));
      palette.appendChild(createColorBox(blindColor, true));
    }
    showToast('Color blindness simulation applied!');
  }
  
  document.getElementById('image-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const preview = document.getElementById('image-preview');
          preview.src = e.target.result;
          preview.style.display = 'block';
  
          extractColorsFromImage(img).then(colors => {
            for (let i = 1; i <= 5; i++) {
              document.getElementById(`color${i}`).value = colors[i - 1] || generateRandomHex();
            }
            generatePalette();
            showToast('Colors extracted from image using AI!');
          }).catch(err => {
            showToast('Error extracting colors: ' + err.message);
            for (let i = 1; i <= 5; i++) {
              document.getElementById(`color${i}`).value = generateRandomHex();
            }
            generatePalette();
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    generateRandomPalette();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  });