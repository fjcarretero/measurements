export class PatientsDataProvider {
    async getPatients(patientId, researchId) {
      let url = '/api/patients' ;
      url = !patientId ? url : url + '?id_like=' + patientId;
      url = !researchId ? url : url + (!patientId ? '?' : '&') + 'research=' + researchId;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async postPatients(data) {
      let response = await fetch('/api/patients' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
    async getPatientById(patientId) {
      let response = await fetch('/api/patients/' + patientId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async getMeasuresByPatientId(patientId) {
      let response = await fetch('/api/patients/' + patientId + '/measurements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
    async addMeasurement(patientId, data) {
      let response = await fetch('/api/patients/' + patientId + '/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
    async getResearchs() {
      let response = await fetch('/api/researchs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    }
  }