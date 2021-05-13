import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators';
import type { TemplateResult } from 'lit';

const CHECK_TIMEOUT = 15000;
type TVersionJson = {
    version: string;
}

@customElement('lit-version-checker')
export class VersionChecker extends LitElement{
    @property({type: String}) path: string = "/version.json";
    @property({type: String}) version: string = ""; 
    @property({type: Number}) period: number = CHECK_TIMEOUT; 
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
        }, this.period)
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
        fetch(this.path + "?t=" + Date.now()).then(r => r.json()).then((r: TVersionJson) => {
            if(r.version !== this.version && (this.additionCheck?.() || true)){
                this.riseError(this.version, r.version);
            }
        })
    }
}