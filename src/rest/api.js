import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = `http://ec2-13-236-167-53.ap-southeast-2.compute.amazonaws.com/`;

axios.defaults.timeout = 5000;

export const client = axios;

function jsonConfig(config) {
	config.headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		...config.headers,
	};

	return config;
}

function uploadConfig(config) {
	config.headers = {
		...config.headers,
		'Content-Type': 'multipart/form-data'
	};

	return config;
}

function request(config) {
	jsonConfig(config);

    return client.request(config);
}

function uploadRequest(config) {
	uploadConfig(config);
	return client.request(config);
}

export function login({ email, password }) {
	return request({
		url: '/api/login',
		method: 'POST',
		data: { email, password }
	});
}

export function register({ firstname, lastname, email, password, phonenumber, company, country, role }) {
	return request({
		url: '/api/register',
		method: 'POST',
		data: {
			firstname, lastname, email, password, phonenumber, company, country, role
		}
	});
}


export function upload({ files, projectName }) {
	let formData = new FormData();
	formData.append('project_name', projectName);
	formData.append('email_address', localStorage.getItem("login_email"));
	files.forEach(file => {
		formData.append('images[]', file, file.name);
	});

	return uploadRequest({
		url: '/api/upload',
		method: 'POST',
		data: formData,
	})
}

export function getProjects({ email }) {
	return request({
		url: '/api/getProjects',
		method: 'POST',
		data: { email }
	});
}

export function getAllUserData({ email }) {
    return request({
        url: '/api/getAllUserData',
        method: 'POST',
        data: { email }
    });
}


export function getProjectImages({ project_id, page_index, limit }) {
	return request({
		url: '/api/getProjectImages',
		method: 'POST',
		data: { project_id, page_index, limit }
	});
}

export function getProjectByID({ project_id }) {
	return request({
		url: '/api/getProjectByID',
		method: 'POST',
		data: { project_id }
	});
}

export function getAssetsByProjectID({ project_id }) {
	return request({
		url: '/api/getAssetsByProjectID',
		method: 'POST',
		data: { project_id }
	});
}

export function getMetadataByProjectID({ project_id }) {
	return request({
		url: '/api/getProjectMetaDataByID',
		method: 'POST',
		data: { project_id }
	});
}

export function addMarkerLocationtoMetaData({ project_id, location }) {
    console.log({ project_id, location });
	return request({
        url: '/api/addMarkerLocationtoMetaData',
		method: 'POST',
		data: { project_id,location }
	});
}

export function getProjectsAnnotations() {
	return request({
		url: '/api/getProjectsAnnotations',
		method: 'POST',
		data: {}
	});
}

export function addProjectEntity({ email, folder_name, type, name, color, position }) {
	return request({
		url: '/api/addProjectEntity',
		method: 'POST',
		data: {
            email, folder_name, type, name, color, position
		}
	});
}

export function addProjectEntityID({ email, folder_name, type, name, color, position }) {
    return request({
        url: '/api/addProjectEntityID',
        method: 'POST',
        data: {
            email, folder_name, type, name, color, position
        }
    });
}

export function updateProjectEntity({ email, folder_name, type, name, color, position }) {
	return request({
		url: '/api/updateProjectEntity',
		method: 'POST',
		data: { email, folder_name, type, name, color, position }
	});
}

export function updateProjectEntityByID({ email, id, folder_name, type, name, color, position }) {
    return request({
        url: '/api/updateProjectEntityByID',
        method: 'POST',
        data: { email, id, folder_name, type, name, color, position }
    });
}


export function removeOneEntity({ email, folder_name, type, name }) {
	return request({
		url: '/api/removeOneEntity',
		method: 'POST',
		data: { email, folder_name, type, name }
	});
}

export function removeProjectEntity({ project_id }) {
    console.log("called remove proj entity");
	return request({
		url: '/api/removeProjectEntity',
		method: 'POST',
		data: { project_id }
	});
}

export function removeProjectFolderEntities({ project_id, folder_name }) {
	return request({
		url: '/api/removeProjectFolderEntities',
		method: 'POST',
		data: { project_id, folder_name }
	});
}

export default request;
