'use strict'

const express = require('express');
const db = require('../lib/db');
const path = require('path');
const Docker = require('dockerode');
const recursive = require('recursive-readdir');

const router = express.Router();

router.post('/run', (req, res, next) => {
	db.getRepo(req.body.name).then((result) => {
		if (result.results.lenght > 0) {
			let repo = result.results[0];
			let uri = path.join(__dirname, repo.repo_uri);
			return Promise.all([Promise.resolve(repo), Promise.resolve(uri), recursive(uri)]);
		} else {
			return Promise.fail('no such repo');
		}
	})
	.then((result) => {
		let repo = result[0];
		let uri = result[1];
		let files = result[2];
		const docker = new Docker();
		docker.buildImage({
			context: uri,
			src: files
		}, {t: repo.name}).then((response) => {
			// should pipe to websocket to print log in client
			response.on('end', () => {
				docker.createContainer({
					Image: repo.name,
					PortBindings: {
						'3000/tcp': [{
							'HostIp': '127.0.0.1',
							'HostPort': '4000'
						}]
					}
				}).then((container) => {
					container.start((err, data) => {
						if (err) {
							console.log(err);
							res.status(500).json('could not start docker container');
						} else {
							res.json({status: 'success', message: 'container running'});
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