require('dotenv').config();
const sequelize = require('./server/database/connection');
const Order = require("./server/models/orders/order");

function generateRandomDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const day = String(randomDate.getDate()).padStart(2, '0');
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const year = randomDate.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateOrdersData(months) {
    const ordersData = [];
    const types = [1, 2, 3];
    const startDate = '01/01/2023';
    const endDate = '31/03/2023';
    const minOrdersPerMonth = 30;
    const maxOrdersPerMonth = 50;
    const minPrice = 100;
    const maxPrice = 1500;
  
    for (let month of months) {
      const numOrders = generateRandomNumber(minOrdersPerMonth, maxOrdersPerMonth);
  
      for (let i = 0; i < numOrders; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const price = generateRandomNumber(minPrice, maxPrice);
        const createdAt = generateRandomDate(`${month}/01/2023`, `${month}/31/2023`);
  
        const order = {
          type,
          createdAt,
          price,
        };
  
        ordersData.push(order);
      }
    }
  
    return ordersData;
  }

  
  // Generate data for January, February, and March



  const months = ['01', '02', '03'];
  const ordersData = generateOrdersData(months);
 // console.log(ordersData.length)
  
  sequelize.sync({force: true}).then(() => ordersData.forEach((order) => {
    //console.log(order.createdAt, new Date(order.createdAt), typeof(order.createdAt))
    Order.create({
        type: order.type,
        status: 9,
        deadline: new Date('7/30/2023'),
        price: order.price,
        created: new Date(order.createdAt)
    }).then((res) => console.log(res))
}))
