const utils = require("../utils");
const threads = require("../data/threads");

module.exports = ({ bot, knex, config, commands }) => {
  commands.addInboxServerCommand("newthread", "<userId:userId>", async (msg, args, thread) => {
    const user = bot.users.get(args.userId) || await bot.getRESTUser(args.userId).catch(() => null);
    if (! user) {
      utils.postSystemMessageWithFallback(msg.channel, thread, "Utilisateur introuvable !");
      return;
    }

    if (user.bot) {
      utils.postSystemMessageWithFallback(msg.channel, thread, "Impossible de créer un ticket avec cet utilisateur");
      return;
    }

    const existingThread = await threads.findOpenThreadByUserId(user.id);
    if (existingThread) {
      utils.postSystemMessageWithFallback(msg.channel, thread, `Impossible de créer un nouveau ticket, un autre est déjà ouvert : <#${existingThread.channel_id}>`);
      return;
    }

    const createdThread = await threads.createNewThreadForUser(user, {
      quiet: true,
      ignoreRequirements: true,
      ignoreHooks: true,
      source: "command",
    });

    createdThread.postSystemMessage(`Le ticket a été ouvert par ${msg.author.username}#${msg.author.discriminator}`);

    msg.channel.createMessage(`Ticket ouvert: <#${createdThread.channel_id}>`);
  });
};
