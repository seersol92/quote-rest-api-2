const nodemailer = require('nodemailer'),
   // creds = require('./creds'),
    transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io', // hostname 
        port: 2525, // port for secure SMTP 
        secure: false, // true for 465, false for other ports
        auth: {
            user: "2129acbf9ade71",
            pass: "f3d4b2e755a3bb"
        }
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

// I changed the emails from what's in the tutorial because people kept using
// info@geeklaunch.net and sending me their test emails. :P Lesson learned. :)
//
// So yeah, change the emails below from 'example@example.tld' to YOUR email,
// please.
//
// Thank you!
let users = [
    {
        name: 'Jack',
        email: 'hamad.pixiders@gmail.com',
        data: {
            app: 'mean stack'
        }
    }
];

function sendEmail(obj) {
    return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(path.join(__dirname, '..', 'views/templates', templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}


exports.sendEmail = ( template, users) => {
    loadTemplate(template, users).then((results) => {
    return Promise.all(results.map((result) => {
        sendEmail({
                to: result.context.email,
                from: 'info@fregiht.io',
                subject: result.context.subject,
                html: result.email.html,
                //text: result.email.text,
            });
       }));
    }).then(() => {
        console.log('Yay!');
});
}