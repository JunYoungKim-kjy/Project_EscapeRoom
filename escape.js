import Inventory from './inventory.js';
import Events from './Events.js';
import Items from './Items.js';

class Escape{ 
  constructor(){
    this.$overlay = document.querySelector(".overlay")
    this.canvas = document.querySelector("#mainCanvas");  //메인 캔버스
    this.ctx = this.canvas.getContext("2d");              //메인 캔버스 컨텍스트
    this.overlay = document.querySelector(".overlay");    //오버레이
    this.$Lightswitch = document.querySelector("#switch");//전등스위치
    this.$msgBox = document.querySelector(".msgbox")      //메세지 박스
    this.$Xbtn = document.querySelector(".Xbtn")          //X버튼
    this.Inventory=new Inventory();    //인벤토리 클래스
    this.items = new Items();          //아이템 클래스
    this.events = new Events();        //이벤트 클래스
    this.light = false;       //전등 on,off
    this.darkInterval = null; //어두움 인터벌
    this.msgTimeOut=null;     //메세지 타임아웃
    this.autoSave=null;       //오토세이브 인터벌
    
    this.stageLevel = [{level:0,element:this.$Lightswitch},{level:1,element:this.items.$firstkey},{level:2,element:this.events.$box},{level:3,element:null},{level:4,element:null}];
    this.level = this.stageLevel[0];
    
    
    this.load();
    this.init();
    this.hint();
  }
  
  load(){
    this.loadData(this.level,"Escape_Level");
    this.loadData(this.light,"Escape_light");
    this.loadData(this.Inventory.itemArr,"Escape_Inventory");
    //처음 화면 지워주기
    
    // this.loadData(this.items.itemArr,"Escape_Item");
    // const level = JSON.parse(localStorage.getItem("Escape_Level"));
    // if(level && level != ''){
    //   this.level = level;
    // }
  }

  loadData(thisname,data){
    const dataName = JSON.parse(localStorage.getItem(data))
    if(dataName != undefined){
      thisname = dataName;
    };
  }
  
  init(){
    // X버튼 클릭시 event종료
    this.$Xbtn.addEventListener("click",e=>{
      this.events.closeEvent();
      this.$Xbtn.classList.remove('on');
      this.$overlay.classList.remove('on');
    })

    // 인벤토리 아이템 사용
    this.Inventory.inventory.addEventListener("click",e=>{
      // if(e.target.parentElement.getAttribute("data-id") === 'btn')return;
      const dataName = e.target.parentElement.getAttribute("data-name");
      if(!dataName)return;
      const activeitem = this.Inventory.activeItem(e.target.parentElement);
      console.log(activeitem);
      if(activeitem==='paper'){
        this.actionEvent(this.events.$openPaper);
      }

    });

    // 상자 열기 및 종이 획득
    this.events.$box.addEventListener("click",e=>{
      if(!this.light)return;
      if(this.events.isOpenBox){
        this.actionEvent(this.events.$inBox);
        this.events.$inBox.addEventListener("click",e=>{
          this.getItem(e.target);
        })
        if(this.level.level < 3){
          this.level=this.stageLevel[3];
        }
      }else{
        if(this.Inventory.activeitem != 'firstKey'){
          alert("열 수 있을거 같은데..")
          return;
        }else{
          alert("열렸다...!")
          this.events.isOpenBox = true;
        };
      };
    });
    
    //열쇠 획득
    this.items.$items.addEventListener("click",e=>{
      if(!this.light)return;
        this.getItem(e.target);
      if(name=='firstKey'){
        this.level = this.stageLevel[2];
      }
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
    
    this.autoSave = setInterval(()=>{
      const saveLevel = JSON.stringify(this.level);
      const saveLight = JSON.stringify(this.light);
      localStorage.setItem("Escape_Level",saveLevel);
      localStorage.setItem("Escape_light",saveLight);
    },500);
    
    // light가 true면 불켜기 false면 불 끄기
    if(this.light){
      this.lightTurnON();
    }else{
      this.lightTurnOff();
    }
    
  }
  // 이벤트열기
  actionEvent(event){
    this.$overlay.classList.add("on");
    event.classList.add("action");
    this.$Xbtn.classList.add('on');
  }
  // 아이템 얻기
  getItem(target){
    const targetElement = target.parentElement;
    if(!targetElement.getAttribute("data-name"))return;
    this.Inventory.getItem(targetElement);
    const name = targetElement.getAttribute("data-name");
    this.showMsg(`${name}을 획득했습니다.`);
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
    this.ctx.fillStyle="#000000";
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
    //레벨별 힌트
    setInterval(()=>{
        this.showMsg(`${this.level.level+1} 번 힌트`)
        this.level.element.classList.add("hint");
        setTimeout(()=>this.level.element.classList.remove("hint"),5000)
        },60000 * 5);
    // }, 20000);
  };

}

let game = new Escape();


