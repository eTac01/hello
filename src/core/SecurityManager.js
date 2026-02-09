/**
 * SecurityManager — Anti-Screenshot & Content Protection
 * Implements deterrents to prevent content capture
 */

class SecurityManager {
    constructor() {
        this.isProtected = false;
        this.overlay = null;
        this.init();
    }

    init() {
        if (this.isProtected) return;

        this.createProtectionOverlay();
        this.disableContextMenu();
        this.disableDragAndSelect();
        this.setupKeyboardDetection();
        this.setupVisibilityChange();

        // Log initialization (discreetly)
        console.log('%c Security Layer Active ', 'background: #222; color: #bada55');

        this.isProtected = true;
    }

    /**
     * Create the overlay used to hide content during screenshot attempts
     */
    createProtectionOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'security-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 99999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-family: sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 14px;
        `;
        this.overlay.innerHTML = '<div>Protected Content</div>';
        document.body.appendChild(this.overlay);
    }

    /**
     * Disable Right-Click Context Menu
     */
    disableContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Disable Dragging and Text Selection
     */
    disableDragAndSelect() {
        // CSS injection for selection
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            body {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            img {
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                pointer-events: none; /* Prevents right-click on images often */
            }
        `;
        document.head.appendChild(style);

        // Event listeners as backup
        document.addEventListener('dragstart', (e) => e.preventDefault());
        document.addEventListener('selectstart', (e) => e.preventDefault());
    }

    /**
     * Detect Screenshot Keys
     */
    setupKeyboardDetection() {
        window.addEventListener('keydown', (e) => {
            // PrintScreen
            if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
                this.triggerProtection('PrintScreen');
            }

            // Windows + Shift + S
            if (e.shiftKey && e.metaKey && (e.key === 's' || e.key === 'S')) {
                this.triggerProtection('Win+Shift+S');
            }

            // Mac Cmd + Shift + 3/4 (Browser usually captures this, but we try)
            if (e.shiftKey && e.metaKey && (e.key === '3' || e.key === '4')) {
                this.triggerProtection('Cmd+Shift+3/4');
            }

            // Ctrl + P (Print)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                this.triggerProtection('Print');
                e.preventDefault();
            }
        });

        // Listen for keyup to clear protection (optional, but timeout is safer)
        window.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
                setTimeout(() => this.clearProtection(), 500);
            }
        });
    }

    /**
     * Handle Visibility Change (Tab Switch / Minimized)
     * Some users screenshot by switching windows
     */
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.overlay.style.opacity = '1';
            } else {
                setTimeout(() => {
                    this.overlay.style.opacity = '0';
                }, 200);
            }
        });

        // Blur/Focus (Window focus)
        window.addEventListener('blur', () => {
            this.overlay.style.opacity = '1';
        });

        window.addEventListener('focus', () => {
            setTimeout(() => {
                this.overlay.style.opacity = '0';
            }, 200);
        });
    }

    /**
     * Trigger Protection (Blackout)
     */
    triggerProtection(reason) {
        // console.log('Protection triggered:', reason); 
        this.overlay.style.opacity = '1';

        // Clear after a delay
        if (this.protectionTimeout) clearTimeout(this.protectionTimeout);
        this.protectionTimeout = setTimeout(() => {
            this.clearProtection();
        }, 1000); // 1 second blackout
    }

    clearProtection() {
        this.overlay.style.opacity = '0';
    }
}

// Singleton export
export const securityManager = new SecurityManager();
export default SecurityManager;
