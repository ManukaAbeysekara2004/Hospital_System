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
const bloodTest = require('../models/Blood_Test');
const urineTest = require('../models/Urine_Test');
const bcrypt = require('bcryptjs');

// 01. Create Nurse Works //
//------------------------//

exports.Create_Nurse_Works = async (req, res) => {
    try {

        const { NurseID, PatientID } = req.params;

        const { Works } = req.body;

        // --- Check if Nurse exists --- //
        const existingNurse = await nurse.findById(NurseID);

        if (!existingNurse) {
            return res.status(404).json({
                message: "Nurse not found"
            });
        }

        // --- Check if Patient exists --- //
        const existingPatient = await patient.findById(PatientID);

        if (!existingPatient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // --- Check existingNurse InWork in Nurse model --- //
        if (existingNurse.InWork) {
            return res.status(400).json({
                message: "Nurse is already in work"
            });
        } else {
            // --- Update Nurse InWork to True --- //
            existingNurse.InWork = true;
            await existingNurse.save();
        }

        // --- Save Nurse Works --- //
        const newNurseWorks = new nurseWorks({
            NurseID,
            PatientID,
            Works
        });

        await newNurseWorks.save();

        res.status(201).json({
            message: "Work assigned successfully",
            newNurseWorks
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 02. Change Work Done Status //
//-----------------------------//

exports.Update_Nurse_Work = async (req, res) => {
    try {

        const { NurseWorkID, WorkID } = req.params;
        const { Done } = req.body;

        // --- Check Nurse Work exists --- //
        const existingNurseWork = await nurseWorks.findById(NurseWorkID);

        if (!existingNurseWork) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Find specific work --- //
        const existingWork = existingNurseWork.Works.id(WorkID);

        if (!existingWork) {
            return res.status(404).json({
                message: "Work not found"
            });
        }

        // --- Validate Done value --- //
        if (typeof Done !== "boolean") {
            return res.status(400).json({
                message: "Done must be true or false"
            });
        }

        // --- Update only Done --- //
        existingWork.Done = Done;

        await existingNurseWork.save();

        res.status(200).json({
            message: "Work status updated successfully",
            existingNurseWork
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 03. Update AllDone //
//--------------------//

exports.Update_AllDone = async (req, res) => {
    try {

        const { NurseWorkID } = req.params;
        const { AllDone } = req.body;

        // --- Check Nurse Work exists --- //
        const existingNurseWork = await nurseWorks.findById(NurseWorkID);

        if (!existingNurseWork) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Validate AllDone value --- //
        if (typeof AllDone !== "boolean") {
            return res.status(400).json({
                message: "AllDone must be true or false"
            });
        }

        // --- Update AllDone --- //
        existingNurseWork.AllDone = AllDone;

        await existingNurseWork.save();

        res.status(200).json({
            message: "AllDone status updated successfully",
            existingNurseWork
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 04. Add New Work //
//------------------//

exports.Add_New_Work = async (req, res) => {
    try {

        const { NurseWorkID } = req.params;
        const { Work } = req.body;

        // --- Check Nurse Work exists --- //
        const existingNurseWork = await nurseWorks.findById(NurseWorkID);

        if (!existingNurseWork) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Check existingNurseWork AllDone --- //
        if (existingNurseWork.AllDone) {
            return res.status(400).json({
                message: "Nurse work is already done"
            });
        }

        // --- Add New Work --- //
        existingNurseWork.Works.push({
            Work,
            Done: false
        });

        await existingNurseWork.save();

        res.status(200).json({
            message: "New work added successfully",
            existingNurseWork
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 05. Delete Work //
//-----------------//

exports.Delete_Work = async (req, res) => {
    try {

        const { NurseWorkID } = req.params;
        const { WorkID } = req.body;

        // --- Check Nurse Work exists --- //
        const existingNurseWork = await nurseWorks.findById(NurseWorkID);

        if (!existingNurseWork) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Find specific work --- //
        const existingWork = existingNurseWork.Works.id(WorkID);

        if (!existingWork) {
            return res.status(404).json({
                message: "Work not found"
            });
        }

        // --- Delete Work --- //
        existingWork.remove();

        await existingNurseWork.save();

        res.status(200).json({
            message: "Work deleted successfully",
            existingNurseWork
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}


// 06. Get Nurse Work Details with all pation details and Nurse Name //
//-------------------------------------------------------------------//

exports.Get_Nurse_Work_Details = async (req, res) => {
    try {

        const { NurseWorkID } = req.params;

        // --- Check Nurse Work exists --- //
        const existingNurseWork = await nurseWorks.findById(NurseWorkID);

        if (!existingNurseWork) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(existingNurseWork.PatientID);

        // --- Get Nurse Name --- //
        const existingNurse = await nurse.findById(existingNurseWork.NurseID).select("FullName");

        res.status(200).json({
            message: "Nurse work details fetched successfully",
            existingNurseWork,
            existingPatient,
            existingNurse
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 07. Get All AllDone true Nurse Works //
//--------------------------------------//

exports.Get_All_AllDone_true_Nurse_Works = async (req, res) => {
    try {

        // --- Find All AllDone true Nurse Works --- //

        const AllDoneTrueNurseWorks = await nurseWorks.find({ AllDone: true });

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(AllDoneTrueNurseWorks.PatientID);

        // --- Get Nurse Name --- //
        const existingNurse = await nurse.findById(AllDoneTrueNurseWorks.NurseID).select("FullName");

        res.status(200).json({
            message: "AllDone true Nurse Works fetched successfully",
            AllDoneTrueNurseWorks,
            existingPatient,
            existingNurse
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 08. Get All AllDone false Nurse Works //
//---------------------------------------//

exports.Get_All_AllDone_false_Nurse_Works = async (req, res) => {
    try {

        // --- Find All AllDone false Nurse Works --- //

        const AllDoneFalseNurseWorks = await nurseWorks.find({ AllDone: false });

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(AllDoneFalseNurseWorks.PatientID);

        // --- Get Nurse Name --- //
        const existingNurse = await nurse.findById(AllDoneFalseNurseWorks.NurseID).select("FullName");

        res.status(200).json({
            message: "AllDone false Nurse Works fetched successfully",
            AllDoneFalseNurseWorks,
            existingPatient,
            existingNurse
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 09. Get Nurse_Work By NurseId //
//-------------------------------//

exports.Get_Nurse_Work_By_NurseId = async (req, res) => {
    try {

        const { NurseID } = req.params;

        // --- Find Nurse_Work by NurseId --- //

        const nurse_work = await nurseWorks.find({ NurseID });

        // --- Check Nurse_Work exists --- //
        if (!nurse_work) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(nurse_work.PatientID);

        // --- Get Nurse Name --- //
        const existingNurse = await nurse.findById(nurse_work.NurseID).select("FullName");

        res.status(200).json({
            message: "Nurse_Work by NurseId fetched successfully",
            nurse_work,
            existingPatient,
            existingNurse
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// 10. Get Nurse_Work By Patient_ID //
//----------------------------------//

exports.Get_Nurse_Work_By_Patient_ID = async (req, res) => {
    try {

        const { Patient_ID } = req.params;

        // --- Find Nurse_Work by Patient_ID --- //

        const nurse_work = await nurseWorks.find({ PatientID: Patient_ID });

        // --- Check Nurse_Work exists --- //
        if (!nurse_work) {
            return res.status(404).json({
                message: "Nurse work not found"
            });
        }

        // --- Get Patient Details --- //
        const existingPatient = await patient.findById(nurse_work.PatientID);

        // --- Get Nurse Name --- //
        const existingNurse = await nurse.findById(nurse_work.NurseID).select("FullName");

        res.status(200).json({
            message: "Nurse_Work by Patient_ID fetched successfully",
            nurse_work,
            existingPatient,
            existingNurse
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};