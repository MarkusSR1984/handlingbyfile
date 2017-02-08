//this is only needed for debug
/*global.freeroam = {
utils: require('../freeroam/gm/utility'),
config: require('../freeroam/gm/config'),
chat: jcmp.events.Call('get_chat')[0]
};*/

jcmp.events.Add("VehicleCreated", (vehicle) => {
	//freeroam.chat.send(player, `handlingbyfile called`); debug
	const fs = require('fs');
	//try to read in a handling file for this vehicle....
	fs.readFile(`./packages/handlingbyfile/handlingdata/${vehicle.modelHash}.json`, (err,data) => {
		//if it doesn't exist, make it..
		if(err){
			var tofile = JSON.stringify(vehicle.handling,null,'\t');
			fs.writeFile(`./packages/handlingbyfile/handlingdata/${vehicle.modelHash}.json`, `${tofile}`);
			//and report to console, admin can check to know what file to edit..
			console.log(`saved handling data to ./packages/handlingbyfile/handlingdata/${vehicle.modelHash}.json`);
			return;
		}

	var sourceobj = JSON.parse(data); //get handling from imported data..
	var targetobj = vehicle.handling; //we're going to apply it to the spawned vehicle..
	recursivelyequatetofile(sourceobj,targetobj); //calling our recursing function..
	
	function recursivelyequatetofile(sourceobj,targetobj){
		//now cycle through each property in vehicle.handling..
		Object.keys(targetobj).forEach((key) => {
				//console.log(`key ${key}`); debug
				//ensure it's a property of vehicle.handling, not inherited from parent class
				if(targetobj.hasOwnProperty(key)){ 
					//if it's a sub-object, call this function again (recurse!)..
					if(typeof targetobj[key] == "object"){
						recursivelyequatetofile(sourceobj[key],targetobj[key]);
					}
					//if it's a number, set it to the one from file.
					else{
						//console.log(`file: ${sourceobj[key]} target: ${targetobj[key]}`); debug
						targetobj[key] = sourceobj[key];
						//console.log(`target: ${targetobj[key]}`); debug
					}
				}
			})
	}

	console.log(`read handling data from ./packages/handlingbyfile/handlingdata/${vehicle.modelHash}.json`);
	vehicle.handling.Apply();	

	});


});
