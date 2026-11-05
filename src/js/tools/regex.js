/** Tests a regular expression against text and reports matches and capture groups. */
export function testRegex(source, pattern, flags = 'gm') {
    if (!pattern) throw new Error('regexPatternRequired');
    const safeFlags = [...new Set(flags.replace(/[^dgimsuvy]/g, '').split(''))].join('');
    const regex = new RegExp(pattern, safeFlags);
    const matches = [...source.matchAll(new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`))];

    if (!matches.length) return 'No matches found.';

    return matches.map((match, index) => [
        `Match ${index + 1} at index ${match.index}`,
        `Full match: ${JSON.stringify(match[0])}`,
        ...match.slice(1).map((group, groupIndex) => `Group ${groupIndex + 1}: ${JSON.stringify(group ?? null)}`),
    ].join('\n')).join('\n\n');
}
