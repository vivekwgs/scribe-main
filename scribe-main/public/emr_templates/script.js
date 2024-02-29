function click(el) {
	el.disabled = false;
	el.click();
}

async function fetchTemplates() {
	const user_id = 3;
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_templates/?user_id=${user_id}`; // Replace with your actual backend URL

	try {
		const response = await fetch(backendURL);

		if (response.ok) {
			return await response.json();
		} else {
			console.error('Error fetching templates:', response.statusText);
			return [];
		}
	} catch (error) {
		console.error('Request failed', error);

		return [];
	}
}

async function createButtons() {
	const templatesContainer = document.querySelector('.templates-container');
	templatesContainer.innerHTML = '';

	try {
		const templateData = await fetchTemplates();
		console.log(templateData);
		const row = document.createElement('div');
		row.classList.add('row');
		row.style.width = '100%'; // Set the width to 100%
		templatesContainer.appendChild(row);

		templateData.forEach((template) => {
			const col = document.createElement('div');
			//col.classList.add('col-4');
			col.classList.add('col-sm-12');
			col.classList.add('col-md-6');
			col.classList.add('col-lg-4');
			const button = document.createElement('button');
			button.classList.add('btn', 'btn-primary', 'template_button');
			button.textContent = template.template_name || 'Unnamed Template';

			const buttonIconContainer = document.createElement('div');
			buttonIconContainer.classList.add('button_icon_container');
			const editButton = createIconButton('edit_square');
			editButton.addEventListener('click', () => {
				openEditModal(template);
			});
			const deleteButton = createIconButton('delete');
			deleteButton.addEventListener('click', async () => {
				try {
					// Make an API call to delete the template using template_id
					await deleteTemplate(template.templates_id);
					//col.remove();

				} catch (error) {
					console.error('Failed to delete the template', error);
				}
			});
			buttonIconContainer.appendChild(editButton);
			buttonIconContainer.appendChild(deleteButton);
			button.appendChild(buttonIconContainer);

			button.addEventListener('click', () => selectTemplate(template));

			col.appendChild(button);
			row.appendChild(col);
		});
	} catch (error) {
		console.error('Failed to create buttons', error);
	}
}
let delete_template_id
async function deleteTemplate(templateId) {
	$('#deleteTemplateModal').modal('show');
	delete_template_id = templateId;
	//console.log(templateId);
}

document.getElementById('deleteTemplateModalButton').addEventListener('click', async () => {
	const user_id = 3;
	const apiUrl = `https://aiscribe-s3ne.onrender.com/scribe/delete_templates/?template_id=${delete_template_id}&user_id=${user_id}`; // Replace with your API endpoint

	try {
		const response = await fetch(`${apiUrl}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				// Add any necessary headers, such as authentication tokens
			},
		});

		if (response.ok) {
			// Template was successfully deleted
			console.log('Template deleted successfully.');
			$('#deleteTemplateModal').modal('hide');
			window.location.reload();
		} else {
			// Handle any potential errors or non-successful response here
			const data = await response.json();
			console.error('Failed to delete template:', data);
			$('#deleteTemplateModal').modal('hide');
		}
	} catch (error) {
		console.error('An error occurred while deleting the template:', error);
		$('#deleteTemplateModal').modal('hide');
	}
});

function createIconButton(iconName) {
	const iconButton = document.createElement('button');
	iconButton.classList.add('icon_button');
	const iconSpan = document.createElement('span');
	iconSpan.classList.add('material-symbols-outlined');
	iconSpan.textContent = iconName;
	iconButton.appendChild(iconSpan);
	return iconButton;
}


function selectTemplate(template) {
}

window.addEventListener('DOMContentLoaded', createButtons);

let checkedCheckboxIDs = [];

const checkbox_patient_name = document.getElementById('patient_name');
const checkbox_patient_age = document.getElementById('patient_age');
const checkbox_patient_gender = document.getElementById('patient_gender');
const checkbox_patient_temperature = document.getElementById('patient_temperature');
const checkbox_pulse_oxymentry = document.getElementById('patient_pulse_oxymentry');
const checkbox_patient_height = document.getElementById('patient_height');
const checkbox_patient_weight = document.getElementById('patient_weight');
const checkbox_patient_blood_pressure = document.getElementById('patient_blood_pressure');
const checkbox_patient_complaints = document.getElementById('patient_cheif_complaints');
const checkbox_history_of_illness = document.getElementById('history_of_illness');
const checkbox_past_medication = document.getElementById('past_medication');
const checkbox_patient_assessment = document.getElementById('patient_assessment');
const checkbox_plans = document.getElementById('plans');
const checkbox_new_prescription = document.getElementById('new_prescription');
const checkbox_relevant_allergies = document.getElementById('relevant_allergies');
const checkbox_relevant_medications = document.getElementById('relevant_medications');
const checkbox_procedure = document.getElementById('procedure');
const checkbox_surgical_history = document.getElementById('surgical_history');
var mini = true;
function updateCheckedIDs(checkbox) {
	console.log(checkbox.checked);
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

	console.log('Checked Checkboxes: ' + checkedCheckboxIDs);
}

checkbox_patient_name.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_name);
});
checkbox_patient_age.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_age);
});
checkbox_patient_gender.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_gender);
});
checkbox_patient_temperature.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_temperature);
});
checkbox_pulse_oxymentry.addEventListener('change', function () {
	updateCheckedIDs(checkbox_pulse_oxymentry);
});
checkbox_patient_height.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_height);
});
checkbox_patient_weight.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_weight);
});
checkbox_patient_blood_pressure.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_blood_pressure);
});
checkbox_patient_complaints.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_complaints);
});
checkbox_history_of_illness.addEventListener('change', function () {
	updateCheckedIDs(checkbox_history_of_illness);
});
checkbox_past_medication.addEventListener('change', function () {
	updateCheckedIDs(checkbox_past_medication);
});
checkbox_patient_assessment.addEventListener('change', function () {
	updateCheckedIDs(checkbox_patient_assessment);
});
checkbox_plans.addEventListener('change', function () {
	updateCheckedIDs(checkbox_plans);
});
checkbox_new_prescription.addEventListener('change', function () {
	updateCheckedIDs(checkbox_new_prescription);
});
checkbox_relevant_allergies.addEventListener('change', function () {
	updateCheckedIDs(checkbox_relevant_allergies);
});
checkbox_relevant_medications.addEventListener('change', function () {
	updateCheckedIDs(checkbox_relevant_medications);
});
checkbox_procedure.addEventListener('change', function () {
	updateCheckedIDs(checkbox_procedure);
});
checkbox_surgical_history.addEventListener('change', function () {
	updateCheckedIDs(checkbox_surgical_history);
});

let templateNameVariable = ''; // Initialize a variable to store the template name

function saveTemplateName(inputElement) {
	templateNameVariable = inputElement.value; // Save the input value in the variable
	console.log('Template Name: ', templateNameVariable); // Display the value in the console (you can remove this line)
}

document.getElementById('loadTemplatesButton').addEventListener('click', async () => {
	document.getElementById('addTemplateButton').style.display = 'block';
	document.getElementById('updateTemplateButton').style.display = 'none';
});
document.getElementById('addTemplateButton').addEventListener('click', async () => {
	try {
		const data = {
			user_id: 3, // Replace with the actual user ID
			template: checkedCheckboxIDs, // Replace with the actual template data
			template_name: templateNameVariable,
		};
		const url = 'https://aiscribe-s3ne.onrender.com/scribe/add_template';
		const response = await axios.post(url, data);
		await createButtons()
		console.log('Template added successfully:', response.data);
	} catch (error) {
		console.error('Error adding template:', error);
	}
});


let templates_id

function openEditModal(template) {
	console.log(template)
	$('#exampleModalCenter').modal('show');
	const template_name_element = document.getElementById('templateName');
	template_name_element.value = template?.template_name;
	templateNameVariable = template?.template_name;
	const parsed_template = JSON.parse(template?.templates);
	checkedCheckboxIDs = parsed_template;
	templates_id = template?.templates_id;
	const checkboxIds = [
		'patient_name',
		'patient_age',
		'patient_gender',
		'patient_temperature',
		'patient_pulse_oxymentry',
		'patient_height',
		'patient_weight',
		'patient_blood_pressure',
		'patient_cheif_complaints',
		'history_of_illness',
		'past_medication',
		'patient_assessment',
		'plans',
		'new_prescription',
		'relevant_allergies',
		'relevant_medications',
		'procedure',
		'surgical_history'
	];
	function setCheckboxState(selectedIds, checkboxIds) {
		checkboxIds.forEach((id) => {
			const checkbox = document.getElementById(id);
			if (selectedIds.includes(id)) {
				checkbox.checked = true;
			} else {
				checkbox.checked = false;
			}
		});
	}
	setCheckboxState(parsed_template, checkboxIds);
	document.getElementById('addTemplateButton').style.display = 'none';
	document.getElementById('updateTemplateButton').style.display = 'block'

	console.log(parsed_template);
}

document.getElementById('updateTemplateButton').addEventListener('click', async () => {
	try {
		const data = {
			templates_id,
			template: checkedCheckboxIDs, // Replace with the actual template data
			template_name: templateNameVariable,
		};
		const url = 'https://aiscribe-s3ne.onrender.com/scribe/update_templates';
		const response = await axios.post(url, data);
		await createButtons()
		console.log('Template Updated successfully:', response.data);
	} catch (error) {
		console.error('Error Updated template:', error);
	}
});

function toggleSidebar() {
	const sidebar = document.getElementById("mySidebar");
	const main = document.getElementById("main");
	const width = mini ? "250px" : "85px";
	const marginLeft = mini ? "175px" : "0px";

	sidebar.style.width = width;
	main.style.marginLeft = marginLeft;
	mini = !mini;
}

function expandHeader() {
	var header_element = document.getElementById('header_container');
	var currentHeight = parseInt(header_element.style.height, 10);
	let sidebar_header_mobileElement = document.getElementById('sidebar_header_mobile_id')

	if (isNaN(currentHeight) || currentHeight === 85) {
		// If the height is not set or is currently 85px, expand to 300px
		header_element.style.height = '300px';
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