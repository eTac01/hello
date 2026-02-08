/**
 * SmoothCursor.js
 * A custom cursor that smoothly follows the mouse using linear interpolation.
 */
export default class SmoothCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');

        // Create cursor if it doesn't exist
        if (!this.cursor) {
            this.cursor = document.createElement('div');
            this.cursor.id = 'cursor';
            document.body.appendChild(this.cursor);
        }

        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.speed = 0.15; // Lower = smoother/slower

        this.init();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Add active states
        document.addEventListener('mousedown', () => this.cursor.classList.add('active'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('active'));

        // Add hover states for interactive elements
        this.setupHoverListeners();

        // Start render loop
        this.render();
    }

    setupHoverListeners() {
        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.interactive') ||
                e.target.closest('.capsule-container') ||
                e.target.closest('.clickable')) {
                this.cursor.classList.add('hover');
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.interactive') ||
                e.target.closest('.capsule-container') ||
                e.target.closest('.clickable')) {
                this.cursor.classList.remove('hover');
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
    }

    render() {
        // Linear interpolation
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        // Apply position
        // Using transform is more performant than top/left
        this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
}
