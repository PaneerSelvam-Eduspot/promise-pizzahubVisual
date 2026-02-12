import { query } from '../../lib/query.js';
import { ui } from '../services/ph.js';
import { OrderService } from '../services/orderService.js';

const orderService = new OrderService(ui);

let shopData = null;
let pizzasData = [];
let selectedPizza = null;

async function initializeApp() {

    const statusMsg = document.getElementById('shop-info');
    statusMsg.textContent = "Waking up the pizza oven (Server)... Please wait!";

    try {
        const shops = await query('api/pizzahub');
        shopData = shops[0];
        document.getElementById('shop-info').textContent = `${shopData.name} - ${shopData.city}`;
        
        pizzasData = await query(`api/pizzahub/${shopData.id}/pizzas`);
        
        const pizzaList = document.getElementById('pizza-list');
        pizzaList.innerHTML = '';
        
        pizzasData.forEach(pizza => {
            const btn = document.createElement('button');
            btn.className = 'pizza-name';
            btn.dataset.pizzaId = pizza.id;
            
            btn.innerHTML = `
                <span>${pizza.name}</span>
                <span class="pizza-type">${pizza.type}</span>
            `;
            
            btn.addEventListener('click', () => selectPizza(pizza));
            pizzaList.appendChild(btn);
        });
        
    } catch (error) {
        console.error('Failed to load menu:', error);
        document.getElementById('pizza-list').innerHTML = '<p style="color: red;">Failed to load menu</p>';
    }
}


async function selectPizza(pizza) {
    try {
        document.querySelectorAll('.pizza-name').forEach(b => b.classList.remove('selected'));
        document.querySelector(`[data-pizza-id="${pizza.id}"]`).classList.add('selected');
        
        selectedPizza = pizza;
        document.getElementById('selected-pizza').textContent = `Selected: ${pizza.name}`;
        
        const beverages = await query(`api/pizzas/${pizza.id}/beverages`);
        
        if (beverages && beverages.length > 0) {
            document.getElementById('selected-beverage').textContent = `Beverage: ${beverages[0].name}`;
        } else {
            document.getElementById('selected-beverage').textContent = 'Beverage: None';
        }
        
        document.getElementById('orderBtn').disabled = false;
        
    } catch (error) {
        console.error('Failed to load beverages:', error);
        document.getElementById('selected-beverage').textContent = 'Beverage: Error';
    }
}


async function handleOrderClick() {
    if (!selectedPizza) return;

    const quantity = parseInt(document.getElementById('quantity').value);
    try {
       await orderService.orderPizza(selectedPizza, quantity);
    } catch (error) {
        console.error('Order failed:', error);
    }
    
}

function resetUI() {
    document.getElementById('selected-pizza').textContent = 'Select a pizza';
    document.getElementById('selected-beverage').textContent = 'Beverage: -';
    document.getElementById('quantity').value = 1;
    document.getElementById('orderBtn').disabled = true;
}

function cancelOrder() {
    ui.setOrderCancelled(true);
    
    document.querySelectorAll('.pizza-name').forEach(b => b.classList.remove('selected'));
    selectedPizza = null;
    
    resetUI();
    ui.cancelAllStages(null);
}

function refresh() {
    document.querySelectorAll('.pizza-name').forEach(b => b.classList.remove('selected'));
    selectedPizza = null;
    
    resetUI();
    ui.resetStages();
    ui.clearConsole();
}

document.getElementById('orderBtn').addEventListener('click', handleOrderClick);
document.getElementById('cancelBtn').addEventListener('click', cancelOrder);
document.querySelector('.refresh').addEventListener('click', refresh );

initializeApp();