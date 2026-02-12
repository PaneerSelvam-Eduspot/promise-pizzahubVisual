import MyPromise from '../src/core/myPromise.js';

export function query(endpoint, options) {
    return new MyPromise((resolve, reject) => {
        const BASE_URL = 'https://pizzahub-api-4b9d.onrender.com/';
            fetch(`${BASE_URL}${endpoint}`, options)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(err => reject(err));
    });
}