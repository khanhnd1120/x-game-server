import NodeCache from "node-cache";
//default ttl is 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

export default cache;
