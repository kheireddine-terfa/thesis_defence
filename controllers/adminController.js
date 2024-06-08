const Announce = require('../models/announceModel')
const Binome = require('../models/binomeModel')
const Professor = require('../models/professorModel')
const Student = require('../models/studentModel')
const Premise = require('../models/premiseModel')
const Speciality = require('../models/specialityModel')
const Field = require('../models/fieldModel')
const jwt = require('jsonwebtoken')
const Session = require('../models/sessionModel')
const NonAvailibility = require('../models/nonAvailibilityModel')
const Thesis = require('../models/thesisModel')
const Jury = require('../models/juryModels')
const Slot = require('../models/slotModel')
const ThesisDefence = require('../models/thesisDefenceModel')
const moment = require('moment')
const XLSX = require('xlsx')
const path = require('path')

//--------- sign token function : -------------------------------
const signToekn = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//------------------ controllers: --------------------------------
exports.addAndSignUpBinome = async (req, res) => {
  let stud2, binome
  const { student1, student2 } = req.body
  const stud1 = await Student.findById(student1)
  const speciality = stud1.speciality
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
    stud1.partOfBinome = true
    await stud1.save()
  }

  if (stud1 && stud2) {
    if (stud1.speciality.toString() === stud2.speciality.toString()) {
      binome = await Binome.create({
        student1: stud1,
        student2: stud2,
        userName: `${stud1.firstName} ${stud1.lastName} | ${stud2.firstName} ${stud2.lastName}`,
        email: `${stud1.firstName}.${stud2.firstName}@gmail.com`,
        password: `${stud1.matricule}${stud2.matricule}`,
      })
      stud1.partOfBinome = true
      stud2.partOfBinome = true
      await stud1.save()
      await stud2.save()
    } else {
      return res.status(403).json({
        status: 'fail',
        message:
          'binome specialities are not the same! binome students should be in the same speciality',
      })
    }
  }
  // Generate JWT token
  // const token = signToekn(binome._id)
  // Send response with token
  res.status(201).json({
    status: 'success',
    // token,
    binome,
  })
}
//----------------------:

exports.getAllBinomes = async (req, res) => {
  const binomes = await Binome.find()
  const flag = 'bi'
  res.status(200).render('Admin-liste-binome', {
    layout: 'Admin-nav-bar',
    binomes,
    flag,
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
  const binome = await Binome.findById(binomeId)
  // if (binome.selectedThesis.length > 0) {
  //   return res.status(403).json({
  //     status: 'fail',
  //     message: 'you can not delete this! the binome has selected theses',
  //   })
  // }
  if (binome.ApprovedThesis) {
    return res.status(403).json({
      status: 'fail',
      message: 'you can not delete this! the binome has an approved thesis',
    })
  }
  await Student.findByIdAndUpdate(
    binome.student1._id,
    {
      partOfBinome: false,
    },
    { new: true },
  )
  if (binome.student2) {
    await Student.findByIdAndUpdate(
      binome.student2._id,
      {
        partOfBinome: false,
      },
      { new: true },
    )
  }
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
exports.addAndSignUpProfessor = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    fields,
    nbr_of_examined_theses,
    grade,
  } = req.body
  const professor = await Professor.create({
    firstName,
    lastName,
    email,
    fields,
    grade,
    password: `${firstName}.${lastName}`,
  })
  // Send response with token
  res.status(201).json({
    status: 'success',
    professor,
  })
}
//-------------------------------
exports.getAllProfessors = async (req, res) => {
  const professors = await Professor.find()
  const flag = 'pr'
  res.status(200).render('admin-liste-enseignant', {
    layout: 'admin-nav-bar',
    professors,
    flag,
  })
}
//----------------------:

exports.getProfessor = async (req, res) => {
  const professorId = req.params.id
  const fields = await Field.find()
  const professor = await Professor.findById(professorId)
  res.status(200).render('Admin-modifier-enseignant', {
    layout: 'Admin-nav-bar',
    professor,
    fields,
  })
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
  const professor = await Professor.findById(professorId)
  if (professor.theses.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message: 'you cannot delete this! the professor has theses',
    })
  }
  // check if the professor is a jury member:
  const isJuryMember = await Jury.exists({
    $or: [{ professor1: professorId }, { professor2: professorId }],
  })
  if (isJuryMember) {
    return res.status(403).json({
      status: 'fail',
      message: 'you cannot delete this! the professor is already a jury',
    })
  }
  const deltedProfessor = await Professor.findByIdAndDelete(professorId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}

//------------formulaire d'insertion du fichier excel profs
exports.uploadProfessorForm = async (req, res) => {
  res.status(200).render('Admin-ajouter-enseignants-import', {
    layout: 'Admin-nav-bar',
  })
}
//-----------télécharger le fichier excel model
exports.downloadProfessorFile = async (req, res) => {
  const file = path.join(
    __dirname,
    '../public/templates/fichier_modele_enseignants.xlsx',
  )
  res.download(file, 'fichier_modele_enseignants.xlsx')
}

//----------------- improter enseignants depuis excel:
exports.uploadProfessors = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No file uploaded' })
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet)

    if (data.length === 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Empty file uploaded' })
    }

    const profs = await Promise.all(
      data.map(async (row) => {
        if (
          !row.firstName ||
          !row.lastName ||
          !row.email ||
          !row.grade ||
          !row.fields
        ) {
          throw new Error('Champs manquants dans le fichier Excel ! ')
        }

        const fieldTitles = row.fields.split(',').map((field) => field.trim())
        const fields = await Field.find({ title: { $in: fieldTitles } })

        if (fields.length !== fieldTitles.length) {
          throw new Error(
            'Domaine non existant : Veuillez vérifier les domaines ou en créer un',
          )
        }
        const pwd = row.firstName + '.' + row.lastName

        return {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          grade: row.grade,
          fields: fields,
          password: pwd,
        }
      }),
    )

    await Professor.insertMany(profs)

    res
      .status(201)
      .json({ status: 'success', message: 'Professorss uploaded successfully' })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}

//----------------------:

exports.addPremise = async (req, res) => {
  const premise = await Premise.create(req.body)
  res.status(201).json({
    status: 'success',
    premise,
  })
}
//----------------------:

exports.getAllPremises = async (req, res) => {
  const premises = await Premise.find()
  const flag = 'pre'
  res.status(200).render('Admin-liste-local', {
    layout: 'Admin-nav-bar',
    premises,
    flag,
  })
}
//----------------------:
exports.getPremise = async (req, res) => {
  const premiseId = req.params.id
  const premise = await Premise.findById(premiseId)
  res.status(200).render('Admin-modifier-local', {
    layout: 'Admin-nav-bar',
    premise,
  })
}
//----------------------:

exports.deletePremise = async (req, res) => {
  const premiseId = req.params.id
  const thesesD = await ThesisDefence.find({
    premise: premiseId,
  })
  if (thesesD.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you can not delete this! this premise is attributed to a thesis defence',
    })
  }
  const premise = await Premise.findByIdAndDelete(premiseId)
  res.status(204).json({
    status: 'success',
    message: 'professor deleted successfully',
  })
}
//----------------------:
exports.updatePremise = async (req, res) => {
  const premiseId = req.params.id
  const premise = await Premise.findByIdAndUpdate(premiseId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      premise,
    },
  })
}
//----------------------:

exports.addSpeciality = async (req, res) => {
  const speciality = await Speciality.create(req.body)
  res.status(201).json({
    status: 'success',
    speciality,
  })
}
//----------------------:
exports.getSpeciality = async (req, res) => {
  const specialityId = req.params.id
  const speciality = await Speciality.findById(specialityId)
  res.status(200).render('Admin-modifier-specialite', {
    layout: 'Admin-nav-bar',
    speciality,
  })
}
//----------------------:
exports.getAllSpeciality = async (req, res) => {
  const specialities = await Speciality.find()
  const flag = 'sp'
  res.status(200).render('Admin-liste-specialite', {
    layout: 'Admin-nav-bar',
    specialities,
    flag,
  })
}
//----------------------:

exports.deleteSpeciality = async (req, res) => {
  const specialityId = req.params.id
  const students = await Student.find({
    speciality: specialityId,
  })
  if (students.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you can not perform this action! speciality is attributed to student',
    })
  }
  const theses = await Thesis.find({
    speciality: specialityId,
  })
  if (theses.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you can not perform this action! speciality is attributed to thesis',
    })
  }
  const deletedSpeciality = await Speciality.findByIdAndDelete(specialityId)
  res.status(204).json({
    status: 'success',
    message: 'speciality successfully deleted',
  })
}
//----------------------:
exports.updateSpeciality = async (req, res) => {
  const specialityId = req.params.id
  const speciality = await Speciality.findByIdAndUpdate(
    specialityId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  res.status(200).json({
    status: 'success',
    data: {
      speciality,
    },
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
  const flag = 'fi'
  res.status(200).render('Admin-liste-domaine', {
    layout: 'Admin-nav-bar',
    fields,
    flag,
  })
}
//----------------------:

exports.getField = async (req, res) => {
  const fieldId = req.params.id
  const field = await Field.findById(fieldId)
  res.status(200).render('Admin-modifier-domaine', {
    layout: 'Admin-nav-bar',
    field,
  })
}
//----------------------:

exports.deleteField = async (req, res) => {
  const fieldId = req.params.id
  const professors = await Professor.find({ fields: fieldId })
  const theses = await Thesis.find({ field: fieldId })
  if (professors.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you can not perfome this action! this filed is attributed to professor',
    })
  }
  if (theses.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you can not perfome this action! this filed is attributed to thesis',
    })
  }
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
exports.addAndSignUpStudent = async (req, res) => {
  const { firstName, lastName, email, matricule, speciality } = req.body
  const student = await Student.create({
    firstName,
    lastName,
    email,
    matricule,
    speciality,
    password: matricule,
  })
  // Send response with token
  res.status(201).json({
    status: 'success',
    student,
  })
}
exports.getAllStudents = async (req, res) => {
  const students = await Student.find()
  const flag = 'st'
  res.status(200).render('Admin-liste-etudiant', {
    layout: 'Admin-nav-bar',
    students,
    flag,
  })
}
//----------------------:

exports.getStudent = async (req, res) => {
  const studentId = req.params.id
  const student = await Student.findById(studentId)
  const specialities = await Speciality.find()
  res.status(200).render('Admin-modifier-etudiant', {
    layout: 'Admin-nav-bar',
    student,
    specialities,
  })
}
//----------------------:

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id
  const binome = await Binome.findOne({
    $or: [{ student1: studentId }, { student2: studentId }],
  })

  if (binome) {
    return res.status(403).json({
      status: 'fail',
      message:
        'The student is part of a binome. Remove them from the binome first.',
    })
  }
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
//------------formulaire d'insertion du fichier excel
exports.uploadStudentForm = async (req, res) => {
  res.status(200).render('Admin-ajouter-etudiants-import', {
    layout: 'Admin-nav-bar',
  })
}

//----------------telecharger le fichier modele
exports.downloadStudentFile = async (req, res) => {
  const file = path.join(
    __dirname,
    '../public/templates/fichier_modele_etudiants.xlsx',
  )
  res.download(file, 'fichier_modele_etudiants.xlsx')
}

//----------------- improter étudiants depuis excel:
exports.uploadStudents = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'No file uploaded' })
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet)

    if (data.length === 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Empty file uploaded' })
    }

    const students = await Promise.all(
      data.map(async (row) => {
        if (
          !row.firstName ||
          !row.lastName ||
          !row.email ||
          !row.matricule ||
          !row.specialityName
        ) {
          throw new Error('Missing required fields in the Excel file')
        }

        const speciality = await Speciality.findOne({
          abbreviation: row.specialityName,
        })
        if (!speciality) {
          throw new Error(`Speciality ${row.specialityName} not found`)
        }

        return {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          matricule: row.matricule,
          speciality: speciality._id,
          password: row.matricule,
        }
      }),
    )

    await Student.insertMany(students)

    res
      .status(201)
      .json({ status: 'success', message: 'Students uploaded successfully' })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    })
  }
}
//-----------------:
exports.addSession = async (req, res) => {
  countSession = await Session.find().countDocuments()
  if (countSession > 0) {
    return res.status(401).json({
      status: 'fail',
      message:
        'opps ! you can not add another sessions , you need to delete the existing sessions to perform this action',
    })
  }
  const normalSession = await Session.create({
    sessionType: 'normal',
    slot_nbr_theses: req.body.slot_nbr_theses,
    startSession: req.body.startSession,
    endSession: req.body.endSession,
    thesisDefenceDuration: req.body.thesisDefenceDuration,
    break: req.body.break,
    startDayHour: req.body.startDayHour,
    endDayHour: req.body.endDayHour,
    minCharge: req.body.minCharge,
  })
  const retakeSession = await Session.create({
    sessionType: 'retake',
    slot_nbr_theses: req.body.slot_nbr_theses,
    startSession: req.body.r_startSession,
    endSession: req.body.r_endSession,
    thesisDefenceDuration: req.body.r_thesisDefenceDuration,
    break: req.body.r_break,
    startDayHour: req.body.r_startDayHour,
    endDayHour: req.body.r_endDayHour,
    minCharge: req.body.minCharge,
  })
  res.status(201).json({
    status: 'success',
    normalSession,
    retakeSession,
  })
}
//-----------------:
exports.getAllSession = async (req, res) => {
  const normalSession = await Session.find({ sessionType: 'normal' })
  const retakeSession = await Session.find({ sessionType: 'retake' })
  const countSession = await Session.find().countDocuments()
  const flag = 'se'
  res.status(200).render('Admin-liste-session', {
    layout: 'Admin-nav-bar',
    normalSession,
    retakeSession,
    countSession,
  })
}
//-----------------:
exports.getSession = async (req, res) => {
  const sessionId = req.params.id
  const session = await Session.findById(sessionId)
  res.status(200).render('Admin-modifier-session', {
    layout: 'Admin-nav-bar',
    session,
  })
}
//-----------------:
exports.updateSession = async (req, res) => {
  const sessionId = req.params.id
  const updatedSession = await Session.findByIdAndUpdate(sessionId, req.body, {
    new: true,
    runValidators: true,
  })
  const session = await Session.findOneAndUpdate(
    { _id: { $ne: sessionId } },
    {
      minCharge: req.body.minCharge,
      slot_nbr_theses: req.body.slot_nbr_theses,
    },
    { new: true },
  )
  await updatedSession.save()
  res.status(200).json({
    status: 'success',
    data: {
      updatedSession,
    },
  })
}
//-----------------:
exports.deleteSession = async (req, res) => {
  const sessionId = req.params.id
  const juries = await Jury.find()

  if (juries.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps ! you cannot perform this action , there are juries generated',
    })
  }
  const theses = await Thesis.find({ session: { $exists: true } })

  if (theses.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps ! you cannot perform this action , there are theses assigned to this session',
    })
  }
  const deletedSession = await Session.findByIdAndDelete(sessionId)
  res.status(204).json({
    status: 'success',
    data: {
      deletedSession,
    },
  })
}
exports.deleteAllSessions = async (req, res) => {
  //check if there are theses attached to the session :
  const theses = await Thesis.find({ session: { $exists: true } })
  if (theses.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps ! you cannot perform this action , there are theses assigned to this session',
    })
  }
  // check if juries is already generated:
  const juries = await Jury.find()
  if (juries.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps ! you cannot perform this action , there are juries generated',
    })
  }

  await Session.deleteMany({})
  res.status(204).json({
    status: 'succcess',
    message: 'sessions has been deleted successfully',
  })
}
//--------------------------
exports.getAllNonAvailibility = async (req, res) => {
  try {
    const professors = await Professor.aggregate([
      {
        $match: {
          nonAvailibility: { $exists: true, $not: { $size: 0 } },
        },
      },
      {
        $unwind: '$nonAvailibility',
      },
      {
        $project: {
          _id: 0,
          professorId: '$_id',
          professorFirstName: '$firstName',
          professorLastName: '$lastName',
          nonAvailibility: '$nonAvailibility',
        },
      },
    ])
    // Fetching startDay and endDay for each nonAvailibility
    const professorsWithAvailability = await Promise.all(
      professors.map(async (professor) => {
        const nonAvailibility = await NonAvailibility.findById(
          professor.nonAvailibility,
        )

        const startDay = nonAvailibility.startDay.toLocaleDateString('en-GB')
        const endDay = nonAvailibility.endDay.toLocaleDateString('en-GB')
        return {
          ...professor,
          startDay,
          endDay,
        }
      }),
    )
    const flag = 'no'
    res.status(200).render('Admin-non-disponibilite', {
      layout: 'Admin-nav-bar',
      professorsWithAvailability,
      flag,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
//-------------------
exports.addNonAvailibility = async (req, res) => {
  const { startDay, endDay, professor: professorId } = req.body

  // Fetch the professor document using the provided ID
  const professor = await Professor.findById(professorId)

  if (!professor) {
    return res.status(404).json({
      status: 'fail',
      message: 'Professor not found',
    })
  }

  // Check for conflicts with existing non-availability periods
  const conflicts = await NonAvailibility.find({
    _id: { $in: professor.nonAvailibility },
    $or: [
      { startDay: { $lte: endDay }, endDay: { $gte: startDay } },
      { startDay: { $lte: endDay }, endDay: { $gte: startDay } },
    ],
  })

  if (conflicts.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'The new non-availability period conflicts with existing periods.',
    })
  }

  // Create the new non-availability period
  const nonAvailibility = await NonAvailibility.create(req.body)

  // Update the professor document
  const updatedProfessor = await Professor.findByIdAndUpdate(
    professorId,
    { $push: { nonAvailibility: nonAvailibility._id } },
    { new: true }, // Return the updated professor document
  )

  // Send response with updated professor
  res.status(201).json({
    status: 'success',
    professor: updatedProfessor,
  })
}
//------------------
exports.getNonAvailibility = async (req, res) => {
  const nonAvId = req.params.id
  const nonAv = await NonAvailibility.findById(nonAvId)
  const professor = await Professor.find({ nonAvailibility: nonAvId })
  // first find the non availibility then find the professor that have this non availibility
  res.status(200).render('Admin-modifier-non-disponibilite', {
    layout: 'Admin-nav-bar',
    nonAv,
    professor,
  })
}
exports.updateNonAvailibility = async (req, res) => {
  const nonAvId = req.params.id
  const nonAv = await NonAvailibility.findByIdAndUpdate(nonAvId, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    nonAv,
  })
}
exports.deleteNonAvailibility = async (req, res) => {
  const nonAvId = req.params.id
  const planning = await ThesisDefence.find()
  if (planning.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps! cannot perform this action! planning is already generated..',
    })
  }
  const nonAv = await NonAvailibility.findByIdAndDelete(nonAvId)
  const professor = await Professor.findOneAndUpdate(
    { nonAvailibility: nonAvId },
    { $pull: { nonAvailibility: nonAvId } },
    {
      new: true,
    },
  )
  res.status(204).json({
    status: 'success',
    message: 'non availibility deleted',
  })
}
//----------------------
exports.getAllAffectedTheses = async (req, res) => {
  const binomes = await Binome.find({ 'ApprovedThesis': { $exists: true } })
    .populate({
      path: 'ApprovedThesis',
      populate: {
        path: 'session',
        model: 'Session'
      }
    })
  res.status(200).render('Admin-liste-theme-affectes', {
    layout: 'Admin-nav-bar',
    binomes,
  })
}
//report de session 
exports.reporterThesis = async (req, res) => {
  const thesis = await Thesis.findById(req.params.id).populate('session')
  thesis.session = await Session.findOne({ sessionType: 'retake' })
  await thesis.save();

  res.redirect('Admin-liste-theme-affectes');
}


exports.getAllProposedTheses = async (req, res) => {
  const professors = await Professor.aggregate([
    {
      $unwind: '$theses', // Unwind the theses array
    },
    {
      $lookup: {
        from: 'theses',
        localField: 'theses',
        foreignField: '_id',
        as: 'thesisDetails',
      },
    },
    {
      $unwind: '$thesisDetails', // Unwind the result of the lookup
    },
    {
      $match: {
        'thesisDetails.affected': false, // Filter out affected theses
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        thesis: '$thesisDetails.title',
        description: '$thesisDetails.description',
        field: '$thesisDetails.field',
        speciality: '$thesisDetails.speciality',
      },
    },
    {
      $lookup: {
        // Join with the Field collection to get field details
        from: 'fields',
        localField: 'field',
        foreignField: '_id',
        as: 'fieldDetails',
      },
    },
    {
      $lookup: {
        // Join with the Speciality collection to get speciality details
        from: 'specialities',
        localField: 'speciality',
        foreignField: '_id',
        as: 'specialityDetails',
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        thesis: 1,
        description: 1,
        field: { $arrayElemAt: ['$fieldDetails.title', 0] }, // Extract field title from array
        speciality: { $arrayElemAt: ['$specialityDetails.title', 0] }, // Extract speciality title from array
      },
    },
  ])
  res.status(200).render('Admin-liste-theme-proposes', {
    layout: 'Admin-nav-bar',
    professors,
  })
}
//--------------------------
exports.getAllJuries = async (req, res) => {
  const juries = await Jury.find()
  res.status(200).render('Admin-liste-jury', {
    layout: 'Admin-nav-bar',
    juries,
  })
}
// Fonction de tri personnalisée pour trier les professeurs en fonction de leur grade

exports.generateJuries = async (req, res) => {
  const theses = await Thesis.find({ affected: true })
  const session = await Session.findOne({ sessionType: 'normal' })
  const gradeOrder = ['PR', 'MCA', 'MCB', 'MAA', 'MAB', 'PHD']
  if (!session) {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps!you need to create the session before you generate the juries',
    })
  }
  const minCharge = session.minCharge
  let member, president
  if (theses.length > 0) {
    for (const thesis of theses) {
      //1) find the supervisor of this thesis :
      const thesisSupervisor = await Professor.findOne({ theses: thesis })
      //2) get all the eligible professors
      const eligibleProfessors = await Professor.find({
        _id: { $ne: thesisSupervisor._id },
        fields: { $in: thesis.field },
        nbr_of_examined_theses: { $lt: minCharge },
      })
      //2-1) check if the length of eligible professors greater then 2
      if (eligibleProfessors.length >= 2) {
        // sort professors (EP) by grade
        eligibleProfessors.sort((a, b) => {
          return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
        })
        // select the president an the member of jury
        president = eligibleProfessors[0]
        member = eligibleProfessors[eligibleProfessors.length - 1]
      } else {
        //1) check if there is one professor that is :
        //                                  _ not supervisor
        //                                  _ in the same field
        //                                  _ did not reach the min charge
        if (eligibleProfessors.length === 1) {
          //1)find the alternative professors
          //                          _ in other field
          //                          _ didn't reach the min charge
          const alternativeProfessors = await Professor.find({
            _id: { $ne: thesisSupervisor._id },
            fields: { $nin: thesis.field },
            nbr_of_examined_theses: { $lt: minCharge },
          })

          //1-1) check if there is an alternative professors:
          if (alternativeProfessors.length > 0) {
            //1) sort the alternative professors by grade :
            alternativeProfessors.sort((a, b) => {
              return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
            })
            //2) select the first that is less graded then the eligible professor:
            const alternativeProf = alternativeProfessors.find((prof) => {
              const eligibleGradeIndex = gradeOrder.indexOf(
                eligibleProfessors[0].grade,
              )
              const alternativeGradeIndex = gradeOrder.indexOf(prof.grade)
              return alternativeGradeIndex > eligibleGradeIndex
            })
            //3) check if alternative professor exists :
            if (alternativeProf) {
              president = eligibleProfessors[0]
              member = alternativeProf
            } else {
              //3-1) there is no alternative professor that is less graded then the eligible professor:
              //1) check if the grade of alternative professor is less then the only eligible professor(OEP):
              if (
                gradeOrder.indexOf(eligibleProfessors[0].grade) <
                gradeOrder.indexOf(alternativeProfessors[0].grade)
              ) {
                //1) if grade of OEP is greater then the alternative --> no changes : president = eligibleProfessors[0]
                //                                                                    member = the first one in the sorted alternative professor
                president = eligibleProfessors[0]
                member = alternativeProfessors[0]
              } else {
                //2-1) else : member = eligibleProfessors[0] , president = the first one in the sorted alternative professor
                president = alternativeProfessors[0]
                member = eligibleProfessors[0]
              }
            }
          } else {
            //else :there is no alternative professors:
            //1) check if there are professors in the same field but they reach the min charge ? here i think we need maxCharge
            const alternativeProfs = await Professor.find({
              _id: { $ne: thesisSupervisor._id },
              fields: { $in: thesis.field },
              nbr_of_examined_theses: { $gte: minCharge },
            })
            if (alternativeProfs.length > 0) {
              //1) sort the AP in ascending order by (number of examined theses)
              alternativeProfs.sort(
                (a, b) => a.nbr_of_examined_theses - b.nbr_of_examined_theses,
              )
              //2) check if the grade of the professor that has the minimal charge is greather then the EP[0]
              if (
                gradeOrder.indexOf(eligibleProfessors[0].grade) <=
                gradeOrder.indexOf(alternativeProfs[0].grade)
              ) {
                president = eligibleProfessors[0]
                member = alternativeProfs[0]
              } else {
                president = alternativeProfs[0]
                member = eligibleProfessors[0]
              }
            } else {
              //1) else: there are no professors in the same field but they reach the min charge
              //1-1) check if there are professors that are not in the same fields but they reach the min charge
              const alternativeProfs = await Professor.find({
                _id: { $ne: thesisSupervisor._id },
                fields: { $nin: thesis.field },
                nbr_of_examined_theses: { $gte: minCharge },
              })
              if (alternativeProfs.length > 0) {
                //1) sort the AP in ascending order by (number of examined theses)
                alternativeProfs.sort(
                  (a, b) => a.nbr_of_examined_theses - b.nbr_of_examined_theses,
                )
                //2) check if the grade of the professor that has the minimal charge is greather then the EP[0]
                if (
                  gradeOrder.indexOf(eligibleProfessors[0].grade) <=
                  gradeOrder.indexOf(alternativeProfs[0].grade)
                ) {
                  president = eligibleProfessors[0]
                  member = alternativeProfs[0]
                } else {
                  president = alternativeProfs[0]
                  member = eligibleProfessors[0]
                }
              } else {
                //1-2) else : error! ask the admin to add a professor
                return res.status(403).json({
                  status: 'fail',
                  message:
                    'opps ! missing alternative professor please insert one to generate the juries',
                })
              }
            }
          }
        } else {
          // there is no eligible professor:---> in the same field and didn't reach the min charge
          // 1) check if there are professors from the other field and didn't reach the min charge:
          const eligibleProfessors = await Professor.find({
            _id: { $ne: thesisSupervisor._id },
            fields: { $nin: thesis.field },
            nbr_of_examined_theses: { $lt: minCharge },
          })
          if (eligibleProfessors.length >= 2) {
            // sort professors (EP) by grade
            eligibleProfessors.sort((a, b) => {
              return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade)
            })
            // select the president an the member of jury
            president = eligibleProfessors[0]
            member = eligibleProfessors[eligibleProfessors.length - 1]
          } else {
            //1) check if there is one professor that is :
            //                                  _ not supervisor
            //                                  _ not in the same field
            //                                  _ did not reach the min charge
            if (eligibleProfessors.length === 1) {
              //1)find the alternative professors
              //                          _ in other field
              //                          _ reach the min charge
              //1) check if there are professors in the same field but they reach the min charge ? here i think we need maxCharge
              const alternativeProfs = await Professor.find({
                _id: { $ne: thesisSupervisor._id },
                fields: { $in: thesis.field },
                nbr_of_examined_theses: { $gte: minCharge },
              })
              if (alternativeProfs.length > 0) {
                //1) sort the AP in ascending order by (number of examined theses)
                alternativeProfs.sort(
                  (a, b) => a.nbr_of_examined_theses - b.nbr_of_examined_theses,
                )
                //2) check if the grade of the professor that has the minimal charge is greather then the EP[0]
                if (
                  gradeOrder.indexOf(eligibleProfessors[0].grade) <=
                  gradeOrder.indexOf(alternativeProfs[0].grade)
                ) {
                  president = eligibleProfessors[0]
                  member = alternativeProfs[0]
                } else {
                  president = alternativeProfs[0]
                  member = eligibleProfessors[0]
                }
              } else {
                //1) else: there are no professors in the same field but they reach the min charge
                //1-1) check if there are professors that are not in the same fields but they reach the min charge
                const alternativeProfs = await Professor.find({
                  _id: { $ne: thesisSupervisor._id },
                  fields: { $nin: thesis.field },
                  nbr_of_examined_theses: { $gte: minCharge },
                })
                if (alternativeProfs.length > 0) {
                  //1) sort the AP in ascending order by (number of examined theses)
                  alternativeProfs.sort(
                    (a, b) =>
                      a.nbr_of_examined_theses - b.nbr_of_examined_theses,
                  )
                  //2) check if the grade of the professor that has the minimal charge is greather then the EP[0]
                  if (
                    gradeOrder.indexOf(eligibleProfessors[0].grade) <=
                    gradeOrder.indexOf(alternativeProfs[0].grade)
                  ) {
                    president = eligibleProfessors[0]
                    member = alternativeProfs[0]
                  } else {
                    president = alternativeProfs[0]
                    member = eligibleProfessors[0]
                  }
                } else {
                  //1-2) else : error! ask the admin to add a professor
                  return res.status(403).json({
                    status: 'fail',
                    message:
                      'opps ! missing alternative professor please insert one to generate the juries',
                  })
                }
              }
            } else {
              //1-2) else : error! ask the admin to add a professor
              // notes : to prevent generating juries only from other fields an they reach the min charge
              // the admin needs to add professor that is either in the same field or not but at least he didn't reach the min charge
              return res.status(403).json({
                status: 'fail',
                message:
                  'opps ! missing alternative professor please insert one to generate the juries',
              })
            }
          }
        }
      }

      // increase the number of examinated theses for the president and member.
      president.nbr_of_examined_theses++
      member.nbr_of_examined_theses++
      await president.save()
      await member.save()

      //find the binome who chose this thesis
      const binome = await Binome.findOne({
        ApprovedThesis: thesis._id,
      })
      // create the jury of this thesis
      const jury = await Jury.create({
        professor1: president._id,
        professor2: member._id,
        thesis: thesis._id,
        binome: binome._id,
      })
      // juries.push(jury)
      //add juty reference to thesis:
      thesis.jury = jury._id
      await thesis.save()
    }
  } else {
    return res.status(403).json({
      status: 'fail',
      message:
        'opps! there is no affected theses ! you cannot generate juries now ',
    })
  }

  // const juries = await Jury.find()
  res.status(200).json({
    status: 'success',
  })
}
exports.getJury = async (req, res) => {
  const juryId = req.params.id
  const jury = await Jury.findById(juryId)
  const thesisId = jury.thesis
  const professors = await Professor.find({
    theses: { $nin: [thesisId] },
  }).sort({ nbr_of_examined_theses: 1 }) // condition : exclude the superisor of the thesis
  res.status(200).render('Admin-modifier-jury', {
    layout: 'Admin-nav-bar',
    jury,
    professors,
  })
}
exports.updateJury = async (req, res) => {
  try {
    const juryId = req.params.id
    const { professor1, professor2 } = req.body
    if (professor1.toString() === professor2.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'opps! you are selecting the same professors. try again',
      })
    }
    const jury = await Jury.findById(juryId).populate('professor1 professor2')
    // Determine if professors have changed
    const professor1Changed =
      jury.professor1._id.toString() !== professor1.toString()
    const professor2Changed =
      jury.professor2._id.toString() !== professor2.toString()

    // Update the professors' examined theses count
    if (professor1Changed) {
      await updateExaminedThesesCount(jury.professor1._id, -1) // Decrement the count for the old professor
      await updateExaminedThesesCount(professor1, 1) // Increment the count for the new professor
    }

    if (professor2Changed) {
      await updateExaminedThesesCount(jury.professor2._id, -1) // Decrement the count for the old professor
      await updateExaminedThesesCount(professor2, 1) // Increment the count for the new professor
    }
    // Update the jury with the new professors
    const updatedJury = await Jury.findByIdAndUpdate(juryId, req.body, {
      new: true,
    })

    res.status(200).json({
      status: 'success',
      updatedJury,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}
exports.resetJuries = async (req, res) => {
  const planning = await ThesisDefence.find()
  if (planning.length > 0) {
    return res.status(403).json({
      status: 'fail',
      message: 'you cannor reset juries , planning is already generated',
    })
  }
  // remove all juries
  await Jury.deleteMany({})
  // set the number of examined theses to 0 for each professor
  await Professor.updateMany({}, { $set: { nbr_of_examined_theses: 0 } })
  // remove the jury reference from theses
  await Thesis.updateMany({}, { $unset: { jury: 1 } })
  res.status(201).json({
    status: 'success',
    message: 'juries reset successfully..',
  })
}
// Function to update the examined theses count for a professor
async function updateExaminedThesesCount(professorId, incrementBy) {
  await Professor.findByIdAndUpdate(professorId, {
    $inc: { nbr_of_examined_theses: incrementBy },
  })
}
//-------------------------------
exports.getAllSlots = async (req, res) => {
  const slots = await Slot.find()
  res.status(200).render('Admin-liste-creneau', {
    layout: 'Admin-nav-bar',
    slots,
  })
}

exports.generateSlots = async (req, res) => {
  // Récupérer toutes les sessions de la base de données
  const sessions = await Session.find()
  if (sessions.length < 0) {
    return res.status(403).json({
      status: 'fail',
      message:
        'you cannot perform this action , you need to create session first',
    })
  }
  // Parcourir chaque session (il y en a que deux)
  for (const session of sessions) {
    const slots = []

    const startDate = moment(session.startSession)
    const endDate = moment(session.endSession)

    // Parcourir tous les jours entre la date de début et la date de fin de la session
    for (let date = startDate; date.isBefore(endDate); date.add(1, 'day')) {
      // Exclure les vendredis
      if (date.isoWeekday() !== 5 && date.isoWeekday() !== 6) {
        // 5 et 6 correspond au vendredi et samedi
        const dayStartTime = moment(
          `${date.format('YYYY-MM-DD')}T${session.startDayHour}`,
        )
        const dayEndTime = moment(
          `${date.format('YYYY-MM-DD')}T${session.endDayHour}`,
        )
        // Générer les créneaux horaires pour la journée
        for (
          let slotStart = moment(dayStartTime);
          slotStart.isBefore(dayEndTime);
          slotStart.add(
            session.thesisDefenceDuration + session.break,
            'minutes',
          )
        ) {
          const slotEnd = moment(slotStart).add(
            session.thesisDefenceDuration,
            'minutes',
          )

          // Vérifier si le créneau ne dépasse pas l'heure de fin de la journée
          if (slotEnd.isBefore(dayEndTime)) {
            slots.push({
              date: date.toDate(),
              startHour: slotStart.format('HH:mm'),
              endHour: slotEnd.format('HH:mm'),
              sessionType: session.sessionType,
            })
          }
        }
      }
    }

    // Enregistrer les créneaux dans la base de données
    await Slot.insertMany(slots)
  }

  slots = await Slot.find()
  res.status(200).redirect('/admin/slots')
}
//------------------------------------
exports.getAllPlanning = async (req, res) => {
  const defences = await ThesisDefence.find()
  const normal_defences = defences.filter(
    (elm) => elm.slot.sessionType === 'normal',
  )
  const retake_defences = defences.filter(
    (elm) => elm.slot.sessionType === 'retake',
  )

  res.status(200).render('Admin-planning', {
    layout: 'admin-nav-bar',
    normal_defences,
    retake_defences,
  })
}

// exports.generatePlanning = async (req, res) => {
//   try {
//     //----------- Step 1: fetch all the available slots and premises
//     const slots = await Slot.find({ sessionType: 'normal' })
//     const premises = await Premise.find()
//     //----------fetch the maximal number of thesis that can be presented at the same time:
//     const session = await Session.find({ sessionType: 'normal' })
//     const max = session.slot_nbr_theses
//     //----------- Step 2:fetch all the theses with their professors and juries
//     const theses = await Thesis.find({
//       affected: true,
//       affectedToPlanning: false,
//     }).populate('professor jury')
//     //--------------- HANDLING ERRORS CASES :-----------------
//     //--------------------------------------------------------
//     // Check if there are premises available
//     if (premises.length === 0) {
//       return res.status(400).json({
//         status: 'fail',
//         message:
//           'No premises available. Please add premises before generating the planning.',
//       })
//     }
//     // Check if there are slots available
//     if (slots.length === 0) {
//       return res.status(400).json({
//         status: 'fail',
//         message:
//           'No slots available. Please generate slots before generating the planning.',
//       })
//     }
//     // Check if there are theses available
//     if (theses.length === 0) {
//       return res.status(400).json({
//         status: 'fail',
//         message:
//           'No slots theses. Please check affected theses before generating the planning.',
//       })
//     }
//     //----------------------------------------------------------------------
//     //------------ Step 3: Generate non-availabilities array for each thesis
//     const thesisNonAvailabilities = theses.map((thesis) => {
//       const nonAvailabilities = []
//       nonAvailabilities.push(...thesis.professor.nonAvailibility) // Non-availabilities of supervisor
//       if (thesis.jury) {
//         nonAvailabilities.push(...thesis.jury.professor1.nonAvailibility) // Non-availabilities of jury member 1
//         nonAvailabilities.push(...thesis.jury.professor2.nonAvailibility) // Non-availabilities of jury member 2
//       }
//       return {
//         thesisId: thesis._id,
//         nonAvailabilities,
//         affectedToPlanning: thesis.affectedToPlanning,
//         supervisor: thesis.professor,
//         juryMember1: thesis.jury.professor1,
//         juryMember2: thesis.jury.professor2,
//       }
//     })
//     //------------ Step 4 : iterate slots: assign theses to slots
//     let affectedLength = theses.length
//     let assignedTheses = new Set() // Set to keep track of assigned theses
//     for (const slot of slots) {
//       if (affectedLength <= 0) break // If all theses are assigned, exit the loop
//       if (slot.nbr_thesis >= max) continue // If the slot is full, skip to the next slot

//       for (const thesis of thesisNonAvailabilities) {
//         if (affectedLength <= 0) break // If all theses are assigned, exit the loop
//         if (slot.nbr_thesis >= max) break // If the slot is full, skip to the next slot
//         if (
//           thesis.affectedToPlanning === false &&
//           !assignedTheses.has(thesis.thesisId)
//         ) {
//           const thesisId = thesis.thesisId
//           const nonAvailabilities = thesis.nonAvailabilities
//           const slotDate = slot.date
//           const thesisMembers = [
//             thesis.supervisor._id,
//             thesis.juryMember1._id,
//             thesis.juryMember2._id,
//           ]
//           //check if there is a thesisDefence with this slot :
//           const currentThesisDefence = await ThesisDefence.find({
//             slot: slot._id,
//           })
//           // console.log(currentThesisDefence.length)
//           if (currentThesisDefence.length > 0) {
//             for (const thesisD of currentThesisDefence) {
//               const existingThesis = await Thesis.findOne({
//                 _id: thesisD.thesis,
//               })
//               const existingSupervisor = existingThesis.professor._id
//               const existingJuryMember1 = existingThesis.jury.professor1._id
//               const existingJuryMember2 = existingThesis.jury.professor2._id

//               const existingThesisMembers = [
//                 existingSupervisor,
//                 existingJuryMember1,
//                 existingJuryMember2,
//               ]
//               // Check if the supervisor or any jury member of thesisMembers is in conflicts with existing thesis defense members
//               const conflict = existingThesisMembers.some((member) => {
//                 return thesisMembers
//                   .map((id) => id.toString())
//                   .includes(member.toString())
//               })
//               if (conflict) {
//                 // Handle conflict by skipping the current slot
//                 // console.log(
//                 //   `Conflict found with thesis defense: ${thesisD._id}`,
//                 // )
//                 continue
//               } else {
//                 // Check if the slot falls between any non-availability
//                 const slotFallsBetweenNonAvailability = nonAvailabilities.some(
//                   (nonAvailability) => {
//                     const startDay = new Date(nonAvailability.startDay)
//                     const endDay = new Date(nonAvailability.endDay)
//                     return slotDate >= startDay && slotDate < endDay
//                   },
//                 )

//                 if (!slotFallsBetweenNonAvailability) {
//                   const thesisDefence = await ThesisDefence.create({
//                     thesis: thesisId,
//                     slot: slot._id,
//                   })

//                   slot.nbr_thesis++
//                   assignedTheses.add(thesisId) // Add the assigned thesis to the set
//                   await slot.save()
//                   await Thesis.findByIdAndUpdate(
//                     thesisId,
//                     { affectedToPlanning: true },
//                     { new: true },
//                   )
//                   affectedLength--
//                 }
//               }
//             }
//           } else {
//             // Check if the slot falls between any non-availability
//             const slotFallsBetweenNonAvailability = nonAvailabilities.some(
//               (nonAvailability) => {
//                 const startDay = new Date(nonAvailability.startDay)
//                 const endDay = new Date(nonAvailability.endDay)
//                 return slotDate >= startDay && slotDate < endDay
//               },
//             )

//             if (!slotFallsBetweenNonAvailability) {
//               const thesisDefence = await ThesisDefence.create({
//                 thesis: thesisId,
//                 slot: slot._id,
//               })

//               slot.nbr_thesis++
//               assignedTheses.add(thesisId) // Add the assigned thesis to the set
//               await slot.save()
//               await Thesis.findByIdAndUpdate(
//                 thesisId,
//                 { affectedToPlanning: true },
//                 { new: true },
//               )
//               affectedLength--
//             }
//           }
//         }
//       }
//     }
//     //----------------------------------------------
//     const thesesDefence = await ThesisDefence.find()
//     let premiseIndex = 0
//     // ----------- Step 5 : iterate thesesDefence : assign the premises to thesis defence
//     for (const thesisDef of thesesDefence) {
//       if (premiseIndex >= premises.length) {
//         // Reset the premise index if it exceeds the length of premises
//         premiseIndex = 0
//       }

//       const premise = premises[premiseIndex]

//       // Check if the current premise is already assigned to a ThesisDefence with the same slot
//       const existingThesisDefWithSameSlotAndPremise = await ThesisDefence.findOne(
//         {
//           slot: thesisDef.slot,
//           premise: premise._id,
//         },
//       )

//       if (!existingThesisDefWithSameSlotAndPremise) {
//         // If no ThesisDefence document exists with the same slot and premise, assign the premise
//         thesisDef.premise = premise._id
//         await thesisDef.save()
//         premiseIndex++ // Move to the next premise
//       } else {
//         // If there is a ThesisDefence with the same slot and premise, move to the next premise without assigning
//         premiseIndex++
//       }
//     }
//     const planning = await ThesisDefence.find()
//     res.status(200).json({
//       length: planning.length,
//       status: 'success',
//       message: 'Thesis defence documents created successfully.',
//       planning,
//     })
//   } catch (err) {
//     console.error('Error creating thesis defence documents:', err)
//     res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while generating planning.',
//     })
//   }
// }
//-------------- generate planning (noraml + reported session ) -----------
exports.generatePlanning = async (req, res) => {
  try {
    // Step 1: Fetch premises and max number of theses per slot
    const premises = await Premise.find()
    const normalSession = await Session.findOne({ sessionType: 'normal' })
    const retakeSession = await Session.findOne({ sessionType: 'retake' })

    if (!normalSession || !retakeSession) {
      return res.status(400).json({
        status: 'fail',
        message: 'No session information found for normal or retake sessions.',
      })
    }

    const max = normalSession.slot_nbr_theses // Assuming both sessions have the same max

    // Function to generate planning for a session type
    const generatePlanningForSession = async (sessionType) => {
      // Step 2: Fetch available slots and theses for the session type
      const slots = await Slot.find({ sessionType })
      const theses = await Thesis.find({
        affected: true,
        affectedToPlanning: false,
        session:
          sessionType === 'normal' ? normalSession._id : retakeSession._id,
      }).populate('professor jury')

      // Handle error cases
      if (premises.length === 0) {
        return {
          status: 'fail',
          message:
            'No premises available. Please add premises before generating the planning.',
        }
      }

      if (slots.length === 0) {
        return {
          status: 'fail',
          message: `No slots available for ${sessionType} session. Please generate slots before generating the planning.`,
        }
      }

      if (theses.length === 0) {
        return {
          status: 'fail',
          message: `No theses available for ${sessionType} session. Please check affected theses before generating the planning.`,
        }
      }

      // Step 3: Generate non-availabilities array for each thesis
      const thesisNonAvailabilities = theses.map((thesis) => {
        const nonAvailabilities = []
        nonAvailabilities.push(...thesis.professor.nonAvailibility) // Non-availabilities of supervisor
        if (thesis.jury) {
          nonAvailabilities.push(...thesis.jury.professor1.nonAvailibility) // Non-availabilities of jury member 1
          nonAvailabilities.push(...thesis.jury.professor2.nonAvailibility) // Non-availabilities of jury member 2
        }
        return {
          thesisId: thesis._id,
          nonAvailabilities,
          affectedToPlanning: thesis.affectedToPlanning,
          supervisor: thesis.professor,
          juryMember1: thesis.jury.professor1,
          juryMember2: thesis.jury.professor2,
        }
      })

      // Step 4: Iterate slots and assign theses to slots
      let affectedLength = theses.length
      let assignedTheses = new Set() // Set to keep track of assigned theses

      for (const slot of slots) {
        if (affectedLength <= 0) break // If all theses are assigned, exit the loop
        if (slot.nbr_thesis >= max) continue // If the slot is full, skip to the next slot

        for (const thesis of thesisNonAvailabilities) {
          if (affectedLength <= 0) break // If all theses are assigned, exit the loop
          if (slot.nbr_thesis >= max) break // If the slot is full, skip to the next slot
          if (
            thesis.affectedToPlanning === false &&
            !assignedTheses.has(thesis.thesisId)
          ) {
            const thesisId = thesis.thesisId
            const nonAvailabilities = thesis.nonAvailabilities
            const slotDate = slot.date
            const thesisMembers = [
              thesis.supervisor._id,
              thesis.juryMember1._id,
              thesis.juryMember2._id,
            ]

            // Check if there is a thesisDefence with this slot
            const currentThesisDefence = await ThesisDefence.find({
              slot: slot._id,
            })

            if (currentThesisDefence.length > 0) {
              for (const thesisD of currentThesisDefence) {
                const existingThesis = await Thesis.findOne({
                  _id: thesisD.thesis,
                })
                const existingSupervisor = existingThesis.professor._id
                const existingJuryMember1 = existingThesis.jury.professor1._id
                const existingJuryMember2 = existingThesis.jury.professor2._id

                const existingThesisMembers = [
                  existingSupervisor,
                  existingJuryMember1,
                  existingJuryMember2,
                ]

                // Check if the supervisor or any jury member of thesisMembers is in conflicts with existing thesis defense members
                const conflict = existingThesisMembers.some((member) => {
                  return thesisMembers
                    .map((id) => id.toString())
                    .includes(member.toString())
                })
                if (conflict) {
                  continue // Handle conflict by skipping the current slot
                } else {
                  // Check if the slot falls between any non-availability
                  const slotFallsBetweenNonAvailability = nonAvailabilities.some(
                    (nonAvailability) => {
                      const startDay = new Date(nonAvailability.startDay)
                      const endDay = new Date(nonAvailability.endDay)
                      return slotDate >= startDay && slotDate < endDay
                    },
                  )

                  if (!slotFallsBetweenNonAvailability) {
                    await ThesisDefence.create({
                      thesis: thesisId,
                      slot: slot._id,
                    })

                    slot.nbr_thesis++
                    assignedTheses.add(thesisId) // Add the assigned thesis to the set
                    await slot.save()
                    await Thesis.findByIdAndUpdate(
                      thesisId,
                      { affectedToPlanning: true },
                      { new: true },
                    )
                    affectedLength--
                  }
                }
              }
            } else {
              // Check if the slot falls between any non-availability
              const slotFallsBetweenNonAvailability = nonAvailabilities.some(
                (nonAvailability) => {
                  const startDay = new Date(nonAvailability.startDay)
                  const endDay = new Date(nonAvailability.endDay)
                  return slotDate >= startDay && slotDate < endDay
                },
              )

              if (!slotFallsBetweenNonAvailability) {
                await ThesisDefence.create({
                  thesis: thesisId,
                  slot: slot._id,
                })

                slot.nbr_thesis++
                assignedTheses.add(thesisId) // Add the assigned thesis to the set
                await slot.save()
                await Thesis.findByIdAndUpdate(
                  thesisId,
                  { affectedToPlanning: true },
                  { new: true },
                )
                affectedLength--
              }
            }
          }
        }
      }

      // Step 5: Iterate through thesesDefence and assign premises
      const thesesDefence = await ThesisDefence.find({
        slot: { $in: slots.map((s) => s._id) },
      })
      let premiseIndex = 0
      for (const thesisDef of thesesDefence) {
        if (premiseIndex >= premises.length) {
          premiseIndex = 0 // Reset the premise index if it exceeds the length of premises
        }

        const premise = premises[premiseIndex]

        // Check if the current premise is already assigned to a ThesisDefence with the same slot
        const existingThesisDefWithSameSlotAndPremise = await ThesisDefence.findOne(
          {
            slot: thesisDef.slot,
            premise: premise._id,
          },
        )

        if (!existingThesisDefWithSameSlotAndPremise) {
          // If no ThesisDefence document exists with the same slot and premise, assign the premise
          thesisDef.premise = premise._id
          await thesisDef.save()
          premiseIndex++ // Move to the next premise
        } else {
          // If there is a ThesisDefence with the same slot and premise, move to the next premise without assigning
          premiseIndex++
        }
      }

      const planning = await ThesisDefence.find({
        slot: { $in: slots.map((s) => s._id) },
      })
      return {
        status: 'success',
        message: `${sessionType} thesis defence documents created successfully.`,
        planning,
      }
    }

    // Generate planning for both normal and retake sessions
    const normalPlanning = await generatePlanningForSession('normal')
    const retakePlanning = await generatePlanningForSession('retake')
    console.log('---------------------')
    console.log(normalPlanning)
    console.log('---------------------')
    console.log('---------------------')
    console.log(retakePlanning)
    console.log('---------------------')
    // Return combined result
    res.status(200).json({
      normalPlanning,
      retakePlanning,
    })
  } catch (err) {
    console.error('Error creating thesis defence documents:', err)
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la génération du planning, nous vous invitons à vérifier que toutes les étapes qui précèdent le planning sont faites.',
    })
  }
}

//----------------------------------
exports.resetPlanning = async (req, res) => {
  // remove all ThesisDefence
  await ThesisDefence.deleteMany({})
  //slots
  await Slot.updateMany({}, { $set: { nbr_thesis: 0 } })
  // remove the jury reference from theses
  await Thesis.updateMany({}, { $set: { affectedToPlanning: false } })
  res.status(201).json({
    status: 'success',
    message: 'ThesisDefence reset successfully..',
  })
}
//---------------Juba Générate Planning :-------------
