import md5 from 'md5';

const ts = Number(new Date());
const publicKey = 'cd8dcea0da09625a4b0947edd3b724aa';
const privateKey = '7024213b8cab9752c1eb30dced2b33073d3cde3d';
const hash = md5(`${ts}${privateKey}${publicKey}`);

const apiKey = {
  ts,
  apikey: publicKey,
  hash,
};

export default apiKey;