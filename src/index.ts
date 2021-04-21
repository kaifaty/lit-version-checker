import { LitElement, customElement, property, html } from 'lit-element';
import type { TemplateResult } from 'lit-element';

const CHECK_TIMEOUT = 5000;
type TVersionJson = {
    version: string;
}

@customElement('lit-version-checker')
export class VersionChecker extends LitElement{
    @property({type: String}) path: string = "/version.json";
    @property({type: String}) version: string = ""; 
    @property({type: Object}) header: TemplateResult | null = html``;
    @property({type: Object}) 
    content: ((versionOld: string, versionNew: string) => 
        TemplateResult) | null = null;
    @property({type: Object}) footer: TemplateResult | null = html``;
    @property({type: Object}) additionCheck: (() => boolean) | null = null;
    constructor(){
        super();
        setInterval(()=> {
            this.checkVersion();
        }, CHECK_TIMEOUT)
    }
    riseError(versionOld: string, versionNew: string){
        this.dispatchEvent(new CustomEvent("showDialog", {
            composed: true,
            detail: {
                header: this.header,
                content: this.content?.(versionOld, versionNew),
                footer: this.footer,
            },
            bubbles: true
        }))
    }    
    checkVersion(){
        fetch(this.path + "?" + Date.now()).then(r => r.json()).then((r: TVersionJson) => {
            if(r.version !== this.version && (this.additionCheck?.() || true)){
                this.riseError(this.version, r.version);
            }
        })
    }
}