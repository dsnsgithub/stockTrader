const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "Lists all the commands the bot has!",
	execute(message, args) {
		var embed = new Discord.MessageEmbed()
			.setTitle("All Commands for Stock Trader")
			.addField("Ping", "Ping!")
			.addField("Buy", "Buys a stock at market value.")
			.addField("Sell", "Sells a stock at market value.")
			.addField("Profile", "Shows a list of your stocks.")
			.addField("Price", "Shows the current price of a stock.")
			.addField("Help", "Lists all the commands the bot has!");

		message.channel.send(embed);
	}
};
