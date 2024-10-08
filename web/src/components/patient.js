import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class Patient extends LitElement {

    static properties = {
        patient: {type: Object, reflect: true},
        create: {type: Boolean}
    };
    
    constructor() {
        super();
    };

    dispatchPatientIdValue(){
        return ({target}) => {
            this.dispatchEvent(new CustomEvent('patientId-changed', {
                detail: target.value,
                bubbles: true,
                composed: true,
            }));
        }
    }

    dispatchResearchIdValue(){
        return ({target}) => {
            this.dispatchEvent(new CustomEvent('researchId-changed', {
                detail: target.value,
                bubbles: true,
                composed: true,
            }));
        }
    }

    render(){
        return html`
            <kor-card flat flex-direction="row" style="justify-content: space-around; align-items: center;">
                <kor-card flat flex-direction="row" align-content="center">
                    <kor-text size="header-1">PatientId: </kor-text>
                    <kor-text>${this.patient.patientId}</kor-text>
                </kor-card>
                <kor-card flat flex-direction="row">
                    <kor-text size="header-1">Study: </kor-text>
                    <kor-text>${this.patient.study}</kor-text>
                </kor-card>
            </kor-card>
        `;
    };
}

customElements.define('app-patient', Patient);