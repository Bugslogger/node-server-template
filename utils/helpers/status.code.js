// status code from 400
exports.badRequest = (send, message) => {
  send.status(400).json({
    // status: "failed",
    statuscode: 0,
    message: message,
  });
};

exports.notFound = (send, message) => {
  send.status(404).json({
    // status: "failed",
    statuscode: 0,
    message:
      message ||
      "Oops! you are lost in space. Please find aircraft and try again later.",
  });
};

exports.Unauthorized = (send, message) => {
  send.status(401).json({
    // status: "failed",
    statuscode: 0,
    message: message || "You are unauthorized to access this api",
  });
};

exports.Forbidden = (send, message) => {
  send.status(403).json({
    // status: "failed",
    statuscode: 0,
    message: message || "Does not have access rights to the content.",
  });
};

exports.methodNotAllowed = (send, message) => {
  send.status(405).json({
    // status: "failed",
    statuscode: 0,
    message: message || "Request Method is not allowed.",
  });
};

exports.requestTimeout = (send, message) => {
  send.status(408).json({
    // status: "failed",
    statuscode: 0,
    message: message || "Request Timeout.",
  });
};

exports.tooManyRequests = (send, message) => {
  send.status(429).json({
    // status: "failed",
    statuscode: 0,
    message: message || "Hold On! you are sending too many requests",
  });
};

// status code from 500
exports.internalError = (send) => {
  send.status(500).json({
    // status: "failed",
    statuscode: 0,
    message: "Oops! looks like something went wrong with our server.",
  });
};

// status code from 200
exports.Success = (send, object) => {
  send.status(200).json({
    ...object,
  });
};

exports.Created = (send, message) => {
  send.status(201).json({
    // status: "success",
    statuscode: 1,
    message: message,
  });
};
