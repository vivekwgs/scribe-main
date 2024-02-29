﻿var mini = true;

function toggleSidebar() {
	if (mini) {
		console.log("opening sidebar");
		document.getElementById("mySidebar").style.width = "250px";
		document.getElementById("main").style.marginLeft = "250px";
		this.mini = false;
	} else {
		console.log("closing sidebar");
		document.getElementById("mySidebar").style.width = "85px";
		document.getElementById("main").style.marginLeft = "85px";
		this.mini = true;
	}
}

var microphone;
var recorder;
var isRecording = false;
var audio = document.querySelector('audio');
var patinet_input_box_element = document.getElementById('patient_input_box');
var patient_name_input_element = document.getElementById('patient_name_input');
var patient_button_element = document.getElementById('patient_button');
var cunsulting_container_element = document.getElementById('content_container_consulting');
var button_start_recording = document.getElementById('btn-start-recording');
var socket_status_element = document.getElementById("real_time_socket_status");
var button_stop_recording = document.getElementById('btn-stop-recording');
var button_download_recording = document.getElementById('btn-download-recording');
var real_time_title_element = document.getElementById("real-time-title");
var messageEl = document.getElementById("message_input");
const convo_text_container_el = document.getElementById('conv_text_container');
const button_stop_recording_element = document.getElementById('btn-stop-recording');
const button_download_recording_element = document.getElementById('btn-download-recording');
const appContainerEl = document.getElementById('app_container');
const promptHeader = `Act as a dr's' assitant and generate an EMR(Electronic Medical Record)report from the assistant point of view for a patient start with during the recent visit of [patient name] , who had a recent medical visit with a doctor. this emr will be stored for medical records so if value for any field is not available simply put as not avialable. The real conversation of the transcript is as follows:`;
const promptFooter = `Please include the following sections in the EMR report:\n\n1. Patient Information: Provide a concise summary of the patient's information, including name, age, gender, date of birth, contact number.\n\n2. Chief Complaints: Identify the patient's chief complaints from the conversation, explain them clearly without adding irrelevant details.\n\n3. Patient History of Illness: Describe any relevant patient history of illness mentioned in the conversation.\n\n4. Patient's Past Medication: List and explain any past medications mentioned in the conversation.\n\n5. Assessments: Summarize the assessments made by the doctor based on the conversation.\n\n6. Plans: Outline the plans and recommendations discussed in the conversation regarding the patient's treatment and care.\n\n7. Prescription Renewal: Provide information about any prescription renewal mentioned in the conversation.\n\n8. New Prescription: Detail any new prescription issued by the doctor during the visit.\n\n9. Follow-up: Explain the follow-up instructions and actions recommended for the patient.\n\n10. Patient Vitals (if available): Mention any patient vitals such as temperature, pulse oxidation, height, weight, and blood pressure if provided in the conversation.\n\n11. Sentimental Breakdown: Analyze the sentiment expressed in the conversation, including negative, neutral, and positive percentages.\n\nEnsure that the report is formatted in a clear and organized manner, following medical record standards. Additionally, answer the following questions based on the conversation:\n\n- What are the patient vitals following inputs? Explain each parameter clearly.\n- What are the sentimental breakdowns for the negative, neutral, and positive percentages from this conversation?  each field should have summary of atleast 1000 words or more mostly start with during the recent visit of [patient name] instead of reffering to the patient as the patient refer to him/her with name most importantly every thing should be in detail as it is generated by the pov of Dr's assistant and Please generate the EMR report without any additional notes or comments`

var checkedCheckboxIDs = [];

const checkbox_patient_name = document.getElementById("patient_name");
const checkbox_patient_age = document.getElementById("patient_age");
const checkbox_patient_gender = document.getElementById("patient_gender");
const checkbox_patient_temperature = document.getElementById("patient_temperature");
const checkbox_pulse_oxymentry = document.getElementById("patient_pulse_oxymentry");
const checkbox_patient_height = document.getElementById("patient_height");
const checkbox_patient_weight = document.getElementById("patient_weight");
const checkbox_patient_blood_pressure = document.getElementById("patient_blood_pressure");
const checkbox_patient_complaints = document.getElementById("patient_cheif_complaints");
const checkbox_history_of_illness = document.getElementById("history_of_illness");
const checkbox_past_medication = document.getElementById("past_medication");
const checkbox_patient_assessment = document.getElementById("patient_assessment");
const checkbox_plans = document.getElementById("plans");
const checkbox_new_prescription = document.getElementById("new_prescription");
const checkbox_relevant_allergies = document.getElementById("relevant_allergies");
const checkbox_relevant_medications = document.getElementById("relevant_medications");
const checkbox_procedure = document.getElementById("procedure");
const checkbox_surgical_history = document.getElementById("surgical_history");
const reset_button_element = document.getElementById("reloadButton");
const dropdownButton = document.getElementById('dropdownMenuButton');


reset_button_element.addEventListener("click", function () {
	// Reload the page when the button is clicked
	location.reload();
});

function updateCheckedIDs(checkbox) {
	const checkboxID = checkbox.id;
	if (checkbox.checked) {
		if (!checkedCheckboxIDs.includes(checkboxID)) {
			checkedCheckboxIDs.push(checkboxID);
		}
	} else {
		const index = checkedCheckboxIDs.indexOf(checkboxID);
		if (index !== -1) {
			checkedCheckboxIDs.splice(index, 1);
		}
	}

	console.log("Checked Checkboxes: " + checkedCheckboxIDs);
}

checkbox_patient_name.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_name);
});
checkbox_patient_age.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_age);
});
checkbox_patient_gender.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_gender);
});
checkbox_patient_temperature.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_temperature);
});
checkbox_pulse_oxymentry.addEventListener("change", function () {
	updateCheckedIDs(checkbox_pulse_oxymentry);
});
checkbox_patient_height.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_height);
});
checkbox_patient_weight.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_weight);
});
checkbox_patient_blood_pressure.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_blood_pressure);
});
checkbox_patient_complaints.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_complaints);
});
checkbox_history_of_illness.addEventListener("change", function () {
	updateCheckedIDs(checkbox_history_of_illness);
});
checkbox_past_medication.addEventListener("change", function () {
	updateCheckedIDs(checkbox_past_medication);
});
checkbox_patient_assessment.addEventListener("change", function () {
	updateCheckedIDs(checkbox_patient_assessment);
});
checkbox_plans.addEventListener("change", function () {
	updateCheckedIDs(checkbox_plans);
});
checkbox_new_prescription.addEventListener("change", function () {
	updateCheckedIDs(checkbox_new_prescription);
});
checkbox_relevant_allergies.addEventListener("change", function () {
	updateCheckedIDs(checkbox_relevant_allergies);
});
checkbox_relevant_medications.addEventListener("change", function () {
	updateCheckedIDs(checkbox_relevant_medications);
});
checkbox_procedure.addEventListener("change", function () {
	updateCheckedIDs(checkbox_procedure);
});
checkbox_surgical_history.addEventListener("change", function () {
	updateCheckedIDs(checkbox_surgical_history);
});





patient_name_input_element.addEventListener('input', function (e) {
	patient_name_input_element.value = e.target.value;
});

patient_button_element.addEventListener('click', function () {
	if (patient_name_input_element?.value) {
		patinet_input_box_element.style.display = 'none';
		cunsulting_container_element.style.display = 'block';
	}
});


function captureMicrophone(callback) {
	if (microphone) {
		callback(microphone);
		return;
	}

	if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
		alert('This browser does not supports WebRTC getUserMedia API.');

		if (!!navigator.getUserMedia) {
			alert('This browser seems supporting deprecated getUserMedia API.');
		}
	}

	navigator.mediaDevices.getUserMedia({
		audio: isEdge ? true : {
			echoCancellation: false
		}
	}).then(function (mic) {

		// Add current date and time
		const currentDate = new Date();
		const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

		// Update the p element with the class real-time-interface__title
		const titleElement = document.querySelector('.DateandTime');
		if (titleElement) {
			titleElement.innerText = `Microphone Access Granted at ${formattedDate}`;
		}

		callback(mic);
	}).catch(function (error) {
		alert('Unable to capture your microphone. Please check console logs.');
		console.error(error);
	});
}

function click(el) {
	el.disabled = false;
	var evt = document.createEvent('Event');
	evt.initEvent('click', true, true);
	el.dispatchEvent(evt);
}

function replaceAudio(src) {
	var newAudio = document.createElement('audio');
	newAudio.controls = true;
	newAudio.autoplay = true;

	if (src) {
		newAudio.src = src;
	}

	var parentNode = audio.parentNode;
	parentNode.innerHTML = '';
	parentNode.appendChild(newAudio);

	audio = newAudio;
}


function toast(sentence, duration) {
	const message = document.querySelector(".toast");
	message.classList.add("toast--show");
	message.innerText = sentence;
	setTimeout(() => {
		message.classList.remove("toast--show");
	}, duration);
}


button_start_recording.onclick = async function () {
	if (checkedCheckboxIDs.length <= 0) {
		toast("Please select template before start recording", 5000);
	} else {
		this.disabled = true;
		//this.style.display = 'none';
		this.style.border = '';
		this.style.fontSize = '';
		socket_status_element.style.display = 'block';
		dropdownButton.style.display = 'none';
		socket_status_element.innerText = "Initializing system...."
		if (!microphone) {
			captureMicrophone(function (mic) {
				microphone = mic;

				if (isSafari) {
					replaceAudio();

					audio.muted = true;
					audio.srcObject = microphone;

					button_start_recording.disabled = false;
					button_start_recording.style.border = '1px solid red';
					button_start_recording.style.fontSize = '150%';

					alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
					return;
				}

				click(button_start_recording);
			});
			return;
		}

		replaceAudio();

		audio.muted = true;
		audio.srcObject = microphone;

		var options = {
			type: 'audio',
			numberOfAudioChannels: isEdge ? 1 : 2,
			checkForInactiveTracks: true,
			bufferSize: 16384
		};

		if (isSafari || isEdge) {
			options.recorderType = StereoAudioRecorder;
		}

		if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
			options.sampleRate = 48000;
		}

		if (isSafari) {
			options.sampleRate = 44100;
			options.bufferSize = 4096;
			options.numberOfAudioChannels = 2;
		}

		if (recorder) {
			recorder.destroy();
			recorder = null;
		}

		recorder = RecordRTC(microphone, options);
		socket_status_element.innerText = "Connecting to Websockets...."
		const response = await fetch("https://aiscribe-s3ne.onrender.com/scribe/transcript");
		const data = await response.json();

		if (data.error) {
			alert(data.error);
		}


		const {token} = data;
		socket = await new WebSocket(
			`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`,
		);

		const texts = {};
		socket.onmessage = (message) => {
			let msg = "";
			const res = JSON.parse(message.data);
			texts[res.audio_start] = res.text;
			const keys = Object.keys(texts);
			keys.sort((a, b) => a - b);
			for (const key of keys) {
				if (texts[key]) {
					msg += ` ${texts[key]}`;
				}
			}
			messageEl.value = msg;
			messageEl.style.height = (messageEl.scrollHeight) + "px";
		};

		socket.onerror = (event) => {
			console.error(event);
			socket.close();
		};

		socket.onclose = (event) => {
			console.log(event);
			socket = null;
		};
		socket.onopen = () => {

			convo_text_container_el.style.display = "block"
			messageEl.style.display = "";
			recorder = new RecordRTC(microphone, {
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
		button_stop_recording.disabled = false;
		button_stop_recording.style.display = "block";
		button_download_recording.disabled = true;
		isRecording = !isRecording;
		real_time_title_element.innerText = isRecording
			? "Click stop to end recording!"
			: "Click start to begin recording!";
		socket_status_element.innerText = isRecording
			? "Web Sockets connection established." : "Connecting to Websockets...."
	}


};


function copyMessageElText() {
	var textarea = document.getElementById("message_input");
	textarea.select();
	textarea.setSelectionRange(0, 99999);
	document.execCommand("copy");
	textarea.setSelectionRange(0, 0);
}

async function stopRecordingCallback() {

	socket.send(JSON.stringify({terminate_session: true}));
	socket.close();
	socket = null;
	const audioBlob = recorder.getBlob();
	replaceAudio(URL.createObjectURL(audioBlob));

	button_start_recording.disabled = false;

	audio.pause();
	button_download_recording_element.disabled = false;

	if (isSafari) {
		click(btnReleaseMicrophone);
	}
	const loader_contianer_class_element = document.getElementById('loader_contianer_class');
	const container = document.createElement('div');
	container.classList.add('loader_contianer_class');
	loader_contianer_class_element.style.display = 'flex';
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

	const formData = new FormData(); // Replace with your form data
	formData.append('wavfile', audioBlob, "recording.wav");
	//let FILE_URL

	//const data = {
	//	//model: "text-davinci-003",
	//	//prompt: `${promptHeader} ${messageEl.value} ${promptFooter}`,
	//	audio_url: "https://aiscribe-s3ne.onrender.com/scribe/text",
	//	templates: checkedCheckboxIDs
	//}
	//const url = "https://aiscribe-s3ne.onrender.com/scribe/text";
	//const url = "https://aiscribe-s3ne.onrender.com/scribe/lemurAi";
	try {
		const config = {
			headers: {'content-type': 'multipart/form-data'}
		}
		const uploadResponse = await axios.post('https://aiscribe-s3ne.onrender.com/scribe/upload', formData, config);
		const FILE_URL = uploadResponse?.data?.Location;
		if (FILE_URL) {
			try {
				const data = {
					audio_url: FILE_URL,
					templates: checkedCheckboxIDs
				}
				const config = {
					headers: {'content-type': 'application/json'}
				}
				const lemurResponse = await axios.post('https://aiscribe-s3ne.onrender.com/scribe/lemurAi', data, config);
				const lemurResponseData = lemurResponse?.data;
				lemurResponseData.transcript_audio = FILE_URL;
				lemurResponseData.user_id = 3;
				lemurResponseData.patient_name = patient_name_input_element.value;
				lemurResponseData.transcription_text = messageEl.value;
				console.log(lemurResponseData);
				const stringified_lemur_data = JSON.stringify(lemurResponse);
				localStorage.setItem('emr_report_data', stringified_lemur_data);
				console.log(lemurResponse?.data);
				loader_contianer_class_element.style.display = 'none';
				const apiUrl = 'https://aiscribe-s3ne.onrender.com/scribe/add_appointments'; // Replace with your actual API URL
				//const requestData = {
				//	user_id: lemurResponseData?.user_id || '',
				//	patient_name: lemurResponseData?.patient_name || '',
				//	patient_age: lemurResponseData?.patient_age || '',
				//	patient_gender: lemurResponseData?.patient_gender || '',
				//	patient_temperature: lemurResponseData?.patient_temperature || '',
				//	patient_pulse_oximetry: lemurResponseData?.patient_pulse_oximetry || '',
				//	patient_height: lemurResponseData?.patient_height || '',
				//	patient_weight: lemurResponseData?.patient_weight || '',
				//	patient_blood_pressure: lemurResponseData?.patient_blood_pressure || '',
				//	patient_complaints: lemurResponseData?.patient_complaints || '',
				//	patient_history_of_illness: lemurResponseData?.patient_history_of_illness || '',
				//	patient_past_medication: lemurResponseData?.patient_past_medication || '',
				//	assessment: lemurResponseData?.assessment || '',
				//	plans: lemurResponseData?.plans || '',
				//	patient_followup: lemurResponseData?.patient_followup || '',
				//	patient_vitals: lemurResponseData?.patient_vitals || '',
				//	transcription_text: lemurResponseData?.transcription_text || '',
				//	transcript_audio: lemurResponseData?.transcript_audio || '',
				//};
				const requestData = lemurResponse?.data;
				async function createAppointment() {
					try {
						const response = await axios.post(apiUrl, requestData);
						// Handle the successful response here
						console.log('Appointment created successfully:', response.data);
						window.location.href = './patient_emr/index.html'
					} catch (error) {
						// Handle any errors that occur during the request
						console.error('Error creating appointment:', error);
					}
				}

				// Call the async function to make the API call
				createAppointment();

			} catch (error) {
				console.error("Error sending POST request:", error);
				// Handle errors here
			}

		}

		//console.log(response?.data);
		////response_container_element.innerHTML = `<h1>EMR Report</h1>${response.data?.result}`;
		//console.log(checkedCheckboxIDs, 'thecheckbox ids after stop');
		//function formatResultText(text) {
		//	return text.replace(/\n/g, '<br>');
		//}


		//response_container_element.innerHTML = `
		//        <p class="highlight_heading">EMR Report</p>
		//        <p>${formatResultText(response.data?.result)}</p>`;
		//response_container_element.style.display = "block"


		// Create the container element

		//loader_contianer_class_element.style.display = 'none';
	} catch (error) {
		console.error("Error sending POST request:", error);
		// Handle errors here
	}
	//let FILE_URL

	//async function uploadAndTranscribe() {
	//    try {
	//        const highlightListContEl = document.getElementById('high_light_list_container');
	//        const convo_text_container_el = document.getElementById('convo_text_container');
	//        const convo_dialog_container_el = document.getElementById('convo_dialog_container');
	//        const summary_text_container_el = document.getElementById('summary_text_container');
	//        highlightListContEl.style.display = "block";
	//        convo_text_container_el.style.display = "block";
	//        convo_dialog_container_el.style.display = "block";
	//        summary_text_container_el.style.display = "block";
	//        // Upload audio
	//        const config = {
	//            headers: {'content-type': 'multipart/form-data'}
	//        }
	//        const uploadResponse = await axios.post('https://aiscribe-s3ne.onrender.com/scribe/upload', formData, config);
	//        //const {data} = uploadResponse;
	//        //console.log(uploadResponse?.data?.Location, "response");
	//        const FILE_URL = uploadResponse?.data?.Location
	//        //const FILE_URL = "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3"

	//        const transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

	//        // request parameters where Sentiment Analysis has been enabled
	//        const data = {
	//            audio_url: FILE_URL,
	//            sentiment_analysis: true,
	//            // auto_chapters: true,
	//            speaker_labels: true,


	//            summarization: true,
	//            summary_model: 'informative',
	//            summary_type: 'bullets',

	//            content_safety: true,
	//            entity_detection: true,
	//            // redact_pii: true,
	//            // redact_pii_policies: ["us_social_security_number", "credit_card_number"],
	//            iab_categories: true,

	//            auto_highlights: true
	//        }

	//        // HTTP request headers
	//        const headers = {
	//            "Authorization": '9cc3b1fb5dfe4ac9b86a35c040715885',
	//            "Content-Type": "application/json"
	//        }

	//        // submit for transcription via HTTP request
	//        const response = await axios.post(transcript_endpoint, data, {headers: headers})
	//        // polling for transcription completion
	//        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${response.data.id}`

	//        while (true) {
	//            const pollingResponse = await axios.get(pollingEndpoint, {
	//                headers: headers
	//            })

	//            const transcriptionResult = pollingResponse.data
	//            //console.log(pollingResponse, transcriptionResult)
	//            if (transcriptionResult.status === 'completed') {
	//                loaderContainerEl.style.display = "none";
	//                appContainerEl.style.display = "block"
	//                emrButtonEl.style.display = "block"
	//                // print the results
	//                //console.log(transcriptionResult)
	//                summaryEl.innerText = transcriptionResult?.summary;
	//                messageEl.value = transcriptionResult?.text;
	//                messageEl.style.height = (messageEl.scrollHeight) + "px";
	//                //messageEl.innerText = transcriptionResult?.text;
	//                textTranscriptionResult = transcriptionResult?.text;
	//                transcriptionResult?.utterances?.forEach((utterance, index) => {
	//                    const speaker = utterance.speaker;
	//                    const text = utterance.text;

	//                    // Create a paragraph element for each utterance
	//                    const paragraph = document.createElement('p');

	//                    // Add the speaker and text to the paragraph
	//                    paragraph.innerHTML = `<strong> Speaker ${speaker}:</strong> ${text}`;

	//                    // Append the paragraph to the transcript container
	//                    transcriptContainer.appendChild(paragraph);
	//                });
	//                const sentimentCounts = {
	//                    "A": {"positive": 0, "negative": 0, "neutral": 0},
	//                    "B": {"positive": 0, "negative": 0, "neutral": 0},
	//                };
	//                //console.log(sentimentCounts);

	//                // Iterate through the sentiment data
	//                transcriptionResult?.sentiment_analysis_results?.forEach((item) => {
	//                    const speaker = item.speaker;
	//                    const sentiment = item.sentiment;

	//                    // Update sentiment count for the speaker
	//                    sentimentCounts[speaker][sentiment.toLowerCase()]++;
	//                });
	//                //console.log(transcriptionResult);
	//                // Calculate overall average sentiment
	//                const overallSentiment = () => {
	//                    const total = transcriptionResult?.sentiment_analysis_results?.length;
	//                    const positiveCount = transcriptionResult?.sentiment_analysis_results?.filter(item => item.sentiment === "POSITIVE").length;
	//                    const negativeCount = transcriptionResult?.sentiment_analysis_results?.filter(item => item.sentiment === "NEGATIVE").length;
	//                    const neutralCount = transcriptionResult?.sentiment_analysis_results?.filter(item => item.sentiment === "NEUTRAL").length;

	//                    if (positiveCount > negativeCount && positiveCount > neutralCount) {
	//                        return "POSITIVE";
	//                    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
	//                        return "NEGATIVE";
	//                    } else {
	//                        return "NEUTRAL";
	//                    }
	//                };

	//                // Display sentiment results in HTML
	//                const sentimentResultsContainer = document.getElementById('sentimentResults');
	//                sentimentResultsContainer.innerHTML = `
	//                        <h2>Speaker A:</h2>
	//                        <p>Positive: ${sentimentCounts["A"]["positive"]}</p>
	//                        <p>Negative: ${sentimentCounts["A"]["negative"]}</p>
	//                        <p>Neutral: ${sentimentCounts["A"]["neutral"]}</p>

	//                        <h2>Speaker B:</h2>
	//                        <p>Positive: ${sentimentCounts["B"]["positive"]}</p>
	//                        <p>Negative: ${sentimentCounts["B"]["negative"]}</p>
	//                        <p>Neutral: ${sentimentCounts["B"]["neutral"]}</p>

	//                        <h2>Overall Average Sentiment:</h2>
	//                        <p>${overallSentiment()}</p>
	//                    `;

	//                const resultsArray = transcriptionResult?.auto_highlights_result.results;

	//                // Get the <ul> element where you want to display the text results
	//                const highlightList = document.getElementById('highlightList');


	//                // Iterate through the results and add text results to the <ul> as list items
	//                resultsArray.forEach((result, index) => {
	//                    const text = result.text;
	//                    const listItem = document.createElement('li');
	//                    listItem.textContent = text;
	//                    highlightList.appendChild(listItem);
	//                });

	//                break
	//            } else if (transcriptionResult.status === 'error') {
	//                throw new Error(`Transcription failed: ${transcriptionResult.error}`)
	//            } else {
	//                await new Promise((resolve) => setTimeout(resolve, 3000))
	//            }
	//        }

	//    } catch (error) {
	//        const highlightListContEl = document.getElementById('high_light_list_container');
	//        const convo_text_container_el = document.getElementById('convo_text_container');
	//        const convo_dialog_container_el = document.getElementById('convo_dialog_container');
	//        const summary_text_container_el = document.getElementById('summary_text_container');
	//        highlightListContEl.style.display = "none";
	//        convo_text_container_el.style.display = "none";
	//        convo_dialog_container_el.style.display = "none";
	//        summary_text_container_el.style.display = "none";
	//        console.error('Error:', error.response ? error.response.data : error.message);
	//    }
	//}

	//// Call the function
	//uploadAndTranscribe();

	//console.log(FILE_URL);
}

button_stop_recording_element.onclick = function () {
	//this.disabled = true;

	//console.log(messageEl.value.length > 100);
	if (messageEl.value.length > 100) {
		this.disabled = true;
		this.style.display = "none";
		recorder.stopRecording(stopRecordingCallback);
	} else {
		toast("Audio content is too short to process please try speaking more", 5000);
	}
	//this.style.display = "none";
	//recorder.stopRecording(stopRecordingCallback);

};


//document.addEventListener('DOMContentLoaded', async function () {
// //   let transcribed_data
// //   const FILE_URL = "https://github.com/AssemblyAI-Examples/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3"

// //   const transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

// //   // request parameters where Sentiment Analysis has been enabled
// //   const data = {
// //       audio_url: FILE_URL,
// //   }

// //   // HTTP request headers
// //   const headers = {
// //       "Authorization": '9cc3b1fb5dfe4ac9b86a35c040715885',
// //       "Content-Type": "application/json"
// //   }

// //   // submit for transcription via HTTP request
// //   const response = await axios.post(transcript_endpoint, data, {headers: headers})
// //   // polling for transcription completion
// //   const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${response.data.id}`

// //   while (transcribed_data?.status !== "completed") {
// //       const pollingResponse = await axios.get(pollingEndpoint, {
// //           headers: headers
// //       })

// //       const transcriptionResult = pollingResponse.data
// //       transcribed_data = transcriptionResult;
// //       console.log(transcriptionResult?.status === "completed")
// //   }
//	//if (transcribed_data?.status === "completed") {
//	//	console.log(transcribed_data?.id);
//	//	const context =
//	//		'This is a Product Team meeting from 2019-07-09. These action items will be generated for meeting members as a reminder, so there is no need to be excessively detailed in the action items.'

//	//	const answerFormat = `
// //           Action item title: A brief, descriptive title that summarizes the action item.
// //           Assignee: The person who is responsible for completing the action item.
// //           Due date: The deadline for completing the action item.
// //           Status: The current status of the action item (e.g., "In progress", "Completed", "Deferred").
// //           Notes: Any additional notes or information about the action item.`

// //       const data = {
// //           transcript_ids: [`${transcribed_data?.id}`],
// //           context: context,
// //           answerFormat: answerFormat
// //       }

// //       const url = 'https://api.assemblyai.com/lemur/v3/generate/summary'
// //       const headers = {authorization: '9cc3b1fb5dfe4ac9b86a35c040715885'};
// //       (async () => {
// //           try {
// //               const httpResponse = await axios.post(url, data, {headers})
// //               console.log(httpResponse.data.response)
// //           } catch (error) {
// //               console.log(error)
// //           }
// //       })()

//	//}
//});

// Function to make an API call and retrieve template names
async function fetchTemplates() {
	const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_templates/?user_id=${user_id}`; // Replace with your actual backend URL

	try {
		const response = await axios.get(backendURL);
		console.log(response?.data);
		return response?.data;
		//const data = await response.json();
		//return data;
	} catch (error) {
		console.error('Error fetching templates:', error);
		return [];
	}
}

// Function to create buttons based on the retrieved template names
async function createButtons() {
	const templatesContainer = document.querySelector('.templates-container');
	const templateData = await fetchTemplates();
	templatesContainer.innerHTML = '';
	templateData.forEach((template) => {
		console.log(template);
		const button = document.createElement('button');
		button.textContent = template.template_name || 'Unnamed Template';
		button.classList.add('btn', 'btn-primary', 'template_button');
		button.addEventListener('click', () => selectTemplate(template));
		templatesContainer.appendChild(button);
	});
}

// Function to handle template selection
function selectTemplate(template) {
	// You can perform actions with the selected template, e.g., store it in a variable or send it to the server
	console.log('Selected Template:', template?.templates);
	checkedCheckboxIDs = template?.templates;
}

// Event listener for the "Load Templates" button click
document.getElementById('loadTemplatesButton').addEventListener('click', () => {
	createButtons();
});

let templateNameVariable = ''; // Initialize a variable to store the template name

function saveTemplateName(inputElement) {
	templateNameVariable = inputElement.value; // Save the input value in the variable
	console.log('Template Name: ', templateNameVariable); // Display the value in the console (you can remove this line)
}

document.getElementById('addTemplateButton').addEventListener('click', async () => {
	try {
		// Prepare the data to send in the POST request
		const data = {
			user_id: 3, // Replace with the actual user ID
			template: checkedCheckboxIDs, // Replace with the actual template data
			template_name: templateNameVariable,
		};

		// Make a POST request using Axios with async/await
		const url = 'https://aiscribe-s3ne.onrender.com/scribe/add_template'
		const response = await axios.post(url, data);

		// Handle a successful response here
		console.log('Template added successfully:', response.data);
	} catch (error) {
		// Handle any errors here
		console.error('Error adding template:', error);
	}
});

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

fetchDataAndPopulateDropdown()


const toggleChatButton = document.getElementById('toggleChat');
const chatContainer = document.getElementById('chatContainer');
const closeChatButton = document.getElementById('closeChat');

toggleChatButton.addEventListener('click', () => {
	chatContainer.style.display = 'block';
});

function showAnswer(answerId) {
	const answer = document.getElementById(`answer${answerId}`);
	if (answer) {
		answer.style.display = 'block';
		// Scroll to the selected answer smoothly
		answer.scrollIntoView({ behavior: 'smooth' });
	}
}

function closeChat() {
	chatContainer.style.display = 'none';
}


document.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	closeChat();
});

