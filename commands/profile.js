const orders = require("../orders.json");
const Discord = require("discord.js");
const stockPrice = require("yahoo-stock-prices");

module.exports = {
	name: "profile",
	description: "Displays a list of all your purchases and balance.",
	async execute(message, args) {
		//? Creates a new profile if the user doesn't have one yet ---------------------------------------
		if (!orders[message.author.id]) {
			orders[message.author.id] = {
				trades: [],
				balance: 100000,
				settings: []
			};
		}

		//? Creates a copy of trades/balances for easier readablity ---------------------
		const userTrades = orders[message.author.id]["trades"];
		const userBalance = orders[message.author.id]["balance"];

		const embed = new Discord.MessageEmbed().setTitle(`${message.author.tag}'s profile`).addField("Balance:", `${userBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}`);

		for (const i in userTrades) {
			trade = userTrades[i];

			const price = await stockPrice.getCurrentPrice(trade["stock"]).catch((error) => {
				message.channel.send(error);
				return;
			});

			const profit = trade["price"] - price;

			embed.addField(
				`${trade["amount"]} ${trade["stock"]} stocks worth ${trade["price"].toLocaleString("en-US", { style: "currency", currency: "USD" })}`,
				`Current Profit: ${profit.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
			);
		}

		message.channel.send(embed);
	}
};
