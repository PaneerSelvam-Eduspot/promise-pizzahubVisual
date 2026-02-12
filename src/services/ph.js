export class PizzaUi {
    #orderCancelled = false;
    static STAGES = ['placed', 'preparing', 'baking', 'delivery'];
    static STATUS = {
        ACTIVE: 'active',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    }
    constructor() {
        this.consoleOutput = document.getElementById('console-output');
        if (!this.consoleOutput) {
            throw new Error("Console element not found");
        }   
    }

    updateStage(stage, status, data = null) {
           const { ACTIVE, COMPLETED, CANCELLED } = PizzaUi.STATUS;
           const stageEl = document.querySelector(`[data-stage="${stage}"]`);
        
           if(stageEl) {
            stageEl.classList.remove(ACTIVE, COMPLETED, CANCELLED);
            if (status === ACTIVE) stageEl.classList.add(ACTIVE);
            if (status === COMPLETED) stageEl.classList.add(COMPLETED);
            if (status === CANCELLED) stageEl.classList.add(CANCELLED);

            if (data) {
                const dataEl = document.getElementById(`data-${stage}`);
                if (dataEl) {
                    dataEl.textContent = JSON.stringify(data, null, 2);
                }
            }
            const stageList = document.querySelector('.stages-list')
            stageList.scrollTop = stageList.scrollHeight;
        }
    }
    
    logToConsole(message, state = null) {
        const line = document.createElement('div');
        line.className = `console-line ${state || ''}`;

        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const textSpan = document.createElement('span');
        textSpan.textContent = `[${time}] ${message}`;
        
        line.appendChild(textSpan);
        
        if (state === 'pending') {
            const loader = document.createElement('div')
            loader.className = 'loader'
            line.appendChild(loader);
        } else if (state === 'fulfilled') {
            const checkmark = this.createCheckmarkSVG();
            line.appendChild(checkmark);
        } else if (state === 'rejected') {
            const crossmark = this.createCrossmarkSVG();
            line.appendChild(crossmark);
        }

        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    resetStages() {
        document.querySelectorAll('.stage-item').forEach(s => {
            const { ACTIVE, COMPLETED, CANCELLED } = PizzaUi.STATUS;
            s.classList.remove(ACTIVE, COMPLETED, CANCELLED);
        });
        PizzaUi.STAGES.forEach(stage => {
            const dataEl = document.getElementById(`data-${stage}`);
            if(dataEl) dataEl.textContent = '';
        });
    }


    createCheckmarkSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'checkmark');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 52 52');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'checkmark__circle');
        circle.setAttribute('cx', '26');
        circle.setAttribute('cy', '26');
        circle.setAttribute('r', '25');
        circle.setAttribute('fill', 'none');

        const check = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        check.setAttribute('class', 'checkmark__check');
        check.setAttribute('fill', 'none');
        check.setAttribute('d', 'M14.1 27.2l7.1 7.2 16.7-16.8');

        svg.appendChild(circle);
        svg.appendChild(check);

        return svg;
    }

    createCrossmarkSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'crossmark');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 52 52');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'crossmark__circle');
        circle.setAttribute('cx', '26');
        circle.setAttribute('cy', '26');
        circle.setAttribute('r', '25');
        circle.setAttribute('fill', 'none');

        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line1.setAttribute('class', 'crossmark__cross');
        line1.setAttribute('fill', 'none');
        line1.setAttribute('d', 'M16 16 l20 20');

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line2.setAttribute('class', 'crossmark__cross');
        line2.setAttribute('fill', 'none');
        line2.setAttribute('d', 'M36 16 l-20 20');

        svg.appendChild(circle);
        svg.appendChild(line1);
        svg.appendChild(line2);

        return svg;
    }

    cancelAllStages(currentStage = null) {
        const currentIndex = currentStage ? PizzaUi.STAGES.indexOf(currentStage) : -1;

        PizzaUi.STAGES.forEach((stage, index) => {
            setTimeout(() => {
                  const stageEl = document.querySelector(`[data-stage="${stage}"]`);
                  const { ACTIVE, COMPLETED, CANCELLED } = PizzaUi.STATUS;
                if(stageEl) {
                    stageEl.classList.remove(ACTIVE, COMPLETED);
                    stageEl.classList.add(CANCELLED);

                    const dataEl = document.getElementById(`data-${stage}`);

                    if(dataEl) {
                        if (index === currentIndex) {
                            dataEl.textContent = 'CANCELLED AT THIS STAGE';
                        } else if (index < currentIndex) {
                            dataEl.textContent = 'CANCELLED!'
                        } else {
                            dataEl.textContent = 'NOT EXECUTED';
                        } 
                    }
                }
            }, index * 150);
        });

        const cancelMessage = currentStage
            ? `ORDER CANCELLED AT STAGE: ${currentStage.toUpperCase()}`
            : `ORDER CANCELLED BY USER`;
        this.logToConsole(cancelMessage, 'rejected');
    }

    clearConsole() {
        this.consoleOutput.innerHTML = '<div class="console-line">// Console cleared</div>';
    }

    isOrderCancelled() {
        return this.#orderCancelled;
    }

    setOrderCancelled(value) {
        this.#orderCancelled = value;
    }
   
}

export const ui = new PizzaUi();

