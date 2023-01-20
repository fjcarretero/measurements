import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import {PatientsDataProvider} from '../patients-data-provider.js';

class PatientsSearch extends LitElement {

    static properties = {
        patientId: {},
        researchId: {},
        researchs: {},
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

    async click(){
        this.patients = await this.patientsDataProvider.getPatients(this.patientId, this.researchId);
    };

    changeValueResearch(){
        return ({target}) => {   
            console.log(target.value);
            this.researchId = this.researchs.filter(research => research.name==target.value)[0].id;
            return target;
        }
    }

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
                        <kor-input @value-changed=${this.changeValueResearch()} style="align-self: center;flex: 1 1;" label="Study"  autofocus="true" type="select">
                            ${!this.researchs ? html`` : this.researchs.map(research => html`
                                <kor-menu-item label=${research.name}></kor-menu-item>`
                            )}
                        </kor-input>
                        <kor-button @click=${this.click} style="align-self: center;overflow: visible;" label="Search" icon="search" color="Primary"></kor-button>
                    </kor-card>
                <kor-divider spacing="m" orientation="horizontal" style="max-width: 1024px; width: 100%; margin: 0 auto;"></kor-divider>
                ${this.renderPatients()}
        `;
    };
}

customElements.define('app-patients-search', PatientsSearch);