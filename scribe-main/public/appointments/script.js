
var messageEl = document.getElementById("message_input");
const audioElement = document.getElementById("myAudio");
var mini = true;
var selected_patient_audio_url
const buttonContainer = document.getElementById("button-container");
var patientNameElement = document.getElementById("patient_name_textarea");
var userIdElement = document.getElementById("user_id_textarea");
var patientIdElement = document.getElementById("patient_id_textarea");
var transcriptionTextElement = document.getElementById("transcription_text_textarea");
var emrReportElement = document.getElementById("emr_report_textarea");
var transcriptAudioElement = document.getElementById("transcript_audio_textarea");
var patientAgeElement = document.getElementById("patient_age_textarea");
var patientGenderElement = document.getElementById("patient_gender_textarea");
var patientTemperatureElement = document.getElementById("patient_temperature_textarea");
var patientPulseOxidationElement = document.getElementById("patient_pulse_oximetry_textarea");
var patientHeightElement = document.getElementById("patient_height_textarea");
var patientWeightElement = document.getElementById("patient_weight_textarea");
var patientBloodPressureElement = document.getElementById("patient_blood_pressure_textarea");
var patientComplaintsElement = document.getElementById("patient_complaints_textarea");
var patientHistoryOfIllnessElement = document.getElementById("patient_history_of_illness_textarea");
var patientPastMedicationElement = document.getElementById("patient_past_medication_textarea");
var assessmentElement = document.getElementById("assessment_textarea");
var plansElement = document.getElementById("plans_textarea");
var newPrescriptionElement = document.getElementById("new_prescription_textarea");
var relevantAllergiesElement = document.getElementById("relevant_allergies_textarea");
var relevantMedicationsElement = document.getElementById("relevant_medications_textarea");
var procedureElement = document.getElementById("procedure_textarea");
var pastSurgicalHistoryElement = document.getElementById("past_surgical_history_textarea");
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
const dropdownButton = document.getElementById('dropdownMenuButton');

function toggleSidebar() {
	const sidebar = document.getElementById("mySidebar");
	const main = document.getElementById("main");
	const width = mini ? "250px" : "85px";
	const marginLeft = mini ? "250px" : "85px";

	sidebar.style.width = width;
	main.style.marginLeft = marginLeft;
	mini = !mini;
}

let audioValue
let patient_id_for_pdf
let selectedButton = null;
async function fetchAppointments() {
	const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_appointments/?user_id=${user_id}`; // Replace with your actual backend URL

	try {
		const response = await axios.get(backendURL);
		const appointmentsData = response.data; // Assuming response.data is an array of appointment objects
		const groupedAppointments = {};

		// Group appointments by date
		appointmentsData.forEach((appointment) => {
			const date = new Date(appointment?.created_at).toISOString().split('T')[0];
			//console.log(date);
			//const date = dateTime; // Assuming your data structure has a "date" property
			if (!groupedAppointments[date]) {
				groupedAppointments[date] = [];
			}
			groupedAppointments[date].push(appointment);
		});

		// Iterate through the grouped appointments and create buttons for each group
		for (const date in groupedAppointments) {
			const appointmentsForDate = groupedAppointments[date];

			// Create a container for buttons for this date
			//const dateContainer = document.createElement("div");
			//dateContainer.className = "date-container"; // You can style this class as needed
			const dateHeading = document.createElement("p");
			dateHeading.className = 'date_heading_styles'
			dateHeading.textContent = date;
			dateContainer.appendChild(dateHeading);
			// Create buttons for each appointment on this date
			appointmentsForDate.forEach((patient) => {
				const button = document.createElement("button");
				const cunsultingInfo = document.getElementById('cunsulting_room_data_info')
				const animationContainer = document.getElementById('doctor_animation_appointments');
				button.textContent = patient.patient_name;

				const getJsonPatientId = localStorage.getItem('emr_patient_db_data')
				const getJsonPatientIdTwo = localStorage.getItem('emr_report_data')
				const jsonPatientIdObject = JSON.parse(getJsonPatientId)
				const jsonPatientIdObjectTwo = JSON.parse(getJsonPatientIdTwo)

				button.style.border = "solid 1px gainsboro";
				button.style.width = "90%";
				button.style.height = "50px";
				button.style.borderRadius = "4px";
				button.style.background = "#ffffffb5";
				button.style.color = "#000000";
				button.style.marginTop = '5px';

				if (jsonPatientIdObject?.patient_id === patient?.patient_id || jsonPatientIdObjectTwo?.patient_id === patient?.patient_id) {
					selectedButton = button;
					if (selectedButton) {
						selectedButton.style.backgroundColor = "#000000";
						selectedButton.style.color = "#ffffff";
					}

					console.log(selectedButton, 'selecteed_button')
					patient_id_for_pdf = patient?.patient_id
					audioElement.src = patient.transcript_audio;
					cunsultingInfo.style.display = 'block';
					animationContainer.style.display = 'none';
					selected_patient_audio_url = patient.transcript_audio;
					messageEl.value = patient.transcription_text;
					messageEl.style.cssText = `height: ${messageEl.scrollHeight}px !important`;
					patientNameElement.value = patient.patient_name
					patientAgeElement.value = patient.patient_age
					patientGenderElement.value = patient.patient_gender
					patientTemperatureElement.value = patient.patient_temperature
					patientPulseOxidationElement.value = patient?.patient_pulse_oxymentry
					patientHeightElement.value = patient?.patient_height
					patientWeightElement.value = patient?.patient_weight
					patientBloodPressureElement.value = patient.patient_blood_pressure
					patientComplaintsElement.value = patient.patient_cheif_complaints ? (patientComplaintsFieldElement.style.display = 'block', patient.patient_cheif_complaints) : (patientComplaintsFieldElement.style.display = 'none');
					patientComplaintsElement.style.cssText = `height: ${patientComplaintsElement.scrollHeight}px !important`;
					patientHistoryOfIllnessElement.value = patient.history_of_illness ? (patientHistoryOfIllnessFieldElement.style.display = 'block', patient.history_of_illness) : (patientHistoryOfIllnessFieldElement.style.display = 'none');
					patientHistoryOfIllnessElement.style.cssText = `height: ${patientHistoryOfIllnessElement.scrollHeight}px !important`;
					patientPastMedicationElement.value = patient.past_medication ? (patientPastMedicationFieldElement.style.display = 'block', patient.past_medication) : (patientPastMedicationFieldElement.style.display = 'none');
					patientPastMedicationElement.style.cssText = `height: ${patientPastMedicationElement.scrollHeight}px !important`;
					assessmentElement.value = patient.patient_assessment ? (assessmentFieldElement.style.display = 'block', patient.patient_assessment) : (assessmentFieldElement.style.display = 'none');
					assessmentElement.style.cssText = `height: ${assessmentElement.scrollHeight}px !important`;
					plansElement.value = patient.plans ? (plansFieldElement.style.display = 'block', patient.plans) : (plansFieldElement.style.display = 'none');
					plansElement.style.cssText = `height: ${plansElement.scrollHeight}px !important`;
					newPrescriptionElement.value = patient.new_prescription ? (newPrescriptionFieldElement.style.display = 'block', patient.new_prescription) : (newPrescriptionFieldElement.style.display = 'none');
					newPrescriptionElement.style.cssText = `height: ${newPrescriptionElement.scrollHeight}px !important`;
					relevantAllergiesElement.value = patient.relevant_allergies ? (relevantAllergiesFieldElement.style.display = 'block', patient.relevant_allergies) : (relevantAllergiesFieldElement.style.display = 'none');
					relevantAllergiesElement.style.cssText = `height: ${relevantAllergiesElement.scrollHeight}px !important`;
					relevantMedicationsElement.value = patient.relevant_medications ? (relevantMedicationsFieldElement.style.display = 'block', patient.relevant_medications) : (relevantMedicationsFieldElement.style.display = 'none');
					relevantMedicationsElement.style.cssText = `height: ${relevantMedicationsElement.scrollHeight}px !important`;
					procedureElement.value = patient.procedure ? (procedureFieldElement.style.display = 'block', patient.procedure) : (procedureFieldElement.style.display = 'none');
					procedureElement.style.cssText = `height: ${procedureElement.scrollHeight}px !important`;
					pastSurgicalHistoryElement.value = patient.surgical_history ? (pastSurgicalHistoryFieldElement.style.display = 'block', patient.surgical_history) : (pastSurgicalHistoryFieldElement.style.display = 'none');
					pastSurgicalHistoryElement.style.cssText = `height: ${pastSurgicalHistoryElement.scrollHeight}px !important`;
				}
				button.addEventListener("click", () => {
					if (selectedButton) {
						// Reset the background color of the previous button
						selectedButton.style.backgroundColor = "#ffffffb5";
						selectedButton.style.color = "#000000";
					}

					// Set the background color of the selected button
					button.style.backgroundColor = '#000000';
					button.style.color = '#ffffff';

					// Update the selected button reference
					selectedButton = button;
					console.log(patient?.patient_id);
					patient_id_for_pdf = patient?.patient_id
					audioElement.src = patient.transcript_audio;
					cunsultingInfo.style.display = 'block';
					animationContainer.style.display = 'none';
					selected_patient_audio_url = patient.transcript_audio;
					messageEl.value = patient.transcription_text;
					messageEl.style.cssText = `height: ${messageEl.scrollHeight}px !important`;
					patientNameElement.value = patient.patient_name
					patientAgeElement.value = patient.patient_age
					patientGenderElement.value = patient.patient_gender
					patientTemperatureElement.value = patient.patient_temperature
					patientPulseOxidationElement.value = patient?.patient_pulse_oxymentry
					patientHeightElement.value = patient?.patient_height
					patientWeightElement.value = patient?.patient_weight
					patientBloodPressureElement.value = patient.patient_blood_pressure
					patientComplaintsElement.value = patient.patient_cheif_complaints ? (patientComplaintsFieldElement.style.display = 'block', patient.patient_cheif_complaints) : (patientComplaintsFieldElement.style.display = 'none');
					patientComplaintsElement.style.cssText = `height: ${patientComplaintsElement.scrollHeight}px !important`;
					patientHistoryOfIllnessElement.value = patient.history_of_illness ? (patientHistoryOfIllnessFieldElement.style.display = 'block', patient.history_of_illness) : (patientHistoryOfIllnessFieldElement.style.display = 'none');
					patientHistoryOfIllnessElement.style.cssText = `height: ${patientHistoryOfIllnessElement.scrollHeight}px !important`;
					patientPastMedicationElement.value = patient.past_medication ? (patientPastMedicationFieldElement.style.display = 'block', patient.past_medication) : (patientPastMedicationFieldElement.style.display = 'none');
					patientPastMedicationElement.style.cssText = `height: ${patientPastMedicationElement.scrollHeight}px !important`;
					assessmentElement.value = patient.patient_assessment ? (assessmentFieldElement.style.display = 'block', patient.patient_assessment) : (assessmentFieldElement.style.display = 'none');
					assessmentElement.style.cssText = `height: ${assessmentElement.scrollHeight}px !important`;
					plansElement.value = patient.plans ? (plansFieldElement.style.display = 'block', patient.plans) : (plansFieldElement.style.display = 'none');
					plansElement.style.cssText = `height: ${plansElement.scrollHeight}px !important`;
					newPrescriptionElement.value = patient.new_prescription ? (newPrescriptionFieldElement.style.display = 'block', patient.new_prescription) : (newPrescriptionFieldElement.style.display = 'none');
					newPrescriptionElement.style.cssText = `height: ${newPrescriptionElement.scrollHeight}px !important`;
					relevantAllergiesElement.value = patient.relevant_allergies ? (relevantAllergiesFieldElement.style.display = 'block', patient.relevant_allergies) : (relevantAllergiesFieldElement.style.display = 'none');
					relevantAllergiesElement.style.cssText = `height: ${relevantAllergiesElement.scrollHeight}px !important`;
					relevantMedicationsElement.value = patient.relevant_medications ? (relevantMedicationsFieldElement.style.display = 'block', patient.relevant_medications) : (relevantMedicationsFieldElement.style.display = 'none');
					relevantMedicationsElement.style.cssText = `height: ${relevantMedicationsElement.scrollHeight}px !important`;
					procedureElement.value = patient.procedure ? (procedureFieldElement.style.display = 'block', patient.procedure) : (procedureFieldElement.style.display = 'none');
					procedureElement.style.cssText = `height: ${procedureElement.scrollHeight}px !important`;
					pastSurgicalHistoryElement.value = patient.surgical_history ? (pastSurgicalHistoryFieldElement.style.display = 'block', patient.surgical_history) : (pastSurgicalHistoryFieldElement.style.display = 'none');
					pastSurgicalHistoryElement.style.cssText = `height: ${pastSurgicalHistoryElement.scrollHeight}px !important`;
				});


				dateContainer.appendChild(button);
			});
			buttonContainer.appendChild(dateContainer);

		}
	} catch (error) {
		console.error('Axios error:', error);
	}

}

function copyMessageElText(elementId) {
	const element = document.getElementById(elementId);

	if (element) {
		element.select();
		element.setSelectionRange(0, 99999);
		document.execCommand('copy');
		element.blur();
	}
}

let tempvalue = ''
let isMicrophoneInUse = false;
async function editMicText(inputElementId, elementId, spinnerId, stopId) {

		if (isMicrophoneInUse) {
			alert('Microphone is already in use. Please stop the current recording before starting a new one.');
			return;
		}
	
		// Set the flag to indicate that the microphone is in use
		isMicrophoneInUse = true;

	let microphone;
	let recorder;
	const element = document.getElementById(elementId);
	const spinner = document.getElementById(spinnerId);
	const inputElement = document.getElementById(inputElementId);
	const stopElement = document.getElementById(stopId);
	tempvalue = inputElement.value;
	if (element) {
		element.style.display = 'none';
	}

	if (spinner) {
		spinner.style.display = 'inline-block';
	}

	try {
		const stream = await navigator.mediaDevices.getUserMedia({audio: true});
		console.log(stream, "thessteroem");
		const response = await fetch("https://aiscribe-s3ne.onrender.com/scribe/transcript");
		const data = await response.json();
		if (data.error) {alert(data.error); return;}
		const {token} = data;
		const texts = {};
		console.log(token);
		//const messageEl = document.getElementById('your_message_element_id');
		const socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
		//let msg = inputElement.value;
		socket.onmessage = (message) => {

			const res = JSON.parse(message.data);
			texts[res.audio_start] = res.text;
			const keys = Object.keys(texts);
			keys.sort((a, b) => a - b);
			let msg = inputElement.value;
			let test = ''
			for (const key of keys) {
				console.log(key, texts[key])
				if (texts[key]) {
					console.log(texts[key])
					test += ` ${texts[key]}`;
				}
			}
			if (inputElementId === 'patient_name_textarea' || inputElementId === 'patient_gender_textarea' || inputElementId === 'patient_age_textarea'
				|| inputElementId === 'patient_height_textarea' || inputElementId === 'patient_weight_textarea'
				|| inputElementId === 'patient_temperature_textarea' || inputElementId === 'patient_pulse_oximetry_textarea'
				|| inputElementId === 'patient_blood_pressure_textarea'
			) {
				console.log('this_function_triggered')
				msg = test;
				inputElement.value = msg;
			}
			else {
				msg = '\n' + test;
				inputElement.value = tempvalue + msg;

			}
		};

		socket.onerror = (event) => {
			console.error(event);
			socket.close();
		};

		socket.onclose = (event) => {
			console.log(event);
		};

		socket.onopen = () => {
			spinner.style.display = 'none';
			stopElement.style.display = 'block';
			stopElement.onclick = function () {
				element.style.display = 'block';
				stopElement.style.display = 'none';
				socket.close()
				recorder.stopRecording();
			};
			console.log(stopElement);
			recorder = new RecordRTC(stream, {
				type: "audio",
				mimeType: "audio/webm;codecs=pcm",
				recorderType: StereoAudioRecorder,
				timeSlice: 250,
				desiredSampRate: 16000,
				numberOfAudioChannels: 1,
				bufferSize: 16384,
				audioBitsPerSecond: 128000,
				ondataavailable: (blob) => {
					const reader = new FileReader();
					reader.onload = () => {
						const base64data = reader.result;
						if (socket) {
							socket.send(
								JSON.stringify({
									audio_data: base64data.split("base64,")[1],
								}),
							);
						}
					};
					reader.readAsDataURL(blob);
				},
			});
			recorder.startRecording();
		};
	} catch (err) {
		console.log(err);
	}finally {
        // Set the flag back to false when microphone access is complete (or an error occurs)
        isMicrophoneInUse = false;
    }
}

document.getElementById('download_button').addEventListener('click', function () {
	const zipFileURL = `https://aiscribe-s3ne.onrender.com/scribe/download_audio?audio_url=${selected_patient_audio_url}&patient_id=${patient_id_for_pdf}`

	const xhr = new XMLHttpRequest();
	xhr.open('GET', zipFileURL, true);
	xhr.responseType = 'blob';

	xhr.onload = function () {
		if (xhr.status === 200) {
			const blob = xhr.response;
			const downloadLink = document.createElement('a');
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = `${patientNameElement?.value}(${patient_id_for_pdf}).zip`;
			downloadLink.click();
		} else {
			console.error('Failed to download audio as ZIP.');
		}
	};

	xhr.send();
});


function saveAsPDF() {
	const url = `https://aiscribe-s3ne.onrender.com/scribe/generate_pdf?patient_id=${patient_id_for_pdf}`;
	//window.location.href = url;
	window.open(url);
}

document.getElementById('generate-pdf').addEventListener('click', saveAsPDF);

function Export2Word(element, filename = '') {
	var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
	var postHtml = "</body></html>";
	var html = preHtml + document.getElementById(element).innerHTML + postHtml;

	var blob = new Blob(['\ufeff', html], {
		type: 'application/msword'
	});

	// Specify link url
	var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

	// Specify file name
	filename = filename ? filename + '.doc' : 'document.doc';

	// Create download link element
	var downloadLink = document.createElement("a");

	document.body.appendChild(downloadLink);

	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		// Create a link to the file
		downloadLink.href = url;

		// Setting the file name
		downloadLink.download = filename;

		//triggering the function
		downloadLink.click();
	}

	document.body.removeChild(downloadLink);
}

let checkedCheckboxIDs=[];

async function fetchDataAndPopulateDropdown() {
	const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_templates/?user_id=${user_id}`;
	try {
		const response = await fetch(backendURL);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		const dropdownMenu = document.getElementById('templateDropdown');
		data.forEach(option => {
			if (option.template_name) {
				const menuItem = document.createElement('a');
				menuItem.classList.add('dropdown-item');
				menuItem.addEventListener('click', function (event) {
					event.preventDefault();
					console.log(event.target, option?.templates);
					const selectedText = event.target.textContent;
					checkedCheckboxIDs = option?.templates;

					dropdownButton.textContent = selectedText;
				});
				menuItem.textContent = option.template_name;
				dropdownMenu.appendChild(menuItem);
			}

		});
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}




const regenerate_response = async () => {
	//try {
	//	const config = {
	//		headers: {'content-type': 'multipart/form-data'}
	//	}
	//	const formData = audioElement?.src;
	//	console.log(formData)
	//	if (formData) {
	//		const FILE_URL = formData;
	//		if (FILE_URL) {
	//			try {
	//				const data = {
	//					audio_url: FILE_URL,
	//					templates: checkedCheckboxIDs
	//				}
	//				const config = {
	//					headers: {'content-type': 'application/json'}
	//				}
	//				const lemurResponse = await axios.post('https://aiscribe-s3ne.onrender.com/scribe/lemurAi', data, config);
	//				const lemurResponseData = lemurResponse?.data;
	//				lemurResponseData.transcript_audio = FILE_URL;
	//				lemurResponseData.user_id = 3;
	//				lemurResponseData.patient_name = patient_name_input_element.value;
	//				lemurResponseData.transcription_text = messageEl.value;
	//				const stringified_lemur_data = JSON.stringify(lemurResponse);
	//				localStorage.setItem('emr_report_data', stringified_lemur_data);
	//				loader_contianer_class_element.style.display = 'none';

	//				const apiUrl = 'https://aiscribe-s3ne.onrender.com/scribe/add_appointments';
	//				const requestData = lemurResponse?.data;
	//				async function updateAppointments() {
	//					try {
	//						const response = await axios.post(apiUrl, requestData);
	//						console.log('Appointment created successfully:', response.data, response.data.appointmentId);
	//						lemurResponseData.appointment_id = response?.data?.appointmentId;
	//						lemurResponseData.patient_id = response?.data?.patient_id;
	//						const stringified_response_data = JSON.stringify(response.data);
	//						localStorage.setItem('emr_patient_db_data', stringified_response_data);
	//						window.location.href = './patient_emr/index.html'
	//					} catch (error) {
	//						console.error('Error creating appointment:', error);
	//					}
	//				}

	//				updateAppointments();

	//			} catch (error) {
	//				console.error("Error sending POST request:", error);
	//			}

	//		}
	//	}
	//} catch (error) {
	//	console.error("Error sending POST request:", error);
	//}
	console.log(checkedCheckboxIDs?.length <= 0,checkedCheckboxIDs?.length)
		if (checkedCheckboxIDs?.length <= 0) {
		toast("Please select template before start recording", 5000);
	} else {

	
	const loader_contianer_class_element = document.getElementById('loader_contianer_class');
	const container = document.createElement('div');
	container.classList.add('loader_contianer_class');
	loader_contianer_class_element.style.display = 'flex';
	const appConEle = document.getElementById("appointments_container_con");
	appConEle.style.display='none';
	// Create the SVG element
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('id', 'animated');
	svg.classList.add('loader_class_style');
	svg.setAttribute('viewBox', '0 0 100 100');

	// Create the circle element
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', '50');
	circle.setAttribute('cy', '50');
	circle.setAttribute('r', '45');
	circle.setAttribute('fill', '#FDB900');

	// Create the path element (progress bar)
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('id', 'progress');
	path.setAttribute('stroke-linecap', 'round');
	path.setAttribute('stroke-width', '5');
	path.setAttribute('stroke', '#fff');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', 'M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80');

	// Create the text elements
	const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	countText.setAttribute('id', 'count');
	countText.setAttribute('x', '50');
	countText.setAttribute('y', '50');
	countText.setAttribute('text-anchor', 'middle');
	countText.setAttribute('dy', '7');
	countText.setAttribute('font-size', '20');
	countText.textContent = '0%';

	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('id', 'text');
	text.setAttribute('x', '50');
	text.setAttribute('y', '60');
	text.setAttribute('text-anchor', 'middle');
	text.setAttribute('dy', '7');
	text.setAttribute('font-size', '7');
	text.textContent = 'Audio Processing';

	// Append elements to the container and the container to the document
	svg.appendChild(circle);
	svg.appendChild(path);
	svg.appendChild(countText);
	svg.appendChild(text);
	container.appendChild(svg);
	document.body.appendChild(container);

	// Create the counting animation
	const countElement = document.getElementById('count');
	let counter = 0;
	const duration = 70000;

	function updateCount() {
		counter++;
		if (counter <= 98) {
			countElement.textContent = counter + '%';
			setTimeout(updateCount, (duration / 98));
		}
	}







	try {
		const formData = audioElement?.src;
		const config = {
			method: 'POST',
			body: formData,
		};

		const FILE_URL = formData;
		if (FILE_URL) {
			try {
				const data = {
					audio_url: FILE_URL,
					templates: checkedCheckboxIDs
				};
				const headers = new Headers({
					'Content-Type': 'application/json'
				});
				const config = {
					method: 'POST',
					headers,
					body: JSON.stringify(data)
				};

					setTimeout(updateCount, (duration / 98));

	// Create the progress animation
	const progressElement = document.getElementById('progress');
	const totalLength = progressElement.getTotalLength();

	progressElement.setAttribute('stroke-dasharray', `${totalLength}, ${totalLength}`);
	progressElement.setAttribute('stroke-dashoffset', totalLength);

	progressElement.style.transition = `stroke-dashoffset ${duration}ms linear`;

	setTimeout(() => {
		progressElement.setAttribute('stroke-dashoffset', '0');
	}, 0);
				fetch('https://aiscribe-s3ne.onrender.com/scribe/lemurAi', config)
					.then(response => response.json())
					.then(lemurResponseData => {
						console.log(lemurResponseData);
						lemurResponseData.transcript_audio = FILE_URL;
						lemurResponseData.user_id = 3;
						lemurResponseData.patient_name = patientNameElement.value;
						lemurResponseData.transcription_text = messageEl.value;
						lemurResponseData.patient_id = patient_id_for_pdf;
						const stringified_lemur_data = JSON.stringify(lemurResponseData);
						localStorage.setItem('emr_report_data', stringified_lemur_data);
						//loader_contianer_class_element.style.display = 'none';

						const apiUrl = 'https://aiscribe-s3ne.onrender.com/scribe/update_appointments';
						const requestData = lemurResponseData;

						async function updateAppointment() {
							try {
								const response = await fetch(apiUrl, {
									method: 'PUT',
									headers,
									body: JSON.stringify(requestData)
								});
								const responseData = await response.json();
								lemurResponseData.appointment_id = responseData.appointmentId;
								const stringified_response_data = JSON.stringify(responseData);
								localStorage.setItem('emr_patient_db_data', stringified_response_data);
								location.reload();
							} catch (error) {
								console.error('Error creating appointment:', error);
							}
						}

						updateAppointment();
					})
					.catch(error => {
						console.error('Error sending POST request:', error);
					});
			} catch (error) {
				console.error('Error sending POST request:', error);
			}
		}





	} catch (error) {
		console.error("Error sending POST request:", error);
	}
	}
}


async function fetchUserData() {
	const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	const get_user_url = `https://aiscribe-s3ne.onrender.com/scribe/get_user_by_user_id?user_id=${user_id}`;
	try {
		const response = await fetch(get_user_url);
		console.log(response)
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		const doctorNameElement = document.getElementById('doctor_name_textarea')
		const doctorSpecializationElement = document.getElementById('doctor_specialization_textarea')
		const hospitalNameElement = document.getElementById('hospital_name_textarea')
		doctorNameElement.innerHTML = data[0]?.firstName
		doctorSpecializationElement.innerHTML = data[0]?.specialization
		hospitalNameElement.innerHTML = data[0]?.hospital_name

		console.log(data[0]);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => fetchAppointments());
document.addEventListener('DOMContentLoaded', async () => fetchDataAndPopulateDropdown());
document.addEventListener('DOMContentLoaded', async () => fetchUserData());



function onClickSaveUpdatedPatientData() {
	const patientName = patientNameElement.value;
	const patientAge = patientAgeElement.value;
	const patientGender = patientGenderElement.value;
	const patientTemperature = patientTemperatureElement.value;
	const patientPulseOxidation = patientPulseOxidationElement.value;
	const patientHeight = patientHeightElement.value;
	const patientWeight = patientWeightElement.value;
	const patientBloodPressure = patientBloodPressureElement.value;
	const patientComplaints = patientComplaintsElement.value;
	const patientHistoryOfIllness = patientHistoryOfIllnessElement.value;
	const patientPastMedication = patientPastMedicationElement.value;
	const assessment = assessmentElement.value;
	const plans = plansElement.value;
	const newPrescription = newPrescriptionElement.value;
	const relevantAllergies = relevantAllergiesElement.value;
	const relevantMedications = relevantMedicationsElement.value;
	const procedure = procedureElement.value;
	const pastSurgicalHistory = pastSurgicalHistoryElement.value;

	const requestData = {
		patient_id: patient_id_for_pdf,
		user_id: 3,
		patient_name: patientName,
		patient_age: patientAge,
		patient_gender: patientGender,
		patient_temperature: patientTemperature,
		patient_pulse_oxymentry: patientPulseOxidation,
		patient_height: patientHeight,
		patient_weight: patientWeight,
		patient_blood_pressure: patientBloodPressure,
		patient_cheif_complaints: patientComplaints,
		history_of_illness: patientHistoryOfIllness,
		past_medication: patientPastMedication,
		patient_assessment: assessment,
		plans: plans,
		new_prescription: newPrescription,
		relevant_allergies: relevantAllergies,
		relevant_medications: relevantMedications,
		procedure: procedure,
		surgical_history: pastSurgicalHistory,
		transcript_audio: audioElement.src,
		transcription_text: messageEl.value
	};

	const apiUrl = `https://aiscribe-s3ne.onrender.com/scribe/update_appointments`;

	fetch(apiUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestData),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			toast("Patient Details Saved Successfully", 5000);
			return response.json();
		})
		.then(data => {
			console.log('Success:', data);
		})
		.catch(error => {
			console.error('Error:', error);
		});


}

function toast(sentence, duration) {
	const message = document.querySelector(".toast_custom");
	message.classList.add("toast--show");
	message.innerText = sentence;
	setTimeout(() => {
		message.classList.remove("toast--show");
	}, duration);
}



function onClickPatientSidebar() {
	selectedButton.style.backgroundColor = "#ffffffb5";
	selectedButton.style.color = "#000000";
	const animationContainer = document.getElementById('doctor_animation_appointments');
	const cunsultingInfo = document.getElementById('cunsulting_room_data_info')
	animationContainer.style.display = 'block';
	cunsultingInfo.style.display = 'none';
	selectedButton = null;

	console.log('appointments_sidebar clicked')
}



function adjustTextareaHeight(elementIdKey) {
	// Get the textarea element
	var textarea = document.getElementById(elementIdKey);

	// Adjust the textarea height based on the content
	textarea.style.height = "auto";
	textarea.style.height = (textarea.scrollHeight) + "px";
	console.log((textarea.scrollHeight) + "px")
}

function onclickappMenu() {
	const buttonContainerElement = document.getElementById('button-container');
	const appointmentConEle = document.getElementById('cunsulting_room_data_info');
	const cunsultingInfo = document.getElementById('cunsulting_room_data_info');
	const sidebarBtnEle = document.getElementById('patient_name_sidebar_button_con');
//const datecontainer = document.getElementById('date-container');
	// Toggle display for buttonContainerElement
	//cunsultingInfo.style.display = 'block';
	buttonContainerElement.style.display = (buttonContainerElement.style.display === 'none') ? 'flex' : 'none';
	sidebarBtnEle.style.display = (sidebarBtnEle.style.display === 'none') ? 'flex' : 'none';
//datecontainer.style.display = (sidebarBtnEle.style.display === 'none') ? 'flex' 
	// Set display for appointmentConEle based on the state of buttonContainerElement
	appointmentConEle.style.display = (buttonContainerElement.style.display === 'none') ? 'flex !important' : 'none';
}

function expandHeader() {
	var header_element = document.getElementById('header_container');
	var currentHeight = parseInt(header_element.style.height, 10);
	let sidebar_header_mobileElement = document.getElementById('sidebar_header_mobile_id')

	if (isNaN(currentHeight) || currentHeight === 85) {
		// If the height is not set or is currently 85px, expand to 300px
		header_element.style.height = '300px';
		header_element.style.position = 'absolute'
		header_element.style.left = '30px'
		header_element.style.bottom = '-20px'
		sidebar_header_mobileElement.style.display = 'block'
		sidebar_header_mobileElement.style.marginRight = '20px'
	} else {
		// If the height is currently 300px, collapse to 85px
		header_element.style.height = '85px';
		sidebar_header_mobileElement.style.display = 'none'
	}
	header_element.classList.add('smooth-transition');

	// After the transition is complete, remove the class
	setTimeout(function () {
		header_element.classList.remove('smooth-transition');
	}, 500);
}





