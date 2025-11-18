document.addEventListener('DOMContentLoaded', () => {
    const graph = document.getElementById('data-graph');
    const NUM_POINTS = 60;
    let points = [];

    // --- A. Generación Inicial de Puntos ---
    function createPoints() {
        for (let i = 0; i < NUM_POINTS; i++) {
            const point = document.createElement('div');
            point.classList.add('data-point');
            // Alterna los colores Cian y Magenta
            point.classList.add(i % 2 === 0 ? 'point-cyan' : 'point-magenta');
            
            // Posición inicial aleatoria dentro del contenedor del gráfico
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

    // --- B. Función de Inestabilidad (Gráfico Vibrante) ---
    function induceInstability() {
        points.forEach(p => {
            const disturbance = (Math.random() - 0.5) * 6; // Desplazamiento aleatorio de -3 a 3 píxeles
            
            // Aplica la vibración
            p.element.style.transform = `translate(${disturbance}px, ${disturbance}px)`;

            // Reordena un pequeño subconjunto de puntos de vez en cuando (efecto Glitch)
            if (Math.random() < 0.1) {
                const newX = Math.random() * (graph.clientWidth - 10);
                const newY = Math.random() * (graph.clientHeight - 10);
                p.element.style.left = `${newX}px`;
                p.element.style.top = `${newY}px`;
                p.x = newX;
                p.y = newY;
            }
        });

        // Restablece la vibración después de un breve momento
        setTimeout(() => {
            points.forEach(p => {
                p.element.style.transform = 'translate(0, 0)';
            });
        }, 100);
    }

    // Ejecuta la inestabilidad cada 3-5 segundos
    setInterval(induceInstability, 3500); 


    // --- C. Cursor con Rastro de Píxeles ---
    const cursorColor = '#00FFFF'; // Color Cian para el cursor

    document.addEventListener('mousemove', (e) => {
        // Crear el rastro (el cuadrado que desaparece)
        const trail = document.createElement('div');
        trail.style.position = 'absolute';
        trail.style.width = '12px';
        trail.style.height = '12px';
        trail.style.backgroundColor = cursorColor;
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        trail.style.zIndex = 1000;
        document.body.appendChild(trail);

        // Hace que el rastro desaparezca rápidamente
        trail.style.opacity = 1;
        const trailDuration = 200; // ms
        
        setTimeout(() => {
            trail.style.transition = `opacity ${trailDuration}ms, transform ${trailDuration}ms`;
            trail.style.opacity = 0;
            trail.style.transform = 'scale(0.5)'; // Encogerlo un poco al desaparecer
            
            // Eliminar del DOM después de la transición
            setTimeout(() => {
                trail.remove();
            }, trailDuration);
        }, 50); // Pequeño retraso para que se vea el rastro

        // Crear el cursor principal (el cuadrado persistente)
        // Usaremos el cursor CSS si lo tenemos, o un elemento persistente.
        // Para simplicidad inicial, el "cursor" es el rastro constante.
    });

    // Inicia el proyecto
    createPoints();
});