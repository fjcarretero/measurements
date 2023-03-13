import '@kor-ui/kor';
import {html, LitElement} from 'lit';
import './measure-modal.js';
import './lesions.js';
import './measurements.js';
import './patient.js';
import {convert2Date} from '../utils/utils.js';
import { PatientsDataProvider } from '../patients-data-provider.js';

class PatientDetail extends LitElement {

    static properties = {
        patientId: {},
        patient: {},
        measurements: {},
        addMeasureModal: {},
        newMeasure: {},
        expanded: {},
        userRole: {},
        _label: {state: true},
        _buttonLabel: {state: true}
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
        this._label = "Add Measure";
        this._buttonLabel = "Add";
        this.addMeasureModal = true;
        this.newMeasure = {
            date: null,
            data: {}
        };
    }

    openModifyMeasure({detail}){
        console.log("openModifyMeasure")
        this._label = "Modify Measure";
        this._buttonLabel = "Modify";
        this.addMeasureModal = true;
        this.newMeasure = detail;
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
                    <app-lesions .userRole=${this.userRole} .patient=${this.patient}></app-lesions>
                    <app-measurements @modify-measurement=${this.openModifyMeasure} .userRole=${this.userRole} .expanded=${this.expanded} .patient=${this.patient} .measurements=${this.measurements}></app-measurements>
                </kor-card>
                ${this.renderModal()}  
                <kor-button slot="footer" label="Add Measure" @click=${() => this.openAddMeasure()}></kor-button>
                <kor-button slot="footer" label="< Back" @click=${() => this.dispatchBack()}></kor-button>
            </kor-card>
        `;
    };

    renderModal(){
        return  !this.addMeasureModal ? html``: html`
            <app-measure-modal @measure-closed=${this.closeAddMeasure} @measure-created=${this.saveMeasure} .patient=${this.patient} .newMeasure=${this.newMeasure} .lastDateMeasurement=${Math.max(...this.measurements.map(m => convert2Date(m.date)))} .label=${this._label} .buttonLabel=${this._buttonLabel}></app-measure-modal>
        `;
    }
}

customElements.define('app-patient-detail', PatientDetail);