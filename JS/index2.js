var readline=require("readline");
var fs=require("fs");
var rl=readline.createInterface({
	input: fs.createReadStream("../Crimes_-_2001_to_present.csv")
	
});
var temp=[];
var header=true;
var under=new Array(16).fill(0);
var over=new Array(16).fill(0);
var arrest=new Array(16).fill(0);
var notArrest=new Array(16).fill(0);
const m=2001;
var obTheft=[];
var obAssault=[];
rl.on("line",(input)=>{
	if(header){
		header=false;
	}else{
		var line = input.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '_');});
		temp=line.split(",");
		if(temp[5] == "THEFT"){
			if(temp[6] == "OVER $500")
				over[parseInt(temp[17])%m]++;
			else if(temp[6] == "$500 AND UNDER"){
				under[parseInt(temp[17])%m]++;
			}
		}else if(temp[5] == "ASSAULT"){
			if(temp[8] == "true")
				arrest[parseInt(temp[17])%m]++;
			else if(temp[8] == "false"){
				notArrest[parseInt(temp[17])%m]++;
			}	
		}

	}
	
});
rl.on("close",()=>{
	for (var i = 0; i < under.length; i++) {
		obTheft.push({"Year":i+m,"TheftUnder500":under[i],"TheftOver500":over[i]});
		obAssault.push({"Year":i+m,"assaultArrest":arrest[i],"assaultNotArrest":notArrest[i]});
	}

	fs.writeFileSync("../JSON/theftNew.json", JSON.stringify(obTheft));
	fs.writeFileSync("../JSON/assaultNew.json",JSON.stringify(obAssault));
});
