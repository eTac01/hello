/**
 * smooth-cursor.js
 * Standalone smooth cursor for static pages.
 */
(function () {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    // Initial styles to ensure visibility if not loaded from CSS
    // We defer to external CSS for the look, but ensure positioning is set up
    cursor.style.position = 'fixed';
    cursor.style.top = '0';
    cursor.style.left = '0';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    // We update via transform, so initial top/left 0 is fine

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const speed = 0.15;

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Immediate update for native-like responsiveness on very first move if needed
        // but lerp handles it well.
    });

    // Active state
    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    // Hover state
    const handleMouseOver = (e) => {
        const target = e.target;
        if (target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.closest('.interactive') ||
            target.closest('.clickable') ||
            target.onclick ||
            window.getComputedStyle(target).cursor === 'pointer') {
            cursor.classList.add('hover');
        }
    };

    const handleMouseOut = (e) => {
        const target = e.target;
        if (target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.closest('.interactive') ||
            target.closest('.clickable') ||
            target.onclick ||
            window.getComputedStyle(target).cursor === 'pointer') {
            cursor.classList.remove('hover');
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Animation loop
    function render() {
        pos.x += (mouse.x - pos.x) * speed;
        pos.y += (mouse.y - pos.y) * speed;

        // Apply position
        // We center the cursor by subtracting half its width/height
        // But since width/height might change (hover), strictly we translate the top-left point
        // and CSS handles the centering via `transform: translate(-50%, -50%)` inside the class
        // BUT here we are setting the transform on the element itself which overwrites CSS transform.
        // So we need to include the centering in our JS or use a wrapper.
        // A better approach for this simple script:
        // Set left/top in JS? No, performance.
        // Set transform: translate(x, y) AND use margin-left/top in CSS to center?
        // OR: translate(x - width/2, y - height/2) -- checking offsetWidth every frame is bad.

        // BEST APPROACH:
        // CSS: #cursor { transform: translate(-50%, -50%); ... }
        // JS: cursor.style.left = pos.x + 'px'; cursor.style.top = pos.y + 'px';
        // Wait, earlier I said "Using transform is more performant".
        // If we use transform here, we overwrite the CSS `translate(-50%, -50%)`.
        // So we should do: cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(render);
    }

    render();
})();
