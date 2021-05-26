### General

* Master commits.
* The commit messages are not clear.
* There're not linter rules.
* There're not prettier rules.
* There're not editorconfig file.

---

src/config/conf.ts

```ts
export class Config{
    configuration;
    build():void{
        this.configuration = {
            root: root_path,
            app: {
                name: process.env.APP_NAME
            },
            port: parseInt(process.env.PORT),
        }

        return this.configuration
    }
}
```

* Configuration attribute doesn't have type (implicit any)
* Build method is void but it's returning `configuration: any`;

---

src/modules/football/helpers/_helpers.ts
```ts
const Group = (data, key) => {
    return new Promise((resolve, reject) => {
        const arr = data.reduce((rv, x) => {
            (rv[key] = rv[key] || []).push(x[key]);
            if (rv[key][0] == undefined){
                throw new Error('Dont Fount Data')
            }else{
                return rv[key][0];
            }
        }, {})
        resolve(arr)
    })
}
```

* Unnecessary method: `data.uefa` or `data[key]` when key is uefa.
* Capital letter in function name.
* Promise doesn't have rejection.
* Callback name variables: rv, x.
* Unnecessary else.
* Unnecessary promise.

--- 

src/modules/football/helpers/_helpers.ts
```ts
const groupBy = (arr, key) => {
    let newArrr = []
    return arr.reduce((x, y) => {
        newArrr.indexOf(y[key]) == -1 ? newArrr.push(y[key]) : null
        return newArrr

    })
}
```

* Unnecessary reduce, accumulator variable is not used.
* IMPORTANT: FootballController.getSede is using groupBy function and this filtering duplicated keys.

Proposals

```ts
const groupBy = (array, key) => {
    const fields = new Map()
    arr.map(item => {
        if (item[key] && !fields.get(item[key])) {
            fields.set(item[key], item[key])
        }
    })
    return Array.from(fields.values())
}
```

```ts
const groupBy = (array, key) => Array.from(new Set(array.map(item => item[key]).filter(item => item)))
```

---

src/modules/football/helpers/_helpers.ts
```ts
const reduceGoals = (arr) => {
    let goals = 0
    arr.forEach(element => {
        if(element != 'League')
            goals += element.split('-').join().split(' ')[0].split(',').map(Number).reduce((a, c) => a + c)
    });
    return goals
}
```
* IMPORTANT: reduceGoals doesn't work with finals solved with more than 1 match: `3-0, 0-1, 0-0` is returning `3` and `2-0, 1-1` is returning `2`.

Proposal
```ts
const reduceGoals = (scores) => scores.reduce(((sum, score) => {
    const goals = score.replace(/\s/g, '').split(/\D/g).reduce(((sum, item) => Number(sum) + Number(item)), 0)
    return sum + goals
}), 0)
```

---

src/modules/football/helpers/_helpers.ts
```ts
const finalsP = (arr) => {
    let finals = []
    arr.forEach(element => {
        element.score.split('-').join().split(' ')[1] == 'P' ? finals.push(element) : null
    });
    return finals
}
```

* You just had to validate that score contained letter `P`.
* You could use Array filter instead of creating a new array.

Proposal
```ts
const finalsP = (matches) => matches.filter(match => match.score.includes('P'))
```

---

src/modules/football/helpers/_helpers.ts
```ts
const finalsSecond = (arr) => {
    let finals = []
    arr.forEach(element => {
        element.score.split('-').join().split(' ')[1] != 'P' && element.score.split('-').join().split(' ')[1] != undefined ? finals.push(element) : null
    });
    return finals
}
```

* The easiest way to solve the problem is counting the comma character in the score property... The fancy way is splitting the score by comma character.
* You could use Array filter instead of creating a new array.

Proposals
```ts
const finalsSecond = (matches) => matches.filter(match => match.score.match(/,/g))
```

```ts
const finalsSecond = (matches) => matches.filter(match => match.score.match(/\d-\d/g)?.length > 1)
```

---

src/modules/football/helpers/_helpers.ts
```ts
const leapYear = (arr) =>{
    let finals_leap_year = []
    arr.forEach(element=>{
        (new Date(element.year, 1, 29).getDate() === 29)? finals_leap_year.push(element) : null
    })
    return finals_leap_year
}
```

* You could use Array filter instead of creating a new array.

Proposals
```ts
const leapYear = (matches) => matches.filter(element => new Date(element.year, 1, 29).getDate() === 29)
```

```ts
const leapYear = (matches) => matches.filter(element => ((element.year % 4 == 0) && (element.year % 100 != 0)) || (element.year % 400 == 0))
```

---

src/modules/football/footbal.route.ts
```ts
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
```

* crtl is public by default.
* There're not setters and getters.
* Router method is not a pure function. 
* There're not dependencies injection.

---

src/modules/football/footbal.ctrl.ts
```ts
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
```

* Exceptions are not used.
* Multiple non depending promises handled.
* Consider `Group` function proposal.
* Not found status on errors.
* `getChampions` is non pure method, avoid use of `delete` and create a new object instead.

Proposal
```ts
const [ uefa, conmebol, concacaf, worldCup ] = await Promise.all([
    leapYear(data.uefa)
    leapYear(data.conmebol)
    leapYear(data.concacaf)
    leapYear(data.worldCup)
])
```

---


src/router/index.ts
```ts
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
```

* `fRoute` instance outside a constructor or class method.
* There're not setters and getters.
* `getRoot` name instead root.
* There're not dependencies injection.

---

src/app.ts
```ts
const router = Router()

 class App{
    app : any ;
    res : Request;
    req : Response;
    routerIndex = new RouterApp(router);
    configuration = new Config().build()
    constructor(){
        this.app = express()
        this.config();
    }
    
    private async config(){
        this.app.config = this.configuration
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT, OPTIONS");
            next();
        });
        this.app.use(morganMiddleware)
        this.app.set('port', this.app.config.port);
        this.app.set('name_app',this.app.config.app.name)
        this.app.use('/api',this.routerIndex.root())

    }
}

export default new App().app;
```

* Non pure methods class. Instances outside constructor or class methods.
* Use `Application` type from `express`.
* Public properties.
* There're not dependencies injection.
* There're not getters and setters.

---

docker-compose.yml
```yml
volumes: 
    - ./usr:/src/app
```

* Did you mean src?

---

Dockerfile
```Dockerfile
RUN npm install \ && npm install tsc -g
```

* `typescript`is the right module name.
* Unnecessary global module installation

```Dockerfile
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
```

* Your workdir is /usr/src/app.


```Dockerfile
COPY package.json .

RUN npm install
```

---

package.json
```json
"start": "tsc && npm run copy && node dist/server.js"
```

* Split build and run scripts.
* dotenv must be located in root project path.

```json
{
    "scripts": {
        "build": "tsc",
        "start": "node dist/server.js"
    }
}
```
