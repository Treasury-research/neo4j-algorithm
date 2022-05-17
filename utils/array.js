function pagination(offset, limit, array) {
  return offset + limit >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + limit);
}

module.exports = {
  pagination,
};
