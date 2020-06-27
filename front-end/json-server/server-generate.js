var faker = require('faker');
var _ = require("lodash");
function generateData () {


    var _items = _.times(100, function(n) {
            return {
                id: n,
                name: faker.name.findName(),
                barcode: new Date().getTime().toString() + faker.random.number(100000).toString(),
                buyPrice: faker.commerce.price(1000, 10000),
                sellPrice: faker.commerce.price(11000, 30000),
                quantity: faker.finance.amount(-1, 1000, 0, '')
            };
    });

    var _customers = _.times(100, function(n) {
          return {
              id: n,
              name: faker.name.findName(),
              phone: faker.phone,
              credit: faker.commerce.price(-1000, 1000),
          };
    });

  
    var _invoice_items = [];
    var invoiceItemLastId = 0;
    var _invoices = _.times(100, function(n) {

            var thisInvoice = {
              id: n,
              customerId: n,
              totalCost: faker.commerce.price(10000, 15000),
              payed: faker.commerce.price(10000, 15000),
              isPaid: false,
            }

            if (faker.random.boolean) {
              thisInvoice.payed = thisInvoice.totalCost;
            }
            if (thisInvoice.payed == thisInvoice.payed) {
              thisInvoice.isPaid = true;
            }

           _.times(5, function(n){
             var randomItemId = faker.finance.amount(0, 99, 0, '')
             console.log(randomItemId);

             var item = _items[randomItemId];
             var invoiceItem = {
               id: invoiceItemLastId,
               invoiceId: thisInvoice.id,
               itemId: item.id, 
               name: item.name, 
               barcode: item.barcode, 
               buyPrice: item.buyPrice,
               sellPrice: item.sellPrice, 
               count: faker.finance.amount(1, 10),
             }
             _invoice_items.push(invoiceItem)
             invoiceItemLastId++;
           });

          return thisInvoice;
    });

  return {items: _items, invoices: _invoices, invoice_items: _invoice_items, customers: _customers};
}

module.exports = generateData;