## Custom Promise - PizzaHub Visualization
A fully functional project exploring JavaScript internals, featuring a custom Promise/A+ implementation and a real-time PizzaHub ordering visualizer!
I built this to master the "how" behind the tools we use every day. It moves beyond basic async/await to demonstrate the internal microtask queue and the lifecycle of asynchronous operations.

### What I implemented:
Custom MyPromise Implementation: My own version of JS Promises, focusing on Promise/A+ interoperability to see how different promise libraries work together.
Microtask Queue Logic: A demonstration of why queueMicrotask is better than setTimeout for keeping an app’s state accurate.
State Mechanisms: Real-time tracking of the internal states: pending, fulfilled, and rejected.
Real-time Pizza Visuals: A UI that follows a pizza order from placed → preparing → baking → delivery.
 
## Demo
<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/5a97f522-79b8-4763-a24b-9ead7f7d5d3b" />
[Live Demo](https://promise-pizzahub-visual.vercel.app/)


## Engineering Decisions
Why Async Orchestration?: In a real app, things happen at different times. I used orchestration to ensure the UI doesn't "jump" ahead of the actual data, making the experience feel smooth and logical.
Why Service Separation?: I separated the UI logic (ph.js) from the Order logic (orderService.js). This made the code easier to debug and reflects how professional apps are structured to keep code clean.
Why Promise Demo?: Understanding Promises is the "boss level" of JavaScript. Building one from scratch was the best way to move from just using code to actually understanding it.
Why Error Handling?: Orders fail and users cancel. I implemented a centralized try/catch with "Order Cancelled" logic to show that a good app handles "unhappy paths" as gracefully as the happy ones.

## The Real-World Problem This Solves
When building complex apps (like food delivery, ride-sharing, or progress trackers), the biggest challenge is State Syncing.
Often, a user sees "Order Delivered" while the database still says "Baking" because the async code is messy. This project solves that by creating a strict State Machine. By tying the UI directly to the Promise lifecycle, I ensure the user only sees exactly what the system is doing, preventing "race conditions" and keeping the data and UI in perfect harmony.

## How to run this locally
Clone the project
https://github.com/PaneerSelvam-Eduspot/promise-pizzahubVisual
Open with Live Server Open index.html in your browser. (If using VS Code, use the "Live Server" extension).

## Found something to fix?
Since I am a developer who is always learning, I might have missed something! If you find a bug or have a suggestion on how I can make the Promise logic better, please feel free to open an Issue or send a Pull Request. I would love to learn from your feedback!

## Like this project?
If you are feeling generous, [Buy me a Coffee!](https://ko-fi.com/paneerselvam)
