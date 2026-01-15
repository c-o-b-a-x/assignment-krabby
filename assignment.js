let order_count = 0;
let item_count = 0;

const fs = require("fs");

function get_profit() {
  fs.readFile("costs.json", (err, data) => {
    if (err) {
      console.error("Error reading costs file:", err);
      return;
    }

    const costs = JSON.parse(data);

    fs.readFile("orders.json", (err, orderData) => {
      if (err) {
        console.error("Error reading orders file:", err);
        return;
      }

      const orders = JSON.parse(orderData);
      let totalProfit = 0;

      for (const order of orders) {
        for (const soldItem of order.items) {
          for (const costItem of costs) {
            if (costItem.name === soldItem.name) {
              totalProfit +=
                (costItem.price - costItem.procure) * soldItem.quantity;
              break;
            }
          }
        }
      }

      console.log("Total Profit:", totalProfit);
    });
  });
}

function sales_report() {
  fs.readFile("costs.json", (err, costData) => {
    if (err) {
      console.error("Error reading costs file:", err);
      return;
    }

    const costs = JSON.parse(costData);
    const costMap = {};

    for (const item of costs) {
      costMap[item.name] = item;
    }

    fs.readFile("orders.json", (err, orderData) => {
      if (err) {
        console.error("Error reading orders file:", err);
        return;
      }

      const orders = JSON.parse(orderData);
      const report = [];

      for (const order of orders) {
        for (const item of order.items) {
          const costInfo = costMap[item.name];

          report.push({
            customer: order.name,
            item: item.name,
            quantity: item.quantity,
            price: costInfo.price,
            procure: costInfo.procure,
            total_cost: costInfo.procure * item.quantity,
            revenue: costInfo.price * item.quantity,
            profit: (costInfo.price - costInfo.procure) * item.quantity,
          });
        }
      }

      console.table(report);
    });
  });
  get_profit();
}

function get_orders() {
  fs.readFile("orders.json", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const order_data = JSON.parse(data);

    for (order of order_data) {
      order_count += 1;
      for (item in order.items) {
        item_count += 1 * order.items[item].quantity;
      }
    }
    console.log("order count: " + order_count);
    console.log("item count: " + item_count);
  });
  sales_report();
}

get_orders();
