const { promisify } = require('util')
const Admin = require('../models/adminModel')
const Professor = require('../models/professorModel')
const Student = require('../models/studentModel')
const jwt = require('jsonwebtoken')
const Binome = require('../models/binomeModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')

//-------- sign token function :
const signToekn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//------------- sing up users controller:
exports.signup = catchAsync(async (req, res, next) => {
  // define the role depending on the URL:
  let role
  if (req.originalUrl === '/admin/signup') {
    role = 'admin'
  } else if (req.originalUrl === '/professor/signup') {
    role = 'professor'
  } else if (req.originalUrl === '/student/signup') {
    role = 'student'
  } else {
    role = 'invalid'
  }
  let user
  switch (role) {
    case 'professor':
      user = await Professor.create(req.body)
      break
    case 'student':
      user = await Student.create(req.body)
      break
    case 'admin':
      user = await Admin.create(req.body)
      break
    default:
      return next(new AppError('invalid user role', 400))
  }
  // Generate JWT token
  const token = signToekn(user._id)
  // Send response with token
  res.status(201).json({
    status: 'success',
    token,
    user,
  })
})
// ----------- login users controller:
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(
      new AppError('opps! you forgot to provide your password or email', 400),
    )
  }
  let role
  if (req.originalUrl === '/admin/login') {
    role = 'admin'
  } else if (req.originalUrl === '/professor/login') {
    role = 'professor'
  } else if (req.originalUrl === '/student/login') {
    role = 'student'
  } else if (req.originalUrl === '/binome/login') {
    role = 'binome'
  } else {
    role = 'invalid'
  }

  // Find user by email
  let user
  switch (role) {
    case 'professor':
      user = await Professor.findOne({ email }).select('+password')
      break
    case 'student':
      user = await Student.findOne({ email }).select('+password')
      break
    case 'admin':
      user = await Admin.findOne({ email }).select('+password')
      break
    case 'binome':
      user = await Binome.findOne({ email }).select('+password')
      break
    default:
      return next(new AppError('your not allowed to access from here ', 400))
  }
  //********** check if the user exist:
  if (!user) {
    return next(
      new AppError(
        'no user found with this credentials , please try again!',
        401,
      ),
    )
  }
  // ********  check if the password correct :
  if (!(await user.correctPassword(password))) {
    return next(new AppError('invalid email or password , try again !', 401))
  }
  // Generate JWT token
  const token = signToekn(user._id)
  // store the token in user cookies :
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }
  res.cookie('token', token, cookieOptions)
  // Send response with token
  res.status(200).json({
    status: 'success',
    token,
    role,
  })
})
//------------------ logout users controller:
exports.logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    message: 'you are logged out',
  })
}
//------------------- protect middelware (this middelware is defined to protect resssources and authorization)
exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies['token']
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in and try again', 401),
    )
  }
  // Verification of the token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // Determine the role based on the URL path
  let role
  const path = req.originalUrl.toLowerCase()
  if (path.startsWith('/admin')) {
    role = 'admin'
  } else if (path.startsWith('/professor')) {
    role = 'professor'
  } else if (path.startsWith('/student')) {
    role = 'student'
  } else if (path.startsWith('/binome')) {
    role = 'binome'
  } else {
    role = 'invalid'
  }
  // Check if the user still exists based on the determined role
  let user
  switch (role) {
    case 'admin':
      user = await Admin.findById(decoded.id)
      break
    case 'professor':
      user = await Professor.findById(decoded.id)
      break
    case 'student':
      user = await Student.findById(decoded.id)
      break
    case 'binome':
      user = await Binome.findById(decoded.id)
      break
    default:
      return next(new AppError('opps! you do not have access', 401))
  }
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    )
  }
  // Assign the authenticated user and role to the request object
  req.authenticated = true
  req.user = user
  req.role = role
  next()
})
//---------------------  update password :
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 get the user from collection : req.admin obtained with the protect middelware
  const { currentPassword, newPassword, passwordConfirm } = req.body
  let user, role
  if (req.originalUrl === '/admin/password') {
    role = 'admin'
    user = await Admin.findById(req.user._id).select('+password')
  } else if (req.originalUrl === '/professor/password') {
    role = 'professor'
    user = await Professor.findById(req.user._id).select('+password')
  } else if (req.originalUrl === '/binome/password') {
    role = 'binome'
    user = await Binome.findById(req.user._id).select('+password')
  } else {
    role = 'invalid'
    return next(
      new AppError('you are not allowed to get access from here', 404),
    )
  }
  if (!user) {
    return next(
      new AppError(
        'opps! you are not logged in , please login to get access ',
        404,
      ),
    )
  }
  //2 check if the current password is correct :
  if (!(await user.correctPassword(currentPassword))) {
    return next(new AppError('invalid current password. try again ', 401))
  }
  //3 if so update user :
  user.password = newPassword
  user.passwordConfirm = passwordConfirm
  await user.save()
  //4 log the user in :
  const token = signToekn(user._id)
  res.cookie('token', token, {
    maxAge: 60 * 60 * 24 * 30 * 1000,
    httpOnly: true,
  })
  res.clearCookie('token')
  res.status(200).json({
    status: 'success',
    message: 'password has been updated successfully',
    role,
  })
})
