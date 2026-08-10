const accountant = require('../models/Accountant');
const admin = require('../models/Admin');
const doctor = require('../models/Doctor');
const laboratory_staff = require('../models/Laboratory_Staff');
const nurse = require('../models/Nurse');
const pharmacist = require('../models/Pharmacist');
const receptionist = require('../models/Receptionist');
const patient = require('../models/Patient');
const appointment = require('../models/Appointment');
const nurseWorks = require('../models/Nurse_Works');
const bcrypt = require('bcryptjs');

// 01. Add Appointment //
//---------------------//

exports.Add_Appointment = async (req, res) => {
    try {

        const { PatientID, DoctorID } = req.params;

        // --- Check Patient ID --- //
        const existingPatient = await patient.findById(PatientID);
        if (!existingPatient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // --- Check Doctor ID --- //
        const existingDoctor = await doctor.findById(DoctorID);
        if (!existingDoctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // --- Check Doctor Availability --- //
        if (!existingDoctor.InHospitalAvailability) {
            return res.status(403).json({
                message: "Doctor is not available"
            });
        }

        // --- Check Doctor Stop Appointments --- //
        if (existingDoctor.StopAppointments) {
            return res.status(403).json({
                message: "Doctor has stopped appointments"
            });
        }

        // --- Check Number of Appointments --- //
        if (existingDoctor.NoOfAppointments >= 10) {
            return res.status(403).json({
                message: "Doctor has reached maximum number of appointments"
            });
        }

        // --- Create Appointment --- //
        const newAppointment = new appointment({
            PatientID,
            DoctorID
        });

        await newAppointment.save();

        // --- Increment Number of Appointments --- //
        existingDoctor.NoOfAppointments += 1;
        await existingDoctor.save();

        res.status(201).json({
            message: "Appointment created successfully",
            newAppointment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 02. Update Appointment Status //
//-------------------------------//

exports.Update_Appointment_Status = async (req, res) => {
    try {

        const { appointmentId } = req.params;
        const { AppointmentStatus } = req.body;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.findById(appointmentId);
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Update Appointment Status --- //
        existingAppointment.AppointmentStatus = AppointmentStatus;
        await existingAppointment.save();

        res.status(200).json({
            message: "Appointment status updated successfully",
            existingAppointment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 03. Get the Appointment Status //
//--------------------------------//

exports.Get_Appointment_Status_By_ID = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.findById(appointmentId);

        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            message: "Appointment status found successfully",
            existingAppointment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 04. Get All Pending Appointments //
//---------------------------------//

exports.Get_All_Pending_Appointments = async (req, res) => {
    try {

        // --- Get All Pending Appointments --- //
        const allPendingAppointments = await appointment.find({ AppointmentStatus: "Pending" });

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(allPendingAppointments.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(allPendingAppointments.PatientID);

        res.status(200).json({
            message: "All pending appointments",
            allPendingAppointments,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 05. Get All Inprogress Appointments //
//-------------------------------------//

exports.Get_All_Inprogress_Appointments = async (req, res) => {
    try {

        // --- Get All Inprogress Appointments --- //
        const allInprogressAppointments = await appointment.find({ AppointmentStatus: "Inprogress" });

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(allInprogressAppointments.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(allInprogressAppointments.PatientID);

        res.status(200).json({
            message: "All inprogress appointments",
            allInprogressAppointments,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 06. Get All Waiting For Result Appointments //
//---------------------------------------------//

exports.Get_All_Waiting_For_Result_Appointments = async (req, res) => {
    try {

        // --- Get All Waiting For Result Appointments --- //
        const allWaitingForResultAppointments = await appointment.find({ AppointmentStatus: "Waiting For Result" });

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(allWaitingForResultAppointments.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(allWaitingForResultAppointments.PatientID);

        res.status(200).json({
            message: "All waiting for result appointments",
            allWaitingForResultAppointments,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 07. Get All Completed Appointments //
//---------------------------------//

exports.Get_All_Completed_Appointments = async (req, res) => {
    try {

        // --- Get All Completed Appointments --- //
        const allCompletedAppointments = await appointment.find({ AppointmentStatus: "Completed" });

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(allCompletedAppointments.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(allCompletedAppointments.PatientID);

        res.status(200).json({
            message: "All completed appointments",
            allCompletedAppointments,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 08. Get All Cancelled Appointments //
//------------------------------------//

exports.Get_All_Cancelled_Appointments = async (req, res) => {
    try {

        // --- Get All Cancelled Appointments --- //
        const allCancelledAppointments = await appointment.find({ AppointmentStatus: "Cancelled" });

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(allCancelledAppointments.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(allCancelledAppointments.PatientID);

        res.status(200).json({
            message: "All cancelled appointments",
            allCancelledAppointments,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 09. Delete Appointment //
//------------------------//

exports.Delete_Appointment = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.findById(appointmentId);
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        await existingAppointment.deleteOne();

        res.status(200).json({
            message: "Appointment deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 10. Update Doctor Notes //
//------------------------//

exports.Update_Doctor_Notes = async (req, res) => {
    try {

        const { appointmentId } = req.params;
        const { DoctorNote } = req.body;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.findById(appointmentId);
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Update Doctor Notes --- //
        existingAppointment.DoctorNote = DoctorNote;
        await existingAppointment.save();

        res.status(200).json({
            message: "Doctor notes updated successfully",
            existingAppointment,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 11. Get All Appointments By Doctor ID //
//--------------------------------------//

exports.Get_All_Appointments_By_Doctor_ID = async (req, res) => {
    try {

        const { DoctorID } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.find({ DoctorID });
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(existingAppointment.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(existingAppointment.PatientID);

        res.status(200).json({
            message: "Appointment details found successfully",
            existingAppointment,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 12. Get All Appointments By Patient ID //
//----------------------------------------//

exports.Get_All_Appointments_By_Patient_ID = async (req, res) => {
    try {

        const { PatientID } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.find({ PatientID });
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(existingAppointment.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(existingAppointment.PatientID);

        res.status(200).json({
            message: "Appointment details found successfully",
            existingAppointment,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 13. Get All Appointments By Date //
//---------------------------------//

exports.Get_All_Appointments_By_Date = async (req, res) => {
    try {

        const { AppointmentDate } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.find({ AppointmentDate });
        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(existingAppointment.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(existingAppointment.PatientID);

        res.status(200).json({
            message: "Appointment details found successfully",
            existingAppointment,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 14. Get Appointment Details with doctor and patient details //
//-------------------------------------------------------------//

exports.Get_Appointment_Details = async (req, res) => {
    try {

        const { appointmentId } = req.params;

        // --- Check Appointment ID --- //
        const existingAppointment = await appointment.findById(appointmentId);

        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // --- Get Doctor Name and Contact Details --- //
        const existingDoctor = await doctor.findById(existingAppointment.DoctorID).select("FullName PhoneNumber");

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(existingAppointment.PatientID);

        res.status(200).json({
            message: "Appointment details found successfully",
            existingAppointment,
            existingDoctor,
            existingPatient,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}