module.exports = {
	name: "ready",
	once: "true",
	execute(client) {
		console.log(`Logged in as ${client.user.tag}, on ${client.guilds.cache.size} servers with ${client.users.cache.size} users.`);
		client.user.setActivity("the Stock Market", {
			type: "PLAYING"
		});
	}
};
