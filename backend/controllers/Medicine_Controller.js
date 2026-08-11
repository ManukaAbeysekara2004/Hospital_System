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
const medicine = require('../models/Medicine');
const medicineBill = require('../models/Medicine_Bill');
const bcrypt = require('bcryptjs');

// ------------------------ Medicine ------------------------//

// 01 Add Medicine //
//-----------------//

exports.add_Medicine = async (req, res) => {
    try {
        const { MedicineName, Quantity, Price } = req.body;

        const medicine = new medicine({
            MedicineName,
            Quantity,
            Price
        });

        await medicine.save();

        res.status(201).json({ message: "Medicine added successfully", medicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to add medicine", error });
    }
};


// 02. Update Quantity //
//---------------------//

exports.update_Medicine_Quantity = async (req, res) => {
    try {
        const { MedicineID } = req.params;
        const { Quantity } = req.body;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        medicine.Quantity = Quantity;

        await medicine.save();

        res.status(200).json({ message: "Medicine quantity updated successfully", medicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine quantity", error });
    }
};


// 03. Update the UnitPrice //
//--------------------------//

exports.update_Medicine_UnitPrice = async (req, res) => {
    try {
        const { MedicineID } = req.params;
        const { UnitPrice } = req.body;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        medicine.UnitPrice = UnitPrice;

        await medicine.save();

        res.status(200).json({ message: "Medicine unit price updated successfully", medicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine unit price", error });
    }
};


// 04. Get the UnitPrice //
//-----------------------//

exports.get_UnitPrice = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ UnitPrice: medicine.UnitPrice });
    } catch (error) {
        res.status(500).json({ message: "Failed to get unit price", error });
    }
};


// 05. Get the Quantity //
//----------------------//

exports.get_Quantity = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ Quantity: medicine.Quantity });
    } catch (error) {
        res.status(500).json({ message: "Failed to get quantity", error });
    }
};


// 06. Delete Medicine //
//---------------------//

exports.delete_Medicine = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        await medicine.deleteOne();

        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete medicine", error });
    }
};


// 07. Get the All Medicine Details //
//----------------------------------//

exports.get_All_Medicine_Details = async (req, res) => {
    try {
        const medicines = await medicine.find();

        if (!medicines) {
            return res.status(404).json({ message: "No medicines found" });
        }

        res.status(200).json({ medicines });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine details", error });
    }
};


// 08. Get Medicine Details by TabletName //
//----------------------------------------//

exports.get_Medicine_Details = async (req, res) => {
    try {
        const { TabletName } = req.body;

        const medicine = await medicine.findOne({ TabletName });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ medicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to get medicine details", error });
    }
};


// ------------------------ Medicine Bill ------------------------//

// 09. Create Medicine Bill //
//--------------------------//

exports.create_Medicine_Bill = async (req, res) => {
    try {
        const { PatientID, DoctorID } = req.params;

        const medicineBill = new medicineBill({
            PatientID,
            DoctorID
        });

        await medicineBill.save();

        res.status(201).json({ message: "Medicine bill created successfully", medicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to create medicine bill", error });
    }
};


// 10. Delete Medicine Bill //
//--------------------------//

exports.delete_Medicine_Bill = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;

        const medicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!medicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        await medicineBill.deleteOne();

        res.status(200).json({ message: "Medicine bill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete medicine bill", error });
    }
};


// 11. Add new Medicine to the Medicine Bill //
//-------------------------------------------//

exports.add_Medicine_to_Bill = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;
        const { MedicineID, Quantity } = req.body;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        if (medicine.Quantity < Quantity) {
            return res.status(404).json({ message: "Medicine quantity is short" });
        }

        const medicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!medicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        medicineBill.Added_Medicines.push({
            MedicineName: medicine.TabletName,
            Quantity,
            Price: medicine.UnitPrice * Quantity,
            Added: true
        });

        medicineBill.Total_Bill += medicine.UnitPrice * Quantity;

        await medicineBill.save();

        res.status(200).json({ message: "Medicine added to bill successfully", medicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to add medicine to bill", error });
    }
};


// 12. If Medicine Quantity is Short Than Medicine_Bill Quantity //
//---------------------------------------------------------------//

exports.update_Medicine_Quantity_Short = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;
        const { MedicineID, Quantity } = req.body;

        const medicine = await medicine.findOne({ MedicineID });

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const medicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!medicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        medicineBill.Added_Medicines.push({
            MedicineName: medicine.TabletName,
            Quantity,
            Price: 0,
            Added: false
        });

        await medicineBill.save();

        res.status(200).json({ message: "Medicine added to bill successfully", medicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to add medicine to bill", error });
    }
};


// 13. Update Complete Status //
//----------------------------//

exports.update_Complete_Status = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;

        const medicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!medicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        medicineBill.CompleteStatus = true;

        await medicineBill.save();

        res.status(200).json({ message: "Medicine bill updated successfully", medicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine bill", error });
    }
};


// 14. Get All CompleteStatus True Medicine Bill with patient and Doctore Details //
//--------------------------------------------------------------------------------//

exports.get_Complete_Status_True_Medicine_Bill = async (req, res) => {
    try {
        const complete_Status_True_MedicineBill = await medicineBill.find({ CompleteStatus: true });

        if (!complete_Status_True_MedicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        const existingPatient = await patient.findById(complete_Status_True_MedicineBill.PatientID);

        const existingDoctor = await doctor.findById(complete_Status_True_MedicineBill.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ 
            message: "Medicine bill found successfully",
            complete_Status_True_MedicineBill,
            existingPatient,
            existingDoctor
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};


// 15. Get All CompleteStatus False Medicine Bill with patient and Doctore Details //
//---------------------------------------------------------------------------------//

exports.get_Complete_Status_False_Medicine_Bill = async (req, res) => {
    try {
        const complete_Status_False_MedicineBill = await medicineBill.find({ CompleteStatus: false });

        if (!complete_Status_False_MedicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        const existingPatient = await patient.findById(complete_Status_False_MedicineBill.PatientID);

        const existingDoctor = await doctor.findById(complete_Status_False_MedicineBill.DoctorID).select("FullName PhoneNumber");

        res.status(200).json({ 
            message: "Medicine bill found successfully",
            complete_Status_False_MedicineBill,
            existingPatient,
            existingDoctor
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};


// 16. Get All Medicine bills By DoctorID //
//----------------------------------------//

exports.get_Medicine_Bills_By_DoctorID = async (req, res) => {
    try {
        const { DoctorID } = req.params;

        const medicineBills = await medicineBill.find({ DoctorID });

        if (!medicineBills) {
            return res.status(404).json({ message: "Medicine bills not found" });
        }

        res.status(200).json({ 
            message: "Medicine bills found successfully",
            medicineBills
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};


// 17. Get All Medicine bills By PatientID //
//-----------------------------------------//

exports.get_Medicine_Bills_By_PatientID = async (req, res) => {
    try {
        const { PatientID } = req.params;

        const medicineBills = await medicineBill.find({ PatientID });

        if (!medicineBills) {
            return res.status(404).json({ message: "Medicine bills not found" });
        }

        res.status(200).json({ 
            message: "Medicine bills found successfully",
            medicineBills
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};