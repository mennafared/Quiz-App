// https://opentdb.com/api.php?amount=6&category=25&difficulty=easy

let form = document.getElementById("quizOptions")
let categoryMenu = document.getElementById("categoryMenu")
let difficultyOptions = document.getElementById("difficultyOptions")
let questionsNumber = document.getElementById("questionsNumber")
let startQuiz = document.getElementById("startQuiz")
let allQuestions
let quiz
startQuiz.addEventListener("click", async function () {

    let category = categoryMenu.value
    let difficulty = difficultyOptions.value
    let nums_quest = questionsNumber.value

    quiz = new Quiz(category, difficulty, nums_quest)
    allQuestions = await quiz.getAllQuestions()

    let myQuestion = new Question(0)
    myQuestion.display()
    form.classList.replace("d-block", "d-none")


    console.log(myQuestion);
    console.log(allQuestions);

})


class Quiz {
    constructor(categ, diff, no_of_questions) {
        this.category = categ
        this.difficulty = diff
        this.nums = no_of_questions
        this.score = 0
    }

    getAPI() {
        return ` https://opentdb.com/api.php?amount=${this.nums}&category=${this.category}&difficulty=${this.difficulty}`
    }

    async getAllQuestions() {
        let data = await fetch(this.getAPI())
        let res = await data.json()
        let final = res.results

        return final
    }

    displayScore(){
        let cartona = `
        <h2 class="mb-0">${(this.score==allQuestions.length)?"Congratulations 🤩🥳 ":"Opss 😞 "}your score is ${this.score} of ${allQuestions.length}
      </h2>
      <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        
        `
        document.getElementById("finish").innerHTML=cartona

        document.getElementById("myData").classList.replace("d-block","d-none")
        document.getElementById("finish").classList.replace("d-none","d-block")

    }
}

class Question {

    constructor(index) {
        this.index = index
        this.category = allQuestions[index].category
        this.difficulty = allQuestions[index].difficulty
        this.correct_answer = allQuestions[index].correct_answer
        this.incorrect_answers = allQuestions[index].incorrect_answers
        this.question = allQuestions[index].question
        this.allAnswers = this.getAllAnswers()

        this.checked = false
    }

    getAllAnswers() {
        let arr = [...this.incorrect_answers, this.correct_answer]
        arr.sort()
        return arr
    }

    display() {
        let cartona = `
        <div class="w-100 d-flex justify-content-between">
        <span class=" h5 btn-category ">${this.category}</span>
        <span class=" h5 btn-questions "> ${this.index + 1} of ${allQuestions.length}</span>
      </div>
      <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
      <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">

      ${this.allAnswers.map((ele) => {
            return `<li>${ele}</li>`
        }).join(" ")}

 </ul>

      <h2 class="text-capitalize text-center score-color w-100 fw-bold "><i class="bi bi-emoji-laughing"></i> Score : ${quiz.score}</h2> 
        `
        document.getElementById("myData").classList.replace("d-none", "d-block")
        document.getElementById("myData").innerHTML = cartona

        let choices = document.querySelectorAll(".choices li")

        choices.forEach((ele) => {
            ele.addEventListener("click", () => {
                this.checkAnswer(ele)
            })
        })
    }

    checkAnswer(li) {

        if (!this.checked) {
            this.checked = true

            if (li.innerHTML == this.correct_answer) {
                li.classList.add("correct")
                quiz.score++
            }
            else {
                li.classList.add("wrong")

            }

            this.nextQuestion()
        }

    }
    nextQuestion() {
        this.index++
if(this.index<allQuestions.length){
    setTimeout(()=>{
        let nextQuestion = new Question(this.index)
        nextQuestion.display()
     },2000)
}
else{
    quiz.displayScore()
    document.querySelector(".again").addEventListener("click",function(){
      window.location.reload()
    })
}
    }

}
