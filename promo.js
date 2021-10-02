const request = require("request")

const superagent = require("superagent")

const execShPromise = require("exec-sh").promise;

const fs = require("fs-extra");


request({
        uri: "https://generator.email/email-generator"
    },
    function (error, response, body) {
        const html_splitted = body.split('<span id="email_ch_text">')
        const emaillist = []
        for (let i = 1; i < html_splitted.length; i++) {
            emaillist.push(html_splitted[i].split('</span>')[0])
        }
        fs.writeFileSync("./html2.txt", body)

        email = emaillist.toString()
        console.log(email)

        let obj = [{"id":"06fe5b50b4218612aa3fa8494df326aef7ff35a75a8563b3455bb53c15168872","variables":{"input":{"email":`${email}`,"preference":{"category":"MEN","topics":[{"id":"item_alerts","isEnabled":true},{"id":"recommendations","isEnabled":true},{"id":"fashion_fix","isEnabled":true},{"id":"follow_brand","isEnabled":true},{"id":"subscription_confirmations","isEnabled":true},{"id":"survey","isEnabled":true},{"id":"offers_sales","isEnabled":true}]},"referrer":"nl_subscription_banner_one_click","clientMutationId":"1632945786304"}}}]
        obj = JSON.stringify(obj);

        const run = async () => {
            let out;
          
            try {
              out = await execShPromise(`curl -X POST -d '${obj}' https://www.zalando.fr/api/graphql`, true);
            } catch (e) {
              console.log('Error: ', e);          
              return e;
            }
            console.log('out: ', out.stdout, out.stderr);
          }
          
          run();

          let e_domain = email.split("@")[1];
          let e_uname = email.split("@")[0];
          const url = `https://generator.email/${e_domain}/${e_uname}`

            console.log(url);

            function get_code() {
                request({
                    uri: url
                },
                function (error, response, body) {
                    const html_splitted = body.split('<td align="left" style="font-family: HelveticaNow,Helvetica,sans-serif; text-align: left; font-size: 20px; line-height: 28px; letter-spacing: -0.2px; color: #FFFFFF!important; font-weight: bold">')
                   
                    fs.writeFileSync("./html.txt", body)
                })
            }

        setTimeout(get_code, 5000);

    }) // gen de l'email
