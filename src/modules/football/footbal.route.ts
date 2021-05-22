import { Request, Response } from 'express';
import { FootBallController } from './football.ctrl'

export class FootBallRoute {

    crtl = new FootBallController();

    public router(router): void {

        router.route('/get-champions')
            .get(this.crtl.getChampions)

        router.route('/get-sub-champions')
            .get(this.crtl.getRunnerUp)

        router.route('/get-sede')
            .get(this.crtl.getSede)

        router.route('/get-goals')
            .get(this.crtl.getGoals)

        router.route('/get-penality')
            .get(this.crtl.getFinalsP)

        router.route('/get-second-finals')
            .get(this.crtl.getFinalSecond)

        router.route('/get-leap-year')
            .get(this.crtl.getLeapYear)
    }


}