(function() {
    'use strict';

    const bgContainer = document.createElement('div');
    bgContainer.id = 'pizza-background';
    bgContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.insertBefore(bgContainer, document.body.firstChild);
    

    const config = {
        count: 35,
        imagePath: './assets/pizza.png',
        minSize: 40,
        maxSize: 80,
        minOpacity: 0.25,
        maxOpacity: 0.52,
        minDuration: 20,
        maxDuration: 45
    };


    const animations = [
        {
            name: 'float1',
            keyframes: `
                @keyframes float1 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(80px, -40px) rotate(90deg); }
                    50% { transform: translate(40px, 40px) rotate(180deg); }
                    75% { transform: translate(-60px, 20px) rotate(270deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `
        },
        {
            name: 'diagonal',
            keyframes: `
                @keyframes diagonal {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: var(--pizza-opacity); }
                    90% { opacity: var(--pizza-opacity); }
                    100% { transform: translate(200px, 200px) rotate(360deg); opacity: 0; }
                }
            `
        },
        {
            name: 'circle',
            keyframes: `
                @keyframes circle {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(100px, 100px) rotate(90deg); }
                    50% { transform: translate(0, 200px) rotate(180deg); }
                    75% { transform: translate(-100px, 100px) rotate(270deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `
        },
        {
            name: 'wave',
            keyframes: `
                @keyframes wave {
                    0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
                    25% { transform: translateY(-60px) translateX(30px) rotate(90deg); }
                    50% { transform: translateY(0) translateX(60px) rotate(180deg); }
                    75% { transform: translateY(60px) translateX(30px) rotate(270deg); }
                }
            `
        },
        {
            name: 'spiral',
            keyframes: `
                @keyframes spiral {
                    0% { transform: translate(0, 0) rotate(0deg) scale(0.8); }
                    50% { transform: translate(120px, 120px) rotate(540deg) scale(1.2); }
                    100% { transform: translate(0, 200px) rotate(1080deg) scale(0.8); }
                }
            `
        },
        {
            name: 'bounce',
            keyframes: `
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-120px) rotate(180deg); }
                }
            `
        }
    ];


    const styleSheet = document.createElement('style');
    styleSheet.textContent = animations.map(a => a.keyframes).join('\n');
    document.head.appendChild(styleSheet);


    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(random(min, max));
    }

    function createPizza() {
        const pizza = document.createElement('img');
        pizza.src = config.imagePath;
        pizza.style.cssText = 'position: absolute; will-change: transform;';
        

        const size = randomInt(config.minSize, config.maxSize);
        pizza.style.width = `${size}px`;
        pizza.style.height = `${size}px`;
        

        pizza.style.left = `${random(0, 100)}%`;
        pizza.style.top = `${random(0, 100)}%`;

        const opacity = random(config.minOpacity, config.maxOpacity);
        pizza.style.opacity = opacity;
        pizza.style.setProperty('--pizza-opacity', opacity);
        

        const animType = animations[randomInt(0, animations.length)];
        pizza.style.animation = `${animType.name} ${random(config.minDuration, config.maxDuration)}s ease-in-out infinite`;
        

        pizza.style.animationDelay = `${random(0, 10)}s`;
        
        return pizza;
    }

    function init() {
        for (let i = 0; i < config.count; i++) {
            const pizza = createPizza();
            bgContainer.appendChild(pizza);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.PizzaBackground = {
        addPizza: function() {
            bgContainer.appendChild(createPizza());
        },
        clear: function() {
            bgContainer.innerHTML = '';
        },
        setCount: function(count) {
            this.clear();
            config.count = count;
            init();
        }
    };

})();