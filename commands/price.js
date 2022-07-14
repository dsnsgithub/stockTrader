const stockPrice = require("yahoo-stock-prices");

module.exports = {
	name: "price",
	description: "Sends the price of a stock.",
    async execute(message, args) {
        const price = await stockPrice.getCurrentPrice(args[0]).catch((error) => {
			message.channel.send("Invalid Stock Symbol");
			return;
        });

        message.channel.send(`$${price} is the price of 1 ${args[0]} stock.`);
	}
};
