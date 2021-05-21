const CHECK_TIMEOUT = 15000;
type TVersionJson = {
    version: string;
}

export abstract class VerstionChecker{
    private _path: string = "/version.json";
    private _period: number = CHECK_TIMEOUT;
    private _version: string = '';
    private _checkingInterval = 0;

    public setPeriod(value: number){
        this._period = value;
    }
    public setPath(value: string){
        this._path = value;
    }
    public startChecks(version: string){
        this._version = version;
        this._checkingInterval = setInterval(()=> {
            this._checkVersion();
        }, this._period);
    }
    public stopChecks(){
        clearInterval(this._checkingInterval);
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
