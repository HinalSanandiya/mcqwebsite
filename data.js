
let Token=process.env.Token
let store=jsonbase(Token)
let log=console.log
let blueBright=chalk.bold.blueBright
let green=chalk.bold.green
let red=chalk.bold.red
let cyan=chalk.bold.cyan
let yellow=chalk.bold.yellow
let title=chalk.bold.bgYellow

var name=""
var score=0
var questionList=[]
var scoreboard=[]

begin()
function begin(){
    (async function(){
    await store.read('scoreboard').then(resp=>{
        scoreboard=resp.data
        log(cyan("Welcome to the game:"),yellow("How Well Do You Know JAVA?"))
        store.read('questionList').then(resp=>{
            questionList=resp.data
            startGame()
        })
    })
})()
}

function startGame(){
    name=rs.question(blueBright("\nWhat is Your Name?"))
    log(green('hello ${name}!'))
    log("\n There will be 10 question \nAnswer them with",green("y(for yes)"),"or",red("n(for no)"),"\n")
    log(cyan("+5 points for correct answer, -2 for wrog answer\n"))

    let randomquestion5=questionList.sort(()=>.5- Math.random()).slice(0,10)

    for(q of randomQuestion5){
        let isCorrect=askQuestion(q.question,q.answer)
        if(isCorrect){
            log('Your answer is ${green(isCorrect)},current score is ${green(score)}')
        }
        else{
            log('Your answer is ${red(isCorrect)},current score is ${red(score)}')
        }
        log(cyan("Detail:"),'\n${q.detail}\n')
    }

    log('Final Score:${green(score)}/50')
    log(green("Thank You For Playing!"))

    compareScore()
}

function askQuestion(ques,correctAnswer){
    if(rs.keyInYNStrict(yellow(ques))){
        return checkAnswer("yes",correctAnswer)
    }
    else{
        return checkAnswer("no",correctAnswer)
    }
}

function checkAnswer(ans,correctAnswer){
    if(ans.toLowerCase()===correctAnswer.toLowerCase()){
        score+=5
        return true
    }else{
        score-=2
        return false
    }
}

function compareScore(){
    let flag=scoreboard.filter(s=>parseInt(s.score)<=parseInt(score))
    if(flag.length>0){
        if(scoreboard.length===5){
            scoreboard.sort(function(a,b){
                return b.score-a.score;
            })
            scoreboard.pop()
        }

        let nweScorer={"name":name,"score":score}
        scoreboard.push(nweScorer)
        log(green("Congratulations! You have a new highscore"))
        store.write('scoreboard',scoreboard).then(()=>{
            log("\nScoreboard updated")
            displayScoreboard()
        })
    }else{
        log(red("\nYou couldn't beat the highscore.Better luck next time!"))
        displayScoreboard()
    }
}

function displayScoreboard(){
    scoreboard.sort(function(a,b){
        return b.score-a.score;
    })
    log(yellow("\n Current SCoreboard"))

    for(player of scoreboard){
        log('Name: ${green(player.name)},Score:${green(player.score)}')
    }
}