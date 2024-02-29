const dbConn = require('../db_config/db.config');

const appointMentModel = {
	create: ({
		user_id,
		patient_name,
		patient_age,
		patient_gender,
		patient_temperature,
		patient_pulse_oxymentry,
		patient_height,
		patient_weight,
		patient_blood_pressure,
		patient_cheif_complaints,
		history_of_illness,
		past_medication,
		patient_assessment,
		plans,
		new_prescription,
		relevant_allergies,
		relevant_medications,
		procedure,
		surgical_history,
		transcript_audio,
		transcription_text,
	},
		callback) => {
		const sql = `
				INSERT INTO appointments
				(user_id,
				patient_name,
				patient_age,
				patient_gender,
				patient_temperature,
				patient_pulse_oxymentry,
				patient_height,
				patient_weight,
				patient_blood_pressure,
				patient_cheif_complaints,
				history_of_illness,
				past_medication,
				patient_assessment,
				plans,
				new_prescription,
				relevant_allergies,
				relevant_medications,
				\`procedure\`,  
				surgical_history,
				transcript_audio,
				transcription_text)
				VALUES
				(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
			`;


		const values = [
			user_id,
			patient_name,
			patient_age,
			patient_gender,
			patient_temperature,
			patient_pulse_oxymentry,
			patient_height,
			patient_weight,
			patient_blood_pressure,
			patient_cheif_complaints,
			history_of_illness,
			past_medication,
			patient_assessment,
			plans,
			new_prescription,
			relevant_allergies,
			relevant_medications,
			procedure,
			surgical_history,
			transcript_audio,
			transcription_text,
		];
		console.log(sql);
		dbConn.query(sql, values, (err, result) => {
			if (err) {
				return callback(err, null);
			}
			console.log(result);
			return callback(null, result);
		});
	},

	getById: (user_id, callback) => {
		console.log(user_id);
		const sql = `SELECT * FROM wgshe7j6_doctors.appointments WHERE user_id = '${user_id}'`;
		console.log(sql);
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},

	getPatientId: (auto_id, callback) => {
		console.log(auto_id);
		const sql = `SELECT 
                        patient_id
                    FROM
                        wgshe7j6_doctors.appointments
                    WHERE
                        auto_id =  ${auto_id}`;
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},

	insertTemplate: (user_id, template, template_name) => {
		return new Promise((resolve, reject) => {
			const templateArrayAsJSON = JSON.stringify(template);
			const sql = 'INSERT INTO templates (user_id, templates, template_name) VALUES (?, ?, ?)';
			dbConn.query(sql, [user_id, templateArrayAsJSON, template_name], (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},
	updateTemplate: (templates_id, template, template_name) => {
		return new Promise((resolve, reject) => {
			const templateArrayAsJSON = JSON.stringify(template);
			const sql = 'UPDATE templates SET templates = ?, template_name = ? WHERE templates_id = ?';
			dbConn.query(sql, [templateArrayAsJSON, template_name, templates_id], (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},


	getTemplates: (user_id, callback) => {
		console.log(user_id);
		const sql = `SELECT * FROM wgshe7j6_doctors.templates WHERE user_id = '${user_id}'`;
		console.log(sql);
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},

	getPatient: (patient_id, callback) => {
		console.log(patient_id);
		const sql = `SELECT * FROM wgshe7j6_doctors.appointments where patient_id= ${patient_id}`;
		console.log(sql);
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},
	deleteTemplates: (template_id, user_id, callback) => {
		const sql = `DELETE FROM wgshe7j6_doctors.templates WHERE templates_id = ${template_id} and user_id=${user_id}`;
		console.log(sql);
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},


	updateAppointments: ({
		patient_id, 
		patient_name,
		patient_age,
		patient_gender,
		patient_temperature,
		patient_pulse_oxymentry,
		patient_height,
		patient_weight,
		patient_blood_pressure,
		patient_cheif_complaints,
		history_of_illness,
		past_medication,
		patient_assessment,
		plans,
		new_prescription,
		relevant_allergies,
		relevant_medications,
		procedure,
		surgical_history,
		transcript_audio,
		transcription_text,
	}, callback) => {
		const sql = `
    UPDATE appointments
    SET
      patient_name = ?,
      patient_age = ?,
      patient_gender = ?,
      patient_temperature = ?,
      patient_pulse_oxymentry = ?,
      patient_height = ?,
      patient_weight = ?,
      patient_blood_pressure = ?,
      patient_cheif_complaints = ?,
      history_of_illness = ?,
      past_medication = ?,
      patient_assessment = ?,
      plans = ?,
      new_prescription = ?,
      relevant_allergies = ?,
      relevant_medications = ?,
     \`procedure\` = ?,
      surgical_history = ?,
      transcript_audio = ?,
      transcription_text = ?
    WHERE patient_id = ?;
  `;

		const values = [
			patient_name,
			patient_age,
			patient_gender,
			patient_temperature,
			patient_pulse_oxymentry,
			patient_height,
			patient_weight,
			patient_blood_pressure,
			patient_cheif_complaints,
			history_of_illness,
			past_medication,
			patient_assessment,
			plans,
			new_prescription,
			relevant_allergies,
			relevant_medications,
			procedure,
			surgical_history,
			transcript_audio,
			transcription_text,
			patient_id,
		];

		console.log(sql);
		dbConn.query(sql, values, (err, result) => {
			if (err) {
				return callback(err, null);
			}
			console.log(result);
			return callback(null, result);
		});
	},

	getUserDetails: (user_id, callback) => {
		console.log(user_id);
		const sql = `SELECT 
						*
					FROM
						register
					WHERE
						id = '${user_id}'`;
		console.log(sql);
		dbConn.query(sql, (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	},
};

module.exports = appointMentModel;
