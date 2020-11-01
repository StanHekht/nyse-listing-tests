export const getInnerTextFromHandle = async (handle) => {
    let result = await page.evaluate(el => el.innerText, handle);
    return result;
}

export const getClassNameFromHandle = async (handle) => {
    let result = await page.evaluate(el => el.className, handle);
    return result;
}

export const getHrefFromHandle = async (handle) => {
    let result = await page.evaluate(el => el.href, handle);
    return result;
}
