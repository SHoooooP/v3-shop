module.exports = ({ bot, knex, config, commands }) => {
  commands.addInboxThreadCommand("alert", "[opt:string]", async (msg, args, thread) => {
    if (args.opt && args.opt.startsWith("c")) {
      await thread.removeAlert(msg.author.id)
      await thread.postSystemMessage("Annulation du ping au prochain message.");
    } else {
      await thread.addAlert(msg.author.id);
      await thread.postSystemMessage(`${msg.author.username}#${msg.author.discriminator} sera ping dans ce ticket lorsqu'une nouvelle réponse sera apportée dans ce ticket.`);
    }
  });
};
