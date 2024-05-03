const ExpressAdapter = () => {
  const create = (fn) => {
    return async function (req, res) {
      const obj = await fn(req.params, req.body);
      res.json(obj);
    };
  };

  return {
    create,
  };
};

module.exports = ExpressAdapter;
