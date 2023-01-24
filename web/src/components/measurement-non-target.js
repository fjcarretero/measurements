import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';

class MeasurementNonTarget extends LitElement {
    
    static properties = {
        measurement: {},
        rows: {},
        suffix: {},
        layout: {},
        expanded: {}
    };

    constructor() {
        super();
        this.expanded = true;
        this.layout = {
            response: {
                span: 5,
                name: "Response"
            },
            calculus: {
                sumDiameters: {
                    headers: [{
                        span: 4,
                        name: "Sum of Diameters (mm)"
                    },{
                        span: 1,
                        name: this.sumDiametersBasal? this.sumDiametersBasal : 0
                    }]
                },
                nadir: {
                    headers: [{
                        span: 5,
                        name: "NADIR"
                    }]
                },
                percentageFromBasal: {
                    headers: [{
                        span: 5,
                        name: "% compared with Basal"
                    }]
                },
                percentageFromNadir: {
                    headers: [{
                        span: 5,
                        name: "% compared with NADIR"
                    }],
                }
            }
        }
    }    

    static styles = css`

    `;

    update(changed) {
        super.update(changed);
        console.log("changed2");
        console.log(changed);
    }

    render() {
        return !this.measurement ? html`` : html`
                <kor-table condensed flex-direction="row" columns="1fr">
                    <kor-table-row slot="header">
                        <kor-table-cell head grid-cols="1" alignment="center"></br>${this.measurement.date}</kor-table-cell>
                    </kor-table-row>
                    ${this.renderLesionMeasurement(this.rows)}
                    ${this.renderResponse()}
                    <slot></slot>
                </kor-table>`;
    }

    renderLesionMeasurement(rows) {
        return !rows || !this.measurement ? html``: Object.keys(rows).map(key => html`
            <kor-table-row>
                <kor-table-cell grid-cols="1" alignment="center">${this.measurement.data[rows[key].id]}</kor-table-cell>
            </kor-table-row>
        `);
    }

    renderResponse() {
        console.log("rows");
        console.log(this.rows.length);
        return this.rows.length == 0 ? html `` : html`
            <kor-table-row>
                ${this.renderVariables(this.measurement, "response")}
            </kor-table-row>
        `;
    }

    renderCalculus(calculus){
        return !(this.expanded && this.layout.calculus) ? html``: Object.keys(this.layout.calculus).map(calculo => html`           
            <kor-table-row>
                ${this.renderVariables(this.measurement, calculo)}
            </kor-table-row>
        `);
    }

    renderVariables(measurement, variable){
        return !variable || !measurement.calculus ? html``: variable=="response" ? html`
            <kor-table-cell grid-cols="1" style="padding: 8px;" alignment="center"><kor-button style="${this.calculateColor(measurement.calculus.data.nonTargetLesions[variable])}" label=${measurement.calculus.data.nonTargetLesions[variable]}></kor-button></kor-table-cell>`
            : html`
            <kor-table-cell grid-cols="1" style="direction: ltr;" alignment="right">${measurement.calculus.data.nonTargetLesions[variable]}</kor-table-cell>`;
    }

    calculateColor(value) {
        if (value == "CR") {
            return "background: rgba(var(--functional-green), 1); padding: 0;";
        } else if (value == "PD"){
            return "background: rgba(var(--functional-red), 1); padding: 0;";
        } else if (value == "PR"){
            return "background: rgba(var(--functional-yellow), 1); padding: 0;";
        } else if (value == "NoCR/NoPD"){
            return "background: rgba(var(--base-2), 1); color: black; padding: 0; font-size: 12px;";
        } else {
            return "background: rgba(var(--base-2), 1); color: black; padding: 0;";
        }

    }
}

customElements.define('app-measurement-non-target', MeasurementNonTarget);