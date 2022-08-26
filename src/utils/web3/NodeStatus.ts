export const NodeStatus = async (url: string) => {
    let liveURL

    try{
        let resp = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ method: "net_version", params: [], id: 67, jsonrpc: "2.0" }),
        })
        
        if (resp.status >= 400) {
            liveURL = false;
        } else {
            liveURL = url;
        }

    } catch (e) {
        console.log(e);
        liveURL = false;
    }

    return liveURL;
}