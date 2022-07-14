module.exports = {
	name: "message",
	execute(message, client) {
		if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

		const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();

		if (!client.commands.has(command)) return;

		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply("There was an error trying to execute that command!", error);
		}
	}
};
