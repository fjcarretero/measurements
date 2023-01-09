import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';

class MeasurementNewLesions extends LitElement {
    
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
                <kor-table-cell grid-cols="1" alignment="center">${this.measurement.data.newLesions}</kor-table-cell>
            </kor-table-row>
        </kor-table>`;
    }
}

customElements.define('app-measurement-new-lesions', MeasurementNewLesions);