module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// utils/wwrapAsync.js
// module.exports = function wrapAsync(fn) {
//     return function(req, res, next) {
//         fn(req, res, next).catch(next);  // If the promise rejects, it will pass the error to the next middleware (error handler)
//     };
// };
