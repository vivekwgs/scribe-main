
var messageEl = document.getElementById("message_input");
//var response_container_element = document.getElementById("response_container_element");
const audioElement = document.getElementById("myAudio");
var mini = true;
var selected_patient_audio_url
const buttonContainer = document.getElementById("button-container");
// Accessing the Patient Name textarea
var patientNameElement = document.getElementById("patient_name_textarea");

// Accessing the User ID textarea
var userIdElement = document.getElementById("user_id_textarea");

// Accessing the Patient ID textarea
var patientIdElement = document.getElementById("patient_id_textarea");

// Accessing the Transcription Text textarea
var transcriptionTextElement = document.getElementById("transcription_text_textarea");

// Accessing the EMR Report textarea
var emrReportElement = document.getElementById("emr_report_textarea");

// Accessing the Transcript Audio textarea
var transcriptAudioElement = document.getElementById("transcript_audio_textarea");

// Accessing the Patient Age textarea
var patientAgeElement = document.getElementById("patient_age_textarea");

// Accessing the Patient Gender textarea
var patientGenderElement = document.getElementById("patient_gender_textarea");

// Accessing the Patient Temperature textarea
var patientTemperatureElement = document.getElementById("patient_temperature_textarea");

// Accessing the Patient Pulse Oxidation textarea
var patientPulseOxidationElement = document.getElementById("patient_pulse_oximetry_textarea");

// Accessing the Patient Height textarea
var patientHeightElement = document.getElementById("patient_height_textarea");

// Accessing the Patient Weight textarea
var patientWeightElement = document.getElementById("patient_weight_textarea");

// Accessing the Patient Blood Pressure textarea
var patientBloodPressureElement = document.getElementById("patient_blood_pressure_textarea");

// Accessing the Patient Complaints textarea
var patientComplaintsElement = document.getElementById("patient_complaints_textarea");

// Accessing the Patient History of Illness textarea
var patientHistoryOfIllnessElement = document.getElementById("patient_history_of_illness_textarea");

// Accessing the Patient Past Medication textarea
var patientPastMedicationElement = document.getElementById("patient_past_medication_textarea");

// Accessing the Assessment textarea
var assessmentElement = document.getElementById("assessment_textarea");

// Accessing the Plans textarea
var plansElement = document.getElementById("plans_textarea");

var newPrescriptionElement = document.getElementById("new_prescription_textarea");
var relevantAllergiesElement = document.getElementById("relevant_allergies_textarea");
var relevantMedicationsElement = document.getElementById("relevant_medications_textarea");
var procedureElement = document.getElementById("procedure_textarea");
var pastSurgicalHistoryElement = document.getElementById("past_surgical_history_textarea");
//var plansElement = document.getElementById("plans_textarea");


var patientAgeFieldElement = document.getElementById("patient_age_textarea_field");

var patientGenderFieldElement = document.getElementById("patient_gender_textarea_field");

var patientTemperatureFieldElement = document.getElementById("patient_temperature_textarea_field");

var patientPulseOxidationFieldElement = document.getElementById("patient_pulse_oximetry_textarea_field");

var patientHeightFieldElement = document.getElementById("patient_height_textarea_field");

var patientWeightFieldElement = document.getElementById("patient_weight_textarea_field");

var patientBloodPressureFieldElement = document.getElementById("patient_blood_pressure_textarea_field");

var patientComplaintsFieldElement = document.getElementById("patient_complaints_textarea_field");

var patientHistoryOfIllnessFieldElement = document.getElementById("patient_history_of_illness_textarea_field");

var patientPastMedicationFieldElement = document.getElementById("patient_past_medication_textarea_field");

var assessmentFieldElement = document.getElementById("assessment_textarea_field");

var plansFieldElement = document.getElementById("plans_textarea_field");

var newPrescriptionFieldElement = document.getElementById("new_prescription_textarea_field");
var relevantAllergiesFieldElement = document.getElementById("relevant_allergies_textarea_field");
var relevantMedicationsFieldElement = document.getElementById("relevant_medications_textarea_field");
var procedureFieldElement = document.getElementById("procedure_textarea_field");
var pastSurgicalHistoryFieldElement = document.getElementById("past_surgical_history_textarea_field");

var resetButton = document.getElementById("reset_button");
var dateElement = document.getElementById('date_input_id');
resetButton.addEventListener("click", function () {
	window.location.href = '../index.html'; 
});



function toggleSidebar() {
	const sidebar = document.getElementById("mySidebar");
	const main = document.getElementById("main");
	const width = mini ? "250px" : "85px";
	const marginLeft = mini ? "250px" : "85px";

	sidebar.style.width = width;
	main.style.marginLeft = marginLeft;
	mini = !mini;
}


async function fetchAppointments() {
	const current_report_data = localStorage.getItem('emr_report_data');
	const parsedReportData = JSON.parse(current_report_data)
	const patient = parsedReportData;
	const date = new Date().toISOString().split('T')[0];

	console.log(parsedReportData);
	audioElement.src = patient.transcript_audio;
	selected_patient_audio_url = patient.transcript_audio;
	messageEl.value = patient.transcription_text;
	messageEl.style.cssText = `height: ${messageEl.scrollHeight}px !important`;
	//patientNameElement.value = patient.patient_name;
	patient.patient_age ? patientAgeElement.value = patient.patient_age : patientAgeFieldElement.style.display = 'none';
	//patientGenderElement.value = patient.patient_gender;
	//patientTemperatureElement.value = patient.patient_temperature;
	//patientPulseOxidationElement.value = patient?.patient_pulse_oxymentry;
	//patientHeightElement.value = patient?.patient_height;
	//patientWeightElement.value = patient?.patient_weight;
	//patientBloodPressureElement.value = patient.patient_blood_pressure;
	//patientComplaintsElement.value = patient.patient_cheif_complaints;
	//patientHistoryOfIllnessElement.value = patient.history_of_illness;
	//patientPastMedicationElement.value = patient.past_medication;
	//assessmentElement.value = patient.patient_assessment;
	//plansElement.value = patient.plans;
	//newPrescriptionElement.value = patient.new_prescription;
	//relevantAllergiesElement.value = patient.relevant_allergies;
	//relevantMedicationsElement.value = patient.relevant_medications;
	//procedureElement.value = patient.procedure;
	//pastSurgicalHistoryElement.value = patient.surgical_history;
	dateElement.value = date;
	patientNameElement.value = patient.patient_name ? patient.patient_name : (patientNameElement.style.display = 'none');
	patientGenderElement.value = patient.patient_gender ? patient.patient_gender : (patientGenderFieldElement.style.display = 'none');
	patientTemperatureElement.value = patient.patient_temperature ? patient.patient_temperature : (patientTemperatureFieldElement.style.display = 'none');
	patientPulseOxidationElement.value = patient?.patient_pulse_oxymentry ? patient.patient_pulse_oxymentry : (patientPulseOxidationFieldElement.style.display = 'none');
	patientHeightElement.value = patient?.patient_height ? patient.patient_height : (patientHeightFieldElement.style.display = 'none');
	patientWeightElement.value = patient?.patient_weight ? patient.patient_weight : (patientWeightFieldElement.style.display = 'none');
	patientBloodPressureElement.value = patient.patient_blood_pressure ? patient.patient_blood_pressure : (patientBloodPressureFieldElement.style.display = 'none');
	patientComplaintsElement.value = patient.patient_cheif_complaints ? patient.patient_cheif_complaints : (patientComplaintsFieldElement.style.display = 'none');
	patientComplaintsElement.style.cssText = `height: ${patientComplaintsElement.scrollHeight}px !important`;
	patientHistoryOfIllnessElement.value = patient.history_of_illness ? patient.history_of_illness : (patientHistoryOfIllnessFieldElement.style.display = 'none');
	patientHistoryOfIllnessElement.style.cssText = `height: ${patientHistoryOfIllnessElement.scrollHeight}px !important`;
	patientPastMedicationElement.value = patient.past_medication ? patient.past_medication : (patientPastMedicationFieldElement.style.display = 'none');
	patientPastMedicationElement.style.cssText = `height: ${patientPastMedicationElement.scrollHeight}px !important`;
	assessmentElement.value = patient.patient_assessment ? patient.patient_assessment : (assessmentFieldElement.style.display = 'none');
	assessmentElement.style.cssText = `height: ${assessmentElement.scrollHeight}px !important`;
	plansElement.value = patient.plans ? patient.plans : (plansFieldElement.style.display = 'none');
	plansElement.style.cssText = `height: ${plansElement.scrollHeight}px !important`;
	newPrescriptionElement.value = patient.new_prescription ? patient.new_prescription : (newPrescriptionFieldElement.style.display = 'none');
	newPrescriptionElement.style.cssText = `height: ${newPrescriptionElement.scrollHeight}px !important`;
	relevantAllergiesElement.value = patient.relevant_allergies ? patient.relevant_allergies : (relevantAllergiesFieldElement.style.display = 'none');
	relevantAllergiesElement.style.cssText = `height: ${relevantAllergiesElement.scrollHeight}px !important`;
	relevantMedicationsElement.value = patient.relevant_medications ? patient.relevant_medications : (relevantMedicationsFieldElement.style.display = 'none');
	relevantMedicationsElement.style.cssText = `height: ${relevantMedicationsElement.scrollHeight}px !important`;
	procedureElement.value = patient.procedure ? patient.procedure : (procedureFieldElement.style.display = 'none');
	procedureElement.style.cssText = `height: ${procedureElement.scrollHeight}px !important`;
	pastSurgicalHistoryElement.value = patient.surgical_history ? patient.surgical_history : (pastSurgicalHistoryFieldElement.style.display = 'none');
	pastSurgicalHistoryElement.style.cssText = `height: ${pastSurgicalHistoryElement.scrollHeight}px !important`;


	//const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	//const backendURL = `https://ai-doctors-portal-services.onrender.com/scribe/get_appointments/?user_id=${user_id}`; // Replace with your actual backend URL

	//try {
	//	const response = await axios.get(backendURL);
	//	console.log('Appointments data:', response.data.patient_name);
	//	response.data.forEach((patient) => {
	//		const button = document.createElement("button");
	//		button.textContent = patient.patient_name;
	//		button.addEventListener("click", () => {
	//			audioElement.src = patient.transcript_audio;
	//			selected_patient_audio_url = patient.transcript_audio;
	//			messageEl.value = patient.transcription_text;
	//			messageEl.style.cssText = `height: ${messageEl.scrollHeight}px !important`;
	//			//const textContent = patient?.emr_report?.replaceAll(/<br>/g, '\n')?.replaceAll(/<p>/g, ' ')?.replaceAll('</p>', ' ');
	//			patientNameElement.value = patient.patient_name;
	//			patientAgeElement.value = patient.patient_age;
	//			patientGenderElement.value = patient.patient_gender;
	//			patientTemperatureElement.value = patient.patient_temperature;
	//			patientPulseOxidationElement.value = patient?.patient_pulse_oximetry;
	//			patientHeightElement.value = patient.patient_height;
	//			patientWeightElement.value = patient.patient_weight;
	//			patientBloodPressureElement.value = patient.patient_blood_pressure;
	//			patientComplaintsElement.value = patient.patient_complaints;
	//			patientHistoryOfIllnessElement.value = patient.patient_history_of_illness;
	//			patientPastMedicationElement.value = patient.patient_past_medication;
	//			assessmentElement.value = patient.assessment;
	//			plansElement.value = patient.plans;
	//			newPrescriptionElement.value = patient.new_prescription;
	//			relevantAllergiesElement.value = patient.relevant_allergies;
	//			relevantMedicationsElement.value = patient.relevant_medications;
	//			procedureElement.value = patient.procedure;
	//			pastSurgicalHistoryElement.value = patient.past_surgical_history;
	//		});

	//		// Apply styles
	//		button.style.border = "none";
	//		button.style.width = "200px";
	//		button.style.height = "50px";
	//		button.style.borderRadius = "4px";
	//		button.style.background = "#2c1e4a";
	//		button.style.color = "#ffffff";
	//		button.style.marginTop = '5px';
	//		button.style.boxShadow = "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px";
	//		buttonContainer.appendChild(button);
	//	})
	//} catch (error) {
	//	console.error('Axios error:', error);
	//}
}


document.addEventListener('DOMContentLoaded', async () => fetchAppointments());
//document.addEventListener('DOMContentLoaded', async () => renderStorageDetails());

function copyMessageElText(elementId) {
	const element = document.getElementById(elementId);

	if (element) {
		element.select();
		element.setSelectionRange(0, 99999);
		document.execCommand('copy');
		element.blur();
	}
}

//function copyMessageElText() {
//	const messageInput = document.getElementById('message_input');

//	if (messageInput) {
//		messageInput.select();
//		messageInput.setSelectionRange(0, 99999);
//		document.execCommand('copy');
//		messageInput.blur();
//	}
//}

document.getElementById('download_button').addEventListener('click', function () {
	const zipFileURL = `https://ai-doctors-portal-services.onrender.com/scribe/download_audio?audio_url=${selected_patient_audio_url}`
	const xhr = new XMLHttpRequest();
	xhr.open('GET', zipFileURL, true);
	xhr.responseType = 'blob';

	xhr.onload = function () {
		if (xhr.status === 200) {
			const blob = xhr.response;
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = 'audio.zip';
			downloadLink.click();
		} else {
			console.error('Failed to download audio as ZIP.');
		}
	};

	xhr.send();
});



function saveAsPDF() {
	const storage_object = JSON.parse(localStorage.getItem('emr_patient_db_data'));
	let pdfUrl = `https://ai-doctors-portal-services.onrender.com/scribe/generate_pdf?patient_id='${storage_object?.patient_id}'`;
	window.open(pdfUrl);
}




// function saveAsPDF() {
// 	// // Create a new jsPDF instance
// 	// const pdf = new jsPDF();
// 	//
// 	// // Get the HTML content you want to convert to PDF
// 	// const htmlContent = document.getElementById('transcribe_element_pdf');
// 	//
// 	// // Convert the HTML content to a canvas
// 	// html2canvas(htmlContent).then(canvas => {
// 	// 	// Add the canvas as an image to the PDF
// 	// 	const imgData = canvas.toDataURL('image/png');
// 	// 	pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
// 	//
// 	// 	// Save the PDF with a specific filename (e.g., 'document.pdf')
// 	// 	pdf.save('document.pdf');
// 	// });
// }

// Add a click event listener to the button
document.getElementById('generate-pdf').addEventListener('click', saveAsPDF);

// Function to convert and save HTML as Word document
function saveAsWord() {
	// Get the HTML content you want to convert to a Word document
	const htmlContent = document.getElementById('transcribe_element_pdf').innerHTML;

	// Convert HTML to Word document
	mammoth.convertToHtml(htmlContent)
		.then(function (result) {
			const blob = new Blob([result.value], {type: 'application/msword'});
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'document.docx';
			link.click();
		})
		.catch(function (error) {
			console.error('Error converting HTML to Word document:', error);
		});
}

// Add a click event listener to the button
document.getElementById('generate-docx').addEventListener('click', saveAsWord);


