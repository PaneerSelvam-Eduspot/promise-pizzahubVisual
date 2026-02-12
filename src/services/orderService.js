import { query } from '../../lib/query.js';
import MyPromise from "../core/myPromise.js";
import { PizzaUi } from "./ph.js";

const wait = (ms) => new MyPromise(r => setTimeout(r, ms));
const SYNC_TIME = 300;

export class OrderService {
    constructor(ui) {
        this.ui = ui;
    }

    ensureNotCancelled() {
     if (this.ui.isOrderCancelled()){
        throw new Error('Order cancelled');
     } 
    }

    async fetchShops() {
       this.ensureNotCancelled();
       this.ui.logToConsole('Fetching shops -> PENDING', 'pending');

       const shops = await query('api/pizzahub');

       this.ensureNotCancelled();
       this.ui.logToConsole('Fetching shops -> FULFILLED', 'fulfilled');

       await wait(SYNC_TIME);
       return shops;
    }

    async fetchPizzas(shopId) {
        this.ensureNotCancelled();
        this.ui.logToConsole('Fetching pizzas -> PENDING', 'pending');

        const pizzas = await query(`api/pizzahub/${shopId}/pizzas`);

        this.ensureNotCancelled();
        this.ui.logToConsole('Fetching pizzas -> FULFILLED', 'fulfilled');

        await wait(SYNC_TIME);
        return pizzas;
    }

    async fetchBeverages(pizzaId) {
        this.ensureNotCancelled();
        this.ui.logToConsole('Fetching beverages → PENDING', 'pending');

        const beverages = await query(`api/pizzas/${pizzaId}/beverages`);

        this.ensureNotCancelled();
        this.ui.logToConsole('Fetching beverages → FULFILLED', 'fulfilled');

        await wait(SYNC_TIME);
        return beverages;
    }

    async placeOrder(pizzaId, quantity) {
        this.ensureNotCancelled();

        this.ui.logToConsole('Placing order → PENDING', 'pending');

        const result = await query('api/orders', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pizzaId, quantity })
        });

        this.ensureNotCancelled();
        this.ui.logToConsole('Placing order → FULFILLED', 'fulfilled');

        await wait(SYNC_TIME);
        return result;
    }

    
    async orderPizza(pizza, quantity) {
      this.ui.setOrderCancelled(false);
      let currentStage = null;

      try {
        this.ui.logToConsole('NEW ORDER STARTED...');

        // Stage 1
        currentStage = 'placed';
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE);

        const shops = await this.fetchShops();
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE, {
            shop: shops[0].name,
            city: shops[0].city
        });

        const pizzas = await this.fetchPizzas(shops[0].id);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.COMPLETED, {
            shop: shops[0].name,
            pizzaCount: pizzas.length
        });

        // Stage 2
        currentStage = 'preparing';
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE);

        const beverages = await this.fetchBeverages(pizza.id);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE, {
            pizza: pizza.name,
            type: pizza.type,
            beverage: beverages[0]?.name || 'None'
        });

        await wait(SYNC_TIME);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.COMPLETED, {
            pizza: pizza.name,
            quantity: quantity
        });

        // Stage 3
        currentStage = 'baking';
        await wait(SYNC_TIME);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE, {
            pizza: pizza.name,
            status: 'In oven...'
        });

        await wait(SYNC_TIME);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.COMPLETED, {
            pizza: pizza.name,
            status:'Ready!'
        });

        // Stage 4
        currentStage = 'delivery';
        await wait(SYNC_TIME + 600);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.ACTIVE, {
            pizza: pizza.name,
            beverage: beverages[0]?.name,
            quantity: quantity,
            status: 'Wait a min...'
        });

        await wait(SYNC_TIME);
        this.ui.updateStage(currentStage, PizzaUi.STATUS.COMPLETED, {
            pizza: pizza.name,
            beverage: beverages[0]?.name,
            quantity: quantity,
            status: 'Out for Delivery!'
        });

        this.ui.logToConsole(
            `ORDER COMPLETE: ${quantity}x ${pizza.name}`,
            'fulfilled'
        );

    } catch (err) {
        if (err.message === 'Order cancelled') {
            this.ui.cancelAllStages(currentStage);
        } else {
            this.ui.logToConsole(`ERROR: ${err.message}`, 'rejected');
        }
        throw err
    }
  }
}
