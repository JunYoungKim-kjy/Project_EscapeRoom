import Inventory from './inventory.js';
import Events from './Events.js';
import Items from './Items.js';

class Escape{ 
  constructor(){
    this.canvas = document.querySelector("#mainCanvas");  //메인 캔버스
    this.ctx = this.canvas.getContext("2d");              //메인 캔버스 컨텍스트
    this.overlay = document.querySelector(".overlay");    //오버레이
    this.$Lightswitch = document.querySelector("#switch");//전등스위치
    this.$msgBox = document.querySelector(".msgbox")      //메세지 박스
    this.Inventory=new Inventory();    //인벤토리 클래스
    this.items = new Items();          //아이템 클래스
    this.events = new Events();       
    this.light = false;       //전등 on,off
    this.darkInterval = null; //어두움 인터벌
    this.msgTimeOut=null;     //메세지 타임아웃
    this.autoSave=null;       //오토세이브 인터벌
    
    this.stageLevel = [{level:0,hintTime:1000 * 60},{level:1,hintTime:1000 * 120},{level:2,hintTime: 1000 * 180 },{level:3,hintTime:1000 * 240},{level:4,hintTime:1000 * 300}];
    this.level = this.stageLevel[0];


    this.load();

    this.init();
    this.hint();
  }
  load(){
    this.loadData(this.level,"Escape_Level");
    this.loadData(this.light,"Escape_light");
    // this.loadData(this.Inventory.itemArr,"Escape_Inventory");
    // this.loadData(this.items.itemArr,"Escape_Item");
    // const level = JSON.parse(localStorage.getItem("Escape_Level"));
    // if(level && level != ''){
    //   this.level = level;
    // }
  }

  loadData(name,data){
    const dataName = JSON.parse(localStorage.getItem(data))
    if(dataName && dataName != ''){
      name = data;
    };
  }
  
  init(){
    if(this.light){
      this.lightTurnON();
    }
    
    this.Inventory.inventory.addEventListener("click",e=>{
      console.log(e.target);
      console.log();
    });

    //아이템 획득
    this.items.$items.addEventListener("click",e=>{
      if(!this.light)return;
      this.Inventory.getItem(e.target);
      const name = e.target.getAttribute("data-name")
      this.showMsg(`${name}을 획득했습니다.`)
    });

    //마우스위치 후레쉬
    document.addEventListener("mousemove",e=>{
      if(this.light)return;
      this.lightTurnOff();
      const x = (e.clientX) - 50 - ((document.documentElement.clientWidth - 1280) / 2);
      const y = (e.clientY) - 50 - 130;
      this.ctx.clearRect(x,y,100,100);
    });

    //전등 스위치 on,off
    this.$Lightswitch.addEventListener("click",()=>{
      if(this.level.level < 1){
        this.level = this.stageLevel[1];
      }
      if(this.light){
        //불끄기
        this.lightTurnOff();
        this.light = !this.light
      }else{
        this.lightTurnON();
        this.light = !this.light
      };
    });

    //처음 화면 지워주기
    this.lightTurnOff();

    this.autoSave = setInterval(()=>{
      const saveLevel = JSON.stringify(this.level);
      const saveLight = JSON.stringify(this.light);
      localStorage.setItem("Escape_Level",saveLevel)
      localStorage.setItem("Escape_light",saveLight)
    },3000)
  
    

  }
  //불 켜기
  lightTurnON(){
    // this.overlay.classList.add("on")
    this.items.$items.classList.add("on")
    this.events.$events.classList.add("on")
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
  //불 끄기
  lightTurnOff(){
    this.ctx.beginPath();
    this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle="#000000ff";
    this.ctx.fill();
    this.ctx.closePath();
    // this.overlay.classList.remove("on")
    this.items.$items.classList.remove("on")
    this.events.$events.classList.remove("on")
  }
  // 메세지박스 메서드
  showMsg(msg){
    clearTimeout(this.msgTimeOut);
    this.$msgBox.textContent=msg;
    this.$msgBox.classList.add("on");
    this.msgTimeOut = setTimeout(()=>{
      this.$msgBox.classList.remove("on");
    },2000)
  };

  hint(){
    //0레벨 힌트

    setTimeout(()=>{
      console.log(this.level);
      if(this.level.level == 0){
        this.showMsg("2분경과!! 첫번째 힌트")
        this.$Lightswitch.classList.add("hint");
        setTimeout(()=>this.$Lightswitch.classList.remove("hint"),5000)
      }
    }, 2000)
  };

  
}

let game = new Escape();


