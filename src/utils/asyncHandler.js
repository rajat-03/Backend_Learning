const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(res, req, next))
    .catch((err) => next(err));
  };
};

export {asyncHandler}

/*

// Define a constant named asyncHandler, which is a higher-order function taking a requestHandler function as a parameter.
const asyncHandler = (requestHandler) => {
    // Define an anonymous function that takes three parameters: req (request), res (response), and next (next middleware function).
    (req, res, next) => {
      // Wrap the invocation of the requestHandler function inside Promise.resolve().
      // This ensures that the requestHandler function always returns a Promise, regardless of whether it's originally asynchronous or not.
      Promise.resolve(requestHandler(res, req, next))
        // Catch any errors that occur during the execution of the requestHandler function and pass them to the next middleware function.
        .catch((err) => next(err));
    };
  };
*/

/*
bahot jagha pr async await phir try catch likhege kisi method me to better hai
ek wrapper bna dete hain jisme method pass krege aur wrapper async await ka code execute kr dega

try catch ka use kr skte hain ya phir promises wala

ye higher order function hote hain means jo as parameter function accept krte hai aur return v kr skte hain

step by step explaination
const asyncHandler = () =>{}
ab function as parameter lena hai aur use krna hai to
const asyncHandler = (func) =>() =>{}

//try catch wala example
const asyncHandler = (func) => async (req, res, next) => {
  try {
    //jo function mila usko execute
    await func(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export { asyncHandler };
*/
