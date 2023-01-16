import '@kor-ui/kor';
import {html, css, LitElement} from 'lit';
import "./lesions-table.js";

class TargetLesions extends LitElement {

    static properties = {
        status: {},
        label: {},
        lesions: {},
        measurements: {},
        sumDiametersBasal: {},
        layout: {state: true},
        expanded: {state: true},
        create: {type: Boolean},
        date: {}
    };
    
    constructor() {
        super();
        this.expanded = false;
        console.log("constructor - TargetLesions")
        //this.addEventListener('target-lesion-added', this.addTargetLesion);
    };

    static styles = 
        css`
            .expand {
                transform: rotate(180deg);
            }
        `;

    willUpdate(changedProperties) {
        if (changedProperties.has('sumDiametersBasal')) {
            this.updateVariables();
        }
    }

    updateVariables() {
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
                        name: this.sumDiametersBasal ? this.sumDiametersBasal : 0
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

    // addTargetLesion({detail}) {
    //     console.log("addTargetLesion");
    //     console.log(detail);
    //     detail.id = "tl" + this.index++;
    //     this.lesions = [...this.lesions, detail];
    // }

    openCalculus(){
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent('expandedChanged', {
            detail: this.expanded,
            bubbles: true,
            composed: true,
        }));
    }

    render(){
        return !this.lesions ? html``: html`
            <app-lesions-table .label=${"Target Lesions"} .rows=${this.lesions} prefix="target" ?create=${this.create} .status=${this.status} .date=${this.date}>
                ${this.layout && !this.create ? html`
                <kor-table columns="1fr 2fr 1fr 2fr 1fr">
                <kor-table-row style="grid-template-columns: 1fr 2fr 1fr 2fr 1fr;">
                    <kor-table-cell @click=${() => this.openCalculus()} head grid-cols="${this.layout.response.span}" style="min-width: calc(24px + var(--spacing-l) * 2); max-width: 160px; padding: var(--spacing-xs) var(--spacing-m);">
                        <kor-icon button class="expand" icon="keyboard_arrow_down"></kor-icon>
                        Response
                    </kor-table-cell>
                </kor-table-row>
                ${this.renderCalculus()}
                </kor-table>` : html``}
            </app-lesions-table>
            `;
    };


    renderCalculus(){
        return !(this.expanded && this.layout.calculus) ? html``: Object.keys(this.layout.calculus).map(calculo => html`           
            <kor-table-row style="grid-template-columns: 1fr 2fr 1fr 2fr 1fr;">
                ${this.renderHeaders(this.layout.calculus[calculo].headers)}
            </kor-table-row>
        `);
    }

    renderHeaders(headers){
        return !headers ? html``: headers.map(row => html `
            <kor-table-cell grid-cols="${row.span}">${row.name}</kor-table-cell>
        `);
    }

}

customElements.define('app-target-lesions', TargetLesions);