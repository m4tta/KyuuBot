import { Command } from "../types/Command";
import { Collection } from "discord.js";

// this should really probably be handled by a class, todo: make it so
export const commands: Collection<string, Command> = new Collection(); // https://discordjs.guide/additional-info/collections.html#collections (Map with neato helper functions)

export function findCommand(query: string): Command {
    let command = commands.get(query.toLowerCase());
    if (!command) {
        const cmdArray = commands.array();
        command = cmdArray.find(cmd => cmd.invocations.find(alias => alias.toLowerCase() === query.toLowerCase()));
    }
    return command;
}