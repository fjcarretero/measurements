
export class PatientsDataProvider {
    async getPatients(patientId, studyId) {
      let url = '/api/individualStudies' ;
      url = !patientId ? url : url + '?patientId_like=' + patientId;
      url = !studyId ? url : url + (!patientId ? '?' : '&') + 'studyId=' + studyId;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async postPatients(data) {
      let response = await fetch('/api/individualStudies' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return response;
    }
    async getPatientById(studyPatientId) {
      let response = await fetch('/api/individualStudies/' + studyPatientId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async getMeasuresByPatientId(studyPatientId) {
      let response = await fetch('/api/individualStudies/' + studyPatientId + '/measurements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async addMeasurement(studyPatientId, data) {
      let response = await fetch('/api/individualStudies/' + studyPatientId + '/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
    async modifyMeasurement(studyPatientId, measurementId, data) {
      let response = await fetch('/api/individualStudies/' + studyPatientId + '/measurements/' + measurementId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
    async getResearchs() {
      let response = await fetch('/api/studies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response;
    }
    async modifyTargetLesion(studyPatientId, lesionId, data) {
      let response = await fetch('/api/individualStudies/' + studyPatientId + '/targetLesions/' + lesionId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
    async modifyNonTargetLesion(studyPatientId, lesionId, data) {
      let response = await fetch('/api/individualStudies/' + studyPatientId + '/nonTargetLesions/' + lesionId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
  }