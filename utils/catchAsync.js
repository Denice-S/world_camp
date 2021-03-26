module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

//this is to catch any errors and pass to next for an async function