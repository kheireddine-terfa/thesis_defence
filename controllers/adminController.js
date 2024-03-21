const Announce = require('../models/announceModel')
const Binome = require('../models/binomeModel')
const Professor = require('../models/professorModel')
const Student = require('../models/studentModel')
const Premise = require('../models/premiseModel')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')
const jwt = require('jsonwebtoken')
//--------- sign token function : -------------------------------
const signToekn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//------------------ controllers: --------------------------------
exports.addAndSignUpBinome = async (req, res) => {
  let stud2, binome
  const { student1, student2 } = req.body
  const stud1 = await Student.findById(student1)
  if (student2) {
    stud2 = await Student.findById(student2)
  }
  if (!stud1 && !stud2) {
    return res.status(404).json({
      status: 'fail',
      message: 'student not found',
    })
  }
  if (stud1 && !stud2) {
    binome = await Binome.create({
      student1: stud1,
      userName: `${stud1.firstName} ${stud1.lastName}`,
      email: stud1.email,
      password: stud1.matricule,
    })
  }

  if (stud1 && stud2) {
    binome = await Binome.create({
      student1: stud1,
      student2: stud2,
      userName: `${stud1.firstName} ${stud1.lastName} | ${stud2.firstName} ${stud2.lastName}`,
      email: `${stud1.firstName}.${stud2.firstName}@gmail.com`,
      password: `${stud1.matricule}${stud2.matricule}`,
    })
  }
  // Generate JWT token
  const token = signToekn(binome._id)
  // Send response with token
  res.status(201).json({
    status: 'success',
    token,
    binome,
  })
}
//----------------------:

exports.getAllBinome = async (req, res) => {
  const binomes = await Binome.find()
  res.status(200).json({
    status: 'success',
    data: {
      binomes,
    },
  })
}
//----------------------:

exports.getBinome = async (req, res) => {
  const binomeId = req.params.id
  const binome = await Binome.findById(binomeId)
  res.status(200).json({
    status: 'success',
    data: {
      binome,
    },
  })
}
//----------------------:

exports.updateBinome = async (req, res) => {
  const binomeId = req.params.id
  let updatedBinome
  const { student1, student2, ApprovedThesis } = req.body
  const stud1 = await Student.findById(student1)
  const stud2 = await Student.findById(student2)
  if (stud2) {
    updatedBinome = await Binome.findById(binomeId)

    updatedBinome.email = `${stud1.firstName}.${stud2.firstName}@gmail.com`
    updatedBinome.userName = `${stud1.firstName} ${stud1.lastName} | ${stud2.firstName} ${stud2.lastName}`
    updatedBinome.student2 = student2
    updatedBinome.password = `${stud1.matricule}${stud2.matricule}`
    updatedBinome.ApprovedThesis = ApprovedThesis
    await updatedBinome.save()
  } else {
    updatedBinome = await Binome.findByIdAndUpdate(binomeId, req.body, {
      new: true,
      runValidators: true,
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedBinome,
    },
  })
}
//----------------------:

exports.deleteBinome = async (req, res) => {
  const binomeId = req.params.id
  const deletedBinome = await Binome.findByIdAndDelete(binomeId)
  res.status(204).json({
    status: 'success',
    message: 'Binome deleted successfully',
  })
}
//----------------------:

exports.addAnnounce = async (req, res) => {
  const announce = await Announce.create(req.body)
  res.status(200).json({
    status: 'success',
    data: {
      announce,
    },
  })
}
//----------------------:

exports.getAllAnnounces = async (req, res) => {
  const announces = await Announce.find()
  res.status(200).json({
    status: 'success',
    data: {
      announces,
    },
  })
}
//----------------------:

exports.getAnnounce = async (req, res) => {
  const announceId = req.params.id
  const announce = await Announce.findById(announceId)
  res.status(200).json({
    status: 'success',
    data: {
      announce,
    },
  })
}
//----------------------:

exports.updateAnnounce = async (req, res) => {
  const announceId = req.params.id
  const updatedAnnounce = await Announce.findByIdAndUpdate(
    announceId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  res.status(200).json({
    status: 'success',
    data: {
      updatedAnnounce,
    },
  })
}
//----------------------:

exports.deleteAnnounce = async (req, res) => {
  const announceId = req.params.id
  const deletedAnnounce = await Announce.findByIdAndDelete(announceId)
  res.status(204).json({
    status: 'success',
    message: 'announce deleted successfully',
  })
}
//----------------------:

exports.getAllProfessors = async (req, res) => {
  const professors = await Professor.find()
  res.status(200).json({
    status: 'success',
    data: {
      professors,
    },
  })
}
//----------------------:

exports.getProfessor = async (req, res) => {
  const professorId = req.params.id
  const professor = await Professor.findById(professorId)
  res.status(200).json({
    status: 'success',
    data: {
      professor,
    },
  })
}
//----------------------:

exports.combineFields = (req, res, next) => {
  const { field1, field2, field3, firstName, lastName, grade, email } = req.body
  const fields = [field1, field2, field3]
  req.body = {
    firstName,
    lastName,
    grade,
    email,
    fields,
  }
  next()
}
//----------------------:

exports.updateProfessor = async (req, res) => {
  const professorId = req.params.id
  const updatedProfessor = await Professor.findByIdAndUpdate(
    professorId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  res.status(200).json({
    status: 'success',
    data: {
      updatedProfessor,
    },
  })
}
//----------------------:

exports.deleteProfessor = async (req, res) => {
  const professorId = req.params.id
  const professor = await Professor.findByIdAndDelete(professorId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}
//----------------------:

exports.addPremise = async (req, res) => {
  const premise = await Premise.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      premise,
    },
  })
}
//----------------------:

exports.getAllPremises = async (req, res) => {
  const premise = await Premise.find()
  res.status(200).json({
    status: 'success',
    data: {
      premise,
    },
  })
}
//----------------------:

exports.deletePremise = async (req, res) => {
  const premiseId = req.params.id
  const premise = await Premise.findByIdAndDelete(premiseId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}
//----------------------:

exports.addSpeciality = async (req, res) => {
  const speciality = await Speciality.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      speciality,
    },
  })
}
//----------------------:

exports.getAllSpeciality = async (req, res) => {
  const specialities = await Speciality.find()
  res.status(200).json({
    status: 'success',
    data: {
      specialities,
    },
  })
}
//----------------------:

exports.deleteSpeciality = async (req, res) => {
  const specialityId = req.params.id
  const deletedSpeciality = await Speciality.findByIdAndDelete(specialityId)
  res.status(204).json({
    status: 'success',
    message: 'speciality successfully deleted',
  })
}
//----------------------:

exports.addField = async (req, res) => {
  const field = await Field.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      field,
    },
  })
}
//----------------------:

exports.getAllFields = async (req, res) => {
  const fields = await Field.find()
  res.status(200).json({
    status: 'success',
    data: {
      fields,
    },
  })
}
//----------------------:

exports.getField = async (req, res) => {
  const fieldId = req.params.id
  const field = await Field.findById(fieldId)
  res.status(200).json({
    status: 'success',
    data: {
      field,
    },
  })
}
//----------------------:

exports.deleteField = async (req, res) => {
  const fieldId = req.params.id
  const deletedField = await Field.findByIdAndDelete(fieldId)
  res.status(204).json({
    status: 'success',
    message: 'field successfully deleted',
  })
}
//----------------------:

exports.updateField = async (req, res) => {
  const fieldId = req.params.id
  const updatedField = await Field.findByIdAndUpdate(fieldId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      updatedField,
    },
  })
}
//----------------------:

exports.getAllStudents = async (req, res) => {
  const students = await Student.find()
  res.status(200).json({
    status: 'success',
    data: {
      students,
    },
  })
}
//----------------------:

exports.getStudent = async (req, res) => {
  const studentId = req.params.id
  const student = await Student.findById(studentId)
  res.status(200).json({
    status: 'success',
    data: {
      student,
    },
  })
}
//----------------------:

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id
  const deletedStudent = await Student.findByIdAndDelete(studentId)
  res.status(204).json({
    status: 'success',
    message: 'student deleted successfully',
  })
}
//----------------------:

exports.updateStudent = async (req, res) => {
  const studentId = req.params.id
  const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      updatedStudent,
    },
  })
}
