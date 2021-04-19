
var jsonTree;
let todayy=0;
let score=0;
let TreeNow='';
let DDay=0;
let phaseT=0;
let defName=[];
let nickn=[];
let NameN = document.getElementById('NameNow');
let Score = document.getElementById('Score');
let DayN = document.getElementById('DayNow');
let Typetree = document.getElementById('Type');
let T1 = document.getElementById('Today1');
let T2 = document.getElementById('Today2');

function ChangePhase(NumUser){
    let textt = "http://192.168.1.8:55554/tree/changephase/user"+ NumUser;
fetch(textt,{
    method: "PATCH",
    headers: {
        "Content-Type": "application/json"},
})
    .then(response => response.json())
    .then(response => response.result)
    .then((datas) => {
        console.log(datas)
    })
}

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
                            DDay=data.day;
                            score=data.alltime;
                            todayy=data.today;
                            phaseT=data.activephase;
                            TreeNow+=data.activetree;
                            console.log("a: "+nickn[i]+" c: "+DDay);
                            Score.innerHTML = 'Score : ' + score;
                            DayN.innerHTML = 'Day ' + DDay;
                            Typetree.innerHTML = TreeNow;
                            T1.innerHTML = 'วันนี้คุณล้างมือไปแล้ว '+todayy+' ครั้ง';
                            if(todayy<10){
                                let Count= 10-todayy;
                                T2.innerHTML = 'ล้างมืออีก '+ Count +' ครั้งเพื่อให้ต้นไม้โตขึ้น!';
                            }
                            else{
                                T2.innerHTML = 'ทำได้ดีมาก! พรุ่งนี้ก็ขอแบบนี้นะ!';
                            }
                            console.log("a: "+phaseT+" b: "+todayy);
                            if(phaseT===1 && todayy===4){
                                ChangePhase(1);
                            }
                            else if(phaseT===2 && todayy===8){
                                ChangePhase(1);
                            }
                        }
                    i++;
                })
            }
        );
    }
GetUpdate();
for(let i=0;i<10;i++){
    setTimeout(GetUpdate, 3000);
}
