const fetch = require('node-fetch');
const { resolve } = require('path');
//"id","question","option_a","option_b","option_c","option_d","right_answer","level","cate_id","que_solution"

function parse_result(result)
{
    let out = {question:"", answers:[], right_answer:"", level:0, cat_id:0, solution:"0"};
    out.question = result.question;
    out.answers = result.incorrect_answers;
    out.answers.splice(Math.floor(Math.random() * 2), 0, result.correct_answer);
    out.right_answer = "ABCD"[out.answers.indexOf(result.correct_answer)];
    out.solution = result.correct_answer;

    return (out);
}

function get_data(category_id, amount,level)
{
    let out = [];
    let diff = ["easy","medium","hard"][level - 1];
    let url = "https://opentdb.com/api.php?amount="+amount+"&category="+category_id+"&difficulty="+diff+"&type=multiple";
    
    let ret = fetch(url, { method: "Get"})
        .then(res => res.json())
        .then((json) =>  {
            
            //console.log(json);
            json.results.forEach(element => {
                out.push(parse_result(element));
            });
            resolve(out);
        });


}

console.log(get_data(23, 4,1));