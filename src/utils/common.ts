export const checkIsContract = (codeString: string) => {
    // Remove single-line comments
    let lines = codeString.split('\n');
    lines = lines.map(line => line.split('//')[0]);

    // Remove multi-line comments
    let noCommentsCode = lines.join('\n').split('/*');
    for (let i = 1; i < noCommentsCode.length; i++) {
        noCommentsCode[i] = noCommentsCode[i].substring(noCommentsCode[i].indexOf('*/') + 2);
    }
    const noCommentsCodeStr = noCommentsCode.join('');

    // Check if #[contract] is in the code part
    return noCommentsCodeStr.includes('#[contract]');
}