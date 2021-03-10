module.exports = async (client, reaction, user) => {
	if (user.bot) return;
	if (reaction.message.author.id !== '784683367336771584') return;

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}
	
	reaction.message.embeds.forEach(embed => {
		if (!embed) return;
		if (!reaction.message.author.bot) return;
		if (embed.title === '**Delete the Last 100 Messages?**') {
			client.commands.get('clear').clear(reaction);
		} else {
			client.commands.get('roles').setRole(embed, reaction, user);
		}
	});
}