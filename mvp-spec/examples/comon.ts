export const getStringToSign = (jsonMsg: any) => [
    jsonMsg.source.domain,
    jsonMsg.source.timestamp,
    jsonMsg.type,
    jsonMsg.value
].join('\u2063');
