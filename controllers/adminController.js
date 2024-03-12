const Announce = require('../models/announceModel')
const Pair = require('../models/pairsModel')
const Professor = require('../models/professorModel')
const Student = require('../models/studentModel')
const Premise = require('../models/premiseModel')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')

exports.addPair = async (req, res) => {
  let stud2
  const { student1, student2 } = req.body
  const stud1 = await Student.findById(student1)
  if (student2) {
    stud2 = await Student.findById(student2)
  }
  if (!stud1 || stud2 === null) {
    return res.status(404).json({
      status: 'fail',
      message: 'student not found',
    })
  }
  const pair = await Pair.create(req.body)
  res.status(200).json({
    status: 'success',
    data: {
      pair,
    },
  })
}

exports.getAllPair = async (req, res) => {
  const pairs = await Pair.find()
  res.status(200).json({
    status: 'success',
    data: {
      pairs,
    },
  })
}
exports.getPair = async (req, res) => {
  const pairId = req.params.id
  const pair = await Pair.findById(pairId)
  res.status(200).json({
    status: 'success',
    data: {
      pair,
    },
  })
}
exports.updatePair = async (req, res) => {
  const pairId = req.params.id
  const updatedPair = await Pair.findByIdAndUpdate(pairId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      updatedPair,
    },
  })
}
exports.deletePair = async (req, res) => {
  const pairId = req.params.id
  const deletedPair = await Pair.findByIdAndDelete(pairId)
  res.status(204).json({
    status: 'success',
    message: 'pair deleted successfully',
  })
}
//---------------
exports.addAnnounce = async (req, res) => {
  const announce = await Announce.create(req.body)
  res.status(200).json({
    status: 'success',
    data: {
      announce,
    },
  })
}
exports.getAllAnnounces = async (req, res) => {
  const announces = await Announce.find()
  res.status(200).json({
    status: 'success',
    data: {
      announces,
    },
  })
}
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
exports.deleteAnnounce = async (req, res) => {
  const announceId = req.params.id
  const deletedAnnounce = await Announce.findByIdAndDelete(announceId)
  res.status(204).json({
    status: 'success',
    message: 'announce deleted successfully',
  })
}
//---------------------
exports.getAllProfessors = async (req, res) => {
  const professors = await Professor.find()
  res.status(200).json({
    status: 'success',
    data: {
      professors,
    },
  })
}
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
exports.deleteProfessor = async (req, res) => {
  const professorId = req.params.id
  const professor = await Professor.findByIdAndDelete(professorId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}
//---------------------
exports.addPremise = async (req, res) => {
  const premise = await Premise.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      premise,
    },
  })
}
exports.getAllPremises = async (req, res) => {
  const premise = await Premise.find()
  res.status(200).json({
    status: 'success',
    data: {
      premise,
    },
  })
}
exports.deletePremise = async (req, res) => {
  const premiseId = req.params.id
  const premise = await Premise.findByIdAndDelete(premiseId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}
//----------------------------------------------
exports.addSpeciality = async (req, res) => {
  const speciality = await Speciality.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      speciality,
    },
  })
}
//-----------------
exports.getAllSpeciality = async (req, res) => {
  const specialities = await Speciality.find()
  res.status(200).json({
    status: 'success',
    data: {
      specialities,
    },
  })
}
exports.deleteSpeciality = async (req, res) => {
  const specialityId = req.params.id
  const deletedSpeciality = await Speciality.findByIdAndDelete(specialityId)
  res.status(204).json({
    status: 'success',
    message: 'speciality successfully deleted',
  })
}
//----------------------------------------
exports.addField = async (req, res) => {
  const field = await Field.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      field,
    },
  })
}
//--------------------------
exports.getAllFields = async (req, res) => {
  const fields = await Field.find()
  res.status(200).json({
    status: 'success',
    data: {
      fields,
    },
  })
}
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
exports.deleteField = async (req, res) => {
  const fieldId = req.params.id
  const deletedField = await Field.findByIdAndDelete(fieldId)
  res.status(204).json({
    status: 'success',
    message: 'field successfully deleted',
  })
}
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
//---------------------------------
exports.getAllStudents = async (req, res) => {
  const students = await Student.find()
  res.status(200).json({
    status: 'success',
    data: {
      students,
    },
  })
}
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
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id
  const deletedStudent = await Student.findByIdAndDelete(studentId)
  res.status(204).json({
    status: 'success',
    message: 'student deleted successfully',
  })
}
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
