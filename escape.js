import Inventory from './inventory.js';
import Events from './Events.js';
import Items from './Items.js';
// 매서드 및 변수들을 먼저 선언 후
// 값은 나중에 지정됨.
export default class Escape{ 
  constructor(){
    this.$overlay = document.querySelector(".overlay")
    this.canvas = document.querySelector("#mainCanvas");  //메인 캔버스
    this.ctx = this.canvas.getContext("2d");              //메인 캔버스 컨텍스트
    this.$Lightswitch = document.querySelector(".switch");//전등스위치
    this.$msgBox = document.querySelector(".msgbox")      //메세지 박스
    
    this.light = false;       //전등 on,off
    this.finish = false;      //탈출 성공 여부
    this.darkInterval = null; //어두움 인터벌
    this.msgTimeOut=null;     //메세지 타임아웃
    this.autoSave=null;       //오토세이브 인터벌
    
    
    this.Inventory = new Inventory(this.ctx);    //인벤토리 클래스
    this.items = new Items(this.ctx);          //아이템 클래스
    this.events = new Events(this.ctx); //이벤트 클래스

    this.stageLevel = [{level:0,element:this.$Lightswitch},{level:1,element:this.items.$firstkey},{level:2,element:this.events.$box},{level:3,element:this.events.$bookshelf},{level:4,element:this.items.$lastKey}];
    this.level = this.stageLevel[0];
    this.isObj = {
      light : false,
      finish : false,
      level : this.stageLevel[0]
    }
    
    
    this.load();
    this.init();
    // this.hint();
  }
  
  load(){
    this.loadData(this.level,"Escape_Level");
    this.loadData(this.light,"Escape_light");
    this.loadData(this.Inventory.itemArr,"Escape_Inventory");
  }

  loadData(thisname,data){
    const dataName = JSON.parse(localStorage.getItem(data))
    if(dataName != undefined){
      thisname = dataName;
    };
  }
  
  init(){
    // doorLockEvent가 트루면 레벨 4
    if(this.events.doorLockEvent(this.Inventory,this.isObj,this.$overlay)){
      this.level = this.stageLevel[4];
      this.events.level = this.stageLevel[4];
    }

    //전등 스위치 on,off 레벨 1
    this.$Lightswitch.addEventListener("click",()=>{
      if(this.level.level < 1){
        this.level = this.stageLevel[1];
        this.events.level = this.stageLevel[1];
      }
      if(this.light){
        //불끄기
        this.lightTurnOff();
        this.light = !this.light;
        this.events.light = !this.events.light;
      }else{
        // 불 켜기
        this.lightTurnON();
        this.light = !this.light;
        this.events.light = !this.events.light;
        this.events.$rock.style.cursor = "url('./img/icons8-hammer-30.png'),auto";
      };
    });

    //아이템 얻기(열쇠 레벨2)
    this.getItem();

    // 바위게임
    this.events.rockEvent(this.$overlay,this.level.level)

    // 보물상자 레벨 3
    if(this.events.boxEvent(this.$overlay, this.Inventory))this.level = this.stageLevel[3];

    // 액자
    this.events.frameEvent(this.$overlay,this.level.level);
    // 액자게임
    this.events.keyEvaent(this.Inventory,this.$overlay,this.items);

    // 책장
    this.events.bookShelfEvent(this.$overlay);
    // 책장 첫 번째 칸 오픈하기
    this.events.openSetion(this.Inventory);
    // 책장 문제
    this.events.inBookShelfEvent(this.items);

    // 라스트 도어
    this.events.lastDoorEvent(this.$overlay);
    // gameOver
    this.events.$Exit.addEventListener("click",()=>{
      if(this.level.level >= 4)return;
      this.finish=true;
        alert("탈출");
    })
    
    // X버튼
    this.events.xButtunEvent(this.Inventory, this.$overlay);

    //아이템 사용
    this.Inventory.useItem(this.events, this.$overlay)

    
    //마우스위치 후레쉬
    document.addEventListener("mousemove",e=>{
      if(this.light)return;
      this.lightTurnOff();
      const width = document.documentElement.clientWidth >1280?((document.documentElement.clientWidth - 1280) / 2):0
      // const height = document.documentElement.clientHeight
      let x = e.pageX - 50 - width - (e.pageX / 20);
      let y = e.pageY - 50 - 100 - (e.pageY / 10);
      this.ctx.clearRect(x,y,100,100);
    });
    
    
    // 자동저장
    this.autoSave = setInterval(()=>{
      const saveLevel = JSON.stringify(this.level);
      const saveLight = JSON.stringify(this.light);
      localStorage.setItem("Escape_Level",saveLevel);
      localStorage.setItem("Escape_light",saveLight);
    },5000);
    
    // light가 true면 불켜기 false면 불 끄기
    if(this.light){
      this.lightTurnON();
    }else{
      this.lightTurnOff();
    }
  }
  
  //아이템 획득
  getItem(){
    let name = null;
    this.items.$items.addEventListener("click",e=>{
      if(!this.light)return;
      name = this.Inventory.moveToSlotItem(e.target);
      if(name === 'firstKey'){
        // this.finish=true; //테스트용
        this.showMsg(`열쇠를 획득했습니다.`);
        // this.level = this.stageLevel[3];
      }else if(name === 'paper'){
        this.showMsg(`종이를 획득했습니다.`);
        // this.level = this.stageLevel[3];
      }

    });
  }
  
  //불 켜기
  lightTurnON(){
    this.items.$items.classList.add("on")
    this.events.$events.classList.add("on")
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
  //불 끄기
  lightTurnOff(){
    this.items.$items.classList.remove("on")
    this.events.$events.classList.remove("on")
    this.ctx.beginPath();
    this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle="#000000";
    this.ctx.fill();
    this.ctx.closePath();
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
    // setInterval(()=>{
      // this.showMsg(`${this.$Lightswitch} 번 힌트`)
      // this.level.element.classList.add("hint");
      setTimeout(()=>{
        // if(this.level.level ==0)
        if(!this.light){
          this.$Lightswitch.classList.add("hint");
          setTimeout(()=>this.level.element.classList.remove("hint"),8000)
        }
        },40000);
        // },60000 * 2);
    // }, 2000);
  };

}
