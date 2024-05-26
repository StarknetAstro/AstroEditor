import dayjs from "dayjs";

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
    return noCommentsCodeStr.includes('#[starknet::contract]');
}

export const shortenAddress = (address?:string) =>{
    if(!address) return null
    return `${address?.substring(0,6)}...${address?.substring(address.length -4, address.length)}`
}

export const displayTimeByTimeStamp = (time: number) => {
    return dayjs(new Date(time)).format('YYYY-MM-DD HH:mm:ss');
}