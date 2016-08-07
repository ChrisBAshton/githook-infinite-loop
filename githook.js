module.exports = function (data, process) {

    var branch = data.parameters.branch || 'master',
        options = {
        url: data.payload.repository.git_refs_url.replace('{/sha}', '') + '/heads/' + branch,
        headers: {
            'Content-Type':  'application/json',
            'User-Agent':    'githook-infinite-loop',
            'Authorization': 'token ' + data.access_token
        },
        json: {
            "sha": data.payload.before,
            "force": true
        }
    }

    request.patch(options, function commitReverted(err, httpResponse, body) {
        if (err) {
            process.fail('Could not send POST request: ' + err);
        }
        else {
            process.succeed('Successfully reverted the commit. This will trigger a new `push` event, which will trigger this GitHook again - we are now in an infinite loop!');
        }
    });

}