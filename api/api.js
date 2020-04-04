const exec = require('child_process').execFile
const fs = require('fs')

let vncPort, novncPort, xvfbs, novncs

function isBusy(display){
	return fs.existsSync('/tmp/.X'+display+'-lock')
}

function getFirstAvailableDisplay(){
	let display = 5
	while(isBusy(display)){
		display++
	}
	return display
}


function createDisplay(options){
	console.log('creating display with Xvfb...')
	let displayId =   (options.display ||  getFirstAvailableDisplay())
	let dsize = (options.dsize ||  process.env.DEFAULT_SIZE)
	try{
		xvfbs[displayId] = exec('Xvfb', [':' + displayId, "-screen", "0", dsize], (error, stdout, stderr) => {
			console.log("stderr"+stderr + "\n stdout "+stdout + "\n error"+error)
		})
	}catch(err){
		console.log("err"+err);
	}
	return displayId
}

async function runCommand(displayId, command){
	try{
		const { stdout, stderr } = await exec('./api/runCommand.sh', [':'+displayId, command + " --user-data-dir=/tmp/"+displayId])
		console.log(stdout + stderr)
	}catch(error){
		console.error(error)
	}
}

function createNoVnc(displayId){
	let url = "http://localhost:"+novncPort
	novncs[displayId] = exec('./api/viewVnc.sh', [':'+displayId, vncPort, novncPort], (error, stdout, stderr) => {
		if(error || stderr){
			console.log(error + stderr)
		}
	})
	novncPort++
	vncPort++

	return url
}

vncPort = 5900
novncPort=6080
xvfbs = {}
novncs = {}

module.exports = {
	create: function(options){
		var options = options || {}
		this.dsize = options.dsize || process.env.DEFAULT_SIZE
		this.displayId = createDisplay(options)
		this.url = createNoVnc(this.displayId)
		this.port = novncPort-1
		this.run = command => {
			runCommand(this.displayId, command)
		}
		this.kill = function() {
			xvfbs[this.displayId].kill()
			delete xvfbs[this.displayId]
			novncs[this.displayId].kill()
			delete novncs[this.displayId]
		}
	}

}
