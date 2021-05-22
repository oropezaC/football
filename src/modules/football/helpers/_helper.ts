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

const winners = (data) =>{
    let champions = {}
    return new Promise((resolve,reject)=>{
        data.forEach((i)=>{
            if (!champions.hasOwnProperty(i.champion)) {
                champions[i.champion] = {
                    win : 0,
                    games : [],
                    penalti: false,
                    penalti_games: [],
                }
            }
            champions[i.champion].win ++
            champions[i.champion].games.push(i)
        })
        
        let winning = Object.getOwnPropertyNames(champions).sort()
        let win = { winners : []}
        winning.forEach(i=>{
            win.winners.push({country:i,cups:champions[i].win})
        })
        const result = win.winners.reduce((x, y)=>(y.cups > x.cups ? y : x))
        resolve(result);
    })
}

const sub = (data) =>{
    let sub_champions = {}
    return new Promise((resolve,reject)=>{
        data.forEach((i)=>{
            if (!sub_champions.hasOwnProperty(i.runnerUp)) {
                sub_champions[i.runnerUp] = {
                    _sub : 0,
                    games : []
                }
            }
            sub_champions[i.runnerUp]._sub ++
            sub_champions[i.runnerUp].games.push(i)
        })
        let sub_winning = Object.getOwnPropertyNames(sub_champions).sort()
        let sub_win = { sub : []}
        sub_winning.forEach(i=>{
            sub_win.sub.push({country:i, sub_win:sub_champions[i]._sub})
        })
        const result = sub_win.sub.reduce((x, y)=>(y.sub_win > x.sub_win ? y : x))
        resolve(result);
    })
}

const groupBy = (arr, key) => {
    let newArrr = []
    return arr.reduce((x, y) => {
        newArrr.indexOf(y[key]) == -1 ? newArrr.push(y[key]) : null
        return newArrr

    })
}


const reduceGoals = (arr) => {
    let goals = 0
    arr.forEach(element => {
        if(element != 'League')
            goals += element.split('-').join().split(' ')[0].split(',').map(Number).reduce((a, c) => a + c)
    });
    return goals
}



const finalsP = (arr) => {
    let finals = []
    arr.forEach(element => {
        console.log(element.score.split('-').join().split(' ')[1])
        element.score.split('-').join().split(' ')[1] == 'P' ? finals.push(element) : null
    });
    return finals
}

const finalsSecond = (arr) => {
    let finals = []
    arr.forEach(element => {
        element.score.split('-').join().split(' ')[1] != 'P' && element.score.split('-').join().split(' ')[1] != undefined ? finals.push(element) : null
    });
    return finals
}

const leapYear = (arr) =>{
    let finals_leap_year = []
    arr.forEach(element=>{
        (new Date(element.year, 1, 29).getDate() === 29)? finals_leap_year.push(element) : null
    })
    return finals_leap_year
}

module.exports = {
    Group,
    winners,
    sub,
    groupBy,
    reduceGoals,
    finalsP,
    finalsSecond,
    leapYear
}