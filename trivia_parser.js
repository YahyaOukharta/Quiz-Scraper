const fetch = require('node-fetch');
const { resolve } = require('path');
//"id","question","option_a","option_b","option_c","option_d","right_answer","level","cate_id","que_solution"

function parse_result(result, l , c_id)
{
    let out = {question:"", answers:[], right_answer:"", level:l, cat_id:c_id, solution:"0"};
    out.question = result.question;
    out.answers = result.incorrect_answers;
    out.answers.splice(Math.floor(Math.random() * 2), 0, result.correct_answer);
    out.right_answer = "ABCD"[out.answers.indexOf(result.correct_answer)];
    out.solution = result.correct_answer;

    return (out);
}
let result = [];
function get_data(category_id, amount,level, callback)
{
    let out = [];
    let diff = ["easy","medium","hard"][level - 1];
    let url = "https://opentdb.com/api.php?amount="+amount+"&category="+category_id+"&difficulty="+diff+"&type=multiple";
    let cat_id = category_id == 23 ? 1 : 0;

    fetch(url, { method: "Get"})
        .then(res => res.json())
        .then((json) =>  {
            //console.log(json);
            json.results.forEach(element => {
                out.push(parse_result(element, level, cat_id));
            });
            //console.log(out);
            result = out;
            callback(result);
        });
}
let output = []
function tosql(data)
{
    let res = []
    //console.log(data);
    //"id","question","option_a","option_b","option_c","option_d","right_answer","level","cate_id","que_solution"

    data.forEach(e => {
        let str = "";
        //console.log(e);
        str += "\"" + e.question + "\", ";
        str += "\"" + e.answers[0] + "\", ";
        str += "\"" + e.answers[1] + "\", ";
        str += "\"" + e.answers[2] + "\", ";
        str += "\"" + e.answers[3] + "\", ";
        str += "\"" + e.right_answer + "\", ";
        str += "\"" + e.level + "\", ";
        str += "\"" + e.cat_id + "\", ";
        str += "\"" + e.solution + "\"";

        //console.log(str);
        let sql = 'INSERT INTO "questions_list" ("question","option_a","option_b","option_c","option_d","right_answer","level","cate_id","que_solution") VALUES ('+ str +');';
        res.push(sql);
    });


    output = res;
    output.forEach(e => {
        console.log(e);
    });
    //console.log(output);
}
// category_id, amount,level, callback
get_data(23, 10,1,tosql);
get_data(23, 20,2,tosql);
