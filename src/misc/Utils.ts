export async function wait(delay: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), delay);
    });
}

export function removeElementByValues<T>(array: T[], item: T) {
    var index = array.indexOf(item);
    
    if (index !== -1) {
        array.splice(index, 1);

        if (index !== -1) {
            removeElementByValues(array, item);
        }
    }
}

export function getRootPath(path: string) {
    return document.querySelector("html>head>meta[base-url]")?.getAttribute("base-url") + path;
}

export async function getObject(path: string) {
    return await (await (fetch(getRootPath(path))
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.error(err);
        })
    ));
}

export function getMillis() {
    let date = new Date();
    let hour = date.getHours();
    let min = hour * 60 + date.getMinutes();
    let sec = min * 60 + date.getSeconds();
    let milli = sec * 1000 + date.getMilliseconds();

    return milli;
}
