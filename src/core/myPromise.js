const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected'))
    }

    if (x instanceof MyPromise) {
        x.then(resolve, reject);
        return;
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let then;
        try{
            then = x.then;
        } catch (err) {
            return reject(err);
        }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                x,
                y => {
                 if (called) return;
                 called = true;
                 resolvePromise(promise2, y, resolve, reject)
                },
                r => {
                 if (called) return;
                 called = true;
                 reject(r);
                }
            );
           } catch (err) {
            if (!called) reject(err);
           }
           return; 
        }
    }
    resolve(x);
}

class MyPromise {   
    constructor(executor) {
       this.state = STATE.PENDING;
       this.value = undefined;

       this.onFullfilledCallbacks = [];
       this.onRejectedCallbacks = [];

       const resolve = (value) => {
        if (this.state !== STATE.PENDING) return;
        
        queueMicrotask(() => {
          this.state = STATE.FULFILLED;
          this.value = value;
          this.onFullfilledCallbacks.forEach(cb => cb(value)); 
        });  
       };

       const reject = (reason) =>  {
        if (this.state !== STATE.PENDING) return;
        
        queueMicrotask(() => {
          this.state = STATE.REJECTED;
          this.value = reason;
          this.onRejectedCallbacks.forEach(cb => cb(reason)); 
        });
       };

       try {
          executor(resolve, reject);
       } catch (err) {
          reject(err);
       }
    }

    then(onFullfilled, onRejected) {
     const promise2 =  new MyPromise((resolve, reject) => {

        const handleFulfilled = value => {
         try{
           if(typeof onFullfilled !== 'function') {
            resolve(value);
          } else {
            const x = onFullfilled(value);
            resolvePromise(promise2, x, resolve, reject);
          } 
         } catch (err) {
            reject(err);   
         }
       };

        const handleRejected = reason => {
         try {
           if(typeof onRejected !== 'function') {
                reject(reason);
            } else {
                const x = onRejected(reason);
                resolvePromise(promise2, x, resolve, reject);
            }
          } catch (err) {
            reject(err);
          }
        };

        if (this.state === STATE.PENDING) {
            this.onFullfilledCallbacks.push(handleFulfilled);
            this.onRejectedCallbacks.push(handleRejected);
        }

        if (this.state === STATE.FULFILLED) {
            queueMicrotask(() => handleFulfilled(this.value));
        }

        if (this.state === STATE.REJECTED) {
            queueMicrotask(() => handleRejected(this.value));
        }
     });

     return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(callback) {
        return this.then(
            value => {
                callback();
                return value;
            },
            reason => {
                callback();
                throw reason;
            }
        );
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
    
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }


   static all(promises) {
       return new MyPromise((resolve, reject) => {
           const results =[];
           let completed = 0;
          if (promises.length === 0) {
            resolve([]);
            return;
          }

          promises.forEach((p, i) => {
            MyPromise.resolve(p).then(
                value => {
                    results[i] = value;
                    completed++;

                    if (completed === promises.length) {
                        resolve(results);
                    }
                },
                reject
            );
          });
       });
    }

    static allSettled(promises) {
        return new MyPromise((resolve) => {
            const results = [];
            let completed = 0;

            if(promises.length === 0) {
                resolve([]);
                return;
            }

            promises.forEach((p, index) => {
                MyPromise.resolve(p).then(
                    value => {
                        results[index] = { status: STATE.FULFILLED, value }
                        completed++;
                        if (completed === promises.length) {
                            resolve(results);
                        }
                    },
                    reason => {
                        results[index] = { status: STATE.REJECTED, reason }
                         completed++;
                        if (completed === promises.length) {
                            resolve(results);
                        }
                    }
                );
            });
        });
    }

    
    static race(promises) {
        return new MyPromise((resolve ,reject) => {
            promises.forEach(p => 
                MyPromise.resolve(p).then(resolve, reject)
            )
        })
    }

    static any(promises) {
     return new MyPromise((resolve, reject) => {
        const errors = [];
        let rejected = 0;

      if (promises.length === 0) {
        reject(new AggregateError([], 'All promises were rejected'));
        return;
      }

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
            resolve,
            err => {
                errors[i] = err;
                rejected++;
                if (rejected === promises.length) {
                    reject(new AggregateError(errors, 'All promises were rejected'));
                }
            }
        );
      });
     }); 
    }
}


export default MyPromise;
