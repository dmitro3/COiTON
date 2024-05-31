exports.ResponseMessage = (res, success, statusCode, message, data) => {
  return res
    .status(statusCode)
    .send({ success, message, data: { status: 1, ...data } });
};
