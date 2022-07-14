const stockPrice = require("yahoo-stock-prices");
const fs = require("fs");
const orders = require("../orders.json");
const Discord = require("discord.js");

module.exports = {
	name: "sell",
	description: "Sells stocks you have!",
	async execute(message, args) {
		//? Creates a copy of trades/balances for easier readablity ---------------------
		const userTrades = orders[message.author.id]["trades"];
		var userBalance = orders[message.author.id]["balance"];

		//? Gives a selection of which stock to sell. ------------------------------------------------
		var selectionEmbed = new Discord.MessageEmbed();
		selectionEmbed.setTitle("Type the number of the stock you want to sell.");

		for (const i in userTrades) {
			trade = userTrades[i];
			selectionEmbed.addField(
				`${trade["amount"]} ${trade["stock"]} stocks at ${trade["price"].toLocaleString("en-US", { style: "currency", currency: "USD" })} each  ||| ${i}`,
				"-------------------------------"
			);
		}
		message.channel.send(selectionEmbed);

		//? Grabs user input. --------------------------------------------
		const filter = (m) => m.author.id === message.author.id;
		const result = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
		const final = result.first().content;


		message.channel.send("How many stocks do you want to sell?");
		const secondResult = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
		args[0] = secondResult.first().content;
		

		if (!isFinite(args[0])) {
			message.channel.send("You must sell a number of stocks.");
			return;
        }
        console.log(args[0])

		if (!Number.isInteger(Number(args[0]))) {
            message.channel.send("You must sell a whole number of stocks.");
            return;
		}

		if (args[0] < 1) {
			message.channel.send("You can't sell less than one stock.");
			return;
		}

		//? Does transaction --------------------------------------------------

		if (userTrades[final]["amount"] < args[0]) {
			message.channel.send("You are selling more than you have!");
			return;
		}

		const price = await stockPrice.getCurrentPrice(userTrades[final]["stock"]).catch((error) => {
			message.channel.send(error);
			return;
		});

		const add = price * args[0];
		userBalance = userBalance + add;

		//? Displays result -----------------------------------------------------
		var transactionEmbed = new Discord.MessageEmbed()
			.setTitle("Transaction")
			.addField("Balance", userBalance.toLocaleString("en-US", { style: "currency", currency: "USD" }))
			.addField(`You have sold ${args[0]} ${userTrades[final]["stock"]} stocks.`, `You have gained ${add.toLocaleString("en-US", { style: "currency", currency: "USD" })} back. `);

		message.channel.send(transactionEmbed);

		userTrades[final]["amount"] = userTrades[final]["amount"] - args[0];

		//? Removes trade from orders.json if person doesn't own the stock.
		if (userTrades[final]["amount"] == 0) {
			userTrades.splice(final, 1);
		}

		//? Moves those changes back
		orders[message.author.id]["trades"] = userTrades;
		orders[message.author.id]["balance"] = userBalance;

		//? Writes orders back into orders.json
		fs.writeFileSync("orders.json", JSON.stringify(orders));
	}
};
