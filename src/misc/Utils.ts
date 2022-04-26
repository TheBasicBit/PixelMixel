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

export async function getObject(url: string) {
    return await (await (fetch(url)
        .then(res => {
            return res.json();
        })
        .catch(err => {
            console.error(err);
        })
    ));
}
