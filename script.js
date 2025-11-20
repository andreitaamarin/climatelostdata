document.addEventListener('DOMContentLoaded', () => {
    const graph = document.getElementById('data-graph');
    const NUM_POINTS = 60;
    let points = [];

    const audio = document.getElementById('weather-audio');

    function playGlitchSound() {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = 'sawtooth'; 
        oscillator.frequency.setValueAtTime(Math.random() * 500 + 500, context.currentTime); 
        
        gainNode.gain.setValueAtTime(0.5, context.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05); 

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.05);
    }

    document.body.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            audio.play().catch(e => console.log("Audio no pudo iniciar."));
        }
    }, { once: true }); 

    function createPoints() {
        for (let i = 0; i < NUM_POINTS; i++) {
            const point = document.createElement('div');
            point.classList.add('data-point');
            point.classList.add(i % 2 === 0 ? 'point-cyan' : 'point-magenta');
            
            const x = Math.random() * (graph.clientWidth - 10);
            const y = Math.random() * (graph.clientHeight - 10);
            
            point.style.left = `${x}px`;
            point.style.top = `${y}px`;

            points.push({
                element: point,
                x: x,
                y: y,
                originalX: x,
                originalY: y
            });
            graph.appendChild(point);
        }
    }

    function induceInstability() {
        playGlitchSound(); 

        points.forEach(p => {
            const disturbance = (Math.random() - 0.5) * 6; 
            
            p.element.style.transform = `translate(${disturbance}px, ${disturbance}px)`;

            if (Math.random() < 0.1) {
                p.originalX = Math.random() * (graph.clientWidth - 10);
                p.originalY = Math.random() * (graph.clientHeight - 10);
            }
        });

        setTimeout(() => {
            points.forEach(p => {
                p.element.style.transform = 'translate(0, 0)';
            });
        }, 100);
    }

    setInterval(induceInstability, 3500); 

    const cursorColor = '#00FFFF'; 
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const trail = document.createElement('div');
        trail.style.position = 'absolute';
        trail.style.width = '12px';
        trail.style.height = '12px';
        trail.style.backgroundColor = cursorColor;
        trail.style.left = `${mouseX}px`;
        trail.style.top = `${mouseY}px`;
        trail.style.zIndex = 1000;
        document.body.appendChild(trail);

        const trailDuration = 200; 
        setTimeout(() => {
            trail.style.transition = `opacity ${trailDuration}ms, transform ${trailDuration}ms`;
            trail.style.opacity = 0;
            trail.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                trail.remove();
            }, trailDuration);
        }, 50); 
    });


    function updateGraph() {
        const graphRect = graph.getBoundingClientRect(); 
        const REPULSION_RADIUS = 80; 

        points.forEach(p => {
            const pointX_Screen = graphRect.left + p.x;
            const pointY_Screen = graphRect.top + p.y;
            
            const dx = pointX_Screen - mouseX;
            const dy = pointY_Screen - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < REPULSION_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                
                const newX = p.x + Math.cos(angle) * force * 15; 
                const newY = p.y + Math.sin(angle) * force * 15; 

                p.x = Math.max(0, Math.min(graph.clientWidth - 10, newX));
                p.y = Math.max(0, Math.min(graph.clientHeight - 10, newY));
                
                p.element.style.left = `${p.x}px`;
                p.element.style.top = `${p.y}px`;

            } else {
                p.x += (p.originalX - p.x) * 0.05;
                p.y += (p.originalY - p.y) * 0.05;

                p.element.style.left = `${p.x}px`;
                p.element.style.top = `${p.y}px`;
            }
        });

        requestAnimationFrame(updateGraph);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'R' || e.key === 'r') {
            e.preventDefault();

            const systemMessage = document.createElement('div');
            systemMessage.textContent = "SISTEMA: CORRIGIENDO... [FALLO]";
            systemMessage.style.position = 'fixed';
            systemMessage.style.top = '50%';
            systemMessage.style.left = '50%';
            systemMessage.style.transform = 'translate(-50%, -50%)';
            systemMessage.style.fontSize = '3em';
            systemMessage.style.color = 'var(--color-magenta)';
            systemMessage.style.zIndex = '2000';
            document.body.appendChild(systemMessage);

            points.forEach((p, index) => {
                const gridCols = 12;
                const gridRow = Math.floor(index / gridCols);
                const gridCol = index % gridCols;

                const gridX = (graph.clientWidth / gridCols) * gridCol + 15;
                const gridY = (graph.clientHeight / 5) * gridRow + 15;

                p.element.style.left = `${gridX}px`;
                p.element.style.top = `${gridY}px`;
                p.element.style.transition = 'left 0.1s, top 0.1s'; 
            });

            setTimeout(() => {
                systemMessage.remove();

                points.forEach(p => {
                    p.element.style.transition = 'none'; 
                });
            }, 500); 
        }
    });


    createPoints();
    requestAnimationFrame(updateGraph);
});