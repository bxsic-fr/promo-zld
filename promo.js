const request = require("request")
const fs = require("fs-extra")
const execShPromise = require("exec-sh").promise;
const readline = require("readline-sync");

function get() {

    request({
            uri: "https://generator.email/email-generator"
        },
        function (error, response) {
            let body = response.body
            fs.writeFileSync('body.html', body)
            const first = body.split('onchange="change_username()" value="')[1].split('"')[0]
            const end = body.split('" id="domainName2"')[0].split('value="')[body.split('" id="domainName2"')[0].split('value="').length - 1].split('"')[0]
            //console.log(first + '\n' + end)
            const email = first + "@" +end
            let obj = [{"id":"06fe5b50b4218612aa3fa8494df326aef7ff35a75a8563b3455bb53c15168872","variables":{"input":{"email":email,"preference":{"category":"MEN","topics":[{"id":"item_alerts","isEnabled":true},{"id":"recommendations","isEnabled":true},{"id":"fashion_fix","isEnabled":true},{"id":"follow_brand","isEnabled":true},{"id":"subscription_confirmations","isEnabled":true},{"id":"survey","isEnabled":true},{"id":"offers_sales","isEnabled":true}]},"referrer":"nl_subscription_banner_one_click","clientMutationId":"1632945786304"}}}]
            obj = JSON.stringify(obj);

            const run = async () => {
                let out;
            
                try {
                    out = await execShPromise(`curl -X POST -d '${obj}' https://www.zalando.fr/api/graphql`, true);
                } catch (e) {
                    //console.log('Error: ', e);          
                return e;
                }
                    //console.log('out: ', out.stdout, out.stderr);
            }
            
            run();

            let e_domain = end
            let e_uname = first
            const url = `https://generator.email/${e_domain}/${e_uname}`

                //console.log(url);

                    const get_code = async () => {
                        let out;
                    
                        try {
                        out = await execShPromise(`wget ${url}`, true);
                        } catch (e) {
                        //console.log('Error: ', e);          
                        return e;
                        }
                        //console.log('out: ', out.stdout, out.stderr);

                        let htmldata = fs.readFileSync(`./${e_uname}`,'utf-8')
                        const html_splitted = htmldata.split('<td align="left" style="font-family: HelveticaNow,Helvetica,sans-serif; text-align: left; font-size: 20px; line-height: 28px; letter-spacing: -0.2px; color: #FFFFFF!important; font-weight: bold">')
                        let code = []
                        for (let i = 1; i < html_splitted.length; i++) {
                            code.push(html_splitted[i].split('</td>')[0])
                            //console.log(code)
                        }
                        code = code.toString();
                        fs.appendFileSync("./code.txt", `${code}\n`)
                        fs.unlinkSync(`./${e_uname}`)
                        //message.reply("Please check your inbox !")
                        //message.author.send("Your Zalando.fr 10% code :\n"+code)
                    }

            setTimeout(get_code, 10000);

        })
    }

let nb = readline.question("Number of promo code (More than 150 will take more time) :")

if(nb>200){
    nb = ~~(nb / 200)
    for (let i = 0; i < nb; i++) {
        setTimeout(function(){
            for (let i = 0; i < 150; i++) {
                get();
            }
        }, 5000);
    }
    console.log("Done!")
} else {
    for(var i = 0; i < nb; i++) {
        get();
    }
    console.log("Done!");
}
