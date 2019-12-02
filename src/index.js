import React, {Component} from "react";
import ReactDOM from "react-dom";
import "./assets/style.css";
import quizService from "./quizService";
import QuestionBox from "./components/QuestionBox";
import Result from "./components/Result";
import axios from 'axios'

class QuizBee extends Component {
    state = {
        questionBank: [],
        score: 0,
        responses: 0,
        toTrans : []
    };
    getQuestions = () => {
        quizService().then(question => {
            this.setState({
                questionBank: question
            }); 
        });
    };
    computeAnswer = (answer, correctAnswer) => {
        if (answer === correctAnswer){
            this.setState({
                score: this.state.score + 1
            });
        }
        this.setState({
            responses: this.state.responses < 5 ? this.state.responses + 1 : 5
        });
    };
    playAgain = () => {
        this.getQuestions();
        this.setState({
            score: 0,
            responses: 0
        })
    } 

    clicked = () =>{

        console.log('btn clicked');
        console.log(this.state.questionBank);
        let qlist = this.state.questionBank;
        var qarr = [];
        var qObj = {};
        var counter = 1;
        
        for(var i in qlist)
        {
            qObj['question'+(counter++)]= qlist[i].question;
        //     var obj = {}
        //    obj[counter] = qlist[i].question;
        //    qarr.push(obj);
        //    counter++;
        }
        this.setState({
            toTrans : qarr
        });
        JSON.stringify(qObj);
        console.log(qObj);
        axios.post('https://kbwotp0r1j.execute-api.us-east-1.amazonaws.com/dev/data',qObj)
        .then(function(response){
            var translatedQues = response.data.message;
            console.log(translatedQues);
        })
        .catch(function(error){
            console.log(error);
        });
    }

    componentDidMount() {
        this.getQuestions();
    }
    render() {
        return (
         <div className="container">
             <button onClick= {()=>this.clicked()}>Button</button>
             <div className="title">MIND Quiz</div>  
             {this.state.questionBank.length > 0 &&
             this.state.responses < 5 &&
            this.state.questionBank.map(
                ({question, answers, correct, questionId}) => (
                    <QuestionBox 
                    question={question} 
                    options={answers} 
                    key={questionId} 
                    selected={answer => this.computeAnswer(answer, correct)}
                    />
                )
            )} 
           {this.state.responses === 5 ? (<Result score={this.state.score} playAgain={this.playAgain}/>) : null} 
         </div>
        );
    }
}

    
 


ReactDOM.render(<QuizBee />, document.getElementById("root"));