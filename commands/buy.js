const stockPrice = require("yahoo-stock-prices");
const fs = require("fs");
const orders = require("../orders.json");
const Discord = require("discord.js");

module.exports = {
	name: "buy",
	description: "Buys a stock at market value.",
	async execute(message, args) {
		if (!orders[message.author.id]) {
			orders[message.author.id] = {
				trades: [],
				balance: 100000,
				settings: []
			};
		}

		//? Creates a copy of trades/balances for easier readablity ---------------------
		const userTrades = orders[message.author.id]["trades"];
		var userBalance = orders[message.author.id]["balance"];

		//? Calculates price -----------------------------------------
		var price = await stockPrice.getCurrentPrice(args[0]).catch((error) => {
			message.channel.send("Invalid Stock Symbol");
		});
		if (!price) return;

		//? Check for correct arguments--------------------------------------------------------------

		if (!args[0]) return message.channel.send("Make sure to specify a stock symbol like GOOGL or AAPL.");

		if (!args[1]) {
			const filter = (m) => m.author.id === message.author.id;
			message.channel.send("How many stocks do you want to buy?");
			const result = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
			args[1] = result.first().content;
		}

		if (!isFinite(args[1])) return message.channel.send("You must buy a number of stocks.");
		if (!Number.isInteger(Number(args[1]))) return message.channel.send("You must buy a whole number of stocks.");
		if (args[1] < 1) return message.channel.send("You can't buy less than one stock.");

		price = price * args[1];
		if (userBalance - price < 0) return message.channel.send("Not enough money!");


        
		//? Loops over every trade and checks if they already bought the same stock for the same price --------------------------
		for (var trade in userTrades) {
			if (userTrades[trade]["stock"] == args[0] && userTrades[trade]["price"] == price) {
				userBalance = userBalance - price.toFixed(2);

				userTrades[trade]["amount"] = Number(userTrades[trade]["amount"]) + Number(args[1]);

				var sameEmbed = new Discord.MessageEmbed()
					.setTitle("Transaction")
					.addField("Balance", "$" + userBalance)
					.setDescription(
						`You have bought ${args[1]} more ${args[0]} stock(s) for ${price.toLocaleString("en-US", { style: "currency", currency: "USD" })}. You now have ${
							userTrades[trade]["amount"]
						} ${args[0]} stocks.`
					);

				message.channel.send(sameEmbed);
				return;
			}
		}

		//? If the transaction isn't over ----------------------------------------------------------------------------------

		var entry = {
			stock: args[0],
			price: price.toFixed(2),
			amount: args[1]
		};
		userTrades.push(entry);

		userBalance = userBalance - price;

		var embed = new Discord.MessageEmbed()
			.setTitle("Transaction")
			.addField("Balance", userBalance.toLocaleString("en-US", { style: "currency", currency: "USD" }))
			.setDescription(`You have bought ${args[1]} ${args[0]} stock(s) for ${price.toLocaleString("en-US", { style: "currency", currency: "USD" })}.`);

		message.channel.send(embed);

		//? Moves those changes back
		orders[message.author.id]["trades"] = userTrades;
		orders[message.author.id]["balance"] = userBalance;

		//? Writes orders back into orders.json
		fs.writeFileSync("orders.json", JSON.stringify(orders));
	}
};
