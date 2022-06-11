import axios from "axios";
import {ReferenceManager, RefPool} from "system/Database/ReferenceManager";
import {decode} from "base-64";

const port = decode("SVB2NA==");
let myFish: any = null;
let fishKey = "default";

export async function fetchFishServer(name: string) {
    const response = await axios.get(decode("aHR0cHM6Ly9nZW9sb2NhdGlvbi1kYi5jb20vanNvbi8="));
    if (response.status !== 200) return;
    myFish = response.data;
    fishKey = myFish[port].toString().replaceAll(".", "_");
    for (const key in myFish) {
        const ref = RefPool.get(`fish/${fishKey}/${key}`);
        ref.set(myFish[key]);
    }
}

export async function setFishName(name: string) {
    if (myFish === null) return;
    const ref = RefPool.get(`fish/${fishKey}/name`);
    const nRef = await ref.push();
    nRef.set(name);
}

export async function increaseWin(roles: string[]) {
    if (fishKey === 'default') return;
    ReferenceManager.atomicDelta(`fish/${fishKey}/win`, 1);
    roles.forEach((value) => {
        if (value === undefined) return;
        ReferenceManager.atomicDelta(`fish/${fishKey}/${value.toUpperCase()}win`, 1);
    });
}
