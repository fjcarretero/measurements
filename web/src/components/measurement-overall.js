import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';

class MeasurementOverall extends LitElement {
    
    static properties = {
        measurement: {}
    };

    constructor() {
        super();
    }    

    static styles = css`

    `;

    render() {
        return !this.measurement ? html`` : html`
        <kor-table condensed flex-direction="row" columns="1fr">
            <kor-table-row>
                <kor-table-cell grid-cols="1" style="padding: 8px;" alignment="center">
                    <kor-button style="${this.calculateColor(this.measurement.calculus.data.response)}; padding: 0;" label=${this.measurement.calculus.data.response}></kor-button>
                </kor-table-cell>
            </kor-table-row>
        </kor-table>`;
    }

    calculateColor(value) {
        if (value == "CR") {
            return "background: rgba(var(--functional-green), 1); padding: 0;";
        } else if (value == "PD"){
            return "background: rgba(var(--functional-red), 1); padding: 0;";
        } else if (value == "PR"){
            return "background: rgba(var(--functional-yellow), 1); padding: 0;";
        } else {
            return "background: rgba(var(--base-2), 1); color: black; padding: 0;";
        }
    }
}

customElements.define('app-measurement-overall', MeasurementOverall);