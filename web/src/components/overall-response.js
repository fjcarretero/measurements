import '@kor-ui/kor';
import {html, LitElement} from 'lit';

class OverallResponse extends LitElement {

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
        if (changed.has('measurements')) {
            this.updateVariables();
        }
    }

    updateVariables() {
        this.tableSize = this.getTableSize();
    }

    render(){
        //console.log("tableSize=" + this.tableSize)
        return html`
            <kor-table condensed flew-direction="row" columns="1fr 2fr 1fr 2fr 1fr">
                <kor-table-row>
                    <kor-table-cell head grid-cols="5">Overall Response</kor-table-cell>
                </kor-table-row>
            </kor-table>
            `;
    };

    renderOverallResponse(measurements){
        return !measurements || !measurements[0].calculus ? html``: measurements.map(measurement => 
            !measurement.calculus ? html``: html`
            <kor-table-cell grid-cols="1"><kor-button style="${this.calculateColor(measurement.calculus.data['response'])}" label=${measurement.calculus.data['response']}></kor-button></kor-table-cell>
        `);
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

customElements.define('app-overall-response', OverallResponse);