import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import './measure-modal.js';
import './lesions.js';
import './measurements.js';
import './patient.js';
import { PatientsDataProvider } from '../patients-data-provider.js';

class PatientDetail extends LitElement {

    static properties = {
        patientId: {},
        patient: {},
        measurements: {},
        addMeasureModal: {},
        newMeasure: {},
        expanded: {}
    };
    
    constructor() {
        super();
        this.addMeasureModal = false;
        this.patientsDataProvider = new PatientsDataProvider();
        this.addEventListener('expandedChanged', (e) => this.expanded = e.detail);
    };

    dispatchBack() {
        this.dispatchEvent(new CustomEvent('back', {
            bubbles: true,
            composed: true,
          }))
    }

    openAddMeasure(){
        this.addMeasureModal = true;
        this.newMeasure = {
            date: null,
            data: {}
        };
    }

    closeAddMeasure(){
        this.addMeasureModal = false;
    }

    async update(changed) {
        super.update(changed);
        if (changed.has('patientId')) {
            this.patient = await this.patientsDataProvider.getPatientById(this.patientId);
            this.measurements = await this.patientsDataProvider.getMeasuresByPatientId(this.patientId);
        }
    }

    modifyObject(sourceObject, key, value){
        var target = {};
        target[key] = value;
        delete sourceObject[key];
        return Object.assign(target, sourceObject);
    }

    async saveMeasure({measurement}){
        console.log("save measure");
        console.log(this.newMeasure);
        console.log(this.newLesions);

        let measure = await this.patientsDataProvider.addMeasurement(this.patientId, this.newMeasure);

        this.measurements = await this.patientsDataProvider.getMeasuresByPatientId(this.patientId);

        this.addMeasureModal = false;
    }

    render(){
        return !this.patient ? html``: html`
            <kor-card flat>
                <app-patient .patient=${this.patient}></app-patient>
                <kor-tabs>
                    <kor-tab-item label="RECIST" active></kor-tab-item>
                </kor-tabs>
                <kor-card flex-direction="row" flat>
                    <app-lesions .patient=${this.patient}></app-lesions>
                    <!-- <kor-card flex-direction="row" flat>
                        <kor-icon icon="chevron_left"></kor-icon>
                    </kor-card> -->
                    <app-measurements .expanded=${this.expanded} .patient=${this.patient} .measurements=${this.measurements}></app-measurements>
                </kor-card>
                ${this.renderModal()}  
                <kor-button slot="footer" label="Add Measure" @click=${() => this.openAddMeasure()}></kor-button>
                <kor-button slot="footer" label="< Back" @click=${() => this.dispatchBack()}></kor-button>
            </kor-card>
        `;
    };

    renderTable(){
        return !this.patient ? html``: html`
            <app-target-lesions .label="${'Target lesions'}" .lesions=${this.patient.targetLesions} .measurements=${this.measurements} .sumDiametersBasal=${this.patient.sumDiametersBasal}></app-target-lesions>
            <app-non-target-lesions .label="${'Non-target lesions'}" .lesions=${this.patient.nonTargetLesions} .measurements=${this.measurements}></app-non-target-lesions>
            <app-new-lesions .measurements=${this.measurements}></app-new-lesions>
            <app-overall-response .measurements=${this.measurements}></app-overall-response>
        `;
    };

    renderModal(){
        return  !this.addMeasureModal ? html``: html`
            <app-measure-modal @measureClosed=${this.closeAddMeasure} @measureModified=${this.saveMeasure} .patient=${this.patient} .newMeasure=${this.newMeasure}></app-measure-modal>
        `;
    }
}

customElements.define('app-patient-detail', PatientDetail);