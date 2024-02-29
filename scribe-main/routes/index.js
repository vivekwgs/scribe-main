const express = require('express');
const router = express.Router();
const openAIController = require('../controllers');
const multer = require('multer');
const {memoryStorage} = require('multer')
const storage = memoryStorage();
const upload = multer({storage});

router.route('/text').post(openAIController.openAIText);
router.route('/transcript').get(openAIController.getTranscript);
router.route('/upload').post(upload.single("wavfile"), openAIController.uploadAudioFile);
router.route('/check').get(openAIController.cronJob);
router.route('/lemurAi').post(openAIController.lemurAi);
router.route('/download_audio').get(openAIController.downloadAudio);
router.route('/get_appointments').get(openAIController.getAppointmentsByUserId);
router.route('/get_templates').get(openAIController.getTemplateByUserId);
router.route('/add_template').post(openAIController.insertTemplates);
router.route('/add_appointments').post(openAIController.postAppointments);
router.route('/delete_templates').delete(openAIController.deleteTemplatesByTemplateId);
router.route('/update_templates').post(openAIController.updateTemplate);
router.route('/generate_pdf').get(openAIController.generatePdf);
router.route('/get_patient_id').get(openAIController.getPatientByAutoId);
router.route('/update_appointments').put(openAIController.updateAppointment);
router.route('/get_user_by_user_id').get(openAIController.getUserDetailsByUserId);
//router.route('/generate_word').get(openAIController.generateWord);

module.exports = router;
