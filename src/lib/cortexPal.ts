import { PoolDie } from '../App';

/**
 * Generates a CortexPal2000 /roll command from a dice pool.
 * @param pool The record of dice per category.
 * @returns A formatted /roll command string.
 */
export function generateRollCommand(pool: Record<string, PoolDie[]>): string {
    const diceStrings: string[] = [];

    Object.values(pool).forEach(dice => {
        dice.forEach(die => {
            const dieStr = `d${die.value}`;
            // If label contains spaces, it might need special handling, 
            // but following the original CommandBuilder logic:
            const labelStr = die.label ? ` ${die.label.trim()}` : '';
            diceStrings.push(`${dieStr}${labelStr}`);
        });
    });

    if (diceStrings.length === 0) return '';

    return `/roll dice:${diceStrings.join(' ')}`;
}

/**
 * Generates a CortexPal2000 /xp add command.
 * @param who The name of the hero (usually data.heroName).
 * @param amount The amount of XP to add.
 * @returns A formatted /xp add command string.
 */
export function generateXPCommand(who: string, amount: number): string {
    if (!who || !amount) return '';
    return `/xp add who:${who} number:${amount}`;
}
