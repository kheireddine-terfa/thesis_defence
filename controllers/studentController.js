const Theme = require('../models/themeModel')

//----------------------
exports.getAllTheme = async (req, res) => {
  const themes = await Theme.find()
  res.status(200).json({
    status: 'success',
    data: {
      themes,
    },
  })
}
