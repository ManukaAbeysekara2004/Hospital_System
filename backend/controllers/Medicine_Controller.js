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
const payment = require('../models/Payment');
const billPrice = require('../models/Bill_Prices');
const bcrypt = require('bcryptjs');

// ------------------------ Medicine ------------------------//

// 01 Add Medicine //
//-----------------//

exports.add_Medicine = async (req, res) => {
    try {
        const { MedicineName, Quantity, UnitPrice } = req.body;

        const addMedicine = new medicine({
            MedicineName,
            Quantity,
            UnitPrice
        });

        await addMedicine.save();

        res.status(201).json({ message: "Medicine added successfully", addMedicine });
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

        const updateMedicine = await medicine.findOne({ MedicineID });

        if (!updateMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        updateMedicine.Quantity = Quantity;

        await updateMedicine.save();

        res.status(200).json({ message: "Medicine quantity updated successfully", updateMedicine });
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

        const updateMedicine = await medicine.findOne({ MedicineID });

        if (!updateMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        updateMedicine.UnitPrice = UnitPrice;

        await updateMedicine.save();

        res.status(200).json({ message: "Medicine unit price updated successfully", updateMedicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine unit price", error });
    }
};


// 04. Get the UnitPrice //
//-----------------------//

exports.get_UnitPrice = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const getUnitPrice = await medicine.findOne({ MedicineID });

        if (!getUnitPrice) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ UnitPrice: getUnitPrice.UnitPrice });
    } catch (error) {
        res.status(500).json({ message: "Failed to get unit price", error });
    }
};


// 05. Get the Quantity //
//----------------------//

exports.get_Quantity = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const getQuantity = await medicine.findOne({ MedicineID });

        if (!getQuantity) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ Quantity: getQuantity.Quantity });
    } catch (error) {
        res.status(500).json({ message: "Failed to get quantity", error });
    }
};


// 06. Delete Medicine //
//---------------------//

exports.delete_Medicine = async (req, res) => {
    try {
        const { MedicineID } = req.params;

        const deleteMedicine = await medicine.findOne({ MedicineID });

        if (!deleteMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        await deleteMedicine.deleteOne();

        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete medicine", error });
    }
};


// 07. Get the All Medicine Details //
//----------------------------------//

exports.get_All_Medicine_Details = async (req, res) => {
    try {
        const getAllMedicine = await medicine.find();

        if (!getAllMedicine) {
            return res.status(404).json({ message: "No medicines found" });
        }

        res.status(200).json({ getAllMedicine });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine details", error });
    }
};


// 08. Get Medicine Details by TabletName //
//----------------------------------------//

exports.get_Medicine_Details_by_TabletName = async (req, res) => {
    try {
        const { TabletName } = req.body;

        const getMedicineByTabletName = await medicine.findOne({ TabletName });

        if (!getMedicineByTabletName) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ getMedicineByTabletName });
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

        const createMedicineBill = new medicineBill({
            PatientID,
            DoctorID
        });

        await createMedicineBill.save();

        res.status(201).json({ message: "Medicine bill created successfully", createMedicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to create medicine bill", error });
    }
};


// 10. Delete Medicine Bill //
//--------------------------//

exports.delete_Medicine_Bill = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;

        const deleteMedicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!deleteMedicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        await deleteMedicineBill.deleteOne();

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

        const checkMedicine = await medicine.findById(MedicineID);

        if (!checkMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const checkMedicineBill = await medicineBill.findById(MedicineBillID);

        if (!checkMedicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        if (Quantity < checkMedicine.Quantity) {
            
            checkMedicineBill.Added_Medicines.push({
                MedicineID: MedicineID,
                MedicineName: checkMedicine.TabletName,
                Quantity: Quantity,
                Price: checkMedicine.UnitPrice * Quantity,
                Added: true
            });

            checkMedicine.Quantity = checkMedicine.Quantity - Quantity;

            checkMedicineBill.Total_Bill = checkMedicineBill.Total_Bill + (checkMedicine.UnitPrice * Quantity);

        } else {

            checkMedicineBill.Added_Medicines.push({
                MedicineID: MedicineID,
                MedicineName: checkMedicine.TabletName,
                Quantity: Quantity,
                Price: 0,
                Added: false
            });

        }

        await checkMedicine.save();
        await checkMedicineBill.save();

        res.status(200).json({ message: "Medicine added to bill successfully", checkMedicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to add medicine to bill", error });
    }
};


// 12. Update Complete Status //
//----------------------------//

exports.update_Complete_Status = async (req, res) => {
    try {
        const { MedicineBillID } = req.params;

        const updateMedicineBill = await medicineBill.findOne({ _id: MedicineBillID });

        if (!updateMedicineBill) {
            return res.status(404).json({ message: "Medicine bill not found" });
        }

        updateMedicineBill.CompleteStatus = true;

        await updateMedicineBill.save();

        res.status(200).json({ message: "Medicine bill updated successfully", updateMedicineBill });
    } catch (error) {
        res.status(500).json({ message: "Failed to update medicine bill", error });
    }
};


// 13. Get All CompleteStatus True Medicine Bill with patient and Doctore Details //
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


// 14. Get All CompleteStatus False Medicine Bill with patient and Doctore Details //
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


// 15. Get All Medicine bills By DoctorID //
//----------------------------------------//

exports.get_Medicine_Bills_By_DoctorID = async (req, res) => {
    try {
        const { DoctorID } = req.params;

        const getMedicineBillsByDoctorID = await medicineBill.find({ DoctorID });

        if (!getMedicineBillsByDoctorID) {
            return res.status(404).json({ message: "Medicine bills not found" });
        }

        res.status(200).json({ 
            message: "Medicine bills found successfully",
            getMedicineBillsByDoctorID
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};


// 16. Get All Medicine bills By PatientID //
//-----------------------------------------//

exports.get_Medicine_Bills_By_PatientID = async (req, res) => {
    try {
        const { PatientID } = req.params;

        const getMedicineBillsByPatientID = await medicineBill.find({ PatientID });

        if (!getMedicineBillsByPatientID) {
            return res.status(404).json({ message: "Medicine bills not found" });
        }

        res.status(200).json({ 
            message: "Medicine bills found successfully",
            getMedicineBillsByPatientID
         });
    } catch (error) {
        res.status(500).json({ message: "Failed to get all medicine bills", error });
    }
};