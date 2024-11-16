const invalidData = (message) => {
  return {
    status: 400,
    message: message,
  };
};

const notFound = (message) => {
  return {
    status: 404,
    message: message,
  };
};

const serverError = (message) => {
  return {
    status: 500,
    message: "An error has occurred on the server.",
  };
};

module.exports = { invalidData, notFound, serverError };
