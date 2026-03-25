import { SphereClient } from "https://cdn.jsdelivr.net/npm/@unicitylabs/sphere-sdk/+esm";

let client;

export async function connectSphere() {
    client = new SphereClient();

    try {
        const identity = await client.connect();
        return identity;
    } catch (e) {
        console.error("Sphere connect failed", e);
        return null;
    }
}
