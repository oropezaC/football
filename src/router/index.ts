import {FootBallRoute} from '../modules/football/footbal.route'


export class RouterApp{
    router : any;
    fRoute = new FootBallRoute()
    constructor(router :any){
        this.router = router
    }

    public root(){
        this.fRoute.router(this.router)

        return this.router
    }


}