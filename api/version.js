// 版本检查 API
module.exports = async function handler(req, res) {
  return res.status(200).json({
    version: '2.0-module-exports-fix',
    timestamp: new Date().toISOString(),
    message: 'API is using module.exports (CommonJS)',
    deployment: 'success'
  });
}

