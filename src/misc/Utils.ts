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
    return document.querySelector("html>head>base")?.getAttribute("href") + path;
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
