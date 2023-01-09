import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from '../patients-data-provider.js';

class PatientsSearch extends LitElement {

    static properties = {
        patientId: {},
        patients: {type: Array}
    };
    
    constructor() {
        super();
        this.patientsDataProvider = new PatientsDataProvider();
    };

    getPatientId(event){
        this.patientId = event.target.value;
    };

    dispatchPatientSelected (patient) {
        console.log("click" + patient.id);
        this.dispatchEvent(new CustomEvent('patientSelected', {
            detail: patient,
            bubbles: true,
            composed: true,
          }))
    }

    async click2(id){
        console.log("clicl" + id);
        this.patient = {
            id: id
        };
    }

    async click(){
        this.patients = await this.patientsDataProvider.getPatients(this.patientId);
        console.log(this.patients);
        // let response = await fetch('/api/patients/' + this.patientId, {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     }          
        // }); 
        // this.patients = await response.json();
        // this.patients = [
        //     {
        //         id: "123123",
        //         research: "research1",
        //         lesions: [
        //             {
        //                 tlid: 1,
        //                 localization: "LUNG",
        //                 verbatim: "",
        //                 lymphNode: "NO",
        //                 basal: 15,
        //                 measurements: [
        //                     {
        //                         date: "23/02/2020",
        //                         measure: 13
        //                     },
        //                     {
        //                         date: "12/07/2020",
        //                         measure: 12
        //                     }
        //                 ]
        //             },
        //             {
        //                 tlid: 2,
        //                 localization: "BREAST",
        //                 verbatim: "",
        //                 lymphNode: "NO",
        //                 basal: 10,
        //                 measurements: [
        //                     {
        //                         date: "23/02/2020",
        //                         measure: 9
        //                     },
        //                     {
        //                         date: "12/07/2020",
        //                         measure: 12
        //                     }
        //                 ]
        //             }
        //         ],
        //         measurementDates: [
        //             {
        //                 date: "23/02/2020"
        //             },
        //             {
        //                 date: "12/07/2020"
        //             }
        //         ]
        //     },    
        //     {
        //         id: "123124",
        //         research: "research1",
        //         lesions: [
        //             {
        //                 tlid: 1,
        //                 localization: "LUNG",
        //                 verbatim: "",
        //                 lymphNode: "NO",
        //                 basal: 12
        //             }
        //         ]
        //     },
        //     {
        //         id: "123125",
        //         research: "research2",
        //         lesions: [
        //             {
        //                 tlid: 1,
        //                 localization: "BREAST",
        //                 verbatim: "",
        //                 lymphNode: "NO",
        //                 basal: 15
        //             }
        //         ]
        //     }
        // ]
        console.log("end");
    };

    renderPatients(){
        return !this.patients ? html``: this.patients.map(patient => html`
            <kor-card flex-direction="row" @click=${() => this.dispatchPatientSelected(patient)}>
                    <kor-text>PatientId: </kor-text>
                    <kor-text>${patient.id}</kor-text>
 
                    <kor-text>Research: </kor-text>
                    <kor-text>${patient.research}</kor-text>
            </kor-card>
        `
        );
    };

    render() {
        return html`
                <kor-card flat="true" style="max-width: 1024px; width: 100%; margin: 0 auto;">
                    <kor-text style="font-size: 20px;margin: 0;align-self: center;max-height: 70px" size="header-1">Search for patients</kor-text>
                    <kor-card flat="true" style="flex-wrap: wrap;flex: 1 1 100%;max-height: 70px" flex-direction="row">
                        <kor-input @input=${this.getPatientId} style="align-self: center;flex: 2 1;" label="Patient ID"  autofocus="true" type="text"></kor-input>
                        <kor-button @click=${this.click} style="align-self: center;overflow: visible;" label="Search" icon="search" color="Primary"></kor-button>
                    </kor-card>
                <kor-divider spacing="m" orientation="horizontal" style="max-width: 1024px; width: 100%; margin: 0 auto;"></kor-divider>
                ${this.renderPatients()}
        `;
    };
}

customElements.define('app-patients-search', PatientsSearch);