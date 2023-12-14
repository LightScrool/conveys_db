const userEntity = require("../entities/user.entity");

const checkIsCorrectPuid = (puid) => {
  return puid && !isNaN(puid);
};

const authMiddleware = async (req, res, next) => {
  const puid = req.headers["x-yandex-puid"];

  if (!checkIsCorrectPuid(puid)) {
    req.auth = {
      status: false,
      user: null,
    };
    return next();
  }

  let user = await userEntity.getByPuid(puid);
  if (!user) {
    user = await userEntity.create({ puid });
  }

  req.auth = {
    status: true,
    user: user,
  };
  return next();
};

module.exports = authMiddleware;
