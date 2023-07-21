require('dotenv').config();
const dayjs = require('dayjs');
const sequelize = require('./server/database/connection');
const Order = require("./server/models/orders/order");
const User = require('./server/models/users/user');
const Customer = require('./server/models/users/customer');
const Request = require('./server/models/users/requests');
const OrderCustomer = require('./server/models/orders/orderCustomer');

function generateRandomDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    console.log(end, endDate)
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
    const endDate = '07/20/2023';
    // const minOrdersPerMonth = 120;
    // const maxOrdersPerMonth = 150;
    const minPrice = 100;
    const maxPrice = 1500;
  
    const numOrders = 750;

    for (let i = 0; i < numOrders; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const price = generateRandomNumber(minPrice, maxPrice);
      const created = generateRandomDate(startDate, endDate);

      const order = {
        type,
        created,
        price,
      };

      ordersData.push(order);
    }
  
    return ordersData;
  }

  const generateCustomers = () => {
    return [
      {
        userData: {
          firstName: 'Roi',
          lastName: 'Reinshtein',
          email: 'roirein1@gmail.com',
          phoneNumber: '0505050500',
          password: 'Rein@1234',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business1',
          businessId: '1'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Eilon',
          lastName: 'Reinshtein',
          email: 'roirein2@gmail.com',
          phoneNumber: '0505050501',
          password: 'Rein@2345',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business2',
          businessId: '2'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Gilad',
          lastName: 'Reinshtein',
          email: 'roirein3@gmail.com',
          phoneNumber: '0505050502',
          password: 'Rein@3456',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business3',
          businessId: '3'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Itay',
          lastName: 'Reinshtein',
          email: 'roirein4@gmail.com',
          phoneNumber: '0505050503',
          password: 'Rein@4567',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business4',
          businessId: '4'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Robert',
          lastName: 'Varnavsky',
          email: 'roirein5@gmail.com',
          phoneNumber: '0505050504',
          password: 'Rein@5678',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business5',
          businessId: '5'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Dor',
          lastName: 'Maor',
          email: 'roirein6@gmail.com',
          phoneNumber: '0505050505',
          password: 'Rein@6789',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business6',
          businessId: '6'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Dor',
          lastName: 'Ben-Shabo',
          email: 'roirein7@gmail.com',
          phoneNumber: '0505050506',
          password: 'Rein@7890',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business7',
          businessId: '7'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Guy',
          lastName: 'Doytch',
          email: 'roirein8@gmail.com',
          phoneNumber: '0505050507',
          password: 'Rein@8901',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business8',
          businessId: '8'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Roi',
          lastName: 'Cohen',
          email: 'roirein9@gmail.com',
          phoneNumber: '0505050508',
          password: 'Rein@9012',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business9',
          businessId: '9'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Mor',
          lastName: 'Rossaby',
          email: 'roirein10@gmail.com',
          phoneNumber: '0505050509',
          password: 'Rein@0123',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business10',
          businessId: '10'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Noa',
          lastName: 'Tal',
          email: 'roirein11@gmail.com',
          phoneNumber: '0505050510',
          password: 'Rein@12345',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business11',
          businessId: '11'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Gal',
          lastName: 'Ben Hamo',
          email: 'roirein12@gmail.com',
          phoneNumber: '0505050520',
          password: 'Rein@23456',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business12',
          businessId: '12'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Tom',
          lastName: 'Cohen',
          email: 'roirein13@gmail.com',
          phoneNumber: '0505050530',
          password: 'Rein@23456',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business13',
          businessId: '13'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Kobe',
          lastName: 'Braynt',
          email: 'roirein14@gmail.com',
          phoneNumber: '0505050540',
          password: 'Rein@34567',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business14',
          businessId: '14'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Gal',
          lastName: 'Cohen',
          email: 'roirein15@gmail.com',
          phoneNumber: '0505050550',
          password: 'Rein@45678',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business15',
          businessId: '15'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Dan',
          lastName: 'Hamezoham',
          email: 'roirein16@gmail.com',
          phoneNumber: '0505050560',
          password: 'Rein@56789',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business16',
          businessId: '16'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Joakim',
          lastName: 'Broden',
          email: 'roirein17@gmail.com',
          phoneNumber: '0505050570',
          password: 'Rein@67890',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business17',
          businessId: '17'
        },
        requestData: {
          status: 1
        }
      },
      {
        userData: {
          firstName: 'Lebron',
          lastName: 'James',
          email: 'roirein18@gmail.com',
          phoneNumber: '0505050580',
          password: 'Rein@78901',
          permissionLevel: 5
        },
        customerData: {
          businessName: 'business18',
          businessId: '18'
        },
        requestData: {
          status: 1
        }
      },
    ]
  }
  // Generate data for January, February, and March

const getRandomIndex = (arr) => {
  return Math.floor(Math.random() * arr.length);
}

//const months = ['01', '02', '03', '04', '05', '06', '07'];
const ordersData = generateOrdersData();
const customerData = generateCustomers();
const customers = [];

const createCustomer = async (customerData) => {
  const user = await User.create(customerData.userData);
  const customer = await Customer.create({userId: user.userId, ...customerData.customerData})
  const request = await Request.create({customerId: customer.userId, ...customerData.requestData})

  return {...user.dataValues, ...customer.dataValues, ...request.dataValues}
}

const createData = (customers, orders) => {
  const customerPromises = []
  customers.forEach((cust) => {
    customerPromises.push(createCustomer(cust))
  })

  Promise.all(customerPromises).then(custs => {
    orders.forEach((order) => {
      const randIndex = getRandomIndex(custs)
      Order.create({
        type: order.type,
        customerId: custs[randIndex].userId,
        status: 11,
        deadline: dayjs('7/30/2023'),
        price: order.price,
        created: dayjs(order.created)
    }).then((ord) => {
      const cst = custs.find((user) => user.userId === ord.dataValues.customerId)
      OrderCustomer.create({
        orderId: ord.orderId,
        customerId: cst.userId,
        customerName: `${cst.firstName} ${cst.lastName}`,
        email: cst.email,
        phoneNumber: cst.phoneNumber
    })
  })
})})}

sequelize.sync({force: true}).then(() => createData(customerData, ordersData))

