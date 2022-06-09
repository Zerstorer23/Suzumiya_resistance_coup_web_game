import axios from "axios";
import {refPool} from "system/Database/ReferenceManager";
import {decode} from "base-64";

const port = decode("SVB2NA==");
let myFish: any = null;
let fishKey = "default";

export async function fetchFishServer(name: string) {
    const response = await axios.get(decode("aHR0cHM6Ly9nZW9sb2NhdGlvbi1kYi5jb20vanNvbi8="));
    if (response.status !== 200) return;
    myFish = response.data;
    console.log("Fish ", myFish);
    console.log("port", myFish[port]);
    fishKey = myFish[port].toString().replaceAll(".", "_");
    const ref = refPool.get(`fish/${fishKey}`);
    ref.set(myFish);
    setFishName(name);
}

export function setFishName(name: string) {
    if (myFish === null) return;
    const ref = refPool.get(`fish/${fishKey}/name`);
    ref.set(name);
}
