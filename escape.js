import Inventory from './inventory.js';

class Escape{
constructor(){
  this.canvas = document.querySelector("#mainCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.overlay = document.querySelector(".overlay");
  this.$Lightswitch = document.querySelector("#switch");
  this.$events = document.querySelector(".events");
  this.$items = document.querySelector(".items");
  this.$msgBox = document.querySelector(".msgbox")
  this.Inventory=new Inventory();
  this.light = false;
  this.darkInterval = null;
  this.msgTimeOut=null;
  this.x = 0;
  this.y = 0;

  this.$items.addEventListener("click",e=>{
    this.Inventory.getItem(e.target);
    const name = e.target.getAttribute("data-name")
    this.showMsg(`${name}을 획득했습니다.`)
  })

  this.Inventory.inventory.addEventListener("click",e=>{
    console.log(e.target);
    console.log();
  })

  document.addEventListener("mousemove",e=>{
    if(this.light)return;
    this.ctx.beginPath();
    this.ctx.rect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle="#000000bf";
    this.ctx.fill();
    this.ctx.closePath();
    const x = (e.clientX) - 50 - ((document.documentElement.clientWidth - 1280) / 2);
    const y = (e.clientY) - 50 - 130;
    this.ctx.clearRect(x,y,100,100);
  });
  
  this.$Lightswitch.addEventListener("click",()=>{
    if(this.light){
      this.overlay.classList.remove("on")
      this.$items.classList.remove("on")
      this.$events.classList.remove("on")
      this.light = !this.light
    }else{
      this.overlay.classList.add("on")
      this.$items.classList.add("on")
      this.$events.classList.add("on")
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.light = !this.light
    };
  });

  }
  showMsg(msg){
    clearTimeout(this.msgTimeOut);
    this.$msgBox.textContent=msg;
    this.$msgBox.classList.add("on");
    this.msgTimeOut = setTimeout(()=>{
      this.$msgBox.classList.remove("on");
    },2000)
  }

}

let game = new Escape();


