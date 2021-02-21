const fetch = require('node-fetch');
const under = require('underscore');
//"id","question","option_a","option_b","option_c","option_d","right_answer","level","cate_id","que_solution"
function convert (string) {
    return string.replace(/&#(?:x([\da-f]+)|(\d+));/ig, function (_, hex, dec) {
        return String.fromCharCode(dec || +('0x' + hex))
    })
    }
function decodeHtml(html)
{
    html = under.unescape(html);
    html = html.split("&amp;").join('&');
    html = html.split("&lt;").join('<');
    html = html.split("&gt;").join('>');
    html = html.split("&apos;").join('"');
    html = html.split("&quot;").join("''");
    html = html.split("'").join("''");
    html = html.split('&#039;').join("''");
    console.error(html);
    //html = under.escape(html);

    html = convert(html);
    return (html);
}
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
function get_data(category_id,out_cat_id, amount,level, callback)
{
    let out = [];
    let diff = ["easy","medium","hard"][(Math.min(level,3)) - 1];
    let url = "https://opentdb.com/api.php?amount="+amount+"&category="+category_id+"&difficulty="+diff+"&type=multiple";
    let cat_id = out_cat_id;/////////////////////////////

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
        e.question = decodeHtml(e.question);
        e.answers[0] = decodeHtml(e.answers[0]);
        e.answers[1] = decodeHtml(e.answers[1]);
        e.answers[2] = decodeHtml(e.answers[2]);
        e.answers[3] = decodeHtml(e.answers[3]);
        e.right_answer = decodeHtml(e.right_answer);
        e.level = decodeHtml(e.level);
        e.cat_id = decodeHtml(e.cat_id);
        e.solution = decodeHtml(e.solution);

        str += "'" + e.question + "', ";
        str += "'" + e.answers[0] + "', ";
        str += "'" + e.answers[1] + "', ";
        str += "'" + e.answers[2] + "', ";
        str += "'" + e.answers[3] + "', ";
        str += "'" + e.right_answer + "', ";
        str += "'" + e.level + "', ";
        str += "'" + e.cat_id + "', ";
        str += "'" + e.solution + "'";

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


async function scrap(category, local_cat_id, cat_name)
{
    console.log('INSERT INTO "tbl_category" ("category") VALUES ("' + cat_name + '");');

    await get_data(category, local_cat_id, 10, 1,tosql);
   await get_data(category, local_cat_id, 15, 2,tosql);
   await get_data(category, local_cat_id, 15, 3,tosql);
   await get_data(category, local_cat_id, 15, 4,tosql);
  await  get_data(category, local_cat_id, 15 ,5,tosql);
}
// History 23
// General knowledge 9
// Sports 21 
// 27 Animals
// 12 Entertainment: Music
// 28 Vehicles
// 31 Entertainment: Japanese Anime & Manga
// 32 Entertainment: Cartoon & Animations
// 18 Science: Computers
// 22 Geography
// 17 Science & Nature
// 25 Art
// 26 Celebrities

let cats = [9, 23, 21, 27, 12, 28, 31, 32, 18, 22, 17, 25, 26];
let catnames = ["History","General knowledge","Sports","Animals","Entertainment: Music","Vehicles","Entertainment: Japanese Anime & Manga","Entertainment: Cartoon & Animations","Science: Computers","Geography","Science & Nature","Art","Celebrities"];
let i = 1;

console.log('DROP TABLE IF EXISTS "tbl_category"; CREATE TABLE IF NOT EXISTS "tbl_category" ("id"	INTEGER,"category"	TEXT,PRIMARY KEY("id" AUTOINCREMENT));');
console.log('DROP TABLE IF EXISTS "questions_list";CREATE TABLE IF NOT EXISTS "questions_list" ("id"	INTEGER,"question"	TEXT,"option_a"	NUMERIC,"option_b"	TEXT,"option_c"	TEXT,"option_d"	BLOB,"right_answer"	NUMERIC,"level"	TEXT,"cate_id"	INTEGER,"que_solution"	TEXT,PRIMARY KEY("id"));');

cats.forEach(function(c){
    scrap(c, i, catnames[i - 1]);
    i++;
});



// 9 General Knowledge
// 10 Entertainment: Books
// 11 Entertainment: Film
// 12 Entertainment: Music
// 13 Entertainment: Musicals & Theatres
// 14 Entertainment: Television
// 15 Entertainment: Video Games
// 16 Entertainment: Board Games
// 17 Science & Nature
// 18 Science: Computers
// 19 Science: Mathematics
// 20 Mythology
// 21 Sports
// 22 Geography
// 23 History
// 24 Politics
// 25 Art
// 26 Celebrities
// 27 Animals
// 28 Vehicles
// 29 Entertainment: Comics
// 30 Science: Gadgets
// 31 Entertainment: Japanese Anime & Manga
// 32 Entertainment: Cartoon & Animations