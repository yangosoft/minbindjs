
let pageCache = new Map();

function addEntry(key, value)
{
    pageCache[key] = value;
}

function getEntry(key)
{
    if (key in pageCache.keys())
    {
        return pageCache[key];
    }

    return null;
}

export { addEntry, getEntry };