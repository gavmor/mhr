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
