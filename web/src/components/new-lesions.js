import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class NewLesions extends LitElement {

    static properties = {
        label: {},
        measurements: {},
        tableSize: {}
    };
    
    constructor() {
        super();
    };

    getTableSize() {
        return !this.measurements ? 5 : 5 + this.measurements.length;
    }

    update(changed) {
        super.update(changed);
        console.log("changed");
        console.log(changed);
        if (changed.has('measurements')) {
            this.updateVariables();
        }
    }

    updateVariables() {
        this.tableSize = this.getTableSize();
    }

    render(){
        return html`
            <kor-table condensed flew-direction="row" columns="1fr 2fr 1fr 2fr 1fr">
                <kor-table-row>
                    <kor-table-cell head grid-cols="5">New Lesions</kor-table-cell>
                </kor-table-row>
            </kor-table>
            `;
    };

    renderNewLesions(measurements){
        return !measurements ? html``: measurements.map(measurement => html`
            <kor-table-cell grid-cols="1">${measurement.data['newLesions']}</kor-table-cell>
        `);
    }
}

customElements.define('app-new-lesions', NewLesions);