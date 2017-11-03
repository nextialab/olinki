'use strict'

const express = require('express');
const db = require('../lib/db');
const path = require('path');
const Docker = require('dockerode');
const recursive = require('recursive-readdir');

const router = express.Router();

router.post('/run', (req, res, next) => {
	console.log(req.body);
	db.getRepo(req.body.name).then((result) => {
		if (result.results.length > 0) {
			let repo = result.results[0];
			let uri = path.join(__root, repo.repo_uri);
			let uri_regex = new RegExp('^' + uri);
			let files_promise = recursive(uri, ['.git', '.gitignore']).then((files) => {
				return Promise.resolve(files.map((file) => {
					return file.replace(uri_regex, '');
				}));
			});
			return Promise.all([Promise.resolve(repo), Promise.resolve(uri), files_promise]);
		} else {
			return Promise.reject('no such repo');
		}
	})
	.then((result) => {
		let repo = result[0];
		let uri = result[1];
		let files = result[2];
		console.log(files);
		const docker = new Docker();
		docker.buildImage({
			context: repo.repo_uri,
			src: files
		}, {t: repo.repo}).then((response) => {
			// should pipe to websocket to print log in client
			response.pipe(process.stdout, {
				end: true
			});
			response.on('end', () => {
				docker.createContainer({
					Image: repo.repo,
					PortBindings: {
						'3000/tcp': [{
							'HostIp': '127.0.0.1',
							'HostPort': '4000'
						}]
					}
				}).then((container) => {
					console.log(container);
					container.start((err, data) => {
						if (err) {
							console.log(err);
							res.status(500).json('could not start docker container');
						} else {
							console.log(data);
							db.updateRepoStatus(repo.repo, 'running').then(() => {
								res.json({status: 'success', message: 'container running', port: 4000});
							}).catch((err) => {
								console.log(err);
								res.status(500).json(err);
							});
						}
					});
				}).catch((err) => {
					console.log(err);
				});
			});
			response.on('error', () => {
				console.log('error in building image');
				res.status(500).json('could not create docker image');
			});
		})
	})
	.catch((err) => {
		console.log(err);
		res.status(500).json(err);
	})
});

module.exports = router;