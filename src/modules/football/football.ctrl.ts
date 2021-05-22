const data = require('../../data/champions.json');


const { Group, winners, sub, groupBy, reduceGoals, finalsP, finalsSecond, leapYear } = require('./helpers/_helper')


export class FootBallController {

    public async getChampions(req, res) {
        if (req.query.type) {
            try {
                const resp = await winners(await Group([data], req.query.type))
                res.status(200).json(resp)
            } catch (error) {
                let e = new Error('Ocurrio un proble intenta más tarde')
                res.status(404).send(e.toString())
            }
        } else {
            try {
                const concacaf = await winners(await Group([data], 'concacaf'))
                const worldCup = await winners(await Group([data], 'worldCup'))
                delete concacaf.final_penalti
                delete worldCup.final_penalti
                res.status(200).json({ concacaf, worldCup })
            } catch (error) {
                let e = new Error('Ocurrio un proble intenta más tarde')
                res.status(404).send(e.toString())
            }
        }
    }

    public async getRunnerUp(req, res) {
        if (req.query.type) {
            try {
                const resp = await sub(await Group([data], req.query.type))
                res.status(200).json(resp)
            } catch (error) {
                let e = new Error('Ocurrio un proble intenta más tarde')
                res.status(404).send(e.toString())
            }
        } else {
            try {
                const concacaf = await sub(await Group([data], 'concacaf'))
                const worldCup = await sub(await Group([data], 'worldCup'))
                res.status(200).json({ concacaf, worldCup })
            } catch (error) {
                let e = new Error('Ocurrio un proble intenta más tarde')
                res.status(404).send(e.toString())
            }
        }
    }

    public async getSede(req, res) {
        try {
            const uefa = await groupBy(await Group([data], 'uefa'), 'headquarter')
            const conmebol = await groupBy(await Group([data], 'conmebol'), 'headquarter')
            const concacaf = await groupBy(await Group([data], 'concacaf'), 'headquarter')
            const worldCup = await groupBy(await Group([data], 'worldCup'), 'headquarter')
            let sedes = [
                { uefa_sedes: uefa },
                { conmebol_sedes: conmebol },
                { concacaf_sedes: concacaf },
                { world_sedes: worldCup }
            ]
            res.status(200).json(sedes)

        } catch (error) {
            let e = new Error('Ocurrio un proble intenta más tarde')
            res.status(404).send(e.toString())
        }
    }

    public async getGoals(req, res) {
        try {
            const uefa = await reduceGoals(await groupBy(await Group([data], 'uefa'), 'score'))
            const conmebol = await reduceGoals(await groupBy(await Group([data], 'conmebol'), 'score'))
            const concacaf = await reduceGoals(await groupBy(await Group([data], 'concacaf'), 'score'))
            const worldCup = await reduceGoals(await groupBy(await Group([data], 'worldCup'), 'score'))
            let goals = [
                { uefa_goals: uefa },
                { conmebol_goals: conmebol },
                { concacaf_goals: concacaf },
                { world_goals: worldCup }
            ]
            res.status(200).json(goals)

        } catch (error) {
            let e = new Error('Ocurrio un proble intenta más tarde')
            res.status(404).send(e.toString())
        }
    }

    public async getFinalsP(req, res) {
        try {
            const uefa = await finalsP(await Group([data], 'uefa'))
            const conmebol = await finalsP(await Group([data], 'conmebol'))
            const concacaf = await finalsP(await Group([data], 'concacaf'))
            const worldCup = await finalsP(await Group([data], 'worldCup'))
            res.status(200).json({ uefa, conmebol, concacaf, worldCup })
        } catch (error) {
            let e = new Error('Ocurrio un proble intenta más tarde')
            res.status(404).send(e.toString())
        }
    }

    public async getFinalSecond(req, res) {
        try {
            const uefa = await finalsSecond(await Group([data], 'uefa'))
            const conmebol = await finalsSecond(await Group([data], 'conmebol'))
            const concacaf = await finalsSecond(await Group([data], 'concacaf'))
            const worldCup = await finalsSecond(await Group([data], 'worldCup'))
            res.status(200).json({ uefa, conmebol, concacaf, worldCup })
        } catch (error) {
            let e = new Error('Ocurrio un proble intenta más tarde')
            res.status(404).send(e.toString())
        }
    }

    public async getLeapYear(req, res) {
        try {
            const uefa = await leapYear(await Group([data], 'uefa'))
            const conmebol = await leapYear(await Group([data], 'conmebol'))
            const concacaf = await leapYear(await Group([data], 'concacaf'))
            const worldCup = await leapYear(await Group([data], 'worldCup'))
            res.status(200).json({ uefa, conmebol, concacaf, worldCup })
        } catch (error) {
            let e = new Error('Ocurrio un proble intenta más tarde')
            res.status(404).send(e.toString())
        }
    }
}