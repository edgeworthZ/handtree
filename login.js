let Delete1 = document.getElementById('Del1');
let Delete2 = document.getElementById('Del2');
let Delete3 = document.getElementById('Del3');
let Delete4 = document.getElementById('Del4');
let User1 = document.getElementById('but1');
let User2 = document.getElementById('but2');
let User3 = document.getElementById('but3');
let User4 = document.getElementById('but4');
Delete1.addEventListener('click', () => {
    if(Delete1.innerHTML=='Delete'){
        DeleteUser(1);
    }
    else{
        let AddUser1 = prompt("กรอกชื่อ :");
        CreateUser(AddUser1,1);
    }
});
Delete2.addEventListener('click', () => {
    if(Delete2.innerHTML=='Delete'){
        DeleteUser(2);
    }
    else{
        let AddUser2 = prompt("กรอกชื่อ :");
        CreateUser(AddUser2,2);
    }
});
Delete3.addEventListener('click', () => {
    if(Delete3.innerHTML=='Delete'){
        DeleteUser(3);
    }
    else{
        let AddUser3 = prompt("กรอกชื่อ :");
        CreateUser(AddUser3,3);
    }
});
Delete4.addEventListener('click', () => {
    if(Delete4.innerHTML=='Delete'){
        DeleteUser(4);
    }
    else{
        let AddUser4 = prompt("กรอกชื่อ :");
        CreateUser(AddUser4,4);
    }
});

function CreateUser(NName,NumUser) {
    let textt = "http://192.168.1.8:55554/tree/changenickname/" + 'user' + NumUser +'/' + NName;
    fetch(textt,{
        method: "PATCH",
        headers: {
			"Content-Type": "application/json"},
    })
		.then(response => response.json())
		.then(response => response.result)
		.then((datas) => {
            console.log(datas)
            let textt = '<a class="button1" href="tree.html">'+NName+'</a>';
            if(NumUser==1){
                User1.innerHTML = textt;
                Delete1.innerHTML = 'Delete';
            }
            else if(NumUser==2){
                User2.innerHTML = textt;
                Delete2.innerHTML = 'Delete';
        }
            else if(NumUser==3){
                User3.innerHTML = textt;
                Delete3.innerHTML = 'Delete';
            }
            else if(NumUser==4){
                User4.innerHTML = textt;
                Delete4.innerHTML = 'Delete';
            }
            })
        }
function DeleteUser(NumUser) {
    let textt = "http://192.168.1.8:55554/tree/reset/" + 'user' + NumUser;
    fetch(textt,{
        method: "PATCH",
        headers: {
			"Content-Type": "application/json"},
    })
		.then(response => response.json())
		.then(response => response.result)
		.then((datas) => {
            console.log(datas)
            if(NumUser==1){
                User1.innerHTML = 'user1';
                Delete1.innerHTML = 'Add';
            }
            else if(NumUser==2){
                User2.innerHTML = 'user2';
                Delete2.innerHTML = 'Add';
            }
            else if(NumUser==3){
                User3.innerHTML = 'user3';
                Delete3.innerHTML = 'Add';
            }
            else if(NumUser==4){
                User4.innerHTML = 'user4';
                Delete4.innerHTML = 'Add';
            }
        })
    }
var jsonTree;
let defName=[];
let nickn=[];
let Tree = document.getElementById("but1");

function GetUpdate() {
fetch(" http://192.168.1.8:55554/tree/list",{
        method: "GET",
        headers: {
			"Content-Type": "application/json"},
    })
		.then(response => response.json())
		.then(response => response.result)
		.then((datas) => {
            console.log(datas)
            let i=0;
            datas.forEach((data) => {
                console.log(data.nickname);
                nickn.push(data.nickname);
                defName.push(data.name);
                /*console.log("a: "+nickn[0]+" b: "+defName[0]);*/
                if(defName[i]=="user1"){
                        if(nickn[i]==defName[i]){
                            User1.innerHTML = "user1";
                            Delete1.innerHTML = 'Add';
                        }
                        else{
                            User1.innerHTML = '<a class="button1" href="tree.html">' + nickn[i] + '</a>';
                            Delete1.innerHTML = 'Delete';
                        }
                    }
                else if(defName[i]=="user2"){
                        if(nickn[i]==defName[i]){
                            User2.innerHTML = "user2";
                            Delete2.innerHTML = 'Add';
                        }
                        else{
                            User2.innerHTML = '<a class="button1" href="tree.html">' + nickn[i] + '</a>';
                            Delete2.innerHTML = 'Delete';
                        }
                    }
                else if(defName[i]=="user3"){
                        if(nickn[i]==defName[i]){
                            User3.innerHTML = "user3";
                            Delete3.innerHTML = 'Add';
                        }
                        else{
                            User3.innerHTML = '<a class="button1" href="tree.html">' + nickn[i] + '</a>';
                            Delete3.innerHTML = 'Delete';
                        }
                    }
                else if(defName[i]=="user4"){
                        if(nickn[i]==defName[i]){
                            User4.innerHTML = "user4";
                            Delete4.innerHTML = 'Add';
                        }
                        else{
                            User4.innerHTML = '<a class="button1" href="tree.html">' + nickn[i] + '</a>';
                            Delete4.innerHTML = 'Delete';
                        }
                    }
                i++;
            })
        }
	);
}
GetUpdate();
/*setTimeout(GetUpdate, 3000);*/