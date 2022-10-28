const http = require("http");
const FormData = require('form-data');

const getOptions = {
    host: "localhost",
    port: '3000',
    path: "/getData",
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Connection": 'keep-alive'
    }
};

const postOptions = {
    host: "localhost",
    port: '3000',
    path: "/setNewData",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Connection": 'keep-alive'
    }
}

const formOptions = {
    host: "localhost",
    port: '3000',
    path: "/formData",
    method: "POST",
    headers: {
        "Content-Type": "multipart/form-data",
        "Connection": 'keep-alive'
    }
}

const reqGet = http.request(getOptions, (getResponse) => {
    let fullGetResponse = '';

    getResponse.on('data', (data) => {
        fullGetResponse = fullGetResponse ? fullGetResponse + data.toString() :  data.toString();
    })

    getResponse.on('end', () => {
        process.stdout.write(JSON.parse(fullGetResponse));

       let reqPost =  http.request(postOptions, (postResponse) => {
            let fullPostResponse = '';
            postResponse.on('data', (data) => {
                fullPostResponse = fullPostResponse ? fullPostResponse + data.toString() :  data.toString();
            })

            postResponse.on('end', () => {
                process.stdout.write(JSON.parse(fullPostResponse));

                let reqForm = http.request(formOptions, (formResponse) => {
                    let fullFormResponse = '';
                    formResponse.on('data', (data) => {
                        fullFormResponse = fullFormResponse ? fullFormResponse + data.toString() :  data.toString();
                    })

                    formResponse.on('end', () => {
                        process.stdout.write(JSON.parse(fullFormResponse));
                    })

                })

                const formData = new FormData();
                formData.append('data', 'Hello from form');

                reqForm.write(formData.getBuffer());
                reqForm.end();

            })

        })

        const postData = JSON.stringify({data: "Hello from post"})
        reqPost.write(postData);
        reqPost.end();

    })
})

reqGet.end();

