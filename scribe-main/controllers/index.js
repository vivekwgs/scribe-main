const AWS = require('aws-sdk');
const axios = require('axios');
const archiver = require('archiver');
const appointMentModel = require('../models/index');
const {Configuration, OpenAIApi} = require('openai');
const {report_data} = require('./emr_report_page');
const util = require('util');
const dbConn = require('../db_config/db.config');
const cron = require('node-cron');
const getPatientPromise = util.promisify(appointMentModel.getPatient);
const configuration = new Configuration({
	apiKey: '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',
});
const openai = new OpenAIApi(configuration);
const {JSDOM} = require('jsdom');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const openAIText = async (req, res) => {
	const {prompt} = req.body;
	try {
		const result = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{role: 'user', content: prompt}],
		});
		return res.json({result: result.data.choices[0].message.content});
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
			return res
				.status(error.response.status)
				.json({error: error.response.data});
		} else {
			console.log(error.message);
			return res.status(500).json({error: error.message});
		}
	}
};

const getTranscript = async (req, res) => {
	const {cronjob} = req.query;
	console.log(cronjob);
	try {
		if (cronjob) {
			res.status(200).send('Server is alive');
		} else {
			const response = await axios.post(
				'https://api.assemblyai.com/v2/realtime/token',
				{expires_in: 3600},
				{headers: {authorization: '49dd2d3781004392bf36d86646fa743b'}},
			);
			const {data} = response;
			//console.log(data);
			res.json(data);
		}

	} catch (error) {
		const {
			response: {status, data},
		} = error;
		res.status(status).json(data);
	}
};

const s3 = new AWS.S3({
	accessKeyId: 'AKIAZT3YGBLJTJ7XU66E',
	secretAccessKey: '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',
});

const uploadAudio = (filename, bucketname, file) => {
	return new Promise((resolve, reject) => {
		const params = {
			Key: filename,
			Bucket: bucketname,
			Body: file,
			ContentType: 'audio/mpeg',
			ACL: 'public-read',
		};
		s3.upload(params, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});

};

const uploadAudioFile = async (req, res) => {
	try {
		function generateRandomString(length) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let randomString = '';
			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * characters.length);
				randomString += characters.charAt(randomIndex);
			}
			return randomString;
		}

		const randomString = generateRandomString(10);
		const filename = `${randomString}.mp3`;
		const bucketname = 'aidoctorsportal';
		const file = req.file.buffer;
		const link = await uploadAudio(filename, bucketname, file);
		console.log(link);
		res.send(link);

	} catch (error) {
		const {
			response: {status, data},
		} = error;
		res.status(status).json(data);
	}

};

const cronJob = async (req, res) => res.status(200).send('Server is alive');

const postAppointments = async (req, res) => {
	const {
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
	} = req.body;

	console.log(req.body);
	const values = {
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
	};

	// Execute the SQL query to insert the appointment
	appointMentModel.create(values, (err, result) => {
		if (err) {
			console.error('Error creating appointment:', err);
			return res.status(500).json({error: 'Appointment creation failed'});
		}
		const appointmentId = result.insertId;
		appointMentModel.getPatientId(result.insertId, (err, auto) => {
			if (err) {
				return res.status(500).json({error: 'Error retrieving id'});
			}

			if (!auto) {
				return res.status(404).json({error: 'autoId not found'});
			}

			// res.json(auto);
			const {patient_id} = auto[0];
			res.status(201).json({message: 'Appointment created successfully', appointmentId, patient_id});
		});

	});
};

//const downloadAudio = async (req, res) => {
//	const {audio_url} = req.query;
//	const externalAudioURL = audio_url; // Replace with the actual external audio URL
//	const audioFileName = 'audio.mp3'; // You can set the desired filename here
//	const zipFileName = 'audio.zip';

//	const archive = archiver('zip', {
//		zlib: {level: 9}, // Set compression level (optional)
//	});

//	archive.on('error', (err) => {
//		res.status(500).send({error: err.message});
//	});

//	archive.pipe(res);

//	// Fetch the audio file from the external URL
//	try {
//		const response = await axios.get(externalAudioURL, {responseType: 'arraybuffer'});

//		// Add the fetched audio data to the zip archive
//		archive.append(response.data, {name: audioFileName});

//		res.attachment(zipFileName);
//		archive.finalize();
//	} catch (err) {
//		res.status(500).send({error: err.message});
//	}
//};

//const downloadAudio = async (req, res) => {
//	const {audio_url} = req.query;
//	const externalAudioURL = audio_url;
//	const audioFileName = 'audio.mp3';
//	const pdfFileName = 'report.pdf';
//	const zipFileName = 'audio_and_report.zip';
//	const archive = archiver('zip', {
//		zlib: {level: 9},
//	});

//	archive.on('error', (err) => {
//		res.status(500).send({error: err.message});
//	});

//	try {
//		const audioResponse = await axios.get(externalAudioURL, {responseType: 'arraybuffer'});
//		archive.append(audioResponse.data, {name: audioFileName});
//		const pdfBuffer = await generatePdfZip(req, res);
//		archive.append(pdfBuffer, {name: pdfFileName});

//		// Wait for archive to finish before sending the response
//		await new Promise((resolve, reject) => {
//			archive.finalize();
//			archive.on('end', resolve);
//			archive.on('error', reject);
//		});

//		res.attachment(zipFileName);
//		archive.pipe(res);
//	} catch (err) {
//		// Handle the error, but avoid sending the response multiple times
//		console.error(err);
//		res.status(500).send({error: err.message});
//	}
//};


const downloadAudio = async (req, res) => {
	const {audio_url} = req.query;
	const externalAudioURL = audio_url;
	const audioFileName = 'audio.mp3';
	const pdfFileName = 'report.pdf';
	const zipFileName = 'audio_and_report.zip';
	const archive = archiver('zip', {
		zlib: {level: 9},
	});

	archive.on('error', (err) => {
		res.status(500).send({error: err.message});
	});

	try {
		const audioResponse = await axios.get(externalAudioURL, {responseType: 'arraybuffer'});
		if (audioResponse.status >= 200 && audioResponse.status < 300) {
			archive.append(audioResponse.data, {name: audioFileName});
		} else {
			throw new Error(`Audio request failed with status ${audioResponse.status}`);
		}

		const pdfBuffer = await generatePdfZip(req, res);
		archive.append(pdfBuffer, {name: pdfFileName});
		archive.pipe(res);
		await new Promise((resolve, reject) => {
			archive.finalize();
			archive.on('end', resolve);
			archive.on('error', reject);
		});

		res.attachment(zipFileName);
		res.status(200);
		res.end();

	} catch (err) {
		if (!res.headersSent) {
			res.status(500).send({error: err.message});
		}
	}
};

const generatePdfZip = async (req, res) => {
	const {patient_id} = req.query;
	try {
		const user = await getPatientPromise(patient_id);

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		const browser = await puppeteer.launch({
			args: [
				"--disable-setuid-sandbox",
				"--no-sandbox",
				"--single-process",
				"--no-zygote",
			],
			executablePath:
				process.env.NODE_ENV === "production"
					? process.env.PUPPETEER_EXECUTABLE_PATH
					: puppeteer.executablePath(),
		});

		const page = await browser.newPage();
		const html_content = report_data(user[0]); //one
		await page.setContent(html_content);
		const pdfBuffer = await page.pdf({format: 'A4'});

		await browser.close();
		return pdfBuffer;
	} catch (err) {
		console.error(err);
		//throw err;
	}
};


const getAppointmentsByUserId = async (req, res) => {
	const {user_id} = req.query;
	appointMentModel.getById(user_id, (err, user) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving user'});
		}

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		res.json(user);
	});
};


const getUserDetailsByUserId = async (req, res) => {
	const {user_id} = req.query;
	appointMentModel.getUserDetails(user_id, (err, user) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving user'});
		}

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		res.json(user);
	});
};


const getPatientByAutoId = async (req, res) => {
	const {auto_id} = req.query;
	appointMentModel.getPatientId(auto_id, (err, auto) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving id'});
		}

		if (!auto) {
			return res.status(404).json({error: 'autoId not found'});
		}

		res.json(auto);
	});
};

const getTemplateByUserId = async (req, res) => {
	const {user_id} = req.query;
	appointMentModel.getTemplates(user_id, (err, user) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving user'});
		}

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		res.json(user);
	});
};

const deleteTemplatesByTemplateId = async (req, res) => {
	const {template_id, user_id} = req.query;
	console.log(template_id);
	appointMentModel.deleteTemplates(template_id, user_id, (err, user) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving user'});
		}

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		res.json(user);
	});
};

const insertTemplates = async (req, res) => {
	const {user_id, template, template_name} = req.body;

	try {
		const results = await appointMentModel.insertTemplate(user_id, template, template_name);
		res.json({message: 'Template inserted successfully', results});
	} catch (error) {
		console.error('Error inserting template:', error);
		res.status(500).json({error: 'Error inserting template'});
	}
};

const updateTemplate = async (req, res) => {
	const {templates_id, template, template_name} = req.body;

	try {
		const results = await appointMentModel.updateTemplate(templates_id, template, template_name);
		res.json({message: 'Template updated successfully', results});
	} catch (error) {
		console.error('Error updating template:', error);
		res.status(500).json({error: 'Error updating template'});
	}
};

const lemurAi = async (req, res) => {
	console.log(req.body);
	const {templates, audio_url} = req.body;
	try {
		let transcribed_data;

		const transcript_endpoint = 'https://api.assemblyai.com/v2/transcript';

		const data = {
			audio_url: audio_url,
		};

		const headers = {
			'Authorization': '49dd2d3781004392bf36d86646fa743b',
			'Content-Type': 'application/json',
		};

		const response = await axios.post(transcript_endpoint, data, {headers: headers});
		const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${response.data.id}`;
		console.log(response.data.id, "transcribe id")
		while (transcribed_data?.status !== 'completed') {
			const pollingResponse = await axios.get(pollingEndpoint, {
				headers: headers,
			});

			const transcriptionResult = pollingResponse.data;
			transcribed_data = transcriptionResult;
			console.log(transcriptionResult?.status === 'completed');
		}
		if (transcribed_data?.status === 'completed') {
			console.log(transcribed_data?.id);
			//const agentContext =
			//	'this is the conversation between the doctor and  patient where you are the doctor';

			////const answerFormat = `<answer as extremely detailed as  possible explain the answer clearly, don't add your out-of - topic sentences, Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor'. > <reason  as extremely detailed as  possible explain the answer clearly, don't add your out-of - topic sentences>`;
			//const answerFormat = ` <' as extremely detailed as possible explaining the answer clearly, don't add your out-of-topic sentences'> <reason as extremely detailed as possible explaining the answer clearly, don't add your out-of-topic sentences>`;

			const agentContext =
				"This is a conversation between a doctor and a patient. You are playing the role of the doctor.";

			const answerFormat =
				"<Doctor's Response: Act as if you are the doctor in this conversation. Provide an extremely detailed explanation of the answer, ensuring clarity. Avoid adding out-of-topic sentences.>";

			const answerFormat_two = '<answer in single word>';
			const anserFormat_three = '<js object with keys {positive:<value in number of percentage out of 100>,negative:<value in number of percentage out of 100>,neutral:<value in number of percentage out of 100>}>'

			const questions = [
				{
					question: '$patient_name$',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_age$ : What is the Patient Age from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_gender$ : What is the Patient gender from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_temperature$ : What is the Patient temperature from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_pulse_oxymentry$ : What is the Patient pulse oxymentry from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_height$ : What is the Patient height from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_weight$ : What is the Patient weight from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: '$patient_blood_pressure$ : What is the Patient blood Pressure from the above conversation, if not Available answer it as Not Available',
					context: agentContext,
					answer_format: answerFormat_two,
				},
				{
					question: `$patient_cheif_complaints$ :  What are the Patient's Chief Complaints explain the answer clearly answer in detail as possible refer patient with name, don't add your out - of - topic sentences, if not Available answer it as Not Available `,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$history_of_illness$ :  What is the Patient History of Patient illness from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ? ,Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor', if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$past_medication$ :  What is the Patient's Past Medication from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?,Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor', if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$patient_assessment$ :  What are the Assessments from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?,Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor', if not Available answer it as Not Available `,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$plans$ :  What are the Plans from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ? ,Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor', if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$prescription_renewal$ :  What is the Prescription Renewal from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?,Do not start sentences with an introduction, i.e., 'The patient' or 'The doctor', if not Available answer it as Not Available `,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$new_prescription$ :  What is the New Prescription from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$follow_up$ :  What is the Follow-up from the above conversation, explain the answer clearly, don\'t add your out-of-topic sentences?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$patient_vitals$ :  What are the patient vitals following inputs, explain the answer clearly, don\'t add your out-of-topic sentences?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},

				{
					question: `$sentimental_breakdown$ : Analyze and respond with the sentimental breakdown of the conversation and return the output with an object with positive, negative, and neutral values that sum up to 100`,
					context: agentContext,
					answer_format: anserFormat_three,
				}, {
					question: `$relevant_allergies$ :  What are the patient relevant allergies from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$relevant_medications$ :  What are the patient relevant medications from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$procedure$ :  What are the patient further procedure from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
				{
					question: `$surgical_history$ :  What are the patient surgical history from the above conversation, explain the answer clearly, don't add your out - of - topic sentences ?, if not Available answer it as Not Available`,
					context: agentContext,
					answer_format: answerFormat,
				},
			];
			const filteredQuestions = questions.filter((q) => {
				const getStringBetweenDollarSigns = inputString => (match => match ? match[1] : null)(/\$(.*?)\$/s.exec(inputString));

				return templates.includes(getStringBetweenDollarSigns(q?.question));
			});


			const data = {
				transcript_ids: [`${transcribed_data?.id}`],
				questions: filteredQuestions,

			};

			console.log(data, "thedata");
			const url = 'https://api.assemblyai.com/lemur/v3/generate/question-answer';
			const headers = {authorization: '49dd2d3781004392bf36d86646fa743b'};
			//(async () => {
			//  try {
			//    const httpResponse = await axios.post(url, data, { headers });

			//    function extractAnswers(arrayOfObjects) {
			//      const result = {};

			//      arrayOfObjects.forEach((obj) => {
			//        const matches = obj.question.match(/\$(.*?)\$/);
			//        if (matches) {
			//          const key = matches[1];
			//          result[key] = obj.answer;
			//        }
			//      });

			//      return result;
			//      }
			//      console.log(httpResponse,"htpresponse")
			//    const extractedAnswers = extractAnswers(httpResponse.data.response);
			//    res.json(extractedAnswers);
			//  } catch (error) {
			//    console.log(error.response.data.error);
			//  }


			//try {
			//	const httpResponse = await axios.post(url, data, {headers});

			//function extractAnswers(arrayOfObjects) {
			//	const result = {};

			//	arrayOfObjects.forEach((obj) => {
			//		const matches = obj.question.match(/\$(.*?)\$/);
			//		if (matches) {
			//			const key = matches[1];
			//			result[key] = obj.answer;
			//		}
			//	});

			//	return result;
			//}

			//	console.log(httpResponse, "http response");
			//	let extractedAnswers = extractAnswers(httpResponse.data.response);
			//	console.log(extractedAnswers, "http response extractedAnswers");
			//	if (Object.keys(extractedAnswers).length === 0) {
			//		// If extractedAnswers is empty, start over the process again
			//		const httpResponse = await axios.post(url, data, {headers});
			//		extractedAnswers = extractAnswers(httpResponse.data.response);
			//	} else {
			//		// If extractedAnswers is not empty, return the results
			//		res.json(extractedAnswers);
			//	}
			//} catch (error) {
			//	// Handle any errors here
			//	console.error(error);
			//	res.status(500).json({error: 'An error occurred'});
			//}

			try {
				let extractedAnswers = {};
				function extractAnswers(arrayOfObjects) {
					const result = {};

					arrayOfObjects.forEach((obj) => {
						const matches = obj.question.match(/\$(.*?)\$/);
						if (matches) {
							const key = matches[1];
							result[key] = obj.answer;
						}
					});

					return result;
				}

				for (let attempt = 0; attempt <= 2; attempt++) {
					const httpResponse = await axios.post(url, data, {headers});

					console.log(httpResponse.data.response, "http response");
					extractedAnswers = extractAnswers(httpResponse.data.response);
					function replaceStringInObject(obj, targetString, replacementString) {
						for (const key in obj) {
							if (obj.hasOwnProperty(key)) {
								if (typeof obj[key] === 'object' && obj[key] !== null) {
									// If the property is an object, recurse into it
									replaceStringInObject(obj[key], targetString, replacementString);
								} else if (typeof obj[key] === 'string') {
									// If the property is a string, replace the target string
									obj[key] = obj[key].replace(targetString, replacementString);
								}
							}
						}
					}

					if (Object.keys(extractedAnswers).length !== 0) {
						replaceStringInObject(extractedAnswers, 'The doctor', 'I');
					}
					console.log(extractedAnswers, "http response extractedAnswers", attempt);

					if (Object.keys(extractedAnswers).length !== 0) {
						res.json(extractedAnswers);
						break; // Exit the loop if answers are extracted
					}

					// If answers are not extracted, retry after a delay (you can adjust the delay time)
					await new Promise(resolve => setTimeout(resolve, 1000));
				}

				// If the loop runs for 6 times and still no answers are extracted, respond with an empty object
				if (Object.keys(extractedAnswers).length === 0) {
					res.json({error: 'unable to generate report as the provided audio is Invalid'});
				}
			} catch (error) {
				console.error(error);
				res.status(500).json({error: 'An error occurred'});
			}


		}
		//) ();

	}

	catch (error) {
		console.log(error);
	}
};

//const generatePdf = async (req, res) => {
//	const {patient_id} = req.query

//	appointMentModel.getPatient(patient_id, async (err, user) => {
//		if (err) {
//			return res.status(500).json({error: 'Error retrieving user'});
//		}

//		if (!user) {
//			return res.status(404).json({error: 'User not found'});
//		}
//		//console.log(user);
//		const browser = await puppeteer.launch(
//			{
//				args: [
//					"--disable-setuid-sandbox",
//					"--no-sandbox",
//					"--single-process",
//					"--no-zygote",
//				],
//				executablePath:
//					process.env.NODE_ENV === "production"
//						? process.env.PUPPETEER_EXECUTABLE_PATH
//						: puppeteer.executablePath(),
//			}
//		);
//		const page = await browser.newPage();
//		// Customize your PDF generation here, e.g., set content and options
//		const html_content = report_data(user[0])
//		await page.setContent(html_content);
//		const pdfBuffer = await page.pdf({format: 'A4'});

//		await browser.close();

//		res.setHeader('Content-Type', 'application/pdf');
//		res.send(pdfBuffer);


//	});


//};


const generatePdf = async (req, res) => {
	const {patient_id} = req.query;

	appointMentModel.getPatient(patient_id, async (err, user) => {
		if (err) {
			return res.status(500).json({error: 'Error retrieving user'});
		}

		if (!user) {
			return res.status(404).json({error: 'User not found'});
		}

		const browser = await puppeteer.launch({
			args: [
				"--disable-setuid-sandbox",
				"--no-sandbox",
				"--single-process",
				"--no-zygote",
			],
			executablePath:
				process.env.NODE_ENV === "production"
					? process.env.PUPPETEER_EXECUTABLE_PATH
					: puppeteer.executablePath(),
		});

		const page = await browser.newPage();
		const html_content = report_data(user[0]);//two
		await page.setContent(html_content);
		const pdfBuffer = await page.pdf({format: 'A4'});

		await browser.close();

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(`report_${patient_id}.pdf`)}`);
		res.send(pdfBuffer);
	});
};




const updateAppointment = async (req, res) => {
	const {
		patient_id,
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
	} = req.body;

	const values = {
		patient_id,
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
	};
	appointMentModel.updateAppointments(values, (err, result) => {
		if (err) {
			console.error('Error updating appointment:', err);
			return res.status(500).json({error: 'Appointment update failed'});
		}

		res.status(200).json({message: 'Appointment updated successfully'});
	});
};


//cron.schedule('*/5 */3 * * *', () => {
/*	const deleteQuery = 'DELETE FROM appointments WHERE created_at < NOW() - INTERVAL 3 DAY';
	dbConn.query(deleteQuery, (err, results) => {
		if (err) {
			console.error('Error executing delete query:', err);
		} else {
			console.log(`Deleted ${results.affectedRows} records older than 72 hours`);
		}
	});
});
*/

module.exports = {
	openAIText,
	getTranscript,
	uploadAudioFile,
	cronJob,
	lemurAi,
	downloadAudio,
	getAppointmentsByUserId,
	insertTemplates,
	getTemplateByUserId,
	postAppointments,
	deleteTemplatesByTemplateId,
	updateTemplate,
	generatePdf,
	getPatientByAutoId,
	updateAppointment,
	getUserDetailsByUserId
	//generateWord,
};


