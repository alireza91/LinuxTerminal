const user = "guest@github.com/alireza91:~$ "
export default {
    commandExecution(command) {
        let result = '<br/>';
        switch (command) {
            case "-help":
                result += "<br/><table class='table'><tr><td>clear</td><td>Clear screen</td></tr><tr><td>contact</td><td>Be in touch</td></tr><tr><td>about</td><td>See a brief about me</td></tr><tr><td>skills</td><td>See my skills</td></tr><tr><td>resume</td><td>Get pdf file of my resume</td></tr></table>"
                break;
            case "contact":
                result += "<br/>E-mail: <a href='mailto:alireza_mortezaei@hotmail.com'>alireza_mortezaei@hotmail.com</a><br/>Phone number: +989360019915<br/>Instagram: <a href='https://instagram.com/alimtz91'>@alimtz91</a><br/>Linkedin profile: <a href='https://www.linkedin.com/in/alireza-mortezaei-55280a143/'>https://www.linkedin.com/in/alireza-mortezaei-55280a143/</a><br/>"
                break;
            case "about":
                result += "<br/>I graduated from Azad University of Karaj with bachelor degree in Software Engineering. Skilled in C#, SQL, HTML, css and javascript and have 4 years of experience in Vue.js and .Net frameworks. My hobby is art and I'm enthusiast for Technology. I'm also a Linux lover.<br/>"
                break;
            case "skills":
                result += "<ul><li>Object-oriented programming</li><li>C#</li><li>.Net core and EF core</li><li>SQL (SQL server, mySQL, PostgreSQL)</li><li>noSQL (MongoDB, ArangoDB, Redis and...)</li><li>MVC</li><li>nodejs</li><li>Javascript</li><li>css</li><li>HTML5</li><li>vue.js</li><li>Git</li><li>Agile development</li><li>Design patterns</li></ul>"
                break;
            case "resume":
                result += "<div style='padding-left: 20px;'>You can see my resume through <a href='https://alirezaonline.xyz/Resume.pdf'>this link</a>";
                break;
            default: result += "Invalid command..<br/>use '-help' to see valid commands.";
        }
        return result + "<br/>" + user;
    },
}
