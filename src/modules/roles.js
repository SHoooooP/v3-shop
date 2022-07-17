const utils = require("../utils");
const {
  setModeratorDefaultRoleOverride,
  resetModeratorDefaultRoleOverride,

  setModeratorThreadRoleOverride,
  resetModeratorThreadRoleOverride,

  getModeratorThreadDisplayRoleName,
  getModeratorDefaultDisplayRoleName,
} = require("../data/displayRoles");

module.exports = ({ bot, knex, config, commands }) => {
  if (! config.allowChangingDisplayRole) {
    return;
  }

  function resolveRoleInput(input) {
    if (utils.isSnowflake(input)) {
      return utils.getInboxGuild().roles.get(input);
    }

    return utils.getInboxGuild().roles.find(r => r.name.toLowerCase() === input.toLowerCase());
  }

  // Get display role for a thread
  commands.addInboxThreadCommand("role", [], async (msg, args, thread) => {
    const displayRole = await getModeratorThreadDisplayRoleName(msg.member, thread.id);
    if (displayRole) {
      thread.postSystemMessage(`Votre rôle sera affiché dans ce ticket en tant que : **${displayRole}**`);
    } else {
      thread.postSystemMessage("Votre réponse apparaîtra sans rôle.");
    }
  });

  // Reset display role for a thread
  commands.addInboxThreadCommand("role reset", [], async (msg, args, thread) => {
    await resetModeratorThreadRoleOverride(msg.member.id, thread.id);

    const displayRole = await getModeratorThreadDisplayRoleName(msg.member, thread.id);
    if (displayRole) {
      thread.postSystemMessage(`Votre rôle pour ce ticket a été reset. Votre réponse apparaîtra avec le rôle basique. **${displayRole}**.`);
    } else {
      thread.postSystemMessage("Votre rôle pour ce ticket a été reset, votre réponse appaîtra sans rôle.");
    }
  }, {
    aliases: ["role_reset", "reset_role"],
  });

  // Set display role for a thread
  commands.addInboxThreadCommand("role", "<role:string$>", async (msg, args, thread) => {
    const role = resolveRoleInput(args.role);
    if (! role || ! msg.member.roles.includes(role.id)) {
      thread.postSystemMessage("Aucun rôle trouvé, veuillez a avoir le grade !");
      return;
    }

    await setModeratorThreadRoleOverride(msg.member.id, thread.id, role.id);
    thread.postSystemMessage(`Votre rôle sera affiché en tant que **${role.name}**.Vous pouvez le reset avec: \`${config.prefix}role reset\`.`);
  });

  // Get default display role
  commands.addInboxServerCommand("role", [], async (msg, args, thread) => {
    const displayRole = await getModeratorDefaultDisplayRoleName(msg.member);
    if (displayRole) {
      msg.channel.createMessage(`Votre rôle par défault est **${displayRole}**`);
    } else {
      msg.channel.createMessage("Votre réponse sera affiché avec le rôle basique.");
    }
  });

  // Reset default display role
  commands.addInboxServerCommand("role reset", [], async (msg, args, thread) => {
    await resetModeratorDefaultRoleOverride(msg.member.id);

    const displayRole = await getModeratorThreadDisplayRoleName(msg.member, thread.id);
    if (displayRole) {
      thread.postSystemMessage(`Votre rôle pour ce ticket a été reset. Votre réponse apparaîtra avec le rôle basique. **${displayRole}**.`);
    } else {
      thread.postSystemMessage("Votre rôle pour ce ticket a été reset, votre réponse appaîtra sans rôle.");
    }
  }, {
    aliases: ["role_reset", "reset_role"],
  });

  // Set default display role
  commands.addInboxThreadCommand("role", "<role:string$>", async (msg, args, thread) => {
    const role = resolveRoleInput(args.role);
    if (! role || ! msg.member.roles.includes(role.id)) {
      thread.postSystemMessage("Aucun rôle trouvé, veuillez a avoir le grade !");
      return;
    }

    await setModeratorThreadRoleOverride(msg.member.id, thread.id, role.id);
    thread.postSystemMessage(`Votre rôle sera affiché en tant que **${role.name}**.Vous pouvez le reset avec: \`${config.prefix}role reset\`.`);
  });
}