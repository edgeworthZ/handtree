let F1 = document.getElementById('F1');
let F2 = document.getElementById('F2');
let F3 = document.getElementById('F3');
let F4 = document.getElementById('F4');
let User1 = document.getElementById('but1');
let User2 = document.getElementById('but2');
let User3 = document.getElementById('but3');
let User4 = document.getElementById('but4');
F1.addEventListener('click', () => {
    if(F1.innerHTML=='Select'){
        ChangeTree('Sunflower');
        F1.innerHTML = 'Now';
        F2.innerHTML = 'Select';
        F3.innerHTML = 'Select';
        F4.innerHTML = 'Select';
    }
    else if(F1.innerHTML=='Now'){let AddUser1 = alert("กำลังใช้งาน!!");}
    else if(F3.innerHTML=='Lock'){let AddUser1 = alert("แต้มยังไม่ถึงจ้า!!");}
});
F2.addEventListener('click', () => {
    if(F2.innerHTML=='Select'){
        ChangeTree('Rose');
        F2.innerHTML = 'Now';
        F1.innerHTML = 'Select';
        F3.innerHTML = 'Select';
        F4.innerHTML = 'Select';
    }
    else if(F2.innerHTML=='Now'){let AddUser2 = alert("กำลังใช้งาน!!");}
    else if(F3.innerHTML=='Lock'){let AddUser2 = alert("แต้มยังไม่ถึงจ้า!!");}
});
F3.addEventListener('click', () => {
    if(F3.innerHTML=='Select'){
        ChangeTree('Tulip');
        F3.innerHTML = 'Now';
        F2.innerHTML = 'Select';
        F1.innerHTML = 'Select';
        F4.innerHTML = 'Select';
    }
    else if(F3.innerHTML=='Now'){let AddUser3 = alert("กำลังใช้งาน!!");}
    else if(F3.innerHTML=='Lock'){let AddUser3 = alert("แต้มยังไม่ถึงจ้า!!");}
});
F4.addEventListener('click', () => {
    if(F4.innerHTML=='Select'){
        ChangeTree('Daisy');
        F4.innerHTML = 'Now';
        F1.innerHTML = 'Select';
        F2.innerHTML = 'Select';
        F3.innerHTML = 'Select';
    }
    else if(F1.innerHTML=='Now'){let AddUser4 = alert("กำลังใช้งาน!!");}
    else if(F3.innerHTML=='Lock'){let AddUser4 = alert("แต้มยังไม่ถึงจ้า!!");}
});

let todayy=0;
let score=0;
let TreeNow='';
let DDay=0;
let phaseT=0;
let inven=0;
let defName=[];
let nickn=[];
let NameN = document.getElementById('NameNow');
let Score = document.getElementById('Score');
let Typetree = document.getElementById('Type');
function GetUpdate() {
    fetch(" http://192.168.1.8:55554/tree/list",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => response.result)
            .then((datas) => {
                let TreeNow='';
                console.log(datas)
                let i=0;
                datas.forEach((data) => {
                    console.log(data.nickname);
                    nickn.push(data.nickname);
                    defName.push(data.name);
                    /*console.log("a: "+nickn[i]+" b: "+defName[i]);*/
                    if(defName[i]=="user1"){
                            NameN.innerHTML = nickn[i];
                            score=data.alltime;
                            TreeNow=data.activetree;
                            inven=(data.inventory).length;
                            Score.innerHTML = 'Score : ' + score;
                            if(TreeNow=='Sunflower'){
                                F1.innerHTML='Now';
                            }
                            else if(TreeNow=='Rose'){
                                F2.innerHTML='Now';
                            }
                            else if(TreeNow=='Tulip'){
                                F3.innerHTML='Now';
                            }
                            else if(TreeNow=='Daisy'){
                                F4.innerHTML='Now';
                            }
                            console.log(inven);
                            if(inven==1){
                                F2.innerHTML='Lock';
                                F3.innerHTML='Lock';
                                F4.innerHTML='Lock';
                            }
                            if(inven==2){
                                F3.innerHTML='Lock';
                                F4.innerHTML='Lock';
                            }
                            if(inven==3){
                                F4.innerHTML='Lock';
                            }
                    }
                    i++;
                })
            }
        );
        //console.log(" yyy: "+DDay);
    }

    function ChangeTree(Tt){
        let textt = "http://192.168.1.8:55554/tree/changetree/user1/"+ Tt;
    fetch(textt,{
        method: "PATCH",
        headers: {
			"Content-Type": "application/json"},
    })
		.then(response => response.json())
		.then(response => response.result)
		.then((datas) => {
            console.log(datas)
            GetUpdate();
        })
    }

    function AddTree(Tt){
        let textt = "http://192.168.1.8:55554/tree/addtree/user1/"+ Tt;
    fetch(textt,{
        method: "PATCH",
        headers: {
			"Content-Type": "application/json"},
    })
		.then(response => response.json())
		.then(response => response.result)
		.then((datas) => {
            console.log(datas)
            GetUpdate();
        })
    }
GetUpdate();