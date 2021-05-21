const CHECK_TIMEOUT = 15000;
type TVersionJson = {
    version: string;
}

abstract class VerstionChecker{
    private _path: string = "/version.json";
    private _period: number = CHECK_TIMEOUT;
    private _version: string = '';
    constructor(){        
        setInterval(()=> {
            this._checkVersion();
        }, this._period);
    }
    private _checkVersion(){
        fetch(this._path + "?t=" + Date.now()).then(r => r.json()).then((r: TVersionJson) => {
            if(r.version !== this._version && (this.additionCheck?.() || true)){
                this.riseError(this._version, r.version);
            }
        })
    }
    abstract additionCheck()
    abstract riseError(versionOld: string, versionNew: string)
}
